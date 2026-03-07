---
id: farm_plow
title: Farm Plow
description: A deployable tool that tills soil into farmable ground and handles plowing animations and debris effects.
tags: [farming, terrain, deployment, effects]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dcca7e99
system_scope: world
---

# Farm Plow

> Based on game build **7140014** | Last updated: 2026-03-05

## Overview
The `farm_plow` prefab implements a multi-part system for the farm plow tool in DST: the active plow entity, its inventory item version, and a helper placer. The active plow entity uses the `terraformer` component to convert tiles into `FARMING_SOIL`, triggers soil collapse and debris spawning via `OnTerraform`, and manages animations/timing via the `timer` and `workable` components. The item version consumes finite uses and spawns the active entity on deployment.

## Usage example
```lua
-- Deploying the plow item (e.g., after inventory pick-up)
local item = SpawnPrefab("farm_plow_item")
item.Transform:SetPosition(x, y, z)
local pt = Vector3(x, y, z)
item.components.deployable.ondeploy(item, pt, player)

-- Spawning the active plow entity manually
local plow = SpawnPrefab("farm_plow")
plow.Transform:SetPosition(x, y, z)
plow.components.terraformer:Terraform(plow:GetPosition())
```

## Dependencies & tags
**Components used:** `workable`, `timer`, `terraformer`, `inventoryitem`, `deployable`, `finiteuses`, `placer`, `inspectable`.  
**Tags:** Adds `scarytoprey`, `usedeploystring`, `tile_deploy`, `placer`, `CLASSIFIED`, `NOCLICK`.  
**Tags checked:** `NOBLOCK`, `locomotor`, `NOCLICK`, `FX`, `DECOR`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `deploy_item_save_record` | table or nil | `nil` | Save record data for the inventory item that spawned this plow. |
| `startup_task` | task or nil | `nil` | Delayed task used to start the plowing animation. |

## Main functions
### `DoDrilling(inst)`
*   **Description:** Initiates the plow’s drilling animation and sound loop, schedules dirt particle effects via `dirt_anim`, and starts the "drilling" timer.
*   **Parameters:** `inst` (Entity) — the active plow entity.
*   **Returns:** Nothing.
*   **Error states:** Cancels and replaces existing drill loop if already running.

### `OnTerraform(inst, pt, old_tile_type, old_tile_turf_prefab)`
*   **Description:** Called by `terraformer` when plowing succeeds. Spawns debris entities (`farm_soil_debris`), dirt puffs, and transitions to the finished state.
*   **Parameters:** `inst` (Entity), `pt` (Vector3), `old_tile_type` (string), `old_tile_turf_prefab` (string or nil).
*   **Returns:** Nothing.
*   **Error states:** Debris spawning uses `TUNING.FARM_PLOW_DRILLING_DEBRIS_MIN/MAX` and prevents overlapping positions.

### `Finished(inst, force_fx)`
*   **Description:** Ends the plow’s operation, optionally spawns debris/collapse FX, and fires the `finishplowing` event before removal.
*   **Parameters:** `inst` (Entity), `force_fx` (optional boolean, unused in current implementation).
*   **Returns:** Nothing.

### `item_ondeploy(inst, pt, deployer)`
*   **Description:** Callback for the inventory item’s deployment. Spawns the active `farm_plow` prefab, consumes one use, and saves the item’s state to `deploy_item_save_record`.
*   **Parameters:** `inst` (Entity, the item), `pt` (Vector3), `deployer` (Entity).
*   **Returns:** Nothing.

### `can_plow_tile(inst, pt, mouseover, deployer)`
*   **Description:** Validates whether the target tile is a valid location for plowing. Used as the `oncanplace` check for `DEPLOYMODE.CUSTOM`.
*   **Parameters:** `inst` (Entity), `pt` (Vector3), `mouseover` (boolean), `deployer` (Entity).
*   **Returns:** `true` if tile can be plowed (`CanPlantAtPoint` returns true, tile is not already `FARMING_SOIL`, and no blocking entities present); otherwise `false`.

## Events & listeners
- **Listens to:** `animover` — triggers `DoDrilling` after pre-drill animation; `timerdone` — triggers `timerdone` to finish plowing when timer expires.
- **Pushes:** `finishplowing` — fired when plowing completes and entity is removed.