---
id: wormwood
title: Wormwood
description: Manages the bloom-based progression system for the Wormwood character, including sanity regulation from nearby plants, pet leadership, and photosynthesis-based health regeneration.
tags: [character, progression, pet, sanity, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 267e7e53
system_scope: player
---

# Wormwood

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wormwood.lua` prefab implements the gameplay logic for the Wormwood character in *Don't Starve Together*, centered around the `bloomness` component that controls a 4-stage bloom progression system. It integrates with components such as `sanity`, `health`, `hunger`, `petleash`, `skilltreeupdater`, and `acidlevel` to deliver unique mechanics: sanity restoration from planted crops (within range), pet tending/skill coordination, photosynthetic health regen in daylight, and special behavior under acid rain. Bloom stages also affect movement speed, hunger rate, and visual skin.

## Usage example
```lua
local wormwood = SpawnPrefab("wormwood")
wormwood.components.bloomness:SetLevel(1)  -- Stage 1 bloom
wormwood.components.bloomness:Fertilize(10)  -- Advance bloom stage
wormwood.components.skilltreeupdater:ActivateSkill("wormwood_blooming_photosynthesis")  -- Enable photosynthesis
```

## Dependencies & tags
**Components used:** `bloomness`, `sanity`, `health`, `hunger`, `petleash`, `skilltreeupdater`, `skinner`, `talker`, `playerspeedmult`, `burnable`, `foodaffinity`, `fertilizable`, `eater`, `farmplanttendable`, `mine`, `temperature`, `acidlevel`, ` hunger`.

**Tags:** Adds `plantkin`, `self_fertilizable`, and conditionally `beebeacon` (when stage > 0). Removes `beebeacon` when `stage <= 0.`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fullbloom` | boolean | `nil` | Set to `true` when bloom level is 3 (full bloom). Enables AOE tending, pollen/seed FX, and photosynthesis. |
| `beebeacon` | boolean | `nil` | Set to `true` when bloom level is ≥1; adds `beebeacon` tag. |
| `overrideskinmode` | string | `nil` | Current skin build override name (e.g., `"stage_2"`). Controls visual progression. |
| `pollentask` | task | `nil` | Periodic task for spawning pollen FX. Active only during full bloom. |
| `planttask` | task | `nil` | Periodic task for spawning plant FX. Active only during full bloom. |
| `pollenpool` | table | `{1,2,3,4,5}` | Pool of randomized pollen/seed variations used for FX. |
| `plantpool` | table | `{1,2,3,4}` | Pool of randomized plant FX variations. |
| `plantbonuses` | table | `{}` | List of pending sanity bonuses over time. |
| `plantpenalties` | table | `{}` | List of pending sanity penalties over time. |
| `photosynthesizing` | boolean | `false` | True when photosynthesis is active. |
| `_loading` | boolean | `false` | Internal flag used during world loading. |

## Main functions
### `UpdateBloomStage(inst, stage)`
*   **Description:** Synchronizes Bloom stage changes with gameplay and visual state: enabling/disabling bee beacon, full bloom AOE effects, stats modifiers, and player skin. Also manages queued state changes (e.g., morph waiting for state graph exit). Called automatically by `bloomness.onlevelchangedfn`.
*   **Parameters:** `inst` (entity instance), `stage` (number, optional) — defaults to current `bloomness:GetLevel()`.
*   **Returns:** Nothing.
*   **Error states:** May defer morph logic if in a `nomorph` state (sets `_queued_morph = true` and waits for `"newstate"`).

### `DoAOEeffect(inst)`
*   **Description:** Executes full-bloom AOE effect. Tends farm plants in range, resets bramble traps (if skill `"wormwood_blooming_trapbramble"` is active), and updates photosynthesis state (if `"wormwood_blooming_photosynthesis"` is active). Called periodically every 0.5 seconds during full bloom.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `OnFertilized(inst, fertilizer_obj)`
*   **Description:** Handles fertilizer application (from compost, manure, formula). Delegates to specialized handlers (`OnFertilizedWithFormula`, `OnFertilizedWithCompost`, `OnFertilizedWithManure`) based on nutrient type. Used by the `fertilizable` component.
*   **Parameters:** `inst` (entity instance), `fertilizer_obj` (entity).
*   **Returns:** `true` if nutrients were processed; `nil` otherwise.

### `OverrideAcidRainTickFn(inst, damage)`
*   **Description:** Overrides default acid rain damage behavior. Instead of taking damage, Wormwood gains formula-based fertilizer (which may advance bloom stage).
*   **Parameters:** `inst` (entity instance), `damage` (number, typically negative).
*   **Returns:** Nothing.

### `CalcBloomRateFn(inst, level, is_blooming, fertilizer)`
*   **Description:** Calculates bloom progress rate. Uses season modifiers and fertilizer amount to compute the tick rate. Used by `bloomness.calcratefn`.
*   **Parameters:** `inst` (entity instance), `level` (number), `is_blooming` (boolean), `fertilizer` (number).
*   **Returns:** Rate multiplier (number).

### `CalcFullBloomDurationFn(inst, value, remaining, full_bloom_duration)`
*   **Description:** Calculates how long full bloom lasts when fertilized during bloom phase. Respects `"wormwood_blooming_max_upgrade"` for extended duration. Used by `bloomness.calcfullbloomdurationfn`.
*   **Parameters:** `inst` (entity instance), `value` (fertilizer amount), `remaining` (current timer), `full_bloom_duration` (base duration).
*   **Returns:** New total timer value (number).

### `OnPollenDirty(inst)`
*   **Description:** Spawns local pollen FX when the `pollen` netvar changes (triggered via `"pollendirty"` event).
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `SpawnBloomFX(inst)`
*   **Description:** Spawns bloom transformation FX (e.g., `wormwood_bloom_fx`). Only runs on the client (not dedicated server).
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `WatchWorldPlants(inst)` / `StopWatchingWorldPlants(inst)`
*   **Description:** Listens for `"itemplanted"` and `"plantkilled"` events in the world and grants/penalizes sanity over time depending on distance (using `SanityRateFn` for gradual changes). Also triggers immediate sanity delta + announce for self-planted/killed plants. Used at spawn/resurrection and removed on ghosting/death.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `UpdatePhotosynthesisState(inst, isday)`
*   **Description:** Manages health regen via `"photosynthesis_skill"` source. Enabled only during full bloom + skill activation + daylight + not a ghost.
*   **Parameters:** `inst` (entity instance), `isday` (boolean).
*   **Returns:** Nothing.

### `PetLeash callbacks`
*   **`OnSpawnPet`, `OnDespawnPet`, `OnRemovedPet`**
    *   **Description:** Update pet-count-dependent effects for lightfliers (light radius, pattern order) and fruitdragons (max health, buffing). Triggers `RecalculateLightFlierLight`, `RecalculateLightFlierPattern`, and `RecalculateDragonHealth`.
    *   **Parameters:** `inst` (entity instance), `pet` (entity instance).
    *   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"itemplanted"` (world) — Sanity bonus for nearby planted crops.  
  - `"plantkilled"` (world) — Sanity penalty for nearby killed plants.  
  - `"equip"` / `"unequip"` — Manages headgear symbol override (`beard`).  
  - `"ms_becameghost"` — Resets bloom to 0, stops plant watching.  
  - `"ms_respawnedfromghost"` — Restores bloom and plant watching.  
  - `"ms_playerreroll"` / `"death"` — Removes all Wormwood pets.  
  - `"stopghostbuildinstate"` — Triggers bloom FX on exiting ghost build.  
  - `"pollendirty"` / `"bloomfxdirty"` — Client-side FX synchronization.  
  - `"newstate"` — Handles deferred morph if in `nomorph`.  
  - `"season"` world state — Applies spring fertilizer bonus at season change.  

- **Pushes:** No events directly.  
  - Uses `SanityRateFn` to incrementally apply sanity delta via `Sanity.DoDelta`.  
  - Talker announcements (`"ANNOUNCE_GROWPLANT"`, `"ANNOUNCE_KILLEDPLANT"`, `"ANNOUNCE_BLOOMING"`) via `talker:Say()`.