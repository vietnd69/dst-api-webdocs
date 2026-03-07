---
id: corpses
title: Corpses
description: Manages the lifecycle, mutation, looting, and decay of creature corpses, including handling lunar rift mutations and gestalt possession.
tags: [loot, decay, mutation, creature, persistence]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4735ab84
system_scope: entity
---

# Corpses

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`corpses.lua` defines prefabricated entities for creature corpses and provides shared logic for their behavior in DST. It implements a system for corpse mutation (both regular lunar mutation and rift-based gestalt possession), decay via erosion timers, meat-level looting mechanics, and interaction with burning/extinguishing states. It does not define a standalone component class but instead serves as a *prefab factory* that constructs and configures corpse entities using various components like `burnable`, `lootdropper`, `timer`, `entitytracker`, and others.

## Usage example
This file is not added to entities directly; it returns `Prefab` constructors for corpse types. Example usage within a mod:

```lua
local Corpse = require "prefabs/corpses"

local my_corpse_prefab = Corpse.MakeCreatureCorpse({
    creature = "beefalo",
    build = "beefalo",
    bank = "beefalo",
    sg = "SGbeefalo_corpse",
    shadowsize = {0.5, 0.25},
    assets = { Asset("ANIM", "anim/beefalo.zip") },
    has_pre_rift_mutation = true,
    has_rift_mutation = true,
    sanityaura = -TUNING.SANITYAURA_MED,
})
```

## Dependencies & tags
**Components used:**  
- `burnable` (conditionally added)  
- `lootdropper`  
- `inspectable`  
- `sanityaura`  
- `timer`  
- `entitytracker`  
- `savedscale`  
- `updatelooper` (conditionally added for flash effects)

**Tags added by corpse prefabs:**  
- `"creaturecorpse"`  
- `"deadcreature"`  
- `"blocker"` (if `use_inventory_physics` is enabled)  
- `"NOCLICK"` (added when eroding starts)  
- Custom tag (`data.tag`) and arbitrary tags (`data.tags`) if provided in `corpse_data`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `creature` | string | `nil` | Name of the original creature (e.g., `"beefalo"`). Used for loot name lookups and name generation. |
| `mutantprefab` | string | `nil` | Prefab name for the regular lunar-mutated creature (e.g., `"mutatedbeefalo"`). |
| `riftmutantprefab` | string | `nil` | Prefab name for the rift (gestalt) mutated creature (e.g., `"mutatedbeefalo_gestalt"`). |
| `corpse_loot` | table | `nil` | List of loot prefabs dropped upon erosion. Initialized by `SetCorpseData()` or via defaults in corpse_defs. |
| `meat` | number | max value | Current meat amount. Used to determine looting reduction and腐烂 (`meat_level`). |
| `meat_level` | number | `1` | Integer from 1 (full meat) to 4 (empty/corpses eroding). Set automatically by `SetMeat()`. |
| `persist_sources` | `SourceModifierList` | instance | Tracks entities/tasks preventing erosion (e.g., player proximity, active timers). |
| `no_destroy_on_burn` | boolean | `false` | If `true`, prevents destruction on burning (e.g., Willow’s torch corpse). |
| `noburn` | boolean | `false` | If `true`, removes the `burnable` component entirely. |
| ` corpseerodefn` | function | `nil` | Optional custom function called when corpse erodes. Overrides default fade-away delay. |

## Main functions
### `MakeCreatureCorpse(data)`
*   **Description:** Factory function that returns a `Prefab` constructor for a fully configured creature corpse. Accepts a `data` table with creature-specific configuration (creature name, animation build/bank, stategraph, mutation flags, loot, burn behavior, etc.).
*   **Parameters:**
    - `data` (table) — Configuration object. Required keys: `creature`, `build`, `bank`, `sg`. Optional keys: `has_pre_rift_mutation`, `has_rift_mutation`, `burntime`, `meat`, `loot`, `scale`, `faces`, `tag`, `tags`, `custom_physicsfn`, `makeburnablefn`, `OnSave`, `OnLoad`, `master_postinit`, etc.
*   **Returns:** `Prefab` — A prefab definition ready for use in `Prefabs` registration.

### `MakeCreatureCorpse_Prop(data)`
*   **Description:** Factory function that returns a `Prefab` for a simpler "prop" variant of a corpse (e.g., display-only corpses in static layouts). Lacks mutation, loot, and many gameplay features of full `MakeCreatureCorpse`.
*   **Parameters:**
    - `data` (table) — Similar structure to `MakeCreatureCorpse`, but `build`, `bank`, `scale`, and `faces` are required for visuals; no mutation-related keys needed.
*   **Returns:** `Prefab` — A lightweight prefab definition.

### `inst:StartLunarMutation(loading)`
*   **Description:** Begins the regular lunar mutation process (e.g., Horror Hound from Hound). Cancels timers, disables burnable callbacks, and transitions the stategraph and prefab to the mutated version.
*   **Parameters:**
    - `loading` (boolean) — If `true`, skips pre-mutation state transitions for fast-reload scenarios.
