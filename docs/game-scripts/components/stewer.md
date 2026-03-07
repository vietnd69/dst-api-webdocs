---
id: stewer
title: Stewer
description: Manages cooking and spoilage timers for stew pot entities, handling cooking progression, product generation, and spoilage logic.
tags: [cooking, inventory, timer, perishable]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ce1c3ba5
system_scope: crafting
---

# Stewer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `stewer` component manages the cooking lifecycle of stew pot entities, including tracking cooking progress, spoilage after cooking completes, and product harvest. It integrates with `container` to monitor ingredient state, `perishable` to manage spoil timers, and `stackable` to set product stack sizes. The component automatically adds/removes tags (`stewer`, `readytocook`, `donecooking`) and handles persistent state via `OnSave`/`OnLoad` for cross-session cooking.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("stewer")
-- Populate container with ingredients, then:
if inst.components.stewer:CanCook() then
    inst.components.stewer:StartCooking(doer)
end
-- After cooking finishes, harvest the product:
inst.components.stewer:Harvest(harvester)
```

## Dependencies & tags
**Components used:** `container`, `perishable`, `stackable`, `inventory`, `physics`, `playeractionpicker` (indirect via events)  
**Tags added:** `stewer`, `readytocook` (temporary), `donecooking` (temporary)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `done` | boolean or `nil` | `nil` | Whether cooking has completed (`true`), is in progress (`nil`), or not started (`nil`). |
| `targettime` | number or `nil` | `nil` | Absolute game time when cooking/spoil finishes. |
| `product` | string or `nil` | `nil` | Prefab name of the cooked product. |
| `product_spoilage` | number or `nil` | `nil` | Multiplier applied to final product spoilage. |
| `spoiltime` | number or `nil` | `nil` | Total spoil time for the product (seconds). |
| `spoiledproduct` | string | `"spoiled_food"` | Prefab name used for spoiled products. |
| `cooktimemult` | number | `1` | Multiplier applied to base cooking time. |
| `chef_id` | string or `nil` | `nil` | User ID of the chef who started cooking. |
| `ingredient_prefabs` | table or `nil` | `nil` | List of ingredient prefab names used. |
| `task` | task or `nil` | `nil` | Scheduled task for cooking/spoil timer. |

## Main functions
### `IsDone()`
* **Description:** Checks if cooking has completed (product generated, regardless of spoilage state).
* **Parameters:** None.
* **Returns:** `boolean` – `true` if cooking finished, `false` otherwise.

### `IsSpoiling()`
* **Description:** Checks if the stew is in the spoilage phase (cooking done, but product hasn't been harvested and spoilage timer is active).
* **Parameters:** None.
* **Returns:** `boolean` – `true` if spoiling, `false` otherwise.

### `IsCooking()`
* **Description:** Checks if the stew is actively cooking (cooking timer running).
* **Parameters:** None.
* **Returns:** `boolean` – `true` if cooking, `false` otherwise.

### `GetTimeToCook()`
* **Description:** Returns remaining time until cooking finishes.
* **Parameters:** None.
* **Returns:** `number` – Seconds until cooking completes (`0` if not cooking).

### `GetTimeToSpoil()`
* **Description:** Returns remaining time until the cooked product spoils.
* **Parameters:** None.
* **Returns:** `number` – Seconds until spoilage (`0` if not spoiling).

### `CanCook()`
* **Description:** Checks if the pot is full and closed, and thus can begin cooking.
* **Parameters:** None.
* **Returns:** `boolean` – `true` if conditions are met.

### `StartCooking(doer)`
* **Description:** Begins the cooking process using ingredients in the container, calculates product and spoilage, and schedules cooking completion.
* **Parameters:** `doer` (entity) – Player or entity initiating cooking; used to assign chef ID and learn cookbook recipes.
* **Returns:** Nothing.
* **Error states:** Does nothing if `targettime` is already set (cooking already in progress).

### `StopCooking(reason)`
* **Description:** Cancels active cooking/spoil timers and resets internal state.
* **Parameters:** `reason` (string) – e.g., `"fire"` triggers product spawn on fire-out.
* **Returns:** Nothing.

### `Harvest(harvester)`
* **Description:** Transfers the cooked product to the harvester, applies spoilage percentage, and triggers recipe learning if applicable.
* **Parameters:** `harvester` (entity) – Entity receiving the product.
* **Returns:** `boolean` – `true` if product was harvested successfully.

### `LongUpdate(dt)`
* **Description:** Adjusts timers for frame-rate lag or pause; reschedules `dostew`/`dospoil` tasks to maintain accuracy across updates.
* **Parameters:** `dt` (number) – Time delta in seconds.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging (e.g., product name, status, timers, spoilage).
* **Parameters:** None.
* **Returns:** `string` – Human-readable status description.

### `GetRecipeForProduct()`
* **Description:** Returns the cooking recipe associated with the current product.
* **Parameters:** None.
* **Returns:** `table` – Recipe data from `cooking.lua`, or `nil`.

### `OnRemoveFromEntity()`
* **Description:** Cleans up tags and state when the component is removed from an entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Captures current state for world persistence.
* **Parameters:** None.
* **Returns:** `table` – State data including product, timers, chef info, and remaining time.

### `OnLoad(data)`
* **Description:** Restores state from saved data.
* **Parameters:** `data` (table) – State data from `OnSave`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `itemget` – Triggers tag check (`readytocook`).  
  - `onclose` – Triggers tag check (`readytocook`).  
  - `itemlose` – Removes `readytocook` tag.  
  - `onopen` – Removes `readytocook` tag.  
- **Pushes:**  
  - `perishchange` (indirectly via `perishable:SetPercent`)  
  - `stacksizechange` (indirectly via `stackable:SetStackSize`)  
  - `learncookbookrecipe` (if chef harvests their own dish and recipe is in cookbook)
