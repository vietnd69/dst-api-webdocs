---
id: edible
title: Edible
description: Manages food properties including health, hunger, and sanity values with spoilage degradation and temperature effects.
tags: [food, consumption, stats]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: dce2bbcd
system_scope: entity
---

# Edible

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Edible` defines the nutritional and status effects of food items when consumed by entities with an `eater` component. It calculates health, hunger, and sanity values with modifiers for spoilage state (stale/spoiled), spice additives, and food affinity bonuses. The component also supports temperature effects (heating/cooling) and chill percentage for cold foods. Property changes to `healthvalue`, `sanityvalue`, `foodtype`, or `secondaryfoodtype` automatically trigger watcher callbacks that update entity tags.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("edible")
inst.components.edible.healthvalue = 20
inst.components.edible.hungervalue = 15
inst.components.edible.foodtype = FOODTYPE.MEAT
inst.components.edible:SetOnEatenFn(function(food, eater)
    print("Food was eaten by", eater.prefab)
end)
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- provides default values for stale/spoiled food multipliers and spice effects

**Components used:**
- `perishable` -- checked for `IsStale()` and `IsSpoiled()` to apply degradation multipliers
- `eater` -- accessed on the consuming entity for `ignoresspoilage`, `stale_hunger`, `spoiled_health`, etc.
- `foodaffinity` -- accessed on the consuming entity via `GetAffinity()` for hunger multiplier bonus
- `stackable` -- used for stack operations in `HandleEatRemove()` and `GetStackMultiplier()`
- `temperature` -- accessed on the consuming entity via `SetTemperatureInBelly()` for temperature effects

**Tags:**
- `badfood` -- added when `healthvalue` or `sanityvalue` is negative; removed on cleanup
- `edible_<foodtype>` -- added based on `foodtype` and `secondaryfoodtype` (e.g., `edible_generic`, `edible_meat`)
- `spoiledfood` -- added/removed by `SetForceSpoiledFood()`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healthvalue` | number | `10` | Base health restoration. Assignment triggers `oncheckbadfood` watcher. |
| `hungervalue` | number | `10` | Base hunger restoration. |
| `sanityvalue` | number | `0` | Base sanity restoration. Assignment triggers `oncheckbadfood` watcher. |
| `foodtype` | string | `FOODTYPE.GENERIC` | Primary food type for affinity matching. Assignment triggers `onfoodtype` watcher. |
| `secondaryfoodtype` | string | `nil` | Secondary food type for affinity matching. Assignment triggers `onfoodtype` watcher. |
| `oneaten` | function | `nil` | Callback fired when food is eaten. Signature: `fn(inst, eater)`. Set via `SetOnEatenFn()`. |
| `degrades_with_spoilage` | boolean | `true` | If `false`, spoilage state does not reduce food values. |
| `gethealthfn` | function | `nil` | Override function for health calculation. Signature: `fn(inst, eater) → number`. |
| `getsanityfn` | function | `nil` | Override function for sanity calculation. Signature: `fn(inst, eater) → number`. |
| `temperaturedelta` | number | `0` | Temperature change applied to eater (positive = heat, negative = cool). |
| `temperatureduration` | number | `0` | Duration of temperature effect in seconds. |
| `chill` | number | `0` | Percentage `[0, 1]` of `temperatureduration` for chill effect. Only applies if `temperaturedelta > 0`. |
| `stale_hunger` | number | `TUNING.STALE_FOOD_HUNGER` | Multiplier applied to hunger when food is stale. |
| `stale_health` | number | `TUNING.STALE_FOOD_HEALTH` | Multiplier applied to health when food is stale. |
| `spoiled_hunger` | number | `TUNING.SPOILED_FOOD_HUNGER` | Multiplier applied to hunger when food is spoiled. |
| `spoiled_health` | number | `TUNING.SPOILED_FOOD_HEALTH` | Multiplier applied to health when food is spoiled. |
| `spice` | string | `nil` | Spice type identifier. Applies multipliers from `TUNING.SPICE_MULTIPLIERS`. |
| `overridestackmultiplierfn` | function | `nil` | Override for `GetStackMultiplier()`. Signature: `fn(inst) → number`. |
| `handleremovefn` | function | `nil` | Override for `HandleEatRemove()`. Signature: `fn(inst, eatwholestack)`. |
| `spoiledfood` | boolean | `false` | Internal flag set by `SetForceSpoiledFood()`. |

