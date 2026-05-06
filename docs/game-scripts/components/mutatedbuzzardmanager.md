---
id: mutatedbuzzardmanager
title: MutatedBuzzardManager
description: Manages mutated buzzard populations, migration tracking, and shadow spawning for players in lunar rift zones.
tags: [migration, lunar, wildlife, boss]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: fca8d5d2
system_scope: entity
---

# MutatedBuzzardManager

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`MutatedBuzzardManager` is a world-level component that manages mutated buzzard populations in conjunction with `MigrationManager` and `CorpsePersistManager`. It tracks buzzard groups migrating across the map, spawns circling shadow entities above players when buzzards are nearby, and handles corpse attraction mechanics during lunar rift events. This component only operates on the master simulation server.

## Usage example
```lua
-- Access the component on TheWorld entity (server only)
local manager = TheWorld.components.mutatedbuzzardmanager

-- Control buzzard dropping behavior
manager:SetDropBuzzardsSource("rift_inactive", true)
local shouldDrop = manager:GetDropBuzzards()

-- Track or clear population association with a player
manager:TrackPopulationOnPlayer(player, population)
manager:ClearPopulationTracking(player)

-- Debug inspection
local playerData = manager:Debug_GetPlayerData()
```

## Dependencies & tags
**External dependencies:**
- `prefabs/rift_portal_defs` -- imports `RIFTPORTAL_CONST` for lunar rift affinity checks

**Components used:**
- `migrationmanager` -- creates migration type, tracks populations, queries player migration data
- `riftspawner` -- monitors lunar rift pool state for buzzard drop conditions
- `corpsepersistmanager` -- registers corpse persistence source function
- `mutatedbuzzardcircler` -- attached to buzzard shadow entities for circling behavior

**Tags:**
- `buzzard` -- checked to exclude buzzards from corpse persistence attraction
- `insect` -- checked alongside small creature tags for exclusion
- `smallcreature` / `smallcreaturecorpse` -- size-based filtering for corpse attraction

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `TheWorld` | The owning entity instance (world entity on master sim). |

## Main functions
### `OnPostInit()`
* **Description:** Performs post-initialization setup including registering lunar rifts, updating rift state, and adding the corpse persistence source function to `CorpsePersistManager`. Called automatically after component initialization.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetDropBuzzardsSource(source, boolval)`
* **Description:** Sets a source modifier that controls whether buzzards should be dropped (killed and converted to corpses). Multiple sources can be active simultaneously via `SourceModifierList`.
* **Parameters:**
  - `source` -- string identifier for the source (e.g., `"rift_inactive"`, `"winter_active"`)
  - `boolval` -- boolean enabling or disabling this source
* **Returns:** None
* **Error states:** None

### `GetDropBuzzards()`
* **Description:** Returns the current aggregated state of all drop buzzard sources. Returns true if any source is enabled.
* **Parameters:** None
* **Returns:** boolean -- true if buzzards should be dropped, false otherwise
* **Error states:** None

### `TrackPopulationOnPlayer(player, population)`
* **Description:** Associates a buzzard population group with a specific player for tracking purposes. Sets the population UID and initializes a timer based on `TUNING.TOTAL_DAY_TIME`.
* **Parameters:**
  - `player` -- player entity to track
  - `population` -- population group table from MigrationManager
* **Returns:** None
* **Error states:** Errors if `player` is not a valid key in `_activeplayers` table (no nil guard present).

### `ClearPopulationTracking(player)`
* **Description:** Clears population tracking for a player, migrates the population to the next node, and clears all buzzard shadows associated with that population.
* **Parameters:** `player` -- player entity to clear tracking for
* **Returns:** None
* **Error states:** Errors if `player` is not a valid key in `_activeplayers` table (no nil guard present).

### `UpdateTimers(dt)`
* **Description:** Updates all internal timers including megaflare node timers, death attraction timers, and player population tracking timers. Called every frame from `OnUpdate`.
* **Parameters:** `dt` -- delta time in seconds since last update
* **Returns:** None
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Main update loop that handles buzzard spawning, shadow management, and population migration logic. Runs on a throttled interval (`UPDATE_TIME_SECONDS`). Spawns shadows for players near buzzard populations or clears tracking if invalid.
* **Parameters:** `dt` -- delta time in seconds since last update
* **Returns:** None
* **Error states:** Errors if `_migrationmanager` is nil when calling migration functions (no nil guard present).

### `OnSave()`
* **Description:** Serializes component state for save persistence. Returns tables containing `megaflare_nodes` and `death_nodes` timer data.
* **Parameters:** None
* **Returns:** `data` (table), `ents` (table) -- save data and entity references, or `nil, nil` if no data to save
* **Error states:** None

### `OnLoad(data)`
* **Description:** Restores component state from saved data. Reconstructs `megaflare_nodes` and `death_nodes` timer tables.
* **Parameters:** `data` -- table containing saved timer data from `OnSave`
* **Returns:** None
* **Error states:** None

### `Debug_GetPlayerData()`
* **Description:** Debug function that returns the internal `_activeplayers` table containing all tracked player data including population UIDs and timers.
* **Parameters:** None
* **Returns:** table -- internal player tracking data
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns a debug string representation of component state. Currently returns an empty formatted string.
* **Parameters:** None
* **Returns:** string -- empty string in current implementation
* **Error states:** None

## Events & listeners
**Listens to:**
- `ms_playerjoined` (world) -- registers new player in active players table
- `ms_playerleft` (world) -- removes player from active players table
- `ms_registermutatedbuzzard` (world) -- registers a buzzard entity in tracking
- `megaflare_detonated` (world) -- records megaflare detonation location and timer
- `entity_death` (world) -- records death location for corpse attraction
- `ms_riftaddedtopool` (world) -- tracks lunar rift addition to pool
- `ms_riftremovedfrompool` (world) -- tracks lunar rift removal from pool
- `onremove` (buzzard/shadow entities) -- unregisters entities from tracking tables
- `death` (buzzard entities) -- unregisters dead buzzards from tracking
- `shadowkilled` (shadow entities) -- unregisters killed shadows from tracking

**Pushes:** None identified