---
id: itemboxopenerpopup
title: ItemBoxOpenerPopup
description: Renders and manages the interactive mystery box opening animation and item reveal flow, including animations, sound playback, and player input handling.
tags: [ui, animation, input, loot]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 5da0af23
system_scope: ui
---

# ItemBoxOpenerPopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ItemBoxOpenerPopup` is a UI screen component that displays an animated mystery box opening experience. It orchestrates box animations, item revelation sequencing, and player interaction during the reveal process. The component inherits from `Screen` and operates as a transient overlay—handling state transitions between intro, pending, opening, reveal, and closing phases. It supports both item-based reveals and currency/bolt-style unlocks via the `bolts_source` parameter.

## Usage example
```lua
local ItemBoxOpenerPopup = require "widgets/redux/itemboxopenerpopup"

local options = {
    allow_cancel = true,
    bolts_source = "bolt_123",  -- nil for item boxes
    message = STRINGS.UI.ITEM_SCREEN.MYSTERY_BOX_MESSAGE
}

ItemBoxOpenerPopup(options, function(on_items_ready)
    -- Simulate fetching items asynchronously
    TheFrontEnd:DoTaskInTime(0.5, function()
        on_items_ready({"rare_sword", "epic_shield"})
    end)
end,
function()
    print("Box opening sequence completed")
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `allow_cancel` | boolean | `options.allow_cancel` | Whether the popup can be closed early (e.g., by back button). |
| `bolts_source` | string or nil | `options.bolts_source` | If present, indicates the popup is for currency/bolt unlock (no item grid). |
| `open_box_fn` | function | `options.open_box_fn` | Callback used to fetch item types asynchronously. |
| `completed_cb` | function or nil | `options.completed_cb` | Optional callback invoked when the popup is fully closed. |
| `ui_state` | string | `"INTRO"` | Current state of the popup; one of `INTRO`, `PENDING_OPEN`, `WAIT_ON_ITEMS`, `BUNDLE_OPENING`, `WAIT_ON_NEXT`, `BUNDLE_CLOSING`, `BUNDLE_REVIEW`, `OUTRO`. |
| `items` | table or nil | `nil` | List of item keys revealed during opening (only for item boxes). |
| `active_item_idx` | number | `1` | Index of the currently active item in the `items` list. |
| `frame` | NineSlice | `nil` | Decorative frame widget surrounding the item grid. |
| `opened_item_display` | Grid | `nil` | Container grid displaying revealed items. |
| `current_item_summary` | Widget | `nil` | Panel showing title, rarity, set title, and description of the active item. |
| `bundle` | UIAnim | `nil` | Animation widget for the box itself. |
| `bundle_bg` | UIAnim | `nil` | Background animation for the box (e.g., spiral). |
| `message` | Text | `nil` | Header text displayed above the box. |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Drives state transitions and timing for animations and reveal sequencing. Each `ui_state` is checked and advanced based on animation completion or readiness of revealed items.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.
*   **Error states:** No known error states.

### `OnControl(control, down)`
*   **Description:** Processes player input to advance state (e.g., accept to open box, cancel to exit). Logic branches by current `ui_state`.
*   **Parameters:** 
    *   `control` (Control constant) — input action (e.g., `CONTROL_ACCEPT`, `CONTROL_CANCEL`).
    *   `down` (boolean) — `true` if key was pressed down (not released); this function exits early unless `down == false`.
*   **Returns:** boolean — `true` if input was consumed; otherwise `false`.
*   **Error states:** Returns early if `down == true`. Does not handle non-accept/cancel controls.

### `SkipWaitOnNext()`
*   **Description:** Skips the remaining item reveal animations and proceeds directly to the closing sequence. Resets the back button if present.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CanExit()`
*   **Description:** Determines whether the popup can be closed via `CONTROL_CANCEL` at the current state.
*   **Parameters:** None.
*   **Returns:** boolean — `true` if exit is allowed in the current `ui_state`.

### `GetHelpText()`
*   **Description:** Returns localized, context-sensitive help text (e.g., button hints) based on current `ui_state`.
*   **Parameters:** None.
*   **Returns:** string — concatenated help instructions using localized control strings and `STRINGS.UI.ITEM_SCREEN.*`.

### `OnBecomeActive()`
*   **Description:** Hook invoked when the screen becomes active. Lowers FE music volume to avoid audio conflict with box sounds.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeInactive()`
*   **Description:** Hook invoked when the screen becomes inactive. Restores FE music volume.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.

> **Note:** This component does not use `inst:ListenForEvent` or `inst:PushEvent`. It is purely UI-driven and does not emit or react to game events.