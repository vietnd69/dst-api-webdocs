---
id: crafting
title: Crafting
description: Manages the crafting UI widget, including recipe listing, scrolling, filtering, and layout for both standard and Quagmire game modes.
tags: [ui, crafting, navigation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 01e89f86
system_scope: ui
---

# Crafting

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `Crafting` widget implements the interactive crafting interface displayed in-game. It dynamically lists valid recipes (based on player knowledge and tech trees), supports scrolling when the recipe count exceeds the visible slot capacity, and handles layout orientation (vertical/horizontal) and Quagmire-specific rendering. It depends on external UI widgets (`CraftSlots`, `Image`, `ImageButton`, `TileBG`) and integrates with game systems via the owner's `builder` component.

## Usage example
```lua
-- Example of adding and configuring a Crafting widget
local owner = GetPlayer()
local crafting_widget = Crafting(owner, 5) -- 5 visible slots
crafting_widget:SetPos(100, 200)
crafting_widget:SetOrientation(false) -- vertical layout
crafting_widget:SetFilter(function(recipe_name) return true end) -- no filter
crafting_widget:Open()
```

## Dependencies & tags
**Components used:** `owner.replica.builder` (accessed via `owner.replica.builder:KnowsRecipe`, `owner.replica.builder:GetTechTrees`)  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity (player) that owns this crafting interface. |
| `max_slots` | number | `0` | Maximum number of recipe slots the widget can display at once. |
| `current_slots` | number | `0` | Actual number of visible slots (capped by `max_slots` and recipe count). |
| `valid_recipes` | table | `nil` | Sorted list of `Recipe` objects satisfying visibility filters. |
| `idx` | number | `-1` | Zero-based scroll offset index (first visible recipe = `valid_recipes[idx + 1]`). |
| `filter` | function | `nil` | Optional predicate function `(recipe_name) -> boolean` to filter recipes. |
| `open` | boolean | `false` | Whether the widget is currently visible and active. |
| `horizontal` | boolean | `nil` | Whether the widget is in horizontal layout mode. |

## Main functions
### `SetOrientation(horizontal)`
*   **Description:** Adjusts widget layout and positions all sub-elements (slots, buttons, connectors) based on orientation (vertical if `false`, horizontal if `true`). Invokes `Quagmire_Layout` for the Quagmire game mode.
*   **Parameters:** `horizontal` (boolean) – layout orientation flag.
*   **Returns:** Nothing.
*   **Error states:** None.

### `SetFilter(filter)`
*   **Description:** Sets or updates the recipe filter function and refreshes the recipe list if the filter changed.
*   **Parameters:** `filter` (function or `nil`) – function mapping `recipe_name` (string) to `boolean`.
*   **Returns:** Nothing.

### `Close(fn)`
*   **Description:** Closes the crafting UI with animation: disables interaction, hides the widget, and calls optional completion callback.
*   **Parameters:** `fn` (function, optional) – callback executed after animation finishes.
*   **Returns:** Nothing.

### `Open(fn)`
*   **Description:** Opens the crafting UI with animation: enables interaction, shows the widget, and calls optional completion callback.
*   **Parameters:** `fn` (function, optional) – callback executed after animation finishes.
*   **Returns:** Nothing.

### `Resize(num_recipes)`
*   **Description:** Adjusts internal state and UI elements based on total recipe count, switching between short and normal end-cap textures for buttons, and updating connector scaling.
*   **Parameters:** `num_recipes` (number) – total count of valid recipes after filtering.
*   **Returns:** Nothing.

### `UpdateRecipes()`
*   **Description:** Re-evaluates the recipe list, sorts by `sortkey`, resizes widget, clears slots, and populates visible recipe slots. Updates scroll button states.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateScrollButtons()`
*   **Description:** Enables/disables scroll buttons (up/down) based on current scroll index and recipe count. Note: the "downbutton" scrolls recipes *up* and "upbutton" scrolls recipes *down*.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ScrollUp()`
*   **Description:** Increments the scroll index (`idx`) to move the recipe list *down*, updating the UI and playing a sound if the index changed.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if the game is paused.

### `ScrollDown()`
*   **Description:** Decrements the scroll index (`idx`) to move the recipe list *up*, updating the UI and playing a sound if the index changed.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if the game is paused.

### `OnControl(control, down)`
*   **Description:** Handles input controls (e.g., scroll wheel) for scrolling recipes when the widget is focused and active.
*   **Parameters:** `control` (string) – control name (`CONTROL_SCROLLBACK` or `CONTROL_SCROLLFWD`). `down` (boolean) – true when key is pressed.
*   **Returns:** `true` if event was handled; `false` otherwise.

## Events & listeners
None identified