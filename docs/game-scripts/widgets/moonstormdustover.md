---
id: moonstormdustover
title: Moonstormdustover
description: Creates a screen-space visual overlay using the 'moonstorm_over' animation bank to depict dust effects during a moonstorm event.
tags: [ui, fx, visual, overlay]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 80ba51c1
system_scope: ui
---

# Moonstormdustover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MoonstormDustOver` is a UI widget that renders a looping animation over the entire screen to visually represent dust particles during a moonstorm event. It inherits from `UIAnim`, uses fixed-screen scaling, and is centered using middle anchors. This component is purely visual and does not interact with game logic directly.

## Usage example
```lua
local MoonstormDustOver = require "widgets/moonstormdustover"
local overlay = MoonstormDustOver(ThePlayer)
TheFrontEnd:AddWidget(overlay)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `TheWorld` or `Entity` | passed to constructor | The entity (typically `ThePlayer` or `TheWorld`) that owns/creates this overlay instance. Not used internally beyond assignment. |

## Main functions
*No public functions beyond inherited `UIAnim` methods.* This widget does not define additional public methods.

## Events & listeners
None identified