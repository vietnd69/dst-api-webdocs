---
id: morguescreen
title: Morguescreen
description: A UI screen component that displays historical player death records (obituaries) and player encounter history in Don't Starve Together.
tags: [ui, history, screen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 569cec99
system_scope: ui
---

# Morguescreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`MorgueScreen` is a UI screen component that presents a player's character death history (obituaries) and player encounter data (e.g., with multiplayer participants). It inherits from `Screen` and provides tabbed navigation between two sections: "Obituaries" and "Encounters". The component manages scrolling grids of historical records and integrates with `Morgue`, `PlayerHistory`, and `TheNet` systems to display local and networked data.

## Usage example
```lua
-- Opening the morgue screen from the main menu or pause screen
TheFrontEnd:FadeOut(function()
    TheFrontEnd:SetScreen(MorgueScreen, prev_screen, user_profile)
end)
```

## Dependencies & tags
**Components used:** None (this is a UI screen, not an ECS component).  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `BuildObituariesTab()`
* **Description:** Constructs and returns the UI container for the obituaries tab, which displays past character deaths in a scrolling list.  
* **Parameters:** None.  
* **Returns:** `Widget` — the root widget containing the obituaries list and headers.  

### `BuildEncountersTab()`
* **Description:** Constructs and returns the UI container for the encounters tab, which displays a list of other players encountered.  
* **Parameters:** None.  
* **Returns:** `Widget` — the root widget containing the encounters list.  

### `UpdatePlayerHistory()`
* **Description:** Refreshes the encounter list data from `PlayerHistory:GetRows()` and updates the scrolling grid.  
* **Parameters:** None.  
* **Returns:** Nothing.  

### `_Close()`
* **Description:** Disables the screen and triggers a fade-in transition back to the previous screen.  
* **Parameters:** None.  
* **Returns:** Nothing.  

## Events & listeners
- **Listens to:** None (this screen registers no custom event listeners).
- **Pushes:** None (this screen does not fire custom events).