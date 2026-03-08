---
id: grid
title: Grid
description: Manages a 2D grid-based layout of UI widgets with directional focus navigation.
tags: [ui, layout, navigation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 8fd566a7
system_scope: ui
---

# Grid

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Grid` is a UI widget that arranges child widgets in a fixed-size rectangular grid, supporting both row-major and natural (left-to-right, top-to-bottom) layouts. It handles focus navigation between grid cells using `SetFocusChangeDir`, and supports looping navigation (horizontal/vertical wraparound) via `SetLooping`. It inherits from `Widget` and is intended for static layout scenarios.

## Usage example
```lua
local g = Grid()
g:FillGrid(2, 100, 100, {
    Text(UIFONT, 20, "1"),
    Text(UIFONT, 20, "2"),
    Text(UIFONT, 20, "3"),
})
g:SetLooping(true, false) -- horizontal wrap only
g:SetFocus(1, 1) -- focus the first cell
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `h_offset` | number | `100` | Horizontal spacing (in pixels) between grid columns. |
| `v_offset` | number | `100` | Vertical spacing (in pixels) between grid rows. |
| `items_by_coords` | table | `{}` | 2D array mapping (row, col) → child widget. |
| `rows` | number | `0` | Number of rows in the grid. |
| `cols` | number | `0` | Number of columns in the grid. |
| `layout_left_to_right_top_to_bottom` | boolean | `false` | If `true`, uses natural English reading order (left-to-right, top-to-bottom); otherwise uses row-major indexing. |
| `h_loop` | boolean | `nil` | Whether horizontal navigation loops (wraps) across columns. |
| `v_loop` | boolean | `nil` | Whether vertical navigation loops (wraps) across rows. |

## Main functions
### `SetLooping(h, v)`
*   **Description:** Enables or disables horizontal/vertical looping for focus navigation and rebuilds focus hookups.
*   **Parameters:**  
    `h` (boolean) — whether to loop horizontally.  
    `v` (boolean) — whether to loop vertically.
*   **Returns:** Nothing.
*   **Error states:** None.

### `InitSize(c, r, coffset, roffset)`
*   **Description:** Initializes grid dimensions and spacing; clears existing items.
*   **Parameters:**  
    `c` (number) — number of columns.  
    `r` (number) — number of rows.  
    `coffset` (number) — horizontal offset for column spacing.  
    `roffset` (number) — vertical offset for row spacing.
*   **Returns:** Nothing.

### `UseNaturalLayout()`
*   **Description:** Configures layout to follow natural English text flow (left-to-right, top-to-bottom). Must be called before adding any items.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Asserts if any items have already been added (`#self.children > 0`).

### `Clear()`
*   **Description:** Removes and kills all items in the grid; resets internal storage.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoFocusHookups()`
*   **Description:** Configures directional focus navigation for all non-nil grid items, setting `MOVE_UP`, `DOWN`, `LEFT`, `RIGHT` focus targets based on position and loop settings.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetRowsInCol(c)`
*   **Description:** Returns the highest (last) row index with a non-nil item in the given column `c`.
*   **Parameters:**  
    `c` (number) — column index (1-based).
*   **Returns:** (number) — row index, or `0` if column is empty or out of bounds.

### `SetFocus(c, r)`
*   **Description:** Attempts to set focus on the widget at column `c`, row `r`. Defaults to `(1,1)` if omitted. Supports negative indexing.
*   **Parameters:**  
    `c` (number, optional) — column index (1-based; negative values are adjusted via modulo).  
    `r` (number, optional) — row index (1-based; negative values are adjusted via modulo).
*   **Returns:** Nothing.

### `:FindItemSlot(compare_fn)`
*   **Description:** Finds the first grid cell (column, row) whose item satisfies the provided predicate.
*   **Parameters:**  
    `compare_fn` (function) — predicate taking a widget and returning `true` for a match.
*   **Returns:** (number, number) — `(c, r)` indices of first match; `nil` if none found.
*   **Error states:** Asserts `compare_fn` is a function.

### `GetItemInSlot(c, r)`
*   **Description:** Returns the widget stored at column `c`, row `r`.
*   **Parameters:**  
    `c` (number) — column index (1-based).  
    `r` (number) — row index (1-based).
*   **Returns:** (widget or `nil`) — the widget, or `nil` if out of bounds or empty.
*   **Error states:** Returns `nil` if `r > self.rows` or `c > self.cols`.

### `AddItem(widget, c, r)`
*   **Description:** Adds a widget to a specific grid cell. Kills any existing item in the cell.
*   **Parameters:**  
    `widget` (widget) — widget to add.  
    `c` (number) — column index (1-based).  
    `r` (number) — row index (1-based).
*   **Returns:** (widget) — the added widget.
*   **Error states:** Returns `nil` early if `r > self.rows` or `c > self.cols`. Does nothing if indices are out of bounds.

### `:AddList(widget_list, initial_row, initial_col)`
*   **Description:** Sequentially adds a list of widgets to the grid, starting at `(initial_col, initial_row)`, wrapping rows/columns as needed.
*   **Parameters:**  
    `widget_list` (table) — array of widgets to add.  
    `initial_row` (number, optional) — starting row (default `1`).  
    `initial_col` (number, optional) — starting column (default `1`).
*   **Returns:** Nothing.

### `FillGrid(num_columns, coffset, roffset, items)`
*   **Description:** Convenience method to initialize and fill the grid with items in natural layout order.
*   **Parameters:**  
    `num_columns` (number) — number of columns.  
    `coffset` (number) — horizontal spacing offset.  
    `roffset` (number) — vertical spacing offset.  
    `items` (table) — array of widgets to add.
*   **Returns:** Nothing.
*   **Layout behavior:** Computes `num_rows = ceil(#items / num_columns)`, calls `UseNaturalLayout()`, `InitSize()`, and `AddList()` in sequence.

### `:DebugDraw_AddSection(dbui, panel)`
*   **Description:** Adds debug UI controls for modifying grid parameters at runtime.
*   **Parameters:**  
    `dbui` (DebugUI) — debug UI instance.  
    `panel` (Panel) — UI panel to append controls to.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
