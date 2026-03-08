---
id: listcursor
title: Listcursor
description: A UI widget that acts as a selectable cursor in scrollable lists, handling focus navigation and selection states.
tags: [ui, navigation, selection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 79dc7065
system_scope: ui
---

# Listcursor

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ListCursor` is a UI widget that functions as a selectable cursor within scrollable list interfaces. It inherits from `Button` and provides visual feedback for focus and selection states using child image widgets (`highlight` and `selectedimage`). It also delegates scroll and navigation input to an associated scroll list via `SetParentList`. This component is intended for list UI management, though the code comments note it is deprecated in favor of using `ImageButton` elements directly for list items.

## Usage example
```lua
local list_cursor = ListCursor("images/serverbrowser.xml", "textwidget.tex", "textwidget_over.tex", nil)
list_cursor:SetParentList(my_scroll_list)
list_cursor:SetText(STRINGS.UI.MY_OPTION)
list_cursor:SetSelected(true)
```

## Dependencies & tags
**Components used:** None identified (pure widget, no component dependencies).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `selectedimage` | Image | (created internally) | Image widget displaying the "selected" visual state (tinted opacity controlled by `SetSelected`). |
| `highlight` | Image | (created internally) | Image widget displaying the "hover/focus" visual state (tinted opacity set on gain/lose focus). |
| `scroll_list` | ScrollList or nil | `nil` | Reference to the parent scroll list; delegates scroll and focus movement if set. |
| `selected` | boolean | `false` | Internal flag indicating whether the cursor is currently selected. |

## Main functions
### `SetParentList(list)`
* **Description:** Assigns the parent scroll list that this cursor belongs to, enabling delegation of scroll and navigation events.
* **Parameters:** `list` (ScrollList or nil) — the scroll list instance to attach to.
* **Returns:** Nothing.

### `OnGainFocus()`
* **Description:** Called when the cursor gains input focus. Visually highlights the cursor by setting `highlight`'s tint alpha to `1`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnLoseFocus()`
* **Description:** Called when the cursor loses input focus. Hides the highlight by setting `highlight`'s tint alpha to `0`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetSelected(selected)`
* **Description:** Updates the visual "selected" state using `selectedimage`. When selected (`true`), sets `selectedimage` tint alpha to `0.9`; otherwise resets to `0`.
* **Parameters:** `selected` (boolean) — whether the cursor is in the selected state.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input control events. Delegates `CONTROL_ACCEPT` (e.g., confirm) to standard button behavior and forwards scroll controls (`CONTROL_SCROLLBACK`, `CONTROL_SCROLLFWD`) to the parent scroll list if present.
* **Parameters:**  
  - `control` (number) — the control constant being triggered (e.g., `CONTROL_ACCEPT`).  
  - `down` (boolean) — whether the control is pressed (`true`) or released (`false`).  
* **Returns:** `true` if the control was handled; `false` otherwise.
* **Error states:** Returns `false` early if the widget is disabled or lacks focus when processing scroll input.

### `OnFocusMove(dir, down)`
* **Description:** Delegates focus movement requests (e.g., moving selection up/down) to the parent scroll list, if available.
* **Parameters:**  
  - `dir` (number) — direction of movement (e.g., `FORWARD` or `BACKWARD`).  
  - `down` (boolean) — whether the movement is initiated (press).  
* **Returns:** `true` if the scroll list handled the request; otherwise `false`.
* **Error states:** Returns `false` if no scroll list is attached.

### `GetSize()`
* **Description:** Returns the rendered size of the cursor, based on its base image.
* **Parameters:** None.
* **Returns:** (vector2-like) Size table (e.g., `{x=width, y=height}`), retrieved via `self.image:GetSize()`.

### `GetHelpText()`
* **Description:** Constructs and returns localized help text combining scroll control hints (if scroll bar is visible) and the button's action help text.
* **Parameters:** None.
* **Returns:** (string) Localized help string, e.g., `"Scroll Back/Scroll Forward Scroll  Press A Accept"`.
* **Error states:** May produce incomplete text if `scroll_list`, `scroll_bar`, or input localization fails.

## Events & listeners
- **Pushes:** Inherits button event behavior (e.g., `onclick`, `ondown`) via `Button._base.OnControl`.
- **Listens to:** None explicitly (relies on base `Button` class for focus and input state changes).