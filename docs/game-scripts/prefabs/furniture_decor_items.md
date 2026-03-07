---
id: furniture_decor_items
title: Furniture decor items
description: Generates prefabs for small decorative furniture items with floatable and burnable properties.
tags: [furniture, decor, item]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f3f746aa
system_scope: inventory
---

# Furniture decor items

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines a utility function `MakeDecorItem` used to create reusable prefabs for small decorative furniture items (e.g., centerpieces, portrait frames). It constructs prefabs with a standard set of components (`transform`, `animstate`, `follower`, `network`, `inventoryitem`, `furnituredecor`, `inspectable`) and optional floatable/burnable behavior. The resulting prefabs are designed to be placed on furniture and participate in the game's inventory and world systems.

## Usage example
```lua
-- Example of creating a custom decor item using MakeDecorItem
local MYDECOR_DATA =
{
    float = {"small", 0.02, 0.5},
    common_postinit = function(inst)
        inst:AddTag("mycustomtag")
    end,
    master_postinit = function(inst)
        inst.components.furnituredecor.onputonfurniture = function(inst, holder)
            -- custom logic when placed on furniture
        end
    end,
}
local mydecor_prefab = MakeDecorItem("decor_mycustom", "anim_bank", nil, MYDECOR_DATA)
```

## Dependencies & tags
**Components used:** `furnituredecor`, `inspectable`, `inventoryitem`
**Tags:** Adds `furnituredecor` to each generated instance.
**Components added via utility functions:** `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeHauntable`, `MakeSmallBurnable`, `MakeSmallPropagator`

## Properties
No public properties

## Main functions
### `MakeDecorItem(name, bank, build, data)`
*   **Description:** Generates a prefab for a decorative furniture item with default properties and optional customization. The `data` parameter allows injecting custom post-init hooks and configuration.
*   **Parameters:**
    *   `name` (string) - The prefab name.
    *   `bank` (string) - Animation bank to use.
    *   `build` (string or nil) - Optional different build animation bank; if omitted, defaults to `bank`.
    *   `data` (table or nil) - Optional configuration table supporting keys: `float`, `common_postinit`, `put_on_furniture`, `onburnt`, `onsave`, `onload`, `master_postinit`.
*   **Returns:** Prefab - A fully configured prefab function.
*   **Error states:** Returns early on non-master clients (returns an incomplete entity); full setup only occurs on the master simulation.

## Events & listeners
None identified

### `OnSave(inst)`
*   **Description:** Optional custom save handler. If provided in `data.onsave`, it is attached directly to the instance for world saving.
*   **Parameters:** `inst` (entity) - The instance being saved.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Optional custom load handler. If provided in `data.onload`, it is attached directly to the instance for world loading.
*   **Parameters:**
    *   `inst` (entity) - The instance being loaded.
    *   `data` (table) - Saved data payload.
*   **Returns:** Nothing.