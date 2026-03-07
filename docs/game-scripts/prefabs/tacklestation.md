---
id: tacklestation
title: Tacklestation
description: A crafting station prefab that enables players to learn and prototype fishing-related blueprints; it supports state persistence, burning, haunting, and loot generation.
tags: [crafting, fishing, structure, loot, hauntable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f6efa7d5
system_scope: crafting
---

# Tacklestation

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `tacklestation` is a stationary, craftable structure that functions as a dedicated prototyping and recipe storage device for fishing-related items. It leverages multiple components—`craftingstation`, `prototyper`, `lootdropper`, `workable`, `burnable`, and `hauntable`—to manage its core behaviors: learning new tackle sketches, prototype tree management, destruction feedback, and environmental interactions (e.g., burning and haunting). It uses a dedicated state (`_activetask`) to prevent overlapping animations/sounds during use.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddNetwork()

inst:AddComponent("craftingstation")
inst:AddComponent("prototyper")
inst.components.prototyper.trees = TUNING.PROTOTYPER_TREES.FISHING

inst:AddComponent("lootdropper")
inst:AddComponent("workable")
inst:AddComponent("burnable")
inst:AddComponent("hauntable")
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `craftingstation`, `prototyper`, `burnable`, `hauntable`, `inspectable`  
**Tags:** Adds `structure`, `tacklestation`, `prototyper`  
**Tags checked:** `burnt` (during haunting, burning, and hammering), `prototyper` (animation state)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_activetask` | `GScriptTask` or `nil` | `nil` | Tracks the pending animation/sound task to prevent overlap; cleared on completion. |
| `_soundtasks` | `table` | `{}` | Local table to manage scheduled sound tasks (not used beyond initialization). |

## Main functions
### `DropTackleSketches(inst)`
* **Description:** Drops all currently known tackle sketches as loot entities directly at the tackle station’s position.
* **Parameters:** `inst` (entity) — the tackle station instance.
* **Returns:** Nothing.
* **Error states:** None; assumes `craftingstation:GetItems()` returns a valid list.

### `onbuilt(inst)`
* **Description:** Plays the "place" animation, then loops the "idle" animation, and emits the build sound.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `onhammered(inst, worker)`
* **Description:** Handles hammering: drops loot (including tackle sketches), spawns a small collapse FX, and removes the entity.
* **Parameters:**  
  * `inst` (entity) — the tackle station.  
  * `worker` (entity) — the entity performing the hammer action.  
* **Returns:** Nothing.

### `onhit(inst)`
* **Description:** Plays the "hit" animation; resumes loop or idle animation based on whether the prototyper is active.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `onturnon(inst)`
* **Description:** Activates idle state: plays "proximity_loop" animation and starts the idle loop sound if no active task is in progress.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `onturnoff(inst)`
* **Description:** Ends idle state: plays "idle" animation and stops the idle sound if no active task is in progress.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `doneact(inst)`
* **Description:** Cleanup callback for the active task; resets `_activetask` and restores appropriate animation/sound based on prototyper state.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `onuse(inst, hasfx)`
* **Description:** Triggers use action: plays "use" animation, emits the use sound, cancels any pending task, and schedules `doneact` to run after animation completes.
* **Parameters:**  
  * `inst` (entity).  
  * `hasfx` (boolean) — unused in this function.  
* **Returns:** Nothing.

### `onactivate(inst)`
* **Description:** Wrapper for `onuse(inst, true)`, used by the prototyper when activated.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `onlearnednewtacklesketch(inst)`
* **Description:** Responds to learning a new tackle sketch: plays "receive_item" animation and emits sound, then restores loop/idle state based on prototyper.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `OnHaunt(inst, haunter)`
* **Description:** Handles haunting: triggers `onuse` if not burnt and prototyper is on; otherwise launches the haunter. Sets haunt value to `TUNING.HAUNT_TINY`.
* **Parameters:**  
  * `inst` (entity).  
  * `haunter` (entity).  
* **Returns:** `true` (always successful haunt).  
* **Error states:** Returns early without haunter effect if entity is burnt or prototyper is off.

### `onburnt(inst)`
* **Description:** Drops tackle sketches, clears known recipes, and applies default burnt structure behavior.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `onsave(inst, data)`
* **Description:** Stores burn state in the `data.burnt` boolean if the entity is currently burning or burnt.
* **Parameters:**  
  * `inst` (entity).  
  * `data` (table) — save data table.  
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Applies burnt state on load if saved `data.burnt` is true and burnable component exists.
* **Parameters:**  
  * `inst` (entity).  
  * `data` (table or `nil`) — loaded data.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  * `onlearnednewtacklesketch` → triggers `onlearnednewtacklesketch` handler.  
  * `onbuilt` → triggers `onbuilt` handler.  
- **Pushes:**  
  * `onturnon` (via `inst:PushEvent`) — fired when turning on and no active task is pending.  
  * `onturnoff` (via `inst:PushEvent`) — fired when turning off and no active task is pending.