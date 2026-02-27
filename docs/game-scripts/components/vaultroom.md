---
id: vaultroom
title: Vaultroom
description: Manages the creation, loading, unloading, and resetting of virtual vault rooms in the game world, including entity persistence and terrain handling.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: d49ea297
---

# Vaultroom

## Overview
The `VaultRoom` component handles virtual room generation and management for dungeon-like environments (e.g., the Vault level). It supports layout creation via predefined room definitions, entity persistence (save/load) during room transitions, and terrain reconfiguration. It ensures entities are properly preserved, skipped, or removed based on ownership, tags, and context during room unloading and loading.

## Dependencies & Tags
- Uses `prefabs/vaultroom_defs` module (`defs`) for room layout and terraforming functions.
- Entities may rely on tags: `"INLIMBO"`, `"staysthroughvirtualrooms"`, `"irreplaceable"`.
- Assumes entities may have components: `Transform`, `inventory`, `container`, `inventoryitem`, `spell`, `formationleader`, `follower`, `spelldata` (indirect), and `persists`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The root entity this component is attached to (typically the vault door/wall representing the room). |
| `roomid` | `string` or `nil` | `nil` | Identifier for the currently active vault room layout. `nil` indicates no room is active. |

## Main Functions

### `GetCurrentRoomId()`
* **Description:** Returns the ID of the currently loaded vault room layout.
* **Parameters:** None.

### `LayoutNewRoom(id)`
* **Description:** Initializes a new vault room using the provided `id` layout. It applies terrain changes (via `TerraformRoomAtXZ`), then spawns room contents (via `LayoutNewRoomAtXZ`) if defined. Sets `self.roomid`.
* **Parameters:**
  * `id` (string): The key in `defs` for the desired room layout.

### `UnloadRoom(save)`
* **Description:** Removes or saves entities within a radius of the room center, based on their relevance. Entities with tags or ownership chains outside the room are skipped; players or irreplaceable entities are kept; others are saved or removed. Returns a data table (if `save=true`) with entity records and a list of remaining entities.
* **Parameters:**
  * `save` (boolean): If `true`, entity data is collected for persistence; if `false`, entities are removed immediately.

### `ResetRoom()`
* **Description:** Unloads the current room without saving, then resets terrain to default using `ResetTerraformRoomAtXZ`.
* **Parameters:** None.

### `LoadRoom(id, data)`
* **Description:** Loads a vault room either by generating a new one (`data == nil`) or reconstructing it from persisted data (`data` provided). Handles entity spawning, post-pass linking, and time advancement for off-cycle entities.
* **Parameters:**
  * `id` (string): The key in `defs` for the room layout.
  * `data` (table or `nil`): Optional saved room data. If `nil`, triggers `LayoutNewRoom(id)`.

### `OnSave()`
* **Description:** Returns a minimal table containing the active room ID for world persistence, or `nil` if no room is active.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores the active room ID from saved world data during load.
* **Parameters:**
  * `data` (table or `nil`): World save data containing the `room` key.

## Events & Listeners
None.