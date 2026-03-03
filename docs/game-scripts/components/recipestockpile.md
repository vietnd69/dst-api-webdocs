---
id: recipestockpile
title: Recipestockpile
description: Tracks and manages the inventory and restocking behavior of crafted recipes for an entity.
tags: [crafting, inventory, entity]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a0696960
system_scope: crafting
---
# Recipestockpile

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RecipeStockpile` manages a per-recipe inventory of stock counts and restocking timers for an entity. It is designed to support systems where crafted recipes have limited availability that replenishes over time. The component listens for `builditem` events to decrement stock on craft, and maintains timers for automatic restocking. It supports save/load serialization and debug reporting. This component is typically attached to entities that craft or store recipes — such as workshops, bosses with special abilities, or characters with limited-use items.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("recipestockpile")

inst.components.recipestockpile:SetupItem({
    recipe = "flying_machine",
    max = 3,
    num = 1,
    restocktime = 300,
    onrestockfn = function(inst, recipe, num, max) print("Restocked:", recipe, num, max) end,
    onemptyfn = function(inst, recipe) print("Out of:", recipe) end,
}, true)

print("Has stock?", inst.components.recipestockpile:HasAnyStock())
print("Debug:", inst.components.recipestockpile:GetDebugString())
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `recipestockpile` (via `inst:AddTag("recipestockpile")` in calling code) — not added by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance that owns this component. |
| `stock` | `table` | `{}` | A dictionary mapping `recipe` string to stock data objects containing `num`, `max`, `restocktime`, `timer`, `onrestockfn`, `onemptyfn`. |

## Main functions
### `SetupItem(data, start_restock_timer)`
*   **Description:** Initializes or updates stock for a recipe. If `start_restock_timer` is `true` and the current stock is below max, a restock timer task is scheduled. If the recipe already exists, this function does nothing.
*   **Parameters:**  
  `data` (table) — recipe config with keys: `recipe` (string), `max` (number), optional `num` (number, defaults to `max`), `restocktime` (number, seconds), optional `onrestockfn` (function), optional `onemptyfn` (function).  
  `start_restock_timer` (boolean) — whether to begin restocking if `num < max`.
*   **Returns:** Nothing.
*   **Error states:** No-op if `self.stock[data.recipe]` is already non-`nil`.

### `OnItemCrafted(recipe)`
*   **Description:** Decrements stock for `recipe` by one on successful craft, and schedules the next restock if not at max and no timer is active.
*   **Parameters:**  
  `recipe` (string) — name of the recipe that was crafted.
*   **Returns:** Nothing.
*   **Error states:** No-op if `recipe` has no stock entry or `num <= 0`.

### `RemoveStock(recipe, allow_restock)`
*   **Description:** Immediately sets stock for `recipe` to `0`, cancels its restock timer, and optionally schedules a new restock if `allow_restock` is `true`.
*   **Parameters:**  
  `recipe` (string) — recipe to remove stock for.  
  `allow_restock` (boolean) — whether to start restocking from zero.
*   **Returns:** Nothing.
*   **Error states:** No-op if `recipe` has no stock entry or `num <= 0`.

### `RemoveAllStock(allow_restock)`
*   **Description:** Clears all recipes' stock to `0`, cancels all timers, and optionally restarts restocking for all.
*   **Parameters:**  
  `allow_restock` (boolean) — whether to schedule restocking for all recipes.
*   **Returns:** Nothing.
*   **Error states:** No-op if all stock entries have `num <= 0`.

### `FullyRestockItem(recipe)`
*   **Description:** Sets the stock of `recipe` to its `max`, cancels any existing restock timer, and invokes `onrestockfn` if present.
*   **Parameters:**  
  `recipe` (string) — recipe to fully restock.
*   **Returns:** Nothing.
*   **Error states:** No-op if `recipe` has no stock entry.

### `HasAnyStock()`
*   **Description:** Checks whether *any* recipe in the stock has a positive count.
*   **Parameters:** None.
*   **Returns:** `true` if at least one recipe has `num > 0`; otherwise `false`.

### `OnSave()`
*   **Description:** Serializes current stock and active timer remainders into a saveable table.
*   **Parameters:** None.
*   **Returns:** (table) — mapping `recipe → { num = number, timer = number? }`.

### `OnLoad(data)`
*   **Description:** Loads saved stock and timer state. Restores `num`, and resumes timer if `timer > 0`.
*   **Parameters:**  
  `data` (table) — save data from `OnSave()` output.
*   **Returns:** Nothing.
*   **Error states:** Only updates entries where `self.stock[k]` already exists — does not recreate missing recipes.

### `GetDebugString()`
*   **Description:** Returns a formatted string for debugging, listing each recipe, current/max stock, and remaining time on its restock timer (if any).
*   **Parameters:** None.
*   **Returns:** (string) — multi-line debug output.

## Events & listeners
- **Listens to:** `builditem` — triggers `OnItemCrafted` with the crafted recipe name.
- **Pushes:** None identified (callbacks like `onrestockfn`/`onemptyfn` are user-supplied, not pushed events).

>  **Note:** The function `RemoveAllStock` contains a bug: `time.restocktime` should be `stock.restocktime` (both occurrences). This will cause a runtime error unless fixed.
