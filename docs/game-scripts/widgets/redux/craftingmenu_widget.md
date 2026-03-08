---
id: craftingmenu_widget
title: Craftingmenu Widget
description: Manages the UI layout, filtering, sorting, searching, and rendering of the crafting menu interface in DST.
tags: [ui, crafting, filtering, sorting, search]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: bd8adb1d
system_scope: ui
---

# Craftingmenu Widget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CraftingMenuWidget` is a high-level UI widget that implements the full crafting interface panel — including filter buttons, recipe grids, sorting modes, search functionality, and detail panels. It manages user interaction with recipes, filters by crafting station or category, sorts recipes using pluggable sorters, and handles focus navigation for keyboard/controller inputs. It operates in coordination with `CraftingMenuDetails`, `RecipeTile`, `IngredientUI`, and various HUD components (`crafting_hud`, `pinbar`), leveraging replicated data from `owner.replica.builder`.

## Usage example
```lua
local crafting_hud = ThePlayer.HUD.crafting_hud
local height = 400
local widget = CraftingMenuWidget(ThePlayer, crafting_hud, height)

-- Initialize and select default filter
widget:Initialize()

-- Open the menu and restore focus state
widget:OnCraftingMenuOpen(true)

-- Refresh when the crafting state changes (e.g., inventory update)
widget:Refresh(true)
```

## Dependencies & tags
**Components used:** `builder` (`owner.replica.builder` via `GetCurrentPrototyper`, `IsFreeBuildMode`)
**Tags:** No tags added/removed by this component. Filter buttons and widgets interact with `TheCraftingMenuProfile` (profile persists sort mode, favorites), but no `inst:AddTag`/`RemoveTag` calls occur.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `ent` | `nil` | The player entity that owns the crafting menu. |
| `crafting_hud` | `crafting_hud` component | `nil` | Reference to the HUD’s crafting state and components (pinbar, root, etc.). |
| `sort_class` | sort class instance | `DefaultSort` | Current recipe sorter instance. |
| `sort_modes` | array of tables | Array of 4 mode definitions | Supported sorting modes: `DEFAULT`, `CRAFTABLE`, `FAVORITE`, `NAME`. |
| `sort_mode` | number | `1` | Index of the currently active sort mode. |
| `root` | `Widget` | — | Root container widget for the menu frame and children. |
| `filter_panel` | `Widget` | — | Panel housing filter buttons, search box, and sort button. |
| `filter_buttons` | map (name → `Widget`) | `{}` | Maps filter names to their corresponding UI buttons. |
| `current_filter_name` | string | `nil` | Name of the currently selected filter (e.g., `"TOOLS"`, `"CRAFTING_STATION"`). |
| `filtered_recipes` | array | `{}` | List of recipe data tables after filtering and sorting. |
| `recipe_grid` | `ScrollingGrid` | — | Grid widget that displays the filtered recipes. |
| `details_root` | `CraftingMenuDetails` | — | Detail panel that shows recipe information and skins. |
| `search_text` | string | `""` | Current text in the search box. |
| `last_search_text` | string | `""` | Previous search text (used for incremental search optimization). |
| `searched_recipes` | map (recipe name → boolean) | `{}` | Cache indicating whether a recipe matches the current search. |
| `last_searched_recipes` | map | `{}` | Previous search cache (used during incremental search). |
| `search_delay` | number | `0` | Countdown (in seconds) before continuing incremental search processing. |
| `current_recipe_search` | string or `nil` | `nil` | Key into `AllRecipes` for the current incremental search step. |
| `pre_station_selection` | table or `nil` | `nil` | Stores previous selection state when transitioning to/from a crafting station. |
| `grid_button_space` | number | computed | Horizontal spacing between filter buttons. |
| `grid_left` | number | computed | Left offset for filter button grid alignment. |
| `event_layout` | boolean | `false` | Whether special-event filter button should be visible. |

## Main functions
### `Initialize()`
* **Description:** Initializes the menu by updating filter buttons, selecting the default filter (`TOOLS`), populating the detail panel, and performing an initial refresh. Typically called when the menu is first constructed.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartSearching(clear_text)`
* **Description:** Activates the search box for text input. Optionally clears the current text before activating.
* **Parameters:** `clear_text` (boolean) — if `true`, clears the search box text before enabling editing.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles controller input for navigation and actions. Delegates control to the skins spinner or recipe grid if they have focus and no special handling is needed, and then falls back to base widget handling.
* **Parameters:** 
  * `control` (VIRTUAL_CONTROL) — the control code pressed.
  * `down` (boolean) — whether the control is pressed (vs. released).
* **Returns:** `true` if input was handled; otherwise `false`.

### `DoFocusHookups()`
* **Description:** Configures focus navigation (arrow key/controller) between the filter panel, recipe grid, and pinbar. Implements smart focus movement (e.g., up/down from filter to recipe grid, lateral movement to pinbar or adjacent filter buttons).
* **Parameters:** None.
* **Returns:** Nothing.

### `PopulateRecipeDetailPanel(recipe, skin_name)`
* **Description:** Passes a recipe and optional skin name to the `CraftingMenuDetails` panel to display details.
* **Parameters:** 
  * `recipe` (recipe table or `nil`) — recipe data to display.
  * `skin_name` (string or `nil`) — selected skin name, if any.
* **Returns:** Nothing.

### `ApplyFilters()`
* **Description:** Re-runs filtering logic on all valid recipes based on current filter, crafting station context, and visibility flags (`hide`, `hint`, etc.). Updates `filtered_recipes` array. Also triggers a grid refresh if the menu is open.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateFilterButtons()`
* **Description:** Updates visual state (icon, background tint, prototype badge, count badge) for all filter buttons based on recipe availability. Returns whether the recipe detail panel list requires rebuilding (e.g., due to recipes becoming hidden/shown).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the recipe details list changed visibility for any recipe.

