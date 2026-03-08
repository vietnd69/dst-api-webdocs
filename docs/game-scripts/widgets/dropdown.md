---
id: dropdown
title: Dropdown
description: A UI widget that presents a collapsible list of selectable text items, supporting both single and multiple selection modes.
tags: [ui, widgets, selection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: add05b24
system_scope: ui
---

# Dropdown

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`DropDown` is a UI widget component that displays a compact text box when closed and expands into a scrollable list when opened. It supports two operational modes: single selection (closes after selection and updates the displayed text) and multiple selection (allows selecting multiple items while remaining open). The component manages visual feedback for selection state (e.g., gold diamond indicators), integrates with a `ScrollableList`, and provides callback hooks for selection and unselection events.

## Usage example
```lua
local dropdown = CreateWidget("dropdown", 200, 40, "Select an option",
    {"Option A", "Option B", "Option C"}, false,
    function(text) print("Selected:", text) end)

dropdown:SetPosition(100, 200)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags; relies on external widget infrastructure (`Widget`, `Text`, `ImageButton`, `ScrollableList`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `start_text` | string | `""` | Initial text shown in the closed selection box before any selection. |
| `allowMultipleSelections` | boolean | `false` | Controls whether multiple items can be selected simultaneously. |
| `onselectfn` | function | `nil` | Callback invoked when an item is selected; receives the item text as argument. |
| `onunselectfn` | function | `nil` | Callback invoked when an item is unselected in multiple-selection mode; receives the item text as argument. |
| `items_data` | table | `{}` | Internal list of item records: `{ text = string, isselected = boolean }`. |
| `list_widgets` | table | `{}` | Array of widget objects corresponding to each visible list item. |

## Main functions
### `BuildListWidget(text, size_x, size_y)`
*   **Description:** Constructs a widget representing a single item in the dropdown list, including visual elements for selection state (gold diamond) and text.
*   **Parameters:**
    *   `text` (string) – Label for the list item.
    *   `size_x` (number) – Total width of the dropdown.
    *   `size_y` (number) – Height per list item.
*   **Returns:** A `Widget` instance with `Select`, `Unselect`, and event handlers attached.

### `ClearAllSelections()`
*   **Description:** Deselects all items in the list and clears associated state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ClearSelection(text)`
*   **Description:** Resets the selection box text to the initial `start_text`. Called when an item is unselected in multiple-selection mode.
*   **Parameters:** `text` (string) – Unused ( retained for API consistency).
*   **Returns:** Nothing.

### `SetSelection(text)`
*   **Description:** Handles item selection logic. In single-selection mode, updates the selection box text and closes the dropdown. In multiple-selection mode, retains the dropdown open and relies on `onselectfn`.
*   **Parameters:** `text` (string) – Text of the selected item.
*   **Returns:** Nothing.

### `SetPosition(x, y, z)`
*   **Description:** Repositions the entire dropdown widget.
*   **Parameters:**
    *   `x`, `y`, `z` (numbers) – World coordinates for placement.
*   **Returns:** Nothing.

### `SetScale(value)`
*   **Description:** Scales the entire dropdown widget uniformly.
*   **Parameters:** `value` (number) – Uniform scale factor.
*   **Returns:** Nothing.

### `Open()`
*   **Description:** Expands the dropdown by hiding the down arrow, showing the up arrow, and displaying the scrollable list.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Close()`
*   **Description:** Collapses the dropdown by hiding the up arrow, showing the down arrow, and hiding the scrollable list.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
Not applicable.