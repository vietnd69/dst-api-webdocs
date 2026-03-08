---
id: tab
title: Tab
description: Represents a single tab in a tab group UI component, handling visual state transitions and selection logic.
tags: [ui]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: c9611cac
system_scope: ui
---

# Tab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Tab` is a UI widget class that represents an individual selectable tab within a `TabGroup`. It manages visual appearance (textures, scaling, overlays), selection state, highlighting states, and interaction with its parent tab group via callback functions. It inherits from `Widget` and uses `Image` sub-components for background and icon rendering.

## Usage example
```lua
local Tab = require "widgets/tab"

local myTab = Tab(
    tabgroup,              -- parent TabGroup instance
    "Character Tab",       -- tooltip text
    "ui_tab.atlas",        -- background texture atlas
    "ui_icons.atlas",      -- icon texture atlas
    "icon_character.tex",  -- icon texture name
    "tab_normal.tex",      -- normal state image
    "tab_selected.tex",    -- selected state image
    "tab_highlight.tex",   -- highlighted state image
    "tab_alt_highlight.tex", -- alternate highlighted image
    "tab_overlay.tex",     -- overlay image (optional)
    function(tab) print("Selected") end, -- select callback
    function(tab) print("Deselected") end -- deselect callback
)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `group` | TabGroup | `nil` | Parent tab group instance. |
| `atlas` | string | `nil` | Texture atlas for background/overlay images. |
| `icon_atlas` | string | `nil` | Texture atlas for icon image. |
| `selectfn` | function | `nil` | Callback executed when tab is selected. |
| `deselectfn` | function | `nil` | Callback executed when tab is deselected. |
| `collapsed` | boolean | `false` | Flag indicating if tab is collapsed (not used internally). |
| `imnormal`, `imselected`, `imhighlight`, `imalthighlight` | string | `nil` | Texture names for various visual states. |
| `basescale` | number | `0.5` | Base scale factor applied to UI elements. |
| `selected` | boolean | `false` | Whether this tab is currently selected. |
| `highlighted` | boolean | `false` | Whether this tab is in normal highlight state. |
| `alternatehighlighted` | boolean | `false` | Whether this tab is in alternate highlight state. |
| `highlightnum` | number | `nil` | Priority level for highlight state. |
| `overlayshow` | boolean | `nil` | Tracks overlay visibility state. |
| `bg` | Image | `nil` | Background image child widget. |
| `icon` | Image | `nil` | Icon image child widget. |
| `overlay` | Image | `nil` | Optional overlay image child widget. |
| `disable_scaling` | boolean | `nil` | If set, disables scaling animations. |
| `overlay_scaling` | boolean | `nil` | If set, applies scaling to overlay during overlay state. |

## Main functions
### `OnControl(control, down)`
*   **Description:** Handles keyboard/gamepad input; toggles tab selection when the ACCEPT control is released.
*   **Parameters:**  
    - `control` (string) – control identifier (e.g., `"accept"`).  
    - `down` (boolean) – `true` if the control is pressed down, `false` if released.  
*   **Returns:** `true` if the event was handled, otherwise `false`.

### `Overlay()`
*   **Description:** Activates the overlay state: shows the overlay image and scales the tab larger. Respects optional delay from `group.onoverlay`.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `HideOverlay()`
*   **Description:** Hides the overlay image if present and resets the `overlayshow` flag.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `Highlight(num, instant, alt)`
*   **Description:** Sets highlight state for the tab. Uses `num` as priority; higher numbers override lower ones. Applies alternate texture if `alt` is `true`.
*   **Parameters:**  
    - `num` (number) – highlight priority level.  
    - `instant` (boolean) – if `true`, skips animation delay.  
    - `alt` (boolean) – if `true`, uses alternate highlight texture.  
*   **Returns:** Nothing.

### `AlternateHighlight(num, instant)`
*   **Description:** Convenience method to trigger alternate highlight state. Equivalent to `Highlight(num, instant, true)`.  
*   **Parameters:**  
    - `num` (number) – highlight priority level.  
    - `instant` (boolean) – if `true`, skips animation delay.  
*   **Returns:** Nothing.

### `UnHighlight(instant)`
*   **Description:** Removes highlight state and reverts to normal background texture (unless selected). Triggers scale-down animation unless `instant` is `true`.  
*   **Parameters:**  
    - `instant` (boolean) – if `true`, skips animation.  
*   **Returns:** Nothing.

### `Deselect()`
*   **Description:** Deselects the tab: resets background texture, resets selection flag, and triggers deselection callback and scale-down animation.  
*   **Parameters:** None.  
*   **Returns:** Nothing.
*   **Error states:** Has no effect if already deselected (`selected == false`).

### `Select()`
*   **Description:** Selects the tab: triggers deselection of all other tabs in the group, updates background texture, and triggers selection callback and scale-up animation.  
*   **Parameters:** None.  
*   **Returns:** Nothing.
*   **Error states:** Has no effect if already selected (`selected == true`).

## Events & listeners
None identified