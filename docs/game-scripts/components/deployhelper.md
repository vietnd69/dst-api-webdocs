---
id: deployhelper
title: Deployhelper
description: This component allows an entity to act as a deploy helper, providing temporary beneficial effects when a player deploys an item within its range, optionally filtered by recipe or a specific key.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 9741f135
---

# Deployhelper

## Overview
The `DeployHelper` component equips an entity with the ability to "assist" or react to deployment actions occurring nearby. When an item is deployed by a player within a configurable range of an entity with this component, the `DeployHelper` can activate, triggering custom callbacks. Activation can be filtered by specific recipe names or a special `deployhelper_key` set on the `placerinst`. This component is designed for entities that provide temporary buffs or interactions based on proximity to player construction or placement.

## Dependencies & Tags
This component implicitly relies on the entity (`inst`) having the capability to register for and receive periodic updates via `inst:StartWallUpdatingComponent(self)` and `inst:StopWallUpdatingComponent(self)`. This usually means the entity either has a `wallupdater` component or implements similar update logic.

None identified for explicit tags added/removed by the component itself.

## Properties
The `DeployHelper` component initializes several properties, primarily for callbacks and filtering.

| Property           | Type     | Default Value | Description                                                                                                                                                                    |
| :----------------- | :------- | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onenablehelper`   | `function` | `nil`         | A callback function `(inst, enabled, recipename, placerinst)` that is called when the helper starts (enabled = `true`) or stops (enabled = `false`). `recipename` and `placerinst` are only provided on enable. |
| `recipefilters`    | `table`  | `nil`         | A table of recipe names (`{ [recipename] = true }`) that, if present, determines which deployed recipes can activate this helper. Populated via `AddRecipeFilter`.              |
| `keyfilters`       | `table`  | `nil`         | A table of keys (`{ [key] = true }`) that, if present, determines which `placerinst.deployhelper_key` values can activate this helper. Populated via `AddKeyFilter`.       |
| `canenablehelper`  | `function` | `nil`         | An optional callback function `(inst)` that returns `true` if the helper can currently be enabled, or `false` otherwise. If `nil`, the helper can always enable.               |
| `onstarthelper`    | `function` | `nil`         | An optional callback function `(inst, recipename, placerinst)` that is called immediately when the helper starts, even if already active.                                   |
| `delay`            | `number` | `nil`         | An internal countdown used to manage the helper's active duration. Not intended for direct external modification.                                                                |

## Main Functions

### `TriggerDeployHelpers(x, y, z, range, recipe, placerinst)`
*   **Description:** This is a global function responsible for iterating through all active `DeployHelper` instances registered in the `DEPLOY_HELPERS` table. It checks if any helper is within the specified range of the deployment point and if it matches the provided recipe or `placerinst.deployhelper_key` filters. If conditions are met and `canenablehelper` allows, it calls `StartHelper` on the matching `DeployHelper` instance.
*   **Parameters:**
    *   `x`: (`number`) The X coordinate of the deployment.
    *   `y`: (`number`) The Y coordinate of the deployment.
    *   `z`: (`number`) The Z coordinate of the deployment.
    *   `range`: (`number`) The maximum distance (radius) in which a helper can activate, measured from the deployment point.
    *   `recipe`: (`table`) The `Recipe` object for the item being deployed. Can be `nil` if activation is key-based.
    *   `placerinst`: (`entity`) The entity that performed the deployment action. May contain a `deployhelper_key` property.

### `DeployHelper:OnEntitySleep()`
*   **Description:** This method is called when the component's parent entity goes to sleep. It removes the helper from the global `DEPLOY_HELPERS` table, effectively deactivating it, and calls `StopHelper` to clean up its state.
*   **Parameters:** None.

### `DeployHelper:OnEntityWake()`
*   **Description:** This method is called when the component's parent entity wakes up. It adds the helper back to the global `DEPLOY_HELPERS` table, making it available for activation again.
*   **Parameters:** None.

### `DeployHelper:AddRecipeFilter(recipename)`
*   **Description:** Adds a specific recipe name to the internal `recipefilters` table. If this table is present, the helper will only activate for deployments of recipes listed here.
*   **Parameters:**
    *   `recipename`: (`string`) The name of the recipe (e.g., "science_machine").

### `DeployHelper:AddKeyFilter(key)`
*   **Description:** Adds a specific key to the internal `keyfilters` table. If this table is present, the helper will only activate for deployments where the `placerinst` has a matching `deployhelper_key` property.
*   **Parameters:**
    *   `key`: (`string`) The key to add to the filter.

### `DeployHelper:StartHelper(recipename, placerinst)`
*   **Description:** Activates the helper. If it's not already active (or delayed), it sets an internal `delay` countdown, registers the component for periodic updates via `inst:StartWallUpdatingComponent`, and triggers the `onenablehelper` callback (with `true`) and `onstarthelper` callback. If `delay` is already set, it simply resets `delay` to 2.
*   **Parameters:**
    *   `recipename`: (`string`) The name of the recipe or the `deployhelper_key` that triggered the helper.
    *   `placerinst`: (`entity`) The entity that initiated the deployment.

### `DeployHelper:StopHelper()`
*   **Description:** Deactivates the helper. If it is currently active (i.e., `delay` is set), it clears the `delay`, unregisters the component from periodic updates via `inst:StopWallUpdatingComponent`, and triggers the `onenablehelper` callback (with `false`).
*   **Parameters:** None.

### `DeployHelper:OnWallUpdate()`
*   **Description:** This method is called periodically while the helper is active and registered with `inst:StartWallUpdatingComponent`. It decrements the internal `delay` countdown. When `delay` reaches `1` or less, it calls `StopHelper` to deactivate the helper.
*   **Parameters:** None.