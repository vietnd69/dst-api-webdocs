---
id: pagedlist
title: Pagedlist
description: Manages paginated display of static widgets using a provided update function and list of data items.
tags: [ui, layout, navigation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: f409b0a4
system_scope: ui
---

# Pagedlist

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PagedList` is a UI widget component that displays a subset (a "page") of data items across a fixed set of static child widgets. It handles pagination logic — dividing items into pages, rendering only the items for the current page via a caller-provided update function, and managing navigation arrows for page traversal. It extends `Widget`, integrates with DST's input system for controller/mouse scroll handling, and provides localized help text for navigation.

## Usage example
```lua
local PagedList = require "widgets/pagedlist"

-- Define static widgets (e.g., rows of text/buttons)
local widgets = {
    MyRowWidget(),
    MyRowWidget(),
    MyRowWidget(),
}

-- Create the paged list with width 400, update function, and static widgets
local list = PagedList(400,
    function(widget, data)
        if data ~= nil then
            widget:SetName(data.name)
            widget:SetValue(data.value)
        else
            widget:SetName("")
            widget:SetValue("")
        end
    end,
    widgets
)

list:SetItemsData({ {name="Item 1", value=10}, {name="Item 2", value=20} })
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `static_widgets` | array of widgets | `nil` | Pre-built widgets that are updated per page. Each widget corresponds to one row/entry. |
| `items_per_page` | number | `#static_widgets` | Number of items displayed per page; derived from the count of `static_widgets`. |
| `updatefn` | function | `nil` | Callback function used to populate a widget with data from `items`. Signature: `updatefn(widget, dataItem)`. |
| `items` | array | `{}` | List of data items to paginate. |
| `num_pages` | number | `1` | Total number of pages computed as `ceil(#items / items_per_page)`. |
| `page_number` | number | `1` | Current page index (1-based). |
| `repeat_time` | number | `0.15` (controller) or `0` (mouse) | Internal timer for repeated input handling (e.g., holding scroll). |
| `left_button` | ImageButton | instance | Navigation button for previous page. |
| `right_button` | ImageButton | instance | Navigation button for next page. |

## Main functions
### `SetItemsData(items)`
* **Description:** Sets the list of data items to paginate and updates pagination metadata; resets to page 1 and refreshes the view.  
* **Parameters:**  
  * `items` (array or `nil`) — List of data items. If `nil` or empty, treated as empty list.  
* **Returns:** Nothing.  
* **Error states:** None.

### `ChangePage(dir)`
* **Description:** Adjusts the current page number by `dir`, clamps it within valid bounds, and refreshes the view.  
* **Parameters:**  
  * `dir` (number) — Page delta: positive for next, negative for previous.  
* **Returns:** Nothing.  

### `SetPage(page)`
* **Description:** Sets the current page to the specified 1-based index (if valid) and refreshes the view.  
* **Parameters:**  
  * `page` (number) — Page index to set. Must be `> 0` and `<= num_pages` to take effect.  
* **Returns:** Nothing.  

### `RefreshView()`
* **Description:** Renders the current page: calls `updatefn` for each static widget with the corresponding data item (or `nil` if beyond `#items`), shows all widgets, and updates arrow visibility.  
* **Parameters:** None.  
* **Returns:** Nothing.  

### `EvaluateArrows()`
* **Description:** Controls visibility and enabled state of left/right navigation buttons. Hides both buttons when `num_pages < 2`, otherwise hides the button at the current page boundary.  
* **Parameters:** None.  
* **Returns:** Nothing.  

### `GetHelpText()`
* **Description:** Returns localized help text string describing current navigation controls (e.g., "Next page", "Previous page", or both). Uses localized control names for current input device.  
* **Parameters:** None.  
* **Returns:** `string` — Localized help message.

## Events & listeners
- **Pushes:** None identified  
- **Listens to:** None identified (relies on `Widget` base for standard input propagation; `OnControl` delegates to superclass but does not implement custom event listening).