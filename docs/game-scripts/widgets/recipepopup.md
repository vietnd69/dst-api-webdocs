---
id: recipepopup
title: Recipepopup
description: Renders and manages the crafting popup UI for displaying recipe details, ingredients, skin selection, and build actions.
tags: [ui, crafting, inventory, skin]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 21dd33c2
system_scope: ui
---

# Recipepopup

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`RecipePopup` is a UI widget that displays a recipe's name, description, ingredients, and build controls in the crafting interface. It dynamically adjusts its layout (horizontal or vertical) and supports skin selection via a spinner when applicable. The component reacts to game state (e.g., player inventory, tech progress, paused state) and integrates with the `RecipeTile` module to set its preview image. It serves as the core UI element for rendering individual recipe tabs in the crafting HUD.

## Usage example
```lua
local popup = RecipePopup(false) -- Create vertical popup
popup:SetRecipe(some_recipe, player)
-- Optionally, update content dynamically via Refresh()
popup.Refresh(popup) -- or popup:Refresh()
```

## Dependencies & tags
**Components used:** None (it is a pure widget, not an ECS component)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `smallfonts` | boolean | `JapaneseOnPS4()` | Indicates if smaller font sizes should be used (e.g., for Japanese on PS4). |
| `horizontal` | boolean | — | Determines layout orientation (horizontal vs vertical). |
| `recipe` | table | `nil` | The recipe definition being displayed. Set via `SetRecipe()`. |
| `owner` | Entity | `nil` | The player entity performing the craft. Set via `SetRecipe()`. |
| `bg` | Image | — | Background texture widget (set in build methods). |
| `contents` | Widget | — | Container for all recipe-specific UI elements. |
| `name` | Text | — | Recipe name text widget. |
| `desc` | Text | — | Recipe description text widget. |
| `button` | ImageButton | — | Main build button (absent when spinner-enabled). |
| `skins_spinner` | Spinner group widget or `nil` | — | Spinner for skin selection (populated only when multiple skins exist). |
| `amulet` | Image | — | Green amulet icon displayed when the player wears a green amulet. |
| `teaser` | Text | — | Temporary hint/placeholder text (e.g., "NEEDS Science Machine"). |
| `ing` | array of IngredientUI | `{}` | Array of ingredient widgets. |
| `timestamp` | number | `-10000` | Tracks the latest skin acquisition timestamp for “new” indicators. |
| `skins_list` | array of `{type, item, timestamp}` | `{}` | List of owned skins for the recipe product (computed in `GetSkinsList()`). |
| `skins_options` | array of skin option tables | `{}` | Options passed to the spinner (default + owned skins). |

## Main functions
### `RecipePopup(horizontal)`
* **Description:** Constructor. Initializes the popup widget in the specified orientation (horizontal or vertical). Calls `BuildNoSpinner()` to set up the initial layout.
* **Parameters:** `horizontal` (boolean) — whether to use horizontal layout (`true`) or vertical (`false`).
* **Returns:** `RecipePopup` instance.

### `BuildWithSpinner(horizontal)`
* **Description:** Rebuilds the popup UI to include the skin selection spinner. Used when multiple skins are available for the current recipe.
* **Parameters:** `horizontal` (boolean) — layout orientation.
* **Returns:** Nothing.

### `BuildNoSpinner(horizontal)`
* **Description:** Rebuilds the popup UI without the spinner, used when only a single default skin is available.
* **Parameters:** `horizontal` (boolean) — layout orientation.
* **Returns:** Nothing.

### `Refresh()`
* **Description:** Updates the popup UI based on the current recipe and owner state (e.g., ingredient availability, tech level, paused state). Handles visibility toggling for the build button, teaser text, and amulet; populates ingredient UI widgets; adjusts spinner content and appearance if present.
* **Parameters:** None.
* **Returns:** `false` if `owner` is `nil`; otherwise `true`.

### `SetRecipe(recipe, owner)`
* **Description:** Sets the recipe and owner, then triggers `Refresh()` to update the UI.
* **Parameters:**
  - `recipe` (table) — the recipe definition (contains `name`, `product`, `ingredients`, `level`, etc.).
  - `owner` (Entity) — the player entity.
* **Returns:** Nothing.

### `GetSkinAtIndex(idx)`
* **Description:** Returns the skin prefab name at the given spinner index.
* **Parameters:** `idx` (number) — 1-indexed spinner position.
* **Returns:** string — the skin prefab (e.g., `"recipe.name"` for default, or another prefab for owned skins).

### `GetIndexForSkin(skin)`
* **Description:** Returns the spinner index for the given skin prefab, or `1` if not found.
* **Parameters:** `skin` (string) — a skin prefab name.
* **Returns:** number — 1-indexed spinner position.

### `GetSkinsList()`
* **Description:** Populates and returns a list of owned skins for the current recipe’s product by querying `PREFAB_SKINS` and `TheInventory`.
* **Parameters:** None.
* **Returns:** array — list of `{type, item, timestamp}` skin entries.

### `GetSkinOptions()`
* **Description:** Builds the list of spinner options, including a default option and any owned skins. Handles new-skin indicators using timestamps.
* **Parameters:** None.
* **Returns:** array — list of spinner option tables (with `text`, `colour`, `new_indicator`, and `image` fields).

### `MakeSpinner()`
* **Description:** Creates and configures the skin spinner widget, including left/right navigation buttons, a new-skin indicator label, and update logic.
* **Parameters:** None.
* **Returns:** Widget — spinner group container with `spinner` and `new_tag` children.

### `OnControl(control, down)`
* **Description:** Handles controller input for navigation, forwarding d-pad inputs to the spinner if present.
* **Parameters:**
  - `control` (CONTROL_* constant) — the input control.
  - `down` (boolean) — whether the control was pressed (`true`) or released (`false`).
* **Returns:** boolean — `true` if handled.

## Events & listeners
None identified.