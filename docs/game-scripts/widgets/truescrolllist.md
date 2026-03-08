---
id: truescrolllist
title: Truescrolllist
description: A UI widget that manages scrollable lists of items by dynamically updating a fixed pool of widget instances.
tags: [ui, scrolling, list]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: c21b65c4
system_scope: ui
---

# Truescrolllist

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TrueScrollList` is a UI widget that implements an efficient scrolling list by reusing a fixed set of widget instances. Instead of creating new widgets per list item, it maintains a visible set of widgets and shifts data between them to simulate scrolling. It supports keyboard, mouse wheel, and controller input, includes a scrollbar with clickable and draggable functionality, and provides tools for debugging and focus management.

## Usage example
```lua
local create_widgets = function(context, parent, list)
    local widgets = {}
    for i = 1, 5 do
        local widget = parent:AddChild(Text(UIFONT, 24))
        widget:SetPosition(0, -i * 30)
        table.insert(widgets, widget)
    end
    return widgets, 1, 30, 5, 0
end

local update_widget = function(context, widget, item, index)
    if item then
        widget:SetString(tostring(item))
        widget:Show()
    else
        widget:Hide()
    end
end

local list = TrueScrollList(
    nil, -- context
    create_widgets,
    update_widget,
    0, 0, 200, 150, -- scissor box
    10, 0, 1 -- scrollbar offset, height offset, scroll per click
)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `scrollable` and `list` behavior via focus and input handling (no explicit tags added/removed).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `context` | table | `{}` | User-provided contextual data passed to `create_widgets_fn` and `update_fn`. |
| `scroll_per_click` | number | `1` | Scroll step size per input event. |
| `control_up` | number | `CONTROL_SCROLLBACK` | Input control for scrolling up (keyboard/controller). |
| `control_down` | number | `CONTROL_SCROLLFWD` | Input control for scrolling down. |
| `scissor_width`, `scissor_height` | number | — | Dimensions of the visible scroll region. |
| `items` | table | `{}` | List of data objects currently bound to the list. |
| `items_per_view` | number | `#self.widgets_to_update` | Number of widgets available for display. |
| `current_scroll_pos`, `target_scroll_pos` | number | `1` | Current and target scroll position (in rows, may be fractional). |
| `end_pos` | number | `1` | Maximum scroll position (clamped to `total_rows - visible_rows + end_offset`). |
| `focused_widget_index`, `focused_widget_row` | number | `1` | Index and row of the currently focused widget (within `widgets_to_update`). |
| `displayed_start_index` | number | `0` | Index of the first data item currently displayed. |

## Main functions
### `SetItemsData(items)`
*   **Description:** Sets the list of data items to display, recalculates scroll bounds, and refreshes the view.
*   **Parameters:** `items` (table or `nil`) — Array of data objects to display. If `nil`, initializes with an empty table.
*   **Returns:** Nothing.
*   **Error states:** Does not fail; clamps `end_pos` to at least `1` for tiny datasets.

### `Scroll(scroll_step)`
*   **Description:** Adjusts the target scroll position by `scroll_step` rows (can be fractional for fine control).
*   **Parameters:** `scroll_step` (number) — Amount to adjust scroll position (e.g., `1`, `-1`, `0.5`).
*   **Returns:** Nothing (used internally for sound feedback).

### `RefreshView()`
*   **Description:** Updates all visible widgets with current item data and positions the scrollbar marker.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does not fail; silently handles empty or malformed items.

### `ScrollToDataIndex(index)`
*   **Description:** Scrolls the list so that the specified data item appears at the top of the view (if possible).
*   **Parameters:** `index` (number) — 1-based index of the item in `self.items`.
*   **Returns:** Nothing.

### `GetNextWidget(dir)`
*   **Description:** Attempts to scroll and focus the next/previous widget in the given direction (`MOVE_UP`/`MOVE_DOWN`), updating the view if scrolling is needed.
*   **Parameters:** `dir` (number) — Direction (`MOVE_UP` or `MOVE_DOWN`).
*   **Returns:** `true` if scrolling or focus change occurred; `false` otherwise.

### `OnFocusMove(dir, down)`
*   **Description:** Overrides base focus movement to implement scroll-based navigation instead of direct widget focus changes.
*   **Parameters:** `dir` (number) — Direction of movement. `down` (boolean) — Always `true` (ignored).
*   **Returns:** `true` if focus moved successfully; `false` otherwise.

### `OnControl(control, down)`
*   **Description:** Handles input events for scrolling (keyboard, mouse wheel, controller).
*   **Parameters:** `control` (number) — Control identifier. `down` (boolean) — Whether the control was pressed.
*   **Returns:** `true` if the event was consumed; `false` otherwise.

### `OnUpdate(dt)`
*   **Description:** Smoothly interpolates the current scroll position toward the target and refreshes the view when scrolling occurs.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.

### `ResetScroll()`
*   **Description:** Resets the scroll position to the top of the list and refreshes the view.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OverrideControllerButtons(control_up, control_down, hints_enabled)`
*   **Description:** Temporarily replaces controller button assignments and optionally shows localized controller hints.
*   **Parameters:**  
  - `control_up`, `control_down` (number or `nil`) — New control identifiers.  
  - `hints_enabled` (boolean) — If `true`, shows controller hints instead of scrollbar arrows.
*   **Returns:** Nothing.

### `ClearOverrideControllerButtons()`
*   **Description:** Restores default controller button assignments and re-enables scrollbar arrows.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetHelpText()`
*   **Description:** Returns localized help text describing available scroll controls.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"U/D Scroll"`.

## Events & listeners
- **Listens to:** None explicitly — event-based updates occur in `OnUpdate` and `OnControl` rather than via `inst:ListenForEvent`.
- **Pushes:** None explicitly — no events are fired via `inst:PushEvent`.