---
id: endgamedialog
title: Endgamedialog
description: Renders a full-screen dialog overlay for the endgame menu, displaying a customizable message and button set.
tags: [ui, screen, dialog]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 4a9f9c82
system_scope: ui
---

# Endgamedialog

> Based on game build **714004** | Last updated: 2026-03-09

## Overview
`EndGameDialog` is a UI screen component that presents an overlay for the endgame experience. It darkens the background, displays a title and body text (currently hardcoded as a placeholder), and renders a horizontally-aligned menu of buttons passed at construction time. It inherits from `Screen`, meaning it integrates into the global screen stack managed by `TheFrontEnd`.

## Usage example
```lua
local EndGameDialog = require "screens/endgamedialog"
local buttons = {
    { text = "Play Again", cb = function() end },
    { text = "Main Menu", cb = function() end }
}
TheFrontEnd:PushScreen(EndGameDialog(buttons))
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | Image | `nil` | Full-screen black overlay to dim background content. |
| `proot` | Widget | `nil` | Root widget for proportional scaling of dialog contents. |
| `bg` | Image | `nil` | Background panel image (`panel_upsell.tex`). |
| `title` | Text | `nil` | Title text widget using `TITLEFONT`, size `50`. |
| `text` | Text | `nil` | Body text widget using `BODYTEXTFONT`, size `30`, with word wrap enabled. |
| `menu` | Widget | `nil` | Container widget for button layout. |
| `buttons` | table | `nil` | Copy of the button configuration table passed to constructor. |
| `default_focus` | ImageButton | `nil` | Last created button, used for UI focus targeting. |

## Main functions
No publicly exposed functional methods beyond inherited `Screen` behavior (e.g., `Show`, `Hide`, `OnRemove`). The constructor handles all initialization.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  
