---
id: dryingrack
title: Dryingrack
description: This component manages the drying process of items within an associated container, dynamically adjusting to environmental conditions like rain and acid rain.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: inventory
source_hash: f3dc5ab8
---

# Dryingrack

## Overview
The `Dryingrack` component orchestrates the drying process for items held within an entity's container. It manages the timing of drying, pauses the process during rain or acid rain, and applies special perish rate modifiers during acid rain. It also handles the visual representation of drying items and ensures proper state persistence across game saves and loads.

## Dependencies & Tags
This component relies on or interacts with the following other components and aspects:

*   **`container` component**: The primary component this `Dryingrack` manages, storing the items to be dried.
*   **`preserver` component**: Added to the `container.inst` when drying is enabled to manage perish rates of contained items.
*   **`rainimmunity` component**: Checked on the `inst` and its potential `_rider` to determine if the drying rack is immune to rain effects. Can also be added to the `container.inst`.
*   **`rideable` component**: If present on the `inst`, this component listens for `riderchanged` events to update rain immunity status.
*   **`dryable` component**: Items placed in the container are expected to have this component, which defines their drying time, product, and build files.
*   **`perishable` component**: Checked on items within the container to apply acid rain perish rate modifiers.
*   **`moisture` component**: Checked on items within the container to factor into acid rain perish rate calculation.
*   **`inventoryitem` component**: Used to inherit moisture properties and apply acid sizzling visual effects to items.
*   **World State**: Listens for changes in `TheWorld.state.israining` and `TheWorld.state.isacidraining`.

**Tags:** None identified as explicitly added or removed by this component.

## Properties
| Property              | Type     | Default Value                            | Description                                                                                             |
| :-------------------- | :------- | :--------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| `inst`                | Entity   | (self)                                   | The entity this component is attached to.                                                               |
| `container`           | Component| `inst.components.container` or passed in | The `container` component instance that this drying rack manages.                                       |
| `enabled`             | boolean  | `false`                                  | Indicates if the drying functionality of the component is currently active.                             |
| `dryingpaused`        | boolean  | `true`                                   | Indicates if the drying process is currently paused (e.g., due to rain or external factors).            |
| `isinacid`            | boolean  | `false`                                  | Indicates if the container and its contents are currently exposed to acid rain.                         |
| `dryinginfo`          | table    | `{}`                                     | A table mapping drying items (Entity) to their drying state (remaining task, time, or final build).     |
| `showitemfn`          | function | `nil`                                    | An optional callback function to visually display an item in a specific slot on the rack.               |
| `hideitemfn`          | function | `nil`                                    | An optional callback function to visually hide an item from a specific slot on the rack.                |
| `_dryingperishratefn` | function | (internal)                               | An internal function used by the `preserver` component to determine custom perish rate multipliers.     |
| `_onrainimmunity`     | function | (closure)                                | Internal callback function bound to the `gainrainimmunity` event on the `inst` and potential `_rider`.|
| `_onrainvulnerable`   | function | (closure)                                | Internal callback function bound to the `loserainimmunity` event on the `inst` and potential `_rider`.|
| `_onriderchanged`     | function | (closure)                                | Internal callback function bound to the `riderchanged` event if the `inst` has a `rideable` component. |
| `_rider`              | Entity   | `nil`                                    | The entity currently riding the `inst`, if applicable.                                                  |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** Called when the component is removed from its entity. It disables drying, removes the `preserver` component from the container, and if the container is a separate entity, it drops its contents and removes the container entity itself.
*   **Parameters:** None.

### `GetContainer()`
*   **Description:** Returns the `container` component instance managed by this `Dryingrack`.
*   **Parameters:** None.

### `SetShowItemFn(fn)`
*   **Description:** Sets a callback function that will be executed when an item needs to be visually shown in a specific slot on the rack.
*   **Parameters:**
    *   `fn`: `function` - The function to call, typically `fn(dryingrack_inst, slot, prefab_name, build_name)`.

### `SetHideItemFn(fn)`
*   **Description:** Sets a callback function that will be executed when an item needs to be visually hidden from a specific slot on the rack.
*   **Parameters:**
    *   `fn`: `function` - The function to call, typically `fn(dryingrack_inst, slot, prefab_name)`.

### `GetItemInSlot(slot)`
*   **Description:** Retrieves an item from the specified slot in the container and provides additional information relevant to its drying status or visual representation.
*   **Parameters:**
    *   `slot`: `number` - The index of the slot to check.
*   **Returns:** `item` (Entity), `item.prefab` (string), `build` (string) - The item entity, its prefab name, and the build file to use for its visual.

### `EnableDrying()`
*   **Description:** Activates the drying functionality. This adds a `preserver` component to the container, starts listening for world state changes (rain, acid rain) and rain immunity events, and initializes the drying state based on current environmental conditions.
*   **Parameters:** None.

### `DisableDrying()`
*   **Description:** Deactivates the drying functionality. This removes the `preserver` component from the container, stops listening for all associated events, resets rain immunity and acid exposure, and pauses any ongoing drying processes.
*   **Parameters:** None.

### `OnGetItem(item, slot)`
*   **Description:** Handles the logic when an item is placed into the container. It checks if the item is dryable, initiates or resumes its drying process, and updates its visual representation. Also applies acid sizzling effects if the rack is in acid rain.
*   **Parameters:**
    *   `item`: `Entity` - The item that was placed into the container.
    *   `slot`: `number` - The slot where the item was placed.

