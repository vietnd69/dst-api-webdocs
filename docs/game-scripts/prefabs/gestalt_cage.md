---
id: gestalt_cage
title: Gestalt Cage
description: Defines the Gestalt Cage item, its filled variants for capturing Wagdrones, and associated deployment prefabs.
tags: [item, capture, boss, wagpunk]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 7eccdd98
system_scope: entity
---

# Gestalt Cage

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
The `gestalt_cage` prefab file defines the empty cage item, the swap visual effects, and three levels of filled cages (`gestalt_cage_filled1`, `2`, `3`) used in the WAGPUNK event. It handles logic for equipping, capturing Gestalts, and deploying Wagdrones upon boss defeat. The file also includes placer prefabs and a placer indicator for deployment positioning.

## Usage example
```lua
-- Spawn the empty cage
local cage = SpawnPrefab("gestalt_cage")

-- Spawn a filled cage (Level 2)
local filled = SpawnPrefab("gestalt_cage_filled2")
filled:SetIsPlanar(true)
filled:StartCapture()

-- Check cage properties
local level = filled.level           -- capture level (1-3)
local is_planar = filled:GetIsPlanar() -- planar state (filled2 only)
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- accesses damage values and placement radii
- `TheWorld` -- checks `wagboss_tracker` and `wagpunk_arena_manager` components
- `TheSim` -- finds entities for placement validation
- `TheNet` -- checks for dedicated server status
- `FRAMES` -- used in DoFlicker for time-based task scheduling
- `DEPLOYMODE` -- deployment mode constants for deployable component

**Components used:**
- `inspectable` -- provides status text for filled cages
- `tradable` -- allows trading between players
- `inventoryitem` -- manages inventory state and events
- `equippable` -- handles equip/unequip visuals for base cage
- `weapon` -- sets damage for base cage
- `gestaltcage` -- custom component for base cage logic
- `useabletargeteditem` -- enables targeted use on chassis for filled cages
- `deployable` -- enables deployment after boss defeat (filled cages)
- `deployhelper` -- manages placement indicators
- `placer` -- handles placement preview logic
- `bloomer` -- accessed on owner entity to attach FX (not added to cage)
- `colouradder` -- accessed on owner entity to attach FX (not added to cage)

**Tags:**
- `weapon` -- added to base cage
- `gestalt_cage` -- added to base cage
- `FX` -- added to swap effect prefab
- `gestalt_cage_filled` -- added to filled variants
- `usedeploystring` -- added to gestalt_cage_filled1 and gestalt_cage_filled2 only
- `irreplaceable` -- added to level 3 filled cage
- `CLASSIFIED` -- added to FX, placer indicator, and helper decal
- `NOCLICK` -- added to helper decal entity created by deployhelper (not indicator prefab)
- `placer` -- added to helper decal entity created by deployhelper (not indicator prefab)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number | `1` (filled1), `2` (filled2), `3` (filled3) | Capture level of the filled cage (1-3). Applies to gestalt_cage_filled1/2/3. |
| `isplanar` | boolean | `nil` | Whether the captured Gestalt is planar. Applies to gestalt_cage_filled2 only. |
| `replacementprefab` | string | `wagdrone_rolling` (filled1), `wagdrone_flying` (filled2) | Prefab name to spawn when deployed. Applies to gestalt_cage_filled1/2 (nil for filled3). |
| `deployhelper_key` | string | `gestalt_cage_filled_placerindicator` | Key used by deploy helper to find indicator. Applies to placer prefabs only. |
| `scrapbook_proxy` | string | `gestalt_cage` | Proxy name for scrapbook recording. Applies to gestalt_cage_filled1/2/3. |


## Main functions
### `StartCapture()`
*   **Description:** Triggers the capture animation and sound based on the cage level. Called on filled cage instance.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

### `SetIsPlanar(planar)`
*   **Description:** Sets the planar state and updates inventory image/animation accordingly. Called on gestalt_cage_filled2 instance.
*   **Parameters:** `planar` -- boolean indicating planar state
*   **Returns:** None
*   **Error states:** None

### `GetIsPlanar()`
*   **Description:** Returns the current planar state of the cage. Called on gestalt_cage_filled2 instance.
*   **Parameters:** None
*   **Returns:** Boolean `isplanar` value.
*   **Error states:** None

### `AttachToOwner(owner)`
*   **Description:** Attaches the swap FX entity to the owner and syncs bloom/color components. Called on gestalt_cage_swap_fx instance.
*   **Parameters:** `owner` -- player entity to attach to
*   **Returns:** None
*   **Error states:** None

### `GetUseItemOnVerb(target, doer)`
*   **Description:** Returns the verb string for using this item on a target. Called on gestalt_cage_filled1/2/3 instances.
*   **Parameters:**
  - `target` -- target entity
  - `doer` -- player entity attempting to use
*   **Returns:** String "GESTALT_POSSESS"
*   **Error states:** None

### `UseableTargetedItem_ValidTarget(target, doer)`
*   **Description:** Checks if target is valid for using this item. Called on gestalt_cage_filled1/2/3 instances.
*   **Parameters:**
  - `target` -- target entity to validate
  - `doer` -- player entity attempting to use
*   **Returns:** Boolean true if target has "possessable_chassis" tag
*   **Error states:** None

### `OnEntitySleep()`
*   **Description:** Handles entity sleep state - stops flicker and sound loops. Called on gestalt_cage_filled1/2/3 instances.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

### `OnEntityWake()`
*   **Description:** Handles entity wake state - restores flicker and sound loops if not held. Called on gestalt_cage_filled1/2/3 instances.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

### `OnSave(data)`
*   **Description:** Saves instance state to data table. Called on gestalt_cage_filled2 (saves isplanar) and gestalt_cage_filled_placerindicator (saves rotation) instances.
*   **Parameters:** `data` -- table to save state into
*   **Returns:** None
*   **Error states:** None

### `OnLoad(data)`
*   **Description:** Loads instance state from data table. Called on gestalt_cage_filled2 (loads isplanar) and gestalt_cage_filled_placerindicator (loads rotation) instances.
*   **Parameters:** `data` -- table containing saved state
*   **Returns:** None
*   **Error states:** None

## Events & listeners
- **Listens to:**
    - `onputininventory` -- stops flicker and sound loops when pocketed.
    - `ondropped` -- restores flicker and sound loops when dropped.
    - `wagboss_defeated` -- unlocks deployable component on gestalt_cage_filled1 and gestalt_cage_filled2 only (not filled3).
    - `animqueueover` -- triggers jiggle animation for level 3 capture.
- **Pushes:**
    - `ms_wagpunk_constructrobot` -- fired on world when a Wagdrone is deployed.