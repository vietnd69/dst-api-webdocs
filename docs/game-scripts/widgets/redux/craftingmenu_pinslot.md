---
id: craftingmenu_pinslot
title: Craftingmenu Pinslot
description: A UI widget that represents a pinned recipe slot in the Redux crafting menu, allowing quick access to frequently used recipes.
tags: [ui, crafting, widget]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: widgets
source_hash: 9004a8c7
system_scope: ui
---

# Craftingmenu Pinslot

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`PinSlot` is a widget class that represents an individual pinned recipe slot within the Redux crafting menu UI. It displays recipe information, handles user input for crafting and pinning actions, shows ingredient requirements in a popup, and manages visual states based on recipe availability (buffered, prototype, missing materials, etc.). This widget is part of the crafting menu system and works alongside `CraftingMenuIngredients` to display recipe details.

## Usage example
```lua
local PinSlot = require "widgets/redux/craftingmenu_pinslot"

local pin_data = {
    recipe_name = "axe",
    skin_name = nil
}

local pin_slot = parent_widget:AddChild(PinSlot(owner, craftingmenu, 1, pin_data))
pin_slot:SetRecipe("axe", nil)
pin_slot:Refresh()
pin_slot:Show()
```

## Dependencies & tags
**Components used:** None (this is a UI widget, not an entity component)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | `nil` | The player entity that owns this widget. |
| `craftingmenu` | Widget | `nil` | Reference to the parent CraftingMenu widget instance. |
| `slot_num` | number | `nil` | The pin slot number (1-based index). |
| `recipe_name` | string | `nil` | Name of the currently pinned recipe. |
| `skin_name` | string | `nil` | Selected skin name for the recipe. |
| `base_scale` | number | `0.6` | Base scale factor for the widget. |
| `craft_button` | ImageButton | `nil` | Main crafting button widget. |
| `unpin_button` | ImageButton | `nil` | Button to remove the pinned recipe. |
| `recipe_popup` | Widget | `nil` | Popup widget showing ingredient requirements. |
| `item_img` | Image | `nil` | Image displaying the recipe icon. |
| `fg` | Image | `nil` | Foreground overlay for visual states. |
| `fgcount` | Text | `nil` | Text displaying limited build count. |
| `FindPinUp` | function or nil | `nil` | Callback that must be implemented by the owner (CraftingMenu) to handle pin navigation up. |
| `FindPinDown` | function or nil | `nil` | Callback that must be implemented by the owner (CraftingMenu) to handle pin navigation down. |

## Main functions
### `PinSlot(owner, craftingmenu, slot_num, pin_data)`
*   **Description:** Constructor that initializes a new PinSlot widget instance.
*   **Parameters:** `owner` (Entity) - The player entity owning this widget. `craftingmenu` (Widget) - Reference to the crafting menu. `slot_num` (number) - The pin slot index. `pin_data` (table, optional) - Table containing `recipe_name` and `skin_name` for initial pin data.
*   **Returns:** A new PinSlot widget instance.

### `SetRecipe(recipe_name, skin_name)`
*   **Description:** Sets the recipe and skin for this pin slot, saves to profile, and refreshes the display.
*   **Parameters:** `recipe_name` (string) - Name of the recipe to pin. `skin_name` (string or nil) - Selected skin name for the recipe.
*   **Returns:** Nothing.

