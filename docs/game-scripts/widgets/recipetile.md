---
id: recipetile
title: Recipetile
description: Renders a visual tile representation of a crafting recipe, including its icon, layered textures, and optional foreground animations.
tags: [ui, crafting, recipe]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 09191788
system_scope: ui
---

# Recipetile

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`RecipeTile` is a UI widget that visually represents a crafting recipe. It displays the recipe's icon using layered image logic (supporting skins, custom textures, and tinting) and optionally renders an animated foreground effect (e.g., glowing indicators). It extends `Widget` and is typically used in crafting menus or inventory previews.

## Usage example
```lua
local RecipeTile = require "widgets/recipetile"
local recipe = TheWorld.replica.global.recipe_db:GetRecipe("wood")
local tile = RecipeTile(recipe)
tile:SetPosition(100, 100, 0)
AddWidget(tile)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recipe` | table or nil | `nil` | The recipe definition used to populate the tile's image. |
| `img` | Image | `nil` | The primary `Image` widget used to render the recipe's icon. |
| `layers` | table or nil | `nil` | Array of additional image layers used for layered icons (set via `self.img.layers`). |
| `fxover` | UIAnim or nil | `nil` | Optional animated foreground effect (e.g., shimmer) rendered above the icon. |

## Main functions
### `SetRecipe(recipe)`
* **Description:** Updates the tile to display a new recipe’s icon. Triggers internal logic to handle layered skins, tinting, and foreground animations.
* **Parameters:** `recipe` (table) — a recipe object with fields like `product`, `image`, `imagefn`, `layeredimagefn`, `fxover`, and optionally `lockedatlas`.
* **Returns:** Nothing.

### `sSetImageFromRecipe(im, recipe, skin_name, r, g, b)`
* **Description:** Static helper function to set an `Image` widget’s texture and layers based on a recipe. Supports skin selection, tinting (`r`, `g`, `b`), and animated foreground effects.
* **Parameters:**
  * `im` (Image) — the image widget to update.
  * `recipe` (table) — the recipe object.
  * `skin_name` (string or nil) — optional skin identifier to override default skin selection.
  * `r`, `g`, `b` (number) — RGB tint values (defaults to `1` each).
* **Returns:** Nothing.
* **Error states:** If a `layeredimagefn` returns an offset on layer 1, prints a warning and asserts in non-dev branches.

### `SetCanBuild(canbuild)`
* **Description:** Placeholder function intended to visually indicate whether a recipe is buildable (e.g., by changing texture or tint). Currently commented out and inactive.
* **Parameters:** `canbuild` (boolean) — unused in current implementation.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified