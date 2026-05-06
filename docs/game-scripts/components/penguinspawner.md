---
id: penguinspawner
title: Penguinspawner
description: Manages seasonal penguin colony spawning, tracking, and lifecycle for winter events.
tags: [spawning, seasonal, wildlife]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: components
source_hash: 1f177db6
system_scope: environment
---

# Penguinspawner

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`Penguinspawner` is a server-only component that manages the seasonal spawning of penguin colonies during winter. It tracks active players, establishes colony rookeries near water sources, and maintains limits on total penguin populations. The component automatically cleans up colonies when winter ends and supports mutated penguin variants in lunacy areas.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("penguinspawner")

-- Colony management
inst.components.penguinspawner:AddToColony(1, penguin_entity)

-- Save/Load support
local save_data = inst.components.penguinspawner:OnSave()
inst.components.penguinspawner:OnLoad(save_data)

-- Debug info
print(inst.components.penguinspawner:GetDebugString())
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- reads penguin tuning constants (flock size, max colonies, spawn interval)
- `TheWorld` -- accesses world state for season checks and player events
- `TheSim` -- entity finding and spawning operations
- `AllPlayers` -- initializes active player list on component creation

**Components used:**
- `knownlocations` -- called on penguin entities to remember rookery and home locations

**Tags:**
- `mutated_penguin` -- checked on penguin entities to determine colony mutation status

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | N/A (set in constructor) | The owning entity instance (server-only). |

## Main functions
### `AddToColony(colonyNum, pengu)`
* **Description:** Adds a penguin entity to the specified colony, registers death/remove listeners, and stores rookery location in the penguin's knownlocations component. Updates colony mutation status based on member composition.
* **Parameters:**
  - `colonyNum` -- integer colony index in `_colonies` table
  - `pengu` -- penguin entity instance to add
* **Returns:** None
* **Error states:** Errors if `pengu` has no `knownlocations` component (nil dereference on `pengu.components.knownlocations` -- no guard present).

### `SpawnModeNever()`
* **Description:** Deprecated spawn mode setter. No longer functional.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnModeLight()`
* **Description:** Deprecated spawn mode setter. No longer functional.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnModeNormal()`
* **Description:** Deprecated spawn mode setter. No longer functional.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnModeMed()`
* **Description:** Deprecated spawn mode setter. No longer functional.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnModeHeavy()`
* **Description:** Deprecated spawn mode setter. No longer functional.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnSave()`
* **Description:** Serializes colony data for save persistence. Returns colony rookery positions, mutation status, and spawn counts.
* **Parameters:** None
* **Returns:** Table with `colonies` array containing position vectors and metadata, or empty table if no colonies exist.
* **Error states:** None

### `OnLoad(data)`
* **Description:** Restores colony data from save. Spawns penguin_ice prefabs at saved rookery positions and reconstructs colony tracking.
* **Parameters:** `data` -- save table from `OnSave()` or nil
* **Returns:** None
* **Error states:** None (handles nil data gracefully)

### `GetDebugString()`
* **Description:** Returns debug information about current penguin and colony counts, limits, and next spawn timing.
* **Parameters:** None
* **Returns:** String containing population statistics and spawn timer info.
* **Error states:** None

## Events & listeners
- **Listens to:** `ms_playerjoined` (from TheWorld) -- tracks new players for spawn eligibility
- **Listens to:** `ms_playerleft` (from TheWorld) -- removes departed players from active list
- **Listens to:** `ms_setpenguinnumboulders` (from TheWorld) -- referenced but handler not defined in source
- **Listens to:** `seasontick` (from self.inst) -- cleans up all colonies when winter ends
- **Listens to:** `death` (from penguin entities) -- removes dead penguins from colony tracking
- **Listens to:** `onremove` (from penguin entities) -- removes despawned penguins from colony tracking
- **Pushes:** None identified