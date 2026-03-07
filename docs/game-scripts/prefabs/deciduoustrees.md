---
id: deciduoustrees
title: Deciduoustrees
description: Manages deciduous tree prefabs, including growth stages, seasonal leaf changes, monster transformation, burning behavior, and loot generation.
tags: [environment, entity, growth, combat]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bd22c822
system_scope: environment
---

# Deciduoustrees

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`deciduoustrees.lua` defines the core behavior of deciduous trees in DST. It is a prefab factory that creates multiple tree prefabs (`deciduoustree`, `deciduoustree_normal`, `deciduoustree_tall`, `deciduoustree_short`, `deciduoustree_burnt`, `deciduoustree_stump`), each equipped with a rich set of components for dynamic behavior. The prefabs handle growth from seed to tall tree across four stages (short → normal → tall → (no longer used)), seasonal leaf color changes (normal, colorful/red-orange-yellow, barren/winter, poison/monster), and transformation into monster trees under specific conditions. Burning, extinguishing, decay, hauntables, and integration with the world’s seasonal cycle and season transitions are fully managed.

## Usage example
```lua
-- Create a normal deciduous tree (short growth stage)
local tree = Prefab("deciduoustree", ...)
tree:AddComponent("growable")
tree.components.growable.stages = growth_stages
tree.components.growable:SetStage(1) -- Start at short stage
tree.components.growable:StartGrowing()

-- Later, trigger monster transformation (e.g., after 5 days)
tree:StartMonster(true)

-- Handle leaf color change manually (e.g., in response to season)
tree.target_leaf_state = "colorful"
OnChangeLeaves(tree)

-- When chopped
tree.components.workable:WorkedBy(player, 1)
```

## Dependencies & tags
**Components used:** `age`, `burnable`, `cattoy`, `combat`, `deciduoustreeupdater`, `growable`, `hauntable`, `inspectable`, `lootdropper`, `plantregrowth`, `propagator`, `simplemagicgrower`, `timer`, `waxable`, `workable`

**Tags added/removed:**
- Always added: `plant`, `tree`, `birchnut`, `cattoyairborne`, `deciduoustree`, `shelter` (unless stump or burnt)
- Dynamically added/removed: `burnt`, `stump`, `monster`, `cattoyairborne` (removed on monster state)
- `__combat` added for optimization, then removed during master replication

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `build` | string | `"normal"` | Current leaf build variant (`normal`, `red`, `orange`, `yellow`, `poison`, `barren`) |
| `anims` | table | `nil` | Current animation set (e.g., `short_anims`, `monster_anims`) |
| `leaf_state` | string | `"normal"` | Current leaf state: `normal`, `colorful`, `barren`, `poison` |
| `target_leaf_state` | string | `"normal"` | Target leaf state based on season or transformation |
| `monster` | boolean | `false` | Whether the tree is currently a monster |
| `color` | number | `0.5 + math.random() * 0.5` | Custom tint for the tree model (used for normal/seasonal builds) |
| `acorntask` | task | `nil` | Task for dropping acorns after burning |
| `monster_start_time` | number | `nil` | Game time when monster mode started |
| `monster_duration` | number | `nil` | Total duration of monster mode |
| `spawnleaffxtask` | periodic task | `nil` | Periodic task spawning leaf FX during idle sway |

## Main functions
### `OnChangeLeaves(inst, monster, monsterout)`
* **Description:** Triggers visual leaf state transitions (e.g., seasonal changes, monster transformation), updates model override symbols, adjusts loot, and manages waxable component presence. It cancels any pending change task and schedules a new one if needed (unless forced). Called automatically on season change, monster triggers, or explicit calls.
* **Parameters:**
  * `inst` (Entity) — The tree entity.
  * `monster` (boolean, optional) — If `true`, indicates monster-in transition (skips sway and immediate animation).
  * `monsterout` (boolean, optional) — If `true`, indicates monster-out transition.
* **Returns:** Nothing.
* **Error states:** No effect if the tree is burning, a stump, or burnt; cancels tasks and returns early in those cases.

### `StartMonster(inst, force, starttimeoffset)`
* **Description:** Initiates transformation of a normal tree into a monster. Requires the tree to be in the `normal` animation stage (stage 2) and not barren. Sets leaf state to `poison`, increases work left for combat, and starts the `deciduoustreeupdater` component to spawn drakes and manage monster timers.
* **Parameters:**
  * `inst` (Entity) — The tree entity.
  * `force` (boolean, optional) — If `true`, bypasses size/season checks and triggers transformation immediately.
  * `starttimeoffset` (number, optional) — Time offset to align internal monster start time during load.
