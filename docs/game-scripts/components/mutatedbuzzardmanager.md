---
id: mutatedbuzzardmanager
title: Mutatedbuzzardmanager
description: Manages mutated buzzard gestalt populations, tracks circling shadows for players, and controls spawning/dropping behavior in response to rift states, megaflares, and deaths.
tags: [boss, ai, migration, environment, rift]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 83ac3648
system_scope: environment
---

# Mutatedbuzzardmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Mutatedbuzzardmanager` is a server-side component responsible for managing mutated buzzard gestalt populations and their associated circling shadow entities (`circlingbuzzard_lunar`). It coordinates population migration across world nodes, tracks player associations with migrating groups, spawns shadows that circle players, and drops actual buzzards under specific conditions (e.g., inactive rifts or winter). It interfaces with `migrationmanager` for population logic, `corpsepersistmanager` to extend corpse persistence near buzzards, and `riftspawner` to react to lunar portal states.

## Usage example
```lua
-- Typically added automatically to the world entity on server init
-- Example of manual usage in a mod:
local world = TheWorld
world:AddComponent("mutatedbuzzardmanager")
world.components.mutatedbuzzardmanager:SetDropBuzzardsSource("winter_active", true)
```

## Dependencies & tags
**Components used:** `corpsepersistmanager`, `migrationmanager`, `riftspawner`, `mutatedbuzzardcircler`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `SetDropBuzzardsSource(source, boolval)`
* **Description:** Enables or disables a named source that triggers buzzard dropping behavior (e.g., `rift_inactive`, `winter_active`). When any active source is `true`, `Mutatedbuzzardmanager` will begin dropping buzzards periodically.
* **Parameters:**  
  - `source` (string) — Identifier for the trigger source (e.g., `"rift_inactive"`).  
  - `boolval` (boolean) — Whether this source should activate buzzard dropping.
* **Returns:** Nothing.

### `GetDropBuzzards()`
* **Description:** Returns whether buzzard dropping is currently active due to any registered source.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if at least one active source is enabled, otherwise `false`.

### `TrackPopulationOnPlayer(player, population)`
* **Description:** Associates a player with a specific mutated buzzard gestalt population, ensuring that population follows the player and shadows are spawned for them.
* **Parameters:**  
  - `player` (Entity) — The player entity.  
  - `population` (table) — Migration population group table from `migrationmanager`.
* **Returns:** Nothing.

### `ClearPopulationTracking(player)`
* **Description:** Clears the player's association with a buzzard population and triggers migration to the next node if needed. Removes any circling shadows for that population.
* **Parameters:**  
  - `player` (Entity) — The player entity.
* **Returns:** Nothing.

### `OnPostInit()`
* **Description:** Initializes the component after the world is fully loaded. Registers corpse persistence logic and pre-populates lunar rift data.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes transient state (e.g., megaflare and death attraction timers) for savegame persistence.
* **Parameters:** None.
* **Returns:** `data` (table or `nil`) — Serialized state or `nil` if empty; `ents` (table) — Always `nil` in this implementation.

### `OnLoad(data)`
* **Description:** Restores transient state from saved data (e.g., megaflare and death attraction timers).
* **Parameters:**  
  - `data` (table) — Data from `OnSave`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `ms_playerjoined` — Registers new players.  
  - `ms_playerleft` — Removes leaving players.  
  - `ms_registermutatedbuzzard` — Registers a new buzzard instance.  
  - `megaflare_detonated` — Records megaflare proximity timer for node distraction.  
  - `entity_death` — Records death attraction timer for node.  
  - `ms_riftaddedtopool` — Adds rift node mapping and updates rift state.  
  - `ms_riftremovedfrompool` — Removes rift node mapping and updates rift state.  
- **Pushes:** None.

## Notes
- This component only exists on the **server** (`TheWorld.ismastersim`) and is typically added to the world entity.
- It relies heavily on tuning constants (e.g., `MUTATEDBUZZARD_MIGRATE_TIME_BASE`, `MUTATEDBUZZARD_MAX_SHADOWS`) defined in `TUNING`.
- Shadow circling is handled by the `mutatedbuzzardcircler` component attached to `circlingbuzzard_lunar` prefabs.
