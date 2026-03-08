---
id: topmodspanel
title: Topmodspanel
description: Displays a scrolling list of randomly selected top mods from the workshop, with clickable links and section headers in the Mods screen UI.
tags: [ui, mods, grid]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: cb3d9784
system_scope: ui
---

# Topmodspanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TopModsPanel` is a UI widget that renders a titled section containing clickable links to top workshop mods. It fetches mod statistics via `TheSim:QueryTopMods`, randomly selects a subset of mods, and populates a grid of `ListItemBackground` buttons with mod titles and URLs. It is used within the `ServerCreationScreen` and related mod management UIs.

## Usage example
```lua
local topmodspanel = TopModsPanel()
-- Typically added as a child to a parent widget (e.g., root of a screen)
parent_widget:AddChild(topmodspanel)
-- The panel automatically queries mod stats on construction
-- No further action needed; mod links update automatically upon data arrival
```

## Dependencies & tags
**Components used:** None (this is a UI widget, not an ECS component; it operates entirely in the UI layer)
**Tags:** Adds no entity tags; uses internal widget tags only (`"TopModsPanel"`, `"root"`, `"topmods"`, `"title_root"`, `"modlink_grid"`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | `Widget` | `nil` | Root widget container; positioned at (0, -60). |
| `topmods_panel` | `Widget` | `nil` | Sub-panel housing mod links and title. |
| `morebutton` | `StandardButton` or `nil` | `nil` | Button to open full mods list (omitted on WIN32_RAIL platform). |
| `toptitle` | `Widget` | `nil` | Section header widget containing title text and divider. |
| `modlinks` | `table` of `ListItemBackground` | `{}` | Array of up to 9 clickable mod link widgets. |
| `modlink_grid` | `Grid` | `nil` | Grid manager arranging mod links vertically. |

## Main functions
### `GenerateRandomPicks(num, numrange)`
* **Description:** Generates a list of unique random indices between `1` and `numrange`, used to randomly sample mod entries.
* **Parameters:**  
  `num` (number) – Number of random picks to generate.  
  `numrange` (number) – Upper bound (inclusive) of index range.
* **Returns:** `table` – List of unique random indices.
* **Error states:** Returns empty table if `num > numrange`.

### `OnStatsQueried(success, json_body)`
* **Description:** Callback invoked when workshop mod stats query completes. Parses the JSON result, randomly selects mods, sanitizes and truncates titles, and updates mod link widgets with titles and URLs.
* **Parameters:**  
  `success` (boolean) – Indicates if the HTTP request succeeded.  
  `json_body` (string) – Raw JSON response from the workshop.
* **Returns:** Nothing.
* **Error states:** Exits early if entity is invalid, request failed, JSON is malformed/empty, or `modnames` table is missing/empty.

### `DoFocusHookups()`
* **Description:** Configures keyboard/controller focus navigation between the “More Mods” button and the topmost/bottommost mod links.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `morebutton` is `nil` (e.g., on WIN32_RAIL builds).

## Events & listeners
- **Listens to:** None (uses `TheSim:QueryTopMods` for async callback, but no `inst:ListenForEvent` calls).
- **Pushes:** None (does not fire custom events).