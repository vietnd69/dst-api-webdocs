---
id: yotd_raceprizemanager
title: Yotd Raceprizemanager
description: Manages prize availability and checkpoint tracking for the Year of the Dog Rat Race event in DST.
tags: [event, yotd, prizes]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b3f66343
system_scope: world
---

# Yotd Raceprizemanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`yotd_raceprizemanager` is a server-only component responsible for tracking the number of prizes available and recording which checkpoints have been reached during the Year of the Dog (YOTD) Rat Race event. It integrates with the world's lifecycle by listening to `cycles` and emitting `yotd_ratraceprizechange` events when prize status changes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("yotd_raceprizemanager")
inst:ListenForEvent("yotd_ratraceprizechange", function() print("Prize status updated") end)

if inst.components.yotd_raceprizemanager:HasPrizeAvailable() then
    inst.components.yotd_raceprizemanager:PrizeGiven()
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `SimEntity` | — | The entity instance the component is attached to. |

## Main functions
### `HasPrizeAvailable()`
*   **Description:** Checks if at least one prize is currently available for claiming.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `_prize > 0`, otherwise `false`.

### `PrizeGiven()`
*   **Description:** Decrements the prize count and broadcasts a `yotd_ratraceprizechange` event. Must only be called on the master simulation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RegisterCheckpoint(checkpoint)`
*   **Description:** Records that a specific checkpoint has been reached (e.g., by name or ID), preventing duplicate registrations.
*   **Parameters:** `checkpoint` (any) — A unique identifier for the checkpoint.
*   **Returns:** Nothing.

### `UnregisterCheckpoint(checkpoint)`
*   **Description:** Removes a checkpoint from the recorded list.
*   **Parameters:** `checkpoint` (any) — The checkpoint identifier to remove.
*   **Returns:** Nothing.

### `GetCheckpoints()`
*   **Description:** Returns a shallow copy of the internal checkpoint registry table.
*   **Parameters:** None.
*   **Returns:** `table` — A new table containing keys for all registered checkpoints (values are `true`).

### `OnSave()`
*   **Description:** Prepares the component’s state for saving to disk.
*   **Parameters:** None.
*   **Returns:** `table` — `data = { prize = _prize }`.

### `LoadPostPass(ents, data)`
*   **Description:** Restores the prize count from saved data after world load.
*   **Parameters:**  
    `ents` (table) — Entity registry (unused in this implementation).  
    `data` (table?) — Saved component data, expected to contain `data.prize`.  
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted debug string for inspection.
*   **Parameters:** None.
*   **Returns:** `string` — `"prize:N"` where `N` is the current `_prize` count.

## Events & listeners
- **Listens to:** `cycles` — Triggered by `WatchWorldState` to re-evaluate prize availability based on the YOTD event status.
- **Pushes:** `yotd_ratraceprizechange` — Fired whenever `_prize` changes or when the event state is rechecked on load/cycle updates.
