---
id: oceantree
title: Oceantree
description: Manages the lifecycle, growth, and interaction logic for ocean trees, including chopping, burning, converting to stumps, and transforming into ocean pillars when enriched.
tags: [environment, plant, growth, loot, physics]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 85a48406
system_scope: environment
---

# Oceantree

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`oceantree.lua` defines the prefabs and behavior for ocean trees, dynamic entities that grow through stages (`short`, `normal`, `tall`), respond to chopping and burning, and can transition into `oceantree_pillar` under specific enriched conditions. It is not a component itself, but a *prefab factory* that constructs and configures ocean tree entities with multiple internal components attached. Key responsibilities include growth progression via the `growable` component, loot generation via `lootdropper`, physics interactions (including boat collisions), and state management (e.g., burnt, stump, enriched, or pillar forms).

## Usage example
The primary use is instantiating ocean tree prefabs with optional stage overrides or initial states (`stump`, `burnt`):
```lua
-- Create a default ocean tree at a random growth stage
local tree = Prefab("oceantree")

-- Create a tall ocean tree
local tall_tree = Prefab("oceantree_tall")

-- Create a burnt ocean tree
local burnt_tree = Prefab("oceantree_burnt")

-- Create a stump from an existing tree (e.g., after chopping)
local stump = Prefab("oceantree_stump")
```
Note: This file defines `Prefab` constructors (via `tree(...)`, `make_ripples(...)`, `falling_tree_fn`), not a reusable component.

## Dependencies & tags
**Components used:**
- `burnable`
- `growable`
- `lootdropper`
- `inspectable`
- `workable`
- `timer`
- `propagator`
- `simplemagicgrower`
- `hauntable`
- `boatphysics` (read-only during collision)

**Tags added/checked:**
- Added: `ignorewalkableplatforms`, `shelter`, `plant`, `event_trigger`, `tree`, `FX`, `NOCLICK`, `stump`, `burnt`, `no_force_grow`
- Checked: `playerghost`, `beaver`, `boat`

## Properties
No public properties are exposed on the prefab itself (this is a factory function). Internal properties attached to instances during construction include:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `supertall_growth_progress` | number | `0` | Tracks growth toward converting to a pillar (max `STAGES_TO_SUPERTALL`). |
| `buds` | table | `{1,2,3,5,6,7}` | Indices of available bud slots for visual decoration. |
| `buds_used` | table | `{}` | Indices of buds currently in use. |
| `no_grow` | boolean | `nil` | Set to `true` when enriched; prevents growth until removed. |
| `boat_collided` | boolean | `nil` | Temporary flag during boat collision to avoid physics race conditions. |
| `anims` | table | See `anims` constant | Animation keys (e.g., `idle`, `chop`, `stump`) for this tree. |

## Main functions
The following functions operate on the constructed tree entity instances:

### `OnTreeGrowthSolution(inst, item)`
*   **Description:** Called when a growth solution (e.g., fertilizer) is applied. If the tree is near pillar stage, it triggers enrichment (`MakeEnriched`) and starts the cooldown; otherwise, it triggers normal growth (`growable:DoGrowth()`).
*   **Parameters:** `inst` (entity), `item` (item used).
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `item` is not a valid growth solution.

### `chop_down_tree(inst, chopper)`
*   **Description:** Handles the completion of chopping a healthy tree, spawning a falling tree FX, dropping loot, and replacing the tree with a stump. Boat collisions skip stump creation and directly remove the tree.
*   **Parameters:** `inst` (entity), `chopper` (entity performing the chop).
*   **Returns:** Nothing.
*   **Error states:** If `chopper` has `boatphysics`, only a log is spawned and the tree is removed without making a stump.

### `OnBurnt(inst, immediate)`
*   **Description:** Converts a burning tree to a burnt state: removes burnable/propagator/growable components, sets anim and icon, adds `burnt` tag. If `immediate` is `true`, changes happen instantly; otherwise, after a 0.5s delay.
*   **Parameters:** `inst` (entity), `immediate` (boolean).
*   **Returns:** Nothing.

### `make_stump(inst)`
*   **Description:** Converts a chopped tree to a stump: removes core components (`burnable`, `workable`, `growable`, etc.), applies small burnable/propagator, adds `stump` tag, sets icon to `oceantree_stump.png`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `SpawnOceanTreePillar(inst)`
*   **Description:** Replaces the tree with an `oceantree_pillar` when enriched growth reaches the threshold. Spawns the pillar prefab, calls its `sproutfn`, and removes the tree.
*   **Parameters:** `inst` (entity).
*   **Returns:** `pillar` (entity reference).
*   **Error states:** Returns immediately if `inst` is already invalid.

### `OnCollide(inst, data)`
*   **Description:** Handles collisions with boats: if the tree is a stump and hit hard enough, it yields a log; if not, it deals chopped work to the tree.
*   **Parameters:** `inst` (entity), `data` (collision data including `other` and `hit_dot_velocity`).
*   **Returns:** Nothing.
*   **Error states:** No effect if `other` lacks `boatphysics` component.

## Events & listeners
- **Listens to:**
  - `on_collide` → `OnCollide` (handles boat collisions)
  - `timerdone` → `OnTimerDone` (handles enriched cooldown expiration)
  - `animover` → `inst.Remove` (cleanup after falling animation)
  - `death` → (handled internally by burnable, via `OnKilled` reference)

- **Pushes:**
  - `onextinguish` (via `burnable:Extinguish`)
  - `loot_prefab_spawned` (via `lootdropper:SpawnLootPrefab`)
  - `entity_droploot` (via `lootdropper:DropLoot`)

