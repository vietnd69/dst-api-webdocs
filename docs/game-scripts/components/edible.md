---
id: edible
title: Edible
description: Manages nutritional and thermal properties of food items, including health/hunger/sanity restoration, spoilage effects, and temperature impact on consumers.
tags: [food, nutrition, temperature, perishable, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 97d56f0b
system_scope: entity
---

# Edible

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `edible` component defines the nutritional and thermal characteristics of consumable items. It calculates restoration values (health, hunger, sanity) based on food quality (fresh, stale, spoiled), eater affinity, and spicing. It integrates with `eater`, `perishable`, `foodaffinity`, `stackable`, and `temperature` components to handle consumption logic, spoilage degradation, and belly temperature effects.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("edible")
inst.components.edible.healthvalue = 15
inst.components.edible.hungervalue = 10
inst.components.edible.sanityvalue = 5
inst.components.edible.foodtype = FOODTYPE.MEAT
inst.components.edible.temperaturedelta = 5
inst.components.edible.temperatureduration = 60
inst:AddTag("edible_"..FOODTYPE.MEAT)
```

## Dependencies & tags
**Components used:** `eater`, `perishable`, `foodaffinity`, `stackable`, `temperature`  
**Tags added/removed:** `badfood`, `edible_<foodtype>`, `edible_BERRY` (handled during removal)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healthvalue` | number | `10` | Base health restored by consumption; triggers `badfood` tag if `< 0`. |
| `hungervalue` | number | `10` | Base hunger restored by consumption. |
| `sanityvalue` | number | `0` | Base sanity restored by consumption; triggers `badfood` tag if `< 0`. |
| `foodtype` | FOODTYPE enum | `FOODTYPE.GENERIC` | Primary food type; adds `edible_<foodtype>` tag. |
| `secondaryfoodtype` | FOODTYPE enum or `nil` | `nil` | Secondary food type; adds `edible_<foodtype>` tag. |
| `oneaten` | function or `nil` | `nil` | Callback when food is eaten: `function(inst, eater)`. |
| `degrades_with_spoilage` | boolean | `true` | Whether food values degrade when stale or spoiled. |
| `gethealthfn` | function or `nil` | `nil` | Override for health calculation: `function(food, eater)`. |
| `getsanityfn` | function or `nil` | `nil` | Override for sanity calculation: `function(food, eater)`. |
| `stale_hunger` | number | `TUNING.STALE_FOOD_HUNGER` | Multiplier or value for hunger when stale (used if `eater` has no override). |
| `stale_health` | number | `TUNING.STALE_FOOD_HEALTH` | Multiplier or value for health when stale (used if `eater` has no override). |
| `spoiled_hunger` | number | `TUNING.SPOILED_FOOD_HUNGER` | Multiplier or value for hunger when spoiled (used if `eater` has no override). |
| `spoiled_health` | number | `TUNING.SPOILED_FOOD_HEALTH` | Multiplier or value for health when spoiled (used if `eater` has no override). |
| `temperaturedelta` | number | `0` | Temperature impact on eater's belly (positive = heater, negative = cooler). |
| `temperatureduration` | number | `0` | Duration (in seconds) of temperature effect. |
| `chill` | number | `0` | Chill factor `[0, 1]` reducing effective temperature impact. |
| `spice` | string or `nil` | `nil` | Spice type used for multipliers from `TUNING.SPICE_MULTIPLIERS`. |

## Main functions
### `GetHealth(eater)`
* **Description:** Computes health restoration for the eater, applying spoilage, spicing, and eater-specific overrides.  
* **Parameters:** `eater` (Entity or `nil`) – the entity consuming this food. May be `nil` for preview/use.  
* **Returns:** number – final health value.  
* **Error states:** Returns `0` for stale food with positive `healthvalue`; returns `-TUNING.SANITY_SMALL` if spoiled and `sanityvalue` is involved.

### `GetHunger(eater)`
* **Description:** Computes hunger restoration, factoring in spoilage, eater affinity, and spicing.  
* **Parameters:** `eater` (Entity or `nil`) – the entity consuming this food. May be `nil` for preview/use.  
* **Returns:** number – final hunger value.  
* **Error states:** If spoiled, hunger restoration may be reduced based on `spoiled_hunger`.

### `GetSanity(eater)`
* **Description:** Computes sanity restoration, factoring in spoilage, spicing, and eater `ignoresspoilage` status.  
* **Parameters:** `eater` (Entity or `nil`) – the entity consuming this food. May be `nil` for preview/use.  
* **Returns:** number – final sanity value.  
* **Error states:** Returns `0` if stale and `sanityvalue > 0`; returns `-TUNING.SANITY_SMALL` if spoiled.

### `OnEaten(eater)`
* **Description:** Processes consumption logic: triggers `oneaten` callback, applies belly temperature effects, and fires `oneaten` event.  
* **Parameters:** `eater` (Entity) – the entity consuming this food.  
* **Returns:** Nothing.  
* **Error states:** Applies temperature only if `temperaturedelta ~= 0`, `temperatureduration ~= 0`, `chill < 1`, and eater has `temperature` component.

### `HandleEatRemove(eatwholestack)`
* **Description:** Handles entity removal after eating; called internally by `eater` component.  
* **Parameters:** `eatwholestack` (boolean) – whether the entire stack should be consumed.  
* **Returns:** Nothing.  
* **Error states:** Calls `handleremovefn` if set, otherwise uses `stackable:Get():Remove()` or `inst:Remove()`.

### `GetStackMultiplier()`
* **Description:** Determines the stack size multiplier for food value calculations.  
* **Parameters:** None.  
* **Returns:** number – stack size or `1` if no stack.  
* **Error states:** Returns `1` if neither `overridestackmultiplierfn` nor `stackable` is present.

### `SetOnEatenFn(fn)`
* **Description:** Sets the callback invoked when the item is eaten.  
* **Parameters:** `fn` (function) – signature: `function(inst, eater)`.  
* **Returns:** Nothing.

### `SetGetHealthFn(fn)`
* **Description:** Sets the custom health calculation function, overriding `healthvalue`.  
* **Parameters:** `fn` (function) – signature: `function(food, eater)`.  
* **Returns:** Nothing.

### `SetGetSanityFn(fn)`
* **Description:** Sets the custom sanity calculation function, overriding `sanityvalue`.  
* **Parameters:** `fn` (function) – signature: `function(food, eater)`.  
* **Returns:** Nothing.

### `AddChill(delta)`
* **Description:** Increases the chill factor, reducing effective temperature impact over time.  
* **Parameters:** `delta` (number) – amount to increase chill.  
* **Returns:** Nothing.  
* **Error states:** Only applies if `temperaturedelta > 0` and `nochill` is false or unset.

### `DiluteChill(item, count)`
* **Description:** Averages chill values across multiple food items in a stack.  
* **Parameters:** `item` (Entity) – the additional food item. `count` (number) – number of items added.  
* **Returns:** Nothing.  
* **Error states:** Only applies if `temperaturedelta > 0`, `nochill` is false, both items have `stackable` and `edible` components.

### `OnSave()` / `OnLoad(data)`
* **Description:** Save/load hooks for replication; persists `chill` state.  
* **Parameters:** `data` (table or `nil`) – loaded data containing `{ chill = number }`.  
* **Returns:** `OnSave` returns `{ chill = number }` or `nil` if `chill <= 0`; `OnLoad` returns nothing.

## Events & listeners
- **Pushes:** `oneaten` – fired on consumption with `{ eater = eater }` data.
- **Listens to:** None explicitly (event listeners are handled via property callbacks `oncheckbadfood` and `onfoodtype` during assignment).
