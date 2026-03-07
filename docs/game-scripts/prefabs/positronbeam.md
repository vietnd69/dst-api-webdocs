---
id: positronbeam
title: Positronbeam
description: Generates and manages visual and audio effects for the positron beam animation sequence used in the Moon Base event, including beam layering, intensity control, and state transitions.
tags: [fx, audio, event, moonbase]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fd053204
system_scope: fx
---

# Positronbeam

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`positronbeam` is a prefab factory script that creates three distinct FX prefabs: `positronbeam_back`, `positronbeam_front`, and `positronpulse`. These prefabs render the layered animation sequence for the positron beam effect seen in the Moon Base event. The script defines helper functions (`SetLevel`, `FinishFX`, `InitFX`) to control animation playback, sound intensity, and entity lifecycle programmatically.

## Usage example
```lua
-- Get the prefabs
local backbeam_prefab, frontbeam_prefab, pulse_prefab = 
    Prefab("positronbeam_back"), 
    Prefab("positronbeam_front"), 
    Prefab("positronpulse")

-- Spawn and configure the pulse effect (common entry point)
local pulse = SpawnPrefab("positronpulse")
pulse.Transform:SetPosition(0, 0, 0)

-- Play beam at level 1 (no beam shown)
pulse:SetLevel(1)

-- Play beam at level 2 (mid-intensity loop)
pulse:SetLevel(2)

-- Play beam at level 3 (max-intensity loop)
pulse:SetLevel(3)

-- End the beam effect
pulse:FinishFX()
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX` tag to spawned entities.

## Properties
No public properties

## Main functions
The following functions are attached as methods to `positronpulse` instances only.

### `SetLevel(level)`
* **Description:** Updates the beam’s animation and sound intensity based on the provided level. Levels 0 and 1 hide the beam and mute sound; levels 2 and 3 show appropriate loop animations and adjust volume.
* **Parameters:** `level` (number or nil) — the desired beam intensity level.
* **Returns:** Nothing.
* **Error states:** No-op if the effect is already finished (`inst._finished` is truthy).

### `FinishFX()`
* **Description:** Triggers the beam’s conclusion: kills ongoing beam sound, plays the post-animation (`lunar_full_pst`), schedules entity removal, and ensures the effect remains visible during the fade-out.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if already finished or the post-animation is already playing.

### `KillFX()`
* **Description:** Immediately removes the effect entity (direct alias for `inst.Remove`). Used for premature termination (e.g., if interrupted).

### `InitFX()`
* **Description:** Initializes the beam’s sound at startup. Called once on first spawn.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` (on `positronbeam_*` prefabs only) — triggers `inst.Remove` when the post-animation completes.
- **Pushes:** None identified.