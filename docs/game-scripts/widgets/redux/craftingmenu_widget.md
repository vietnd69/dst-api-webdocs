---
id: craftingmenu_widget
title: Craftingmenu Widget
description: Manages the crafting menu UI interface including filtering, sorting, searching, and displaying craftable recipes.
tags: [ui, crafting, menu, widgets, redux]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: widgets
source_hash: 32539c5a
system_scope: ui
---

# Craftingmenu Widget

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`CraftingMenuWidget` is a Redux UI widget that manages the crafting menu interface in Don't Starve Together. It handles recipe filtering by category, sorting by various criteria (default, craftable, favorite, name), text-based search functionality, and displays recipe details alongside a scrollable grid of craftable items. The widget integrates with the player's builder component to determine recipe availability and build states.

## Usage example
```lua
local CraftingMenuWidget = require "widgets/redux/craftingmenu_widget"

local owner = ThePlayer
local crafting_hud = owner.HUD.crafting_hud
local menu_height = 600

local crafting_menu = CraftingMenuWidget(owner, crafting_hud, menu_height)
crafting_menu:Initialize()
crafting_menu:SelectFilter(CRAFTING_FILTERS.TOOLS.name, true)
crafting_menu:Refresh()
```

## Dependencies & tags
**Components used:** `builder` (via `owner.replica.builder`)
**Required modules:** `widgets/image`, `widgets/imagebutton`, `widgets/widget`, `widgets/text`, `widgets/grid`, `widgets/spinner`, `widgets/uianim`, `widgets/redux/templates`, `widgets/ingredientui`, `widgets/redux/craftingmenu_details`, `widgets/recipetile`, `util`, `crafting_sorting`
**Tags:** References `CRAFTING_FILTERS`, `SortTypes`, `RecipeTile`, `CraftingMenuDetails`, `TEMPLATES`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity that owns this crafting menu widget. |
| `crafting_hud` | widget | `nil` | Reference to the parent crafting HUD widget. |
| `sort_class` | table | `SortTypes.DefaultSort` | Current sorting class instance for recipe ordering. |
| `sort_modes` | table | `table with 4 sort mode configurations` | Table of available sort mode configurations (DEFAULT, CRAFTABLE, FAVORITE, NAME) with icons and classes. |
| `sort_mode` | number | `1` | Current sort mode index (1-based). |
| `current_filter_name` | string | `nil` | Name of the currently active recipe filter category. |
| `filtered_recipes` | table | `{}` | Array of recipe data objects after applying current filters. |
| `filter_buttons` | table | `{}` | Map of filter name to filter button widget instances. |
| `search_text` | string | `""` | Current search query text (trimmed and lowercased). |
| `last_search_text` | string | `""` | Previous search query for incremental search optimization. |
| `searched_recipes` | table | `{}` | Cache of recipe names mapped to search match results. |
| `recipe_grid` | widget | `nil` | The scrolling grid widget displaying recipe tiles. |
| `details_root` | widget | `nil` | The `CraftingMenuDetails` widget showing selected recipe info. |
| `search_box` | widget | `nil` | The search text input widget. |
| `search_delay` | number | `0` | Cooldown timer for search processing to prevent lag. |
| `filter_panel` | widget | `nil` | Container widget for filter buttons and search box. |
| `no_recipes_msg` | widget | `nil` | Text widget shown when no recipes match current filters. |

