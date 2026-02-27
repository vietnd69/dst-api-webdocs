---
id: recipestockpile
title: Recipestockpile
description: Manages per-recipe stockpiles with automatic restocking timers and event callbacks in response to crafting and state changes.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: crafting
source_hash: a0696960
---

# Recipestockpile

## Overview
The `RecipeStockpile` component tracks and manages per-recipe inventory stock levels for an entity (typically a workbench or storage structure), including automatic restocking via timers, state-aware callbacks (e.g., when restocked or emptied), and save/load synchronization. It enables gameplay mechanics where recipe production depletes a limited stock that regenerates over time.

## Dependencies & Tags
- **Component Dependency:** Relies on `inst:DoTaskInTime(...)` and `GetTaskRemaining(...)` — indicating integration with the game's task scheduler (`TheSim` or `GlobalTaskManager`).
- **Event Listener:** Registers for the `"builditem"` event on its owner entity.
- **Tags:** Adds no entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stock` | `table` | `{}` | A dictionary mapping recipe names to stock metadata (see `SetupItem`). Each entry holds `num`, `max`, `restocktime`, `onrestockfn`, `onemptyfn`, and optionally `timer`. |

## Main Functions

### `SetupItem(data, start_restock_timer)`
* **Description:** Initializes or updates stock configuration for a given recipe. Sets initial quantity (`num`), maximum capacity (`max`), restock interval (`restocktime`), and optional callbacks. If enabled, starts a restock timer if stock is below max.
* **Parameters:**
  - `data` (`table`): Table with keys: `recipe` (string), `num` (number, optional), `max` (number), `restocktime` (number, optional), `onrestockfn` (function, optional), `onemptyfn` (function, optional). `num` defaults to `max` if missing.
  - `start_restock_timer` (`boolean`): Whether to start a restock timer if `num < max` and `restocktime` is defined.

### `OnItemCrafted(recipe)`
* **Description:** Decrements stock for the given recipe upon a crafting event. Triggers restock timer if applicable, and fires `onemptyfn` when stock reaches 0.
* **Parameters:**
  - `recipe` (`string`): Name of the recipe whose stock is being consumed.

### `RemoveStock(recipe, allow_restock)`
* **Description:** Sets the current stock of a specific recipe to 0, cancels any running restock timer, and (if enabled) may restart a restock timer. Fires `onemptyfn` after clearing.
* **Parameters:**
  - `recipe` (`string`): Recipe name to clear.
  - `allow_restock` (`boolean`): If true, restarts restock timer based on `restocktime` (note: appears to contain a typo — uses `time.restocktime` instead of `stock.restocktime` in current code).

### `RemoveAllStock(allow_restock)`
* **Description:** Clears stock for *all* recipes, cancels their timers, and optionally restarts restock timers. Fires `onemptyfn` for each recipe.
* **Parameters:**
  - `allow_restock` (`boolean`): If true, restarts restock timers for all cleared recipes.

### `FullyRestockItem(recipe)`
* **Description:** Immediately fills the stock of a recipe to its maximum, cancels any active timer, and fires `onrestockfn`.
* **Parameters:**
  - `recipe` (`string`): Recipe name to fully restock.

### `HasAnyStock()`
* **Description:** Checks if *any* recipe in the stockpile currently has `num > 0`.
* **Returns:** `boolean` — `true` if at least one recipe has remaining stock; otherwise `false`.

### `OnSave()`
* **Description:** serializes current stock state for saving to disk. Captures `num` and remaining time on the timer (if any).
* **Returns:** `table` — Map of recipe names to `{ num = number, timer = number? }`.

### `OnLoad(data)`
* **Description:** Restores stock state after loading. Uses saved `num` and `timer` values to reinitialize timers.
* **Parameters:**
  - `data` (`table`): Deserialized stock data (keyed by recipe name).

### `GetDebugString()`
* **Description:** Generates a human-readable debug string listing each recipe’s current/max stock and remaining restock time (if any).
* **Returns:** `string` — Multi-line string for in-game debug console.

## Events & Listeners
- **Listens to `"builditem"` event** — Triggers `onitemcrafted`, which forwards the recipe name to `OnItemCrafted`.
- **Cleans up listener** on removal via `OnRemoveFromEntity`.

## Notes & Known Issues
- In `RemoveStock` and `RemoveAllStock`, the expression `time.restocktime` is likely a typo; should be `stock.restocktime`. This may cause incorrect or failed restock restarts if `allow_restock` is `true`.