---
id: dryer
title: Dryer
description: This component manages the process of drying items on an entity, handling timing, state transitions, and environmental interactions like rain.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Dryer

## Overview
The `Dryer` component enables an entity (like a Drying Rack) to process and dry specific items over time. It manages the item's drying progress, handles spoilage, and reacts to environmental conditions such as rain, pausing the drying process if the entity is exposed. It tracks the ingredient, the eventual product, and allows for custom callbacks at different stages of the drying process.

## Dependencies & Tags
**Dependencies:**
*   The entity itself may optionally have a `rainimmunity` component to determine if it's affected by rain.
*   Items placed on the dryer must have a `dryable` component.
*   Items placed on the dryer may optionally have `perishable` and `edible` components, which the `Dryer` component interacts with for spoilage and food type tracking.
*   Relies on `TheWorld.state.israining` for environmental rain checks.
*   Utilizes global `SpawnPrefab` and `LaunchAt` functions.

**Tags:**
*   Adds: `"dried"`, `"drying"`, `"candry"`
*   Removes: `"dried"`, `"drying"`, `"candry"`

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | - | A reference to the entity this component is attached to. |
| `ingredient` | `string` / `nil` | `nil` | The prefab name of the item currently being dried. |
| `product` | `string` / `nil` | `nil` | The prefab name of the item after it has been dried. |
| `buildfile` | `string` / `nil` | `nil` | The build file associated with the ingredient's visual representation. |
| `dried_buildfile` | `string` / `nil` | `nil` | The build file associated with the dried product's visual representation. |
| `foodtype` | `FOODTYPE` / `nil` | `nil` | The `FOODTYPE` of the product, typically inherited from the ingredient. |
| `remainingtime` | `number` / `nil` | `nil` | The remaining duration for the current drying or spoilage task. |
| `tasktotime` | `number` / `nil` | `nil` | The absolute game time when the current drying or spoilage task is expected to complete. |
| `task` | `TimedTask` / `nil` | `nil` | The `TimedTask` object currently managing the drying or spoilage timer. |
| `onstartdrying` | `function` / `nil` | `nil` | A callback function invoked when an item begins the drying process. |
| `ondonedrying` | `function` / `nil` | `nil` | A callback function invoked when an item finishes drying. |
| `onharvest` | `function` / `nil` | `nil` | A callback function invoked when an item is harvested or removed from the dryer. |
| `protectedfromrain` | `boolean` / `nil` | `nil` | A flag indicating if the dryer is internally considered protected from rain, overriding `IsExposedToRain`. |
| `watchingrain` | `boolean` / `nil` | `nil` | Internal flag indicating whether the component is currently listening for `israining` world state changes. |
| `ingredientperish` | `number` / `nil` | `nil` | The percentage of perishability remaining on the ingredient when it was placed. |

## Main Functions
### `ondried(self)`
*   **Description:** This local function is bound to the `ingredient` and `product` properties. It's automatically called when either `ingredient` or `product` is set, updating the entity's tags (`"dried"`, `"drying"`, `"candry"`) to reflect its current state.
*   **Parameters:**
    *   `self`: A reference to the `Dryer` component instance.

### `OnRemoveFromEntity()`
*   **Description:** Performs cleanup operations when the `Dryer` component is removed from its entity. This includes cancelling any active drying tasks and removing all drying-related tags from the entity.
*   **Parameters:** None.

### `SetStartDryingFn(fn)`
*   **Description:** Sets a custom callback function to be executed when an item starts drying.
*   **Parameters:**
    *   `fn`: The function to call, which will receive `(inst, ingredient_prefab_name, buildfile_name)` as arguments.

### `SetDoneDryingFn(fn)`
*   **Description:** Sets a custom callback function to be executed when an item finishes drying.
*   **Parameters:**
    *   `fn`: The function to call, which will receive `(inst, product_prefab_name, dried_buildfile_name)` as arguments.

### `SetOnHarvestFn(fn)`
*   **Description:** Sets a custom callback function to be executed when an item is harvested or otherwise removed from the dryer.
*   **Parameters:**
    *   `fn`: The function to call, which will receive `(inst)` as an argument.

### `CanDry(dryable)`
*   **Description:** Checks if the dryer is currently empty and if the provided `dryable` entity is a valid item to be dried (i.e., has a `dryable` component).
*   **Parameters:**
    *   `dryable`: The entity to check for suitability for drying.
