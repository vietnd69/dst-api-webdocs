---
id: truescrollarea
title: Truescrollarea
description: Implements a scrollable UI container with scissored content rendering, draggable scrollbar, and keyboard/mouse scroll support.
tags: [ui, scrolling, widget]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 93e76444
system_scope: ui
---

# Truescrollarea

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TrueScrollArea` is a UI widget that provides a scrollable region with visual scrollbar controls and dynamic content clipping via scissoring. It wraps a user-provided content widget and ensures it is rendered only within a defined rectangular viewport (`scissor`). The component handles smooth scrolling with inertia, keyboard (scroll wheel), and mouse/drag interactions. It is designed to be a reusable container for lists or large UI sections that exceed available screen space.

## Usage example
```lua
-- Assume 'context' is a table with { widget = some_widget, size = { height = 600 } }
-- and scissor is { x = 100, y = 200, width = 300, height = 400 }
local scroll_area = TrueScrollArea(context, {x=100, y=200, width=300, height=400}, { scroll_per_click = 25 })

-- Add to a parent widget (e.g., modal or screen)
parent:AddChild(scroll_area)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks and displays `CanScroll()` state via scrollbar visibility; uses `CONTROL_SCROLLBACK` and `CONTROL_SCROLLFWD` input controls.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `context` | table | — | User-provided context containing at least `widget` and `size.height`. Not modified by this component. |
| `scrollbar_v` | table | `{}` | Optional configuration overrides for scrollbar layout (e.g., `scroll_per_click`, `h_offset`, `v_offset`). |
| `current_scroll_pos` | number | `0` | Current scrolled position in pixels; clamped between `0` and `scroll_pos_end`. |
| `target_scroll_pos` | number | `0` | Target position for scrolling; interpolated toward by `current_scroll_pos` in `OnUpdate`. |
| `scroll_pos_end` | number | `max(0, context.size.height - scissor.height)` | Maximum possible scroll offset (i.e., bottom of content). |
| `scroll_per_click` | number | `20` | Pixels scrolled per wheel click or button press. |
| `context_root` | Widget | — | Scissored container widget to which the user's content widget is attached. |
| `scissored_root` | Widget | — | Root widget with active scissor region applied. |
| `position_marker` | ImageButton | — | Draggable handle for scrollbar. |
| `up_button` / `down_button` | ImageButton | — | Arrow buttons for fine-scrolling. |

## Main functions
### `Scroll(scroll_step)`
* **Description:** Adjusts the `target_scroll_pos` by the given step (positive = scroll down, negative = scroll up). Actual scrolling is applied via `OnUpdate` interpolation.
* **Parameters:** `scroll_step` (number) — Amount to shift the scroll target in pixels.
* **Returns:** Nothing. The function internally returns the result of `Scroll()` (the previous `target_scroll_pos`), but this value is not used.

### `RefreshView()`
* **Description:** Updates the layout of the content root and scrollbar marker based on `current_scroll_pos`. Must be called after any scroll position change.
* **Parameters:** None.
* **Returns:** Nothing.

### `ResetScroll()`
* **Description:** Resets both `current_scroll_pos` and `target_scroll_pos` to `0` and refreshes the view.
* **Parameters:** None.
* **Returns:** Nothing.

### `CanScroll()`
* **Description:** Indicates whether scrolling is necessary (i.e., content height exceeds viewport height).
* **Parameters:** None.
* **Returns:** `true` if `scroll_pos_end > 0`, otherwise `false`.

### `GetListWidgets()`
* **Description:** Returns the list of widgets (`self.widgets_to_update`) tracked for updates. Not used internally in the provided code.
* **Parameters:** None.
* **Returns:** `self.widgets_to_update` (table) — Currently uninitialized; likely intended for internal use in subclasses or extending widgets.

### `GetHelpText()`
* **Description:** Returns localized help text describing available scroll controls (e.g., "Scroll: [WHEEL UP]/[WHEEL DOWN]").
* **Parameters:** None.
* **Returns:** `string` — A concatenated string of localized control labels.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.