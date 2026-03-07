---
id: tributable
title: Tributable
description: Manages tribute accumulation, reward thresholds, and decay timing for entities capable of receiving or dispensing offerings.
tags: [trade, timer, state]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5e926562
system_scope: entity
---

# Tributable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Tributable` tracks tribute value accumulated toward a reward threshold, handles reward acceptance or refusal, and implements decay logic for unused tribute. It is designed for entities (e.g., altars, totems) that accept offerings and reward givers after a threshold is met. The component supports saving/loading and automatic decay of tribute if no additional tribute is added within a configured delay.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("tributable")

inst.components.tributable.decaycurrenttributetime = 60
inst.components.tributable.rewardattributevalue = 25

inst.components.tributable:OnAccept(10, giver_entity)
if inst.components.tributable:HasPendingReward() then
    inst.components.tributable:OnGivenReward()
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `currenttributevalue` | number | `0` | Current accumulated tribute value. |
| `rewardattributevalue` | number | `10` | Threshold required to trigger a pending reward. |
| `numrewardsgiven` | number | `0` | Total count of rewards dispensed. |
| `timegiventribute` | number? | `nil` | Unix timestamp of last tribute acceptance; used for decay calculation. |
| `decaycurrenttributetime` | number | `0` | Seconds after last tribute addition before tribute decays to zero. |
| `decaytask` | Task? | `nil` | Internal task managing the decay timer. |
| `ongivenrewardfn` | function? | `nil` | Optional callback invoked after a reward is given. |

## Main functions
### `GetDebugString()`
* **Description:** Returns a string for debugging UI or logs showing current tribute value.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"current tribute: <value>"`.

### `HasPendingReward()`
* **Description:** Checks whether the accumulated tribute meets or exceeds the reward threshold.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `currenttributevalue >= rewardattributevalue`, otherwise `false`.

### `OnGivenReward()`
* **Description:** Records a reward being given, resets tribute value, increments reward counter, cancels any pending decay, and invokes the optional callback `ongivenrewardfn`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnAccept(value, tributer)`
* **Description:** Adds tribute `value` to the current total, resets the decay timer if configured, and pushes the `onaccepttribute` event.
* **Parameters:**  
  - `value` (number) — amount of tribute to add.  
  - `tributer` (entity) — entity providing the tribute (currently unused internally but passed for context).  
* **Returns:** Nothing.  
* **Error states:** If decay time is positive and no reward is pending, a new decay task is scheduled.

### `OnRefuse()`
* **Description:** Notifies listeners that a tribute offer was refused; used when the receiver declines an offering.
* **Parameters:** None.
* **Returns:** Nothing.  
* **Pushes:** `onrefusetribute` event.

### `OnSave()`
* **Description:** Serializes component state for network or save-game persistence.
* **Parameters:** None.
* **Returns:** `table` — map containing:  
  - `currenttributevalue` (number or `nil`)  
  - `remainingdecaytime` (number or `nil`)  
  - `numrewardsgiven` (number or `nil`)  
  Values are omitted from the table if they are zero.

### `OnLoad(data)`
* **Description:** Restores component state from serialized `data`.
* **Parameters:**  
  - `data` (table?) — must conform to the structure returned by `OnSave()`. May be `nil`.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:**  
  - `onaccepttribute` — fired when tribute is accepted.  
  - `onrefusetribute` — fired when tribute is refused.
