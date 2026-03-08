---
id: craftingmenu_pinbar
title: Craftingmenu Pinbar
description: Manages the pinned recipe display and navigation UI for the crafting menu HUD, including page switching, focus handling, and prototype status indicators.
tags: [crafting, ui, hud, navigation, input]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 278c7e7d
system_scope: ui
---

# Craftingmenu Pinbar

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CraftingMenuPinBar` is a UI widget component that renders and manages the vertical bar of pinned crafting recipes in the crafting HUD. It handles pagination of pinned recipes, keyboard/controller navigation, focus management between the open button, page spinner, and pin slots, and dynamic visual feedback for prototype availability and new recipe unlocks. The component interacts with `TheCraftingMenuProfile` for recipe and page state, and coordinates with `PinSlot` and `CraftingMenuIngredients` child widgets.

## Usage example
```lua
-- Typically instantiated internally by the crafting HUD system
-- Not meant for manual instantiation by mods unless rebuilding the HUD
local pinbar = CraftingMenuPinBar(owner, crafting_hud, 600)
pinbar:Refresh()
pinbar:OnCraftingMenuOpen()
pinbar:GoToNextPage()
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None added or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | `nil` | The entity (usually player) that owns the HUD. |
| `crafting_hud` | CraftingHUD | `nil` | The parent crafting HUD widget that owns this pinbar. |
| `root` | Widget | `nil` | Root widget container for all pinbar UI elements. |
| `open_menu_button` | ImageButton | `nil` | Button to toggle the full crafting menu visibility. |
| `page_spinner` | Widget | `nil` | Page navigation control with arrows and page counter. |
| `pin_slots` | table of PinSlot | `{}` | Array of `PinSlot` widgets representing each pinned recipe slot. |
| `focus_forward` | PinSlot | `self.pin_slots[1]` | Initial focus target when the pinbar receives focus. |

## Main functions
### `DoFocusHookups()`
*   **Description:** Sets up bidirectional focus navigation between the open button, page spinner, and all pin slots.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ClearFocusHookups()`
*   **Description:** Removes all focus change directions previously set by `DoFocusHookups`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `MakePageSpinner()`
*   **Description:** Creates and configures the page spinner UI widget (arrows and page number) with controller and keyboard bindings for page navigation.
*   **Parameters:** None.
*   **Returns:** Widget — A fully built page spinner widget.

### `RefreshPinnedRecipes()`
*   **Description:** Updates the UI to reflect the current pinned recipes and current page number from the profile.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RefreshPageControls()`
*   **Description:** Dynamically toggles between displaying localized controller button labels (e.g., "L1", "R1") and static arrow images for the page spinner, based on current focus and input mode.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ShowPageControls()`
*   **Description:** Starts the on-update loop to refresh page controls while the page spinner is focused.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `HidePageControls()`
*   **Description:** Stops the on-update loop and reverts to showing static arrows instead of button labels.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** periodically refreshes page controls via `RefreshPageControls()` while the spinner is focused.
*   **Parameters:** `dt` (number) — delta time since last frame.
*   **Returns:** Nothing.

### `RefreshControllers(controller_mode)`
*   **Description:** Refreshes all pin slots to adapt to a change in controller input mode.
*   **Parameters:** `controller_mode` (any) — controller input mode identifier (exact type not used internally).
*   **Returns:** Nothing.

### `GoToNextPage(silent)`
*   **Description:** Switches to the next pinned recipe page, updates UI, and optionally plays a sound and saves profile. For controllers, handles remapping focus after the switch.
*   **Parameters:** `silent` (boolean, optional) — if `true`, suppresses sound and profile save.
*   **Returns:** Nothing.

### `GoToPrevPage(silent)`
*   **Description:** Switches to the previous pinned recipe page, updates UI, and optionally plays a sound and saves profile. For controllers, handles remapping focus after the switch.
*   **Parameters:** `silent` (boolean, optional) — if `true`, suppresses sound and profile save.
*   **Returns:** Nothing.

### `StartControllerNav()`
*   **Description:** Returns the lowest visible pin slot for controller navigation (used as a starting target).
*   **Parameters:** None.
*   **Returns:** PinSlot or `nil` — the first visible pin slot from the bottom.

### `GetFirstButton()`
*   **Description:** Returns the first visible pin slot in order.
*   **Parameters:** None.
*   **Returns:** PinSlot or `nil` — the first visible pin slot.

### `FindFirstUnpinnedSlot()`
*   **Description:** Finds the first pin slot that currently holds no recipe (i.e., is empty).
*   **Parameters:** None.
*   **Returns:** PinSlot or `nil` — the first empty pin slot.

### `GetFocusSlot()`
*   **Description:** Returns the currently focused pin slot (if any) and its index.
*   **Parameters:** None.
*   **Returns:** PinSlot, number or `nil, nil` — slot and 1-based index, or `nil` if none focused.

### `Refresh()`
*   **Description:** Updates the entire pinbar UI state: refreshes icon, page number, and all pin slots.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles global keyboard/controller input for page switching when the crafting menu is closed.
*   **Parameters:**  
  `control` (any) — The input control key or virtual control.  
  `down` (boolean) — Whether the control was pressed (`true`) or released.
*   **Returns:** boolean — `true` if the input was consumed.

### `OnCraftingMenuOpen()`
*   **Description:** Called when the crafting menu opens; sets up focus hookups and notifies all pin slots.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnCraftingMenuClose()`
*   **Description:** Called when the crafting menu closes; clears focus hookups and notifies all pin slots.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RefreshCraftingHelpText(controller_id)`
*   **Description:** Delegates help text generation to the focused pin slot.
*   **Parameters:** `controller_id` (number) — The controller ID to use for key label resolution.
*   **Returns:** string — The help text string for the focused slot, or `""` if no focus.

### `OnGainFocus()`
*   **Description:** Called when the pinbar gains UI focus; shows or hides page controls depending on crafting menu state and controller presence.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnLoseFocus()`
*   **Description:** Called when the pinbar loses UI focus; hides page controls if the crafting menu is closed.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.