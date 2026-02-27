---
id: crop
title: Crop
description: This component manages the growth cycle, maturation, withering, and harvesting functionality for crop entities.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 9f984bba
---

# Crop

## Overview
The Crop component is responsible for governing the entire lifecycle of a crop entity, from initial planting and growth to maturation, potential withering, and eventual harvesting. It tracks growth progress, applies environmental modifiers, manages visual state changes, and facilitates interactions with fertilizers and harvesters.

## Dependencies & Tags
This component interacts with various other components and checks for specific tags on its host entity or other entities:

*   **Accessed Components:** `burnable`, `fertilizer`, `rainimmunity`, `witherable`, `halloweenmoonmutable`, `cookable`, `inventoryitem`, `inventory`, `grower`, `Light` (on light sources).
*   **Added/Modified Components (via global functions):** `burnable` (via `MakeMediumBurnable`), `propagator` (via `MakeSmallPropagator`).
*   **Tags Added:**
    *   `readyforharvest`: Added when the crop has fully matured.
    *   `notreadyforharvest`: Added when the crop has not yet matured.
*   **Tags Checked:**
    *   `withered`: Checked to determine if the crop has withered, affecting growth and harvesting.
    *   `daylight`, `lightsource`: Used for determining if the crop can grow during night.

## Properties
| Property         | Type           | Default Value | Description                                                                                             |
| :--------------- | :------------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `inst`           | `Entity`       | `nil`         | Reference to the entity this component is attached to.                                                  |
| `product_prefab` | `string`       | `nil`         | The prefab name of the item that will be produced when the crop is harvested.                           |
| `growthpercent`  | `number`       | `0`           | The current growth progress of the crop, as a percentage from 0 (start) to 1 (matured).                 |
| `rate`           | `number`       | `1/120`       | The base rate at which the crop grows per game update.                                                  |
| `task`           | `task handle`  | `nil`         | A handle to the periodic task responsible for updating the crop's growth.                               |
| `matured`        | `boolean`      | `false`       | Indicates whether the crop has reached full maturity.                                                   |
| `onmatured`      | `function`     | `nil`         | A callback function executed when the crop matures, receiving the `inst` as an argument.                |
| `onwithered`     | `function`     | `nil`         | A callback function executed when the crop withers, receiving the `inst` as an argument.                |
| `onharvest`      | `function`     | `nil`         | A callback function executed when the crop is harvested, receiving `inst`, `product`, and `harvester`.|
| `cantgrowtime`   | `number`       | `0`           | Accumulates time spent in conditions where the crop cannot grow (e.g., darkness), used for dark withering. |
| `grower`         | `Entity`       | `nil`         | Reference to the entity that planted or is responsible for this crop (e.g., a farm plot).               |

## Main Functions
### `Crop:OnRemoveFromEntity()`
*   **Description:** Called when the component is removed from its parent entity. It ensures that `readyforharvest` and `notreadyforharvest` tags are cleared from the entity.
*   **Parameters:** None.

### `Crop:SetOnMatureFn(fn)`
*   **Description:** Sets a custom callback function to be invoked when the crop matures.
*   **Parameters:**
    *   `fn`: (`function`) The function to call. It will receive the crop entity (`self.inst`) as its first argument.

### `Crop:SetOnWitheredFn(fn)`
*   **Description:** Sets a custom callback function to be invoked when the crop withers.
*   **Parameters:**
    *   `fn`: (`function`) The function to call. It will receive the crop entity (`self.inst`) as its first argument.

### `Crop:SetOnHarvestFn(fn)`
*   **Description:** Sets a custom callback function to be invoked when the crop is harvested.
*   **Parameters:**
    *   `fn`: (`function`) The function to call. It will receive the crop entity (`self.inst`), the harvested `product`, and the `harvester` entity as arguments.

### `Crop:OnSave()`
*   **Description:** Prepares the component's data for saving to the game world.
*   **Parameters:** None.
*   **Returns:** (`table`) A table containing `product_prefab`, `growthpercent`, `rate`, and `matured` for serialization.

### `Crop:OnLoad(data)`
*   **Description:** Loads the component's state from saved game data. It updates properties like `product_prefab`, `growthpercent`, `rate`, and `matured`. If the crop is not withered, it then calls `DoGrow` to refresh the visual state.
*   **Parameters:**
    *   `data`: (`table`) The table containing saved data for the component.

