---
id: warg
title: Warg
description: Factory function for creating multiple warg-type prefabs with varying properties, behaviors, and components depending on variant (normal, clay, gingerbread, or mutated).
tags: [prefab, combat, ai, boss, enemy]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ed260484
system_scope: entity
---

# Warg

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `warg.lua` file defines a factory function `MakeWarg` used to generate multiple variants of the Warg entity—including standard, clay, gingerbread, and mutated forms—through parameterized configuration. Each variant configures unique assets, components, tags, state graph associations, and behaviors (e.g., leader/hound spawning, hiding mechanics, special abilities). It does not define a standalone component but instead serves as a high-level prefab generator integrating deeply with core systems such as combat, AI (via `wargbrain`), looting, and event-driven logic (e.g., hunt investigations, corpse tracking).

## Usage example
```lua
-- Example: Spawning a standard warg programmatically (usually done via prefabs system)
local warg_prefab = require("prefabs/warg")
local inst = SpawnPrefab("warg")
if inst and inst.components.combat then
    inst.components.combat:SetTarget(some_player)
end
```

## Dependencies & tags
**Components used:** `age`, `burnable`, `combat`, `follower`, `hauntable`, `health`, `hounded`, `inspectable`, `leader`, `locomotor`, `lootdropper`, `lunarriftmutationsmanager`, `mine`, `planardamage`, `prophider`, `sanityaura`, `sleeper`, `timer`, `wagboss_tracker`.  
**Tags added (base):** `monster`, `hostile`, `warg`, `scarytoprey`, `houndfriend`, `largecreature`.  
**Variant-specific tags:** `clay`, `gingerbread`, `lunar_aligned`, `epic`, `gestaltmutant`, `soulless`, `electricdamageimmune`.

## Properties
No public properties are exposed directly on the factory or returned prefabs—configuration occurs via closure capture in `MakeWarg`. The generated prefabs contain runtime instance-level fields such as:
- `base_hound_num` (number)
- `numfollowercorpses` (number)
- `followercorpses` (table)
- `_next_goo_time` (number, used in gingerbread variant)
- `formationtask` (Task, used in clay variant)
- `_playingmusic` (boolean, mutated variant)
- `temp8faced` (net_bool, mutated variant)
- `flame_pool`, `ember_pool` (tables, mutated variant)
- `scrapbook_adddeps`, `scrapbook_removedeps`, `scrapbook_overridedata` (tables for scrapbook integration)

## Main functions
### `MakeWarg(data)`
*   **Description:** Core factory function that constructs and returns a prefab definition for a specific warg variant based on `data`. It configures the entity’s physics, components, sounds, tags, state graph, and brain.
*   **Parameters:** `data` (table) — Contains:
    - `name` (string): Prefab name.
    - `bank` (string): Animation bank name.
    - `build` (string): Build asset name.
    - `prefabs` (table): List of dependent prefabs (loot, FX, etc.).
    - `tag` (string, optional): Variant tag (`"clay"`, `"gingerbread"`, `"lunar_aligned"`).
    - `epic` (boolean, optional): Whether to mark the entity as epic (affects music, tags).
*   **Returns:** Prefab definition (table) for use with `Prefab()` constructor.
*   **Error states:** None documented; expects valid configuration data.

### `SpawnHounds(inst, radius_override)`
*   **Description:** Spawns a variable number of hounds using the `hounded` world component, setting them as followers of the warg.
*   **Parameters:** `inst` (Entity), `radius_override` (number, optional) — Override radius for hound spawn positioning.
*   **Returns:** Table of spawned hound entities (or `nil` if `hounded` component is missing or none spawned).
*   **Error states:** Returns `nil` if the `hounded` component is not present on `TheWorld`.

### `NumHoundsToSpawn(inst)`
*   **Description:** Calculates how many hounds should be spawned on demand (e.g., during howl), based on nearby players’ world age and game tuning. Used for normal and mutated variants.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Number of additional hounds to spawn (integer ≥ 0).
*   **Error states:** None documented.

### `NoHoundsToSpawn(inst)`
*   **Description:** Stub function that always returns `0`. Used by clay and gingerbread variants where hound spawning is fixed or replaced.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `0`.

### `OnSpawnedForHunt_Normal(inst, data)`
*   **Description:** Handler for post-hunt investigation results. Spawns meats, potentially hides the warg, spawns hounds, forces sleep, or creates a carcass depending on the hunt outcome (`data.action`).
*   **Parameters:** `inst` (Entity), `data` (table or `nil`) — Hunt result data (e.g., `action`, `score`).
*   **Returns:** Nothing.
*   **Error states:** No-op if `data == nil`.

### `Mutated_OnDead(inst)`
*   **Description:** Extended death handler for mutated warg, marking the mutation as defeated in the `lunarriftmutationsmanager`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** No-op if `TheWorld.components.lunarriftmutationsmanager` is missing.

### `Mutated_SwitchToEightFaced(inst)`
*   **Description:** Switches mutated warg to eight-faced mode by updating internal flag and calling per-frame logic (client-side only).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `Mutated_SwitchToSixFaced(inst)`
*   **Description:** Reverts mutated warg to six-faced mode.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `attacked`: Triggers `OnAttacked`, prompting immediate retargeting and hound assistance.
  - `death`: Triggers `OnDead` or `Mutated_OnDead` depending on variant.
  - `spawnedforhunt`: Triggers hunt-specific logic (`OnSpawnedForHunt_*`).
  - `restoredfollower`: Used for clay variant to update hound formation.
  - `eyeflamesdirty`: Updates clay warg’s eye flames (FX, sound, light).
  - `temp8faceddirty`: Syncs eight/six-faced state for mutated warg (client).
  - `onremove`: Tracks follower corpses (`OnCorpseRemoved`).
- **Pushes:** None explicitly documented in this file.
