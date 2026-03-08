---
id: wagpunkui_distmeter
title: Wagpunkui Distmeter
description: A UI animation widget that displays a visual distance meter using the `wagstaff_armor_target` build and animation.
tags: [ui, animation, visual]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: c5d98e52
system_scope: ui
---

# Wagpunkui Distmeter

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Wagpunkui_distancemeter` is a specialized UI widget derived from `UIAnim` that renders a static animation for visual feedback — likely representing a distance-based indicator (e.g., targeting range for the Wagstaff armor set). It is constructed with a fixed bank and build (`wagstaff_armor_target`) and plays the `distance_meter` animation in a non-paused manner.

## Usage example
```lua
local Wagpunkui_distancemeter = require "widgets/wagpunkui_distmeter"
local meter = Wagpunkui_distancemeter(ThePlayer)
ThePlayer:AddChild(meter)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `owner` (passed into constructor) | The entity associated with this meter; retained for context but not actively used beyond storage. |

## Main functions
### `Class(function(self, owner) ... end)`
*   **Description:** Constructor for `Wagpunkui_distancemeter`. Initializes the widget as a non-interactive UI animation tied to the `wagstaff_armor_target` asset.
*   **Parameters:** `owner` (`Entity`) — the entity the meter belongs to (typically the player).
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
None identified