## Main functions
### `oncheckbadfood(self)` (local)
*   **Description:** Property watcher callback for `healthvalue` and `sanityvalue`. Adds or removes the `badfood` tag based on whether either value is negative.
*   **Parameters:** `self` -- the Edible component instance.
*   **Returns:** None
*   **Error states:** None

### `onfoodtype(self, new_foodtype, old_foodtype)` (local)
*   **Description:** Property watcher callback for `foodtype` and `secondaryfoodtype`. Removes the old `edible_<old_foodtype>` tag and adds the new `edible_<new_foodtype>` tag. Asserts that main and secondary food types are not identical.
*   **Parameters:**
    - `self` -- the Edible component instance
    - `new_foodtype` -- the new food type string
    - `old_foodtype` -- the previous food type string (may be `nil`)
*   **Returns:** None
*   **Error states:** Asserts if `self.foodtype == self.secondaryfoodtype` — main and secondary types cannot match.

### `OnRemoveFromEntity()`
*   **Description:** Cleanup handler called when component is removed. Removes `badfood`, `edible_<foodtype>`, `edible_<secondaryfoodtype>`, and `edible_berry` tags from the entity.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

### `GetWoodiness(eater)`
*   **Description:** Deprecated function. Always returns `0`.
*   **Parameters:** `eater` -- entity instance (unused)
*   **Returns:** `0`
*   **Error states:** None

### `GetSanity(eater)`
*   **Description:** Calculates the sanity value this food provides. Applies spoilage degradation (stale returns `0`, spoiled returns `-TUNING.SANITY_SMALL`), spice multipliers, and respects `ignoresspoilage` flag. If `getsanityfn` is set, uses that instead of `sanityvalue`.
*   **Parameters:** `eater` -- entity consuming the food (may be `nil`)
*   **Returns:** Number sanity value (may be negative for spoiled food)
*   **Error states:** None

### `GetHunger(eater)`
*   **Description:** Calculates the hunger value this food provides. Applies spoilage multipliers (`stale_hunger`, `spoiled_hunger`), food affinity bonus from `eater.components.foodaffinity:GetAffinity()`, and respects `ignoresspoilage` flag.
*   **Parameters:** `eater` -- entity consuming the food (may be `nil`)
*   **Returns:** Number hunger value after all multipliers
*   **Error states:** None

### `GetHealth(eater)`
*   **Description:** Calculates the health value this food provides. Applies spoilage multipliers (`stale_health`, `spoiled_health`), spice health multipliers, and respects `ignoresspoilage` flag. Spoiled food disables spice effects. If `gethealthfn` is set, uses that instead of `healthvalue`.
*   **Parameters:** `eater` -- entity consuming the food (may be `nil`)
*   **Returns:** Number health value after all multipliers
*   **Error states:** None

### `GetDebugString()`
*   **Description:** Returns a formatted debug string showing food type and base stat values.
*   **Parameters:** None
*   **Returns:** String in format `"Food type: <type>, health: <h>, hunger: <hu>, sanity: <s>"`
*   **Error states:** None

### `SetOnEatenFn(fn)`
*   **Description:** Sets the callback function to fire when this food is eaten.
*   **Parameters:** `fn` -- function with signature `fn(inst, eater)`
*   **Returns:** None
*   **Error states:** None

