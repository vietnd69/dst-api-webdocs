---
id: tributable
title: Tributable
description: Manages tribute collection, reward thresholds, and decay logic for an entity that can receive or reject offerings from other entities.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 5e926562
---

# Tributable

## Overview
The `Tributable` component enables an entity to accumulate tribute values from other entities, track when a reward threshold has been met, and automatically decay tribute over time if no new tribute is added. It supports persisting state via save/load hooks and triggering events during tribute acceptance or refusal.

## Dependencies & Tags
- **Component Dependencies**: None explicitly required on `inst` (but expects `inst.components.tributable` to exist and be accessible from `ondecay`).
- **Tags**: None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `currenttributevalue` | `number` | `0` | Current accumulated tribute value. |
| `rewardattributevalue` | `number` | `10` | Threshold value required to qualify for reward (used by `HasPendingReward`). |
| `numrewardsgiven` | `number` | `0` | Count of rewards that have been awarded. |
| `timegiventribute` | `number?` | `nil` | Timestamp of the last tribute acceptance (used for decay timing). |
| `decaycurrenttributetime` | `number` | `0` | Duration (in seconds) after which tribute decays to zero if no new tribute is added. |
| `decaytask` | `DSTask?` | `nil` | Handle to the active decay task (internal, not initialized in `_ctor` but used). |
| `ongivenrewardfn` | `function?` | `nil` | Optional callback executed after a reward is given (`OnGivenReward`). |

## Main Functions

### `HasPendingReward()`
* **Description:** Returns `true` if the current tribute value meets or exceeds the reward threshold (`rewardattributevalue`), indicating a reward is ready to be claimed.
* **Parameters:** None.

### `OnGivenReward()`
* **Description:** Resets tribute to zero, increments the reward count, cancels any pending decay task, and invokes the optional `ongivenrewardfn` callback (if set).  
* **Parameters:** None.

### `OnAccept(value, tributer)`
* **Description:** Accepts tribute from `tributer` by increasing `currenttributevalue` by `value`, fires the `"onaccepttribute"` event, and manages decay timing. If tribute was previously decaying, the decay task is reset with a fresh timer.  
* **Parameters:**  
  - `value` (`number`): The amount of tribute to add.  
  - `tributer` (`Entity`): The entity giving the tribute (unused internally but may be used by listeners).

### `OnRefuse()`
* **Description:** Fires the `"onrefusetribute"` event to notify listeners that a tribute offer was rejected.  
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the component’s state for persistence. Only includes fields with non-zero/non-`nil` values to reduce save size.  
* **Parameters:** None.  
* **Returns:**  
  `data` (`table`): A table containing `currenttributevalue`, `remainingdecaytime`, and `numrewardsgiven` (where applicable).

### `OnLoad(data)`
* **Description:** Restores the component’s state from saved data. Reinitializes decay task if needed.  
* **Parameters:**  
  - `data` (`table?`): The saved state table (may be `nil` on fresh loads).  

## Events & Listeners
- **Listens for:** None.
- **Triggers events:**  
  - `"onaccepttribute"` — Fired when tribute is accepted via `OnAccept`.  
  - `"onrefusetribute"` — Fired when tribute is refused via `OnRefuse`.