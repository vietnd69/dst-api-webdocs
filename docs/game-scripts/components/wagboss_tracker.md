---
id: wagboss_tracker
title: Wagboss Tracker
description: Tracks whether the Wagboss boss entity has been defeated and notifies the world of changes.
tags: [boss, world, state, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 65686767
system_scope: world
---

# Wagboss Tracker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WagbossTracker` is a world-scoped component that records and persists the defeat state of the Wagboss boss. It maintains a single boolean flag (`wagboss_defeated`) and broadcasts updates to the entire game world via the `master_wagbossinfoupdate` event whenever the defeat state changes — for example, when the `wagboss_defeated` event is received or when component data is loaded from a save.

## Usage example
```lua
local inst = TheWorld
inst:AddComponent("wagboss_tracker")

-- Check if Wagboss is defeated
if inst.components.wagboss_tracker:IsWagbossDefeated() then
    print("Wagboss has been defeated.")
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `wagboss_defeated` | boolean | `false` | Whether the Wagboss has been defeated. |

## Main functions
### `IsWagbossDefeated()`
* **Description:** Returns the current defeat state of the Wagboss.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the Wagboss has been defeated, otherwise `false`.

### `OnWagbossDefeated()`
* **Description:** Sets the defeat state to `true` and broadcasts a world update event (`master_wagbossinfoupdate`) with the new state.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None — this function is only called in response to the `wagboss_defeated` event.

### `OnSave()`
* **Description:** serializes the component's state for saving.
* **Parameters:** None.
* **Returns:** `table` — a table containing `{ wagboss_defeated = self.wagboss_defeated }`.

### `OnLoad(data)`
* **Description:** Restores the component's state from saved data and re-broadcasts the current Wagboss defeat status.
* **Parameters:** `data` (table or `nil`) — data saved by `OnSave`, typically containing the `wagboss_defeated` boolean.
* **Returns:** Nothing.
* **Error states:** If `data` is `nil`, the function exits early without modifying state or emitting events.

## Events & listeners
- **Listens to:** `wagboss_defeated` — triggers `OnWagbossDefeated()` to record defeat and notify the world.
- **Pushes:** `master_wagbossinfoupdate` — fires with payload `{ isdefeated = boolean }` when defeat state changes or after load.
