---
id: controllercrafting_singletab
title: Controllercrafting Singletab
description: Manages a single tab in the controller-based crafting interface, handling recipe selection, tab navigation, and button press handling for crafting actions.
tags: [ui, crafting, controller]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 7565c1e8
system_scope: ui
---

# Controllercrafting Singletab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ControllerCrafting` extends `Crafting` and represents the UI component for a single tab within the controller crafting interface. It manages the display and interaction state for a subset of craftable recipes, including navigation between recipes (e.g., via directional input), tab selection, and recipe execution via gamepad controls. It maintains selection state (`selected_recipe`, `tabidx`) and coordinates with the parent tab group (`CraftTabs`) to switch tabs and filter recipes accordingly.

## Usage example
```lua
-- Typically instantiated internally by the HUD system.
-- The component is not directly added to entities by modders.
-- Example of interacting with it (in the context of an open crafting HUD):
local crafting = ThePlayer.HUD:GetControllerCrafting()
crafting:SelectNextRecipe()
crafting:SelectRecipe(some_recipe)
```

## Dependencies & tags
**Components used:** `builder` (via `self.owner.replica.builder`), `HUD`, sound system (`TheFrontEnd:GetSound()`), profile settings (`Profile`), and input system (`TheInput`, `TheFrontEnd`).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tabidx` | number | `1` | Index of the currently active tab. |
| `selected_recipe` | Recipe | `nil` | Currently selected craftable recipe. |
| `selected_slot` | number | `1` | Slot index within the recipe list for the selected recipe. |
| `repeat_time` | number | `0.15` | Interval (in seconds) for continuous recipe navigation when holding up/down. |
| `recipe_held` | boolean | `false` | Whether a recipe selection action is being held to repeat craft. |
| `control_held` | boolean | `false` | Whether the crafting key (`CONTROL_OPEN_CRAFTING`) is currently held down. |
| `control_held_time` | number | `0` | Accumulated time (in seconds) that `CONTROL_OPEN_CRAFTING` has been held. |
| `accept_down` | boolean | `false` | Tracks if `CONTROL_PRIMARY` was pressed *before* the crafting window opened. |

## Main functions
### `SelectRecipe(recipe)`
* **Description:** Selects the given recipe, scrolls the list if needed to make it visible, and updates the UI to highlight it.
* **Parameters:** `recipe` (Recipe or string) — the recipe to select.
* **Returns:** `true` (always returns `true` on successful invocation).
* **Error states:** Uses `FindRecipeIndex` to locate the recipe; if not found, defaults to index `1`. Scroll logic ensures the selected recipe falls within the visible slot range.

### `SelectNextRecipe()`
* **Description:** Selects the next recipe in the list of `valid_recipes`.
* **Parameters:** None.
* **Returns:** `true` if a next recipe exists and was selected; `false` otherwise (already at the end).

### `SelectPrevRecipe()`
* **Description:** Selects the previous recipe in the list of `valid_recipes`.
* **Parameters:** None.
* **Returns:** `true` if a previous recipe exists and was selected; `false` otherwise (already at the beginning).

### `OpenRecipeTab()`
* **Description:** Switches to and displays the tab corresponding to `self.tabidx`, applying its filter and learning requirements.
* **Parameters:** None.
* **Returns:** The tab widget (from `CraftTabs`) if successfully opened; `nil` otherwise.

### `OnControl(control, down)`
* **Description:** Handles controller input for the crafting interface (e.g., confirm, hold-to-repeat, or close on extended craft key hold).
* **Parameters:** 
  - `control` (number) — controller input identifier (e.g., `CONTROL_ACCEPT`, `CONTROL_OPEN_CRAFTING`).
  - `down` (boolean) — whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if the control was handled; `nil` otherwise (if not open or not applicable).
* **Error states:** Ignores repeated presses if `control_held_time <= 1`, or skips execution if `recipe_held` was triggered in the same press.

### `OnUpdate(dt)`
* **Description:** Main update loop for handling timed navigation (repeat rate when holding direction) and repeat craft actions.
* **Parameters:** `dt` (number) — delta time since last frame.
* **Returns:** Nothing.
* **Error states:** Returns early if not open, HUD hidden, or crafting is no longer the active screen.

## Events & listeners
None identified.