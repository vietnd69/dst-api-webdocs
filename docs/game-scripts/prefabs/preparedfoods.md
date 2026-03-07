---
id: preparedfoods
title: Preparedfoods
description: A prefabricated generator function factory that creates fully configured prepared food entities with configurable nutrition, perishability, and spice effects.
tags: [food, inventory, crafting, perishable, spice]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c1009255
system_scope: crafting
---

# Preparedfoods

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `preparedfoods` module is not a component itself, but a **Prefab factory generator**. It defines the `MakePreparedFood(data)` function, which programmatically constructs fully-featured food entities for DST. This includes setting up visual assets (animations and inventory images), attaching required components (edible, inventoryitem, perishable, stackable, bait, tradable), applying spiced food overlays when applicable, and configuring food-specific properties like health, hunger, sanity, temperature effects, and spoil time. It is used by `preparedfoods.lua` (generic foods), `preparedfoods_warly.lua` (Warly-specific foods), and `spicedfoods.lua` (spiced variants).

## Usage example
```lua
local food_data = {
    name = "my_custom_food",
    basename = "mycustomfood",
    health = 15,
    hunger = 20,
    sanity = 5,
    foodtype = FOODTYPE.GENERIC,
    perishtime = 40 * SECONDS,
    spice = "chili",
}

local my_food_prefab = MakePreparedFood(food_data)
```

## Dependencies & tags
**Components used:** `edible`, `inventoryitem`, `perishable`, `stackable`, `inspectable`, `bait`, `tradable`.  
**Tags added:** `preparedfood` (always), `spicedfood` (when spice is present), plus any custom tags from `data.tags`.

## Properties
No public properties are defined on a module-wide basis. The `MakePreparedFood` function accepts a `data` table with the following expected keys (derived from usage):

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `data.name` | string | *(required)* | Unique prefab name (e.g., `"sweettea"`). |
| `data.basename` | string | `nil` | Base filename override for animations and images. |
| `data.health` | number | *(required)* | Health value provided when eaten. |
| `data.hunger` | number | *(required)* | Hunger value provided when eaten. |
| `data.sanity` | number | `0` | Sanity change when eaten. |
| `data.foodtype` | `FOODTYPE.*` | `FOODTYPE.GENERIC` | Food classification (affects AI preferences). |
| `data.secondaryfoodtype` | `FOODTYPE.*` | `nil` | Optional secondary food classification. |
| `data.temperature` | number | `0` | Immediate temperature change on consumption. |
| `data.temperatureduration` | number | `0` | Duration (in seconds) of temperature effect. |
| `data.nochill` | boolean | `nil` | If `true`, food cannot be chilled (used for Warly). |
| `data.spice` | string | `nil` | Spice name (e.g., `"chili"`) to apply visual spice overlay. |
| `data.perishtime` | number | `nil` | Perish time in seconds; if > 0, perishable component is added. |
| `data.oneatenfn` | function | `nil` | Callback called when the food is eaten. |
| `data.tags` | table | `nil` | Array of custom tags to add to the entity. |
| `data.floater` | table | `nil` | Params for `MakeInventoryFloatable`: [x, y, z] offset. |
| `data.overridebuild` | string | `nil` | Custom animation build to use instead of default. |
| `data.prefabs` | table | `prefabs` | Additional prefabs to include in the asset list. |

## Main functions
### `MakePreparedFood(data)`
*   **Description:** Constructs and returns a fully configured `Prefab` for a prepared food item. Handles asset loading, animation setup, component attachment, and network initialization.
*   **Parameters:**  
    `data` (table) – Configuration table containing food properties (e.g., `health`, `hunger`, `spice`, `perishtime`).
*   **Returns:** `Prefab` – A callable prefab factory function suitable for use with `Prefab()`.
*   **Error states:** Returns early on clients (non-master simulations) after instantiating only the visual entity, to prevent duplicate server-side initialization.

## Events & listeners
This module itself does not define event handlers. However, the generated prefabs support the following events via component behavior:
- **Listens to:** `onputininventory` (custom listener via `data.OnPutInInventory` if provided).
- **Pushes:** `imagechange` (via `inventoryitem:ChangeImageName`), and standard component events (`on eaten`, `perish`, etc.) are handled by attached components (`edible`, `perishable`, etc.).