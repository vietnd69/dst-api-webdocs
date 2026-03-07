---
id: boat_magnet_beacon
title: Boat Magnet Beacon
description: Manages the beacon that pairs with a boat magnet to control magnet movement when placed on a boat.
tags: [structure, boat, interaction]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 37fa46d1
system_scope: entity
---

# Boat Magnet Beacon

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `boat_magnet_beacon` prefab functions as a structure that pairs with a boat magnet to control its behavior in the game world. It is placed on a boat and acts as the control point for the paired magnet. The prefab integrates with several core systems: `inspectable` (for status display), `lootdropper` (for drops on destruction), `workable` (for hammering and destruction), `burnable` (for fire interaction), and `boatmagnetbeacon` (its core logic component for pairing). It also participates in save/load via custom `OnSave`/`OnLoad` handlers and plays sound effects upon placement.

## Usage example
```lua
local beacon = SpawnPrefab("boat_magnet_beacon")
beacon.Transform:SetPosition(x, y, z)
beacon.components.boatmagnetbeacon:SetMagnet(magnet_entity)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `boatmagnetbeacon`, `lootdropper`, `workable`, `burnable`, `propagator`, `hauntable`, `fueled`  
**Tags:** Adds `boatmagnetbeacon`, `structure`; checks `burnt`, `burnable`.

## Properties
No public properties.

## Main functions
### `GetStatus(inst, viewer)`
* **Description:** Returns a string indicating whether the beacon is activated (i.e., paired with a magnet) or generic (unpaired). Used by the inspectable component to render status text.
* **Parameters:** `inst` (Entity) - the beacon entity; `viewer` (Entity) - the player inspecting it (unused in implementation).
* **Returns:** `"ACTIVATED"` if a magnet is paired, otherwise `"GENERIC"`.
* **Error states:** Returns `"GENERIC"` if the `boatmagnetbeacon` component is missing or no magnet is paired.

### `OnSave(inst, data)`
* **Description:** Saves the burnt state of the beacon for persistence across save/load cycles.
* **Parameters:** `inst` (Entity) - the beacon; `data` (table) - save data table to populate.
* **Returns:** Nothing. Writes `data.burnt = true` if burning or burnt.

### `OnLoad(inst, data)`
* **Description:** Restores the burnt state during entity load.
* **Parameters:** `inst` (Entity) - the beacon; `data` (table) - loaded data.
* **Returns:** Nothing. Triggers `burnable.onburnt` callback if `data.burnt` is `true`.

## Events & listeners
- **Listens to:** `onbuilt` - triggers `onbuilt` callback which plays placement sound and sets the state graph to `"place"`.
- **Pushes:** None (events are handled indirectly through callbacks).