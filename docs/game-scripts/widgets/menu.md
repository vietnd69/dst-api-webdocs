---
id: menu
title: Menu
description: Manages a dynamic collection of interactive menu items with keyboard and controller focus navigation, layout, and styling support.
tags: [ui, menu, navigation, input]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d4da12ed
system_scope: ui
---

# Menu

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Menu` is a UI widget component that organizes and manages a list of interactive menu items (buttons or custom widgets) with support for horizontal or vertical layout, focus navigation, dynamic positioning, and controller input integration. It extends `Widget` and serves as a container for menu elements, handling focus transitions, item styling, localization of control prompts, and alignment logic. It is typically used in in-game menus (e.g., pause, inventory, character selection).

## Usage example
```lua
local menu = CreateWidget("MENU", {
    { text = "Resume", cb = function() TheFrontEnd:PopScreen() end },
    { text = "Options", cb = function() TheFrontEnd:PushScreen("options") end },
    { text = "Quit", cb = function() TheFrontEnd:CloseGame() end },
}, 60, false, "none", true, 32)

TheFrontEnd:AddWidget(menu)
menu:SetFocus(1)
```

## Dependencies & tags
**Components used:** None (purely UI/widget-layer logic)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offset` | number | *required* | Spacing between menu items (pixels or UI units). |
| `style` | string | `nil` | Default button style applied to items (e.g., `"small"`, `"carny_long"`, `"tabs"`, `"none"`). |
| `textSize` | number | `nil` | Default font size for menu item text. |
| `items` | table (array of widgets) | `{}` | List of child widgets/items in the menu. |
| `horizontal` | boolean | *required* | `true` for horizontal layout, `false` for vertical. |
| `wrap_focus` | boolean | *required* | Whether focus should wrap from last to first item (currently unused in code — commented out). |
| `last_focused_index` | number | `nil` | Tracks the most recently focused item index. |

## Main functions
### `RestoreFocusTo(last_focus_widget)`
*   **Description:** Restores focus to a previously focused widget; if not found in `items`, focuses the menu itself.
*   **Parameters:** `last_focus_widget` (widget) — the widget to restore focus to.
*   **Returns:** Nothing.

### `Clear()`
*   **Description:** Removes and kills all menu items, resetting the internal `items` list.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetNumberOfItems()`
*   **Description:** Returns the total number of items currently in the menu.
*   **Parameters:** None.
*   **Returns:** `number` — count of menu items.

### `GetSize()`
*   **Description:** Computes and returns the total bounding size of the menu based on the first item's dimensions and spacing. Only works if items support `GetSize()`.
*   **Parameters:** None.
*   **Returns:** `w, h` (number, number) — width and height; returns `nil, nil` if `items[1]` lacks `GetSize` or is missing.

### `SetMenuIndex(index)`
*   **Description:** Sets the `last_focused_index` property to track the most recently focused item.
*   **Parameters:** `index` (number) — 1-based index of the currently focused item.
*   **Returns:** Nothing.

### `SetFocus(index)`
*   **Description:** Sets focus to the item at `index`; if `index` is `nil`, uses `last_focused_index` or defaults to the first/last item (based on `reverse` flag — *not implemented*).
*   **Parameters:** `index` (number, optional) — 1-based index of the item to focus.
*   **Returns:** Nothing.

### `SetTextSize(size)`
*   **Description:** Updates the font size for all items and their optional controller prompt text.
*   **Parameters:** `size` (number) — new font size.
*   **Returns:** Nothing.

### `DoFocusHookups()`
*   **Description:** Configures keyboard/controller directional focus transitions between items (e.g., right arrow moves to next item). Internal use only.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetVRegPoint(valign)`
*   **Description:** Vertically aligns menu items relative to the menu container (e.g., top, middle, bottom).
*   **Parameters:** `valign` (string) — alignment constant (`ANCHOR_TOP`, `ANCHOR_MIDDLE`, `ANCHOR_BOTTOM`).
*   **Returns:** Nothing.

### `SetHRegPoint(halign)`
*   **Description:** Horizontally aligns menu items relative to the menu container (e.g., left, middle, right).
*   **Parameters:** `halign` (string) — alignment constant (`ANCHOR_LEFT`, `ANCHOR_MIDDLE`, `ANCHOR_RIGHT`).
*   **Returns:** Nothing.

### `AddCustomItem(widget, offset)`
*   **Description:** Adds a custom widget as a menu item, bypassing `AddItem`’s button creation. Updates layout and focus hooks.
*   **Parameters:**  
  - `widget` (widget) — the custom widget to add.  
  - `offset` (Vector3, optional) — additional position offset for this item.
*   **Returns:** `widget` — the added widget.

### `AddItem(text, cb, offset, style, size, control)`
*   **Description:** Creates a button with specified text, callback, and style, adds it to the menu, and handles controller prompt localization.
*   **Parameters:**  
  - `text` (string) — button label text.  
  - `cb` (function) — callback executed on click.  
  - `offset` (Vector3, optional) — per-item position offset.  
  - `style` (string, optional) — overrides `self.style`. Supports `"small"`, `"carny_long"`, `"carny_xlong"`, `"tabs"`, `"none"`, or default.  
  - `size` (number, optional) — font size; defaults to `self.textSize`.  
  - `control` (string, optional) — control name for localized prompt (e.g., `"A"`, `"X"`).
*   **Returns:** `button` (ImageButton) — the created button widget.

### `AutoSpaceByText(spacing)`
*   **Description:** Dynamically spaces items based on text width/height and specified spacing (e.g., for centering variable-length text). Modifies item positions in-place.
*   **Parameters:** `spacing` (number) — extra space between items.
*   **Returns:** `number` — total computed width/height of the layout.

### `EditItem(num, text, text_size, cb)`
*   **Description:** Updates properties of an existing menu item without recreating it.
*   **Parameters:**  
  - `num` (number) — 1-based index of the item.  
  - `text` (string, optional) — new label text.  
  - `text_size` (number, optional) — new font size.  
  - `cb` (function, optional) — new click callback.
*   **Returns:** Nothing.

### `DisableItem(num)`
*   **Description:** Disables the menu item at the given index (grayed out, non-interactive).
*   **Parameters:** `num` (number) — 1-based index.
*   **Returns:** Nothing.

### `EnableItem(num)`
*   **Description:** Re-enables a previously disabled menu item.
*   **Parameters:** `num` (number) — 1-based index.
*   **Returns:** Nothing.

### `UnselectAll()`
*   **Description:** Removes selection visual state from all menu items.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified