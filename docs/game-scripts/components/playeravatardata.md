---
id: playeravatardata
title: Playeravatardata
description: Manages player avatar data including name, skins, age, and equipment, with support for network replication and save/load operations.
tags: [network, player, save, data]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a6f59c03
system_scope: network
---

# Playeravatardata

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlayerAvatarData` is a client-side component responsible for managing and synchronizing player avatar information such as name, base/body/limb skins, age, and equipment across networked clients and during save/load operations. It uses `net_*` types (`net_string`, `net_ushortint`) for network replication and stores client-modifiable data in structured tables. The component integrates with `EquipSlot` utilities to handle equipment slot indexing by name rather than ID, ensuring robustness against slot reconfiguration.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playeravatardata")

inst.components.playeravatardata:AddPlayerData(true)
inst.components.playeravatardata:SetAllowEmptyName(false)
inst.components.playeravatardata:SetAllowBurnt(false)

-- Example: Populate and retrieve data
local data = inst.components.playeravatardata:GetData()
if data then
    -- Use data in UI or transmit over network
end
```

## Dependencies & tags
**Components used:** `equipslotutil` (via `EquipSlot` module)  
**Tags:** None identified (does not directly modify tags on `self.inst`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed into constructor) | Entity instance the component is attached to. |
| `hasdata` | boolean | `nil` | Indicates whether any data fields have been initialized. |
| `allowemptyname` | boolean | `true` | Whether empty player names are permitted. |
| `allowburnt` | boolean | `true` | Whether burnt players (tag `"burnt"`) are allowed to provide avatar data. |
| `strings` | table | `nil` | Networked string fields (`name`, `prefab`), created on first `Add*Data` call. |
| `skins` | table | `nil` | Networked skin strings (`base_skin`, `body_skin`, etc.), created on first skin-related `Add*Data` call. |
| `numbers` | table | `nil` | Networked numeric fields (`playerage`), created on `AddAgeData`. |
| `equip` | table | `nil` | Networked equipment strings, indexed 1..`EquipSlot.Count()`. |
| `savestrings`, `saveskins`, `savenumbers`, `saveequip` | boolean | `nil` | Flags indicating whether corresponding data should be persisted. |
| `unsupported_equips` | table | `nil` | Stores equipment slot names that are unrecognized on current load (used for backward compatibility). |

## Main functions
### `SetAllowEmptyName(allow)`
* **Description:** Configures whether empty player names are allowed. If `allow` is `false` or omitted, empty names will cause `GetData()` to return `nil`.
* **Parameters:** `allow` (boolean, optional) — if `false`, empty names are disallowed; otherwise allowed.
* **Returns:** Nothing.

### `SetAllowBurnt(allow)`
* **Description:** Configures whether burnt players (tagged `"burnt"`) are allowed to provide avatar data. If `allow` is `false`, burnt entities will cause `GetData()` to return `nil`.
* **Parameters:** `allow` (boolean, optional) — if `false`, burnt players are excluded; otherwise allowed.
* **Returns:** Nothing.

### `AddNameData(save)`
* **Description:** Initializes networked name and prefab fields. Creates `strings` table with `"name"` and `"prefab"` keys if not already created.
* **Parameters:** `save` (boolean) — whether to persist this data to disk on `OnSave()`.
* **Returns:** Nothing.

### `AddBaseSkinData(save)`
* **Description:** Initializes the `base_skin` skin field. Creates `skins` table if not already created.
* **Parameters:** `save` (boolean) — whether to persist this data.
* **Returns:** Nothing.

### `AddClothingData(save)`
* **Description:** Initializes clothing skin fields (`body_skin`, `hand_skin`, `legs_skin`, `feet_skin`). Creates `skins` table if not already created.
* **Parameters:** `save` (boolean) — whether to persist this data.
* **Returns:** Nothing.

### `AddAgeData(save)`
* **Description:** Initializes the `playerage` numeric field. Creates `numbers` table if not already created.
* **Parameters:** `save` (boolean) — whether to persist this data.
* **Returns:** Nothing.

### `AddEquipData(save)`
* **Description:** Initializes equipment fields, one per `EquipSlot`. Creates `equip` table of `net_string` objects indexed from `1` to `EquipSlot.Count()`.
* **Parameters:** `save` (boolean) — whether to persist this data.
* **Returns:** Nothing.

### `AddPlayerData(save)`
* **Description:** Convenience method that calls all `Add*Data()` methods to initialize all avatar fields.
* **Parameters:** `save` (boolean) — whether to persist all data.
* **Returns:** Nothing.

### `GetData()`
* **Description:** Returns a plain Lua table containing current values of all initialized data fields. If `hasdata` is `nil`, delegates to `TheNet:GetClientTableForUser()`. Returns `nil` if `allowemptyname` is `false` and name is empty, or `allowburnt` is `false` and entity has `"burnt"` tag.
* **Parameters:** None.
* **Returns:** `table` or `nil` — Avatar data, or `nil` under disallowed conditions.
* **Error states:** May return `nil` when `allowemptyname`/`allowburnt` restrictions apply.

### `SetData(client_obj)`
* **Description:** Updates internal networked fields from a plain table (e.g., received from network or UI input). Requires `hasdata` to be `true`.
* **Parameters:** `client_obj` (table or `nil`) — Data source with keys matching initialized fields.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Constructs a saveable table containing current avatar data, using slot-name keys for `equip` (converting from `EquipSlot.FromID`) and handling `unsupported_equips` for legacy slots. Returns `nil` if no data exists.
* **Parameters:** None.
* **Returns:** `table` or `nil` — Data ready for serialization.
* **Error states:** Returns `nil` if `hasdata` is `nil`.

### `OnLoad(data)`
* **Description:** Loads avatar data from a previously saved table. Converts `equip` keys (slot names) back to numeric indices via `EquipSlot.ToID`, storing unrecognized slot names in `unsupported_equips`.
* **Parameters:** `data` (table or `nil`) — Saved avatar data.
* **Returns:** Nothing.
* **Error states:** Returns early with no effect if `hasdata` is `nil`.

## Events & listeners
None identified.
