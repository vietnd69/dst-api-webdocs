---
id: skinannouncement
title: Skinannouncement
description: Displays a UI widget announcing a newly unlocked skin, including the owner's name, skin name, and interactive functionality.
tags: [ui, skin, announcement]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 159ee6b6
system_scope: ui
---

# Skinannouncement

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SkinAnnouncement` is a UI widget component that visually presents a skin unlock notification. It combines a base ImageButton with custom text (for the unlock message and skin name) and decorative icon elements. It supports timed display with fade-out behavior, focus state resizing, and interactive behavior to open the `SkinsItemPopUp` screen when clicked.

## Usage example
```lua
local announcement = CreateWidget("SkinAnnouncement")
announcement:SetSkinAnnouncementInfo(
    "PlayerName",     -- user_name
    {1, 0, 0},        -- user_colour
    "skin_name",      -- skin_name
    1,                -- alpha
    7,                -- lifetime in seconds
    2                 -- fadetime in seconds
)
announcement:Show()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Sets `self.skin_announcement = true` for identification (e.g., by `EventAnnouncer` logic). No entity tags are added.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | Widget | `self:AddChild(Widget("Root"))` | Root container widget for layout hierarchy. |
| `img_btn` | ImageButton | Created in constructor | Primary image button container for the message text. |
| `skin_txt` | Text | Created in constructor | Text widget displaying the skin name. |
| `icon` | Image | `images/button_icons.xml: item_drop.tex` | Decorative icon element. |
| `icon.bg` | Image | `images/button_icons.xml: circle.tex` | Background circle behind the icon. |
| `font` | string | `UIFONT` | Font used for all text elements. |
| `size` | number | `30` | Default text size. |
| `focus_size` | number | `35` | Text size applied when the widget gains focus. |
| `lifetime` | number | `0` | Remaining display time in seconds before fade-out begins. |
| `fadetime` | number | `0` | Duration of the fade-out period in seconds. |
| `general_alpha` | number | `1` | Current alpha (opacity) applied to all UI elements. |
| `skin_name` | string | `nil` | Internal skin identifier. |
| `user_name` | string | `nil` | Name of the user who unlocked the skin. |
| `user_colour` | table | `nil` | RGB(A) colour for the user. |

## Main functions
### `SetSkinAnnouncementInfo(user_name, user_colour, skin_name, alpha, lifetime, fadetime)`
*   **Description:** Configures the announcement with unlock data (user, skin, timing, and visibility). Sets the message text using `STRINGS.UI.NOTIFICATION.NEW_SKIN_ANNOUNCEMENT`, sets skin text and colour, shows the widget, and starts the update loop.
*   **Parameters:**  
    `user_name` (string) — Name of the user who unlocked the skin.  
    `user_colour` (table) — RGB/RGBA table of colour values.  
    `skin_name` (string) — Internal identifier for the skin (e.g., `"skin_archer"`).  
    `alpha` (number, optional) — Initial alpha; defaults to `1`.  
    `lifetime` (number, optional) — Display duration before fading starts; defaults to `7`.  
    `fadetime` (number, optional) — Duration of fade-out; defaults to `2`.  
*   **Returns:** Nothing.
*   **Error states:** Returns early if `skin_name` or `user_name` is `nil`.

### `SetMessageText(text)`
*   **Description:** Sets the primary message text (e.g., the "PlayerName unlocked" line) on `img_btn`.
*   **Parameters:**  
    `text` (string) — The message string to display.  
*   **Returns:** Nothing.

### `SetSkinText(text)`
*   **Description:** Sets the skin-specific name text on `skin_txt`, and recalculates layout.
*   **Parameters:**  
    `text` (string) — The skin name string (localized via `GetSkinName`).  
*   **Returns:** Nothing.
*   **Error states:** Returns early if `text` is `nil`.

### `SetSkinTextColour(r, g, b, a)`
*   **Description:** Sets the RGBA colour of the skin text (`skin_txt`).
*   **Parameters:**  
    `r`, `g`, `b`, `a` (number) — Red, green, blue, and alpha components (0–1 range).  
*   **Returns:** Nothing.

### `SetGeneralAlpha(alpha)`
*   **Description:** Applies the given alpha value to all text elements, the icon, and the icon background.
*   **Parameters:**  
    `alpha` (number) — Opacity value (0 = invisible, 1 = opaque).  
*   **Returns:** Nothing.

### `SetGeneralFont(font)`
*   **Description:** Updates the font for `img_btn.text` and `skin_txt`, then recalculates layout.
*   **Parameters:**  
    `font` (string) — Font name (e.g., `UIFONT`).  
*   **Returns:** Nothing.
*   **Error states:** Returns early if `font` is `nil`.

### `SetGeneralSize(size)`
*   **Description:** Updates the text size for both message and skin text, then recalculates layout.
*   **Parameters:**  
    `size` (number) — Font size in pixels.  
*   **Returns:** Nothing.
*   **Error states:** Returns early if `size` is `nil`.

### `ClearText()`
*   **Description:** Clears both message and skin text content and refreshes layout.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateSkinTextPosition()`
*   **Description:** Recalculates and updates the positions and sizes of all text and image elements to maintain correct alignment after text changes.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetText()`
*   **Description:** Returns the concatenated string of the message text and skin text.
*   **Parameters:** None.
*   **Returns:** `string` — Combined text, or `"NO MESSAGE TEXT NO SKIN TEXT"` if either is missing.

### `GetTotalRegionSize()`
*   **Description:** Computes the combined width and height of the message and skin text.
*   **Parameters:** None.
*   **Returns:** `number, number` — Width and height in local units.

### `OnUpdate(dt)`
*   **Description:** Handles timed display and fade-out logic. Decrements `lifetime`, computes `alpha_fade` during the fade period, and hides the widget when fully faded.
*   **Parameters:**  
    `dt` (number) — Delta time in seconds since last frame.  
*   **Returns:** Nothing.

### `OnGainFocus()`, `OnLoseFocus()`
*   **Description:** Updates text size to `focus_size` (larger) when focused, or back to `size` when unfocused.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEnable()`, `OnDisable()`
*   **Description:** Enables/disables the image button and skin text widgets.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CopyInfo(source)`
*   **Description:** Copies skin announcement data (user, skin, alpha, timing) from a `source` announcement instance.
*   **Parameters:**  
    `source` (table/Widget) — Must have `user_name`, `user_colour`, `skin_name`, `general_alpha`, `lifetime`, and `fadetime` fields.  
*   **Returns:** Nothing.
*   **Error states:** Returns early if `source` is `nil`.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:** None identified.  
  (Note: Clicking the button triggers a `TheFrontEnd:PushScreen(...)` call directly, not via `inst:PushEvent`.)