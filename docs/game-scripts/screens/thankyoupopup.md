---
id: thankyoupopup
title: Thankyoupopup
description: Displays a pop-up screen to players upon receiving skin rewards, handling animation, item navigation, and gift redemption flow.
tags: [ui, skin, animation, navigation]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: fdd8a405
system_scope: ui
---

# Thankyoupopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ThankYouPopup` is a UI screen component that presents players with received skin gifts in a visually animated interface. It manages the display of skin or currency rewards, handles user interaction for opening gifts or navigating between multiple items, and triggers animations for reveal, transition, and close states. The popup integrates with audio, skin data from `skin_gifts.lua`, and uses `TheInventory` to mark items as opened. It inherits from `Screen`, making it a top-level UI container.

## Usage example
```lua
local items = {
    { item = "some_skin", gifttype = "DEFAULT" },
    { currency = "SPOOLS", currency_amt = 50, gifttype = "DEFAULT" }
}
local popup = ThankYouPopup(items, function()
    print("All gifts processed.")
end)
TheFrontEnd:PushScreen(popup)
```

## Dependencies & tags
**Components used:** None directly (UI-only screen).  
**Dependencies:** `Screen`, `Button`, `ImageButton`, `Text`, `Image`, `Widget`, `UIAnim`, `TEMPLATES`, `SkinGifts`, `skinsutils`.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `items` | table | `nil` | List of gift items (skin or currency) to display. |
| `revealed_items` | table | `{}` | Tracks which items have been opened; keys are 1-based indices. |
| `current_item` | number | `1` | 1-based index of the currently displayed item. |
| `callbackfn` | function | `nil` | Callback invoked when popup closes fully. |
| `can_open` | boolean | `false` | Whether the open button should be enabled. |
| `can_close` | boolean | `false` | Whether the close button should be enabled. |
| `can_left` / `can_right` | boolean | `false` | Whether left/right navigation is allowed. |
| `transitioning` | boolean | `false` | Whether a navigation animation is in progress. |
| `reveal_skin` | boolean | `false` | Set to `true` after a new skin is revealed in update. |

## Main functions
### `ChangeGift(offset)`
* **Description:** Changes the currently displayed gift by a specified offset (e.g., `-1` for previous, `1` for next). Plays appropriate animations (spin, open, or skin loop) and updates visual state. Hides interaction buttons during transition.
* **Parameters:** `offset` (number) — integer delta to apply to `current_item`.
* **Returns:** Nothing.

### `OpenGift()`
* **Description:** Opens the currently displayed item, marks it as revealed, updates `TheInventory`, and triggers the opening animation sequence.
* **Parameters:** None.
* **Returns:** Nothing.

### `GoAway()`
* **Description:** Starts the closing animation sequence, hides UI elements, and invokes the callback before popping the screen from the front-end stack.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Handles state transitions in response to animation events. Manages button visibility, audio cues, and triggers screen exit when closing is complete.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

### `EvaluateButtons()`
* **Description:** Updates button states (show/hide arrows, enable close button) based on current position in the item list and transition state.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetSkinName()`
* **Description:** Sets the displayed name and color for the current item (either skin name or formatted currency), then shows the banner and name text elements.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input for opening, closing, and navigating gifts using `CONTROL_ACCEPT`, `CONTROL_SCROLLFWD`, or `CONTROL_SCROLLBACK`.
* **Parameters:** 
  * `control` (number) — input control code.
  * `down` (boolean) — true if button press (not release).
* **Returns:** boolean — `true` if event was handled.

### `GetHelpText()`
* **Description:** Returns localized help text describing current available actions (e.g., "A to Open", "Left/Right to Change Page").
* **Parameters:** None.
* **Returns:** string — concatenation of localized action hints.

## Events & listeners
- **Listens to:** None (UI screen, no entity events).
- **Pushes:** None.