*   **Returns:** `true` if the item can be dried, `false` otherwise.

### `IsDrying()`
*   **Description:** Indicates whether an item is currently in the process of drying on the entity.
*   **Parameters:** None.
*   **Returns:** `true` if an `ingredient` is present (drying), `false` otherwise.

### `IsDone()`
*   **Description:** Indicates whether an item has completed the drying process and is ready for harvest.
*   **Parameters:** None.
*   **Returns:** `true` if a `product` is present and no `ingredient` is pending, `false` otherwise.

### `GetTimeToDry()`
*   **Description:** Returns the remaining time until the current drying process is complete. If not drying, returns 0.
*   **Parameters:** None.
*   **Returns:** The remaining drying time in seconds.

### `GetTimeToSpoil()`
*   **Description:** Returns the remaining time until the dried item spoils. If not dried, returns 0.
*   **Parameters:** None.
*   **Returns:** The remaining spoilage time in seconds.

### `IsPaused()`
*   **Description:** Checks if the current drying or spoilage timer is paused.
*   **Parameters:** None.
*   **Returns:** `true` if `remainingtime` has a value (indicating a paused state), `false` otherwise.

### `StartDrying(dryable)`
*   **Description:** Initiates the drying process for the specified `dryable` item. It consumes the `dryable` item, sets up the drying timer, and starts watching for rain if not protected.
*   **Parameters:**
    *   `dryable`: The entity with a `dryable` component to be processed.
*   **Returns:** `true` if drying successfully started, `false` otherwise.

### `StopDrying(reason)`
*   **Description:** Halts the current drying or spoilage process. Depending on the `reason` and current state, it might spawn the product, or spoil the item.
*   **Parameters:**
    *   `reason`: A string indicating why the drying process is stopping (e.g., `"fire"`).

### `Pause()`
*   **Description:** Pauses the current drying or spoilage timer, storing the remaining time and canceling the active task.
*   **Parameters:** None.

### `Resume()`
*   **Description:** Resumes a paused drying or spoilage timer, creating a new `TimedTask` with the stored `remainingtime`.
*   **Parameters:** None.

### `DropItem()`
*   **Description:** Removes the item from the dryer and spawns it in the world at the dryer's position. It attempts to preserve perishability relative to its current state.
*   **Parameters:** None.
*   **Returns:** `true` if an item was dropped, `false` otherwise.

### `Harvest(harvester)`
*   **Description:** Transfers the completed dried item to the inventory of the specified `harvester`.
*   **Parameters:**
    *   `harvester`: The entity attempting to harvest the item, expected to have an `inventory` component.
*   **Returns:** `true` if the item was successfully harvested, `false` otherwise.

### `LongUpdate(dt)`
*   **Description:** Handles periodic updates for the drying/spoilage process, primarily used for offline progress or when a long update is explicitly triggered. It accounts for elapsed time `dt` and manages pausing/resuming based on rain exposure.
*   **Parameters:**
    *   `dt`: The delta time (time elapsed since the last update) in seconds.

### `OnSave()`
*   **Description:** Serializes the component's current state (ingredient, product, remaining time, etc.) for saving game progress.
*   **Parameters:** None.
*   **Returns:** A table containing the relevant state data if a product is present, otherwise `nil`.

### `OnLoad(data)`
*   **Description:** Deserializes and restores the component's state from saved game data. It re-establishes the drying/spoilage process based on the loaded information.
*   **Parameters:**
    *   `data`: The table containing the saved component state.

### `GetDebugString()`
*   **Description:** Provides a human-readable string representing the dryer's current status, including whether it's drying, dried, or empty, its product, food type, and remaining times.
*   **Parameters:** None.
*   **Returns:** A formatted debug string.

## Events & Listeners
*   `inst:ListenForEvent("gainrainimmunity", OnRainImmunity)`: Listens for the entity gaining immunity to rain, which causes the dryer to resume if paused.
*   `inst:ListenForEvent("loserainimmunity", OnRainVulnerable)`: Listens for the entity losing rain immunity, which may cause the dryer to pause if exposed to rain.
*   `self:WatchWorldState("israining", OnIsRaining)`: Listens for changes in `TheWorld.state.israining`, pausing or resuming the dryer based on rain exposure.