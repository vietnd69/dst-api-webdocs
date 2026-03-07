---
id: froglegs
title: Froglegs
description: A raw meat food item that can be dried or cooked, granting basic nutrition and sanity penalty when eaten raw.
tags: [food, cooking, drying, rawmeat]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d6b6170d
system_scope: inventory
---

# Froglegs

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`froglegs` is a raw meat food item prefab that provides baseline nutrition with a sanity penalty. It supports drying and cooking via the `dryable` and `cookable` components respectively, transforming into `smallmeat_dried` or `froglegs_cooked`. It belongs to the inventory system and is stackable, tradable, and perishable. The prefab uses a shared `commonfn` constructor to initialize core properties and delegates state-specific tuning (`raw` vs `cooked`) to dedicated functions.

## Usage example
```lua
-- Spawn raw frog legs
local raw = SpawnPrefab("froglegs")

-- Spawn cooked frog legs
local cooked = SpawnPrefab("froglegs_cooked")

-- Check and modify properties
if raw.components.edible ~= nil then
    raw.components.edible: Eat()
end
```

## Dependencies & tags
**Components used:** `edible`, `perishable`, `dryable`, `cookable`, `stackable`, `bait`, `inspectable`, `inventoryitem`, `tradable`  
**Tags added:** `smallmeat`, `catfood`, `rawmeat`, `dryable`, `cookable` (conditionally added in `commonfn` based on parameters)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foodtype` | `FOODTYPE` | `FOODTYPE.MEAT` | Specifies the food category for gameplay effects. |
| `healthvalue` | number | Varies (`0` raw, `TUNING.HEALING_TINY` cooked) | Health restored per consumption. |
| `hungervalue` | number | `TUNING.CALORIES_SMALL` | Hunger restored per consumption. |
| `sanityvalue` | number | `-TUNING.SANITY_SMALL` (raw only) | Sanity change per consumption. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size. |
| `goldvalue` | number | `0` | Gold value when traded. |
| `perishtime` | number | `TUNING.PERISH_FAST` (raw), `TUNING.PERISH_MED` (cooked) | Time before item spoils. |
| `product` | string | `"froglegs_cooked"` (cookable), `"smallmeat_dried"` (dryable) | Resulting item after cooking or drying. |

## Main functions
### `commonfn(anim, dryable, cookable)`
*   **Description:** Core prefab constructor shared across raw and cooked variants. Initializes visual state, adds components conditionally based on parameters, and sets up pristine state logic.
*   **Parameters:**  
    `anim` (string) - Animation bank name to play.  
    `dryable` (boolean) - Whether to add dryable support.  
    `cookable` (boolean) - Whether to add cookable support.
*   **Returns:** `inst` (Entity) - Fully configured entity instance.
*   **Error states:** Returns early on clients (when `TheWorld.ismastersim == false`) before server-side component initialization.

### `defaultfn()`
*   **Description:** Constructor for raw frog legs. Configures raw food stats and perish rate.
*   **Parameters:** None (calls `commonfn("idle", true, true)` internally).
*   **Returns:** `inst` (Entity) - Raw frog legs instance.
*   **Modifications applied:** Sets `healthvalue = 0`, `hungervalue = TUNING.CALORIES_SMALL`, `sanityvalue = -TUNING.SANITY_SMALL`.

### `cookedfn()`
*   **Description:** Constructor for cooked frog legs. Configures improved nutrition and longer shelf life.
*   **Parameters:** None (calls `commonfn("cooked")` internally).
*   **Returns:** `inst` (Entity) - Cooked frog legs instance.
*   **Modifications applied:** Sets `healthvalue = TUNING.HEALING_TINY`, `hungervalue = TUNING.CALORIES_SMALL`, and `perishtime = TUNING.PERISH_MED`.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:** None identified.  
  *(Note: The `perishable` and `edible` components internally handle `onperish`, `oneat`, and similar events, but `froglegs.lua` does not register direct listeners.)*