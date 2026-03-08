---
id: chatscrolllist
title: Chatscrolllist
description: Implements a scrollable list widget for chat or similar vertical UI content, managing item rendering and smooth scrolling behavior.
tags: [ui, scrolling, chat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 6f2e9fe7
system_scope: ui
---

# Chatscrolllist

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ChatScrollList` is a `Widget` subclass that renders a vertically scrollable list of UI elements. It uses a pool of reusable widgets (created via `create_widgets_fn`) and updates them as the list scrolls using the provided `update_fn`. Scrolling motion is handled with smooth interpolation (`Lerp`) and respects bounds via `can_scroll_fn`. The visible region is clamped using a scissor box (`scissor_x`, `scissor_y`, `scissor_width`, `scissor_height`). It is primarily intended for chat UI but generic enough for any scrollable list.

## Usage example
```lua
local chat_list = ChatScrollList(
    function(list_root, parent)
        -- Create 5 reusable widgets (e.g., chat bubbles)
        local widgets = {}
        for i = 1, 5 do
            local bubble = parent:AddChild(Image("images/ui.xml", "chatbubble.tex"))
            bubble:SetPosition(0, -i * 20, 0)
            table.insert(widgets, bubble)
        end
        return widgets, 20 -- return widgets and row height
    end,
    function(widget, index, current_row, row_offset, data)
        -- Apply data to the widget; example: update text or position
        if data and data[index] then
            widget:SetText(data[index])
        end
    end,
    function(new_scroll_pos, current_scroll_pos)
        -- Prevent scrolling beyond list bounds
        return new_scroll_pos >= 0 and new_scroll_pos <= 100
    end,
    0, 0, 300, 120 -- scissor box
)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scroll_per_click` | number | `1` | Controls scroll step size per input event (halved when a controller is attached). |
| `scissored_root` | Widget | — | Root widget with scissor clipping applied. |
| `list_root` | Widget | — | Container for the scrollable list items; moved vertically during scrolling. |
| `scissor_width` | number | — | Width of the visible region. |
| `scissor_height` | number | — | Height of the visible region. |
| `widgets_to_update` | table | — | Array of pre-created widgets used to render visible rows. |
| `row_height` | number | — | Height of a single row in the list. |
| `items_per_view` | number | — | Number of widgets in `widgets_to_update`. |
| `current_scroll_pos` | number | `0` | Current interpolated scroll position (may be fractional). |
| `target_scroll_pos` | number | `0` | Desired scroll position (integer when fully aligned to rows). |
| `focus_forward` | Widget | `list_root` | Widget that receives focus navigation. |

## Main functions
### `GetListWidgets()`
* **Description:** Returns the array of widgets used to render visible list items.
* **Parameters:** None.
* **Returns:** `table` — array of widget instances (same as `self.widgets_to_update`).

### `Scroll(scroll_step, instant)`
* **Description:** Adjusts the scroll position by `scroll_step` rows. Handles partial scrolling (sub-row offsets) and boundary checks via `can_scroll_fn`. When `instant` is `true`, jumps immediately instead of interpolating.
* **Parameters:**
  * `scroll_step` (number) — number of rows to scroll (negative = up, positive = down).
  * `instant` (boolean) — if `true`, skip interpolation and update position immediately.
* **Returns:** Nothing.
* **Error states:** Returns early with no effect if scrolling would violate `can_scroll_fn`.

### `ResetScroll()`
* **Description:** Resets both `current_scroll_pos` and `target_scroll_pos` to `0` and refreshes the view.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshView()`
* **Description:** Updates all visible widgets based on the current scroll position (`current_scroll_pos`). Moves `list_root` vertically to align rows and calls `update_fn` on each widget with row context.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Interpolates `current_scroll_pos` toward `target_scroll_pos` over time using `Lerp`. Triggers `RefreshView` only if scrolling is in progress.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.
* **Error states:** Returns immediately if `current_scroll_pos == target_scroll_pos`.

### `OnChatControl(control, down)`
* **Description:** Handles scroll input events (`CONTROL_SCROLLBACK`, `CONTROL_SCROLLFWD`) and triggers `Scroll`. Automatically reduces scroll sensitivity when a controller is attached.
* **Parameters:**
  * `control` (string) — control identifier (e.g., `"scrollback"`).
  * `down` (boolean) — whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if the control was consumed; `false` otherwise.

### `DebugDraw_AddSection(dbui, panel)`
* **Description:** Adds debug UI controls for the scissor region, including visibility toggle and draggable position/size fields. Intended for editor/debug builds only.
* **Parameters:**
  * `dbui` (object) — debug UI builder instance.
  * `panel` (Widget) — parent panel to attach debug controls.
* **Returns:** Nothing.

## Events & listeners
None identified