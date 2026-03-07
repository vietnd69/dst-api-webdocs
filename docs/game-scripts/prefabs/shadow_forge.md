---
id: shadow_forge
title: Shadow Forge
description: A structure component that functions as a prototype device for crafting shadow-based recipes, supporting activation, work interactions via hammering, and loot dropping upon destruction.
tags: [crafting, structure, workable, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6b1c362f
system_scope: crafting
---

# Shadow Forge

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shadow_forge` is a crafted structure prefab that enables prototype crafting (via the `prototyper` component) and accepts hammer-based interaction (`workable` component). It supports activation (turning on/off) with associated animation and sound logic, drops recipe components when hammered to completion, and handles post-build initialization. It integrates with the `lootdropper` component to manage dropped items and works as part of the game’s world-building and crafting ecosystem.

## Usage example
The `shadow_forge` is typically instantiated as a prefab and placed in the world via its deployable kit. Its component behavior is triggered automatically through player interaction (e.g., hammering or activating) rather than direct manual calls. A minimal example of its internal setup (as defined in `fn()`) is shown below:

```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst:AddTag("structure")
inst:AddTag("shadow_forge")
inst:AddTag("prototyper")

local prototyper = inst:AddComponent("prototyper")
prototyper.onturnon = onturnon
prototyper.onturnoff = onturnoff
prototyper.onactivate = onactivate

inst:AddComponent("workable")
inst:AddComponent("lootdropper")
```

## Dependencies & tags
**Components used:** `prototyper`, `lootdropper`, `workable`, `hauntable`, `inspectable`, `burnable` (via `MakeSnowCoveredPristine` and `MakeSnowCovered`), `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`  
**Tags:** Adds `structure`, `shadow_forge`, `prototyper`; checks `burnt`, `structure`, `hive` (via `lootdropper` logic)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_activecount` | number | `0` | Tracks how many active interactions are in progress; incremented on activation and decremented after a delay. |
| `_activetask` | Task | `nil` | Reference to the delayed task that resets state after an activation animation completes. |

## Main functions
### `on_finished_hammering(inst, worker)`
*   **Description:** Called when hammering is complete; drops loot using the `lootdropper`, spawns a small collapse FX, and removes the entity from the world.
*   **Parameters:**  
    `inst` (Entity) — the `shadow_forge` instance.  
    `worker` (Entity) — the player/entity that performed the hammering.
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Handles hammer hit feedback animation. Plays "hit_open" or "hit_close" depending on whether the forge is currently active (`prototyper.on`).
*   **Parameters:**  
    `inst` (Entity) — the `shadow_forge` instance.  
    `worker` (Entity) — the player/entity that hit the forge.
*   **Returns:** Nothing.

### `onturnon(inst)`
*   **Description:** Plays the activation sequence when the forge is turned on — prepares and queues animations (`proximity_pre` → `proximity_loop`) and starts looping sound if not already playing.
*   **Parameters:** `inst` (Entity) — the `shadow_forge` instance.
*   **Returns:** Nothing.

### `onturnoff(inst)`
*   **Description:** Plays the deactivation sequence — queues "proximity_pst" → "idle" animations, plays ending sound, and stops the looping sound.
*   **Parameters:** `inst` (Entity) — the `shadow_forge` instance.
*   **Returns:** Nothing.

### `onactivate(inst)`
*   **Description:** Triggered on user interaction (e.g., clicking the forge). Plays "use" animation and sound, increments `_activecount`, schedules `do_on_action`, and sets up a delayed task to call `done_action` after animation completes.
*   **Parameters:** `inst` (Entity) — the `shadow_forge` instance.
*   **Returns:** Nothing.

### `do_on_action(inst)`
*   **Description:** Decrements `_activecount`, but never below `0`. Used to track concurrent interactions.
*   **Parameters:** `inst` (Entity) — the `shadow_forge` instance.
*   **Returns:** Nothing.

### `done_action(inst)`
*   **Description:** Resets `_activetask` to `nil` and re-evaluates state (turn on/off) based on current `prototyper.on` status.
*   **Parameters:** `inst` (Entity) — the `shadow_forge` instance.
*   **Returns:** Nothing.

### `onbuilt(inst, data)`
*   **Description:** Called after the structure is built; plays "place" animation, queues "idle", and plays placement sound.
*   **Parameters:**  
    `inst` (Entity) — the `shadow_forge` instance.  
    `data` (table) — build data (unused).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `onbuilt` — triggers `onbuilt()` to handle initial animation/sound state after placement.  
- **Pushes:** None directly (events are handled via components — e.g., `lootdropper` fires `entity_droploot`, but this prefab does not push events itself).