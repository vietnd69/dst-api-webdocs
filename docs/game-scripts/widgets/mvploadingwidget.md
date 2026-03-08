---
id: mvploadingwidget
title: Mvploadingwidget
description: Renders a horizontal carousel of MVP (Most Valuable Player) cards displayed during match results, showing player avatars, stats, and themed titles based on the current game mode.
tags: [ui, lobby, match, mvp]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: e1fe865a
system_scope: ui
---

# Mvploadingwidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MVPLoadingWidget` is a UI widget that displays a curated list of MVP players and their performance metrics from the most recent match session. It dynamically constructs and arranges card-style widgets — each representing a player — using lobby results data (from `Settings.match_results` or `TheFrontEnd.match_results`). Cards include player avatars (either via `PlayerBadge` or `PlayerAvatarPortrait`), names, stat titles, score values, and localized descriptions, all arranged in a radial carousel layout. The widget is non-interactive (`SetClickable(false)`) and is typically used during loading screens or post-match result transitions.

## Usage example
```lua
local widget = MakeWidget("MVPLoadingWidget")
widget:Setup()
widget:PopulateData()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Uses `PlayerBadge`, `PlayerAvatarPortrait`, `Text`, `ImageButton`, `ScrollableList`, and `Widget` utilities via `require()`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `list_root` | `Widget` | `nil` | Root container widget for MVP card widgets. Created during construction. |
| `mvp_widgets` | table | `{}` | List of child widgets representing individual MVP cards. Populated by `PopulateData()`. |
| `total_width` | number | `0` | Unused (not updated anywhere). |
| `current_eventid` | string | `string.upper(TheNet:GetServerGameMode())` | Uppercase identifier for the current server game mode (e.g., `"SURVIVAL"`, `"ROGUE"`), used to fetch localized MVP strings. |

## Main functions
### `PopulateData()`
*   **Description:** Clears and rebuilds the carousel of MVP cards based on lobby match results. Dynamically configures each card with player info, stat titles, and visual styling using hardcoded animationbanks, UI textures, and localizable strings (`STRINGS.UI.MVP_LOADING_WIDGET`). Arranges widgets in a radial layout.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Safe no-op if `mvp_cards` is `nil` or empty.

### `SetAlpha(a)`
*   **Description:** Stub method; currently empty.
*   **Parameters:** `a` (number) — intended alpha value (ignored).
*   **Returns:** Nothing.

## Events & listeners
None identified