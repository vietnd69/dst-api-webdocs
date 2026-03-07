---
id: cartography_prototyper
title: Cartography Prototyper
description: Implements the cartography desk prefab with prototyping, workable, burnable, and loot-dropping functionality for DST.
tags: [crafting, environment, ui]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 532249dd
system_scope: environment
---

# Cartography Prototyper

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The cartography desk is a buildable structure that acts as a prototyper with crafting tree support and a workable surface for hammering. It integrates multiple components: `prototyper`, `workable`, `burnable`, `lootdropper`, and `hauntable`. When built, it plays a sound and sets initial animations; when hammered, it extinguishes burning, drops appropriate loot, and removes itself; and it responds to on/off state changes with animation updates.

## Usage example
```lua
-- Typical usage occurs via the cartographydesk prefab and placer
local desk = SpawnPrefab("cartographydesk")
desk.Transform:SetPosition(GenCellPos(x, y, z))
desk:DoTaskInstantly()

-- Component usage (after instantiation)
desk.components.prototyper:TurnOn()
desk.components.prototyper:TurnOff()
desk.components.workable:Work(1)
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `papereraser`, `prototyper`, `workable`, `hauntable`, `burnable`, `propagator`, `fueled`, `finiteuses`, `stackable`  
**Tags added:** `structure`, `prototyper`, `papereraser`  
**Tags checked:** `burnt`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onturnon` | function | `nil` | Callback invoked when the prototyper is turned on. |
| `onturnoff` | function | `nil` | Callback invoked when the prototyper is turned off. |
| `trees` | TechTree | `TUNING.PROTOTYPER_TREES.CARTOGRAPHYDESK` | Tech tree data for available recipes. |
| `onbuilt` | function | `nil` | Event callback set on the entity for build-time logic. |
| `OnSave` | function | `onsave` | Serialization handler for saving burnt state. |
| `OnLoad` | function | `onload` | Deserialization handler for restoring burnt state. |

## Main functions
### `onhammered(inst, worker)`
*   **Description:** Handles hammering of the cartography desk. Extinguishes fire (if burning), drops loot, spawns a collapse effect, and removes the entity.
*   **Parameters:**  
    - `inst` (Entity) — the cartography desk entity being hammered.  
    - `worker` (Entity) — the entity performing the hammering action.  
*   **Returns:** Nothing.

### `onhit(inst)`
*   **Description:** Callback triggered during each work tick when the desk is being hammered. Plays the “hit” animation and sets looping animation based on prototyper state.
*   **Parameters:** `inst` (Entity) — the cartography desk entity.  
*   **Returns:** Nothing.  
*   **Error states:** Skips animation updates if the desk has the `burnt` tag.

### `onturnon(inst)`
*   **Description:** Starts the prototyper’s proximity loop animation when powered on, unless burnt.
*   **Parameters:** `inst` (Entity) — the cartography desk entity.  
*   **Returns:** Nothing.

### `onturnoff(inst)`
*   **Description:** Returns the desk to idle animation when powered off, unless burnt.
*   **Parameters:** `inst` (Entity) — the cartography desk entity.  
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Records whether the desk is burning or burnt into the save data.
*   **Parameters:**  
    - `inst` (Entity) — the cartography desk entity.  
    - `data` (table) — the save data table to populate.  
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores burnt state on load by invoking the burnable component's `onburnt` callback.
*   **Parameters:**  
    - `inst` (Entity) — the cartography desk entity.  
    - `data` (table) — the loaded save data.  
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Called after construction. Plays the “place” animation, transitions to idle, and emits a sound.
*   **Parameters:** `inst` (Entity) — the cartography desk entity.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — triggers `onbuilt` handler to play build animation and sound.

- **Pushes:** (none) — relies on component-level events (`inst:PushEvent`) instead of direct pushes in this file.

