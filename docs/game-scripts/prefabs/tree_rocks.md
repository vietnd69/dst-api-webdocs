---
id: tree_rocks
title: Tree Rocks
description: A rock tree prefab that supports growth stages, mining, falling, and vine loot generation, while interacting with combat, burnable, and sleeper systems.
tags: [environment, entity, world, combat]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8369f4d2
system_scope: environment
---

# Tree Rocks

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `tree_rocks.lua` file defines prefabs for rock trees (`tree_rock1`, `tree_rock2`, and variants), which function as environmental structures that can be chopped, mined, fall over, and regenerate. These prefabs incorporate multiple components: `lootdropper` (for drop generation), `workable` (for chopping and mining actions), `growable` (for growth stages), `plantregrowth` (for regrowth after falling), and `burnable` (for fire interaction). They also support area-of-effect knockback and damage on impact, interact with nearby Leif entities via the `sleeper` component, and generate custom vine loot based on world topology. The `tree_rock_seed` can plant a new tree, which then grows through stages from short to normal height.

## Usage example
Rock trees are typically instantiated via the returned prefabs (`tree_rock1`, `tree_rock2`, etc.) rather than direct component manipulation. However, a minimal example of adding and configuring a rock tree manually would be:

```lua
local tree = SpawnPrefab("tree_rock1")
tree.Transform:SetPosition(x, y, z)
tree.components.lootdropper:SetChanceLootTable("tree_rock1_chop")
tree.components.workable:SetWorkLeft(TUNING.TREE_ROCK.CHOP)
tree.components.growable:SetStage(2)
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `growable`, `plantregrowth`, `burnable`, `propagator`, `sleeper`, `combat`, `inventory`, `hauntable`, `inspectable`, `soundemitter`, `animator`, `minimapentity`, `transform`, `network`.

**Tags added/checked:** `tree`, `rock_tree`, `shelter`, `nodangermusic`, `boulder`, `burnt`, `tree_rock_breaker`, `tree_rock_bouncer`. Also uses `leif` for wake-up logic.

## Properties
No public properties are defined in the constructor or elsewhere — this file is primarily a prefab factory and contains no component class definition. All runtime state is stored on the `inst` object (e.g., `inst.build`, `inst.anims`, `inst.vine_loot`) but not exposed as component properties.

## Main functions
### `MakeRockTree(name, build, stage)`
*   **Description:** Factory function that returns a `Prefab` for a rock tree (e.g., `tree_rock1`). It initializes all required components (lootdropper, workable, growable, plantregrowth, burnable, etc.), sets animations and loot tables, and registers save/load callbacks.
*   **Parameters:**  
    *   `name` (string) – prefab name (e.g., `"tree_rock1"`).  
    *   `build` (string, optional) – key from the `builds` table (`"rock1"` or `"rock2"`), determining growth and AOE stats.  
    *   `stage` (number, optional) – initial `growable` stage (`1` = short, `2` = normal).
*   **Returns:** A `Prefab` instance.
*   **Error states:** None documented.

### `MakeRock(inst, no_change_physics)`
*   **Description:** Transforms the entity from a standing rock tree into a boulder after falling or burning. Removes burnable, propagator, workable (chopping), and shelter components; adds a new `workable` for mining; adjusts physics to obstacle type; and sets loot table to `"tree_rock1_mine"`.
*   **Parameters:**  
    *   `inst` (Entity) – the rock tree instance to convert.  
    *   `no_change_physics` (boolean) – if `true`, skips physics collider removal/replacement.
*   **Returns:** Nothing.

### `OnChop(inst, chopper, chopsleft, numchops)`
*   **Description:** Callback invoked each time the tree is chopped. Plays chop animation and sound, spawns `tree_rock_chop` FX, and wakes nearby `leif` entities via `sleeper.WakeUp`. Also suggests `chopper` as a target to leifs' `combat` component.
*   **Parameters:**  
    *   `inst` (Entity) – the rock tree instance.  
    *   `chopper` (Entity, optional) – the entity doing the chopping.  
    *   `chopsleft` (number) – remaining chops before falling.  
    *   `numchops` (number) – total chops required (from `TUNING.TREE_ROCK.CHOP`).
*   **Returns:** Nothing.

### `OnChopDown(inst, chopper)`
*   **Description:** Callback invoked after the final chop. Triggers the fall animation sequence (`fall_pre`), drops loot and vine loot, and calls `MakeRock(inst, true)` to transition to boulder state.
*   **Parameters:**  
    *   `inst` (Entity) – the rock tree instance.  
    *   `chopper` (Entity, optional) – the entity that finished chopping.
*   **Returns:** Nothing.

### `OnBurnt(inst, immediate)`
*   **Description:** Handles conversion to burnt state. If `immediate` is `true` (e.g., on load), it instantly converts to a boulder with appropriate mining animation. Otherwise, it plays a `fall_pre_burnt` animation and transitions after a delay.
*   **Parameters:**  
    *   `inst` (Entity) – the rock tree instance.  
    *   `immediate` (boolean) – if `true`, skips fall animation.
*   **Returns:** Nothing.

### `OnMine(inst, miner, minesleft, nummines)`
*   **Description:** Callback for mining (boulder state). When `minesleft <= 0`, spawns rock break FX, drops loot, and removes the entity. Otherwise, plays animation and triggers spooked FX for players with `spooked` component.
*   **Parameters:**  
    *   `inst` (Entity) – the rock tree instance.  
    *   `miner` (Entity, optional) – the mining entity.  
    *   `minesleft` (number) – remaining mine actions before destruction.  
    *   `nummines` (number) – total mine actions required.
*   **Returns:** Nothing.

### `SetupVineLoot(inst, loots)`
*   **Description:** Initializes vine loot (gems, resources) on the tree based on world topology (`GetLootWeightedTable`). Updates `AnimState` to show or hide gem vines and override symbols.
*   **Parameters:**  
    *   `inst` (Entity) – the rock tree instance.  
    *   `loots` (table, optional) – precomputed loot list (uses `GetVineLoots(inst)` if omitted).
*   **Returns:** Nothing.

### `GetLootWeightedTable(inst)`
*   **Description:** Determines the weighted loot table using the rock tree’s position, queried against world topology (`TheWorld.Map:GetTopologyIDAtPoint`). Falls back to `WEIGHTED_VINE_LOOT.DEFAULT` if no match.
*   **Parameters:** `inst` (Entity) – the rock tree instance.
*   **Returns:** table – weighted loot table (e.g., `WEIGHTED_VINE_LOOT.vent_proximity`).
*   **Error states:** Returns `WEIGHTED_VINE_LOOT.DEFAULT` if topology lookup fails.

### `GetAffectedEntities(inst)`
*   **Description:** Finds entities within the tree’s `drop_damage_range` that are valid targets for knockback/damage. Filters by required and forbidden tags (`_combat` must be present; `INLIMBO`, `flight`, `invisible`, etc. are forbidden).
*   **Parameters:** `inst` (Entity) – the rock tree instance.
*   **Returns:** table – array of valid entities within range.

## Events & listeners
- **Listens to:**  
  - `animover` (via `inst:ListenForEvent("animover", OnAnimOver)`) – triggers fall/bounce/break logic and animation chaining.  
  - `death` (handled by `burnable` component) – cancels burn task when killed.
- **Pushes:**  
  - `onextinguish` – triggered on fire extinguish (via `burnable`).  
  - `onwakeup` – triggered on leif wake-up (via `sleeper`).  
  - `on_loot_dropped`, `loot_prefab_spawned`, `broke_tree_rock`, `knockback` – triggered during interaction and falling.  
  - Entity-level events: `onload`, `onsave` – via `inst.OnLoad`/`inst.OnSave`.