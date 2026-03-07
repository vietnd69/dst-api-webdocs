---
id: wagpunk_floor_kit
title: Wagpunk Floor Kit
description: Deploys permanent ocean-floor floor tiles in Wagstaff Arena areas, replacing tiles and salvaging any submerged objects found beneath them.
tags: [environment, world, placement]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c3820db9
system_scope: world
---

# Wagpunk Floor Kit

> Based on game build **7140014** | Last updated: 2026-03-07

## Overview
`wagpunk_floor_kit` is a deployable item prefab that places a permanent `WAGSTAFF_FLOOR` tile on the ocean surface in Wagstaff Arena zones. When deployed, it checks for and salvages any entities with the `winchtarget` tag beneath the placement point—moving them to safe ocean locations or uprooting them if repositioning fails. It is tightly integrated with the `deployable`, `stackable`, `inventoryitem`, and `placer` systems and relies on the `wagpunk_floor_helper` component for client-side visual indicators. The prefab includes associated placers and marker entities to support placement workflow.

## Usage example
```lua
-- Typical usage in a player inventory during placement
if player.components.inventory:HasItem("wagpunk_floor_kit") then
    player:PushEvent("startdeploy", { deployitem = "wagpunk_floor_kit" })
    player.components.deployhelper:SetMode("wagpunk_floor_kit")
end

-- On successful deployment (handled automatically via ondeploy)
-- The item is consumed, the tile is set, and any winch targets beneath are salvaged.
```

## Dependencies & tags
**Components used:** `inventoryitem`, `deployable`, `stackable`, `placer`, `deployhelper`, `inspectable`, `wagpunk_floor_helper`  
**Tags added:** `groundtile`, `deploykititem`, `usedeployspacingasoffset` (on `wagpunk_floor_kit`), `CLASSIFIED`, `NOCLICK`, `placer` (on `wagpunk_floor_placerindicator`), `wagpunk_floor_placerindicator` (on `wagpunk_floor_placerindicator`)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_custom_candeploy_fn` | function | `CLIENT_CanDeployKit` | Custom client-side deployment check function used in `DEPLOYMODE.CUSTOM`. |

## Main functions
### `CLIENT_CanDeployKit(inst, pt, mouseover, deployer, rotation)`
*   **Description:** Validates whether the kit can be deployed at a given point within the Wagstaff Arena. Checks arena boundaries, ocean tile requirements, and adjacent permanent tiles or docks.
*   **Parameters:** `inst` (entity instance), `pt` (Vector3 deployment point), `mouseover` (boolean), `deployer` (entity attempting deployment), `rotation` (unused).
*   **Returns:** `true` if placement is valid; `false` otherwise.
*   **Error states:** Returns `false` if the point is outside the arena, on the arena edge band, on a non-ocean tile, or lacks adjacent permanent/dock tiles.

### `on_deploy(inst, pt, deployer)`
*   **Description:** Server-side function executed upon successful deployment. Replaces the tile with `WAGSTAFF_FLOOR`, consumes the stackable item, removes visual indicators, and salvages or relocates any `winchtarget` entities beneath the tile.
*   **Parameters:** `inst` (the deployed floor kit instance), `pt` (deployment point vector), `deployer` (entity that deployed the item, may be `nil`).
*   **Returns:** Nothing.
*   **Error states:** If nearby ocean placement fails for a `winchtarget`, it is salvaged and removed; no exception is thrown.

### `PlacerPostinit(inst)`
*   **Description:** Post-initialization hook for the `wagpunk_floor_kit_placer` prefab. Configures the placer's behavior and visuals (e.g., color feedback on build success/failure, snap-to-tile).
*   **Parameters:** `inst` (placer entity instance).
*   **Returns:** Nothing.

### `UpdateNetvars(inst)`
*   **Description:** Server-only function for `wagpunk_floor_marker` that registers or updates the marker with the world's `wagpunk_floor_helper` component. Retries scheduling if helper is unavailable.
*   **Parameters:** `inst` (marker entity).
*   **Returns:** Nothing.

### `OnEnableHelper(inst, enabled, recipename, placerinst)`
*   **Description:** Callback used by `wagpunk_floor_placerindicator` to toggle a floor decal helper visual when placement mode is active.
*   **Parameters:** `enabled` (boolean), `recipename` (string), `placerinst` (placer instance).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (passive component with no event listeners).
- **Pushes:** `ms_wagpunk_floor_kit_deployed` — fired on the world entity after successful deployment to notify systems of the floor placement.