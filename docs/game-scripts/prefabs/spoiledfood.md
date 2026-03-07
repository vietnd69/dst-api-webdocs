---
id: spoiledfood
title: Spoiledfood
description: Provides shared initialization logic for spoiled food items used as fertilizer and ocean fishing lures, with weather-sensitive perish behavior and work-based looting for fish variants.
tags: [farming, fishing, perish, loot, weather]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 24cbff03
system_scope: entity
---

# Spoiledfood

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `spoiledfood.lua` file defines three prefabs—`spoiled_food`, `spoiled_fish`, and `spoiled_fish_small`—used in Don't Starve Together. It centralizes common behavior via a shared factory function `fn()` to create entities with perishable, fertilizer, and fishing lure properties. Key responsibilities include:
- Setting up fertilizer stats (nutrients, value, soil cycles) and making the item researchable.
- Enabling inventory, stackable, fuel, edible, tradable, and loot-dropping functionality.
- Implementing rain-based decay for food/lure variants using the `disappears` component (perish when exposed to rain).
- Supporting work-based looting for fish variants (e.g., hammering releases loot from fish).

It is not a standalone component but a prefab factory, returning prefabs with pre-attached components and shared logic.

## Usage example
```lua
-- Create a spoiled food item with default fertilizer properties
local food = SpawnPrefab("spoiled_food")
food.components.fertilizer.fertilizervalue -- Defaults to TUNING.SPOILEDFOOD_FERTILIZE

-- Create a spoiled fish that yields loot when hammered
local fish = SpawnPrefab("spoiled_fish")
fish.components.workable:SetWorkLeft(10) -- Adjust work required before looting
fish.components.lootdropper:DropLoot()   -- Manually trigger loot drop
```

## Dependencies & tags
**Components used:**  
`fertilizer`, `smotherer`, `inspectable`, `inventoryitem`, `stackable`, `fertilizerresearchable`, `selfstacker`, `fuel`, `edible`, `tradable`, `oceanfishingtackle`, `disappears`, `lootdropper`, `workable`, `floater`, `driedsalticon`, `rainimmunity`

**Tags added:**  
`icebox_valid`, `saltbox_valid`, `show_spoiled`, `fertilizerresearchable`, `selfstacker`, `oceanfishing_lure`, `spoiled_fish`

## Properties
No public properties are initialized in this prefab factory—only component properties and prefab-specific configuration via `fn()` parameters.

## Main functions
### `fn(common_init, mastersim_init, nutrients, kind)`
*   **Description:** The core factory function that creates and initializes a `spoiled_food`-type entity. It configures components, tags, physics, and behavior based on `kind` ("food" or otherwise for fish variants). Returns the fully initialized entity instance. Must be called only during prefab definition.
*   **Parameters:**  
    `common_init` (function) – Optional post-init hook for both client and server.  
    `mastersim_init` (function) – Optional post-init hook for server/master simulation only.  
    `nutrients` (table) – Nutrient composition for the fertilizer component.  
    `kind` (string) – Either `"food"` for standard spoiled food or `nil` for fish variants.
*   **Returns:** `inst` (Entity) – The initialized entity with all components attached.
*   **Error states:** If `kind ~= "food"`, fish assets and animations are used instead of food.

### `fish_onhit(inst, worker, workleft, workdone)`
*   **Description:** Callback for the `workable` component when a fish item is hammered. Calculates how many loot items to drop based on `workdone` and stack size, then spawns loot. If full loot is harvested, launches the remaining item toward the worker.
*   **Parameters:**  
    `inst` (Entity) – The spoiled fish entity.  
    `worker` (Entity) – The entity performing the work.  
    `workleft` (number) – Remaining work ticks.  
    `workdone` (number) – Cumulative work applied.
*   **Returns:** Nothing.
*   **Error states:** Loot is reduced if stack size is smaller than `num_loots`. May drop zero loot if `workdone` is insufficient.

### `fish_stack_size_changed(inst, data)`
*   **Description:** Listener for `stacksizechange` events that updates the `workable` component's required work left proportionally to stack size.
*   **Parameters:**  
    `inst` (Entity) – The spoiled fish entity.  
    `data` (table) – Event data containing `stacksize`.
*   **Returns:** Nothing.

### `GetFertilizerKey(inst)`
*   **Description:** Simple helper used by `fertilizerresearchable` to provide a unique research key based on the prefab name.
*   **Parameters:** `inst` (Entity) – The entity instance.
*   **Returns:** `inst.prefab` (string) – The prefab's identifier (e.g., `"spoiled_food"`).

### `fertilizerresearchfn(inst)`
*   **Description:** Research function passed to `fertilizerresearchable:SetResearchFn`. Delegates to `GetFertilizerKey` for dynamic research key generation.
*   **Parameters:** `inst` (Entity) – The entity instance.
*   **Returns:** `inst:GetFertilizerKey()` (string).

### `food_mastersim_init(inst)`
*   **Description:** Server-side initialization for food variants (`spoiled_food`). Adds ocean fishing lure capabilities and rain-based decay logic.
*   **Parameters:** `inst` (Entity) – The entity instance.
*   **Returns:** Nothing.

### `food_OnIsRaining(inst, israining)`
*   **Description:** Watches world rain state and triggers/disables decay via `disappears` when the item is exposed to rain and not held.
*   **Parameters:**  
    `inst` (Entity) – The entity instance.  
    `israining` (boolean?) – Whether it is currently raining. Defaults to world state.
*   **Returns:** Nothing.

### `food_IsExposedToRain(inst, israining)`
*   **Description:** Determines if an item is exposed to rain (not held, not rain-immune).
*   **Parameters:**  
    `inst` (Entity) – The entity instance.  
    `israining` (boolean) – Rain state.
*   **Returns:** `boolean` – True if item should be affected by rain.

### `fish_mastersim_init(inst)` and `fish_small_mastersim_init(inst)`
*   **Description:** Server-side initialization for fish variants. Adds `lootdropper`, `workable`, and event listeners for stack size changes.
*   **Parameters:** `inst` (Entity) – The entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `gainrainimmunity` (food variants only) – Stops decay when immunity is gained.  
  `loserainimmunity` (food variants only) – Re-checks rain state to restart decay.  
  `ondropped` (food variants only) – Re-checks rain state on drop.  
  `stacksizechange` (fish variants only) – Updates work left when stack size changes.  
  `"israining"` world state – Monitored via `WatchWorldState` to detect weather changes.

- **Pushes:** None (this prefab does not define any events).