---
id: dressupavatarpopup
title: Dressupavatarpopup
description: Renders a character dressing-up preview UI with skinned body parts and displays associated player information.
tags: [ui, avatar, skin]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 0fb32aba
system_scope: ui
---

# Dressupavatarpopup

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`DressupAvatarPopup` is a UI widget subclassed from `PlayerAvatarPopup` that displays a character’s currently equipped skins for body, hands, legs, and feet, along with a formatted title string indicating player attribution. It presents a static preview panel used when viewing other players’ character customization. It periodically refreshes skin data by calling `PlayerAvatarData:GetData()` on the associated target entity.

## Usage example
```lua
local data = {
    name = "ThePlayer",
    body_skin = "default",
    hand_skin = "none",
    legs_skin = "none",
    feet_skin = "none"
}
local popup = DressupAvatarPopup(ThePlayer, "ThePlayer", data)
popup:Start()
```

## Dependencies & tags
**Components used:** `playeravatardata` — accessed via `self.target.components.playeravatardata:GetData()` to fetch up-to-date avatar data.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `frame` | widget | `nil` | The main curly-window frame container added during layout. |
| `frame_bg` | widget | `nil` | Background image panel inside the frame. |
| `title`, `title2` | `Text` | `nil` | Title widgets for the character name and attribution. |
| `body_image`, `hand_image`, `legs_image`, `feet_image` | widget | `nil` | Skin preview widgets for each body slot. |
| `close_button` | widget | `nil` | Close button (created only if no controller is attached). |
| `currentcharacter` | any | `nil` | Character instance resolved from avatar data. |
| `player_name` | string | `""` | Player’s name from the data table. |
| `dressed` | boolean | `false` | `true` if any skin slot (body, hand, legs, feet) is equipped. |
| `started` | boolean | `false` | Tracks whether the popup animation has started. |
| `settled` | boolean | `false` | Becomes `true` after the popup slide-in animation completes. |

## Main functions
### `UpdateDisplayName()`
*   **Description:** Updates the popup’s title text to show the character’s name and whether they are dressed, using a localized format string. Adjusts title position if no name is present.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No side effects if `self.title`/`self.title2` or `self.target` are `nil`.

### `Layout(data)`
*   **Description:** Constructs the full visual layout of the popup, including the frame, background, skin preview widgets, separator lines, and optional close button.
*   **Parameters:** `data` (table) — avatar data containing `body_skin`, `hand_skin`, `legs_skin`, and `feet_skin` fields.
*   **Returns:** Nothing.

### `Start()`
*   **Description:** Begins the slide-in animation of the popup and marks it as started. Only executes once per instance.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Early exit if `self.started` is `true`.

### `Close()`
*   **Description:** Initiates the slide-out animation, stops updates, and removes the popup widget from the HUD upon completion.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Early exit if `self.started` is `false`.

### `UpdateData(data)`
*   **Description:** Updates internal state with new avatar data (name, dressed status) and refreshes the display name. Delegates to the base class’s `UpdateData`.
*   **Parameters:** `data` (table) — avatar data with `name`, `body_skin`, `hand_skin`, etc.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called each frame to handle timed refresh of avatar data; fetches updated skin data from the target’s `playeravatardata` component if configured to do so.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.
*   **Error states:** Closes the popup if `playeravatardata:GetData()` returns `nil`.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
