---
id: grottowaterfallsoundcontroller
title: Grottowaterfallsoundcontroller
description: Manages dynamic spatial audio for grotto waterfalls by tracking nearby pools and assigning sound emitters to the closest valid ones.
tags: [audio, environment, map]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5e5e8c4c
system_scope: audio
---

# Grottowaterfallsoundcontroller

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Grottowaterfallsoundcontroller` is a map-level component responsible for coordinating dynamic waterfall audio in grotto environments. It tracks large and small grotto pools, manages a fixed pool of three sound-emitter prefabs (`grottopool_sfx`), and dynamically assigns them to the nearest valid pools relative to the player. Audio volume is spatially adjusted and cross-faded to provide smooth transitions when emitter assignments change.

The component interacts with the `fader` component on its internal sound emitters to smoothly transition volume levels and positions using `Fade` and `StopAll` methods.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("grottowaterfallsoundcontroller")
-- The component automatically initializes 3 emitters and begins periodic pool tracking.
-- No further manual setup is required.
```

## Dependencies & tags
**Components used:** `fader` (via sound emitters created by the component)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The entity instance the component is attached to (publicly accessible). |

## Main functions
### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing the component’s state — count of tracked large pools, small pools, and currently active sound emitters.
* **Parameters:** None.
* **Returns:** `string` — formatted status string (e.g., `"Large Pool Count: 2 || Small Pool Count: 1 || Emitters Playing: 3"`).
* **Error states:** None.

## Events & listeners
- **Listens to:**  
  `ms_registergrottopool` — triggers `TrackPool`, registering a pool (small or large) for audio tracking.
- **Pushes:** None.