## Main functions
### `Initialize()`
*   **Description:** Initializes the widget state, selects the default filter (TOOLS), populates the recipe detail panel, and triggers a refresh. Called after construction to set up the initial display.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartSearching(clear_text)`
*   **Description:** Activates the search box for text input. Optionally clears existing search text before focusing.
*   **Parameters:** `clear_text` (boolean) - If true, clears the search box content before focusing.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles controller and keyboard input for the crafting menu. Processes focus navigation between skins spinner, recipe grid, and base widget controls.
*   **Parameters:** `control` (number) - Control input code. `down` (boolean) - Whether the control is pressed or released.
*   **Returns:** `boolean` - True if the control was handled, false otherwise.

### `DoFocusHookups()`
*   **Description:** Configures controller focus navigation between filter panel, recipe grid, pinbar, and top row widgets. Uses `GetClosestWidget` to determine focus direction based on spatial relationships.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `PopulateRecipeDetailPanel(recipe, skin_name)`
*   **Description:** Updates the recipe details panel with information about a specific recipe and optionally selects a skin variant.
*   **Parameters:** `recipe` (table) - Recipe data object. `skin_name` (string or nil) - Optional skin identifier for the recipe item.
*   **Returns:** Nothing.

### `ApplyFilters()`
*   **Description:** Filters the complete recipe list based on current filter name, search text, build state, crafting station compatibility, and sort class. Updates `filtered_recipes` table and refreshes the recipe grid.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** May produce empty `filtered_recipes` if no recipes match current criteria.

### `UpdateFilterButtons()`
*   **Description:** Updates the visual state of all filter buttons based on recipe availability, prototype status, and buffered builds. Shows/hides crafting station filter and mods filter based on context. Returns whether the details list needs rebuilding.
*   **Parameters:** None.
*   **Returns:** `boolean` - True if recipe state changes require rebuilding the details list.

### `Refresh(tech_tree_changed)`
*   **Description:** Refreshes the entire crafting menu. Updates filter buttons, applies sorting refresh if available, rebuilds filters if recipe states changed, and updates the details panel.
*   **Parameters:** `tech_tree_changed` (boolean) - Whether the technology tree has changed since last refresh.
*   **Returns:** Nothing.

### `RefreshControllers(controller_mode)`
*   **Description:** Updates controller button overrides for the recipe grid based on whether controller mode is active.
*   **Parameters:** `controller_mode` (boolean) - True if controller input is active.
*   **Returns:** Nothing.

### `RefreshCraftingHelpText(controller_id)`
*   **Description:** Returns contextual help text for controller prompts based on current focus state (recipe grid or filter panel).
*   **Parameters:** `controller_id` (number) - Controller identifier for localized control names.
*   **Returns:** `string` - Help text to display, or empty string if no context.

### `OnUpdate(dt)`
*   **Description:** Update loop handler that processes recipe search validation incrementally (up to 30 recipes per frame) to prevent performance spikes. Manages `search_delay` cooldown.
*   **Parameters:** `dt` (number) - Delta time since last frame.
*   **Returns:** Nothing.

### `UpdateRecipeGrid(set_focus)`
*   **Description:** Rebuilds the recipe grid with filtered recipes. Preserves focus on previously selected recipe if possible, scrolls to maintain position, and shows/hides the "no recipes" message.
*   **Parameters:** `set_focus` (boolean) - Whether to set keyboard/controller focus on the grid.
*   **Returns:** Nothing.

### `OnCraftingMenuOpen(set_focus)`
*   **Description:** Called when the crafting menu opens. Handles filter selection based on crafting station context, preserves previous selection when switching stations, and sets focus on appropriate recipe.
*   **Parameters:** `set_focus` (boolean) - Whether to set focus on a recipe item.
*   **Returns:** Nothing.

### `SelectFilter(name, clear_search_text)`
*   **Description:** Changes the active recipe filter category. Updates button selection state, clears search text if requested, and reapplies filters.
*   **Parameters:** `name` (string or nil) - Filter category name from `CRAFTING_FILTERS`. Defaults to "EVERYTHING" if invalid. `clear_search_text` (boolean) - Whether to clear search box on filter change.
*   **Returns:** Nothing.

### `SetSearchText(search_text)`
*   **Description:** Updates the search query and invalidates the search cache. Triggers incremental search processing via `OnUpdate`.
*   **Parameters:** `search_text` (string) - Raw search input (will be trimmed, lowercased, and spaces/periods removed).
*   **Returns:** Nothing.
*   **Error states:** Returns early if search text matches `last_search_text`.

### `OnFavoriteChanged(recipe_name, is_favorite_recipe)`
*   **Description:** Called when a recipe's favorite status changes. Notifies the sort class to update ordering if it supports favorite-based sorting.
*   **Parameters:** `recipe_name` (string) - Name of the recipe that changed. `is_favorite_recipe` (boolean) - New favorite status.
*   **Returns:** Nothing.

### `UpdateEventButtonLayout()`
*   **Description:** Updates the layout of filter buttons based on special event status. Shows/hides special event filter and adjusts search box width accordingly.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ValidateRecipeForSearch(name)`
*   **Description:** Validates whether a recipe matches the current search text. Uses incremental search optimization by caching results and comparing with previous search text.
*   **Parameters:** `name` (string) - Recipe name to validate against current search query.
*   **Returns:** Nothing (updates `searched_recipes` cache).

