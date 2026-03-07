---
id: penguinspawner
title: Penguinspawner
description: Manages penguin flock spawning, colony formation, and seasonal population control in winter.
tags: [spawn, season, colony, winter, ai]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8c7cc50b
system_scope: world
---

# Penguinspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Penguinspawner` is a server-only component responsible for spawning penguin flocks during winter. It dynamically establishes penguin colonies with rookeries (marked by `penguin_ice` prefabs), manages colony membership, tracks mutated vs non-mutated flocks, and enforces distance and timing constraints. It integrates with `KnownLocations` to assign rookery/home positions to spawned penguins and responds to player join/leave and seasonal tick events. The component only exists on the mastersim to ensure deterministic world state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("penguinspawner")
-- No further manual setup is required; the component activates automatically on add.
-- It will begin spawning flocks during winter if _spawnInterval > 0 and world conditions permit.
```

## Dependencies & tags
**Components used:** `knownlocations`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `AddToColony(colonyNum, pengu)`
*   **Description:** Adds a penguin entity to a specified colony, registers death/onremove callbacks, updates total bird count, and sets the penguin's `colonyNum` and known locations (`rookery` and `home`).
*   **Parameters:**  
    `colonyNum` (number or nil) – index of the colony in `_colonies`; if `nil`, the penguin is not added to any colony.  
    `pengu` (Entity) – the penguin prefab instance to add.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; silently does nothing if `colonyNum` is out of bounds.

### `OnSave()`
*   **Description:** Serializes colony data (rookery positions and mutation status) for world save.
*   **Parameters:** None.
*   **Returns:** `data` (table) – table with key `colonies`, where each entry is `{x, y, z, is_mutated, numspawned}`.

### `OnLoad(data)`
*   **Description:** Loads saved colony data and reconstructs `penguin_ice` rookeries.
*   **Parameters:**  
    `data` (table or nil) – save data containing `colonies` array.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted string with current penguin/cr colony counts and spawn timing info for debugging.
*   **Parameters:** None.
*   **Returns:** `string` – e.g., `"12/48 Penguins, 3/6 Colonies, next spawn in : 2.3"`.

### `SpawnModeNever()`, `SpawnModeLight()`, `SpawnModeNormal()`, `SpawnModeMed()`, `SpawnModeHeavy()`
*   **Description:** These methods exist but are deprecated and no-op.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `ms_playerjoined` – adds player to `_activeplayers` list for round-robin spawning.  
  `ms_playerleft` – removes player from `_activeplayers` list.  
  `ms_setpenguinnumboulders` – not implemented in this file (handled externally).  
  `seasontick` – triggers colony cleanup when season changes from winter.  
  `death`, `onremove` – per-penguin death callbacks to update colony counts and remove from `_totalBirds`.

- **Pushes:** No events.

## Usage notes
- This component is not intended to be added manually on the client; it asserts `TheWorld.ismastersim` on initialization.
- Penguin spawning only occurs during winter, and only if the season has more than 3 days remaining, flocks have room, and a valid land spot near water is found.
- Colonies can become mutated if more than half their members carry the `mutated_penguin` tag; this is reflected in the rookery's `penguin_ice` minimap icon.
- Round-robin player selection ensures fair spawning opportunities across active players.
