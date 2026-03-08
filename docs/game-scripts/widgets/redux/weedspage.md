---
id: weedspage
title: Weedspage
description: A UI widget container for displaying weed-related content in the game's interface.
tags: [ui, widget]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 3dfe56b5
system_scope: ui
---

# Weedspage

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WeedsPage` is a UI widget class used to structure and organize content related to weeds in the game's user interface. It extends the base `Widget` class and is intended to serve as a container for weed-specific UI elements, though the current implementation is minimal and does not initialize any child widgets or set up event handlers. It accepts a parent widget and a boolean flag (`ismodded`) during construction, suggesting support for differentiating between base-game and modded weed content.

## Usage example
```lua
local WeedsPage = require("widgets/redux/weedspage")
local parent_widget = some_widget -- existing UI container
local page = WeedsPage(parent_widget, true) -- create a modded weeds page
```

## Dependencies & tags
**Components used:** None (no components attached via `inst:AddComponent`).  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `WeedsPage(parent, ismodded)`
*   **Description:** Constructor for the `WeedsPage` widget. Initializes the widget with the name `"WeedsPage"` and stores the parent widget reference implicitly through the base `Widget` class. The `ismodded` parameter is accepted but not used in the current implementation.
*   **Parameters:**  
    - `parent` (Widget) – The parent UI widget to which this page belongs.  
    - `ismodded` (boolean) – Flag indicating whether the weed content is modded; currently unused.
*   **Returns:** Nothing (constructs and returns a `WeedsPage` instance).
*   **Error states:** None identified.

## Events & listeners
None.