### `Refresh()`
*   **Description:** Updates the visual state of the pin slot based on current recipe availability, build state, and material requirements.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ShowRecipe()`
*   **Description:** Shows the recipe popup with ingredient requirements and selects the craft button.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `HideRecipe()`
*   **Description:** Hides the recipe popup and clears focus from the craft button.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnGainFocus()`
*   **Description:** Called when the widget gains UI focus. Shows unpin controls and updates help text based on controller/mouse mode.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnLoseFocus()`
*   **Description:** Called when the widget loses UI focus. Hides unpin controls and recipe popup.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnCraftingMenuOpen()`
*   **Description:** Called when the crafting menu opens. Refreshes controller hints and shows the widget.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnCraftingMenuClose()`
*   **Description:** Called when the crafting menu closes. Refreshes controller hints and hides the widget if no recipe is pinned.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Open()`
*   **Description:** Lifecycle stub for opening the pin slot state. Currently a no-op.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Close()`
*   **Description:** Lifecycle stub for closing the pin slot state. Currently a no-op.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetPrevSkin(cur_skin)`
*   **Description:** Gets the previous owned skin for the recipe's product prefab.
*   **Parameters:** `cur_skin` (string) - Current skin name.
*   **Returns:** `string` - The previous skin name, or the same skin if none exists.

### `GetNextSkin(cur_skin)`
*   **Description:** Gets the next owned skin for the recipe's product prefab.
*   **Parameters:** `cur_skin` (string) - Current skin name.
*   **Returns:** `string` - The next skin name, or the same skin if none exists.

### `HasRecipe()`
*   **Description:** Checks if a recipe is currently pinned to this slot.
*   **Parameters:** None.
*   **Returns:** `boolean` - True if `recipe_name` is not nil.

### `HasSkins()`
*   **Description:** Checks if the pinned recipe has multiple owned skins available.
*   **Parameters:** None.
*   **Returns:** `boolean` - True if there are alternative skins available.

### `Highlight()`
*   **Description:** Sets focus on the pin slot widget. Called from inventorybar.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DeHighlight()`
*   **Description:** Clears focus from the pin slot widget.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `FindSubIngredientToCraft(recipe_data)`
*   **Description:** Finds a craftable sub-ingredient when the main recipe cannot be built due to missing materials.
*   **Parameters:** `recipe_data` (table) - Recipe state data from the crafting menu.
*   **Returns:** `table` or `nil` - The sub-ingredient recipe data if found, nil otherwise.

### `RefreshControllers(controller_mode, for_open_crafting_menu)`
*   **Description:** Updates controller button hints and control mappings based on input mode and menu state.
*   **Parameters:** `controller_mode` (boolean) - Whether controller input is active. `for_open_crafting_menu` (boolean) - Whether the crafting menu is open.
*   **Returns:** Nothing.

### `OnPageChanged(data)`
*   **Description:** Called when the crafting menu page changes. Updates recipe data and refreshes display.
*   **Parameters:** `data` (table or nil) - Table containing `recipe_name` and `skin_name`, or nil if no recipe.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called every frame while the widget is updating. Handles continuous crafting logic when the craft button is held down.
*   **Parameters:** `dt` (number) - Delta time since last frame.
*   **Returns:** Nothing.

### `SetUnpinControllerHintString()`
*   **Description:** Updates the controller hint string for the unpin button based on alignment and recipe state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RefreshCraftingHelpText(controller_id)`
*   **Description:** Returns the localized help text string for the crafting button based on the current recipe and controller ID.
*   **Parameters:** `controller_id` (number) - The controller ID to get localized control text for.
*   **Returns:** `string` - The localized help text string.

### `MakeRecipePopup(is_left)`
*   **Description:** Creates and returns the recipe popup widget.
*   **Parameters:** `is_left` (boolean) - Whether the menu is left-aligned.
*   **Returns:** `Widget` - The recipe popup widget.

### `OnControl(control, down)`
*   **Description:** Calls the base Widget OnControl method. Note that skin cycling and unpinning logic is handled by the internal `craft_button.OnControl` callback, not this method.
*   **Parameters:** `control` (number) - The control input ID. `down` (boolean) - Whether the control is pressed down.
*   **Returns:** `boolean or nil` - True if base handled the input, nil otherwise.

## Events & listeners
- **Pushes:** `refreshcrafting` - Fired on the owner entity after a successful craft action (only needed for free crafting scenarios).