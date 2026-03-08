---
id: wagpunkui_overlay
title: Wagpunkui Overlay
description: Renders a background overlay animation used in the Wagpunk UI.
tags: [ui, animation, overlay]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 6972eda4
system_scope: ui
---

# Wagpunkui Overlay

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Wagpunkui_overlay` is a UI widget that displays a static background animation (`wagpunk_over`) for the Wagpunk UI. It inherits from `UIAnim`, sets up a fixed-screen non-dynamic scaling mode, and centers itself on the screen. It is intended for visual presentation only and does not interact with gameplay systems or other components.

## Usage example
```lua
local Wagpunkui_overlay = require "widgets/wagpunkui_overlay"
local overlay = Wagpunkui_overlay(TheFrontEnd)
overlay:AddToScreen()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `Wagpunkui_overlay(owner)`
*   **Description:** Constructor function. Initializes the overlay widget with the Wagpunk-specific animation bank and build.
*   **Parameters:** `owner` (widget/entity) - the UI owner or screen context (typically `TheFrontEnd`).
*   **Returns:** An instance of `Wagpunkui_overlay`.
*   **Error states:** None identified.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified