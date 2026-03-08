---
id: recipelist
title: Recipelist
description: A UI widget that displays and manages a scrollable list of recipes for the Trade Inn, including coalesced ingredient display, time-to-expiry tracking, and input navigation.
tags: [ui, crafting, trade]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: aa40be0f
system_scope: ui
---

# Recipelist

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`RecipeList` is a UI widget responsible for rendering weekly special recipes in the Trade Inn screen. It manages a spinner control to select recipes, displays coalesced recipe requirements (grouping identical ingredients), shows remaining time before expiration, and supports controller navigation. It integrates with localized strings, item type utilities, and skin-related helpers for dynamic content rendering.

## Usage example
```lua
local RecipeList = require "widgets/recipelist"

local recipe_list = RecipeList(function(recipe)
    print("Selected recipe:", recipe.RecipeName)
end)

recipe_list:SetData({
    {
        RecipeName = "Wax Rifle",
        TimeLeft = 180000, -- seconds (≈ 2.08 days)
        Restrictions = {
            { ItemType = "bees", Rarity = "common", Tags = {} },
            { ItemType = "bees", Rarity = "common", Tags = {} },
            { ItemType = "", Rarity = "rare", Tags = {"gold"} },
        }
    }
})
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no entity tags (pure UI widget)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | Widget | Automatically created | Root container widget for layout hierarchy. |
| `clickFn` | function | `nil` | Optional callback invoked when the selected recipe changes. |
| `data` | table | `{}` | Internal list of raw recipe data objects. |
| `specials` | array of widgets | `{} (MAX_LINES)` | UI lines displaying coalesced recipe ingredients. |
| `recipes_spinner` | Spinner | Created in `DoInit` | Spinner widget for cycling through recipes. |
| `days_remaining` | Widget | Created in `DoInit` | Container for the expiration timer display. |

## Main functions
### `SetData(recipes)`
* **Description:** Populates the recipe list with new data, updates the spinner options, and resets selection to the first recipe.
* **Parameters:** `recipes` (table or `nil`) — Array of recipe objects. Each recipe should contain `RecipeName`, `TimeLeft` (seconds), and `Restrictions` (array of restriction objects with `ItemType`, `Rarity`, `Tags`). If `nil`, treats as empty.
* **Returns:** Nothing.

### `DisplayData(recipe_data)`
* **Description:** Renders the details of a single recipe, including coalesced ingredients, rarity, and expiration countdown.
* **Parameters:** `recipe_data` (table or `nil`) — A single recipe object (expected structure matches `data` entries).
* **Returns:** Nothing.
* **Error states:** If `recipe_data` is `nil`, clears recipe display and hides time elements.

### `BuildString(data)`
* **Description:** Constructs a localized display string for a single coalesced ingredient restriction.
* **Parameters:** `data` (table) — Coalesced ingredient data with fields `item_type`, `rarity`, `tags`, and `number`.
* **Returns:** `str` (string), `show_icon` (boolean) — The formatted string and whether to show an item icon.
* **Notes:** Uses `GetSkinName`, `GetTypeFromTag`, `GetColourFromColourTag`, and `ITEM_COLOURS`, `COLOURS_TAGS` globals.

### `UpdateSelectedIngredients(selected_items)`
* **Description:** Updates the visual state of recipe lines to indicate which have been satisfied by the provided inventory items. Lines are marked as "checked" if their restriction criteria are met.
* **Parameters:** `selected_items` (table) — Array of currently selected item instances or names.
* **Returns:** Nothing.
* **Notes:** Relies on external `GetSatisfiedRestrictions` helper to map selections to recipe restrictions.

### `GetRecipeName()`
* **Description:** Returns the name of the currently selected recipe.
* **Parameters:** None.
* **Returns:** `recipe_name` (string) — Value of `RecipeName` from the selected recipe, or `nil` if no data.

### `GetRecipeIndex()`
* **Description:** Returns the spinner index of the currently selected recipe.
* **Parameters:** None.
* **Returns:** `index` (number) — 1-based spinner selection index.

### `OnControl(control, down)`
* **Description:** Handles controller navigation input to switch between recipes via spinner controls.
* **Parameters:**  
  - `control` (string) — Control ID (e.g., `"PREVVALUE"` or `"NEXTVALUE"`).
  - `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if the control was handled; otherwise delegates to base class.

### `SetHintStrings(prev, next)`
* **Description:** Sets localized hint text displayed in help tooltips for spinner navigation buttons.
* **Parameters:**  
  - `prev` (string) — Hint for the "previous recipe" action.
  - `next` (string) — Hint for the "next recipe" action.
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Constructs localized help text for the widget, combining input bindings and hints.
* **Parameters:** None.
* **Returns:** `text` (string) — concatenation of control hints (e.g., `"X / Y  Prev/Next Recipe"`).

## Events & listeners
* **Listens to:** None identified  
* **Pushes:** None identified  
*(The widget relies on spinner events internally but does not expose them at the entity level.)*