### `IsRecipeValidForSearch(name)`
*   **Description:** Checks if a recipe is valid for the current search query. Calls `ValidateRecipeForSearch` if not yet cached.
*   **Parameters:** `name` (string) - Recipe name to check.
*   **Returns:** `boolean` - True if recipe matches search criteria or search is empty.

### `MakeFrame(width, height)`
*   **Description:** Constructs the main crafting menu frame with all child widgets including filter panel, recipe grid, details panel, and decorative borders.
*   **Parameters:** `width` (number) - Frame width. `height` (number) - Frame height.
*   **Returns:** `widget` - The constructed frame widget.

### `MakeFilterPanel(width)`
*   **Description:** Creates the filter panel containing filter buttons, search box, sort button, and filter grid.
*   **Parameters:** `width` (number) - Panel width.
*   **Returns:** `widget` - The constructed filter panel widget.

### `MakeFilterButton(filter_def, button_size)`
*   **Description:** Creates an individual filter button widget with icon, background, and prototype indicator.
*   **Parameters:** `filter_def` (table) - Filter definition table. `button_size` (number) - Button size in pixels.
*   **Returns:** `widget` - The constructed filter button widget.

### `MakeSearchBox(box_width, box_height)`
*   **Description:** Creates the search text input widget with hover text and input handling.
*   **Parameters:** `box_width` (number) - Search box width. `box_height` (number) - Search box height.
*   **Returns:** `widget` - The constructed search box widget.

### `MakeRecipeList(width, height)`
*   **Description:** Creates the scrolling grid widget that displays recipe tiles with proper cell rendering and focus handling.
*   **Parameters:** `width` (number) - List width. `height` (number) - List height.
*   **Returns:** `widget` - The constructed recipe grid widget.

### `AddSorter()`
*   **Description:** Creates the sort mode toggle button that cycles through available sorting options (DEFAULT, CRAFTABLE, FAVORITE, NAME).
*   **Parameters:** None.
*   **Returns:** `widget` - The constructed sort button widget.

## Internal helper functions
The following internal functions support the widget's filtering and search logic:

- **`GetClosestWidget(list, active_widget, dir_x, dir_y)`** - Finds the closest widget in a given direction for controller focus navigation.
- **`trim_spaces_and_periods(str)`** - Removes spaces and periods from a string for search normalization.
- **`search_exact_match(search, str)`** - Performs exact substring matching for search queries.
- **`text_filter(recipe, search_str)`** - Filters recipes by matching search text against name, product, and description.
- **`IsRecipeValidForFilter(self, recipename, filter_recipes)`** - Checks if a recipe is valid for the current filter category.
- **`IsRecipeValidForStation(self, recipe, station, current_filter)`** - Checks if a recipe is valid for the current crafting station.
- **`UpdateFGCount(fgcount, meta)`** - Updates the foreground count text display on recipe tiles based on limited amount metadata.

## Events & listeners
- **Listens to:** None directly registered via `ListenForEvent`. Input handled through `OnControl` and widget focus system.
- **Pushes:** `refreshcrafting` - Fired on owner entity after successful recipe build action (used primarily for free crafting mode).