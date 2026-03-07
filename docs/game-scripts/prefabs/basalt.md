---
id: basalt
title: Basalt
description: Generates static, decorative rock obstacles with randomized animations and visual variation in the world.
tags: [environment, static, visual]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7e9d1dd7
system_scope: environment
---

# Basalt

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`basalt` is a Prefab factory function used to create static, non-interactive rock obstacles in the game world. These prefabs (`basalt` and `basalt_pillar`) are decorative environmental props that appear in locations like the Caverns and provide visual texture. They use physics, animation, and map icons, but have no gameplay behavior beyond serving as static blockers. They integrate with the world’s lighting, snow-cover, and lunar hail systems via helper functions.

The prefabs are instantiated via `makebasalt()` with an animation sequence table (e.g., `{"block1", "block4", "block2"}` for standard basalt), and support save/load via custom `onsave`/`onload` callbacks to preserve animation state.

## Usage example
The prefabs are registered and instantiated internally by the game; manual instantiation is rarely needed. For example, a mod could spawn one as follows:
```lua
local basalt = Prefab("basalt", makebasalt({"block1", "block4", "block2"}), assets)
local inst = basalt()
inst.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`, `inspectable`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animname` | string | `nil` | The animation sequence name selected at spawn (e.g., `"block1"`, `"block3"`). |
| `scrapbook_anim` | string | `nil` | Copy of `animname`, used for scrapbook display. |
| `components.inspectable.nameoverride` | string | `"BASALT"` | Override label used in tooltip/inspect UI. |

## Main functions
No custom public functions are defined in this file. Core behavior is implemented via prefab callbacks and helper functions (`MakeObstaclePhysics`, `MakeSnowCovered`, `SetLunarHailBuildupAmountLarge`, etc.).

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
