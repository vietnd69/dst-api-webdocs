---
id: wxplobbypanel
title: Wxplobbypanel
description: Manages the UI panel displayed after a match to show XP progression, earned details, and unlocked achievements.
tags: [ui, xp, achievement, lobby]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: c61b4f09
system_scope: ui
---

# WxpLobbyPanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WxpLobbyPanel` is a UI widget responsible for presenting the post-match experience progress screen. It displays XP gain, level-up animations, and achievements unlocked during the match. The panel is initialized with player match data (`profile` and `Settings.match_results`) and orchestrates animations for details and achievements over time. It interacts with `wxputils` for XP calculations, `EventAchievements` for achievement tracking, and various UI components (e.g., `WxpBar`, `Text`, `Image`) to render dynamic content.

## Usage example
```lua
local WxpLobbyPanel = require "widgets/redux/wxplobbypanel"
local panel = WxpLobbyPanel(profile, function()
    print("Animation complete")
end)
TheFrontEnd:AddScreen(panel)
```

## Dependencies & tags
**Components used:** `wxputils` (for XP and level calculations), `EventAchievements` (for achievement management), `TheNet` (for server/match context), `TheFrontEnd` (for sound and global UI state), `TheRecipeBook` (for food discovery UI).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | `nil` | Player profile passed during construction. |
| `on_anim_done_fn` | function | `nil` | Callback executed when the full animation sequence completes. |
| `wxp` | table | `{}` | Container for match XP data, including `new_xp`, `match_xp`, `old_xp`, and `achievements`. |
| `levelup` | boolean | `false` | Indicates if the player leveled up during the match. |
| `current_eventid` | string | `TheNet:GetServerGameMode()` | Identifier for the current event mode (e.g., `"lavaarena"`). |
| `is_updating` | boolean | `false` | `true` while XP/achievement details are animating. |
| `is_animation_done` | boolean | `false` | `true` after `OnCompleteAnimation()` has run. |
| `detail_index` | number | `1` | Index tracking which XP detail is currently displayed. |
| `displayinfo` | table | `{ timer = 0, duration = 0, showing_level = 0 }` | State for the XP progression animation. |
| `displayachievements` | table | `{}` | List of rendered achievement widgets. |
| `wxpbar` | WxpBar widget | `nil` | Root container for XP bar and associated UI elements. |
| `details_widget` | Widget | `nil` | Container for XP detail text (name, XP value, label). |
| `achievement_root` | Widget | `nil` | Container for rendered achievement icons. |
| `rank`, `nextrank` | text widgets | `nil` | References to rank display elements from `wxpbar`. |
| `detail_name_textbox`, `detail_wxp_textbox`, `detail_wxplabel_textbox` | Text widgets | `nil` | Sub-components of `details_widget` for dynamic text. |
| `leveluptext` | Text widget | `nil` | "LEVEL UP" text shown on level-up. |

## Main functions
### `DoInit(nosound)`
*   **Description:** Initializes the panel's core UI structure (XP bar, rank displays, details widget, achievement root) and starts the XP fill sound if `nosound` is `false`. Sets initial XP/rank based on `old_xp`.
*   **Parameters:** `nosound` (boolean) — If `true`, skip sound playback.
*   **Returns:** Nothing.

### `ShowAchievement(achievement, animate)`
*   **Description:** Renders a single achievement icon with optional tint animation. Handles food discoveries, match goals, and standard achievements, applying appropriate icons, textures, and hover text.
*   **Parameters:**  
    `achievement` (table) — Contains `desc`, `val`, and metadata (`_is_discovery`, `_is_achievement`, `is_match_goal`).  
    `animate` (boolean) — If `true`, applies a fade-in tint animation over `LEVELUP_TIME` seconds.
*   **Returns:** Nothing.

### `SetRank(rank, levelup, next_level_xp)`
*   **Description:** Updates the rank display in `wxpbar`. If `levelup` is `true`, triggers a level-up animation (scaling text, rank pulses, glow effect).
*   **Parameters:**  
    `rank` (number) — New rank/level.  
    `levelup` (boolean) — Whether the rank increased.  
    `next_level_xp` (number) — XP needed for the next rank.
*   **Returns:** Nothing.

### `_BuildGameStats()`
*   **Description:** Constructs the `details_widget` containing text fields for XP detail name, value, and label ("WXP"). Hidden by default.
*   **Parameters:** None.
*   **Returns:** `gamestats` (Widget) — Container widget with three child text elements.

### `IsAnimating()`
*   **Description:** Reports whether the panel is still animating details.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `is_animation_done` is `false`.

### `SkipAnimation()`
*   **Description:** Immediately completes the animation by invoking `OnCompleteAnimation()`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnCompleteAnimation()`
*   **Description:** Finalizes the panel state: hides the details widget, stops the fill sound, displays earned box messages (if applicable), reveals any remaining achievements, and sets the final rank/XP values.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RefreshWxpDetailWidgets()`
*   **Description:** Updates the `details_widget` to show the current XP detail (name and value), triggers its animation (scale/fade), and unlocks the corresponding achievement icon if present.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Drives the main animation loop. Interpolates XP display, handles level-up triggers (sound, rank pulse), and cycles through XP details based on elapsed time.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing. Exits early if `is_updating` is `false`.

## Events & listeners
- **Listens to:** Internal timers via `inst:DoTaskInTime` (for delayed state changes).
- **Pushes:** None identified (relies on callbacks like `on_anim_done_fn`).