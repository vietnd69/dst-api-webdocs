---
id: papyrus
title: Papyrus
description: A small, stackable cat toy item that can be used as fuel and consumed in campfires or by fire-based entities.
tags: [inventory, fuel, toy, crafting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 914dc889
system_scope: inventory
---

# Papyrus

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`papyrus` is a lightweight, stackable inventory item that functions both as a cat toy and as a small fuel source. It is designed for use with the `inventory`, `stackable`, and `fuel` components, and integrates with campfire mechanics via burnable and propagator utilities. It is not a standalone component but a complete prefab definition — however, its entity instance exposes several standard components for modder reference.

## Usage example
```lua
local inst = SpawnPrefab("papyrus")
if inst ~= nil then
    -- Increase stack size if needed (default is TUNING.STACK_SIZE_SMALLITEM)
    inst.components.stackable:SetStackSize(5)
    
    -- Set fuel value for custom usage
    inst.components.fuel.fuelvalue = TUNING.SMALL_FUEL * 2
end
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `fuel`, `tradable`, `inventoryitem`, and utility functions `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeSmallBurnable`, `MakeSmallPropagator`, `MakeHauntableLaunchAndIgnite`.
**Tags:** Adds `cattoy`, `bookcabinet_item`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.SMALL_FUEL` | Amount of fuel provided when burned (shared from `fuel` component). |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size (shared from `stackable` component). |
| `pickupsound` | string | `"paper"` | Sound event name played when the item is picked up. |

## Main functions
This is a prefab definition, not a standalone component. It returns a fully constructed `Entity` via its `fn()` function. No custom instance methods are defined in `papyrus.lua` itself — all functionality comes from the components and utility functions applied during construction.

### `fn()`
*   **Description:** Prefab constructor function that creates and configures the `papyrus` entity instance.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — The fully configured entity ready for world placement or inventory use.

## Events & listeners
No direct event listeners or pushed events are defined in this file. It relies on component-level event handling (e.g., from `fuel`, `inventoryitem`) for behavior during interaction.

