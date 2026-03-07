---
id: lightninggoathorn
title: Lightninggoathorn
description: A collectible and craftable item prefab that functions as a stackable inventory item in DST.
tags: [inventory, stackable, item]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3de42940
system_scope: inventory
---

# Lightninggoathorn

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lightninggoathorn` is a prefab representing the lightning goat horn item, used in crafting recipes (e.g., lightning rod). It is implemented as an inventory item with stackable behavior, supporting network replication and basic animation states. The component does not define custom logic beyond initial setup and relies on standard components (`stackable`, `inventoryitem`, `inspectable`) for core functionality.

## Usage example
This prefab is instantiated automatically by the game engine and does not require manual component management by modders. However, modders can reference or extend it when adding recipes or modifying behavior:

```lua
-- Example: Modding recipe usage (not part of this file, but typical integration)
local recipes = require("recipes")
table.insert(recipes.CRAFTING_TYPES.CRAFTING.req_items, "lightninggoathorn")
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`, `floatable`, `hauntable_launch`.  
**Tags:** None identified.

## Properties
No public properties are defined in the constructor or beyond. Behavior is controlled via component attachments and tunings.

## Main functions
The file does not define any custom functions beyond the `fn()` prefab constructor. All functionality is delegated to attached components.

## Events & listeners
This prefab does not register or fire events directly. Event handling is performed via attached components (e.g., `stackable`, `inventoryitem`).