### `OnLoseItem(item, slot)`
*   **Description:** Handles the logic when an item is removed from the container. It cancels any ongoing drying tasks for the item, records its remaining dry time if it's still valid, and removes acid sizzling effects if applicable. It also triggers the `hideitemfn` if set.
*   **Parameters:**
    *   `item`: `Entity` - The item that was removed from the container.
    *   `slot`: `number` - The slot from which the item was removed.

### `IsExposedToRain()`
*   **Description:** Determines if the drying rack is currently exposed to any form of rain (normal or acid rain) and does not have rain immunity.
*   **Parameters:** None.
*   **Returns:** `boolean` - True if exposed to rain and not immune, false otherwise.

### `HasRainImmunity()`
*   **Description:** Checks if the drying rack entity or its current rider possesses a `rainimmunity` component.
*   **Parameters:** None.
*   **Returns:** `boolean` - True if immune to rain, false otherwise.

### `SetContainerRainImmunity(isimmune)`
*   **Description:** Adds or removes a `rainimmunity` component source on the container entity if it's separate from the main entity, effectively making the container immune or vulnerable to rain.
*   **Parameters:**
    *   `isimmune`: `boolean` - True to grant rain immunity to the container, false to remove it.

### `SetContainerIsInAcid(isinacid)`
*   **Description:** Sets the acid rain status for the container and all its items. If the status changes, it updates the `isinacid` property and applies/removes acid sizzling effects on all contained items.
*   **Parameters:**
    *   `isinacid`: `boolean` - True if the container is in acid rain, false otherwise.

### `PauseDrying()`
*   **Description:** Halts all ongoing drying processes. It cancels any active drying tasks for items and stores their remaining dry time.
*   **Parameters:** None.

### `ResumeDrying()`
*   **Description:** Resumes all paused drying processes. It restarts drying tasks for items using their stored remaining dry times.
*   **Parameters:** None.

### `OnBurnt()`
*   **Description:** Called when the drying rack entity is burnt. It instantly dries and drops all items currently in the container.
*   **Parameters:** None.

### `LongUpdate(dt)`
*   **Description:** Provides an update mechanism for the drying process, primarily used for skipping large time durations in the game. It progresses drying tasks and resolves completed items.
*   **Parameters:**
    *   `dt`: `number` - The time delta (in seconds) to advance the drying process.

### `OnSave()`
*   **Description:** Serializes the drying information and container contents for persistence.
*   **Parameters:** None.
*   **Returns:** `table`, `table` - A table containing `info` (drying status for items) and optionally `contents` (for separate container entities), and a table of references.

### `OnLoad(data, newents)`
*   **Description:** Deserializes and restores the container contents and drying information from saved data during game loading, specifically for cases where the container is a separate entity.
*   **Parameters:**
    *   `data`: `table` - The table containing saved component data.
    *   `newents`: `table` - A table mapping old entity IDs to new entity instances.

### `LoadPostPass(newents, data)`
*   **Description:** Performs a second pass of loading for drying information, specifically for cases where the `container.inst` is the same as `self.inst`, ensuring container data is loaded first.
*   **Parameters:**
    *   `newents`: `table` - A table mapping old entity IDs to new entity instances.
    *   `data`: `table` - The table containing saved component data.

### `LoadInfo_Internal(data)`
*   **Description:** Internal helper function to process and apply loaded drying information to items in the container, resuming tasks or setting custom builds as needed.
*   **Parameters:**
    *   `data`: `table` - The table containing saved component data, specifically the `info` field.

### `GetDryingInfoSnapshot()`
*   **Description:** Creates a snapshot of the current drying state for all items in the container, including remaining dry times or custom builds.
*   **Parameters:** None.
*   **Returns:** `table` - A table mapping items to their drying info, or `nil` if no items are drying.

### `ApplyDryingInfoSnapshot(snapshot)`
*   **Description:** Applies a previously generated snapshot of drying information to the current items in the container, resuming tasks or setting custom builds as specified.
*   **Parameters:**
    *   `snapshot`: `table` - The drying info snapshot to apply.

## Events & Listeners
This component listens for the following events:

*   **`itemget`** (from `self.container.inst`): Triggered when an item is added to the managed container. Handled by `OnGetItem`.
*   **`itemlose`** (from `self.container.inst`): Triggered when an item is removed from the managed container. Handled by `OnLoseItem`.
*   **`israining`** (WorldState): Listens for changes in `TheWorld.state.israining` to pause or resume drying.
*   **`isacidraining`** (WorldState): Listens for changes in `TheWorld.state.isacidraining` to pause or resume drying and apply acid effects.
*   **`gainrainimmunity`** (from `self.inst` and potentially `_rider`): Triggered when the entity or its rider gains rain immunity, leading to a potential drying resume.
*   **`loserainimmunity`** (from `self.inst` and potentially `_rider`): Triggered when the entity or its rider loses rain immunity, potentially pausing drying if exposed to rain.
*   **`riderchanged`** (from `self.inst` if `rideable` exists): Triggered when the entity's rider changes, updating rain immunity listeners.
*   **`stacksizechange`** (from `item`): Listened to temporarily when an item is removed from the rack to clear stored dry time if the item is stacked.
*   **`ondropped`** (from `item`): Listened to temporarily when an item is removed from the rack to clear stored dry time if the item is dropped.