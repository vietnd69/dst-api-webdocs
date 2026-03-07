---
id: mushroom_farm
title: Mushroom Farm
description: Manages the growth, harvesting, and state progression of a mushroom farm structure, including interactions with snow cover, spore conversion, and repair mechanics.
tags: [structure, farming, weather, trader]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ee33daf4
system_scope: entity
---

# Mushroom Farm

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mushroom_farm` is a structure prefab that serves as a managed mushroom cultivation plot. It supports progressive growth stages based on planted items (mushrooms or spores), adapts to environmental conditions like snow cover, and provides optional spore reproduction at peak maturity. It integrates with the `harvestable`, `trader`, `workable`, `burnable`, and `inspectable` components to handle harvesting, trading, repair, burning, and status display. It is typically placed by the player and upgraded by right-clicking with compatible items.

## Usage example
```lua
-- Creating a basic mushroom farm instance
local farm = SpawnPrefab("mushroom_farm")
farm.Transform:SetPosition(x, y, z)

-- Plant a red cap to start growth
local item = SpawnPrefab("red_cap")
farm.components.trader:OnAccept(item, giver)

-- Manually trigger growth (e.g., via skill bonus)
if farm.components.harvestable ~= nil then
    farm.components.harvestable:Grow()
end
```

## Dependencies & tags
**Components used:** `harvestable`, `trader`, `inspectable`, `lootdropper`, `workable`, `burnable`, `propagator`, `insignificantstructure`, `inventoryitem`, `lightsource`, `hauntable`, `snowcovered`, `worldstateobserver`

**Tags:** Adds `structure`, `playerowned`, `mushroom_farm`, `trader`, `alltrader`. Checks `burnt`, `moonmushroom`, `mushroom`, `spore`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `remainingharvests` | number | `TUNING.MUSHROOMFARM_MAX_HARVESTS` | Remaining uses before the farm rots and becomes repairable with Living Log. |
| `anims` | table | `nil` | Local storage for idle and hit animation names, updated per growth stage. |

## Main functions
### `DoMushroomOverrideSymbol(inst, product)`
*   **Description:** Updates the visual mushroom symbol on the farm based on the product type (red/green/blue/moon).
*   **Parameters:** `product` (string) — prefab name of the mushroom/spore being planted (e.g., `"red_cap"`).
*   **Returns:** Nothing.

### `StartGrowing(inst, giver, product)`
*   **Description:** Initializes growth for a newly planted mushroom or spore. Determines max produce and grow time, applying Wormwood skilltree bonuses if active.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `giver` (entity) — the player planting the item.  
    - `product` (entity) — the planted mushroom or spore item.  
*   **Returns:** Nothing.

### `setlevel(inst, level, dotransition)`
*   **Description:** Updates the farm's animation and internal state based on the current harvestable produce count. Enables/disables the `trader` component appropriately.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `level` (table) — entry from `levels` table (contains `amount`, `grow`, `idle`, `hit` animation keys).  
    - `dotransition` (boolean) — whether to play a grow animation transition.  
*   **Returns:** Nothing.

### `updatelevel(inst, dotransition)`
*   **Description:** Recalculates and sets the current growth level. Handles snow-covered removal of produce. Automatically calls `setlevel`.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `dotransition` (boolean) — whether to play a grow animation transition.  
*   **Returns:** Nothing.

### `onharvest(inst, picker)`
*   **Description:** Callback triggered after successful harvest. Decrements `remainingharvests` and triggers `updatelevel`.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `picker` (entity) — the entity harvesting.  
*   **Returns:** Nothing.

### `ongrow(inst, produce)`
*   **Description:** Callback triggered when `harvestable` grows. Triggers `updatelevel` with animation and may spawn a spore if the farm is fully grown (level 1).
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `produce` (number) — current number of produce.  
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Handles hammering on a burnt or damaged farm. Extinguishes fire, drops loot, spawns a collapse FX, and removes the farm.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `worker` (entity) — the entity performing hammering.  
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Plays a hit animation when the farm is attacked but not fully damaged.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `worker` (entity) — the entity hitting the farm.  
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Returns a string status descriptor for UI display (e.g., `"EMPTY"`, `"SOME"`, `"LOTS"`, `"STUFFED"`, `"ROTTEN"`, `"SNOWCOVERED"`).
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
*   **Returns:** (string) Status descriptor or `nil` if `harvestable` is missing.

### `lootsetfn(lootdropper)`
*   **Description:** Sets the loot to drop when the farm is destroyed. Generates a table of produce based on current `harvestable.produce`.
*   **Parameters:**  
    - `lootdropper` (LootDropper component) — the component whose loot table to set.  
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Called after the farm is burnt. Calls `DefaultBurntStructureFn`, and removes the `trader` component entirely.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
*   **Returns:** Nothing.

### `onignite(inst)`
*   **Description:** Called when the farm catches fire. Drops ash for produce, resets produce count, stops growing, and disables the `trader`.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
*   **Returns:** Nothing.

### `onextinguish(inst)`
*   **Description:** Called when fire is extinguished. Triggers `updatelevel` to reflect current state (e.g., snow cover).
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
*   **Returns:** Nothing.

### `accepttest(inst, item, giver)`
*   **Description:** Validates if an item can be placed into the farm for growth or repair.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `item` (entity) — the item being tested.  
    - `giver` (entity) — the player attempting placement.  
*   **Returns:**  
    - `(true)` — if accepted.  
    - `(false, "ERROR_CODE")` — if rejected, with a localization key.

### `onacceptitem(inst, giver, item)`
*   **Description:** Processes a valid accepted item. Repairs farm (if `remainingharvests == 0`) or initiates growth.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `giver` (entity) — the player placing the item.  
    - `item` (entity) — the accepted item.  
*   **Returns:** Nothing.

### `onsnowcoveredchagned(inst, covered)`
*   **Description:** Event callback when snow cover state changes. Triggers `updatelevel` to apply snow logic.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `covered` (boolean) — whether snow is covering the farm.  
*   **Returns:** Nothing.

### `domagicgrowth(inst, doer)`
*   **Description:** Implements "magic" growth (e.g., via Wormwood skill), rapidly incrementing produce in 0.5s steps until max, then re-enabling manual growth.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `doer` (entity) — entity triggering magic growth (unused).  
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes farm state for save files, capturing burnt status or `harvestable` properties and `remainingharvests`.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `data` (table) — save data table to populate.  
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores farm state from saved data, re-applies visuals, and calls `updatelevel`.
*   **Parameters:**  
    - `inst` (entity) — the mushroom farm instance.  
    - `data` (table) — saved state data.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onbuilt` — triggers `onbuilt` to play placement animation and sound.  
  - `issnowcovered` (via `WatchWorldState`) — triggers `onsnowcoveredchagned` on weather change.  
- **Pushes:**  
  - none directly (relies on components for events like `onharvest`, `loot_prefab_spawned`, `onextinguish`, `onburnt`).  