### `Refresh(tech_tree_changed)`
* **Description:** Triggers a full UI refresh: updates filter buttons, and if the sorter’s `Refresh()` returns `false`, re-applies filters or refreshes the recipe grid view. Also refreshes the detail panel.
* **Parameters:** `tech_tree_changed` (boolean) — if `true`, forces re-entry to the crafting menu with focus restored.
* **Returns:** Nothing.

### `RefreshControllers(controller_mode)`
* **Description:** Updates controller-specific button overrides for the recipe grid (e.g., for keyboard/controller mapping differences). When `controller_mode` is `true`, it maps up/down controls.
* **Parameters:** `controller_mode` (boolean) — whether the UI is currently in controller mode.
* **Returns:** Nothing.

### `RefreshCraftingHelpText(controller_id)`
* **Description:** Returns localized help text describing current control hints (e.g., pin/favorite actions) based on which element has focus (recipe grid or filter panel).
* **Parameters:** `controller_id` (number) — controller index (used for localized control labels).
* **Returns:** `string` — help text (e.g., `"Space PIN"`, `"Enter SELECT"`).

### `OnUpdate(dt)`
* **Description:** Incrementally processes recipe validation for the current search text, processing up to 30 recipes per frame to avoid frame hiccups. Stops automatically when all recipes have been evaluated.
* **Parameters:** `dt` (number) — time since last frame.
* **Returns:** Nothing.

### `UpdateRecipeGrid(set_focus)`
* **Description:** Updates the recipe grid content with `filtered_recipes`, scrolls to and focuses the previously selected recipe if possible, and hides/shows the “no items” message.
* **Parameters:** `set_focus` (boolean) — if `true`, attempts to restore focus to the previously selected recipe.
* **Returns:** Nothing.

### `OnCraftingMenuOpen(set_focus)`
* **Description:** Called when the crafting menu opens. Handles restoration of previous selection (e.g., after moving between general and crafting-station contexts), and sets initial filter/recipe/skin focus. Used to preserve context on menu reopen.
* **Parameters:** `set_focus` (boolean) — if `true`, restores focus to the last-visited recipe or grid.
* **Returns:** Nothing.

### `SetSearchText(search_text)`
* **Description:** Updates the search text and resets the incremental search state. Triggers a new search cycle with a small delay to debounce input.
* **Parameters:** `search_text` (string) — search query (normalized to lowercase, trimmed, spaces/periods removed).
* **Returns:** Nothing.

### `ValidateRecipeForSearch(name)`
* **Description:** Evaluates whether a recipe matches the current search query by matching product name, in-game name, or description using a case-insensitive substring search. Updates `searched_recipes` and can reuse previous cache for incremental changes.
* **Parameters:** `name` (string) — recipe name (key in `AllRecipes`).
* **Returns:** Nothing.

### `IsRecipeValidForSearch(name)`
* **Description:** Returns whether a recipe name is cached as a valid match for the current search.
* **Parameters:** `name` (string) — recipe name.
* **Returns:** `boolean` — `true` if the recipe matches the search, `false` otherwise.

### `SelectFilter(name, clear_search_text)`
* **Description:** Changes the active filter tab, updates the UI, and re-applies filters. Optionally clears the search box.
* **Parameters:** 
  * `name` (string or `nil`) — filter name (e.g., `"CRAFTING_STATION"`, `"TOOLS"`); defaults to `"EVERYTHING"` if invalid or missing.
  * `clear_search_text` (boolean) — if `true`, clears the search text.
* **Returns:** Nothing.

### `AddSorter()`
* **Description:** Creates and returns the sort-mode toggle button. On click, cycles to the next sort mode and updates `sort_class`, `sort_mode`, and filters.
* **Parameters:** None.
* **Returns:** `Widget` — a button widget configured for sorting mode selection.

## Events & listeners
- **Listens to:** None (this widget does not register `inst:ListenForEvent` handlers).
- **Pushes:** `refreshcrafting` — fired on `SetOnClick` of a recipe cell when a buffered build is completed, to update the HUD after free crafting.