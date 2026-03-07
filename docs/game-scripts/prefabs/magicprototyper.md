---
id: magicprototyper
title: Magicprototyper
description: Creates high-level prototyper prefabs (research labs) with specialized behavior, including on-built achievements, variable activation animations, and optional rabbit-spawning on hit.
tags: [crafting, achievement, environment, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c1425062
system_scope: crafting
---

# Magicprototyper

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`magicprototyper` is a prefab factory script that dynamically generates two high-tier prototyper prefabs—`researchlab3` and `researchlab4`—with distinct configurations. It sets up core components (`prototyper`, `lootdropper`, `workable`, `burnable`, `hauntable`) and integrates custom callbacks for construction (`onbuilt`), hammering (`onhammered`), and activation (`onactivate`, `onturnon`, `onturnoff`). It also supports level-specific logic such as achievement unlocking, optional rabbit spawning on hit, and different animation merging strategies.

## Usage example
```lua
-- Typical usage: generated internally by the game to create prefabs
local lab3_prefab = require "prefabs/magicprototyper"
-- The module returns three prefabs: lab3, lab4, and their respective placers.
-- In practice, modders should inspect or extend the returned prefabs instead of redefining them.
```

## Dependencies & tags
**Components used:** `inspectable`, `prototyper`, `lootdropper`, `workable`, `burnable`, `propagator`, `hauntable`, `soundemitter`, `animstate`, `minimapentity`, `transform`, `network`.  
**Tags added:** `structure`, `level3` (for lab3), `level4` (for lab4), `prototyper`.  
**Tags checked:** `burnt`, `magician`.

## Properties
No public properties are exposed by the returned prefabs or factory function. Internal state (`inst._activecount`, `inst._activetask`) is used only during runtime and is not part of the public API.

## Main functions
### `onhammered(inst, worker)`
*   **Description:** Handles hammering the prototyper. Extinguishes flames if burning, drops loot, spawns a `collapse_small` FX, and removes the entity.
*   **Parameters:**  
  `inst` (Entity) — the prototyper instance being hammered.  
  `worker` (Entity) — the entity performing the hammer action.
*   **Returns:** Nothing.
*   **Error states:** Uses `inst.components.burnable:IsBurning()` only if the `burnable` component exists; otherwise skips extinguish.

### `onhit(inst, worker)`
*   **Description:** Handles hit interactions during work. Plays the `"hit"` animation and queues either `"proximity_loop"` or `"idle"` depending on the prototyper's current on/off state and whether it's burnt.
*   **Parameters:**  
  `inst` (Entity) — the prototyper instance.  
  `worker` (Entity) — the worker entity.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `inst:HasTag("burnt")` is true.

### `spawnrabbits(inst, doer)`
*   **Description:** Attempts to spawn a rabbit upon hit, with chance modified by the `magician` tag.
*   **Parameters:**  
  `inst` (Entity) — the prototyper instance.  
  `doer` (Entity) — the entity triggering the spawn.
*   **Returns:** Nothing.
*   **Error states:** Only attempts spawn if not `burnt`, and success depends on luck roll via `TryLuckRoll`.

### `onactivate(inst, doer)`
*   **Description:** Called when the prototyper is activated (e.g., used by a player). Triggers animation, sound, and task scheduling for the prototyper sequence.
*   **Parameters:**  
  `inst` (Entity) — the prototyper instance.  
  `doer` (Entity) — the user activating the prototyper.
*   **Returns:** Nothing.
*   **Error states:** Returns early without effect if `inst:HasTag("burnt")`.

### `onbuilt(inst, data)`
*   **Description:** Callback executed after building. Plays build animation and sound, schedules delayed build sound, and awards player achievements for lab levels 3 and 4.
*   **Parameters:**  
  `inst` (Entity) — the newly built prototyper.  
  `data` (table) — build event data, includes `builder` reference.
*   **Returns:** Nothing.

### `donact(inst, soundprefix, onact, doer)`
*   **Description:** Internal callback for completion of the activation task. Plays completion sound and decrements active count; kills sound when count reaches zero.
*   **Parameters:**  
  `inst` (Entity) — the prototyper instance.  
  `soundprefix` (string) — sound variant (e.g., `"lvl3"`).  
  `onact` (function, optional) — custom activation callback passed during construction.  
  `doer` (Entity) — the activator.
*   **Returns:** Nothing.

### `onturnon(inst)` and `onturnoff(inst)`
*   **Description:** Internal callbacks used to start/stop prototyper idle animations and sounds. `onturnon` queues proximity animations; `onturnoff` queues post-animation and stops idle sound.
*   **Parameters:** `inst` (Entity) — the prototyper instance.
*   **Returns:** Nothing.
*   **Error states:** Only acts if `inst._activetask == nil` and not `burnt`.

## Events & listeners
- **Listens to:**  
  `onbuilt` — fired after the entity is fully constructed; triggers achievement unlock and sound.
- **Pushes:** None directly. Relies on component events (`prototyper`'s `onactivate`, `workable`'s callbacks) to signal actions.  
- **Callback hooks set on component instances:**  
  `inst.components.prototyper.onturnon`, `onturnoff`, `onactivate`  
  `inst.components.workable.onfinish`, `onwork`  
  `inst.OnSave`, `inst.OnLoad`
