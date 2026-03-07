---
id: wintersfeastfuel
title: Wintersfeastfuel
description: A consumable inventory item that grants no nutritional or health benefits but triggers a talker-equipped eater to speak a seasonal phrase upon consumption.
tags: [consumable, food, seasonal]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8f3ac145
system_scope: inventory
---

# Wintersfeastfuel

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wintersfeastfuel` is a lightweight consumable item prefab used as a thematic or decorative food item. It contributes no health or hunger restoration and instead serves a narrative purpose: when eaten by an entity with a `talker` component, it triggers a localized speech line. The prefab is structured as a standard DST inventory item with stacking support and networked visibility, but omits common food traits like satiety.

## Usage example
```lua
-- Example usage in a mod prefabs/ directory (conceptual)
local WintersfeastFuel = require "prefabs/wintersfeastfuel"
local inst = Prefab("my_custom_wintersfeastfuel", function() 
    local entity = WintersfeastFuel() 
    -- Optionally override properties after instantiation
    return entity
end)
```

## Dependencies & tags
**Components used:** `stackable`, `edible`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`, `health`, `talker` (indirectly via event callback).  
**Tags:** None explicitly added, removed, or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foodtype` | `FOODTYPE` | `FOODTYPE.GENERIC` | Classification for food-related logic (unused beyond definition). |
| `healthvalue` | number | `0` | Health restored on consumption (disabled). |
| `hungervalue` | number | `0` | Hunger restored on consumption (disabled). |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |

## Main functions
### `OnEaten(inst, eater)`
*   **Description:** Callback executed when the item is consumed. Triggers the eater to speak a predefined phrase if the eater has a `talker` component.
*   **Parameters:**  
    * `inst` (Entity) — The `wintersfeastfuel` instance being eaten.  
    * `eater` (Entity) — The entity consuming the item.  
*   **Returns:** Nothing.
*   **Error states:** If `eater.components.talker` is `nil`, the function exits silently.

## Events & listeners
*   **Listens to:** None (no `inst:ListenForEvent` calls in this file).  
*   **Pushes:** None (no `inst:PushEvent` calls in this file).