---
id: stewer
title: Stewer
description: Manages cooking, spoilage, and harvesting logic for pot-like entities in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ce1c3ba5
---

# Stewer

## Overview
The `Stewer` component implements the core cooking mechanics for stew pot entities. It handles ingredient validation, cooking progress, spoilage tracking, and item harvesting—including recipe learning for cookbooks and spoilage state preservation. It coordinates with container and perishable systems to manage state transitions (empty → cooking → done/spoiled) and persists its state across saves.

## Dependencies & Tags
- **Component Dependencies**: Relies on the presence of `container` component on the same entity; uses `perishable` component on ingredients (for spoilage calculation).
- **Tags Added/Removed**: 
  - Adds `"stewer"` to the entity during initialization.
  - Manages `"readytocook"` (entity is full and container is closed) and `"donecooking"` (cooking is complete) tags, primarily for scene/interaction logic.
- **Events Listened**:
  - `"itemget"` → `oncheckready`
  - `"onclose"` → `oncheckready`
  - `"itemlose"` → `onnotready`
  - `"onopen"` → `onnotready`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(injected)* | Reference to the owning entity. |
| `done` | `boolean?` | `nil` | Indicates if cooking has completed (`true`) or is in progress (`false`/`nil`). |
| `targettime` | `number?` | `nil` | Global time at which cooking or spoilage should complete. |
| `task` | `Task?` | `nil` | Scheduled task for cooking/spoilage completion callback. |
| `product` | `string?` | `nil` | Prefab name of the cooked item. |
| `product_spoilage` | `number?` | `nil` | Initial spoilage factor (0–1) applied to the resulting item. |
| `spoiledproduct` | `string` | `"spoiled_food"` | Prefab name of the spoiled output. |
| `spoiltime` | `number?` | `nil` | Total spoilage duration (seconds). |
| `cooktimemult` | `number` | `1` | Multiplier applied to base cooking time. |
| `chef_id` | `string?` | `nil` | User ID of the player who started cooking (for recipe learning). |
| `ingredient_prefabs` | `table?` | `nil` | List of ingredient prefab names used in the current recipe. |

## Main Functions

### `IsDone()`
* **Description:** Returns whether cooking has completed (i.e., product is ready or spoiled).
* **Parameters:** None  
* **Returns:** `boolean`

### `IsSpoiling()`
* **Description:** Returns whether the stew is currently in the spoilage phase (i.e., cooked but past its shelf life).
* **Parameters:** None  
* **Returns:** `boolean`

### `IsCooking()`
* **Description:** Returns whether the stew is currently cooking (i.e., ingredients added, not done, and timer active).
* **Parameters:** None  
* **Returns:** `boolean`

### `GetTimeToCook()`
* **Description:** Returns the remaining time (in seconds) until cooking finishes, or `0` if not cooking.
* **Parameters:** None  
* **Returns:** `number`

### `GetTimeToSpoil()`
* **Description:** Returns the remaining time (in seconds) until the cooked item spoils, or `0` if not spoiling.
* **Parameters:** None  
* **Returns:** `number`

### `CanCook()`
* **Description:** Checks if the pot is eligible to start cooking—specifically, if the container exists and is fully occupied.
* **Parameters:** None  
* **Returns:** `boolean`

### `GetRecipeForProduct()`
* **Description:** Retrieves the cooking recipe table for the current product.
* **Parameters:** None  
* **Returns:** `table?` — Recipe data, or `nil` if no product.

### `StartCooking(doer)`
* **Description:** Initiates the cooking process. Validates ingredients, computes product and spoilage, sets timers, and destroys the container contents. Closes and locks the container.
* **Parameters:**
  - `doer` (`Player?`) — The player triggering cooking; used for `chef_id` and recipe learning.

### `StopCooking(reason)`
* **Description:** Cancels ongoing cooking/spoilage, optionally spawning a product (if interrupted by fire) and resetting internal state.
* **Parameters:**
  - `reason` (`string`) — Context for stopping (e.g., `"fire"` triggers product spawn).

### `Harvest(harvester)`
* **Description:** Transfers the cooked item to the harvester, applies spoilage to the item, triggers recipe learning (for the original chef), and resets the stewer state.
* **Parameters:**
  - `harvester` (`Entity?`) — The entity receiving the item.

### `LongUpdate(dt)`
* **Description:** Adjusts cooking/spoilage timers in response to game time deltas (e.g., due to fast-forward). Maintains accurate progress after time jumps.
* **Parameters:**
  - `dt` (`number`) — Delta time to apply.

### `OnSave()`
* **Description:** Returns a table of state data for persistence, including remaining time and metadata for recipe learning.
* **Parameters:** None  
* **Returns:** `table` — Serializable state data.

### `OnLoad(data)`
* **Description:** Restores the stewer state from saved data, re-scheduling timers and re-tagging the entity.
* **Parameters:**
  - `data` (`table`) — Data returned from `OnSave()`.

### `GetDebugString()`
* **Description:** Generates a human-readable debug status string for the stewer (e.g., `"cooked_stew FULL timetocook: 0.00 timetospoil: 120.00 productspoilage: 0.75"`).
* **Parameters:** None  
* **Returns:** `string`

## Events & Listeners
- Listens to `"itemget"` and `"onclose"` → Adds `"readytocook"` tag (via `oncheckready`).
- Listens to `"itemlose"` and `"onopen"` → Removes `"readytocook"` tag (via `onnotready`).
- Triggers custom events via callbacks:
  - `self.onstartcooking(self.inst)`
  - `self.ondonecooking(self.inst)`
  - `self.onspoil(self.inst)`
  - `self.oncontinuedone(self.inst)` (load-only)
  - `self.oncontinuecooking(self.inst)` (load-only)
  - `self.onharvest(self.inst)` (via `Harvest`)
- Emits `"learncookbookrecipe"` event on the `harvester` player (in `Harvest`), including product and ingredients, if all criteria are met.