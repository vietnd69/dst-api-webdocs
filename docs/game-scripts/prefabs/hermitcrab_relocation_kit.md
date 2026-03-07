---
id: hermitcrab_relocation_kit
title: Hermitcrab Relocation Kit
description: A deployable inventory item used to pre-configure and place hermit crab structures and markers on a forest island, coordinated via the hermitcrab_relocation_manager component.
tags: [deploy, relocation, hermitcrab, placement, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a4ff7165
system_scope: environment
---

# Hermitcrab Relocation Kit

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hermitcrab_relocation_kit` is a deployable inventory item that allows players to configure and commit a set of pre-defined placements (e.g., hermit houses, meat racks, bee boxes, fishing markers) for relocation to a forest island. It works in tandem with the `deployable`, `placer`, and `hermitcrab_relocation_manager` components to validate placement locations, handle orientation, and coordinate with the world's hermit crab system. Upon deployment, it either passes placement data to the manager for server-side execution (in multiplayer) or applies placements directly (in single-player).

## Usage example
```lua
-- Typical usage in a prefab definition:
return Prefab("hermitcrab_relocation_kit", fn, assets),
    MakePlacer("hermitcrab_relocation_kit_placer", nil, nil, nil, nil, nil, nil, nil, 90, nil, PlacerPostinit)

-- The kit item is not added manually to entities; it is instantiated as an inventory item via `fn()`.
-- The placer version is used during preview/deploy mode and handles visual feedback and grid occupation outlines.
```

## Dependencies & tags
**Components used:**  
- `deployable` – sets `DEPLOYMODE.CUSTOM` and registers `ondeploy` callback  
- `placer` – used by the associated placer prefab (`hermitcrab_relocation_kit_placer`) for visual feedback, placement validation, and grid occupation  
- `inventoryitem` – enables storage in inventory  
- `inspectable` – provides inspect functionality  

**Tags added to the kit item:**  
- `deploykititem` – indicates it is a deployable kit  
- `usedeployspacingasoffset` – affects how deploy spacing is interpreted during placement  

**Tags added to the placer entity:**  
- `CLASSIFIED`, `NOCLICK`, `placer` – prevents interaction, hides from UI, and identifies placement visuals  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PEARLSETPIECE_KIT` | table | *Defined inline* | Mapping of prefab names to arrays of `{x, z, 0}` offsets relative to deployment point. Used by the placer and deploy logic to determine relative placement positions. |
| `_custom_candeploy_fn` | function | `CLIENT_CanDeployKit` | Custom deployment validation callback for `DEPLOYMODE.CUSTOM`. Validates world type, manager state, area clear, and tile requirements. |
| `placervisuals` | table | `{}` | Only on placer entity; maps prefab names to arrays of visual entity instances used to show placement validity (e.g., green/red reticules and model previews). |
| `cached_coords` | table | `{ x = -1, z = -1 }` | Only on placer entity; tracks current tile coordinates to optimize grid-outline updates. |
| `group_outline` | entity or `nil` | `nil` | Only on placer entity; reference to the grid-outline prefab for highlighting occupied tiles during preview. |

## Main functions
### `CLIENT_CanDeployKit(inst, pt, mouseover, deployer, rotation)`
* **Description:** Validates if the kit can be deployed at a given point, considering world type, hermit crab relocation manager state, area clearance, and tile validity (land or ocean depending on item). Runs client-side for input feedback.
* **Parameters:**  
  - `inst` (entity) – the kit inventory item instance  
  - `pt` (Vector3 or similar) – target world position of deployment center  
  - `mouseover` – unused in current implementation  
  - `deployer` (entity) – the entity attempting deployment (e.g., player)  
  - `rotation` (number) – current rotation in degrees (positive = counter-clockwise)  
* **Returns:**  
  - `true` if deployment is valid  
  - `false, "HERMITCRAB_RELOCATE"` if deployment is invalid due to manager restrictions (e.g., cooldown or limit reached)  
  - `false` if any placement would collide with blocked tiles (e.g., ocean in wrong location, occupied area, or Wag Punk Arena)  
* **Error states:** Returns early if world is not `"forest"`; rotation is applied to all offsets before validation.

### `ondeploy(inst, pt, deployer, rotation)`
* **Description:** Server-side callback executed when the kit is deployed. Transforms and offsets all placements using the current rotation, then passes the oriented setpiece data to `hermitcrab_relocation_manager:SetupTeleportingPearlToSetPieceData` (if present) and removes the kit item. In single-player, it simply positions the kit at `pt` (fallback).
* **Parameters:**  
  - `inst` (entity) – the deployed kit item instance  
  - `pt` (Vector3 or similar) – deployment target center point  
  - `deployer` (entity) – the entity performing deployment  
  - `rotation` (number) – current rotation in degrees  
* **Returns:** Nothing  
* **Side effects:** Removes the kit entity; may trigger teleportation logic via the manager.

### `OnUpdateTransform(inst)`
* **Description:** (Placer only) Updates visual feedback and grid-outline positions in real time as the placer is moved. For each placement item, checks validity (collision, tile type) and updates color and animation state (green = valid, red = invalid). Maintains an outline overlay of occupied grid cells when buildable.
* **Parameters:**  
  - `inst` (entity) – the placer instance  
* **Returns:** Nothing  
* **Side effects:** Modifies visibility, color, and animation of placer visuals; updates or clears the `group_outline` grid overlay.

### `OnCanBuild(inst, mouseblocked)`
* **Description:** (Placer only) Called when the placer can be built at the current location. Sets green tint on visuals (`0.25, 0.75, 0.25, 0`) and ensures the placer is visible.
* **Parameters:**  
  - `inst` (entity) – the placer instance  
  - `mouseblocked` – unused  
* **Returns:** Nothing  

### `OnCannotBuild(inst, mouseblocked)`
* **Description:** (Placer only) Called when the placer cannot be built. Sets red tint (`0.75, 0.25, 0.25, 0`) and ensures visibility.
* **Parameters:**  
  - `inst` (entity) – the placer instance  
  - `mouseblocked` – unused  
* **Returns:** Nothing  

### `PlacerPostinit(inst)`
* **Description:** (Placer only) Initializes placer visuals, listeners, and placement callbacks. Creates visual entities for each placement item using `CreatePlacerVisual`, sets up transformations and parent-child relationships, and assigns callbacks for updates, buildable, and unbuildable states.
* **Parameters:**  
  - `inst` (entity) – theplacer instance  
* **Returns:** Nothing  
* **Side effects:** Sets `placer.hide_inv_icon = false`; attaches `OnUpdateTransform`, `OnCanBuild`, and `OnCannotBuild`; listens for `"onremove"` to clear outline visuals.

## Events & listeners
- **Listens to:**  
  - `onremove` (placer only) – triggers `Placer_OnRemove` to clear grid-outline visuals when the placer is destroyed  
- **Pushes:**  
  - `hermitcrab_relocate` (via `ondeploy` via manager error return) – error string used in client-side feedback  
  - Deployment success is handled via manager events (external to this kit logic)