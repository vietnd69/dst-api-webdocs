---
id: cookingrecipecard
title: Cookingrecipecard
description: Represents a recipe card item in the cooking system that displays ingredients and links to a specific recipe and cooker.
tags: [crafting, inventory, item]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: df164402
system_scope: inventory
---

# Cookingrecipecard

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cookingrecipecard` is a prefab that implements a physical item representing a cooking recipe card. It stores a recipe name and associated cooker name, and provides its description dynamically based on the recipe's definition. It integrates with the `inspectable`, `named`, `inventoryitem`, `fuel`, and `erasablepaper` components. It also supports save/load via `OnSave` and `OnLoad` functions and initializes with a randomly selected recipe upon creation.

## Usage example
```lua
local inst = SpawnPrefab("cookingrecipecard")
-- By default, a random recipe is assigned on spawn
-- To assign a specific recipe manually:
inst.recipe_name = "jerky"
inst.cooker_name = "crockpot"
inst.components.named:SetName(subfmt(STRINGS.NAMES.COOKINGRECIPECARD, { item = STRINGS.NAMES.JERKY }))
```

## Dependencies & tags
**Components used:** `inspectable`, `named`, `inventoryitem`, `fuel`, `erasablepaper`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recipe_name` | string | `nil` | Name of the recipe associated with this card (e.g., `"jerky"`). |
| `cooker_name` | string | `nil` | Name of the cooker this recipe works with (e.g., `"crockpot"`). |

## Main functions
### `SetRecipe(inst, recipe_name, cooker_name)`
* **Description:** Assigns the recipe and cooker names to the card, and sets its display name using localized strings.
* **Parameters:**
  * `recipe_name` (string) — The recipe identifier (must exist in `cooking.recipes[cooker_name]`).
  * `cooker_name` (string) — The cooker identifier (e.g., `"crockpot"`, `"dragonfly_cooker"`).
* **Returns:** Nothing.

### `PickRandomRecipe(inst)`
* **Description:** Selects a random recipe card entry from `cooking.recipe_cards` and applies it via `SetRecipe`.
* **Parameters:** None.
* **Returns:** Nothing.

### `getdesc(inst, viewer)`
* **Description:** Generates and returns a localized description of the recipe card, including its output name and first two ingredient counts/names.
* **Parameters:**
  * `inst` (Entity instance) — The recipe card entity.
  * `viewer` (Entity) — The entity inspecting the card (unused in current implementation).
* **Returns:** `string` — The formatted description; or `nil` if the recipe/cooker combination is invalid or missing data.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.