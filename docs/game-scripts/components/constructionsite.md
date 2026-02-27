---
id: constructionsite
title: Constructionsite
description: This component manages the state, materials, and progress of an entity that is being constructed by players.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 855e8ce0
---

# Constructionsite

## Overview
The `constructionsite` component is attached to entities that are intended to be built by players, such as structures, walls, or other craftable objects that require multiple steps or materials. It tracks the required materials, the materials added, the current builder, and handles the completion or interruption of the construction process, including managing excess materials.

## Dependencies & Tags
*   **Tags Added to `self.inst`**:
    *   `"constructionsite"`: Identifies the entity as a construction site.
*   **External Component Interactions**:
    *   `builder.components.constructionbuilder`: Interacts with the builder's `constructionbuilder` component to stop construction.
    *   `builder.components.inventory`: Interacts with the builder's inventory to return excess materials.
    *   `v.components.stackable`: Checks stack sizes and sets them for materials.
    *   `v.components.inventoryitem`: Handles dropping excess materials if the builder cannot hold them.
*   **Global Module Interactions**:
    *   `Stats`: Pushes metrics events related to construction.
    *   `CONSTRUCTION_PLANS`: Relies on this global table (presumably defined elsewhere) to determine required materials and amounts for the specific prefab.

## Properties
| Property              | Type          | Default Value | Description                                                                         |
| :-------------------- | :------------ | :------------ | :---------------------------------------------------------------------------------- |
| `inst`                | `Entity`      | `nil`         | A reference to the entity this component is attached to.                            |
| `materials`           | `table`       | `{}`          | A table storing the materials already added to the construction site, indexed by prefab name, containing `amount` and `slot`. |
| `builder`             | `Entity`      | `nil`         | A reference to the player or entity currently building this construction site.      |
| `constructionprefab`  | `string`      | `nil`         | The prefab name of the final entity that will be spawned upon completion.           |
| `onstartconstructionfn` | `function`    | `nil`         | A callback function to be executed when construction starts. Signature: `fn(inst, doer)`. |
| `onstopconstructionfn`  | `function`    | `nil`         | A callback function to be executed when construction stops. Signature: `fn(inst, doer)`.  |
| `onconstructedfn`     | `function`    | `nil`         | A callback function to be executed when construction is completed. Signature: `fn(inst, doer)`. |
| `enabled`             | `boolean`     | `true`        | Determines if the construction site is currently active and can be built upon.      |

## Main Functions
### `onbuilder(self, builder)`
*   **Description:** Internal setter callback triggered when the `self.builder` property is assigned a new value. It updates the replica's builder state for networking.
*   **Parameters:**
    *   `self`: The `Constructionsite` component instance.
    *   `builder`: The entity that is now building this construction site.

### `onenabled(self, enabled)`
*   **Description:** Internal setter callback triggered when the `self.enabled` property is assigned a new value. It updates the replica's enabled state for networking.
*   **Parameters:**
    *   `self`: The `Constructionsite` component instance.
    *   `enabled`: A boolean indicating the new enabled state.

### `ForceStopConstruction()`
*   **Description:** Forces any current builder to stop constructing this site. It checks if there's a builder and if their `constructionbuilder` component is actively engaged with this site before stopping them.
*   **Parameters:** None.

### `OnRemoveFromEntity()`
*   **Description:** An alias for `ForceStopConstruction`. This function is automatically called by the ECS when the `constructionsite` component is removed from its entity.
*   **Parameters:** None.

### `Enable()`
*   **Description:** Sets the construction site to an enabled state, allowing construction to proceed.
*   **Parameters:** None.

### `Disable()`
*   **Description:** Disables the construction site, preventing further construction. It also forces any current builder to stop construction.
*   **Parameters:** None.

### `IsEnabled()`
*   **Description:** Returns `true` if the construction site is currently enabled, `false` otherwise.
*   **Parameters:** None.

### `SetConstructionPrefab(prefab)`
*   **Description:** Sets the prefab name of the final object that will be created once construction is complete.
*   **Parameters:**
    *   `prefab`: (`string`) The prefab name of the completed object.

### `SetOnStartConstructionFn(fn)`
*   **Description:** Sets a callback function to be invoked when a builder begins constructing this site.
*   **Parameters:**
    *   `fn`: (`function`) The callback function with signature `fn(inst, doer)`.

### `SetOnStopConstructionFn(fn)`
*   **Description:** Sets a callback function to be invoked when a builder stops constructing this site (before completion).
*   **Parameters:**
    *   `fn`: (`function`) The callback function with signature `fn(inst, doer)`.

