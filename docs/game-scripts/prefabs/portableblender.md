---
id: portableblender
title: Portableblender
description: Manages the behavior and state of the portable blender structure and its deployed item form, including cooking functionality, burn mechanics, and workable construction.
tags: [crafting, structure, burnable, deployment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 45794de5
system_scope: crafting
---

# Portableblender

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `portableblender` prefab implements both the physical structure and its inventory-based item form. As a structure, it functions as a prototyper for food-processing recipes, supports combustion (with burnable propagation), and responds to player interactions such as hammering and activation. The item form supports deployment via the `deployable` component and behaves as a floating inventory item. It integrates with core systems like `workable`, `burnable`, `prototyper`, `hauntable`, and `portablestructure`.

## Usage example
```lua
-- Create and configure the portable blender structure
local inst = SpawnPrefab("portableblender")
inst.Transform:SetPosition(worldx, worldy, worldz)

-- Activate the prototyper (turn it on)
inst.components.prototyper.on = true
inst:PushEvent("turnon")

-- Depool the item version for inventory use
local item = SpawnPrefab("portableblender_item")
```

## Dependencies & tags
**Components used:** `burnable`, `deployable`, `hauntable`, `inspectable`, `lootdropper`, `portablestructure`, `prototyper`, `workable`  
**Tags added:** `structure`, `mastercookware` (structure); `portableitem` (item); `FX`, `NOCLICK` (when burnt); `burnt` (on load if previously burnt)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persists` | boolean | `true` (changed to `false` when burnt) | Whether the entity saves to disk. Set `false` when burnt to prevent persistence. |
| `scrapbook_anim` | string | `"idle_ground"` | Animation name used for the scrapbook/minimap representation (applies only to item form). |

## Main functions
### `ChangeToItem(inst)`
*   **Description:** Converts the current structure instance into a new `portableblender_item` at the same world position, playing a collapse animation and sound.
*   **Parameters:** `inst` (Entity) - The structure instance to convert.
*   **Returns:** Nothing. The original `inst` is removed after spawning the item.
*   **Error states:** None — always succeeds if `SpawnPrefab` returns a valid item.

### `OnBurnt(inst)`
*   **Description:** Handles the transition from a burning or active structure to a burnt, non-functional state. Removes the `workable` and `portablestructure` components, spawns ash, and initiates an erosion sequence.
*   **Parameters:** `inst` (Entity) - The burnt structure instance.
*   **Returns:** Nothing.
*   **Error states:** If `workable` or `portablestructure` components are missing, no error occurs due to guard clauses.

### `OnDismantle(inst)`
*   **Description:** Converts the structure to its item form (e.g., when player dismantles it), then removes the structure.
*   **Parameters:** `inst` (Entity) - The dismantled structure instance.
*   **Returns:** Nothing.

### `onhammered(inst)`
*   **Description:** Callback executed after the structure is fully worked (hammered). If burning, extinguishes it; if already burnt, spawns ash; otherwise converts to item form.
*   **Parameters:** `inst` (Entity) - The hammered structure instance.
*   **Returns:** Nothing.

### `onhit(inst)`
*   **Description:** Callback executed during partial work (e.g., player hitting the structure). Plays an animation and sound; may transition to proximity loop if active.
*   **Parameters:** `inst` (Entity) - The struck structure instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if `inst` has the `burnt` tag.

### `onturnon(inst)`
*   **Description:** Activates the proximity looping animation and sound when the prototyper is turned on, unless burnt.
*   **Parameters:** `inst` (Entity) - The structure instance.
*   **Returns:** Nothing.

### `onturnoff(inst)`
*   **Description:** Stops the proximity looping animation/sound when the prototyper is turned off, unless burnt.
*   **Parameters:** `inst` (Entity) - The structure instance.
*   **Returns:** Nothing.

### `onactivate(inst)`
*   **Description:** Triggers the use animation and sound when a recipe is selected in the prototyper UI.
*   **Parameters:** `inst` (Entity) - The structure instance.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes burnt state (burning or burnt tag) into the save data.
*   **Parameters:**  
    *   `inst` (Entity) - The entity instance.  
    *   `data` (table) - Save data table (modified in-place).  
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores burnt state on world load if `data.burnt` is `true`.
*   **Parameters:**  
    *   `inst` (Entity) - The entity instance.  
    *   `data` (table) - Loaded save data.  
*   **Returns:** Nothing.

### `ondeploy(inst, pt, deployer)`
*   **Description:** Callback for deploying the item form into a structure. Spawns the structure, positions it at `pt`, and removes the item.
*   **Parameters:**  
    *   `inst` (Entity) - The item instance being deployed.  
    *   `pt` (vector3) - Deployment position.  
    *   `deployer` (Entity) - The player deploying the item.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    *   `floater_startfloating` — Hides the `shadow_ground` symbol when floating in water.  
    *   `floater_stopfloating` — Shows the `shadow_ground` symbol when floating stops.  
    *   `animover` — Triggers `ErodeAway` when the burnt collapse animation ends (via `OnBurnt`).  
- **Pushes:** None — uses standard component events (`turnon`, `turnoff`, `onactivate`, etc.) via `PushEvent` elsewhere, but not directly defined in this file.