---
id: turfcraftingstation
title: Turfcraftingstation
description: A crafting station used to prototype Grotto-era technologies, supporting work, burning, and hauntable mechanics.
tags: [crafting, workable, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e8da579a
system_scope: crafting
---

# Turfcraftingstation

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `turfcraftingstation` is a station prefab that provides Grotto-era prototyping capabilities. It integrates several components: `prototyper` for recipe unlocking, `workable` for player interaction (hammering), `burnable` for fire behavior, `hauntable` for hauntable mechanics, and `lootdropper` for resource recovery. It functions as a hybrid workbench and structure, supporting normal operation, damage, extinguishing, burning, and state persistence across saves.

## Usage example
```lua
-- The prefab is instantiated internally via its Prefab function.
-- Modders can reference it as "turfcraftingstation" and customize via hooks.

local inst = Prefab("turfcraftingstation", fn, assets, prefabs)
-- To modify behavior (e.g., adjust haunt value):
inst.components.hauntable:SetHauntValue(NEW_HAUNT_VALUE)
```

## Dependencies & tags
**Components used:** `inspectable`, `craftingstation`, `prototyper`, `lootdropper`, `workable`, `hauntable`, `burnable`  
**Tags added:** `structure`, `prototyper`

## Properties
No public properties are defined directly on this prefab’s `fn` constructor. State is managed internally via attached components.

## Main functions
### `onhammered(inst, worker)`
*   **Description:** Handles hammering interaction. Extinguishes fire if burning, drops loot, spawns a collapse FX, and removes the entity.  
*   **Parameters:**  
  - `inst` (entity) – The station instance.  
  - `worker` (entity) – The entity performing the hammering.  
*   **Returns:** Nothing.  
*   **Error states:** None identified.

### `onhit(inst)`
*   **Description:** Responds to partial work progress (e.g., hammer strikes before completion). Triggers animation, sound, and updates active loop based on `prototyper.on` state.  
*   **Parameters:** `inst` (entity) – The station instance.  
*   **Returns:** Nothing.  
*   **Error states:** Does nothing if the station is already `burnt`.

### `onturnoff(inst)`
*   **Description:** Called when the station is turned off. Stops proximity loop animation and sound (unless burnt).  
*   **Parameters:** `inst` (entity) – The station instance.  
*   **Returns:** Nothing.  
*   **Error states:** Does nothing if the station is burnt.

### `onturnon(inst)`
*   **Description:** Called when the station is turned on. Restarts proximity loop animation and sound (unless burnt).  
*   **Parameters:** `inst` (entity) – The station instance.  
*   **Returns:** Nothing.  
*   **Error states:** Does nothing if the station is burnt.

### `onactivate(inst)`
*   **Description:** Triggered when the station is activated (used). Plays use animation and sound, and resumes proximity loop.  
*   **Parameters:** `inst` (entity) – The station instance.  
*   **Returns:** Nothing.  
*   **Error states:** Does nothing if the station is burnt.

### `onbuilt(inst)`
*   **Description:** Triggered upon construction. Plays placement animation/sound and transitions to idle.  
*   **Parameters:** `inst` (entity) – The station instance.  
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes burning/burnt state for save/load. Sets `data.burnt = true` if burning or burnt.  
*   **Parameters:**  
  - `inst` (entity) – The station instance.  
  - `data` (table) – Save data table.  
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores burnt state on load. Calls `onburnt` handler if `data.burnt` is present.  
*   **Parameters:**  
  - `inst` (entity) – The station instance.  
  - `data` (table, optional) – Loaded data.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onbuilt` – Triggers `onbuilt` handler to play placement animation and sound.
- **Pushes:** None defined directly in this file.