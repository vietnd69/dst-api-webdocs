---
id: controllercrafting
title: Controllercrafting
description: Manages controller-based crafting UI interactions, including tab navigation, recipe selection, and crafting execution with repeat input support.
tags: [crafting, ui, controller, navigation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 9c87e722
system_scope: ui
---

# Controllercrafting

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ControllerCrafting` is a UI widget component that extends `Crafting` to provide a controller-optimized crafting interface. It handles tab-based recipe browsing, keyboard/controller-driven navigation (e.g., D-pad, right stick), and recipe selection with long-press recognition for repeated crafting. Unlike standard crafting UIs, it always shows scroll buttons and disables resizing. It integrates with `RecipePopup`, tab groups, and HUD systems for focused input flow.

## Usage example
```lua
local controller_crafting = owner.HUD:AddChild(ControllerCrafting(owner))
controller_crafting:Open()
-- Controller navigation automatically handled via OnUpdate and OnControl events
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `builder` (via `owner.replica.builder`) for recipe learnability.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tabidx` | number | `1` | Current active tab index. |
| `selected_recipe_by_tab_idx` | table | `{}` | Maps tab index → selected recipe object per tab. |
| `repeat_time` | number | `0.15` | Time interval (in seconds) for repeated actions (e.g., cycling recipes on hold). |
| `in_pos`, `out_pos` | Vector3 | `(550, 250, 0)`, `(-2000, 250, 0)` | Screen positions for slide-in/slide-out animations. |
| `groupname` | Text | `Text(TITLEFONT, 100)` | Widget displaying the current tab name. |
| `recipepopup` | RecipePopup | `RecipePopup(true)` | Popup widget showing recipe details and skin selector. |
| `oldslot` | CraftSlot or `nil` | `nil` | Tracks previously highlighted slot for animation resets. |
| `recipe_held` | boolean | `false` | Flag set when recipe craft action is held for repetition. |
| `control_held`, `control_held_time` | boolean, number | `false`, `0` | State tracking for `CONTROL_OPEN_CRAFTING` hold duration. |
| `accept_down` | boolean | `false` | Whether `CONTROL_ACCEPT` was held at `Open()` time. |
| `last_recipe_click` | number or `nil` | `nil` | Timestamp of last recipe click for debounce detection. |

## Main functions
### `SelectRecipe(recipe)`
*   **Description:** Highlights and selects a specific recipe in the current tab view, updates popup position, and scrolls list if needed.
*   **Parameters:** `recipe` (Recipe object or `nil`) — recipe to select. If `nil`, selects the first available recipe.
*   **Returns:** `boolean` — `true` if a recipe was successfully selected; `nil` if no valid recipe exists.
*   **Error states:** Returns `nil` early if no matching recipe is found in `valid_recipes`.

### `SelectNextRecipe()`
*   **Description:** Selects the next recipe in the current tab list (cycling to first after last).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if selection changed; `false` otherwise.

### `SelectPrevRecipe()`
*   **Description:** Selects the previous recipe in the current tab list (cycling to last before first).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if selection changed; `false` otherwise.

### `OpenRecipeTab(idx)`
*   **Description:** Switches to the specified tab, updates title display, filters recipes by tab filter and learnability, and selects a default recipe.
*   **Parameters:** `idx` (number) — 1-based tab index to open.
*   **Returns:** `Tab object or nil` — returns the opened tab object on success; `nil` if tab doesn’t exist.

### `OnControl(control, down)`
*   **Description:** Processes controller input events (e.g., `CONTROL_ACCEPT`, `CONTROL_OPEN_CRAFTING`, `CONTROL_NEXTVALUE`/`PREVVALUE`). Handles recipe crafting, closing the UI, and delegating popup control.
*   **Parameters:**  
  `control` (string) — Control constant (e.g., `"control_accept"`).  
  `down` (boolean) — Whether the button was pressed (`true`) or released (`false`).
*   **Returns:** `boolean` — `true` if input was handled; `nil` otherwise.

### `OnUpdate(dt)`
*   **Description:** Called every frame to handle repeated inputs (e.g., holding D-pad to cycle recipes) and timing logic. Plays sounds and advances timers for held actions.
*   **Parameters:** `dt` (number) — Delta time since last frame.
*   **Returns:** Nothing.
*   **Error states:** Early exit if not open, HUD not shown, or active screen mismatch.

### `Open(fn)`
*   **Description:** Activates the UI, opens the default tab, selects a recipe, sets focus, and locks UI focus for controller navigation.
*   **Parameters:** `fn` (function or `nil`) — Optional callback invoked on open completion.
*   **Returns:** Nothing.

### `Close(fn)`
*   **Description:** Deactivates the UI, unlocks focus, stops updates, resets recipe state, and scales down tab group.
*   **Parameters:** `fn` (function or `nil`) — Optional callback invoked on close completion.
*   **Returns:** Nothing.

### `Refresh()`
*   **Description:** Refreshes recipe and popup state to reflect updates (e.g., unlocked recipes, skin changes).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `buildsuccess` — triggers `Refresh()` on build completion.  
- **Listens to:** `unlockrecipe` — triggers `Refresh()` when a new recipe is unlocked.  
- **Pushes:** None identified.