---
id: alterguardian_lunar_fissures
title: Alterguardian Lunar Fissures
description: Manages lunar fissure prefabs for the Alterguardian boss phase, handling area-of-effect damage, animation state, fading, tracking of the boss entity, and grid-based placement during load.
tags: [combat, boss, fx, world]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f04eae20
system_scope: world
---

# Alterguardian Lunar Fissures

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines three prefabs used in the Alterguardian boss fight: the main fissure tile (`alterguardian_lunar_fissures`), its burning effect variant (`alterguardian_lunar_fissure_burn_fx`), and the supernova variant (`alterguardian_lunar_supernova_burn_fx`). The primary fissure prefab handles dynamic spawning of `lunarfissureburning` components on nearby entities via periodic area-of-effect checks, animates with fade-in/fade-out transitions using `easing`, and tracks the boss entity to self-destruct when the boss is removed or dies. It supports grid-based layout (e.g., 2x2 or larger fissures) via `OnLoadPostPass`, and integrates with `WagBossUtil` for saving, loading, and despawning.

## Usage example
```lua
-- Spawning a fissure at the center of the world
local fissure = SpawnPrefab("alterguardian_lunar_fissures")
fissure.Transform:SetPosition(0, 0, 0)

-- Attaching to a boss entity and configuring tracking
fissure.StartTrackingBoss(boss_entity)

-- Later, manually killing the fissure effect if needed
fissure.KillFx()

-- Querying the main entity instance in code
local x, y, z = fissure.Transform:GetWorldPosition()
```

## Dependencies & tags
**Components used:** `entitytracker`, `updatelooper`, `lunarfissureburning` (added to other entities via component access), `transform`, `animstate`, `network`.  
**Tags added by fissure tile:** `FX`, `NOCLICK`.  
**Tags added by burn effect variants:** `DECOR` or `FX`, `NOCLICK`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variation` | number | `1`–`4` (random integer) | Tile visual variant (1–4), set during construction. |
| `pre` | boolean | `true` initially | Internal flag indicating pre-animation is playing; becomes `nil` after animation ends. |
| `_fadeint` | number | `0` | Accumulated fade-in time in seconds. |
| `task` | task reference | `nil` | Reference to the periodic update task (`DoPeriodicTask`). |
| `OnEntityWake` | function | `StartUpdateTask` | Callback triggered when the entity wakes from sleep. |
| `OnEntitySleep` | function | `KillMe` | Callback triggered when the entity goes to sleep. |

## Main functions
### `StartTrackingBoss(inst, boss)`
* **Description:** Attaches to the boss entity and sets up event listeners for `onremove`, `death`, and `resetboss` to destroy the fissure when the boss ends. Replaces any existing boss tracking.
* **Parameters:**  
  `boss` (entity instance or `nil`) — the boss entity to track. Must be valid and not in limbo.
* **Returns:** Nothing.
* **Error states:** No-op if boss is invalid; clears old tracking if boss changes.

### `KillMe(inst)`
* **Description:** Tears down the fissure: cancels update tasks, removes event callbacks, stops fading, clears wake/sleep handlers, and calls `WagBossUtil.DespawnFissure`.
* **Parameters:** None.
* **Returns:** Nothing.

### `fissure_SetFxSize(inst, size)`
* **Description:** Plays an appropriate animation (`fissure_hit_*`) on burn-effect prefabs. Only used by `alterguardian_lunar_fissure_burn_fx`.
* **Parameters:**  
  `size` (string or number) — used to construct animation name (e.g., `"small"`, `"large"`).
* **Returns:** Nothing.
* **Error states:** No animation change if the requested animation is already playing.

### `supernova_SetFxSize(inst, size)`
* **Description:** Same as `fissure_SetFxSize`, but for supernova variants (`supernova_hit_*` animation set). Only used by `alterguardian_lunar_supernova_burn_fx`.
* **Parameters:** `size` (string or number) — animation size suffix.
* **Returns:** Nothing.

### `OnUpdate(inst)`
* **Description:** Runs periodically to apply `lunarfissureburning` component to nearby valid entities that lie within the circular AOE (using `CircleTouchesSquare` for precise overlap). Registers `REGISTERED_AOE_TAGS` on first run via `TheSim:RegisterFindTags`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Early exit if `inst:IsAsleep()` is `true`. Skips entities already having `lunarfissureburning`, in limbo, or invalid.

## Events & listeners
- **Listens to:**  
  - `animover` — triggers `OnAnimOver` to transition from `*_pre` to `*_loop` animations and start the update loop.  
  - `onremove` — on boss entity, handled via `inst._onremoveboss` to kill fissure.  
  - `death` — same as above.  
  - `resetboss` — same as above.  
- **Pushes:** None directly. Dependent prefabs and `WagBossUtil.DespawnFissure` handle cleanup events.

## Special Notes
- The fissure tile uses `TheSim:RegisterFindTags` to cache entity tags once per game session (`REGISTERED_AOE_TAGS` is a module-level variable).
- Backward compatibility: `OnLoad` and `OnLoadPostPass` handle older grid-size saved data where `data.size > 1`, reconstructing multi-cell fissure layouts.
- Fissures are **non-persistent** only for burn-effect variants (`fxfn`, `supernovafxfn`), not the main fissure tile.
- Fade-in uses `easing.outQuad` after the initial animation (via `UpdateFadeIn` and `EndFadeIn`). The entity starts fully transparent (`SetMultColour(1,1,1,0)`) and ends at `TRANSPARENCY = 0.5`.
- `OnEntitySleep` is assigned to `KillMe`, ensuring fissures vanish when the world sleeps, unlike standard entities.