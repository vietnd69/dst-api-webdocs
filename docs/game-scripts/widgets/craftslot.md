---
id: craftslot
title: Craftslot
description: Renders a single slot in the crafting interface, handling recipe display, locking states, and user interaction for crafting or purchasing items.
tags: [ui, crafting, interaction, hud]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 28255257
system_scope: ui
---

# Craftslot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CraftSlot` is a UI widget component that visually represents a single craftable or purchasable recipe in the crafting menu. It manages the visual state of the slot—including locked, unlocked, missing materials, and prototype states—based on the owner's builder component and recipe data. It also handles user input (mouse clicks and holds) to trigger crafting via `DoRecipeClick`, and supports dynamic recipe popup behavior for both standard and Quagmire modes.

## Usage example
```lua
local slot = CraftSlot("images/crafting.xml", "craft_slot_bg.tex", player)
slot:SetRecipe("torch")
slot:EnablePopup()
slot:Refresh()
```

## Dependencies & tags
**Components used:** None (self-contained widget, but relies on `self.owner` having a `builder` component via `replica.builder`).
**Tags:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | `nil` | The entity (typically a player) that owns this craft slot; used to check recipe access and materials. |
| `atlas` | string | `nil` | Texture atlas path used for slot visuals. |
| `bgimage` | Image | `nil` | Background image widget. |
| `tile` | RecipeTile | `nil` | Recipe icon/tile renderer. |
| `fgimage` | Image | `nil` | Foreground overlay (e.g., lock, missing mats). |
| `lightbulbimage` | Image | `nil` | Prototype indicator (shines when recipe is reachable). |
| `recipepopup` | RecipePopup/QuagmireRecipePopup | `nil` | Popup shown on focus to preview recipe details. |
| `recipename` | string | `nil` | Name of the recipe currently assigned. |
| `recipe` | RecipeTable | `nil` | Full recipe data table. |
| `recipe_skins` | table | `{}` | List of skins available for this recipe. |
| `canbuild` | boolean | `false` | Whether the owner can currently craft the recipe. |
| `isquagmireshop` | boolean | `false` | Whether running in Quagmire mode (affects visual states). |
| `open` | boolean | `false` | Whether the recipe popup is currently visible. |
| `locked` | boolean | `false` | Whether the slot is locked open. |
| `down` | boolean | `false` | Whether the ACCEPT control is currently pressed. |
| `recipe_held` | boolean | `false` | Whether the recipe action is being held for repeat crafting. |
| `last_recipe_click` | number | `nil` | Timestamp of last click (used for double-click hold detection). |

## Main functions
### `Refresh(recipename)`
* **Description:** Updates the slot's state based on the given or current recipe name. Determines visibility, textures, and tinting for locked/unlocked and material status, and configures the `RecipeTile` and popup.
* **Parameters:** `recipename` (string, optional) — Name of the recipe to refresh. Defaults to `self.recipename`.
* **Returns:** Nothing.
* **Error states:** No-op if `self.recipe` is `nil`. Silently handles missing or invalid recipe data.

### `SetRecipe(recipename)`
* **Description:** Sets and immediately refreshes the slot with a new recipe. Makes the widget visible and updates all associated visuals.
* **Parameters:** `recipename` (string) — Name of the recipe to assign.
* **Returns:** Nothing.

### `Clear()`
* **Description:** Resets the slot to a neutral state: hides recipe, tile, foreground, and lightbulb; restores default background texture. Clears internal recipe state.
* **Parameters:** None.
* **Returns:** Nothing.

### `EnablePopup()`
* **Description:** Instantiates and configures the recipe popup (standard or Quagmire variant) if not already created. Sets its position and scale.
* **Parameters:** None.
* **Returns:** Nothing.

### `Open()`
* **Description:** Shows the recipe popup and plays an interactive sound. Marks the slot as open.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close()`
* **Description:** Hides the recipe popup and marks the slot as closed.
* **Parameters:** None.
* **Returns:** Nothing.

### `LockOpen()`
* **Description:** Keeps the recipe popup open even after focus is lost (used for persistent preview).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles user input (specifically `CONTROL_ACCEPT`), triggering craft actions on press/release. Supports holding to auto-repeat crafting.
* **Parameters:**  
  `control` (number) — Control identifier (must be `CONTROL_ACCEPT` to trigger behavior).  
  `down` (boolean) — Whether the control is pressed (`true`) or released (`false`).  
* **Returns:** `true` if control was handled and consumed; `false` otherwise.
* **Error states:** Crafting may fail silently if `DoRecipeClick` returns `false`; in that case, the popup closes automatically.

### `OnGainFocus()`
* **Description:** Called when the slot receives focus (e.g., mouse hover). Calls `Open()` to show the popup.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnLoseFocus()`
* **Description:** Called when focus is lost. Resets hold state, stops auto-repeat crafting, and closes the popup unless `locked`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Handles repeat crafting while the button is held (`recipe_held` is `true`). Calls `DoRecipeClick` each frame.
* **Parameters:** `dt` (number) — Delta time since last frame.
* **Returns:** Nothing.

### `ShowRecipe()`
* **Description:** Makes the popup visible and sets its current recipe.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `self.recipe` or `self.recipepopup` is `nil`.

### `HideRecipe()`
* **Description:** Hides the recipe popup.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetSize()`
* **Description:** Returns the size of the slot’s background image for layout alignment.
* **Parameters:** None.
* **Returns:** `{x = number, y = number}` — Size table from `self.bgimage:GetSize()`.

## Events & listeners
None.