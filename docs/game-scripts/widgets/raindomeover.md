---
id: raindomeover
title: Raindomeover
description: Renders a dynamic overlay indicating the influence of active rain domes around the player.
tags: [ui, environment, weather]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 80a76f01
system_scope: ui
---

# Raindomeover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`RainDomeOver` is a UI widget that visualizes the cumulative effect of active rain domes in the environment. It calculates the spatial influence of nearby rain domes, blends their contributions based on proximity, and updates the position, scale, and opacity of an on-screen overlay. It interacts with the `raindome` component to query dome radius and position, and responds to world events (`underraindomes` and `exitraindome`) to show or hide itself accordingly.

## Usage example
This widget is typically instantiated automatically by the game and does not need manual initialization. However, for reference:

```lua
local widget = CreateWidget("RainDomeOver", owner)
-- The widget listens to "underraindomes" and "exitraindome" events on owner.inst
-- It updates automatically while active (via OnUpdate) and hides when no domes are active.
```

## Dependencies & tags
**Components used:** `raindome` (accessed via `v.components.raindome:GetActiveRadius()`)  
**Tags:** None identified.

## Properties
No public properties are exposed by this widget. All state is managed internally.

## Main functions
### `OnUpdate(dt)`
*   **Description:** Called periodically while the widget is visible and updating. Computes weighted contributions from all valid rain domes to determine overlay position, scale, and intensity; updates the background image's fade alpha.
*   **Parameters:** `dt` (number) — delta time in seconds since last frame.
*   **Returns:** Nothing.
*   **Error states:** If `self.domes` is `nil` or empty, no updates are applied beyond resetting the background fade alpha to `0`.

## Events & listeners
- **Listens to:**
  - `underraindomes` — fired when rain domes become active; initializes `self.domes` and starts the update loop.
  - `exitraindome` — fired when the player exits the dome-affected area; clears `self.domes`, stops updating, and hides the widget.
- **Pushes:** None.