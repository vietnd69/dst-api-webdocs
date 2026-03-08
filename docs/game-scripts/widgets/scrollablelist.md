---
id: scrollablelist
title: Scrollablelist
description: Manages a scrollable list of UI items with dynamic layout, scrollbar controls, and keyboard/controller navigation.
tags: [ui, list, navigation, scrolling, widgets]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 579f9d19
system_scope: ui
---

# Scrollablelist

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ScrollableList` is a UI widget that displays a vertical list of items with scrolling functionality. It supports both pre-constructed widgets and a dynamic `updatefn` pattern for rendering list items on demand. The component provides scrollbar controls (up/down buttons, drag handle), keyboard/controller navigation (arrow keys, scroll wheel), and focus management for interactive list entries. It is typically used in screens like character selection, inventory, or achievement menus.

## Usage example
```lua
local items = {
    Widget("item1"),
    Widget("item2"),
    Widget("item3")
}
local list = ScrollableList(items, 300, 400, 50, 5, nil, nil, 0, 0, 1, 1, "GOLD")
list:SetListItemHeight(60)
list:SetListItemPadding(8)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `scrollablelist` to owner entity via `Widget` base class; no explicit tags used.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `items` | table | `nil` | List of item widgets or data tables for rendering. |
| `width` | number | *(parameter)* | Width of the scrollable area. |
| `height` | number | *(parameter)* | Height of the scrollable area. |
| `item_height` | number | `40` | Height in pixels for each list item. |
| `item_padding` | number | `10` | Vertical padding between items. |
| `x_offset` | number | `0` | Horizontal offset for item positioning. |
| `yInitial` | number | `0` | Initial vertical offset for the first item. |
| `view_offset` | number | `0` | Current scroll position (0-indexed item index). |
| `focus_children` | boolean | `true` | Whether child widgets can receive focus. |
| `always_show_static_widgets` | boolean | `false` | If true, shows all static widgets regardless of item count. |
| `scrollbar_style` | table | `SCROLLBAR_STYLE.BLACK` | Style configuration for scrollbar visuals. |
| `step_size` | number | *(computed)* | Vertical distance (in pixels) per scroll step. |
| `max_step` | number | *(computed)* | Maximum allowed scroll offset. |
| `widgets_per_view` | number | *(computed)* | Number of items visible at once. |

## Main functions
### `Scroll(amt, movemarker)`
*   **Description:** Adjusts the scroll position by `amt` items and updates the scrollbar handle.
*   **Parameters:**  
    `amt` (number) - Number of items to scroll (+ for down, - for up).  
    `movemarker` (boolean) - Whether to reposition the scrollbar handle.  
*   **Returns:** `true` if the scroll position changed; `false` otherwise.
*   **Error states:** Clamps `view_offset` to `[0, max_step]`. No effect if `max_step <= 0`.

### `RefreshView(movemarker)`
*   **Description:** Updates positions of list items and scrollbar visibility. Hides items outside the current view.
*   **Parameters:**  
    `movemarker` (boolean) - Whether to reposition the scrollbar handle after layout.  
*   **Returns:** Nothing.

### `LayOutStaticWidgets(yInitial, skipFixUp, focusChildren)`
*   **Description:** Positions and configures static widgets used with `updatefn`. Adds controller help text.
*   **Parameters:**  
    `yInitial` (number, optional) - Initial vertical offset.  
    `skipFixUp` (boolean, optional) - If `true`, skips help-text/focus hookups.  
    `focusChildren` (boolean, optional) - Sets `self.focus_children`.  
*   **Returns:** Nothing.

### `SetList(list, keepitems, scrollto, keeprelativefocusindex)`
*   **Description:** Replaces the list contents and refreshes layout. Supports preserving relative focus.
*   **Parameters:**  
    `list` (table) - New list of items.  
    `keepitems` (boolean, optional) - If `false`, kills old items before replacing.  
    `scrollto` (number, optional) - Desired scroll offset after setting list.  
    `keeprelativefocusindex` (boolean, optional) - If `true`, preserves focus position relative to the list.  
*   **Returns:** Nothing.

### `AddItem(item, before_widget)`
*   **Description:** Inserts an item into the list at the specified position.
*   **Parameters:**  
    `item` (Widget) - The item to add.  
    `before_widget` (Widget, optional) - Insert before this widget; appends if `nil`.  
*   **Returns:** Nothing.

### `RemoveItem(item)`
*   **Description:** Removes a specific item from the list.
*   **Parameters:**  
    `item` (Widget) - The item to remove.  
*   **Returns:** Nothing.

### `Clear()`
*   **Description:** Removes all items and resets the list.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `SetListItemHeight(ht)`
*   **Description:** Updates the item height and recalculates layout parameters.
*   **Parameters:**  
    `ht` (number) - New item height in pixels.  
*   **Returns:** Nothing.

### `SetListItemPadding(pad)`
*   **Description:** Updates the item padding and recalculates layout parameters.
*   **Parameters:**  
    `pad` (number) - New vertical padding in pixels.  
*   **Returns:** Nothing.

### `SetFocus()`
*   **Description:** Sets focus to the widget at `self.focused_index` (clamped to visible range).
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `GetNearestStep()`
*   **Description:** Calculates the scroll step index corresponding to the scrollbar handle position.
*   **Parameters:** None.  
*   **Returns:** (number) Integer step index.

### `IsAtEnd()`
*   **Description:** Checks if the list is scrolled to the bottom.
*   **Parameters:** None.  
*   **Returns:** `true` if `view_offset == max_step`; `false` otherwise.

### `ScrollToEnd()`
*   **Description:** Scrolls the list to the last item if the scrollbar is visible.
*   **Parameters:** None.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `CONTROL_SCROLLBACK`, `CONTROL_SCROLLFWD` (via `OnControl`), and UI focus change events (`OnGainFocus`, `OnLoseFocus`, `OnFocusMove`).  
- **Pushes:** `onscrollcb` callback (if set via `self.onscrollcb = fn`) when scrolling occurs; no events are pushed internally.