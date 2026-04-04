---
id: craftingmenu_hud
title: Craftingmenu Hud
description: Manages the HUD interface for the crafting menu, handling recipe visibility, menu open/close states, and controller navigation.
tags: [ui, crafting, hud, menu, widget]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: widgets
source_hash: 1d26e061
system_scope: ui
---

# Craftingmenu Hud

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`CraftingMenuHUD` is a widget that manages the crafting menu interface in the game's HUD system. It controls the visibility and positioning of the crafting menu, tracks which recipes are valid for the player to craft, and handles input for both controller and keyboard/mouse navigation. The widget integrates with `CraftingMenuWidget` for recipe display and `CraftingMenuPinBar` for pinned recipes, listening to various player state events to keep recipe availability current.

## Usage example
```lua
local CraftingMenuHUD = require "widgets/redux/craftingmenu_hud"

-- Create the crafting menu HUD for a player
local owner = ThePlayer
local is_left_aligned = true  -- Normal layout vs split-screen

local craftingHUD = CraftingMenuHUD(owner, is_left_aligned)

-- Open the crafting menu with search focus
craftingHUD:Open(true)

-- Check if menu is open
if craftingHUD:IsCraftingOpen() then
    craftingHUD:Close()
end
```

## Dependencies & tags
**Components used:** None identified (this is a widget, not a component)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity that owns this crafting menu. |
| `is_left_aligned` | boolean | `nil` | Determines menu alignment (`true` for normal/left, `false`/`nil` for split-screen/right). |
| `valid_recipes` | table | `{}` | Cache of all valid recipes and their build states. |
| `is_open` | boolean\|nil | `nil` | Whether the crafting menu is currently open (initially `nil`, becomes `true`/`false` after `Open`/`Close`). |
| `closed_pos` | Vector3 | varies | Screen position when menu is closed. |
| `opened_pos` | Vector3 | varies | Screen position when menu is open. |
| `ui_root` | Widget | `Widget` | Root widget container for the crafting menu UI. |
| `craftingmenu` | CraftingMenuWidget | `CraftingMenuWidget` | The main recipe display widget. |
| `pinbar` | CraftingMenuPinBar | `CraftingMenuPinBar` | The pinned recipes bar widget. |
| `needtoupdate` | boolean\|nil | `nil` | Flag indicating recipes need to be rebuilt. |
| `tech_tree_changed` | boolean\|nil | `nil` | Flag indicating tech tree has changed. |

## Main functions
### Constructor
*   **Description:** Creates a new `CraftingMenuHUD` instance.
*   **Parameters:** `owner` (entity) - The player entity that owns this crafting menu. `is_left_aligned` (boolean, optional) - Determines menu alignment (`true` for normal/left, `false`/`nil` for split-screen/right).
*   **Returns:** `CraftingMenuHUD` instance.

### `IsCraftingOpen()`
*   **Description:** Returns whether the crafting menu is currently open.
*   **Parameters:** None.
*   **Returns:** `boolean|nil` - `true` if menu is open, `false` if closed, `nil` before initialization.

### `Open(search)`
*   **Description:** Opens the crafting menu with optional search focus. Animates the menu into view and enables all child widgets.
*   **Parameters:** `search` (boolean, optional) - If `true`, focuses the search box immediately.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if the menu is already open.

### `Close()`
*   **Description:** Closes the crafting menu. Animates the menu out of view, disables child widgets, and saves the crafting menu profile.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if the menu is already closed.

### `GetRecipeState(recipe_name)`
*   **Description:** Retrieves the cached state data for a specific recipe.
*   **Parameters:** `recipe_name` (string) - The name of the recipe to query.
*   **Returns:** `table` or `nil` - Recipe state data if valid, `nil` otherwise.

### `GetCurrentRecipeState()`
*   **Description:** Gets the data for the currently selected recipe in the details panel.
*   **Parameters:** None.
*   **Returns:** `table` or `nil` - Current recipe data from the details panel.

