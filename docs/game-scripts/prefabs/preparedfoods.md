---
id: preparedfoods
title: Preparedfoods
description: Defines the prefab factory and registration logic for all cooked food items in the game.
tags: [prefabs, food, cooking]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 49937355
system_scope: entity
---

# Preparedfoods

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`preparedfoods.lua` acts as a factory module that generates and registers all cooked food prefabs in Don't Starve Together. It utilizes a central `MakePreparedFood` function to construct entities based on data definitions loaded from external tables (`preparedfoods`, `preparedfoods_warly`, `spicedfoods`). Each generated prefab is automatically configured with standard inventory, perishable, and edible components, ensuring consistent behavior across all food items.

## Usage example
```lua
-- This file is loaded by the engine to register prefabs.
-- Modders typically extend the data tables required by this file.
-- Example of data structure expected by MakePreparedFood:

local new_food_data = {
    name = "custom_food",
    basename = "custom_food",
    health = 10,
    hunger = 10,
    foodtype = FOODTYPE.GENERIC,
    perishtime = TUNING.PERISH_MED,
    -- Additional fields configure assets and behavior
}

-- The file internally calls:
-- Prefab = MakePreparedFood(new_food_data)
```

## Dependencies & tags
**External dependencies:**
- `preparedfoods` -- base food data table
- `preparedfoods_warly` -- Warly-specific food data table
- `spicedfoods` -- spiced food variants data table

**Components used:**
- `edible` -- configures health, hunger, sanity, and temperature effects
- `inspectable` -- allows players to examine the item
- `inventoryitem` -- manages inventory icon and pickup behavior
- `stackable` -- enables stacking in inventory (max size `TUNING.STACK_SIZE_SMALLITEM`)
- `perishable` -- handles spoilage over time (conditional)
- `bait` -- allows the item to be used as bait
- `tradable` -- enables trading mechanics

**Tags:**
- `preparedfood` -- added to all instances
- `spicedfood` -- added if spice data is present

## Properties
The following properties define the `data` table schema passed to the factory function.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | string | --- | Unique prefab name and asset identifier. |
| `basename` | string | --- | Base name used for display and asset lookups. |
| `health` | number | --- | Health value granted when eaten. |
| `hunger` | number | --- | Hunger value granted when eaten. |
| `sanity` | number | `0` | Sanity value granted when eaten. |
| `foodtype` | constant | `FOODTYPE.GENERIC` | Food classification (e.g., MEAT, VEGGIE). |
| `secondaryfoodtype` | constant | `nil` | Secondary food classification. |
| `perishtime` | number | `nil` | Time in seconds before the item spoils. |
| `spice` | string | `nil` | Spice type (e.g., "CHILI", "GARLIC"). |
| `overridebuild` | string | `nil` | Overrides the animation build name. |
| `tags` | table | `nil` | List of additional tags to add to the instance. |
| `prefabs` | table | `nil` | List of additional prefab dependencies to include. |
| `floater` | table | `nil` | Configuration for water floating behavior. |
| `oneatenfn` | function | `nil` | Callback function executed when the food is eaten. |
| `OnPutInInventory` | function | `nil` | Callback function executed when put in inventory. |
| `temperature` | number | `0` | Temperature delta applied when eaten. |
| `temperatureduration` | number | `0` | Duration of the temperature effect. |
| `nochill` | boolean | `nil` | If true, prevents cooling effects. |
| `chargevalue` | number | `nil` | Electrical charge value (for WX-78). |
| `wet_prefix` | string | `nil` | Prefix for wet inventory image. |
| `scrapbook` | table | `nil` | Scrapbook configuration data. |
| `scrapbook_sanityvalue` | number | `nil` | Sanity value displayed in scrapbook. |
| `scrapbook_healthvalue` | number | `nil` | Health value displayed in scrapbook. |

## Main functions
### `MakePreparedFood(data)`
*   **Description:** Factory function that constructs and returns a Prefab object based on the provided `data` table. It sets up assets, components, and entity logic for a specific food item.
*   **Parameters:**
    - `data` -- table containing configuration fields (see Properties).
*   **Returns:** Prefab object ready for registration.
*   **Error states:** Errors if `data.name` is nil when constructing asset paths (results in invalid asset string concatenation). Errors if `TheWorld` is not initialized during server-side component setup (rare, typically guarded by `ismastersim`).

## Events & listeners
- **Listens to:** `onputininventory` -- triggers `data.OnPutInInventory` callback if defined in the data table.