---
id: boatrace_checkpoint
title: Boatrace Checkpoint
description: Acts as a raceway checkpoint in the Boatrace event, detecting approaching beacons, dispensing flags, handling hammering interactions, and managing lighting and state transitions during races.
tags: [event, environment, race, checkpoint, structure]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c9997f4d
system_scope: environment
---

# Boatrace Checkpoint

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`boatrace_checkpoint` is a prefabricated entity used in the Boatrace event. It serves as a designated marker along the racecourse where beacons are logged, flags are planted, and game state transitions occur. The prefab integrates with several components to support placement, interaction, proximity detection, and race lifecycle events. It registers itself with `yotd_raceprizemanager` to track progress and awards, and it dynamically manages lighting and animations based on its state (e.g., lit vs unlit during races).

## Usage example
```lua
-- Spawn a checkpoint and configure its start point
local checkpoint = SpawnPrefab("boatrace_checkpoint")
checkpoint.Transform:SetPosition(myposition)

-- Associate this checkpoint with a start point entity (e.g., for beacon tracking)
local startpoint = SpawnPrefab("boatrace_start")
checkpoint.components.entitytracker:TrackEntity("startpoint", startpoint)

-- Later, when the checkpoint is hit by a beacon:
checkpoint:PushEvent("boatrace_starttimerended") -- triggers proximity checking
checkpoint:PushEvent("boatrace_start") -- enables lights and disables workability
```

## Dependencies & tags
**Components used:**  
- `boatrace_proximitychecker`  
- `entitytracker`  
- `inspectable`  
- `lootdropper`  
- `workable`  

**Tags added:**  
- `boatracecheckpoint`  
- `boatrace_proximitychecker`  
- `structure`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_lights_on` | boolean | `false` | Tracks whether the checkpoint’s light and animations should be in “on” state (active during races). |
| `_found_beacons` | table | `{}` | Maps beacon instances to spawned flag prefabs; cleared on reset. |
| `flag_positions` | table | `{1,2,3,4,5,6,7,8}` | List of available flag slot IDs (1–8) for assigning unique ribbon placements; shuffled per spawn. |
| `ToggleLight` | function | `ToggleLight` | Public method: toggles the checkpoint’s light, sound loop, and animation state. |

## Main functions
### `ToggleLight(turn_on)`
* **Description:** Enables or disables the checkpoint’s lighting, sound loop (`fireloop`), and animation sequence (`idle_on`/`idle_off`). Used to switch between pre-race and race-active states.
* **Parameters:** `turn_on` (boolean) — `true` to activate light/sound/animations; `false` to deactivate.
* **Returns:** Nothing.
* **Error states:** None.

### `OnWork(inst, worker)`
* **Description:** Triggered when a player hits the checkpoint (e.g., hammering). Plays a short “hit” animation before returning to idle.
* **Parameters:** `inst` (The checkpoint entity). `worker` is not used.
* **Returns:** Nothing.
* **Error states:** Does nothing if the “place” animation is still playing.

### `OnWorkFinished(inst, worker)`
* **Description:** Called when hammering completes. Drops loot, spawns a collapse FX, and destroys the checkpoint.
* **Parameters:** `inst` (The checkpoint entity). `worker` is the player entity.
* **Returns:** Nothing.
* **Error states:** None.

### `OnBeaconAtCheckpoint(inst, beacon)`
* **Description:** Invoked when a beacon enters the checkpoint’s proximity. Assigns a ribbon flag to the beacon, notifies the beacon and start point via events, and updates animations.
* **Parameters:** `inst` (The checkpoint entity). `beacon` (Entity with `_index` property, typically `boatrace_beacon`).
* **Returns:** Nothing.
* **Error states:** Returns early if `beacon` is `nil`, already recorded, `startpoint` missing, or `startpoint._beacons` is `nil`.

### `OnRaceStartTimerEnd(inst)`
* **Description:** Called when the race start timer ends. Activates proximity checking via `boatrace_proximitychecker`.
* **Parameters:** `inst` (The checkpoint entity).
* **Returns:** Nothing.

### `OnRaceStarted(inst)`
* **Description:** Enables the checkpoint’s light, sets lighting override and animations to “on” state, and disables workability (no further hammering).
* **Parameters:** `inst` (The checkpoint entity).
* **Returns:** Nothing.

### `ResetCheckpoint(inst)`
* **Description:** Resets the checkpoint for reuse after a race ends: re-enables workability, turns off light/animation, and clears `found_beacons`.
* **Parameters:** `inst` (The checkpoint entity).
* **Returns:** Nothing.
* **Error states:** None.

### `OnRaceOver(inst)`
* **Description:** Clears the start point association and schedules a delayed `ResetCheckpoint`.
* **Parameters:** `inst` (The checkpoint entity).
* **Returns:** Nothing.

### `SetStartPoint(inst, startpoint)`
* **Description:** Assigns or removes the start point entity to/from this checkpoint’s tracker.
* **Parameters:** `inst` (The checkpoint entity). `startpoint` (Entity or `nil`) — if non-nil, tracks it under `"startpoint"`; otherwise forgets it.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onbuilt` → `OnBuilt` (initial placement setup)  
  - `boatrace_start` → `OnRaceStarted`  
  - `boatrace_starttimerended` → `OnRaceStartTimerEnd`  
  - `boatrace_finish` → `OnRaceOver`  
  - `onremove` → `Onremoved` (unregisters from prize manager)  

- **Pushes:**  
  - `checkpoint_found` — pushed on `beacon` when reached.  
  - `beacon_reached_checkpoint` — pushed on `startpoint` with `{beacon, checkpoint}` payload.  
  - `entity_droploot` — pushed via `lootdropper:DropLoot()`.  
