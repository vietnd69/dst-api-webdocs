---
id: itemboxpreviewer
title: Itemboxpreviewer
description: Displays a preview of items inside a loot box or bundle by animating and arranging item images in a grid.
tags: [ui, inventory, animation]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 9171d549
system_scope: ui
---

# Itemboxpreviewer

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ItemBoxPreviewer` is a UI screen component that renders a preview of items contained in a loot box or bundle. It initializes a framed container with animated background elements (a spiral box animation), populates a grid with item representations, and manages transitions (fade-in/fade-out) using tinting and scaling. It is typically instantiated when a player opens or inspects a collectible box in the UI.

## Usage example
```lua
local items = {"lunchbox", "fancy_lunchbox", "gift_box"}
local previewer = ItemBoxPreviewer(items)
TheFrontEnd:PushScreen(previewer)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `items_to_display` | table | `nil` | List of item keys to display (used to generate item widgets). |
| `center_root`, `fg`, `bg`, `proot`, `bundle_root`, `frame`, `opened_item_display`, `bundle_bg` | widget | `nil` | UI hierarchy children (created during construction). |
| `bolts_source` | string or nil | `nil` | Optional currency key; if set, skips item display and auto-closes. |
| `closing` | boolean | `false` | Internal flag to prevent duplicate close operations. |
| `resize_root`, `resize_root_small`, etc. | boolean | `nil` | Layout flags computed by `GetBoxPopupLayoutDetails`. |
| `completed_cb` | function | `nil` | Optional callback invoked after fade-out completes. |

## Main functions
### `ItemBoxPreviewer(items_to_display)`
*   **Description:** Constructor. Initializes the screen UI, including background fade animation, frame, grid for items, and optional back button.
*   **Parameters:** `items_to_display` (table) — List of item keys to display.
*   **Returns:** None.
*   **Error states:** None.

### `_OpenItemBox()`
*   **Description:** Displays the contents of the box by populating the item grid, scaling/positioning the bundle root based on item count, and resizing the frame accordingly. If `bolts_source` is set, skips item display and triggers close.
*   **Parameters:** None.
*   **Returns:** None.
*   **Error states:** Uses `GetTypeForItem` and `TEMPLATES.ItemImageVerticalText`; relies on helper functions like `GetBoxPopupLayoutDetails` and `Grid:FillGrid` (not documented here).

### `_Close()`
*   **Description:** Initiates closing sequence: hides bundle root, fades background tint, pops screen from front-end stack, and invokes optional `completed_cb`.
*   **Parameters:** None.
*   **Returns:** None.
*   **Error states:** No-op if `closing` is already `true`.

### `OnControl(control, down)`
*   **Description:** Handles input (e.g., back/cancel input); delegates to base class first, then closes screen if handled.
*   **Parameters:**  
  - `control` (number/string) — Control identifier.  
  - `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
*   **Returns:** `true` if handled by base or component; otherwise `false`.

### `GetHelpText()`
*   **Description:** Returns localized help text describing how to close the screen (e.g., "B → Back").
*   **Parameters:** None.
*   **Returns:** `string` — Help message built from localized control name and `STRINGS.UI.ITEM_SCREEN.BACK`.

## Events & listeners
None identified.