---
id: obituariespanel
title: Obituariespanel
description: Renders a scrollable list of player death records (obituaries) in the morgue screen UI.
tags: [ui, morgue, death, list]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 409309c3
system_scope: ui
---

# Obituariespanel

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ObituariesPanel` is a UI widget component that displays a scrolling list of player death records retrieved from `Morgue:GetRows()`. It renders each obituary row with structured columns: days survived, deceased character, cause of death, and server name (mode). The panel uses a custom scrolling grid, dynamic text truncation, localized strings, and supports both keyboard and controller input via focus handling.

## Usage example
```lua
local ObituariesPanel = require "screens/redux/panels/obituariespanel"
local parent_screen = -- a valid screen instance
local panel = ObituariesPanel(parent_screen)
-- The panel is automatically initialized and integrated into the parent screen's widget hierarchy
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags to entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `parent_screen` | widget | `nil` | The screen that owns this panel; used to access context like `obits_scroll_list`. |
| `morgue` | table | `Morgue:GetRows()` | The list of obituary data rows (loaded during construction). |
| `root` | widget | `nil` | Root widget container for the panel. |
| `dialog` | widget | `nil` | The main nineslice-window container. |
| `obits_scroll_list` | widget | `nil` | The scrolling grid widget rendering obituaries. |
| `focus_forward` | widget | `self.obits_scroll_list` | The widget that receives focus when this panel gains focus. |

## Main functions
### `DoInit()`
* **Description:** Initializes the scrolling grid widget that renders the obituaries. Must be called after constructor to build the UI content.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
*This component does not define or respond to any game events.*