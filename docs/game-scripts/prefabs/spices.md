---
id: spices
title: Spices
description: Defines and configures spice prefabs for use as stackable, floatable inventory items.
tags: [inventory, item, prefabs]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 005fc759
system_scope: inventory
---

# Spices

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `spices.lua` file defines reusable prefab constructors for individual spice types (garlic, sugar, chili, salt). Each spice is instantiated as an entity with visual, physical, and gameplay components suitable for inventory use. It leverages the `stackable` component to enable item stacking and integrates with standard DST item systems via `inventoryitem`, `inspectable`, and floatability.

## Usage example
This file is not meant to be used directly by modders. Instead, it exports four prefabs (`spice_garlic`, `spice_sugar`, `spice_chili`, `spice_salt`) for use in game code:
```lua
-- Example of how the spice prefabs are consumed elsewhere (e.g., in a recipe or loot table)
local spice_garlic = TheWorld:PrefabExists("spice_garlic") and SpawnPrefab("spice_garlic")
if spice_garlic then
    -- spice_garlic is now an instance with stackable, inventoryitem, inspectable components
    spice_garlic.components.stackable:SetStackSize(5)
end
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `inventoryphysics`, `stackable`, `inspectable`, `inventoryitem`, `hauntablelaunch`
**Tags:** Adds `spice`

## Properties
No public properties.

## Main functions
### `MakeSpice(name)`
*   **Description:** Factory function that constructs and returns a `Prefab` for a specific spice type. It sets up the entity’s transforms, animation, physics, components, and spawn logic (including master-only setup).
*   **Parameters:** `name` (string) - The internal name of the spice prefab (e.g., `"spice_garlic"`).
*   **Returns:** `Prefab` - A configured prefab ready for registration and use.
*   **Error states:** None identified.

## Events & listeners
None identified.