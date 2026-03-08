---
id: serverpausewidget
title: Serverpausewidget
description: Displays a text message on screen indicating the reason for server or world pause (e.g., host pausing, autopause, or player-initiated pause).
tags: [ui, network, pause]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 43d437d9
system_scope: ui
---

# Serverpausewidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ServerPauseWidget` is a UI component that presents a temporary overlay message explaining why the game world or server is paused. It inherits from `Widget` and displays localized text using the `Text` widget. It does not manage pause logic itself but serves as a visual indicator in response to pause events triggered elsewhere (e.g., by the host, by `autopause`, or by the local player). It uses `STRINGS.UI.PAUSEMENU` for localized strings and dynamically adjusts its visibility and content based on the pause source.

## Usage example
```lua
local serverPauseWidget = AddChildToRoot(ServerPauseWidget())
-- Show pause due to host action
serverPauseWidget:UpdateText("[Host]")
-- Hide the widget
serverPauseWidget:UpdateText(nil)
-- Adjust screen offset (e.g., for multi-monitor setups)
serverPauseWidget:SetOffset(0, 100)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags.  
**External dependencies:** `Widget`, `Text`, `STRINGS.UI.PAUSEMENU`, `TheNet:GetLocalUserName()`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | `Widget` | Created in constructor | Root container widget for layout purposes. |
| `text` | `Text` | Created in constructor | Text display showing the current pause reason. |

## Main functions
### `UpdateText(source)`
*   **Description:** Updates the displayed text based on the pause source, and shows/hides the widget accordingly. Called whenever the pause state changes.
*   **Parameters:** `source` (string or `nil`) – Indicates who or what triggered the pause:
    *   `"autopause"` → displays `AUTOPAUSE_TEXT`
    *   `"[Host]"` → displays `HOSTPAUSED_TEXT`
    *   `TheNet:GetLocalUserName()` → displays `SELFPAUSED_TEXT`
    *   Any other non-`nil` string → uses `PLAYERPAUSED_TEXT` with `{player = source}` substituted
    *   `nil` → hides the widget and clears the text.
*   **Returns:** Nothing.
*   **Error states:** None. Displays empty string and hides widget if `source == nil`.

### `SetOffset(x, y)`
*   **Description:** Repositions the root widget (and thus the text) relative to its anchor (middle-top). Useful for dynamic screen layout adjustments.
*   **Parameters:** `x` (number), `y` (number) – offset coordinates in pixels.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified