---
id: dock_kit
title: Dock Kit
description: A deployable item that places a monkey dock tile on ocean shores and coordinates with the dock manager to manage placement validity and safety.
tags: [environment, crafting, world, inventory, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4fb07abc
system_scope: world
---

# Dock Kit

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `dock_kit` prefab functions as a deployable inventory item used to construct monkey docks on ocean shore tiles. It is deployed using custom validation logic that verifies the tile is an ocean coastal type and has adjacent permanent land tiles. Upon successful deployment, it registers a dock tile with the `dockmanager` component and handles unsafe placement warnings. It also spawns a temporary `dock_tile_registrator` entity to manage persistent state (e.g., undertile data) and ensure proper tile-layer integration.

## Usage example
```lua
-- Example: Creating and deploying a dock kit in code
local inst = SpawnPrefab("dock_kit")
inst.components.stackable:SetStackSize(1)
inst.components.deployable:SetDeployMode(DEPLOYMODE.CUSTOM)

-- Assume 'pt' is a valid Vector3 position on an ocean shore
inst.components.deployable.ondeploy(inst, pt, ThePlayer)
```

## Dependencies & tags
**Components used:** `deployable`, `stackable`, `inventoryitem`, `inspectable`, `undertile` (via `dock_tile_registrator`), `dockmanager`, `talker`.  
**Tags added by prefab:** `groundtile`, `deploykititem`, `usedeployspacingasoffset`.  
**Tags added by registrator:** `CLASSIFIED`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_loaded_undertile` | `WORLD_TILES.*` or `nil` | `nil` | Stores the undertile type loaded from saved data for registrator persistence. |
| `_custom_candeploy_fn` | function | `CLIENT_CanDeployDockKit` | Custom client-side deploy validation function for DEPLOYMODE.CUSTOM. |

## Main functions
### `CLIENT_CanDeployDockKit(inst, pt, mouseover, deployer, rotation)`
*   **Description:** Validates whether the dock kit can be deployed at a given world point. Checks that the tile is coastal/ocean shore and has adjacent permanent land tiles.
*   **Parameters:**  
    - `inst` (entity): The dock kit prefab instance.  
    - `pt` (Vector3): World position to test.  
    - `mouseover` (any): Unused in this function.  
    - `deployer` (entity or `nil`): The entity attempting deployment.  
    - `rotation` (any): Unused in this function.  
*   **Returns:** `true` if deployable; otherwise `false`.
*   **Error states:** Returns `false` if the tile is not ocean coastal type, lacks adjacent valid land tiles, or `dockmanager:CanDeployDockAtPoint` returns `false`.

### `on_deploy(inst, pt, deployer)`
*   **Description:** Server-side callback invoked after deployment succeeds. Creates a monkey dock tile, checks dock safety, and removes the deployed kit. Announces boat sinking if unsafe.
*   **Parameters:**  
    - `inst` (entity): The dock kit instance being deployed.  
    - `pt` (Vector3): Deployment world position.  
    - `deployer` (entity or `nil`): The entity deploying the kit.  
*   **Returns:** Nothing.
*   **Error states:**  
    - Does nothing if `TheWorld.components.dockmanager` is missing.  
    - Sound effect only plays if `deployer` and `deployer.SoundEmitter` exist.  
    - Warning only spoken if `dock_unsafe` is true *and* `deployer.components.talker` exists.  
    - Always removes the kit instance after processing via `inst.components.stackable:Get():Remove()`.

## Events & listeners
- **Listens to:** `dock_tile_registrator` entity listens to internal task delay (`DoTaskInTime(1*FRAMES, on_registrator_postpass)`).
- **Pushes:** None explicitly; interacts via component function calls (e.g., `dockmanager:CreateDockAtPoint`, `dockmanager:ResolveDockSafetyAtPoint`, `talker:Say`).
