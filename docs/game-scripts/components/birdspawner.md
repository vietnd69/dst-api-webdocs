---
id: birdspawner
title: Birdspawner
description: Manages bird spawning, tracking, and lunar hail event mechanics for the world.
tags: [world, spawning, events]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: e2ec8a00
system_scope: world
---

# Birdspawner

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Birdspawner` is a world-level component that manages bird entity spawning, tracking, and population control. It handles normal bird spawning based on tile types and player proximity, as well as special lunar hail event mechanics that spawn bird corpses. The component monitors world state changes (rain, night, lunar hailing) and adjusts spawn rates accordingly. It only exists on the master simulation server.

## Usage example
```lua
-- Birdspawner is automatically added to TheWorld entity on server init
local birdspawner = TheWorld.components.birdspawner

-- Spawn a bird at a specific position
local pos = Vector3(10, 0, 10)
local spawnpoint = birdspawner:GetSpawnPoint(pos)
if spawnpoint then
    birdspawner:SpawnBird(spawnpoint)
end

-- Add a time scale modifier for custom spawn rate adjustments
birdspawner:SetTimeScaleModifier(0.5, "custom_modifier")

-- Track a bird entity to prevent persistence
birdspawner:StartTracking(bird_inst)
```

## Dependencies & tags
**External dependencies:**
- `util/sourcemodifierlist` -- manages time scale modifiers for spawn rates
- `easing` -- provides easing functions for post-hail recovery calculations

**Components used:**
- `timer` -- manages hail event timers and post-hail recovery periods
- `talker` -- announces lunar hail events to players
- `eater` -- checks if spawned birds can eat nearby bait
- `inventoryitem` -- verifies bait is not being held by a player
- `bait` -- identifies bait entities for bird spawning logic
- `trap` -- checks trap status for bird spawning near traps
- `floater` -- determines if bird can spawn on water
- `birdattractor` -- modifies spawn rates based on player attractors
- `lunarhailbirdsoundmanager` -- controls sound levels during hail events
- `moonstorms` -- checks if spawn point is in moonstorm zone

**Tags:**
- `bird` -- checked on spawned entities
- `birdcorpse` -- identifies corpse entities during hail events
- `scarecrow` -- influences bird type selection (canary vs crow)
- `carnivaldecor` -- carnival event decoration check
- `carnivaldecor_ranker` -- carnival event ranker check
- `scarytoprey` -- danger detection for spawn point validation
- `birdblocker` -- prevents spawning in blocked areas
- `INLIMBO` -- excluded from bait search
- `outofreach` -- excluded from bait search

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The owning entity instance (TheWorld). |

## Main functions
### `OnPostInit()`
* **Description:** Initializes the component after all entities are loaded. Sets up initial weather state, lunar hail state, and begins spawn updates.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `ToggleUpdate()`
* **Description:** Forces an update check for bird spawning. Re-schedules spawn tasks for all active players if spawning is enabled.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GetSpawnPoint(pt, is_corpse)`
* **Description:** Finds a valid spawn point near the given position. Checks for passability, creep, moonstorms, and bird blockers.
* **Parameters:**
  - `pt` -- Vector3 position to search around
  - `is_corpse` -- boolean, if true allows spawning in moonstorms and on creep
* **Returns:** Vector3 spawn position or `nil` if no valid point found.
* **Error states:** Errors if `pt` is nil (no nil guard before `pt + offset` in internal TestSpawnPoint function).

### `SpawnBird(spawnpoint, ignorebait)`
* **Description:** Spawns a bird entity at the given spawn point. May redirect to nearby bait or traps if conditions are met.
* **Parameters:**
  - `spawnpoint` -- Vector3 position to spawn at
  - `ignorebait` -- boolean, if true skips bait/trap detection
* **Returns:** Bird entity instance or `nil` if spawn failed.
* **Error states:** Errors if `spawnpoint` is nil when accessing `spawnpoint.x`, `spawnpoint.z`.

### `SpawnBirdCorpse(spawnpoint)`
* **Description:** Spawns a bird corpse entity at the given spawn point. Used during lunar hail events. Sets appropriate build and bank based on bird type.
* **Parameters:** `spawnpoint` -- Vector3 position to spawn at
* **Returns:** Corpse entity instance or `nil` if spawn failed.
* **Error states:** Errors if `spawnpoint` is nil when accessing `spawnpoint.y` or calling `spawnpoint:Get()`.

### `SpawnCorpseForPlayer(player)`
* **Description:** Spawns a bird corpse near the specified player. Used by Wickerbottom's book and hail events.
* **Parameters:** `player` -- player entity to spawn near
* **Returns:** Corpse entity instance or `nil` if spawn failed.
* **Error states:** Errors if `player` is nil when calling `player:GetPosition()`.

### `StartTracking(target)`
* **Description:** Begins tracking a bird entity. Prevents the bird from persisting through saves and listens for sleep events.
* **Parameters:** `target` -- bird entity to track
* **Returns:** None
* **Error states:** Errors if `target` is nil (accesses `target.persists` with no nil guard in StartTrackingFn).

### `StopTracking(target)`
* **Description:** Stops tracking a bird entity. Restores persistence setting and removes sleep event listener.
* **Parameters:** `target` -- bird entity to stop tracking
* **Returns:** None
* **Error states:** None

### `SetBirdTypesForTile(tile_id, bird_list)`
* **Description:** Modifies which bird types can spawn on a specific tile type. Intended for mod use.
* **Parameters:**
  - `tile_id` -- number, the tile ID to modify
  - `bird_list` -- table, array of bird prefab names
* **Returns:** None
* **Error states:** None

### `SetTimeScaleModifier(factor, key)`
* **Description:** Adds a multiplier to the bird spawn time scale. Intended for mod use.
* **Parameters:**
  - `factor` -- number, multiplier value
  - `key` -- string, unique identifier for this modifier
* **Returns:** None
* **Error states:** None

### `RemoveTimeScaleModifier(key)`
* **Description:** Removes a previously added time scale modifier.
* **Parameters:** `key` -- string, the modifier identifier to remove
* **Returns:** None
* **Error states:** None

### `GetPostHailEasingMult()`
* **Description:** Returns the current easing multiplier for post-hail recovery period. Returns value between `0` and `1`.
* **Parameters:** None
* **Returns:** Number between `0` and `1`, or `1` if no post-hail timer active.
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns a debug string with current bird count, max birds, time scale modifier, and post-hail easing value.
* **Parameters:** None
* **Returns:** String containing debug information.
* **Error states:** None

### `SetSpawnTimes()`
* **Description:** Deprecated. No longer has any effect.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetMaxBirds()`
* **Description:** Deprecated. No longer has any effect.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnModeNever()`
* **Description:** Deprecated. No longer has any effect.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnModeLight()`
* **Description:** Deprecated. No longer has any effect.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnModeMed()`
* **Description:** Deprecated. No longer has any effect.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnModeHeavy()`
* **Description:** Deprecated. No longer has any effect.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `ms_playerjoined` -- adds player to active list and schedules spawns
- **Listens to:** `ms_playerleft` -- removes player from active list and cancels their spawn tasks
- **Listens to:** `timerdone` -- handles hail event timer completions (sounds, corpses, ambience return)
- **Listens to:** `entitysleep` -- on tracked birds, removes them if they fall asleep
- **Watches:** `islunarhailing` -- starts/stops hail event timers and sound levels
- **Watches:** `israining` -- applies rain spawn rate modifier
- **Watches:** `isnight` -- toggles spawning updates on/off