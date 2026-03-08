---
id: endofmatchpopup
title: Endofmatchpopup
description: Renders a standardized popup UI overlay showing match-ending title and body text in the Redux UI framework.
tags: [ui, match, overlay]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 3e54ccfd
system_scope: ui
---

# Endofmatchpopup

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`EndOfMatchPopup` is a lightweight UI widget that displays a title and body text centered on screen to communicate the end of a match or session. It inherits from `Widget` and constructs a simple two-line message overlay using predefined fonts, colours, and layout. It is intended for transient, high-visibility notifications (e.g., post-match summaries, event conclusions), and does not interact with gameplay state or components.

## Usage example
```lua
local EndOfMatchPopup = require "widgets/redux/endofmatchpopup"

local popup = EndOfMatchPopup(owner, {
    title = "Season Complete",
    body  = "You've earned the Bronze Badge!"
})
-- The popup is added to the UI tree automatically during construction
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity that owns this popup (often the player or global UI root); not used beyond assignment. |
| `proot` | widget | `nil` | The root container widget that holds the visual elements (title and body text). |

## Main functions
### `EndOfMatchPopup(owner, data)`
*   **Description:** Constructor. Instantiates the popup UI, creates a root widget, and adds two text elements (title and body) using configured font, size, position, and colour.
*   **Parameters:**
    *   `owner` (entity) – Entity associated with the popup (retained as `self.owner` but not used internally).
    *   `data` (table) – Table with two keys: `title` (string), `body` (string).
*   **Returns:** Nothing. The constructed widget is returned implicitly via `Class`.
*   **Error states:** May fail if `data.title` or `data.body` is missing or not a string, resulting in Lua runtime errors.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None