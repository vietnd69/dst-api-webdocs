---
id: deployable
title: Deployable
description: Manages deployment behavior and constraints for inventory items that can be placed into the world, such as walls, plants, boats, and masts.
tags: [inventory, world, placement, gameplay]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 53b0f61b
system_scope: world
---

# Deployable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Deployable` defines how an entity can be deployed (placed) into the world, including constraints on *who* can deploy it, *where* it can be placed, and *how* placement is validated. It works closely with `inventoryitem_replica` to sync deployment settings to the client and integrates with `inventory`, `rider`, and `complexprojectile` components to enforce context-sensitive deployment rules. It also interacts with `TheWorld.Map` functions to validate spatial constraints.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("deployable")
inst.components.deployable:SetDeployMode(DEPLOYMODE.TURF)
inst.components.deployable:SetDeploySpacing(DEPLOYSPACING.BIG)
inst.components.deployable:SetUseGridPlacer(true)
inst.components.deployable.ondeploy = function(inst, pt, deployer, rot)
    -- custom logic during deployment
end
```

## Dependencies & tags
**Components used:** `inventory`, `rider`, `complexprojectile` (for `IsRiding` and `IsFloaterHeld` checks), `inventoryitem_replica` (via `self.inst.replica.inventoryitem`).
**Tags:** Adds `deployable` on attachment; removes it on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mode` | `DEPLOYMODE` | `DEPLOYMODE.DEFAULT` | Deployment mode (e.g., `TURF`, `WATER`, `CUSTOM`). Controls placement rules. |
| `spacing` | `DEPLOYSPACING` | `DEPLOYSPACING.DEFAULT` | Spacing constraint used for radius checks during placement. |
| `restrictedtag` | string or `nil` | `nil` | If set, only entities with this tag may deploy this item. |
| `usegridplacer` | boolean or `nil` | `nil` | If truthy, uses grid-based placement instead of freehand. |
| `ondeploy` | function or `nil` | `nil` | Optional callback fired during deployment: `function(inst, pt, deployer, rot)`. |
| `deploytoss_symbol_override` | table or `nil` | `nil` | Symbol override data for the `deploytoss_pre` animation. |

## Main functions
### `SetDeployMode(mode)`
* **Description:** Sets the deployment mode, which determines the placement logic (e.g., `TURF`, `WATER`, `CUSTOM`).
* **Parameters:** `mode` (`DEPLOYMODE`) — the deployment behavior mode.
* **Returns:** Nothing.

### `GetDeployMode()`
* **Description:** Returns the current deployment mode.
* **Parameters:** None.
* **Returns:** `DEPLOYMODE` — the currently configured mode.

### `SetDeploySpacing(spacing)`
* **Description:** Sets the spacing constraint for radius-based placement checks.
* **Parameters:** `spacing` (`DEPLOYSPACING`) — spacing level (e.g., `DEFAULT`, `BIG`).
* **Returns:** Nothing.

### `SetUseGridPlacer(usegridplacer)`
* **Description:** Enables or disables grid-based placement for this item.
* **Parameters:** `usegridplacer` (boolean or truthy/falsy value) — whether to use grid snapping.
* **Returns:** Nothing.

### `DeploySpacingRadius()`
* **Description:** Returns the placement radius (in world units) corresponding to the current `spacing`.
* **Parameters:** None.
* **Returns:** `number` — radius used for collision and spacing checks during placement.

### `IsDeployable(deployer)`
* **Description:** Checks whether the given entity (`deployer`) is allowed to deploy this item, based on tag restrictions and contextual state (e.g., riding or floating).
* **Parameters:** `deployer` (`Entity` or `nil`) — the entity attempting deployment.
* **Returns:** `boolean` — `true` if deployment is allowed, `false` otherwise.
* **Error states:** Returns `false` if `restrictedtag` is set and `deployer` lacks it; returns `false` if deployed by a rider but the item is not a `complexprojectile`; returns `false` if deployed by a floater-held item but the item lacks the `boatbuilder` tag.

### `CanDeploy(pt, mouseover, deployer, rot)`
* **Description:** Validates whether the item can be placed at the given world point `pt`, according to `mode` and world geometry.
* **Parameters:**  
  - `pt` (`Vector` or `VectorReplica`) — world position to attempt placement.  
  - `mouseover` (`Entity` or `nil`) — the entity under the mouse (used in `DEFAULT` mode).  
  - `deployer` (`Entity` or `nil`) — the deploying entity.  
  - `rot` (`number` or `nil`) — rotation angle (used in `CUSTOM` mode).
* **Returns:** `boolean` — `true` if placement is valid at `pt`, `false` otherwise.
* **Error states:** Returns `false` if `IsDeployable(deployer)` returns `false`; delegates placement validation to `TheWorld.Map` functions based on `mode`.

### `Deploy(pt, deployer, rot)`
* **Description:** Attempts to deploy the item at `pt`, calling validation and custom logic, then removes the item from the world (assumes it is consumed or converted to a placed entity).
* **Parameters:**  
  - `pt` (`Vector`) — deployment position.  
  - `deployer` (`Entity` or `nil`) — deploying entity.  
  - `rot` (`number` or `nil`) — rotation at placement.
* **Returns:** `success` (boolean), `reason` (string or `nil`) — `success` is `true` only if `CanDeploy` passes and deployment logic completes; `reason` may contain a failure message on failure.
* **Error states:** Returns `false, reason` if `CanDeploy` fails; `self.inst` may be removed during the `ondeploy` callback, so callers must avoid referencing it afterward.

### `SetDeployTossSymbolOverride(data)`
* **Description:** Sets symbol override data for the deployment toss animation (`deploytoss_pre`). Used to visually customize the toss (e.g., show a boat icon while deploying a boat).
* **Parameters:** `data` (table or `nil`) — symbol override configuration; structure matches `anim:GetSymbol()` usage.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly (internal callbacks via property setters).
- **Pushes:** `deployitem` — fired via `deployer:PushEvent("deployitem", { prefab = self.inst.prefab })` during successful deployment; `itemplanted` — fired via `TheWorld:PushEvent("itemplanted", { doer = deployer, pos = pt })` if the item has the `deployedplant` tag.

## Additional notes
- The constructor automatically adds the `deployable` tag to `self.inst`.
- On removal from entity (`OnRemoveFromEntity`), it resets `inventoryitem_replica` deployment properties and removes the `deployable` tag.
- Property setters for `mode`, `spacing`, `restrictedtag`, and `usegridplacer` trigger corresponding updates on `inventoryitem_replica`, ensuring client-side sync.
