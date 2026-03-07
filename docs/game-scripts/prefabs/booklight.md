---
id: booklight
title: Booklight
description: A temporary light source prefab that fades out after a set duration, used for visual effects in cave transitions or events.
tags: [light, fx, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 89f1f86d
system_scope: environment
---

# Booklight

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`booklight` is a lightweight prefab component that creates a temporary light source with a fade-out animation. It is primarily used for cinematic lighting effects—such as during cave transitions—where a controlled dimming sequence is needed. The light respects world sleep/wake states and persists via save/load by tracking its remaining time.

## Usage example
```lua
local inst = SpawnPrefab("booklight")
inst.Transform:SetPos(x, y, z)
inst:SetDuration(7) -- fade out after 7 seconds
inst.Light:Enable(true)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `NOCLICK`, `FX`, and `daylight`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `duration` | number | `nil` | Duration in seconds before fading begins (set via `SetDuration`). |
| `kill_task` | DoTaskInTime | `nil` | Scheduled task that triggers `FadeOut`. |

## Main functions
### `SetDuration(duration)`
*   **Description:** Sets how long the light remains fully bright before initiating the fade-out sequence.
*   **Parameters:** `duration` (number) - time in seconds until fade-out starts.
*   **Returns:** Nothing.

### `FadeOut()`
*   **Description:** Triggers a 7-frame animation that gradually reduces light radius, intensity, and increases falloff, then removes the entity on animation completion.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** If called while the entity is asleep (`inst:IsAsleep()`), it immediately removes the entity without fading.

## Events & listeners
- **Listens to:** `animover` — triggers entity removal when the `"off"` animation completes during fade-out.
- **Pushes:** None.