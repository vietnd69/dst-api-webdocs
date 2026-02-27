---
id: constructionplans
title: Constructionplans
description: This component manages the transformation of specific prefabs into designated construction prefabs.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 2c9b6308
---

# Constructionplans

## Overview
This component allows an entity to define and manage a set of "construction plans," specifying which source prefabs can be transformed into particular construction prefabs. It facilitates the in-game process of initiating construction on a target entity, removing the original, and spawning a new construction site. It also handles associated tagging for the parent entity.

## Dependencies & Tags
None identified.
This component adds tags of the format `[prefab]_plans` to its parent entity for each registered `prefab` in `targetprefabs`. These tags are removed upon unregistering a prefab or when the component is removed from the entity.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | `self` | A reference to the entity this component is attached to. |
| `targetprefabs` | `table` | `{}` | A table mapping target prefab names (string) to their corresponding construction prefab names (string). |

## Main Functions
### `AddTargetPrefab(prefab, constructionprefab)`
*   **Description:** Registers a new target prefab and its corresponding construction prefab. If the `prefab` is new, it also adds a tag in the format `[prefab]_plans` to the component's parent entity.
*   **Parameters:**
    *   `prefab` (string): The name of the prefab that can be transformed.
    *   `constructionprefab` (string): The name of the prefab that should be spawned as the construction site.

### `RemoveTargetPrefab(prefab)`
*   **Description:** Unregisters a target prefab. If the `prefab` was registered, it removes the associated `[prefab]_plans` tag from the component's parent entity.
*   **Parameters:**
    *   `prefab` (string): The name of the prefab to unregister.

### `StartConstruction(target)`
*   **Description:** Initiates the construction process by transforming a `target` entity into its designated construction prefab. It first checks if the target is valid and does not already have a `constructionsite` component. If a valid `constructionprefab` is found for the target's prefab, it spawns the construction product at the target's world position, removes the original `target` entity, and pushes an "onstartconstruction" event on the new product.
*   **Parameters:**
    *   `target` (Entity): The entity to be transformed into a construction site.
*   **Returns:**
    *   `product` (Entity): The newly spawned construction prefab, or `nil` if the process failed.
    *   `"MISMATCH"` (string): If the target's prefab is not registered within this component's `targetprefabs`.

### `OnRemoveFromEntity()`
*   **Description:** This callback is invoked when the `ConstructionPlans` component is removed from its parent entity. It iterates through all registered target prefabs and removes their corresponding `[prefab]_plans` tags from the parent entity to ensure proper cleanup.
*   **Parameters:** None.

## Events & Listeners
*   **Pushes:**
    *   `"onstartconstruction"`: Triggered on the newly spawned construction product after a successful `StartConstruction` call.