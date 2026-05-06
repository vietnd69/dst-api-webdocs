---
id: lureplantspawner
title: Lureplantspawner
description: Manages dynamic lure plant spawning based on player movement trails during Spring season.
tags: [spawning, environment, seasonal]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: components
source_hash: 57df59b1
system_scope: environment
---

# Lureplantspawner

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`Lureplantspawner` is a server-only component that dynamically spawns lure plants near player movement trails during Spring season. It tracks player positions over time, building a weighted trail system that influences where new lure plants appear. The component uses scheduled tasks to log player locations and randomize spawn timing based on tuning constants.

## Usage example
```lua
-- Component is automatically attached to TheWorld on server startup
local spawner = TheWorld.components.lureplantspawner
-- Spawning only occurs during Spring season
local debug = spawner:GetDebugString()
print(debug)
```

## Dependencies & tags
**External dependencies:**
- `TheWorld` -- accesses world state, map, and listens to global events
- `TheWorld.state` -- checks current season for spawning eligibility
- `TheWorld.Map` -- validates spawn point tiles via `GetTileAtPoint()`
- `TheSim` -- finds nearby entities via `FindEntities()`
- `TUNING` -- reads `LUREPLANT_SPAWNINTERVAL` and `LUREPLANT_SPAWNINTERVALVARIANCE`
- `SpawnPrefab()` -- instantiates lure plant prefabs at calculated locations
- `AllPlayers` -- iterates to initialize active player tracking table
- `WORLD_TILES` -- defines valid tile types for lure plant spawning
- `TryLuckRoll()` -- calculates spawn probability based on player luck
- `LuckFormulas` -- provides LureplantChanceSpawn formula for spawn probability
- `TWOPI` -- constant used for circular spawn location calculations
- `Vector3` -- creates position vectors for trail logging and spawn calculations

**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The entity instance that owns this component. |

## Main functions
### `SpawnModeNever()`
* **Description:** Deprecated spawn mode function. No longer has any effect on spawning behavior.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnModeHeavy()`
* **Description:** Deprecated spawn mode function. No longer has any effect on spawning behavior.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnModeNormal()`
* **Description:** Deprecated spawn mode function. No longer has any effect on spawning behavior.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnModeMed()`
* **Description:** Deprecated spawn mode function. No longer has any effect on spawning behavior.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnModeLight()`
* **Description:** Deprecated spawn mode function. No longer has any effect on spawning behavior.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing current spawn interval and variance values.
* **Parameters:** None
* **Returns:** String in format `spawn interval:X.XX, variance:X.XX`
* **Error states:** None

## Events & listeners
- **Listens to:** `ms_playerjoined` - adds joining player to active player tracking table and schedules their tasks
- **Listens to:** `ms_playerleft` - removes leaving player from tracking and cancels their scheduled tasks
- **Listens to:** `seasontick` - starts updating during Spring season, stops updating during other seasons