---
id: evergreens
title: Evergreens
description: Manages evergreen tree prefabs with multi-stage growth, loot dropping, burning, hauntable behavior, and regeneration mechanics.
tags: [growth, loot, burning, environment, regeneration]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 52c9ceb3
system_scope: environment
---

# Evergreens

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`evergreens.lua` defines the prefabs and behavior for all evergreen tree variants in DST (e.g., evergreen, evergreen_sparse, twiggytree). Each tree supports multiple growth stages (`short`, `normal`, `tall`, `old` for most; `twiggytree` adds `old`), is burnable, hauntable, growable, and supports regeneration of new saplings. The file also handles stage transitions, state persistence (`onsave`/`onload`), and special logic for stump creation, burnt trees, and Leif spawning.

This is not a standalone component but a prefab factory that constructs tree entities and attaches components like `burnable`, `growable`, `workable`, `lootdropper`, `hauntable`, `plantregrowth`, and `petrifiable`.

## Usage example
```lua
-- Create a normal evergreen starting at the "short" growth stage
local evergreen = Prefab("evergreen", fn, assets, prefabs)

-- In a custom prefab, add components manually:
local inst = CreateEntity()
inst:AddComponent("growable")
inst.components.growable.stages = GetGrowthStages(inst) -- requires access to growth_stages table
inst.components.growable:SetStage(1)
inst.components.growable:StartGrowing()

-- Set workable for chopping
inst:AddComponent("workable")
inst.components.workable:SetWorkAction(ACTIONS.CHOP)
inst.components.workable:SetOnFinishCallback(chop_down_tree)
```

## Dependencies & tags
**Components used:**
- `burnable`: For fire behavior and burnt state handling.
- `growable`: Manages multi-stage growth and stage transitions.
- `workable`: Enables chopping, digging (stump).
- `lootdropper`: Drops logs, pinecones, twigs, charcoal, etc.
- `hauntable`: Enables haunt-based Leif spawning and stump interactions.
- `plantregrowth`: Handles regrowth from saplings.
- `petrifiable`: Allows petrification into rock forms.
- `simplemagicgrower`: For growth optimization.
- `timer`: Used for decay timers (e.g., burnt tree decay, stump removal).
- `inspectable`: Provides inspection status text ("BURNT", "CHOPPED").
- `sleeper`: Leif sleep/wake interaction.

**Tags added/removed:**
- Adds: `plant`, `tree`, `shelter` (except for `stump`/`burnt`/`twiggy`), `evergreens`, `petrifiable` (non-twiggy), `renewable` (twiggy).
- Removes: `shelter`, `petrifiable` on `burnt` or `stump` states.
- Adds/removes `burnt`, `stump`, `NOCLICK` (during petrify animation), and stage-specific tags.

## Properties
No public properties. The `build` table and `growth_stages` are internal tables defined in the constructor closure.

## Main functions
### `OnBurnt(inst, immediate)`
*   **Description:** Transforms a burning tree into a burnt tree: extinguishes fire, removes `burnable`, `propagator`, `growable`, `hauntable`, `petrifiable` components, sets `burnt` tag, switches MiniMap icon, and starts a decay timer. May drop pinecones or twiggy nuts with 10% chance.
*   **Parameters:** `inst` (Entity) - the tree instance; `immediate` (boolean) - if `true`, changes occur instantly; otherwise delayed by 0.5s.
*   **Returns:** Nothing.
*   **Error states:** None.

### `chop_down_tree(inst, chopper)`
*   **Description:** Handles full tree fall: plays fall animation, drops loot offset by direction, triggers camera shake, creates a stump, and attempts to spawn Leif if conditions (days survived, luck, chance modifiers) are met.
*   **Parameters:** `inst` (Entity); `chopper` (Entity or nil) - the actor chopping the tree.
*   **Returns:** Nothing.

### `make_stump(inst)`
*   **Description:** Converts the tree instance into a stump: removes several components, adds `workable` with `ACTIONS.DIG` action, sets decay timer, updates minimap icon, and sets `stump` tag.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `TransformIntoLeif(inst, chopper)`
*   **Description:** Schedules spawning of a new Leif from the tree after a random delay (1–4s). Assigns `chopper` as Leif’s combat target if present.
*   **Parameters:** `inst` (Entity); `chopper` (Entity).
*   **Returns:** Nothing.

### `onhauntevergreen(inst, haunter)`
*   **Description:** Handles haunting: very rarely spawns a Leif (if tree is not burnt/stump and valid target found); otherwise attempts to trigger a stump work action (with 10% chance).
*   **Parameters:** `inst` (Entity); `haunter` (Entity).
*   **Returns:** `true` if a successful haunt occurred (Leif spawn or stump work), else `false`.

### `dopetrify(inst, stage, instant)`
*   **Description:** Replaces the tree with a petrified rock variant based on `stage`, optionally playing a particle effect before transformation.
*   **Parameters:** `inst` (Entity); `stage` (number) - 1-based index into `STAGE_PETRIFY_PREFABS`; `instant` (boolean).
*   **Returns:** Nothing.

### `growfromseed(inst)`
*   **Description:** Called when a sapling finishes growing. Plays "grow_seed_to_short" animation, sound, and sway.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** When entity sleeps (off-screen), removes `burnable`, `propagator`, `inspectable`, and `growable`/`petrifiable` if burning. Adds `burnt` tag if tree was burning.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Restores components on waking. Re-applies `burnable`, `propagator`, `inspectable`. Handles burnt tree re-activation and regrowth-related loot respawns.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes tree state into `data` table (burnt, stump, build, rebirth timer, burntcone).
*   **Parameters:** `inst` (Entity); `data` (table) - output table.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Loads saved state: restores build type, handles stump/burnt restoration, rebirth timer, and burntcone flag.
*   **Parameters:** `inst` (Entity); `data` (table) - deserialized save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` - handled by `OnTimerDone` to decay stumps or burnt trees (spawns `small_puff` and removes instance after delay).
- **Pushes:** `onextinguish`, `loot_prefab_spawned`, `onwakeup`, `entity_droploot`, `animover` (used for removal after animation), and internal events from child prefabs.
