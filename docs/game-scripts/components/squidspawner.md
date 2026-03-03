---
id: squidspawner
title: Squidspawner
description: Manages squid spawning based on player locations, moon phase, time of day, and nearby ocean trawlers during nights and dusk.
tags: [world, spawning, mob, moon]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 776f8d45
system_scope: world
---

# Squidspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Squidspawner` is a world-scoped component responsible for periodically spawning squid herds during nighttime and dusk. It evaluates player positions to determine spawn locations, adjusts spawn chance based on moon phase and number of nearby fishable entities, and accounts for ocean trawler modifications via the `oceantrawler` component. This component only runs on the master simulation (`TheWorld.ismastersim`) and is attached to the world entity.

## Usage example
```lua
-- Automatically attached to TheWorld in the game's startup sequence.
-- Manual usage is not typical, but for testing or modding:
TheWorld.components.squidspawner:Debug_ForceTestForSquid()
```

## Dependencies & tags
**Components used:** `oceantrawler` (via `GetOceanTrawlerSpawnChanceModifier`)
**Tags:** References tags `squid`, `oceanfish`, `oceanfishable`, and `oceantrawler` internally during entity searches.
**Tags added/removed:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The entity instance that owns this component (the world). |

## Main functions
### `Debug_ForceTestForSquid()`
* **Description:** Forces an immediate squid spawn test regardless of time of day. Used for debugging and mod testing.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None — safe to call at any time.

## Events & listeners
- **Listens to:**  
  - `ms_playerjoined` — adds new players to the active player list.  
  - `ms_playerleft` — removes leaving players from the active player list.  
  - `"phase"` world state change — triggers `spawntask()` to restart the spawn schedule.  
- **Pushes:** None.

### `spawntask()`
* **Description:** Internal scheduled task that runs `testforsquid()` during night/dusk, and schedules the next execution based on `TUNING.SEG_TIME`. If it's daytime, it cancels any pending task.
* **Parameters:** None (method on `inst`).
* **Returns:** Nothing.

### `testforsquid(forcesquid)`
* **Description:** Core logic for evaluating spawn conditions across active players. Iterates over nearby players, computes spawn chance based on moon phase, fish count, ocean trawler modifiers, and time of day, and spawns squid herds when successful.
* **Parameters:**  
  - `forcesquid` (boolean) — if `true`, skips time-of-day checks and forces spawn attempts.  
* **Returns:** Nothing.
* **Error states:**  
  - Skips all spawns if `forcesquid` is `false` and `TheWorld.state.isday` is `true`.  
  - Herd spawn fails silently if `FindSwimmableOffset()` returns `nil`.

### `do_squid_spawn_for_herd(herd, spawnpoint)`
* **Description:** Internal helper that spawns a single squid and adds it to a given squid herd. Sets position and fires the `"spawn"` event on the squid.
* **Parameters:**  
  - `herd` (entity) — a `squidherd` instance.  
  - `spawnpoint` (vector3) — position to place the squid.  
* **Returns:** Nothing.
* **Error states:** None — assumes `herd.components.herd` exists.

### `GetOceanTrawlerChanceModifier(spawnpoint)`
* **Description:** Scans for nearby ocean trawlers and returns their spawn chance modifier at the spawn location, or `1` if none found.
* **Parameters:**  
  - `spawnpoint` (vector3) — point to test for nearby trawlers.  
* **Returns:** (number) spawn chance modifier (e.g., `TUNING.OCEAN_TRAWLER_SPAWN_FISH_MODIFIER` if trawler is lowered and full).
