---
id: wx78_drone_scout
title: Wx78 Drone Scout
description: WX-78 character skill prefab that creates a scout drone entity for map exploration and area revelation, with delivery mechanics and skin support.
tags: [prefab, wx78, scout, drone, map]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 66b7d83a
system_scope: entity
---

# Wx78 Drone Scout

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`wx78_drone_scout.lua` registers a spawnable scout drone entity for the WX-78 character skill system. The prefab's `fn()` constructor runs on both client and master. Base entity setup (physics, anim, sound) occurs on both; master-only logic (gameplay components, stategraph, event listeners) is guarded by `if not TheWorld.ismastersim then return end`. The file also registers two additional prefabs via `MakeGlobalTrackingIcons` for map marker display. The drone travels to delivery destinations, reveals map areas during flight, and supports skin customization.

## Usage example
```lua
-- Spawn the scout drone at world origin:
local inst = SpawnPrefab("wx78_drone_scout")
inst.Transform:SetPosition(0, 0, 0)

-- Check drone tags after spawn:
local is_scout = inst:HasTag("mapscout")
```

## Dependencies & tags
**External dependencies:**
- `easing` -- provides interpolation functions for delivery movement (`inOutQuad`, `inQuad`, `linear`, `outQuad`)
- `MakeGlobalTrackingIcons` -- creates globalicon and revealableicon prefabs for map display
- `MakeFlyingCharacterPhysics` -- applies flying physics behavior

**Components used:**
- `spawnfader` -- handles fade-in/fade-out transitions when tracking starts/stops
- `inspectable` -- allows players to examine the drone
- `mapdeliverable` -- manages delivery destination travel and progress callbacks
- `globaltrackingicon` -- displays map markers visible to owner and other players
- `updatelooper` -- attached to beam entity for post-update position sync
- `soundemitter` -- plays flying idle sounds during movement

**Tags:**
- `mapscout` -- added in fn() for map system identification
- `staysthroughvirtualrooms` -- added in fn() to persist through room transitions
- `FX` -- added on decal entity
- `NOCLICK` -- added on decal and beam entities to prevent interaction
- `DECOR` -- added on beam entity

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of `Asset(...)` entries listing animation files for drone and map marker. |
| `prefabs` | table | `{...}` | Array of dependent prefab names: `wx78_drone_scout_globalicon`, `wx78_drone_scout_revealableicon`. |
| `scanning` | net_bool | `false` | Dirty event: `scanningdirty`. Controls whether scanning beam/decal is visible. |
| `build` | net_hash | `0` | Dirty event: `builddirty`. Stores skin build hash for visual customization. |
| `TUNING.SKILLS.WX78.SCOUTDRONE_SPEED` | constant | --- | Speed constant used in delivery time calculation and movement interpolation. |
| `TUNING.SKILLS.WX78.SCOUTDRONE_RANGE` | constant | --- | Base detection range for the scout drone. |
| `TUNING.SKILLS.WX78.SCOUTDRONE_RANGE_BONUS` | constant | --- | Range bonus from `wx78_scoutdrone_2` skill activation. |
| `TUNING.SKILLS.WX78.RADAR_SCOUTDRONERANGE` | constant | --- | Per-radar-module range bonus from `wx78_circuitry_betabuffs_1` skill. |

## Main functions
### `fn()`
*   **Description:** Prefab constructor that runs on both client and master. Base entity setup (physics, anim, sound) occurs on both; master-only logic (gameplay components, stategraph, event listeners) is guarded by `if not TheWorld.ismastersim then return end`.
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** None — runs on every host (client and server).

### `CreateDecal(skin_build)` (local)
*   **Description:** Creates the ground decal entity displayed beneath the drone during scanning. Sets animation bank/build based on skin, configures lighting and layering, and marks as non-persistent FX.
*   **Parameters:**
    - `skin_build` -- number skin build hash (0 for default)
*   **Returns:** decal entity instance
*   **Error states:** None.

### `CreateBeam(skin_build)` (local)
*   **Description:** Creates the scanning beam projection entity. Spawns a decal child entity, attaches updatelooper component for position sync, and sets cleanup callback.
*   **Parameters:**
    - `skin_build` -- number skin build hash (0 for default)
*   **Returns:** beam entity instance
*   **Error states:** None.

### `OnScanningDirty(inst)` (local)
*   **Description:** Callback triggered by `scanningdirty` netvar change on client. Creates or removes the beam entity based on scanning state. Only runs on non-dedicated clients.
*   **Parameters:**
    - `inst` -- drone entity instance
*   **Returns:** None
*   **Error states:** None.

### `SetScanning(inst, scanning)` (local)
*   **Description:** Sets the scanning netvar and triggers visual updates on non-dedicated clients. Controls whether the scanning beam is active.
*   **Parameters:**
    - `inst` -- drone entity instance
    - `scanning` -- boolean scanning state
*   **Returns:** None
*   **Error states:** None.

### `CalcDeliveryTime(inst, dest, doer)` (local)
*   **Description:** Calculates delivery duration based on distance to destination. Uses acceleration/deceleration distance threshold to determine if trip is short (2 seconds) or requires speed-based calculation.
*   **Parameters:**
    - `inst` -- drone entity instance
    - `dest` -- table with `x`, `z` destination coordinates
    - `doer` -- player entity initiating delivery (unused in calculation)
*   **Returns:** number delivery time in seconds
*   **Error states:** None.