* **Returns:** Nothing.
* **Error states:** No effect if the tree is already a monster, burnt, or a stump.

### `StopMonster(inst)`
* **Description:** Reverts a monster tree back to a normal deciduous tree. Removes the `combat` and `deciduoustreeupdater` components, resets animations and tags, and triggers growth back to `normal` stage. Schedules the revert with a delay (animation + transition).
* **Parameters:**
  * `inst` (Entity) — The tree entity.
* **Returns:** Nothing.
* **Error states:** No effect if the tree is not currently a monster, burnt, or a stump.

### `chop_tree(inst, chopper, chopsleft, numchops)`
* **Description:** Plays chop animations and sounds, spawns leaf FX, and triggers sway animation. Handles monster-specific responses (e.g., aggro state transitions). Called as the workable callback during tree chopping.
* **Parameters:**
  * `inst` (Entity) — The tree entity.
  * `chopper` (Entity) — The entity performing the chop.
  * `chopsleft` (number) — Remaining work units.
  * `numchops` (number) — Number of chops performed in this call.
* **Returns:** Nothing.

### `chop_down_tree(inst, chopper)`
* **Description:** Handles tree felling logic: sets fall direction, plays falling animation, triggers camera shake, and replaces the tree with a stump. Handles monster-specific loot and cleanup.
* **Parameters:**
  * `inst` (Entity) — The tree entity.
  * `chopper` (Entity) — The entity performing the final chop.
* **Returns:** Nothing.

### `OnBurnt(inst, immediate)`
* **Description:** Converts the tree into a burnt state. Removes burning-related components, replaces loot, sets workable to charcoal harvesting, and starts decay timer. If the tree was a monster, resets it first.
* **Parameters:**
  * `inst` (Entity) — The tree entity.
  * `immediate` (boolean) — If `true`, performs all burnt changes immediately instead of scheduling.
* **Returns:** Nothing.

### `OnEntityWake(inst)`
* **Description:** Restores components (`burnable`, `propagator`, `inspectable`) and resumes tree behavior upon waking from sleep. Handles re-burning if the tree was burning before sleeping, resets monster timers, and triggers proper animations.
* **Parameters:**
  * `inst` (Entity) — The tree entity.
* **Returns:** Nothing.
* **Error states:** If waking while burnt or stump, only minimal cleanup occurs.

### `OnSeasonChanged(inst, season)`
* **Description:** Updates the tree’s `target_leaf_state` when the world season changes, and triggers `OnChangeLeaves`. Only applies if the tree is not a stump, burnt, or monster.
* **Parameters:**
  * `inst` (Entity) — The tree entity.
  * `season` (string) — New season identifier (`SEASONS.AUTUMN`, `SPRING`, etc.).
* **Returns:** Nothing.

### `OnHaunt(inst, haunter)`
* **Description:** Handles haunt attempts on the tree. Returns `true` for successful haunts that trigger haunter effects (e.g., small damage, huge chance for monster transformation).monster transformation.
* **Parameters:**
  * `inst` (Entity) — The tree entity.
  * `haunter` (Entity) — The haunting entity (e.g., Abigail).
* **Returns:** `true` if the haunt succeeded (triggers haunter effects), `false` otherwise (e.g., burnt stump).
* **Error states:** Haunt fails if the tree is a stump, burnt, or if the random roll fails for the given haunt type.

### `make_stump(inst)`
* **Description:** Transforms the tree into a stump: removes large components, adds small burnable/propagator, sets `stump` tag, changes work action to `DIG`, and schedules decay. Called after felling.
* **Parameters:**
  * `inst` (Entity) — The tree entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — Calls `GrowLeavesFn`, `ChangeSizeFn`, or `OnBurnt` as needed; `sway` — Triggers `onsway`; `timerdone` — Decays stump after timer expires; `season` — Updates leaf state via `OnSeasonChanged`; `cycles` — Updates leaf state via `OnCyclesChanged`; `death` — Internal (burnable); `onignite` — Triggers monster-specific behavior and ignite wave; `onextinguish` — Returns monster to idle.
- **Pushes:** `loot_prefab_spawned`, `entity_droploot`, `onignite`, `onextinguish` (via components), and `onburnt` indirectly via `tree_burnt`.
