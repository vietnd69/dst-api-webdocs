---
id: constructionbuilderuidata
title: Constructionbuilderuidata
description: This component manages UI-related data for construction, specifically tracking the current container and target construction entity for a player.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: ui
source_hash: a9b6f24f
---

# Constructionbuilderuidata

## Overview
The `ConstructionBuilderUIData` component serves as a lightweight data store, primarily for UI purposes related to construction. It holds network-synced references to a player's current construction container (e.g., a crafting station or inventory) and the active construction target (e.g., a ghost entity representing a construction site). It provides methods to set and retrieve these entities, and utility functions to query ingredient requirements from the target construction plan. This component is designed to provide necessary construction data to the client UI without requiring a full `constructionbuilder_replica` component on every entity.

## Dependencies & Tags
None identified. This component does not explicitly rely on other components via `AddComponent` calls within its own script, nor does it add or remove specific tags from the entity it's attached to.

## Properties
| Property          | Type        | Default Value | Description                                                                                                                                                                             |
| :---------------- | :---------- | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_containerinst`  | `net_entity`| `nil`         | A network-synchronized reference to the entity currently acting as the container for construction ingredients (e.g., a crafting station or the player's inventory itself).                 |
| `_targetinst`     | `net_entity`| `nil`         | A network-synchronized reference to the entity that is the current construction target (e.g., a ghost entity representing a construction site or a partially built structure). |

## Main Functions
### `SetContainer(containerinst)`
*   **Description:** Sets the entity that currently functions as the source or container for construction ingredients. This reference is synchronized across the network.
*   **Parameters:**
    *   `containerinst`: (`Entity`) The entity to be set as the container.

### `GetContainer()`
*   **Description:** Retrieves the entity currently set as the container for construction ingredients.
*   **Parameters:** None.

### `SetTarget(targetinst)`
*   **Description:** Sets the entity that is currently the target for construction. This reference is synchronized across the network.
*   **Parameters:**
    *   `targetinst`: (`Entity`) The entity to be set as the construction target.

### `GetTarget()`
*   **Description:** Retrieves the entity currently set as the construction target.
*   **Parameters:** None.

### `GetConstructionSite()`
*   **Description:** Returns the `constructionsite` replica component of the current target entity, if a target is set and it possesses that component. This allows querying the actual construction progress or state.
*   **Parameters:** None.

### `GetIngredientForSlot(slot)`
*   **Description:** Determines the `type` (prefab name) of the ingredient required for a specific `slot` in the current target entity's construction plan. This relies on the global `CONSTRUCTION_PLANS` table.
*   **Parameters:**
    *   `slot`: (`number`) The numerical index of the ingredient slot (e.g., 1 for the first ingredient).

### `GetSlotForIngredient(prefab)`
*   **Description:** Finds the numerical slot index for a given ingredient `prefab` within the current target entity's construction plan. This relies on the global `CONSTRUCTION_PLANS` table.
*   **Parameters:**
    *   `prefab`: (`string`) The prefab name of the ingredient to look for.