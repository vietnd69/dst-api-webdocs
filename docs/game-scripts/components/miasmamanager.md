---
id: miasmamanager
title: Miasmamanager
description: Manages the generation, spread, strengthening, and removal of miasma clouds in the world, primarily around rifts and vents.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 76a65bb6
---

# Miasmamanager

## Overview
The `MiasmaManager` component is responsible for simulating dynamic miasma behavior in the game world: it initializes and maintains a grid-based miasma layer, handles miasma creation near rifts or vents, governs spreading and strengthening mechanics, and manages natural decay over time. It operates exclusively on the server (master simulation), driving both the presence and persistence of miasma clouds.

## Dependencies & Tags
- **Component Dependencies:** Requires `TheWorld.components.riftspawner` for rift-based miasma validation and creation logic.
- **Tags Used:**
  - `"miasma_venter"`: Entities with this tag are considered valid sources for miasma generation (e.g., vents).
  - `"miasma"`: Used during miasma cloud removal when strength drops to zero.
- **Component Tags Added:** None explicitly added.
- **Internal Tags Used:**
  - `"miasma"`: Passed to `FindEntities` during decay to locate and remove miasma cloud entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the owning entity (typically `TheWorld`). |
| `_miasma_grid` | `DataGrid` | `nil` | Grid backing the miasma layer, sized to map dimensions. |
| `enabled` | `boolean` | `false` | Whether miasma simulation is active and the component is updated. |
| `KILL_MIASMA_RADIUS` | `number` | `SQRT2 * TUNING.MIASMA_SPACING * TILE_SCALE / 2` | Radius used to locate miasma cloud entities when a grid cell decays to zero. |
| `_cached_miasma_indexes` | `table` | `{}` | Indexed list of active miasma grid cell indices, for randomized updates. |
| `_cached_miasma_indexes_count` | `number` | `0` | Count of entries in `_cached_miasma_indexes`. |
| `_diminishing_datas` | `table` | `{}` | Maps miasma data to `{mtx, mty}` coordinates for batched decay. |

## Main Functions

### `self:OnSave()`
* **Description:** Serializes the current miasma grid state and activation status for world save.
* **Parameters:** None.
* **Returns:** `string` (ZIP-compressed and base64-encoded save data).

### `self:OnLoad(data)`
* **Description:** Restores miasma state from save data, including grid cells, diminishing flags, and activation status.
* **Parameters:**
  - `data` (`string`): Save data blob, optionally compressed/encoded.

### `self:GetMiasmaTileCoords(tx, ty)`
* **Description:** Converts world tile coordinates to discrete miasma grid coordinates (aligned to spacing).
* **Parameters:**
  - `tx`, `ty` (`number`): World tile coordinates.

### `self:GetMiasmaAtPoint(x, y, z)`
* **Description:** Retrieves miasma data at a world point by converting to tile and grid coordinates.
* **Parameters:**
  - `x`, `y`, `z` (`number`): World position.

### `self:GetMiasmaAtTile(tx, ty)`
* **Description:** Retrieves miasma data for a given world tile coordinate.
* **Parameters:**
  - `tx`, `ty` (`number`): World tile coordinates.

### `self:IsMiasmaActive()`
* **Description:** Returns whether miasma simulation is currently enabled.
* **Parameters:** None.

### `self:SetMiasmaActive(active)`
* **Description:** Enables or disables miasma simulation. Starts/stops component updates and broadcasts a `"miasma_setactive"` event.
* **Parameters:**
  - `active` (`boolean`): Desired active state.

### `self:CreateMiasmaAtTile(tx, ty)`
* **Description:** Spawns a new miasma cloud entity at the specified tile and registers it in the grid.
* **Parameters:**
  - `tx`, `ty` (`number`): World tile coordinates.
* **Side Effects:** Spawns `"miasma_cloud"` prefab, sets active, and updates grid.

### `self:IsValidForMiasmaCreationAt(mtx, mty)`
* **Description:** Checks if a miasma cell can be created at the given miasma-grid coordinates. Considers proximity to shadow rifts and presence of vents.
* **Parameters:**
  - `mtx`, `mty` (`number`): Miasma-grid tile coordinates.

### `self:MiasmaAction_Create(mtx, mty)`
* **Description:** Initiates miasma creation at a cell, respecting world constraints (e.g., rift presence).
* **Parameters:**
  - `mtx`, `mty` (`number`): Miasma-grid tile coordinates.

### `self:MiasmaAction_Spread(mtx, mty, miasmadata)`
* **Description:** Attempts to propagate miasma to the four cardinal neighbors, each by calling `RollForMiasmaActionAt`.
* **Parameters:**
  - `mtx`, `mty` (`number`): Miasma-grid tile coordinates of source.
  - `miasmadata` (`table`): Current cell’s miasma data.

### `self:MiasmaAction_Enhance(mtx, mty, miasmadata)`
* **Description:** Increases the strength of the miasma cell by 1 (capped by `TUNING.MIASMA_MAXSTRENGTH`).
* **Parameters:**
  - `mtx`, `mty` (`number`): Miasma-grid tile coordinates.
  - `miasmadata` (`table`): Miasma data to modify.

### `self:MiasmaAction_Diminish(mtx, mty, miasmadata)`
* **Description:** Decreases miasma strength by 1; removes the cell if strength reaches ≤0 (including destroying associated entity and clearing grid data).
* **Parameters:**
  - `mtx`, `mty` (`number`): Miasma-grid tile coordinates.
  - `miasmadata` (`table`): Miasma data to modify.

### `self:RollForMiasmaActionAt(mtx, mty, allowspread)`
* **Description:** Determines and executes a miasma action (Create, Enhance, Spread, Diminish) at a cell based on tuning odds, rift state, and diminishing flags.
* **Parameters:**
  - `mtx`, `mty` (`number`): Miasma-grid tile coordinates.
  - `allowspread` (`boolean`): Whether spread attempts are permitted.
* **Returns:** `string?`: Name of action taken (`"Create"`, `"Enhance"`, `"Spread"`, `"Diminish"`), or `nil`.

### `self:DoDiminishes()`
* **Description:** Performs all scheduled diminishments for marked miasma cells.
* **Parameters:** None.

### `self:DoRolls()`
* **Description:** Selects a random active miasma cell and calls `RollForMiasmaActionAt`, allowing spread only if under max cloud limit.
* **Parameters:** None.
* **Returns:** `string?`: Result of the action roll.

### `self:OnUpdate(dt)`
* **Description:** Main simulation loop. Handles periodic diminishments and roll-based actions using rate-limiting intervals.
* **Parameters:**
  - `dt` (`number`): Time since last frame.

### `self:GetDebugString()`
* **Description:** Returns a human-readable debug summary (enabled status and grid node count).
* **Parameters:** None.

### `self:DebugRoll()`
* **Description:** Logs the result of a single `DoRolls()` call to console.
* **Parameters:** None.

### `self:DebugSpawn()`
* **Description:** Spawns miasma at the player’s current location for testing.
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"worldmapsetsize"` on `TheWorld`: Initializes the miasma grid size once world dimensions are known.
- **Triggers:**
  - `"miasma_setactive"` on `TheWorld`: Emitted when the miasma state is toggled.

---