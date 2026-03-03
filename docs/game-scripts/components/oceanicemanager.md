---
id: oceanicemanager
title: Oceanicemanager
description: Manages dynamic creation, damage, and destruction of ocean ice tiles in the world map, including entity interactions and visual effects.
tags: [ice, world, environment, physics]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: a7a2b308
system_scope: environment
---

# Oceanicemanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Oceanicemanager` is a server-side-only component responsible for dynamically managing ocean ice tiles in the world map. It handles ice tile health, damage propagation, visual crack effects, and entity interactions (e.g., launching debris or kelp, handling drowned entities). It integrates with map rendering, physics, and world state systems to ensure coordinated ice destruction and re-creation behavior across the game world.

## Usage example
```lua
-- Typically added automatically to TheWorld on the master sim.
-- Example interaction: damage a tile and destroy it.
if TheWorld.components.oceanicemanager then
    local x, y, z = 10, 0, -20
    TheWorld.components.oceanicemanager:DamageIceAtPoint(x, y, z, 20)
    TheWorld.components.oceanicemanager:QueueDestroyForIceAtPoint(x, y, z)
end
```

## Dependencies & tags
**Components used:** `undertile`, `sharkboimanager`, `boatphysics`, `inventoryitem`, `oceanfishable`, `pickable`, `stackable`, `floater`, `walkableplatform`, `drownable`, `amphibiouscreature`, `complexprojectile`
**Tags:** Uses internal tag sets (e.g., `CRACK_MUST_TAGS`, `IGNORE_ICE_DROWNING_ONREMOVE_TAGS`) for entity filtering; does not directly add or remove tags on entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance (typically `TheWorld`) the component is attached to. |

*No other public properties are initialized or exposed directly.*

## Main functions
### `CreateIceAtPoint(x, y, z)`
* **Description:** Spawns an ice tile at the given world coordinates, initializing its health, removing or modifying nearby entities (kelp, items), and updating floater entity state.
* **Parameters:** `x`, `y`, `z` (numbers) — world coordinates of the ice center point.
* **Returns:** `true` on success.
* **Error states:** Returns early if ice already exists at the location.

### `QueueCreateIceAtPoint(x, y, z, data)`
* **Description:** Schedules delayed ice tile creation at the specified location if none exists. Optionally accepts custom timing via `data`.
* **Parameters:**  
  - `x`, `y`, `z` (numbers) — world coordinates.  
  - `data` (table, optional) — may contain `base_time` and `random_time` overrides for scheduling.
* **Returns:** Nothing.

### `DestroyIceAtPoint(x, y, z, data)`
* **Description:** Immediately destroys the ice tile at the given location, spawns FX/debris, handles floater/ice floe creation, and repositions nearby entities.
* **Parameters:**  
  - `x`, `y`, `z` (numbers) — world coordinates.  
  - `data` (table, optional) — may set `silent` (suppress FX) or `icefloe_prefab`.
* **Returns:** `true` if destruction succeeded; `false` if no ice was present.
* **Error states:** Returns `false` if the tile is not `OCEAN_ICE`.

### `QueueDestroyForIceAtPoint(x, y, z, data)`
* **Description:** Schedules delayed ice destruction, triggers crack FX, and notifies entities on the tile of abandonment/presink events.
* **Parameters:**  
  - `x`, `y`, `z` (numbers) — world coordinates.  
  - `data` (table, optional) — may specify `destroytime` (in frames).
* **Returns:** Nothing.

### `DamageIceAtPoint(x, y, z, damage)`
* **Description:** Applies damage to the ice tile at world coordinates; returns new health or `nil` if no ice exists.
* **Parameters:**  
  - `x`, `y`, `z` (numbers) — world coordinates.  
  - `damage` (number) — amount of health to subtract.
* **Returns:** Number (new health value) or `nil`.

### `DamageIceAtTile(tx, ty, damage)`
* **Description:** Like `DamageIceAtPoint`, but operates on tile coordinates (`tx`, `ty`).
* **Parameters:**  
  - `tx`, `ty` (numbers) — tile X/Y coordinates.  
  - `damage` (number) — health deduction.
* **Returns:** Number (new health) or `nil`.

### `SpawnDamagePrefab(tile_index, health)`
* **Description:** Creates or updates the `oceanice_damage` FX prefab at the given tile based on current health.
* **Parameters:**  
  - `tile_index` (number) — index into `_ice_health_grid`.  
  - `health` (number) — current ice health.
* **Returns:** Nothing.

### `FixupFloaterObjects(x, z, tile_radius_plus_overhang, is_ocean_tile)`
* **Description:** Updates `floater` components for nearby entities when terrain changes (e.g., ice creation/removal).
* **Parameters:**  
  - `x`, `z` (numbers) — center point coordinates.  
  - `tile_radius_plus_overhang` (number) — search radius.  
  - `is_ocean_tile` (boolean) — whether the tile is ocean (triggers `on_landed`/`on_no_longer_landed` events).
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes grid state (`marked_for_delete_grid`, `ice_health_grid`) for world save.
* **Returns:** String — compressed, encoded save data.

### `OnLoad(data)`
* **Description:** Restores grid state from save data and resumes pending ice destruction or damage FX.
* **Parameters:** `data` (string) — save data string.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `worldmapsetsize` — triggers grid initialization.
- **Pushes:** `icefloebreak` — fired when an ice floe is created (see `DestroyIceAtPoint`), and internally via `QueueDestroyForIceAtPoint`, entities receive `abandon_ship` / `onpresink` events if standing on ice.
