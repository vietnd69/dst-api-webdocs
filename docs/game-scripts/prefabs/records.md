---
id: records
title: Records
description: Manages playable music records for the phonograph, handling asset switching, naming, and save/load persistence.
tags: [audio, inventory, entity, save-load]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8364497c
system_scope: audio
---

# Records

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `records` prefab defines a consumable inventory item that can be placed in a phonograph to play background music. It manages the visual and audio representation of different record types (e.g., default and *Balatro*), handles dynamic naming via localization, and integrates with inventory, inspectable, and save systems. It is instantiated as a standalone entity and intended to be used by players and the phonograph.

## Usage example
```lua
-- Create a record instance
local record = CreateEntity()
record:AddPrefab("record")
record:SetRecord("balatro") -- switch to the Balatro record
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `tradable`  
**Tags:** Adds `cattoy` and `phonograph_record`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recordname` | string | `"default"` | Key into the `RECORDS` table indicating the current record type. |
| `recorddata` | table | `RECORDS.default` | Data object containing song path, build name, display name, and inventory icon. |
| `songToPlay` | string | `recorddata.song` | Full path to the music file, kept for mod compatibility. |
| `record_displayname` | net_string | `net_string(GUID, "...")` | Networked string used for client-side display name display. |
| `displaynamefn` | function | `DisplayNameFn` | Localizable display name override callback. |

## Main functions
### `SetRecord(name)`
* **Description:** Configures the record instance to use a specific record type (e.g., `"default"` or `"balatro"`). Updates visual assets, inventory icon, inspectable name, and networked display name.
* **Parameters:** `name` (string or `nil`) — record type key. Defaults to `"default"` if `nil`.
* **Returns:** Nothing.
* **Error states:** Logs an error and returns early if `name` does not exist in the `RECORDS` table.

### `OnSave(inst, data)`
* **Description:** Saves the current record name to the save file *only if* it differs from `"default"`.
* **Parameters:** `data` (table) — save data table to write into.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores the record type from saved data if present.
* **Parameters:** `data` (table or `nil`) — loaded data, potentially containing `data.name`.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `imagechange` — fired internally by `inventoryitem:ChangeImageName()` when the inventory icon changes.