*   **Returns:** Nothing.

### `inst:StartLunarRiftMutation(loading)`
*   **Description:** Begins rift-based mutation (e.g., Gestalt Possession). May spawn a `corpse_gestalt` proxy and triggers flash animation effects. Fires `ms_gestalt_possession` event (unless `loading`).
*   **Parameters:**
    - `loading` (boolean) — Same semantics as `StartLunarMutation`.
*   **Returns:** Nothing.

### `inst:StartReviveMutateTimer(time)`
*   **Description:** Starts a timer to trigger lunar mutation after `time` seconds. Used for non-gestalt mutations with delay.
*   **Parameters:**
    - `time` (number) — Duration in seconds before mutation triggers.
*   **Returns:** Nothing.

### `inst:StartFadeTimer(time)`
*   **Description:** Starts the erosion timer (default: fade away after time passes). Enables persistent fade behavior.
*   **Parameters:**
    - `time` (number) — Duration in seconds before erosion completes.
*   **Returns:** Nothing.

### `inst:StartGestaltTimer(time)`
*   **Description:** Starts a timer to spawn a gestalt entity. Skipped for puffin corpses (unsupported mutation).
*   **Parameters:**
    - `time` (number) — Duration in seconds before gestalt spawns.
*   **Returns:** Nothing.

### `inst:SetGestaltCorpse()`
*   **Description:** Immediately initiates gestalt mutation (spawns `corpse_gestalt` and sets tracking). Drops loot if corpse is epic or a warg corpse.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `inst:SetNonGestaltCorpse()`
*   **Description:** Sets up non-gestalt (regular lunar) mutation by starting the revive timer.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `inst:DropCorpseLoot()`
*   **Description:** Drops loot based on current meat percentage. Reduces loot count/quality if meat level is low (level ≥ 2). Uses `lootdropper:DropLoot()`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `inst:SetMeat(meat)`
*   **Description:** Sets the current meat amount (0 to max) and automatically updates `meat_level`.
*   **Parameters:**
    - `meat` (number) — New meat quantity. Clamped to [0, `GetMaxMeat()`].
*   **Returns:** Nothing.

### `inst:SetMeatPercent(percent)`
*   **Description:** Convenience method to set meat by percentage (0.0–1.0). Internally clamps and scales to max meat.
*   **Parameters:**
    - `percent` (number) — Meat percentage. Clamped to `[0, 1]`.
*   **Returns:** Nothing.

### `inst:GetMeatPercent()`
*   **Description:** Returns the current meat as a percentage of maximum meat.
*   **Parameters:** None.
*   **Returns:** `number` — meat percentage (e.g., `0.75`).

### `inst:GetMaxMeat()`
*   **Description:** Returns the maximum meat capacity for this corpse, based on creature size.
*   **Parameters:** None.
*   **Returns:** `number` — Maximum meat value.

### `inst:IsMutating()`
*   **Description:** Returns `true` if the corpse is currently in a mutation state (`prerift_mutating` or `lunarrift_mutating`).
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `inst:WillMutate()`
*   **Description:** Returns `true` if mutation is scheduled (timer exists or already mutating).
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `inst:HasGestaltArriving()`
*   **Description:** Returns `true` if a gestalt entity is currently tracked (e.g., before spawning).
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `inst:SetPersistSource(source, persists)`
*   **Description:** Adds or removes a persistence source (e.g., player proximity) that prevents erosion. When `persists` is `true`, prevents eroding.
*   **Parameters:**
    - `source` (string) — Unique identifier for the source.
    - `persists` (boolean) — `true` to prevent erosion, `false` to allow erosion.
*   **Returns:** Nothing.

### `inst:RemovePersistSource(source)`
*   **Description:** Removes a persistence source and schedules a check for immediate erosion if no other sources exist.
*   **Parameters:**
    - `source` (string) — Unique identifier for the source to remove.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
    - `"chomped"` — Calls `OnChomped` to reduce meat.
    - `"timerdone"` — Calls `OnTimerDone` to handle erosion, gestalt spawn, or mutation timers.
    - `"loot_prefab_spawned"` — Calls `OnSpawnedLoot` to apply damage/perish reduction to loots based on meat quality.
    - `"onremove"` — Managed internally by `entitytracker` to clean up entity references.
    - `"propreveal"` — Optional listener added if `data.onrevealfn` is provided in props.
    - `"electrocute"` — Disabled by default (`sg.mem.noelectrocute = true`), but `OnElectrocute` hook exists in code.

- **Pushes:**
    - `"ms_gestalt_possession"` — Fired during `StartLunarRiftMutation` when a gestalt takes over (not during loading).
    - `"ms_registercorpse"` — Fired in `fn()` to register the corpse with the world.
    - `"entity_droploot"` — Fired by `lootdropper:DropLoot`.
    - `"perishchange"` — Not used here; listed for completeness (handled by `perishable` component, not in use in this file).
