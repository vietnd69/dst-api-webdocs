---
id: quagmire_foods
title: Quagmire Foods
description: Generates and registers Quagmire mod food prefabs with dynamic asset loading and networked dish customization properties.
tags: [quagmire, food, prefab, inventory, network]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d1c6489e
system_scope: inventory
---

# Quagmire Foods

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This script dynamically generates multiple `quagmire_food_XXX` food prefabs for the Quagmire DLC, supporting customizable dish types (`plate` or `bowl`) and networked visuals via KLUMP-based dynamic asset loading. Each generated food entity includes inventory physics, animation states, and network replication for dish customization (`replate`, `basedishid`, `klumpkey`). It also integrates with the `DisplayNameFn` system to apply salting prefixes when the `quagmire_salted` tag is present.

## Usage example
```lua
-- Register all Quagmire food prefabs (handled automatically via this file)
-- Example of creating a specific food instance manually (not typical usage):
local food = MakeFood("quagmire_food_001")()
food.components.inventoryitem.cangoincontainer = false
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds to entities: `preparedfood`, `quagmire_stewable`, `quagmire_replatable`, `quagmire_saltable`.

## Properties
No public properties.

## Main functions
### `MakeFood(name)`
*   **Description:** Creates and returns a `Prefab` function for a single Quagmire food item. The prefab includes dynamic asset registration (static and KLUMP), inventory physics, and networked dish customization properties. It configures animation symbols, tags, and display name logic.
*   **Parameters:** `name` (string) — The prefab name (e.g., `"quagmire_food_001"`).
*   **Returns:** `Prefab` — A Prefab definition ready for registration with `Prefab(name, fn, assets, prefabs)`.
*   **Error states:** Returns a functional prefab only when called with a valid `name`. If KLUMP is not enabled and required assets are missing, loading may fail at runtime.

### `DisplayNameFn(inst)`
*   **Description:** Constructs a formatted display name for the food item, prefixing the base name with the `QUAGMIRE_SALTED_FOOD_FMT` string if the `quagmire_salted` tag is present.
*   **Parameters:** `inst` (Entity instance) — The food entity.
*   **Returns:** `string?` — A formatted string (e.g., `"Salted ..."`) if salted, otherwise `nil`.
*   **Error states:** Returns `nil` if not salted.

## Events & listeners
- **Listens to:** `keydirty` — Triggers `OnKeyDirty` to reload KLUMP assets and update the display name.
- **Listens to:** `dishdirty` — Triggers `OnDishDirty` to update the background image based on the dish type (`plate` or `bowl`) and optional replate suffix.
- **Pushes:** `imagechange` — Fired after asset/image updates to notify UI and rendering systems of visual changes.