### `Crop:LoadPostPass()`
*   **Description:** Called after all entities have loaded. If no `grower` is assigned, it resumes the growth task.
*   **Parameters:** None. (Commented out parameters `newents`, `data` suggest it might have been intended for more complex usage.)

### `Crop:Fertilize(fertilizer, doer)`
*   **Description:** Applies fertilizer to the crop, increasing its growth percentage. It also handles sound effects and visual updates. Growth is prevented if the world temperature is below freezing in winter.
*   **Parameters:**
    *   `fertilizer`: (`Entity`) The fertilizer item being used.
    *   `doer`: (`Entity`, optional) The entity performing the fertilization (e.g., the player).
*   **Returns:** (`boolean`) `true` if fertilization was successful (i.e., not frozen), `false` otherwise.

### `Crop:GetWorldGrowthRateMultiplier()`
*   **Description:** Calculates and returns a multiplier for the crop's growth rate based on various world conditions, such as temperature, rain, and season (spring).
*   **Parameters:** None.
*   **Returns:** (`number`) A multiplier for the growth rate.

### `Crop:DoGrow(dt, nowither)`
*   **Description:** Advances the crop's growth over a given time delta `dt`. It considers world conditions (day/night, light sources) and handles potential withering if conditions are unfavorable for too long. If growth reaches 100%, it calls `Mature()`.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed since the last growth update.
    *   `nowither`: (`boolean`, optional) If `true`, the crop will not wither due to darkness, regardless of `cantgrowtime`.
*   **Returns:** (`boolean`) `true` if the crop processed growth or was already withered, `false` if it withered during this call.

### `Crop:GetDebugString()`
*   **Description:** Returns a string useful for debugging the crop's current state, showing growth percentage, product prefab, and wither time.
*   **Parameters:** None.
*   **Returns:** (`string`) A formatted debug string.

### `Crop:Resume()`
*   **Description:** Restarts the periodic growth task for the crop if it has not already matured or withered.
*   **Parameters:** None.

### `Crop:StartGrowing(prod, grow_time, grower, percent)`
*   **Description:** Initializes the crop's growth process. It sets the product prefab, calculates the growth rate based on `grow_time`, sets initial growth percentage, and assigns the `grower` entity. It then starts a periodic task for growth.
*   **Parameters:**
    *   `prod`: (`string`) The prefab name of the product this crop will yield.
    *   `grow_time`: (`number`) The total time (in seconds) the crop needs to fully grow.
    *   `grower`: (`Entity`) The entity responsible for this crop's growth (e.g., a farm plot).
    *   `percent`: (`number`, optional) The initial growth percentage, clamped between 0 and 1. Defaults to 0.

### `Crop:Harvest(harvester)`
*   **Description:** Handles the harvesting of a matured or withered crop. It determines the product to spawn (potentially cooked seeds if burned), gives the item to the harvester (or drops it), and then resets the crop's state or removes the entity.
*   **Parameters:**
    *   `harvester`: (`Entity`, optional) The entity performing the harvest.
*   **Returns:** (`boolean`, `Entity`) `true` and the spawned product if harvested, `nil` otherwise.

### `Crop:Mature()`
*   **Description:** Marks the crop as matured if it's not already matured or withered and a `product_prefab` is set. It also triggers the `onmatured` callback.
*   **Parameters:** None.

### `Crop:MakeWithered()`
*   **Description:** Forces the crop into a withered state. It cancels the growth task, resets growth properties, sets the product to "cutgrass", updates the animation, and adds `burnable` and `propagator` components if they don't exist. It also triggers the `onwithered` callback.
*   **Parameters:** None.

### `Crop:IsReadyForHarvest()`
*   **Description:** Checks if the crop has fully matured and is ready to be harvested.
*   **Parameters:** None.
*   **Returns:** (`boolean`) `true` if matured, `false` otherwise.

### `Crop:LongUpdate(dt)`
*   **Description:** Called for long update intervals, typically to progress growth over larger time steps. This simply calls `DoGrow(dt)`.
*   **Parameters:**
    *   `dt`: (`number`) The time delta for the update.