### `SetOnConstructedFn(fn)`
*   **Description:** Sets a callback function to be invoked when the construction of this site is successfully completed.
*   **Parameters:**
    *   `fn`: (`function`) The callback function with signature `fn(inst, doer)`.

### `OnStartConstruction(doer)`
*   **Description:** Records the given `doer` as the current builder and invokes the `onstartconstructionfn` callback if set.
*   **Parameters:**
    *   `doer`: (`Entity`) The entity that has started constructing.

### `OnStopConstruction(doer)`
*   **Description:** Clears the current builder and invokes the `onstopconstructionfn` callback if set.
*   **Parameters:**
    *   `doer`: (`Entity`) The entity that has stopped constructing.

### `OnConstruct(doer, items)`
*   **Description:** Handles the submission of materials to the construction site. It processes the given `items`, adds them to the construction, handles any remainder by returning to the builder or dropping, and removes consumed items. It then clears the builder, pushes construction metrics, and invokes the `onconstructedfn` callback.
*   **Parameters:**
    *   `doer`: (`Entity`) The entity that submitted the materials.
    *   `items`: (`table`) A table of `inventoryitem` entities being submitted as materials.

### `HasBuilder()`
*   **Description:** Returns `true` if there is an entity currently building this construction site, `false` otherwise.
*   **Parameters:** None.

### `IsBuilder(guy)`
*   **Description:** Checks if the given `guy` entity is the current builder of this construction site.
*   **Parameters:**
    *   `guy`: (`Entity`) The entity to check.

### `AddMaterial(prefab, num)`
*   **Description:** Adds a specified number of a material prefab to the construction site. It checks `CONSTRUCTION_PLANS` to determine required amounts and updates the internal `materials` table and the replica.
*   **Parameters:**
    *   `prefab`: (`string`) The prefab name of the material to add.
    *   `num`: (`number`) The number of units of the material to add.
*   **Returns:** (`number`) The number of material units that could not be added (remainder).

### `RemoveMaterial(prefab, num)`
*   **Description:** Removes a specified number of a material prefab from the construction site. It updates the internal `materials` table and the replica.
*   **Parameters:**
    *   `prefab`: (`string`) The prefab name of the material to remove.
    *   `num`: (`number`, optional) The number of units to remove. Defaults to 1 if not provided.
*   **Returns:** (`number`) The actual number of material units that were removed.

### `DropAllMaterials(drop_pos)`
*   **Description:** Spawns all currently stored materials at or near the construction site's position, clearing the `materials` table.
*   **Parameters:**
    *   `drop_pos`: (`Vector3`, optional) The specific world position to drop the materials. If `nil`, drops at the construction site's current world position.

### `GetMaterialCount(prefab)`
*   **Description:** Returns the current count of a specific material prefab that has been added to the construction site.
*   **Parameters:**
    *   `prefab`: (`string`) The prefab name of the material.
*   **Returns:** (`number`) The count of the material.

### `GetSlotCount(slot)`
*   **Description:** Returns the current count of material for a specific slot, as defined in `CONSTRUCTION_PLANS`.
*   **Parameters:**
    *   `slot`: (`number`) The numerical index of the material slot in `CONSTRUCTION_PLANS`.
*   **Returns:** (`number`) The count of the material in that slot.

### `IsComplete()`
*   **Description:** Checks if all required materials, as defined in `CONSTRUCTION_PLANS`, have been added to the construction site.
*   **Parameters:** None.
*   **Returns:** (`boolean`) `true` if construction is complete, `false` otherwise.

### `ForceCompletion(doer)`
*   **Description:** Instantly adds any missing materials to complete the construction and then calls `OnConstruct` as if the `doer` had completed it.
*   **Parameters:**
    *   `doer`: (`Entity`) The entity credited with forcing completion.

### `OnSave()`
*   **Description:** Provides data for saving the component's state, specifically the amounts of each material collected.
*   **Parameters:** None.
*   **Returns:** (`table`) A table containing a `materials` key with material prefab names mapped to their collected amounts, or `nil` if no materials are present.

### `OnLoad(data)`
*   **Description:** Restores the component's state from saved data, populating the `materials` table and updating the replica.
*   **Parameters:**
    *   `data`: (`table`) The table containing saved data, typically from `OnSave`.

### `GetDebugString()`
*   **Description:** Generates a string containing debug information about the construction site, including the current builder and the progress of each required material.
*   **Parameters:** None.
*   **Returns:** (`string`) A formatted debug string.