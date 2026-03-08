---
id: craftingmenu_details
title: Craftingmenu Details
description: Manages the recipe details panel in the crafting menu UI, rendering recipe information, ingredients, skins, and build controls for the selected recipe.
tags: [ui, crafting, recipe, ingredients, skin]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 21292410
system_scope: ui
---

# Craftingmenu Details

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CraftingMenuDetails` is a UI widget responsible for rendering the detailed view of a selected crafting recipe in the crafting menu. It displays the recipe name, description, favorite status, available skins (via `SkinSelectorUI`), ingredients (via `CraftingMenuIngredients`), and a dynamic build button whose behavior and label depend on build state, controller presence, and skill/prototyper requirements. It integrates with the player’s builder component, skill tree data, and the global crafting menu profile (favorites, buffer settings) to present context-aware UI.

## Usage example
```lua
-- Typically instantiated by the parent crafting menu widget (e.g., CraftingMenu)
local details = CraftingMenuDetails(owner, parent_widget, panel_width, panel_height)

-- To display a specific recipe:
local data = {
    recipe = recipe,
    meta = {
        can_build = true,
        build_state = "build"
    },
    meta = some_recipe_meta
}
details:PopulateRecipeDetailPanel(data, skin_name)
```

## Dependencies & tags
**Components used:**  
- `builder` (via `self.owner.replica.builder`)  
- `skilltreeupdater` (via `self.owner.components.skilltreeupdater:IsValidSkill`)  

**Tags:** Checks `builder_skill` and `PERDOFFERING` on the recipe. No tags added/removed directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | `nil` | The entity (player) for which the crafting details are displayed. |
| `parent_widget` | Widget | `nil` | Parent widget (e.g., `CraftingMenu`). |
| `crafting_hud` | Widget | `nil` | Reference to the HUD’s crafting interface. |
| `panel_width` | number | `nil` | Width of the panel area. |
| `panel_height` | number | `nil` | Height of the panel area. |
| `data` | table | `nil` | Current recipe data (contains `recipe`, `meta`). |
| `build_button_root` | Widget | `nil` | Root container for the build button and teaser text. |
| `ingredients` | CraftingMenuIngredients | `nil` | Ingredient list sub-widget. |
| `skins_spinner` | SkinSelectorUI | `nil` | Skin selection sub-widget. |
| `fav_button` | ImageButton | `nil` | Favorite toggle button. |
| `namestring` | Text | `nil` | Recipe name display text. |
| `first_sub_ingredient_to_craft` | table | `nil` | First missing sub-ingredient needed for build/prototype chain. |

## Main functions
### `OnControl(control, down)`
*   **Description:** Handles control inputs passed to the widget; delegates to base class first. Currently unused beyond base behavior.
*   **Parameters:** `control` (string) — control identifier; `down` (boolean) — whether the control is pressed.
*   **Returns:** `true` if handled by base; otherwise `false`.

### `_GetHintTextForRecipe(player, recipe)`
*   **Description:** Determines the appropriate hint message string (e.g., `NEEDSCIENCEMACHINE`) based on the recipe’s level requirements and the player’s tech bonuses. Falls back to `recipe.hint_msg` or `"CANTRESEARCH"`.
*   **Parameters:**  
  - `player` (Entity) — the player entity.  
  - `recipe` (table) — the recipe object with `level` and optionally `hint_msg`.  
*   **Returns:** `string` — hint key (e.g., `"NEEDSSCIENCEMACHINE"`).
*   **Error states:** Uses `CanPrototypeRecipe` and `TUNING.PROTOTYPER_TREES`; returns `"CANTRESEARCH"` if no valid prototyper matches.

### `UpdateBuildButton(from_pin_slot)`
*   **Description:** Updates the build button and teaser text based on build state (`hint`, `hide`, `build`, `prototype`, `buffered`), ingredient availability, skill requirements, and controller presence. Supports both keyboard/mouse and controller workflows. Sets `first_sub_ingredient_to_craft` if applicable.
*   **Parameters:** `from_pin_slot` (table or `nil`) — optional pin-slot data used for controller hint filtering.
*   **Returns:** `nil`.
*   **Error states:** No-op if `self.data == nil`. Uses localized strings from `STRINGS.UI.CRAFTING` based on state.

### `_MakeBuildButton()`
*   **Description:** Constructs and configures the build button widget, including hold, click, and on-hide handlers for recipe crafting and buffer logic. Sets `recipe_held`, `last_recipe_click`, and scaling.
*   **Parameters:** None.
*   **Returns:** `Widget` — root container with `teaser` (Text) and `button` (ImageButton).

### `Refresh()`
*   **Description:** Reapplies the currently displayed recipe data and skin selection by calling `PopulateRecipeDetailPanel`.
*   **Parameters:** None.
*   **Returns:** `nil`.

### `RefreshControllers(controller_mode)`
*   **Description:** Delegates controller refresh to the skins spinner (if present).
*   **Parameters:** `controller_mode` (boolean) — whether controller mode is active.
*   **Returns:** `nil`.

### `UpdateNameString()`
*   **Description:** Updates the recipe name display, appending limited-amount info if applicable.
*   **Parameters:** None.
*   **Returns:** `nil`.

### `PopulateRecipeDetailPanel(data, skin_name)`
*   **Description:** Main population method: builds or refreshes the entire recipe details panel. Handles recipe name, description, favorite button, skins selector, ingredients list, and build button. Supports modder-defined `custom_craftingmenu_details_fn` on the recipe for custom rendering.
*   **Parameters:**  
  - `data` (table or `nil`) — recipe and metadata (must include `recipe`, `meta`).  
  - `skin_name` (string or `nil`) — selected skin name. |
*   **Returns:** `nil`.
*   **Error states:** Returns early if `custom_craftingmenu_details_fn` is defined (calls modder function instead). Does not rebuild if `data` and `skin_name` match current state.

## Events & listeners
- **Listens to:** None explicitly (relies on external event-driven refreshes, e.g., via `owner:PushEvent("refreshcrafting")` in favorite toggle).
- **Pushes:**  
  - `refreshcrafting` — fired by favorite toggle to trigger UI updates elsewhere.  
- **Callback registration:**  
  - Favorite button registers `SetOnClick` → fires `owner:PushEvent("refreshcrafting")`.  
  - Build button registers `SetOnClick` → calls `DoRecipeClick(...)` (external function).