### `OnStartDelivery(inst, dest, doer)` (local)
*   **Description:** Callback when delivery begins. Stores starting position, rotates drone to face destination, and enables scanning. Returns true to confirm delivery start.
*   **Parameters:**
    - `inst` -- drone entity instance
    - `dest` -- table with `x`, `z` destination coordinates
    - `doer` -- player entity initiating delivery
*   **Returns:** `true` to confirm delivery start
*   **Error states:** None.

### `OnDeliveryProgress(inst, t, len, origin, dest)` (local)
*   **Description:** Periodic callback invoked by mapdeliverable component each tick during delivery. Interpolates position using easing functions, updates physics velocity, reveals map area for owner when flying over unexplored terrain, and manages scanning state based on flight permission. Uses `_calc_k` helper for acceleration/deceleration curves.
*   **Parameters:**
    - `inst` -- drone entity instance
    - `t` -- number current time in delivery (seconds)
    - `len` -- number total delivery duration (seconds)
    - `origin` -- table with `x`, `z` starting coordinates
    - `dest` -- table with `x`, `z` destination coordinates
*   **Returns:** None
*   **Error states:** None

### `OnStopDelivery(inst, dest)` (local)
*   **Description:** Callback when delivery completes. Clears stored position, stops physics movement, and disables scanning.
*   **Parameters:**
    - `inst` -- drone entity instance
    - `dest` -- table with `x`, `z` destination coordinates
*   **Returns:** None
*   **Error states:** None.

### `OnBuilt(inst, data)` (local)
*   **Description:** Callback triggered by `onbuilt` event. Teleports drone to build position (y=1.5), plays deploy animation, and registers drone with owner's wx78_dronescouttracker component if builder has one.
*   **Parameters:**
    - `inst` -- drone entity instance
    - `data` -- table with `builder` entity reference
*   **Returns:** None
*   **Error states:** None

### `OnTracked(inst, tracker)` (local)
*   **Description:** Callback triggered by `ms_dronescout_tracked` event. Sets entity non-persistent, starts global tracking icon, and fades in if drone was idle (respawn scenario).
*   **Parameters:**
    - `inst` -- drone entity instance
    - `tracker` -- player entity tracking this drone
*   **Returns:** None
*   **Error states:** None

### `OnUntracked(inst, tracker)` (local)
*   **Description:** Callback triggered by `ms_dronescout_untracked` event. Sets entity persistent and clears global tracking icon owner.
*   **Parameters:**
    - `inst` -- drone entity instance
    - `tracker` -- player entity that stopped tracking
*   **Returns:** None
*   **Error states:** None

### `OnTrackerDespawn(inst, tracker)` (local)
*   **Description:** Callback triggered by `ms_dronescout_despawn` event. Fades out drone and schedules removal after fade completes via `spawnfaderout` event.
*   **Parameters:**
    - `inst` -- drone entity instance
    - `tracker` -- player entity whose tracker is despawning
*   **Returns:** None
*   **Error states:** None

### `OnEntityWake(inst)` (local)
*   **Description:** Lifecycle callback when entity becomes active (player nearby). Starts idle flying sound if not already playing.
*   **Parameters:**
    - `inst` -- drone entity instance
*   **Returns:** None
*   **Error states:** None.

### `OnEntitySleep(inst)` (local)
*   **Description:** Lifecycle callback when entity goes idle (no players nearby). Stops idle flying sound.
*   **Parameters:**
    - `inst` -- drone entity instance
*   **Returns:** None
*   **Error states:** None.

### `OnBuildDirty(inst)` (local)
*   **Description:** Callback triggered by `builddirty` netvar change on client. Updates beam and decal animation build/skin to match new skin build hash.
*   **Parameters:**
    - `inst` -- drone entity instance
*   **Returns:** None
*   **Error states:** None.

### `OnDroneScoutSkinChanged(inst, skin_build)` (local)
*   **Description:** Skin system callback when drone skin changes. Updates build netvar and triggers dirty callback to apply visual changes.
*   **Parameters:**
    - `inst` -- drone entity instance
    - `skin_build` -- number skin build hash (or nil/0 for default)
*   **Returns:** None
*   **Error states:** None.

### `GetDroneRange(inst, owner)` (local)
*   **Description:** Calculates effective scout drone range based on owner's skill tree activations. Adds base range, skill bonus from `wx78_scoutdrone_2`, and per-radar-module bonus from `wx78_circuitry_betabuffs_1`.
*   **Parameters:**
    - `inst` -- drone entity instance (unused)
    - `owner` -- player entity owning the drone
*   **Returns:** number effective range
*   **Error states:** None

## Events & listeners
- **Listens to:** `onbuilt` -- triggers OnBuilt; teleports to build position and registers with tracker
- **Listens to:** `ms_dronescout_tracked` -- triggers OnTracked; enables tracking and fades in
- **Listens to:** `ms_dronescout_untracked` -- triggers OnUntracked; disables tracking and sets persistent
- **Listens to:** `ms_dronescout_despawn` -- triggers OnTrackerDespawn; fades out and schedules removal
- **Listens to:** `scanningdirty` (client only) -- triggers OnScanningDirty; creates/removes scanning beam
- **Listens to:** `builddirty` (client only) -- triggers OnBuildDirty; updates skin visuals
- **Listens to:** `spawnfaderout` -- triggers `inst.Remove`; completes despawn after fade