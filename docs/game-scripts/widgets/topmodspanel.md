---
id: topmodspanel
title: Topmodspanel
description: Manages the display and interaction logic for the top mod rankings and featured mod in the server creation screen's mods tab.
tags: [ui, mod, navigation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 25cf13de
system_scope: ui
---

# Topmodspanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TopModsPanel` is a UI widget that displays a curated list of top mod rankings and a featured mod, retrieved from the game's statistics service. It is part of the server creation screen's mods tab and provides clickable entries that open mod workshop pages in the browser. The panel includes animated slide-in/slide-out behavior and keyboard focus navigation among its interactive elements.

## Usage example
```lua
local topmods = TopModsPanel(servercreationscreen)
widget:AddChild(topmods)
topmods:ShowPanel()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `servercreationscreen` | table | required argument | Parent screen object used for focus navigation. |
| `topmods_panel` | Widget | `nil` | Root container widget for the panel UI elements. |
| `modlinks` | table | `{}` | Array of 5 `TextButton` widgets for displaying top mod titles. |
| `featuredbutton` | TextButton | `nil` | Button widget for the highlighted featured mod. |
| `started` | boolean | `false` | Internal state flag indicating if the panel is active for animation. |
| `settled` | boolean | `false` | Internal state flag indicating if the panel has finished animating into position. |
| `current_speed` | number | `0` | Current vertical animation speed (pixels/second). |
| `current_x_pos` | number | `0` | Current horizontal screen position. |
| `start_x_pos` | number | `0` | Starting position for the slide-in animation. |
| `target_x_pos` | number | `0` | Target final position after animation. |

## Main functions
### `ShowPanel()`
* **Description:** Initiates the slide-in animation for the panel and makes it visible. Resets animation state and begins the update loop.
* **Parameters:** None.
* **Returns:** Nothing.

### `HidePanel()`
* **Description:** Initiates the slide-out animation to hide the panel. Stops animation logic after the panel exits the screen.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Handles smooth animated movement (slide-in/slide-out) based on `started` state. Implements physics-based interpolation with bounce settling.
* **Parameters:** `dt` (number) – Delta time in seconds since last frame.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; assumes valid `dt` input and active panel state.

### `OnStatsQueried(result, isSuccessful, resultCode)`
* **Description:** Processes JSON results from the `TheSim:QueryStats` call to populate mod titles and links. Parses ranked mod data and sets up clickable buttons for top mods and the featured mod.
* **Parameters:**  
  `result` (string) – Raw JSON response from the stats query.  
  `isSuccessful` (boolean) – Whether the request succeeded.  
  `resultCode` (number) – HTTP-like result code.  
* **Returns:** Nothing.
* **Error states:** Returns early if `inst` is invalid, `result` is empty/unparseable, or JSON parsing fails.

### `GenerateRandomPicks(num, numrange)`
* **Description:** Generates a list of unique random indices within `1..numrange` for selecting top mods from the ranked list.
* **Parameters:**  
  `num` (number) – Number of unique picks required.  
  `numrange` (number) – Upper bound of the range to pick from.  
* **Returns:** (table) – List of `num` unique integers in `[1, numrange]`.

### `DoFocusHookups()`
* **Description:** Configures keyboard focus navigation between panel elements (top mod links, featured button, more button).
* **Parameters:** None.
* **Returns:** Nothing.

### `SetModsTab(tab)`
* **Description:** Sets the parent mods tab reference for proper cross-tab focus movement.
* **Parameters:** `tab` (table) – The parent `ModsTab` UI component.
* **Returns:** Nothing.

### `MoreWorkshopMods()`
* **Description:** Opens the DST workshop page in the system browser.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified