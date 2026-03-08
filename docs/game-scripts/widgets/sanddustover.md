---
id: sanddustover
title: SandDustOver
description: Renders a looping dust animation overlay on the screen, typically used to indicate environmental conditions like sandstorms or dusty areas.
tags: [ui, fx, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d3d3a795
system_scope: ui
---

# SandDustOver

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SandDustOver` is a UI widget that displays a continuous looping animation simulating sand/dust particles. It inherits from `UIAnim` and is configured to center on screen, use a fixed-screen scale mode, and play the `"dust_loop"` animation indefinitely. This component is typically used in response to in-game events (e.g., sandstorms in the Desert biome) to visually communicate environmental changes.

## Usage example
```lua
local SandDustOver = require "widgets/sanddustover"
local overlay = SandDustOver(ThePlayer)
TheSim:AddWidget(overlay)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `GAMESIMULATIONOBJECT` or `nil` | passed via constructor | The owner entity (e.g., `ThePlayer`) for context; may be used for scoping or future logic, but not directly referenced in current code. |

## Main functions
No main functions are defined beyond the constructor and inherited `UIAnim` methods.

## Events & listeners
None identified