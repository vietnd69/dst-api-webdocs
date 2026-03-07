---
id: palmconetree
title: Palmconetree
description: Defines the structure, growth stages, and behavior of the Palmcone Tree entity in DST.
tags: [environment, plant, tree]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8b25d29f
system_scope: environment
---

# Palmconetree

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `palmconetree` prefab defines a dynamic tree entity with three size stages (`short`, `normal`, `tall`), growth progression, burn mechanics, stump regeneration, and interaction handling (chopping, burning, digging). It integrates with multiple components to support growth cycles, loot dropping, fire propagation, and seasonal state persistence via save/load hooks. It serves as the foundational definition for multiple related prefabs: `palmconetree`, `palmconetree_short`, `palmconetree_normal`, and `palmconetree_tall`.

## Usage example
While not a component itself, this prefab is instantiated by the game engine and used by other systems (e.g., worldgen, crafting, seed planting). Modders typically reference it when customizing tree behavior or loot.

```lua
-- Example: Custom seed that grows into a palmcone tree
local seed = Prefab("custom_palmcone_seed", function()
    local inst = CreateEntity()
    inst:AddComponent("seed")
    inst.components.seed.growfn = function(inst, grown_inst)
        -- Spawn a normal mature palmcone tree
        local tree = SpawnPrefab("palmconetree_normal")
        if tree then
            grown_inst:Remove()
            return tree
        end
    end
    return inst
end)
```

## Dependencies & tags
**Components used:** `burnable`, `growable`, `inspectable`, `lootdropper`, `plantregrowth`, `propagator`, `simplemagicgrower`, `timer`, `workable`

**Tags added:** `plant`, `tree`, `shelter`, `burnt`, `stump`, `palmconetree`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `size` | string | `nil` | Current growth stage: `"short"`, `"normal"`, or `"tall"`. Initialized from `stage` in constructor. |
| `color` | number | `0.75 + math.random() * 0.25` | Random color multiplier for visual variation (client-side only). |
| `scrapbook_specialinfo` | string | `"TREE"` | Metadata for scrapbook categorization. |
| `scrapbook_proxy` | string | `"palmconetree_tall"` | Prefab used as proxy for scrapbook entry. |
| `scrapbook_speechname` | string | `"palmconetree"` | Display name in scrapbook. |

## Main functions
### `set_short(inst)`, `set_normal(inst)`, `set_tall(inst)`
* **Description:** Configures the entity for a specific size stage. Initializes burnable, propagator, loot table, shelter tag, and triggers sway animation.
* **Parameters:** `inst` (Entity) — the palmcone tree instance.
* **Returns:** Nothing.
* **Error states:** Does not validate existing state; must be called in correct growth order.

### `grow_short(inst)`, `grow_normal(inst)`, `grow_tall(inst)`
* **Description:** Handles transition animation and audio when growing from one stage to the next.
* **Parameters:** `inst` (Entity) — the tree instance.
* **Returns:** Nothing.
* **Error states:** Does not validate current stage.

### `on_tree_burnt(inst)`
* **Description:** Triggers transformation of a healthy tree into a burnt tree (non-growable, reduced loot table).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** Assumes `burnable` component is present; may fail if called before burnable setup.

### `make_stump(inst)`
* **Description:** Converts a chopped tree into a stump: removes growth-related components, adds stump-specific burnable/propagator, sets up workable (dig action), and sets decay timer.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.
* **Error states:** May add duplicate components if called multiple times.

### `tree_burnt_immediate_helper(inst, immediate)`
* **Description:** Helper for immediate or delayed conversion to burnt state (burnt animation, icon, decay timer).
* **Parameters:** `inst` (Entity), `immediate` (boolean) — whether to apply changes instantly or after 0.5s.
* **Returns:** Nothing.

### `inspect_tree(inst)`
* **Description:** Returns a status string for the `inspectable` component based on current state.
* **Parameters:** `inst` (Entity).
* **Returns:** `"BURNT"` or `"CHOPPED"` (if tagged accordingly), otherwise `nil`.

### `chop_down_burnt(inst, chopper)`
* **Description:** Special chop handler for burnt trees (only one chop, drops charcoal-based loot).
* **Parameters:** `inst` (Entity), `chopper` (Entity or `nil`).
* **Returns:** Nothing.

### `on_chop_tree_down(inst, chopper)`
* **Description:** Handles full tree fall: sound, animation (left/right sway based on chopper position), loot drop, and stump creation.
* **Parameters:** `inst` (Entity), `chopper` (Entity or `nil`).
* **Returns:** Nothing.

### `on_save(inst, data)` / `on_load(inst, data)`
* **Description:** Persists and restores entity state (size, burnt, stump) across save/load cycles.
* **Parameters:** `inst` (Entity), `data` (table for save/load).
* **Returns:** Nothing (save) or `nil` (load early return if `data` is `nil`).

### `on_sleep(inst)` / `on_wake(inst)`
* **Description:** Manages component removal/adding when the tree enters/leaves the sleep state (e.g., when player leaves the area).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `growfromseed_handler(inst)`
* **Description:** Callback for seed→seedling growth; plays animation, sound, and transitions to first stage.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` (calls `inst.Remove` for burnt stump animation completion), `timerdone` (triggers `on_timer_done` for decay cleanup and removal), `death` (handled internally by `burnable`).
- **Pushes:** `onextinguish`, `loot_prefab_spawned`, `entity_droploot`.