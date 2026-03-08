---
id: achievementspanel
title: AchievementsPanel
description: Renders a scrollable panel displaying achievements for a specific event or season in the game UI.
tags: [ui, achievements, panel]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 72ed9e6b
system_scope: ui
---

# AchievementsPanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`AchievementsPanel` is a UI widget responsible for rendering a scrollable list of achievements related to a specific event or season. It dynamically builds and displays achievement rows using localized strings and progress data from the `EventAchievements` system. The panel supports multiple visual themes depending on overrides (e.g., Quagmire-style, Lava Arena, or default). It acts as a container that manages layout and focus delegation to its internal scrolling grid.

## Usage example
```lua
local panel = AchievementsPanel("summer_festival", nil, {
    primary_font_colour = UICOLOURS.HIGHLIGHT_GOLD,
    no_title = false,
    offset_x = 10,
    offset_y = -20,
})
panel:SetPosition(0, 0)
AddToWorld(panel)
```

## Dependencies & tags
**Components used:** None (pure UI widget with no `Component` involvement)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `overrides` | table | `{}` | Configuration overrides for styling and layout (e.g., `offset_x`, `no_title`, `quagmire_gridframe`, `lavaarena2_gridframe`). |
| `achievements_root` | `Widget` | — | Root container widget for the panel's elements. |
| `grid` | `Widget` (ScrolledGrid) | — | The scrolling grid containing individual achievement rows. |
| `dialog` | `Widget` | — | Optional background frame (when not using Quagmire or Lava Arena layout). |
| `focus_forward` | `Widget` | `grid` | The widget to receive focus forwarding. |
| `default_focus` | `Widget` | `grid` | The widget to be focused by default. |
| `parent_default_focus` | `Widget` | `self` | The parent widget to be focused by default if no child is focused. |

## Main functions
### `AchievementsPanel(festival_key, season, overrides)`
*   **Description:** Constructor function that initializes the panel UI. Creates the root container and a grid of achievements, adapting layout based on provided overrides. Calls `_BuildAchievementsExplorer` to generate the scrollable content.
*   **Parameters:** 
    *   `festival_key` (string) — Identifier for the event (e.g., `"summer_festival"`), used to fetch localized strings and achievement data.
    *   `season` (string or `nil`) — Optional season identifier (e.g., `"winter"`), used for seasonal event filtering.
    *   `overrides` (table or `nil`) — Optional table of layout/style overrides (e.g., `quagmire_gridframe`, `primary_font_colour`).
*   **Returns:** Nothing (constructs `self` as the instance).

### `_BuildAchievementsExplorer(current_eventid, season)`
*   **Description:** Helper function that builds and returns a `ScrollingGrid` widget containing all achievements for the given event/season. Processes achievement categories and data via `EventAchievements`, constructs UI rows for categories and individual achievements, and returns the configured grid.
*   **Parameters:** 
    *   `current_eventid` (string) — Event identifier used to look up strings and icons.
    *   `season` (string or `nil`) — Season identifier for filtering.
*   **Returns:** `ScrollingGrid` widget instance. The grid includes scroll controls and pre-built rows with achievement data.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.