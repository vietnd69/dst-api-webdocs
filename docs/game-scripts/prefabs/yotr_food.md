---
id: yotr_food
title: Yotr Food
description: Defines four configurable food prefabs (carrot roll, moon cake, Moon Jelly, and dango) with custom nutritional and perishability values for Don't Starve Together.
tags: [food, inventory, perishable, prefabs]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c5f2dd48
system_scope: inventory
---

# Yotr Food

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yotr_food.lua` file defines four distinct food prefabs (indexed 1 through 4) for the game, each with customizable nutritional properties, perishability, and visual floating behavior. It leverages the `edible`, `perishable`, `stackable`, and `floater` components to define how each food item behaves when consumed, stored, and placed on water. The prefabs are generated programmatically from the `foodinfo` table, which specifies per-item attributes such as hunger/health/sanity gain, perish time, and floater configuration.

## Usage example
```lua
-- Create the fourth food item (dango)
local dango_prefab = Prefab("yotr_food4")
local dango = dango_prefab()

-- Access component properties after instantiation
dango.components.edible.healthvalue = 5
dango.components.perishable:SetPerishTime(TUNING.PERISH_FAST)
```

## Dependencies & tags
**Components used:** `edible`, `perishable`, `stackable`, `floater`, `tradable`, `inspectable`, `inventoryitem`, `hauntable`
**Tags added:** `pre-preparedfood`, and optionally any tags specified in `data.tags` per food entry.

## Properties
No public properties are defined in this file itself — it is a prefab generator that *configures* components on entity instances.

## Main functions
### `MakeFood(num)`
* **Description:** Returns a prefab function for creating a specific food item (indexed by `num`). The function builds the entity, configures visual assets, attaches components, and sets nutritional/perish behavior based on the corresponding entry in the `foodinfo` table.
* **Parameters:** `num` (number) — index into the `foodinfo` array (1–4).
* **Returns:** A Prefab function that, when called, returns a fully configured entity instance.
* **Error states:** Raises no documented errors; assumes `num` is a valid array index.

## Events & listeners
- **Listens to:** 
  - `floater_startfloating` — switches to the floating animation variant if the floater uses an override (`data.floater[3] == true`).
  - `floater_stopfloating` — restores the base animation when floating ends.
- **Pushes:** No events are pushed by this script; event pushing is handled internally by components (e.g., `floater` may push `floater_startfloating`/`floater_stopfloating`).