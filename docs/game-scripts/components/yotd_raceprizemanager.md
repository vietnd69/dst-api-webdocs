---
id: yotd_raceprizemanager
title: Yotd Raceprizemanager
description: Manages the availability and distribution of a single prize for the Year of the Day (YOTD) rat race event in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
---

# Yotd Raceprizemanager

## Overview
This component manages a single YOTD rat race prize instance, including tracking prize availability, checkpoint registration, and saving/loading its state. It runs exclusively on the server (world master) and responds to world state changes to ensure the prize remains valid during the YOTD event.

## Dependencies & Tags
- Requires `TheWorld.ismastersim` — asserts it must only exist on the server.
- Uses `SPECIAL_EVENTS.YOTD` to conditionally enable prize availability.
- Registers a world state watcher for `"cycles"` via `inst:WatchWorldState`.
- Pushes the `"yotd_ratraceprizechange"` event to notify interested systems of prize state changes.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to (the race prize manager). |
| `_prize` | `number` | `1` | Internal count of available prizes (clamped to ≥1 during YOTD event). |
| `_checkpoints` | `table` | `{}` | Local set tracking registered checkpoint entities (keys are entities, values are `true`). |

*Note:* `_prize` and `_checkpoints` are private (local closure) variables; the component exposes functionality through public methods but does not expose them as direct fields.

## Main Functions
### `HasPrizeAvailable()`
* **Description:** Returns `true` if a prize is currently available (`_prize > 0`), otherwise `false`.
* **Parameters:** None.

### `PrizeGiven()`
* **Description:** Decrements the internal prize count by 1 and broadcasts `"yotd_ratraceprizechange"` to notify listeners of the updated state.
* **Parameters:** None.

### `RegisterCheckpoint(checkpoint)`
* **Description:** Registers a checkpoint entity (by reference) as part of the race path. Prevents duplicate entries.
* **Parameters:** `checkpoint` — Entity (typically a goal or marker) to register.

### `UnregisterCheckpoint(checkpoint)`
* **Description:** Removes a previously registered checkpoint from the internal list.
* **Parameters:** `checkpoint` — Entity to remove.

### `GetCheckpoints()`
* **Description:** Returns a shallow copy of the internal checkpoint table. Useful for iterating or inspecting registered checkpoints without modifying the original.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns a serializable data table containing `_prize` for world save persistence.
* **Parameters:** None.

### `LoadPostPass(ents, data)`
* **Description:** Restores `_prize` from saved `data` (if present) after world load and pushes `"yotd_ratraceprizechange"` to refresh UI or systems relying on prize status.
* **Parameters:**  
  - `ents` — Unused (reserved for entity mapping during load).  
  - `data` — Table containing `data.prize` (number) from the saved state.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string showing the current prize count (e.g., `"prize:1"`).
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `cycles` world state change (triggers `updateprize` handler).
- **Triggers:**
  - `"yotd_ratraceprizechange"` — broadcast via `TheWorld:PushEvent` after:
    - Prize initialization (if YOTD is inactive, prize set to 0).
    - Prize count adjustment (e.g., after `PrizeGiven`).
    - `updateprize` ensures `_prize` ≥ 1 when YOTD is active and updates it.

source_hash: b3f66343
---