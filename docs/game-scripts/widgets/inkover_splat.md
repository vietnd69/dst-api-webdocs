---
id: inkover_splat
title: Inkover Splat
description: Displays a screen-space ink splat animation overlay during specific in-game events.
tags: [ui, fx, visual]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 72d03a02
system_scope: ui
---

# Inkover Splat

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`InkOver_splat` is a UI-based animation widget that renders a temporary ink-splat visual effect on the screen. It inherits from `UIAnim` and is used to provide localized visual feedback (e.g., during transitions, interactions, or cinematic moments). The component manages a single animation loop with predefined timing and playback modes, and its visibility is controlled via explicit `Flash()` calls.

## Usage example
```lua
local InkOver_splat = require "widgets/inkover_splat"
local splat = InkOver_splat(owner)

-- Trigger the ink splat with default animation
splat:Flash()

-- Optionally specify a different animation name
splat:Flash("ink_special")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity this splat is associated with (not actively used in logic, likely for context). |
| `time` | number | `GetTime()` | Internal timestamp used for tracking when the splat was last triggered. |

## Main functions
### `Flash(anim)`
*   **Description:** Shows the ink splat animation and resets its playback to the specified animation. If `anim` is not provided, defaults to `"ink"`.
*   **Parameters:** `anim` (string, optional) – Name of the animation to play.
*   **Returns:** Nothing.
*   **Error states:** None; silently defaults to `"ink"` if `anim` is `nil`.

## Events & listeners
None identified