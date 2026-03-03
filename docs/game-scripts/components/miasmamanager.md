---
id: miasmamanager
title: Miasmamanager
description: Manages miasma cloud generation, spread, strength, and decay in the world map, primarily in relation to rifts and vents.
tags: [environment, world, spawn, map]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 76a65bb6
system_scope: world
---

# Miasmamanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MiasmaManager` is a world-scoped component responsible for simulating miasma fog behavior across the map. It manages miasma cloud entities, their creation at valid locations (near rifts or vents), propagation to adjacent tiles, dynamic strength changes, and decay. The component runs only on the master simulation and interacts closely with `riftspawner` to coordinate miasma spawning around shadow-affinity rifts. It is not used on the client.

## Usage example
```lua
-- Add the component to the world entity (typically done in world initialization):
TheWorld:AddComponent("miasmamanager")

-- Enable miasma simulation:
TheWorld.components.miasmamanager:SetMiasmaActive(true)

-- Manually force a miasma action roll:
local action = TheWorld.components.miasmamanager:DoRolls()
```

## Dependencies & tags
**Components used:** `riftspawner` (via `_world.components.riftspawner`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity reference | `nil` | The entity (world) that owns this component. Set in constructor. |
| `_miasma_grid` | DataGrid | `nil` | Internal grid storing miasma tile data. Initialized on `worldmapsetsize`. |
| `enabled` | boolean | `false` | Whether miasma simulation is active. Controlled by `SetMiasmaActive`. |
| `_lastupdate_spread` | number | `0` | Timestamp (game time) of last spread-related update. |
| `_lastupdate_diminish` | number | `0` | Timestamp (game time) of last diminish-related update. |

## Main functions
### `OnSave()`
* **Description:** Serializes the current state of the miasma grid and active status for saving to disk.
* **Parameters:** None.
* **Returns:** `string` — ZIP-compressed and Base64-encoded save data.

### `OnLoad(data)`
* **Description:** Loads and restores miasma simulation state from saved data. Rebuilds cached indices and diminished data tracking.
* **Parameters:** `data` (string or `nil`) — Raw saved data; if present, must be valid ZIP-encoded save.
* **Returns:** Nothing.
* **Error states:** Early returns if `data` is `nil` or malformed.

### `GetMiasmaTileCoords(tx, ty)`
* **Description:** Converts world tile coordinates (`tx`, `ty`) to miasma tile coordinates (aligned to grid spacing).
* **Parameters:** `tx` (number), `ty` (number) — World tile coordinates.
* **Returns:** `mtx`, `mty` (numbers) — Miasma grid-aligned tile coordinates (multiples of `TUNING.MIASMA_SPACING`).

### `GetMiasmaAtPoint(x, y, z)`
* **Description:** Returns miasma data at a given world position.
* **Parameters:** `x`, `y`, `z` (numbers) — World position coordinates.
* **Returns:** `table?` — Miasma data table (with `strength`, optional `diminishing`), or `nil` if no miasma.

### `GetMiasmaAtTile(tx, ty)`
* **Description:** Returns miasma data at the given world tile coordinates.
* **Parameters:** `tx`, `ty` (numbers) — World tile coordinates.
* **Returns:** Same as `GetMiasmaAtPoint`.

### `IsMiasmaActive()`
* **Description:** Checks whether miasma simulation is currently enabled.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if active, `false` otherwise.

### `SetMiasmaActive(active)`
* **Description:** Enables or disables miasma simulation. Controls component update loop and fires global event.
* **Parameters:** `active` (boolean) — Desired active state.
* **Returns:** Nothing.

### `SetMiasmaDiminishingAtTile(tx, ty, isdiminishing)`
* **Description:** Marks a miasma tile for accelerated decay (bypassing normal diminish rate).
* **Parameters:** `tx`, `ty` (numbers) — World tile coordinates; `isdiminishing` (boolean).
* **Returns:** Nothing.

### `CreateMiasmaAtTile(tx, ty)`
* **Description:** Spawns a new `miasma_cloud` entity at the specified world tile.
* **Parameters:** `tx`, `ty` (numbers) — World tile coordinates.
* **Returns:** Nothing.
* **Error states:** Returns early if tile is invalid, not land, or already contains miasma.

### `IsValidForMiasmaCreationAt(mtx, mty)`
* **Description:** Determines if a miasma cloud can spawn at the given miasma-grid tile coordinates.
* **Parameters:** `mtx`, `mty` (numbers) — Miasma grid tile coordinates.
* **Returns:** `boolean` — `true` if valid (near rift or vent), `false` otherwise.

### `MiasmaAction_Create(mtx, mty)`
* **Description:** Attempts to create a miasma cloud at the specified tile, respecting rift presence and validity.
* **Parameters:** `mtx`, `mty` (numbers) — Miasma grid tile coordinates.
* **Returns:** Nothing.
* **Error states:** Returns early if no rifts exist or none have shadow affinity.

### `MiasmaAction_Spread(mtx, mty, miasmadata)`
* **Description:** Attempts to spread miasma to the four cardinal neighbors (up, down, left, right).
* **Parameters:** `mtx`, `mty` (numbers) — Current tile coordinates; `miasmadata` (table) — Miasma data.
* **Returns:** Nothing.

### `MiasmaAction_Enhance(mtx, mty, miasmadata)`
* **Description:** Increases miasma strength at the tile (up to `TUNING.MIASMA_MAXSTRENGTH`).
* **Parameters:** `mtx`, `mty` (numbers); `miasmadata` (table).
* **Returns:** Nothing.

### `MiasmaAction_Diminish(mtx, mty, miasmadata)`
* **Description:** Decreases miasma strength at the tile; removes the cloud and miasma data if strength reaches zero.
* **Parameters:** `mtx`, `mty` (numbers); `miasmadata` (table).
* **Returns:** `boolean` — `true` if miasma was destroyed, `false` otherwise.

### `RollForMiasmaActionAt(mtx, mty, allowspread)`
* **Description:** Randomly selects and executes one of: create, enhance, diminish, or spread.
* **Parameters:** `mtx`, `mty` (numbers); `allowspread` (boolean) — Whether spreading is permitted.
* **Returns:** `string?` — Name of action performed (`"Create"`, `"Enhance"`, `"Diminish"`, `"Spread"`), or `nil` if no action.
* **Error states:** Returns early without action if miasma can’t spawn or rifts are inactive.

### `DoRolls()`
* **Description:** Performs a single random miasma action on a randomly chosen existing cloud.
* **Parameters:** None.
* **Returns:** Same as `RollForMiasmaActionAt`.

### `DoDiminishes()`
* **Description:** Forces diminish actions on all tiles marked for accelerated decay.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Main simulation loop. Processes diminish and spread updates based on configured intervals.
* **Parameters:** `dt` (number) — Delta time since last frame.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a diagnostic string for debugging UI or console.
* **Parameters:** None.
* **Returns:** `string` — Formatted status, e.g., `"Miasma enabled: ON || grid nodes: 5"`.

### `DebugRoll()`
* **Description:** Prints the result of one miasma action roll to the console.
* **Parameters:** None.
* **Returns:** Nothing.

### `DebugSpawn()`
* **Description:** Spawns a miasma cloud under the local player for testing.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Only functions if `ThePlayer` exists.

## Events & listeners
- **Listens to:** `worldmapsetsize` — Initializes internal miasma grid when map size is known.
- **Pushes:** `miasma_setactive(enabled)` — Fired whenever `SetMiasmaActive` toggles the state.
- **Internally triggered:** `miasmamanager` handles miasma cloud cleanup (entity removal) as part of `_Diminish`.
