---
id: cinematicspanel
title: CinematicsPanel
description: Manages the UI panel for launching cinematic and navigation options (intro movie, credits, video channel) in the frontend.
tags: [ui, frontend]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 55e1286b
system_scope: ui
---

# CinematicsPanel

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CinematicsPanel` is a UI panel widget that provides access to cinematic and related frontend screens. It is typically presented as part of a larger options or menu interface, offering interactive buttons to play the intro movie, view credits, and open the official video channel. It extends `Widget` and is not tied to any entity in the Entity Component System; instead, it operates purely in the UI layer during frontend navigation.

## Usage example
```lua
-- Example usage in a frontend screen context
local CinematicsPanel = require "screens/redux/panels/cinematicspanel"
local panel = CinematicsPanel(parent_screen)
-- The panel is automatically wired with buttons and layout
-- and activated by parent_screen when displayed
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `parent_screen` | screen | `nil` | Reference to the parent screen that instantiated this panel. |
| `root` | Widget | Created in constructor | Root container widget for the panel's UI hierarchy. |
| `dialog` | Widget | Created in constructor | Outer container (rectangle window) for the panel content. |
| `title_root` | Widget | Created in constructor | Container for the panel title and divider. |
| `buttons` | table | Empty table | Array of button widgets (StandardButton), populated in constructor. |
| `grid` | Grid | Created in constructor | Grid used to arrange the buttons horizontally. |
| `focus_forward` | Widget | `self.grid` | The widget that receives focus when this panel is active. |

## Main functions
### `CinematicsPanel(parent_screen)`
* **Description:** Constructor. Initializes the UI layout, title, and interactive buttons for the intro movie, credits, and optional video channel (if Steam is detected). Attaches to `parent_screen` and sets up the focus chain.
* **Parameters:** `parent_screen` (screen) — The parent UI screen to return to after navigating away (e.g., credits or movie dialog).
* **Returns:** `CinematicsPanel` instance.
* **Error states:** None documented.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified