---
id: playeravatardata
title: Playeravatardata
description: Manages avatar data (name, skins, age, and equipment) for a player entity, including network serialization and save/load logic.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: a6f59c03
---

# Playeravatardata

## Overview
The `PlayerAvatarData` component stores and synchronizes player avatar configuration—such as name, base and clothing skins, player age, and equipment—across the network and to disk. It is attached to player entities and facilitates bidirectional data flow between client-side UI, network replication (via `net_*` types), and persistent saves, without requiring additional server-side components.

## Dependencies & Tags
- Relies on `EquipSlot` module (`equipslotutil.lua`) to map equipment slot IDs to names and vice versa.
- Does not add or remove entity tags itself.
- Does not directly add other components via `inst:AddComponent`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the associated player entity. |
| `hasdata` | `boolean?` | `nil` | Flag indicating whether any avatar data has been initialized. |
| `allowemptyname` | `boolean` | `true` | Whether empty names are permitted when retrieving data. |
| `allowburnt` | `boolean` | `true` | Whether burnt players (tag `"burnt"`) are allowed in data retrieval. |
| `strings` | `table?` | `nil` | Networked string fields (`name`, `prefab`). Initialized on first call to `AddNameData`. |
| `skins` | `table?` | `nil` | Networked skin fields (`base_skin`, `body_skin`, `hand_skin`, `legs_skin`, `feet_skin`). Initialized on `AddBaseSkinData` or `AddClothingData`. |
| `numbers` | `table?` | `nil` | Networked numeric fields (`playerage`). Initialized on `AddAgeData`. |
| `equip` | `table?` | `nil` | Array of networked equipment slot strings (indexed by EquipSlot ID). Initialized on `AddEquipData`. |
| `unsupported_equips` | `table?` | `nil` | Map of equipment slot *names* (not IDs) not recognized in currentEquipSlot definition, used during save/load for backwards/forwards compatibility. |
| `savestrings`, `saveskins`, `savenumbers`, `saveequip` | `boolean` | `nil` | Flags indicating whether corresponding data fields should be persisted to disk. Set on respective `Add*Data` calls. |

## Main Functions

### `SetAllowEmptyName(allow)`
* **Description:** Sets whether empty player names are acceptable when calling `GetData`.
* **Parameters:** `allow` (`boolean?`) — If `false` or omitted, empty names will cause `GetData` to return `nil`.

### `SetAllowBurnt(allow)`
* **Description:** Sets whether players tagged as `"burnt"` are allowed in the returned avatar data.
* **Parameters:** `allow` (`boolean?`) — If `false` or omitted, burnt players will cause `GetData` to return `nil`.

### `AddNameData(save)`
* **Description:** Initializes the `strings.name` and `strings.prefab` networked fields. Marks data as present if not already.
* **Parameters:** `save` (`boolean?`) — If truthy, sets `savestrings = true` for saving.

### `AddBaseSkinData(save)`
* **Description:** Initializes `skins.base_skin`. Initializes `skins` table if not present.
* **Parameters:** `save` (`boolean?`) — If truthy, sets `saveskins = true` for saving.

### `AddClothingData(save)`
* **Description:** Initializes clothing skin fields (`body_skin`, `hand_skin`, `legs_skin`, `feet_skin`). Initializes `skins` table if not present.
* **Parameters:** `save` (`boolean?`) — If truthy, sets `saveskins = true` for saving.

### `AddAgeData(save)`
* **Description:** Initializes `numbers.playerage`. Marks data as present if not already.
* **Parameters:** `save` (`boolean?`) — If truthy, sets `savenumbers = true` for saving.

### `AddEquipData(save)`
* **Description:** Initializes `equip` array with one `net_string` per slot ID (using `EquipSlot.Count()`). Marks data as present if not already.
* **Parameters:** `save` (`boolean?`) — If truthy, sets `saveequip = true` for saving.

### `AddPlayerData(save)`
* **Description:** Convenience method to initialize all avatar data types in one call.
* **Parameters:** `save` (`boolean?`) — Applied to all data initialization calls.

### `GetData()`
* **Description:** Returns a plain Lua table with the current avatar values, suitable for UI or net replication. Returns `nil` if no data is available or if constraints (`allowemptyname`, `allowburnt`) are violated.
* **Parameters:** None.

### `SetData(client_obj)`
* **Description:** Populates internal networked fields from a plain Lua table (e.g., from a client UI submission or network packet).
* **Parameters:** `client_obj` (`table?`) — Dictionary-like object with keys matching avatar data fields.

### `OnSave()`
* **Description:** Serializes avatar data into a plain Lua table for saving to disk, mapping equip slot IDs to their canonical names.
* **Parameters:** None.
* **Returns:** `table?` — Non-empty save table or `nil` if no data.

### `OnLoad(data)`
* **Description:** Loads persisted avatar data from disk into internal networked fields, converting equip slot names back to IDs.
* **Parameters:** `data` (`table?`) — Saved avatar data table.

## Events & Listeners
None.