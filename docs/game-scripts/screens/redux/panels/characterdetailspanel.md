---
id: characterdetailspanel
title: Characterdetailspanel
description: Provides a scrolling list of playable characters and launches the character biography screen on selection.
tags: [ui, character, navigation]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: cd83de76
system_scope: ui
---

# Characterdetailspanel

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CharacterDetailsPanel` is a UI widget component that presents a scrollable list of playable characters and handles navigation to the character biography screen upon selection. It is embedded within the main UI hierarchy and relies on the `CharacterSelect` and `CharacterButton` widgets to manage the list and selection state.

## Usage example
```lua
local CharacterDetailsPanel = require "screens/redux/panels/characterdetailspanel"
local parent_screen = some_screen_widget
local panel = CharacterDetailsPanel(parent_screen)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `Refresh()`
*   **Description:** Refreshes the inventory display in the underlying character selection list (typically updates visual state based on current game state or unlocks).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified