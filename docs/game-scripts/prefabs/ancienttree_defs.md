---
id: ancienttree_defs
title: Ancienttree Defs
description: Defines configurable parameters and behavior logic for ancient trees, including growth constraints, loot tables, and nightvision-specific fruit regen synced to day/night cycles.
tags: [world, environment, regen, audio]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f3f67ff8
system_scope: environment
---

# Ancienttree Defs

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`ancienttree_defs.lua` is a shared definition file that declares two global tables: `TREE_DEFS` and `PLANT_DATA`. `TREE_DEFS` holds configuration templates for different ancient tree variants (e.g., `gem`, `nightvision`), specifying visual, physical, and gameplay properties such as build names, grow constraints, loot tables, and sound assets. It also includes `common_postinit` and `master_postinit` callbacks for per-tree setup, especially for `nightvision` trees that dynamically manage fruit visibility based on time of day and world state (surface vs. cave). The `PLANT_DATA` table contains tuned constants for fruit regeneration timing.

The file does not define a new component but populates a shared data structure consumed by the game’s world generation and prefab initialization systems. Its primary interaction is with the `pickable` component, which it configures via callback overrides (`onregenfn`, `onpickedfn`, `makeemptyfn`) to implement time-of-day–sensitive fruit behavior.

## Usage example
This file is not instantiated as a component. Instead, it exports configuration tables used by the game engine to spawn prefabs. A typical usage inside a prefab file (`ancienttree_nightvision.lua`) would be:
```lua
local prefabs =
{
    "ancientfruit_nightvision",
}

local function common_postinit(inst)
    -- Standard setup code...
end

local function master_postinit(inst)
    -- Initialize pickable component...
    -- Apply tree definition overrides from TREE_DEFS.nightvision
    -- and attach nightvision-specific logic (handled by callbacks in ancienttree_defs.lua)
end

return Prefab("ancienttree_nightvision", common_postinit, master_postinit, prefabs)
```

## Dependencies & tags
**Components used:** `pickable` (via `inst.components.pickable`)
**Tags:** Adds `slurtlepickable` only for `gem` trees (`inst:AddTag("slurtlepickable")` in `common_postinit`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TREE_DEFS` | table | `{}` | Table of tree variants, each a table with keys like `build`, `GROW_CONSTRAINT`, `LOOT`, `sounds`, and `common_postinit`/`master_postinit` callbacks. |
| `PLANT_DATA` | table | `{}` | Contains global plant tuning, e.g., `fruit_regen` timing (`min`, `max` in seconds). |

## Main functions
### `NightVision_StartPhaseTransitionTask(inst, fn)`
*   **Description:** Cancels any existing phase transition task and schedules `fn` to run after a random delay of 1–3 seconds. Used to smoothly transition between fruit visibility states.
*   **Parameters:** `inst` (Entity) — the tree entity; `fn` (function) — the transition callback to invoke (e.g., `NightVision_ShowFruits` or `NightVision_HideFruits`).
*   **Returns:** Nothing.

### `NightVision_HideFruits(inst)`
*   **Description:** Initiates hiding the fruit layer on the tree, sets `caninteractwith` to `false`, and schedules a delayed call to `NightVision_HideFruitLayer` after the animation completes.
*   **Parameters:** `inst` (Entity) — the tree entity.
*   **Returns:** Nothing.
*   **Error states:** Early exit if `pickable` component is `nil` or fruits cannot be picked.

### `NightVision_ShowFruits(inst)`
*   **Description:** Shows the fruit layer, re-enables interaction (`caninteractwith = true`), updates ambience sound, and triggers fruit animation and sound if previously hidden.
*   **Parameters:** `inst` (Entity) — the tree entity.
*   **Returns:** Nothing.

### `NightVision_OnIsNight(inst, isnight, init)`
*   **Description:** Central handler for day/night state changes. Controls fruit appearance/disappearance based on world time and whether the tree is asleep. For surface worlds, listens to `isnight` world state; for caves, runs directly.
*   **Parameters:** `inst` (Entity) — the tree entity; `isnight` (boolean) — current night state; `init` (boolean) — whether called on initialization.
*   **Returns:** Nothing.

### `NightVision_OnPickedFn(inst, picker)`
*   **Description:** Called when fruits are harvested. Hides fruit layer and updates ambience to empty-tree sound.
*   **Parameters:** `inst` (Entity) — the tree entity; `picker` (Entity) — the entity that harvested the fruits.
*   **Returns:** Nothing.

### `NightVision_OnMakeEmptyFn(inst)`
*   **Description:** Called when fruits are emptied (e.g., regen interrupted). Mirrors the behavior of `OnPickedFn`: hides fruit, sets empty ambience.
*   **Parameters:** `inst` (Entity) — the tree entity.
*   **Returns:** Nothing.

### `NightVision_OnRegenFn(inst)`
*   **Description:** Handles fruit regen logic. Ensures fruits only regenerate during nighttime or in caves. Sets `caninteractwith = false` if not nighttime, otherwise shows fruits and plays animations/sounds.
*   **Parameters:** `inst` (Entity) — the tree entity.
*   **Returns:** Nothing.

### `_MakeEmpty(inst)`
*   **Description:** Utility wrapper to invoke `pickable:MakeEmpty()` if present, used to delay `MakeEmpty` execution until after regen state is settled.
*   **Parameters:** `inst` (Entity) — the tree entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `isnight` (via `inst:WatchWorldState("isnight", inst._OnIsNight)`) — triggers day/night transitions for `nightvision` trees.
- **Pushes:** None directly. Visual and audio changes happen internally via `AnimState` and `SoundEmitter` calls.
