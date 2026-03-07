---
id: quagmire_food_burnt
title: Quagmire Food Burnt
description: Generates four burnt or goop-based Quagmire food prefabs (plate/bowl × burnt/goop) with dynamic naming, inventory visuals, and network sync for replating and salting.
tags: [quagmire, food, inventory, network]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 61b6b881
system_scope: inventory
---

# Quagmire Food Burnt

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines a factory function `MakeFood` that produces four food prefabs for the Quagmire region: burnt and goop variants in both plate and bowl forms. Each generated prefab includes entity components for transform, animation, sound, and network synchronization, along with inventory physics. It supports replating (via `quagmire_replatable` tag) and salting (via `quagmire_saltable` tag), and its display name dynamically reflects salting status. The `OnReplateDirty` event listener updates the inventory texture when the `replate` string changes.

## Usage example
```lua
-- Typically used internally; generates four prefabs at load time:
-- quagmire_food_plate_burnt, quagmire_food_plate_goop,
-- quagmire_food_bowl_burnt, quagmire_food_bowl_goop

-- Example of checking tags after instantiation:
local inst = GetEntityFromGuid(...)  -- e.g., obtained from gameplay
if inst:HasTag("quagmire_replatable") then
    inst.components.quagmire_plate:ReplaceWith(...)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `show_spoiled`, `overcooked`, `quagmire_stewable`, `quagmire_replatable`, and `quagmire_saltable`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `replate` | `net_string` | `""` | Networked string representing the current replating state; triggers visual update on change. |
| `inv_image_bg` | `{ atlas = string, image = string }` | `{ atlas = "...quagmire_food_common_inv_images.xml", image = dish..".tex" }` | Inventory image configuration used by the UI renderer. |
| `displaynamefn` | function | `DisplayNameFn` | Custom function to compute the display name based on salting status. |
| `nameoverride` | string (set via `SetPrefabNameOverride`) | `"wetgoop"` or `"quagmire_food_"..food` | Internal name override used for name lookups in `STRINGS.NAMES`. |

## Main functions
### `MakeFood(dish, food, assets, prefabs)`
*   **Description:** Factory function that constructs a `Prefab` for a specific Quagmire food (e.g., `"plate"` + `"burnt"`). Configures animation, tags, networking, and name behavior. Returns a `Prefab` instance ready for registration in the game.
*   **Parameters:**
    * `dish` (string) — `"plate"` or `"bowl"`; used to select the correct animation bank and build name.
    * `food` (string) — `"burnt"` or `"goop"`; determines the food type and display name override.
    * `assets` (array of `Asset`) — Asset declarations (ANIM, ATLAS, IMAGE) for the food item.
    * `prefabs` (array of string) — Prefab names to spawn on instantiation (e.g., sound effects for salting).
*   **Returns:** `Prefab` — The constructed prefab definition.
*   **Error states:** Returns early on non-master simulations with only client-side event listeners attached (no server-side `master_postinit`).

### `DisplayNameFn(inst)`
*   **Description:** Custom display name formatter that prefixes the food name with `"Salty "` if the `quagmire_salted` tag is present, using the `STRINGS.NAMES.QUAGMIRE_SALTY_FOOD_FMT` string.
*   **Parameters:** `inst` (entity) — The food instance being named.
*   **Returns:** `string?` — The formatted display name if salty, otherwise `nil`.
*   **Error states:** Returns `nil` when `quagmire_salted` tag is absent.

## Events & listeners
- **Listens to:** `replatedirty` — Triggers `OnReplateDirty`, which updates the inventory background image based on the current `replate` value and fires an `imagechange` event.
- **Pushes:** `imagechange` — Fired when the inventory image is updated after a replating change.
