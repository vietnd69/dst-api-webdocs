---
id: deployable
title: Deployable
description: Manages the logic and rules for an item to be placed or "deployed" into the game world.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Deployable

## Overview
This component provides the core functionality for entities that can be deployed by players or the world. It defines how an item can be placed, including its placement mode (e.g., anywhere, turf, plant), spacing requirements, and any restrictions based on the deployer's state or tags. It integrates with the `inventoryitem` replica to keep client-side deployment visuals consistent and handles the actual placement logic and event triggering.

## Dependencies & Tags
*   **Dependencies:**
    *   `inst.replica.inventoryitem`: This component heavily relies on the `inventoryitem` replica to communicate deployment settings (mode, spacing, restricted tag, grid placer) to the client.
    *   `complexprojectile` (on `self.inst`): Checked within `IsDeployable` for deployable tossables when the deployer is riding.
    *   `rider` (on `deployer`): Checked within `IsDeployable` to determine if the deployer is mounted.
    *   `inventory` (on `deployer`): Checked within `IsDeployable` to determine if the deployer is holding a floater.
*   **Tags Added/Removed:**
    *   Adds `"deployable"` to `self.inst` upon initialization.
    *   Removes `"deployable"` from `self.inst` when the component is removed via `OnRemoveFromEntity`.
*   **Tags Checked:**
    *   `self.restrictedtag`: If set, `IsDeployable` checks if the `deployer` possesses this tag.
    *   `"boatbuilder"` (on `self.inst`): Checked within `IsDeployable` for items that can be deployed by a floating player.
    *   `"deployedplant"` (on `self.inst`): Checked within `Deploy` to trigger the "itemplanted" event.

## Properties
| Property                     | Type           | Default Value         | Description                                                                                             |
| :--------------------------- | :------------- | :-------------------- | :------------------------------------------------------------------------------------------------------ |
| `mode`                       | `DEPLOYMODE`   | `DEPLOYMODE.DEFAULT`  | The current deployment mode, defining where and how the item can be placed (e.g., on turf, anywhere).   |
| `spacing`                    | `DEPLOYSPACING`| `DEPLOYSPACING.DEFAULT`| The current deployment spacing mode, affecting placement radius and collision checks.                  |
| `restrictedtag`              | `string`/`nil` | `nil`                 | An optional tag string. If set, only entities possessing this tag can deploy this item.                 |
| `usegridplacer`              | `boolean`/`nil`| `nil`                 | If `true`, the item should use a grid-based placement visual/logic; `nil` effectively means `false`.  |
| `ondeploy`                   | `function`/`nil`| `nil`                 | A callback function executed when the item is successfully deployed. Signature: `(inst, pt, deployer, rot)`. |
| `deploytoss_symbol_override` | `table`/`nil`  | `nil`                 | Data for overriding item symbols during the deploy toss animation.                                       |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** Cleans up the component when it is removed from the entity. This involves resetting the deploy mode and restricted tag on the `inventoryitem` replica and removing the `"deployable"` tag from the instance.
*   **Parameters:** None.

### `SetDeployMode(mode)`
*   **Description:** Sets the deployment mode for the item and communicates this change to the client's `inventoryitem` replica.
*   **Parameters:**
    *   `mode`: (`DEPLOYMODE` enum value) The new deployment mode to apply.

### `SetUseGridPlacer(usegridplacer)`
*   **Description:** Sets whether the item should utilize a grid-based placer. This value is also relayed to the client's `inventoryitem` replica.
*   **Parameters:**
    *   `usegridplacer`: (`boolean`) If `true`, enables grid placer; otherwise, disables it.

### `DeploySpacingRadius()`
*   **Description:** Returns the numerical radius corresponding to the current `spacing` mode, as defined in the global `DEPLOYSPACING_RADIUS` table.
*   **Parameters:** None.

### `SetDeployTossSymbolOverride(data)`
*   **Description:** Stores data used to override the item's visual symbols during a deploy toss animation. This is typically used for specific visual effects for tossed items.
*   **Parameters:**
    *   `data`: (`table`) A table containing symbol override information.

### `IsDeployable(deployer)`
*   **Description:** Determines if the item is generally deployable by a given `deployer`. This check considers if a `restrictedtag` is set (and if the deployer has it) and specific conditions related to the deployer's state (e.g., riding a mount, holding a floater).
*   **Parameters:**
    *   `deployer`: (`Entity`) The entity attempting to deploy the item. Can be `nil`.
*   **Returns:** `true` if the item is deployable by the given deployer, `false` otherwise.

### `CanDeploy(pt, mouseover, deployer, rot)`
*   **Description:** Checks if the item can be deployed at a specific point `pt` based on its current `mode` and various world conditions. It delegates the actual placement checks to different `TheWorld.Map:CanDeploy...` functions depending on the `mode`.
*   **Parameters:**
    *   `pt`: (`Vector3`) The target deployment position.
    *   `mouseover`: (`boolean`/`nil`) Optional. Indicates if the placement is currently being moused over by the player, affecting some placement checks.
    *   `deployer`: (`Entity`/`nil`) The entity attempting to deploy the item.
    *   `rot`: (`number`/`nil`) Optional. The intended rotation for deployment.
*   **Returns:** `true` if deployment is possible at the specified point, `false` otherwise.

### `Deploy(pt, deployer, rot)`
*   **Description:** Attempts to deploy the item at the specified position. It first calls `CanDeploy` to validate the placement. If successful, it triggers the `ondeploy` callback (if set) and pushes relevant game events.
*   **Parameters:**
    *   `pt`: (`Vector3`) The target deployment position.
    *   `deployer`: (`Entity`) The entity attempting to deploy the item.
    *   `rot`: (`number`/`nil`) Optional. The rotation for deployment.
*   **Returns:** `true` if deployment was successful, `false` otherwise, along with a `reason` if it failed due to `CanDeploy`.

## Events & Listeners
*   **Events Pushed:**
    *   `"deployitem"` (on `deployer`): Pushed when an item is successfully deployed. Data includes `{ prefab = self.inst.prefab }`.
    *   `"itemplanted"` (on `TheWorld`): Pushed when an item tagged `"deployedplant"` is successfully deployed. Data includes `{ doer = deployer, pos = pt }`.