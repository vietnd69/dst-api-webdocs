---
id: arrowsign
title: Arrowsign
description: Implements the directional sign post and panel prefabs for placement and interaction in the game world, supporting construction, writing, destruction, and orientation persistence.
tags: [environment, crafting, structure]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e2fb3a06
system_scope: environment
---

# Arrowsign

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `arrowsign` prefab defines two related prefabs: `arrowsign_post` (the base post) and `arrowsign_panel` (the writable sign panel). The post supportshammering, burning, rotation, and loot drops, while the panel handles writing and is visually linked to the post. The component logic is embedded within the prefab constructors (`fn` and `panelfn`), not a standalone component class.

## Usage example
```lua
-- Typical prefab instantiation (handled internally by DST)
-- The player places the arrow sign using the builder menu.
-- Writing and interaction occur via the `inspectable` and `writeable` components.

-- Example: Checking if a placed arrowsign is burnt
if sign:HasTag("burnt") or (sign.components.burnable and sign.components.burnable:IsBurning()) then
    print("Sign is burnt")
end
```

## Dependencies & tags
**Components used:** `burnable`, `lootdropper`, `savedrotation`, `workable`, `inspectable`, `writeable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`

**Tags added:** `structure`, `sign`, `directionsign`, `rotatableobject`, `_writeable` (temporary, removed on master simulation), `burnt` (added conditionally on load if saved as burnt)

## Properties
No public properties are defined in the constructor logic. State is managed via component properties (e.g., `workable.workleft`, `burnable.burning`) and saved in `data` tables during save/load.

## Main functions
No public methods are defined directly on the prefab instance. Functionality is delegated to attached components and registered callbacks.

### Callback functions (internal)

#### `onhammered(inst, worker)`
* **Description:** Handles hammering the sign post; extinguishes fire, drops loot, spawns collapse FX, and removes the entity.
* **Parameters:** `inst` (entity), `worker` (player entity performing the hammering).
* **Returns:** Nothing.
* **Error states:** Expects `burnable` and `lootdropper` components to exist.

#### `onhit(inst, worker)`
* **Description:** Plays a "hit" animation when the sign is being worked on (if not already burnt).
* **Parameters:** `inst` (entity), `worker` (player entity).
* **Returns:** Nothing.

#### `onsave(inst, data)`
* **Description:** Saves the burnt state (`data.burnt = true`) if the sign is currently burning or burnt.
* **Parameters:** `inst` (entity), `data` (table to be serialized).
* **Returns:** Nothing.

#### `onload(inst, data)`
* **Description:** Restores the burnt state by triggering `onburnt` callback if `data.burnt` is true.
* **Parameters:** `inst` (entity), `data` (table loaded from save).
* **Returns:** Nothing.

#### `onloadpostpass(inst, newents, data)`
* **Description:** Applies saved rotation using `savedrotation:ApplyPostPassRotation`.
* **Parameters:** `inst` (entity), `newents` (table of loaded entities), `data` (save data with optional `savedrotation.rotation`).
* **Returns:** Nothing.

#### `onbuilt(inst)`
* **Description:** Plays the "sign_craft" sound when the sign is built via crafting/hammer.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — triggers `onbuilt` callback to play sound.
- **Pushes:** None directly; events are handled via attached components (`workable`, `burnable`, etc.) and internal callbacks (`OnSave`, `OnLoad`, `OnLoadPostPass`).