### `SetHandleRemoveFn(fn)`
*   **Description:** Sets the callback function to handle food removal after eating.
*   **Parameters:** `fn` -- function with signature `fn(inst, eatwholestack)`
*   **Returns:** None
*   **Error states:** None

### `SetOverrideStackMultiplierFn(fn)`
*   **Description:** Sets the override function for calculating stack multiplier.
*   **Parameters:** `fn` -- function with signature `fn(inst) → number`
*   **Returns:** None
*   **Error states:** None

### `SetForceSpoiledFood(spoiled)`
*   **Description:** Forces the food into a spoiled state regardless of actual perishable state. Adds or removes the `spoiledfood` tag and sets internal `spoiledfood` flag.
*   **Parameters:** `spoiled` -- boolean to force spoiled state
*   **Returns:** None
*   **Error states:** None

### `IsSpoiledFood()`
*   **Description:** Returns whether the food has been forced into spoiled state via `SetForceSpoiledFood()`.
*   **Parameters:** None
*   **Returns:** Boolean `true` if forced spoiled, `false` otherwise
*   **Error states:** None

### `SetGetHealthFn(fn)`
*   **Description:** Sets the override function for health calculation.
*   **Parameters:** `fn` -- function with signature `fn(inst, eater) → number`
*   **Returns:** None
*   **Error states:** None

### `SetGetSanityFn(fn)`
*   **Description:** Sets the override function for sanity calculation.
*   **Parameters:** `fn` -- function with signature `fn(inst, eater) → number`
*   **Returns:** None
*   **Error states:** None

### `OnEaten(eater)`
*   **Description:** Called when the food is consumed. Fires the `oneaten` callback, applies temperature effects to the eater's belly temperature (if `temperaturedelta` and `temperatureduration` are set), plays eat sound, and pushes the `oneaten` event.
*   **Parameters:** `eater` -- entity consuming the food
*   **Returns:** None
*   **Error states:** None

### `HandleEatRemove(eatwholestack)`
*   **Description:** Removes the food item after eating. Calls `handleremovefn` if set, otherwise removes one item from stack if `eatwholestack` is `false` and `stackable` exists, or removes the entire entity.
*   **Parameters:** `eatwholestack` -- boolean whether to remove entire stack
*   **Returns:** None
*   **Error states:** None

### `GetStackMultiplier()`
*   **Description:** Returns the multiplier for stacking effects. Uses `overridestackmultiplierfn` if set, otherwise returns stack size from `stackable` component, or `1` as fallback.
*   **Parameters:** None
*   **Returns:** Number multiplier (typically stack size)
*   **Error states:** None

### `AddChill(delta)`
*   **Description:** Increases the chill percentage by `delta`. Only applies if `temperaturedelta > 0` and `nochill` is not set. Clamps result to `[0, 1]`.
*   **Parameters:** `delta` -- number to add to chill percentage
*   **Returns:** None
*   **Error states:** None

### `DiluteChill(item, count)`
*   **Description:** Averages chill percentage when stacking with another edible item. Formula: `(stacksize * self.chill + count * item.chill) / (stacksize + count)`. Only applies if `temperaturedelta > 0`, `nochill` is not set, and both items have required components.
*   **Parameters:**
    - `item` -- the other edible item being stacked
    - `count` -- number of items being added to stack
*   **Returns:** None
*   **Error states:** None

### `OnSave()`
*   **Description:** Returns save data table containing `chill` value if greater than `0`.
*   **Parameters:** None
*   **Returns:** Table `{ chill = number }` or `nil` if chill is `0`
*   **Error states:** None

### `OnLoad(data)`
*   **Description:** Restores `chill` value from save data. Clamps to `[0, 1]`. Only applies if `temperaturedelta > 0` and `nochill` is not set.
*   **Parameters:** `data` -- save data table from `OnSave()`
*   **Returns:** None
*   **Error states:** None

## Events & listeners
- **Pushes:** `oneaten` — fired in `OnEaten()` when food is consumed. Data: `{ eater = entity }`