---
id: craftingmenu_pinslot
title: Craftingmenu Pinslot
description: Manages a pinned recipe slot in the crafting menu, handling recipe assignment, UI rendering, input, and interaction with recipe details and crafting logic.
tags: [ui, crafting, input, inventory]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 2c202322
system_scope: ui
---

# Craftingmenu Pinslot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PinSlot` is a UI widget component that represents a single pinned slot in the crafting menu. It displays pinned recipes, renders visual state (e.g., buffered, prototype, missing ingredients), handles user input (mouse, keyboard, and controller), and synchronizes with the recipe detail panel and crafting system. It integrates with `CraftingMenuIngredients` for displaying recipe sub-ingredients and leverages `RecipeTile.sSetImageFromRecipe` for rendering the recipe icon. The component does not own the underlying recipe data but fetches it dynamically from the `craftingmenu` owner.

## Usage example
```lua
local pin_slot = PinSlot(owner, craftingmenu, slot_index, pin_data)
owner.craftingmenu.pin_slots[slot_index] = pin_slot
-- Later, to update the pinned recipe:
pin_slot:SetRecipe("torch", "default")
-- Or to remove it:
pin_slot:SetRecipe(nil, nil)
```

## Dependencies & tags
**Components used:** `builder` (via `owner.replica.builder`), `inventory` (via `owner.replica.inventory`)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity (typically a player) that owns this crafting menu and can build recipes. |
| `craftingmenu` | `CraftingMenu` | `nil` | Reference to the parent crafting menu widget. |
| `slot_num` | number | `0` | Zero-based index of this slot in the crafting menu. |
| `recipe_name` | string or `nil` | `nil` | Name of the currently pinned recipe prefab. |
| `skin_name` | string or `nil` | `nil` | Optional skin identifier for the recipe. |
| `craft_button` | `ImageButton` | — | Main interactive button for the slot. |
| `unpin_button` | `ImageButton` | — | Visual button to unpin the recipe (controller-only in some modes). |
| `unpin_button_bg` | `Image` | — | Background for the unpin button. |
| `unpin_controllerhint` | `Text` | — | Localized control hint for unpinning (e.g., "X UNPIN"). |
| `item_img` | `Image` | — | Image widget rendering the recipe icon. |
| `fg` | `Image` | — | Foreground overlay (e.g., prototype lock or badge). |
| `fgcount` | `Text` | — | Text displaying limited-build count. |
| `recipe_popup` | `Widget` | — | Popup showing ingredient list when hovered/focused. |

## Main functions
### `PinSlot(recipe_name, skin_name)`
* **Description:** Constructor. Initializes the UI elements for the slot, configures textures, buttons, and callbacks, and sets up controller/hint behavior. The `pin_data` parameter may be `nil`.
* **Parameters:**
  * `owner` (`Entity`) — Entity the slot serves.
  * `craftingmenu` (`CraftingMenu`) — Parent crafting menu instance.
  * `slot_num` (`number`) — Index of this slot.
  * `pin_data` (`table` or `nil`) — Table containing `recipe_name` and `skin_name`.
* **Returns:** None.

### `SetRecipe(recipe_name, skin_name)`
* **Description:** Assigns a new recipe and skin to this slot, updates the profile, and refreshes all visuals. Automatically calls `Refresh()` and `OnGainFocus()`.
* **Parameters:**
  * `recipe_name` (`string` or `nil`) — Recipe prefab name.
  * `skin_name` (`string` or `nil`) — Skin identifier.
* **Returns:** None.

### `Refresh()`
* **Description:** Updates visual state (textures, images, overlays) based on the current recipe’s `meta.build_state`. Handles states such as `buffered`, `prototype`, `can_build`, `missing_mats`, `hint`, etc. Also updates help text and shows/hides sub-recipe popups.
* **Parameters:** None.
* **Returns:** None.

### `HasRecipe()`
* **Description:** Checks whether this slot currently has a pinned recipe.
* **Parameters:** None.
* **Returns:** `true` if `recipe_name` is non-`nil`, otherwise `false`.

### `OnGainFocus()`
* **Description:** Triggered when the slot gains focus (e.g., via keyboard/controller navigation). Updates visibility of unpin button and controller hints. Adjusts help text based on context (e.g., current recipe selection).
* **Parameters:** None.
* **Returns:** None.

### `OnLoseFocus()`
* **Description:** Triggered when the slot loses focus. Hides unpin elements and hides the recipe popup.
* **Parameters:** None.
* **Returns:** None.

### `OnPageChanged(data)`
* **Description:** Called when the crafting menu page changes. If `data` is non-`nil`, it sets the recipe using `data.recipe_name` and `data.skin_name`. Otherwise, it clears the slot (depending on whether the menu is open).
* **Parameters:**
  * `data` (`table` or `nil`) — May contain `recipe_name` and `skin_name`.
* **Returns:** None.

### `RefreshControllers(controller_mode, for_open_crafting_menu)`
* **Description:** Reconfigures control bindings and hint visibility based on controller mode and whether the menu is open.
* **Parameters:**
  * `controller_mode` (`boolean`) — `true` if controller is attached.
  * `for_open_crafting_menu` (`boolean`) — Whether the menu is actively open.
* **Returns:** None.

### `GetPrevSkin(cur_skin)`
* **Description:** Returns the previous owned skin of the pinned recipe (using `GetPrevOwnedSkin`).
* **Parameters:**
  * `cur_skin` (`string`) — Current skin name.
* **Returns:** `string` — Previous skin name or `cur_skin` if unavailable.

### `GetNextSkin(cur_skin)`
* **Description:** Returns the next owned skin of the pinned recipe (using `GetNextOwnedSkin`).
* **Parameters:**
  * `cur_skin` (`string`) — Current skin name.
* **Returns:** `string` — Next skin name or `cur_skin` if unavailable.

### `HasSkins()`
* **Description:** Returns `true` if the pinned recipe has more than one owned skin (i.e., Next/Prev skins differ).
* **Parameters:** None.
* **Returns:** `boolean`.

### `ShowRecipe()`
* **Description:** Displays the recipe popup (ingredient list) for the pinned recipe.
* **Parameters:** None.
* **Returns:** None.

### `HideRecipe()`
* **Description:** Hides the recipe popup and clears selection.
* **Parameters:** None.
* **Returns:** None.

### `FindSubIngredientToCraft(recipe_data)`
* **Description:** Scans sub-ingredients of a recipe to find the first ingredient that can be built but is currently unowned in sufficient amount.
* **Parameters:**
  * `recipe_data` (`table` or `nil`) — Recipe state data from `craftingmenu:GetRecipeState(...)`.
* **Returns:** `Recipe` object or `nil`.

### `RefreshCraftingHelpText(controller_id)`
* **Description:** Returns a localized help text hint (e.g., "A SELECT") if this slot does not match the currently selected recipe in the detail panel.
* **Parameters:**
  * `controller_id` (`number`) — Controller ID.
* **Returns:** `string` — Help text or empty string.

### `OnCraftingMenuOpen()`
* **Description:** Handler when the crafting menu opens. Refreshes controller state, shows the slot, and populates the detail panel if focused.
* **Parameters:** None.
* **Returns:** None.

### `OnCraftingMenuClose()`
* **Description:** Handler when the crafting menu closes. Refreshes controller state; hides the slot if empty.
* **Parameters:** None.
* **Returns:** None.

## Events & listeners
- **Listens to:** None (the component relies on widget input callbacks such as `SetOnClick`, `OnControl`, and `OnGainFocus`, not entity events).
- **Pushes:** None.
