---
id: moontree
title: Moontree
description: Manages the lifecycle, growth stages, burning, and harvesting of moon trees in DST.
tags: [plant, growth, burning, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 92000176
system_scope: environment
---

# Moontree

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moontree` prefab implements the full lifecycle of the Moon Tree, including growth from seed to three distinct height stages (short, normal, tall), interaction with fire (burning, extinguishing, burning-to-stump transitions), harvesting via chopping, and regrowth logic. It integrates with multiple components (`burnable`, `growable`, `workable`, `lootdropper`, `plantregrowth`, `timer`, `simplemagicgrower`, `inspectable`, and `hauntable` utilities) to handle gameplay behaviors such as fire spread, damage, loot dropping, and seasonal growth mechanics.

## Usage example
```lua
-- Create a normal-height Moon Tree at world coordinates
local tree = SpawnPrefab("moon_tree_normal")
tree.Transform:SetPosition(x, y, z)

-- Optionally, explicitly set growth stage
tree.components.growable:SetStage(2) -- grows to normal height

-- Start growing (if not already)
tree.components.growable:StartGrowing()

-- Trigger burning behavior
if tree.components.burnable ~= nil then
    tree.components.burnable:StartWildfire()
end
```

## Dependencies & tags
**Components used:**  
`burnable`, `growable`, `lootdropper`, `plantregrowth`, `propagator`, `simplemagicgrower`, `timer`, `workable`, `inspectable`, `hauntable` (via `MakeHauntableWork`, `MakeHauntableIgnite`, `DefaultIgniteFn`, `DefaultBurnFn`, etc.)

**Tags added:**  
`plant`, `tree`, `shelter`, `moon_tree`, `burnt`, `stump` (dynamically added/removed during lifecycle)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `size` | string | `nil` | Current height stage: `"short"`, `"normal"`, or `"tall"`. Set during construction or load. |
| `color` | number | `0.75 + random(0..0.25)` | Color multiplier applied to the AnimState for visual variation. |
| `growfromseed` | function | `growfromseed_handler` | Callback used by `growable` to handle seed-to-stage-1 growth. |

## Main functions
### `moon_tree(name, stage, data)`
*   **Description:** Factory function that returns a `Prefab` definition for the Moon Tree (and variants: `moon_tree_short`, `moon_tree_normal`, `moon_tree_tall`). Accepts parameters for name, initial growth stage (0–3), and save data.
*   **Parameters:**  
    - `name` (string) - Prefab name (e.g., `"moon_tree"`).  
    - `stage` (number) - Initial stage index (0 = random; 1–3 = short/normal/tall).  
    - `data` (table) - Optional load data from save (contains `size`, `burnt`, `stump` keys).  
*   **Returns:** A `Prefab` function that instantiates the entity.

### `set_short(inst)`, `set_normal(inst)`, `set_tall(inst)`
*   **Description:** Configure the Moon Tree instance to its respective height stage, setting workable work left, burn time, loot table, shelter tag, and initial sway animation. Internally calls corresponding `*_burnable` functions.
*   **Parameters:** `inst` (Entity instance) - the Moon Tree to configure.  
*   **Returns:** Nothing.

### `make_stump(inst)`
*   **Description:** Converts a Moon Tree instance into a stump: removes burnable/propagator/growable/hauntable components, adds fire-resistant stump burnability (via `make_stump_burnable`), sets up workable for digging, updates minimap icon, and starts decay timer.
*   **Parameters:** `inst` (Entity instance) - the tree to convert.  
*   **Returns:** Nothing.

### ` burnt_changes(inst)`
*   **Description:** Transforms a burnt Moon Tree into a permanent burnt state by removing `burnable`, `propagator`, `growable`, and `hauntable` components, clearing shelter tag, updating loot table to burnt loottable, and configuring workable to drop charcoal on finish.
*   **Parameters:** `inst` (Entity instance) - the burnt tree to finalize.  
*   **Returns:** Nothing.

### `on_chop_tree_down(inst, chopper)`
*   **Description:** Handles the completion of chopping down a Moon Tree: plays felling sound, falls left or right depending on chopper position, spawns loot, triggers camera shake, and converts the stump via `make_stump`.
*   **Parameters:**  
    - `inst` (Entity instance) - the Moon Tree.  
    - `chopper` (Entity, optional) - the entity performing the chop (e.g., player).  
*   **Returns:** Nothing.

### `inspect_moon_tree(inst)`
*   **Description:** Provides inspection status for the Moon Tree UI.
*   **Parameters:** `inst` (Entity instance) - the Moon Tree.  
*   **Returns:** `"BURNT"` if burnt, `"CHOPPED"` if a stump, otherwise `nil`.

## Events & listeners
- **Listens to:**  
  - `animover` — triggers removal of burnt/stump trees after animation completes.  
  - `timerdone` — handles decay timer expiration to remove the entity.  
- **Pushes:**  
  - `onextinguish` — fired when fire is extinguished (via `burnable`).  
  - `loot_prefab_spawned` — fired when loot is dropped (via `lootdropper`).  
  - `entity_droploot` — fired after loot drop logic completes.