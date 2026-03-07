---
id: animal_track
title: Animal Track
description: Represents a temporary track marker placed on the ground that slowly fades out over time.
tags: [environment, visual, world]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c19863a4
system_scope: environment
---

# Animal Track

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`animal_track` is a lightweight prefab that visually represents an animal track on the ground. It is used to indicate recent animal activity (e.g., koalefant, lightning goat, warg). The track appears as a static animation and automatically fades out and removes itself after 15 seconds. It is only instantiated on the master simulation and does not persist across sessions.

## Usage example
```lua
-- Example usage (typically handled internally by game logic)
local track = Prefab("animal_track", fn, assets)()
track.Transform:SetPosition(x, y, z)
track.AnimState:PlayAnimation("idle")
-- The track automatically fades out via internal periodic task
```

## Dependencies & tags
**Components used:** `inspectable`, `transform`, `animstate`, `network`
**Tags:** Adds `track`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_specialinfo` | string | `"ANIMALTRACK"` | Marker for scrapbook integration |
| `scrapbook_adddeps` | table | List of animal prefabs | Dependencies listed for scrapbook entry generation |
| `_fadetime` | number | `15` | Remaining fade-out time in seconds |
| `_basealpha` | number | `1` | Base opacity value used during fading |
| `persists` | boolean | `false` | Indicates this entity is not saved to disk |

## Main functions
### `SetBaseAlpha(base)`
* **Description:** Updates the base alpha value used for fading and immediately re-applies the current opacity level.
* **Parameters:** `base` (number) — new base alpha value between `0` and `1`.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
None identified.

## Constants
| Constant | Value | Description |
|----------|-------|-------------|
| `FADE_DURATION` | `15` | Total time (seconds) before the track fully fades and is removed |
| `FADE_DT` | `FRAMES` | Time step (in frames) used for periodic fade updates |