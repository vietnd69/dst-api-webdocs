---
id: ancienttrees
title: Ancienttrees
description: Manages the lifecycle, growth, and interaction of ancient trees and their saplings, including seed deployment, growth staging, fruit production, and stump conversion upon harvesting.
tags: [plant, growth, environment, loot, season]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e36b5403
system_scope: environment
---

# Ancienttrees

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`ancienttrees.lua` defines the prefabs and shared logic for ancient trees, their saplings, and sapling items. It coordinates growth stages (seed → sprout → full tree), handles growth constraints based on tile type and season, manages fruit production and regrowth, and supports conversion to stumps after harvesting. The component integrates heavily with the `growable`, `pickable`, `workable`, `lootdropper`, `inspectable`, and `deployable` components.

## Usage example
```lua
local tree_prefabs = {
    Prefab("ancienttree_gem", ...),
    Prefab("ancienttree_gem_sapling", ...),
    Prefab("ancienttree_gem_sapling_item", ...),
    MakePlacer("ancienttree_gem_sapling_item_placer", ...),
}
-- Prefabs are created via `MakeAncientTree(name, data)` from the source file
-- Sapling growth is triggered by `inst.components.growable:StartGrowing()`
-- Fruit regrowth is controlled by `inst.components.pickable:MakeEmpty()` and `OnRegenFn`
```

## Dependencies & tags
**Components used:** `deployable`, `growable`, `inspectable`, `lootdropper`, `pickable`, `workable`, `stackable`, `waxableplant` (via `MakeWaxablePlant` helper), `fuel` (removed for waxed variants).  
**Tags:** Adds `plant`, `tree`, `no_force_grow`, `ancienttree`, `event_trigger`, `silviculture`, `deployedplant`, `stump`. Removes `stump`, `shelter` (on stump conversion). Checks `seedstage`, `beaver`, `playerghost`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `type` | string | `nil` | Type identifier (e.g., `"gem"`, `"nightvision"`), used to index `TREE_DEFS`. |
| `sounds` | table | `TREE_DEFS[inst.type].sounds` | Sound keys used during growth, picking, and harvesting. |
| `directional_fall` | boolean | `data.directional_fall` | If true, tree falls toward player when cut. |
| `scrapbook_anim` | string | `"sway1_loop"` | Animation played in scrapbook. |
| `_plantdata` | table | `nil` | Stores plant-specific metadata like fruit regen time. |
| `magic_growth_delay` | number | `nil` | Delay before magic growth (e.g., from player use) is processed. |

## Main functions
### `OnSetStage(inst)`
* **Description:** Updates the visual and tag state of the sapling when its growth stage changes. Applies correct animation banks, builds, and tag (`seedstage`).
* **Parameters:** `inst` (Entity) — the sapling instance.
* **Returns:** Nothing.

### `OnGrowthFull(inst)`
* **Description:** Final growth callback that transforms the sapling into a full ancient tree prefab. Removes the sapling and initializes the tree's pickable state.
* **Parameters:** `inst` (Entity) — the fully grown sapling instance.
* **Returns:** `tree` (Entity) — the newly spawned full tree instance (for modding hooks).
* **Error states:** Returns `nil` if `SpawnPrefab("ancienttree_...")` fails.

### `Sapling_DigUp(inst)`
* **Description:** Handles digging up a sapling to retrieve the sapling item (or seed if stage ≤ 1).
* **Parameters:** `inst` (Entity) — the sapling to dig up.
* **Returns:** `loot` (Entity) — the item spawned (e.g., `ancienttree_seed`, `ancienttree_*_sapling_item`), or `nil`.
* **Error states:** Returns `nil` if `lootdropper` is missing or item spawning fails.

### `Sapling_OnDeploy(inst, pt)`
* **Description:** Deploys a sapling at world position `pt`, spawning a new sapling prefabricated with stage 2 (sprout).
* **Parameters:** `inst` (Entity) — the deployed sapling item. `pt` (Vector3) — deploy location.
* **Returns:** `sapling` (Entity) — the newly deployed sapling.
* **Error states:** May return `nil` if `SpawnPrefab` fails.

### `Sapling_CheckGrowConstraints(inst)`
* **Description:** Evaluates growth constraints (tile and season) and updates `growable` pause/resume state.
* **Parameters:** `inst` (Entity) — the sapling instance.
* **Returns:** Nothing.
* **Error states:** Does not resume growth if neither tile nor season matches (for seed stage, either condition suffices).

### `Sapling_DoMagicGrowthFn(inst, doer)`
* **Description:** Callback for immediate growth when triggered by magic (e.g., fertilized). Resumes growth, checks constraints, and advances one stage.
* **Parameters:** `inst` (Entity) — the sapling. `doer` (Entity) — the entity triggering growth (unused).
* **Returns:** Nothing.
* **Error states:** Returns early if growth is paused or stopped.

### `Sapling_GetStatus(inst)`
* **Description:** Returns a string status describing why growth is paused (e.g., `"WRONG_TILE"`).
* **Parameters:** `inst` (Entity) — the sapling instance.
* **Returns:** `status` (string or `nil`) — pause reason or `nil` if growing.

### `Sapling_DisplayNameFn(inst)`
* **Description:** Provides a dynamic name override based on whether the instance is a seed or sapling.
* **Parameters:** `inst` (Entity) — the sapling instance.
* **Returns:** `name` (string) — localized string (e.g., `"ANCIENTTREE_SEED_PLANTED"` or `"ANCIENTTREE_*"`).

### `Full_MakeStump(inst)`
* **Description:** Converts a felled tree into a stump by replacing components and changing tags/animations.
* **Parameters:** `inst` (Entity) — the full tree instance.
* **Returns:** Nothing.

### `Full_UpdatePickableRegenTime(inst)`
* **Description:** Updates the fruit regen time from stored `_plantdata`.
* **Parameters:** `inst` (Entity) — the full tree instance.
* **Returns:** Nothing.

### `Full_OnWorkedFinish(inst, worker)`
* **Description:** Final callback after working (chopping) a full tree. Handles falling animation, loot drop, seed generation, and stump creation.
* **Parameters:** `inst` (Entity) — the tree. `worker` (Entity) — the worker entity.
* **Returns:** Nothing.

### `Full_OnPickedFn(inst, picker)`
* **Description:** Called when fruit is picked. Hides the fruit mesh.
* **Parameters:** `inst` (Entity) — the tree. `picker` (Entity) — the picker.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `season` (via `inst:WatchWorldState`) — triggers `CheckGrowConstraints` when season changes.
- **Pushes:** `loot_prefab_spawned` (via `lootdropper`), `on_loot_dropped` (via `lootdropper`).