### `GetCurrentRecipeName()`
*   **Description:** Gets the name and skin of the currently selected recipe.
*   **Parameters:** None.
*   **Returns:** `string|nil`, `string|nil` - Recipe name and skin name (each can be `nil` independently).

### `PopulateRecipeDetailPanel(recipe_name, skin_name)`
*   **Description:** Populates the recipe detail panel with information for a specific recipe and skin.
*   **Parameters:** `recipe_name` (string) - Name of the recipe. `skin_name` (string, optional) - Name of the skin variant.
*   **Returns:** Nothing.

### `Initialize()`
*   **Description:** Initializes or reinitializes the crafting menu. Rebuilds recipes and refreshes child widgets.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `NeedsToUpdate()`
*   **Description:** Checks if the recipe list needs to be updated.
*   **Parameters:** None.
*   **Returns:** `boolean|nil` - `true` if an update is pending.

### `UpdateRecipes()`
*   **Description:** Marks the recipe list for update. The actual rebuild happens in the next `OnUpdate` cycle.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RebuildRecipes()`
*   **Description:** Rebuilds the entire valid recipes cache based on the owner's builder component, tech trees, ingredients, and skin ownership.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RefreshControllers(controller_mode)`
*   **Description:** Updates controller hint text and refreshes child widgets for controller mode.
*   **Parameters:** `controller_mode` (boolean) - Whether controller input is active.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Update loop called each frame. Rebuilds recipes if flagged and refreshes help text.
*   **Parameters:** `dt` (number) - Delta time since last frame.
*   **Returns:** Nothing.

### `RefreshCraftingHelpText()`
*   **Description:** Updates the navigation hint text based on current controller scheme and focus state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles input control events for the crafting menu.
*   **Parameters:** `control` (number) - Control ID. `down` (boolean) - Whether the control is pressed or released.
*   **Returns:** `boolean` - `true` if the control was handled.

### `InvNavToPin(inv_widget, dir_x, dir_y)`
*   **Description:** Navigation helper that finds the closest pin slot widget in a given direction from an inventory widget.
*   **Parameters:** `inv_widget` (Widget) - Starting inventory widget. `dir_x` (number) - X direction vector. `dir_y` (number) - Y direction vector.
*   **Returns:** `Widget` - Closest widget in direction, or page spinner fallback if none found.

### `SelectPin(pin_slot)`
*   **Description:** Selects and activates a pinned recipe slot.
*   **Parameters:** `pin_slot` (number\|nil) - The pin slot index to select.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if menu is open or pin slot has no recipe.

## Events & listeners
- **Listens to:** `playeractivated` - Initializes the crafting menu when player activates.
- **Listens to:** `healthdelta` - Updates recipes when health changes (affects ingredient availability).
- **Listens to:** `sanitydelta` - Updates recipes when sanity changes (affects ingredient availability).
- **Listens to:** `techtreechange` - Updates recipes when tech tree changes.
- **Listens to:** `onactivateskill_client` - Updates recipes when skill is activated.
- **Listens to:** `ondeactivateskill_client` - Updates recipes when skill is deactivated.
- **Listens to:** `localplayer._skilltreeactivatedany` - Updates recipes when any skill tree activates.
- **Listens to:** `itemget` - Updates recipes when player gets an item.
- **Listens to:** `itemlose` - Updates recipes when player loses an item.
- **Listens to:** `newactiveitem` - Updates recipes when active item changes.
- **Listens to:** `stacksizechange` - Updates recipes when item stack size changes.
- **Listens to:** `unlockrecipe` - Updates recipes when a recipe is unlocked.
- **Listens to:** `refreshcrafting` - Forces a crafting menu refresh.
- **Listens to:** `refreshinventory` - Forces an inventory refresh that affects crafting.
- **Listens to:** `LearnBuilderRecipe` - Shows animation when learning a new recipe.
- **Listens to:** `serverpauseddirty` - Updates recipes when server pause state changes.
- **Listens to:** `cancelrefreshcrafting` - Cancels pending recipe update.