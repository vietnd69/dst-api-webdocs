---
id: constructionsite_replica
title: Constructionsite Replica
description: This component handles the client-side representation and networked state synchronization for a construction site entity.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: network
---

# Constructionsite Replica

## Overview
The `constructionsite_replica` component is the client-side counterpart to the master simulation's `constructionsite` component. Its primary responsibility is to manage the replicated network state of a construction site entity, ensuring that client machines accurately display and interact with the construction site based on server data. It handles the association with a `constructionsite_classified` prefab, which holds the actual networked variables and complex state for the construction process.

## Dependencies & Tags
This component explicitly interacts with a `constructionsite_classified` prefab, which is spawned on the master simulation and replicated to clients. It does not add any components or tags to the entity it is attached to.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `self.inst` | `Entity` | (reference to parent entity) | A reference to the entity that this component is attached to. |
| `self._enabled` | `net_bool` | `false` (inferred) | A networked boolean variable indicating whether the construction site is enabled. |
| `self.classified` | `Entity` | `nil` | A reference to the `constructionsite_classified` prefab, which contains the networked classified data for the construction site. |
| `self.ondetachclassified` | `function` | `nil` | A function used as a callback for the "onremove" event, responsible for detaching the classified entity. |

## Main Functions
### `OnRemoveEntity()`
*   **Description:** Called when the entity that this component is attached to is removed. On the master simulation, it ensures that the associated `constructionsite_classified` prefab is also removed.
*   **Parameters:** None.

### `AttachClassified(classified)`
*   **Description:** Establishes the link between this replica component and its associated `constructionsite_classified` prefab. It also sets up an event listener to detach the classified prefab if the main entity is removed.
*   **Parameters:**
    *   `classified`: (`Entity`) The `constructionsite_classified` prefab entity to attach.

### `DetachClassified()`
*   **Description:** Breaks the link to the `constructionsite_classified` prefab and cleans up the event listener. This is typically called when the main entity is being removed or if the classified prefab itself is being detached.
*   **Parameters:** None.

### `SetEnabled(enabled)`
*   **Description:** (Server-side) Sets the `_enabled` network boolean to reflect the construction site's active state. This change is then replicated to clients.
*   **Parameters:**
    *   `enabled`: (`boolean`) `true` to enable the construction site, `false` to disable it.

### `SetBuilder(builder)`
*   **Description:** (Server-side) Sets the network target of the classified entity to the specified builder or the `inst` itself if no builder is provided. This is used to track who initiated or is performing construction. It includes an assertion for specific construction scenarios.
*   **Parameters:**
    *   `builder`: (`Entity`, optional) The entity considered the builder for this construction site. Can be `nil` to clear the builder.

### `SetSlotCount(slot, num)`
*   **Description:** (Server-side) Delegates the call to the `constructionsite_classified` prefab to set the count for a specific ingredient slot.
*   **Parameters:**
    *   `slot`: (`number`) The index of the ingredient slot to modify.
    *   `num`: (`number`) The new count for the specified slot.

### `IsEnabled()`
*   **Description:** (Common interface) Returns the current value of the `_enabled` network boolean, indicating whether the construction site is enabled.
*   **Parameters:** None.

### `IsBuilder(guy)`
*   **Description:** (Common interface) Checks if a given `guy` entity is the designated builder for this construction site. It first attempts to delegate to the master component if available, otherwise, it checks against `ThePlayer` on the client.
*   **Parameters:**
    *   `guy`: (`Entity`) The entity to check against the builder.

### `GetSlotCount(slot)`
*   **Description:** (Common interface) Retrieves the current count of ingredients in a specific slot. It first attempts to delegate to the master component if available, otherwise, it retrieves the count from the `constructionsite_classified` prefab on the client.
*   **Parameters:**
    *   `slot`: (`number`) The index of the ingredient slot to query.

### `GetIngredients()`
*   **Description:** (Common interface) Returns a table of ingredients required for this construction site, based on its prefab name in the global `CONSTRUCTION_PLANS` table.
*   **Parameters:** None.

## Events & Listeners
*   Listens for the `"onremove"` event on `self.inst` to trigger `self.ondetachclassified` when the `constructionsite_classified` prefab is attached.