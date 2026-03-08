---
id: craftingmenu_hud
title: Craftingmenu Hud
description: Manages the UI overlay and navigation for the crafting menu, handling state transitions, recipe updates, and input routing for the HUD.
tags: [crafting, ui, navigation, controller, inventory]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: b1f0ec2c
system_scope: ui
---

# Craftingmenu Hud

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CraftingMenuHUD` is a top-level widget component responsible for managing the entire crafting menu interface overlay. It integrates the main `CraftingMenuWidget`, pinbar, and navigation hint system, handling open/close animations, recipe validity tracking, and controller-specific input routing. It listens to game events (e.g., health/sanity changes, skill activation, item gain/loss) to dynamically update the list of available recipes.

## Usage example
```lua
local owner = ThePlayer
local hud = CraftingMenuHUD(owner, true) -- left-aligned for player 1
hud:Open()
-- ... user interacts via UI ...
hud:Close()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `ThePlayer`, `TheInput`, `TheFrontEnd`, `TheWorld`, `Profile`; uses `owner.replica.health`, `owner.replica.sanity`, `owner.replica.builder`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The player entity that owns this crafting HUD. |
| `is_left_aligned` | boolean | `nil` | Layout orientation (`true` = normal/left, `false` = split-screen right). |
| `valid_recipes` | table | `{}` | Stores recipe validity metadata (`can_build`, `build_state`, `limitedamount`) keyed by recipe name. |
| `is_open` | boolean | `false` | Whether the crafting menu is currently visible. |
| `needtoupdate` | boolean | `false` | Flag indicating recipes require re-evaluation. |
| `tech_tree_changed` | boolean | `false` | Flag indicating tech tree changes require full refresh. |
| `ui_root` | `Widget` | — | Root UI container widget. |
| `craftingmenu` | `CraftingMenuWidget` | — | Main crafting list widget. |
| `pinbar` | `CraftingMenuPinBar` | — | Pin bar widget for quick-access items. |
| `nav_hint` | `Text` | — | On-screen hint for controller navigation. |
| `openhint` | `Text` | — | Key hint text (e.g., "Press X to craft"). |
| `closed_pos` | `Vector3` | `Vector3(0, y_offset, 0)` | Screen position when menu is closed. |
| `opened_pos` | `Vector3` | `Vector3(530, y_offset, 0)` | Screen position when menu is open. |

## Main functions
### `IsCraftingOpen()`
*   **Description:** Returns whether the crafting menu is currently visible.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if the menu is open, otherwise `false`.

### `Open(search)`
*   **Description:** Animates and enables the crafting menu, sets up focus and input mode, and plays opening sound.
*   **Parameters:** `search` (boolean, optional) — if `true`, opens directly into search mode.
*   **Returns:** Nothing.
*   **Error states:** No-op if menu is already open.

### `Close()`
*   **Description:** Animates and disables the crafting menu, resets input mode, saves profile, and plays closing sound.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if menu is already closed.

### `GetRecipeState(recipe_name)`
*   **Description:** Retrieves the validity metadata for a specific recipe.
*   **Parameters:** `recipe_name` (string) — the name of the recipe.
*   **Returns:** `table` or `nil` — metadata table containing `recipe`, `meta` (with `can_build`, `build_state`, `limitedamount`), or `nil` if unknown.

### `GetCurrentRecipeState()`
*   **Description:** Returns metadata of the currently selected recipe in the details panel.
*   **Parameters:** None.
*   **Returns:** `table` or `nil` — data stored in `craftingmenu.details_root.data`, or `nil` if no recipe selected.

### `GetCurrentRecipeName()`
*   **Description:** Returns the name and skin of the currently selected recipe.
*   **Parameters:** None.
*   **Returns:** `string` or `nil`, `string` or `nil` — recipe name, and optional skin name.

### `PopulateRecipeDetailPanel(recipe_name, skin_name)`
*   **Description:** Updates the details panel with the specified recipe and skin.
*   **Parameters:**  
    *   `recipe_name` (string) — name of the recipe to display.  
    *   `skin_name` (string, optional) — selected skin variant.
*   **Returns:** Nothing.

### `Initialize()`
*   **Description:** Initializes or resets the entire HUD state: rebuilds recipes, initializes subwidgets, and clears dirty flags.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `NeedsToUpdate()`
*   **Description:** Checks whether recipe data requires rebuilding.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `needtoupdate` is set.

### `UpdateRecipes()`
*   **Description:** Sets the `needtoupdate` flag to trigger a deferred recipe refresh.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RebuildRecipes()`
*   **Description:** Recalculates validity metadata for all recipes based on builder state, tech trees, ingredients, and limits.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RefreshControllers(controller_mode)`
*   **Description:** Updates UI elements for controller vs keyboard/mouse mode (e.g., hints, control schemes).
*   **Parameters:** `controller_mode` (boolean) — `true` if a controller is attached.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called per-frame; triggers recipe refresh if flagged and updates navigation hints.
*   **Parameters:** `dt` (number) — delta time since last frame.
*   **Returns:** Nothing.

### `RefreshCraftingHelpText()`
*   **Description:** Updates the navigation hint (`nav_hint`) with context-aware control labels (e.g., stick/dpad mappings).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `InvNavToPin(inv_widget, dir_x, dir_y)`
*   **Description:** Calculates the closest pin slot in the pinbar given a direction from an inventory widget.
*   **Parameters:**  
    *   `inv_widget` (Widget) — source inventory widget.  
    *   `dir_x`, `dir_y` (numbers) — navigation direction vector.
*   **Returns:** `Widget` or `nil` — closest pin slot or page spinner; `nil` if none found.

### `SelectPin(pin_slot)`
*   **Description:** Triggers crafting for a pinned recipe slot (if menu is closed).
*   **Parameters:** `pin_slot` (number) — index of the pin slot (1-based).
*   **Returns:** Nothing.
*   **Error states:** No-op if menu is open or pin slot is invalid.

## Events & listeners
- **Listens to:**
    *   `playeractivated` — triggers `Initialize()`.
    *   `healthdelta` — updates recipes when owner’s health changes significantly (via `UpdateRecipesForHealthIngredients`).
    *   `sanitydelta` — updates recipes when owner’s sanity changes significantly (via `UpdateRecipesForSanityIngredients`).
    *   `techtreechange` — flags tech tree change and triggers `UpdateRecipes()`.
    *   `onactivateskill_client`, `ondeactivateskill_client`, `localplayer._skilltreeactivatedany` — triggers `event_UpdateRecipes()`.
    *   `itemget`, `itemlose`, `newactiveitem`, `stacksizechange`, `unlockrecipe`, `refreshcrafting`, `refreshinventory` — triggers `event_UpdateRecipes()`.
    *   `LearnBuilderRecipe` — triggers `OnLearnNewRecipe()` (spawns particle FX for learned recipe).
    *   `serverpauseddirty` — triggers `event_UpdateRecipes()` (if `TheWorld` exists).
    *   `cancelrefreshcrafting` — sets `needtoupdate = false`.
- **Pushes:** None.