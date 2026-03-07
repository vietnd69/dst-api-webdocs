---
id: cave_banana_tree
title: Cave Banana Tree
description: Manages the full lifecycle of a cave banana tree, including growth, harvesting, chopping, burning, and regrowth into stumps or burnt stumps.
tags: [plant, harvesting, fire, regrowth]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 73ace6bd
system_scope: environment
---

# Cave Banana Tree

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines three prefabs—`cave_banana_tree`, `cave_banana_stump`, and `cave_banana_burnt`—that model the lifecycle of a cave banana tree. It handles gameplay states such as banana growth/health, chopping, burning, regrowth, and persistence across saves. The prefabs use multiple components (`pickable`, `workable`, `burnable`, `lootdropper`) to support player interaction and integration with DST’s world systems (e.g., regrowth manager, save/load, fire propagation).

## Usage example
```lua
-- Example: create and customize a new cave banana tree
local inst = Prefab("cave_banana_tree")
inst:AddComponent("inspectable") -- not required but commonly used
inst.components.pickable:SetUp("cave_banana", TUNING.CAVE_BANANA_GROW_TIME * 2) -- double regen time
inst.components.workable:SetWorkLeft(5) -- requires more hits to chop
```

## Dependencies & tags
**Components used:**  
`pickable`, `workable`, `burnable`, `lootdropper`, `inspectable`, `animstate`, `transform`, `soundemitter`, `minimapentity`, `network`  
**Tags added:** `plant` (on all three prefabs); `stump` (only on stump prefab)

## Properties
No public properties are directly exposed by this file’s prefabs. State is managed internally via component properties (e.g., `pickable.canbepicked`, `workable.workleft`) and instance variables (e.g., `no_banana` on burnt tree).

## Main functions
The following functions are internal callbacks used by component events and are not intended for direct modder invocation, but they are critical to the prefab’s behavior.

### `tree_chopped(inst, worker)`
*   **Description:** Called after the tree finishes being chopped. Handles loot drops, visual changes, stump placement, and transition to the stump prefab.
*   **Parameters:**  
    `inst` (Entity) — the tree entity being chopped  
    `worker` (Entity or `nil`) — the entity performing the action; may be a ghost
*   **Returns:** Nothing.
*   **Error states:** If `worker` is a ghost (`playerghost` tag), axe sound is suppressed.

### `tree_chop(inst, worker)`
*   **Description:** Called on each chopping tick to animate and play sound.
*   **Parameters:**  
    `inst` (Entity)  
    `worker` (Entity or `nil`)
*   **Returns:** Nothing.
*   **Error states:** Same ghost-sound behavior as `tree_chopped`.

### `tree_startburn(inst)`
*   **Description:** Runs when the tree catches fire. Disables interactions.
*   **Parameters:**  
    `inst` (Entity) — the tree
*   **Returns:** Nothing.

### `tree_burnt(inst)`
*   **Description:** Runs when the tree finishes burning. Spawns `cave_banana_burnt` at the same location and removes the original tree.
*   **Parameters:**  
    `inst` (Entity)
*   **Returns:** Nothing.

### `tree_onsave(inst, data)` and `tree_onload(inst, data)`
*   **Description:** Save/load hooks for persistence. Records burning state and banana availability in save data.
*   **Parameters:**  
    `inst` (Entity)  
    `data` (table) — save/load table
*   **Returns:** Nothing.

### `stump_dug(inst)`
*   **Description:** Handles dig action on the stump, drops a log, and removes the stump.
*   **Parameters:**  
    `inst` (Entity)
*   **Returns:** Nothing.

### `stump_burnt(inst)`
*   **Description:** Converts stump to ash when burnt.
*   **Parameters:**  
    `inst` (Entity)
*   **Returns:** Nothing.

### `burnt_chopped(inst)`
*   **Description:** Finalizes chopped burnt tree: drops charcoal, removes itself after a delay.
*   **Parameters:**  
    `inst` (Entity)
*   **Returns:** Nothing.
*   **Error states:** Sets `persists = false` so the burnt tree does not save.

## Events & listeners
- **Listens to:**  
  `animover` (on tree) — triggers `setupstump` to spawn and place the stump after fall animation finishes.  
- **Pushes:**  
  None directly, but uses component events (e.g., `burnable`’s `onignite`, `onburnt`) and `workable` callbacks to drive state changes.
