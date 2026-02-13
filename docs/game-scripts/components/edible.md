---
id: edible
title: Edible
description: This component defines the properties of an item that can be eaten, including its nutritional values, spoilage interactions, and post-consumption effects.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Edible

## Overview
The `Edible` component is responsible for managing all properties related to an item's edibility within the game. It defines how an item affects a character's hunger, health, and sanity when consumed, and interacts with the `Perishable` component to apply spoilage penalties. It also handles food types, temperature effects, and custom callbacks for eating behavior.

## Dependencies & Tags
This component interacts with or relies on the following other components and applies specific tags to its `inst` (the entity it's attached to):

*   **Other Components:**
    *   `Perishable`: Accessed to determine an item's freshness status (stale, spoiled).
    *   `Eater` (on the consuming entity): Accessed to check for spoilage immunity or custom spoilage multipliers.
    *   `FoodAffinity` (on the consuming entity): Accessed to apply affinity bonuses to hunger.
    *   `Stackable`: Accessed for stack size when handling removal or calculating stack multipliers.
    *   `Temperature` (on the consuming entity): Accessed to apply temperature effects after consumption.
    *   `SoundEmitter` (on the consuming entity): Accessed to play eat sounds.
*   **Tags Added/Removed by Edible:**
    *   `badfood`: Added if `healthvalue` is negative or `sanityvalue` is negative. Removed otherwise. (Managed when `healthvalue` or `sanityvalue` properties are set).
    *   `edible_<FOODTYPE>`: Added based on `foodtype` and `secondaryfoodtype` properties. Removed when the property changes or the component is removed. Example: `edible_MEAT`, `edible_VEGGIE`.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | - | A reference to the entity this component is attached to. |
| `healthvalue` | `number` | `10` | The amount of health restored or lost when the item is eaten. Setting this property triggers a check for the "badfood" tag. |
| `hungervalue` | `number` | `10` | The amount of hunger restored when the item is eaten. |
| `sanityvalue` | `number` | `0` | The amount of sanity restored or lost when the item is eaten. Setting this property triggers a check for the "badfood" tag. |
| `foodtype` | `string` | `FOODTYPE.GENERIC` | The primary category of food this item belongs to (e.g., `FOODTYPE.MEAT`, `FOODTYPE.VEGGIE`). Setting this property adds an `edible_<foodtype>` tag and removes any old `edible_<old_foodtype>` tag. Asserted not to be the same as `secondaryfoodtype`. |
| `secondaryfoodtype` | `string` or `nil` | `nil` | A secondary category of food this item belongs to, if any. Setting this property adds an `edible_<secondaryfoodtype>` tag and removes any old `edible_<old_secondaryfoodtype>` tag. Asserted not to be the same as `foodtype`. |
| `oneaten` | `function` or `nil` | `nil` | A custom callback function to be executed when the item is eaten. Takes `(inst, eater)` as arguments. |
| `degrades_with_spoilage` | `boolean` | `true` | If `true`, the item's nutritional values will be reduced by spoilage (stale/spoiled). |
| `gethealthfn` | `function` or `nil` | `nil` | A custom function to override the default health calculation. Takes `(inst, eater)` as arguments. |
| `getsanityfn` | `function` or `nil` | `nil` | A custom function to override the default sanity calculation. Takes `(inst, eater)` as arguments. |
| `temperaturedelta` | `number` | `0` | The change in temperature (e.g., body temperature) applied to the eater. |
| `temperatureduration` | `number` | `0` | The duration for which the `temperaturedelta` effect lasts. |
| `chill` | `number` | `0` | A percentage `[0, 1]` indicating the degree of "chill" applied to the food, reducing its temperature effects. Only applicable if `temperaturedelta > 0`. |
| `stale_hunger` | `number` | `TUNING.STALE_FOOD_HUNGER` | Multiplier for hunger value when the food is stale. |
| `stale_health` | `number` | `TUNING.STALE_FOOD_HEALTH` | Multiplier for health value when the food is stale. |
| `spoiled_hunger` | `number` | `TUNING.SPOILED_FOOD_HUNGER` | Multiplier for hunger value when the food is spoiled. |
| `spoiled_health` | `number` | `TUNING.SPOILED_FOOD_HEALTH` | Multiplier for health value when the food is spoiled. |
| `spice` | `string` or `nil` | `nil` | The type of spice applied to the food, allowing `TUNING.SPICE_MULTIPLIERS` to modify effects. |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** Called when the `Edible` component is removed from its entity. It ensures that all associated tags (`badfood`, `edible_<foodtype>`, `edible_<secondaryfoodtype>`, and `edible_BERRY` for some reason) are cleaned up.
*   **Parameters:** None.

### `GetSanity(eater)`
*   **Description:** Calculates the sanity value provided by the food, considering spoilage, custom `getsanityfn`, `eater` properties, and `spice` multipliers. If the food is stale, positive sanity is zeroed; if spoiled, a fixed negative sanity is applied.
*   **Parameters:**
    *   `eater`: The `Entity` attempting to eat the food. May be `nil`.

### `GetHunger(eater)`
*   **Description:** Calculates the hunger value provided by the food, considering spoilage, `eater` properties (like `ignoresspoilage`, `stale_hunger`, `spoiled_hunger`), and `foodaffinity`.
*   **Parameters:**
    *   `eater`: The `Entity` attempting to eat the food. May be `nil`.

### `GetHealth(eater)`
*   **Description:** Calculates the health value provided by the food, considering spoilage, custom `gethealthfn`, `eater` properties, and `spice` multipliers.
*   **Parameters:**
    *   `eater`: The `Entity` attempting to eat the food. May be `nil`.

### `GetDebugString()`
*   **Description:** Returns a formatted string containing the food's type, health, hunger, and sanity values for debugging purposes.
*   **Parameters:** None.

### `SetOnEatenFn(fn)`
*   **Description:** Sets a custom callback function to be executed when the item is eaten. This function will receive `(inst, eater)` as arguments.
*   **Parameters:**
    *   `fn`: A `function` to set as the `oneaten` callback.

### `SetHandleRemoveFn(fn)`
*   **Description:** Sets a custom callback function to handle the item's removal from the world after being eaten. This function will receive `(inst, eatwholestack)` as arguments.
*   **Parameters:**
    *   `fn`: A `function` to set as the `handleremovefn` callback.

### `SetOverrideStackMultiplierFn(fn)`
*   **Description:** Sets a custom function to determine the stack multiplier for the food. This function should return a number representing the effective stack size (e.g., for calculating total hunger from a stack).
*   **Parameters:**
    *   `fn`: A `function` to set as the `overridestackmultiplierfn` callback.

### `SetGetHealthFn(fn)`
*   **Description:** Sets a custom function to dynamically calculate the health provided by the food. This function will receive `(inst, eater)` as arguments.
*   **Parameters:**
    *   `fn`: A `function` to set as the `gethealthfn` callback.

### `SetGetSanityFn(fn)`
*   **Description:** Sets a custom function to dynamically calculate the sanity provided by the food. This function will receive `(inst, eater)` as arguments.
*   **Parameters:**
    *   `fn`: A `function` to set as the `getsanityfn` callback.

### `OnEaten(eater)`
*   **Description:** The primary method called when the food is consumed. It executes the `oneaten` callback, applies temperature effects to the `eater` (if `temperaturedelta` and `temperatureduration` are set), plays an eat sound, and pushes an "oneaten" event.
*   **Parameters:**
    *   `eater`: The `Entity` that consumed the food.

### `HandleEatRemove(eatwholestack)`
*   **Description:** Handles the removal of the edible item after being eaten. It prioritizes the `handleremovefn` if set. Otherwise, if `eatwholestack` is `false` and the item is stackable, it removes one from the stack. If `eatwholestack` is `true` or the item is not stackable, it removes the entire item. This is an internal function primarily called by `eater.lua`.
*   **Parameters:**
    *   `eatwholestack`: `boolean`, `true` if the entire stack was consumed, `false` otherwise.

### `GetStackMultiplier()`
*   **Description:** Returns a multiplier representing the effective "size" of the food for nutritional calculations. It prioritizes `overridestackmultiplierfn` if set, otherwise uses the `stackable` component's `StackSize()`, defaulting to `1`.
*   **Parameters:** None.

### `AddChill(delta)`
*   **Description:** Increases the `chill` property of the food, diluting its temperature effects. Only applies if `temperaturedelta` is positive and `nochill` (an unexposed internal property) is `false`.
*   **Parameters:**
    *   `delta`: `number`, the amount to add to `chill`, typically scaled by `temperatureduration`.

### `DiluteChill(item, count)`
*   **Description:** Averages the `chill` value with another edible item when items are combined (e.g., stacking).
*   **Parameters:**
    *   `item`: The other `Entity` with an `Edible` component to dilute `chill` with.
    *   `count`: `number`, the stack count of the other item.

### `OnSave()`
*   **Description:** Returns save data for the `chill` property if it's greater than `0`.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Loads the `chill` property from saved `data`.
*   **Parameters:**
    *   `data`: `table`, the saved data containing the `chill` value.

## Events & Listeners
*   **Pushes Event:**
    *   `oneaten`: Triggered on the `inst` (the edible item) when it is consumed. The event data is `{ eater = eater }`, where `eater` is the entity that ate the food.