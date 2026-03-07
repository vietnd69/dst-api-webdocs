---
id: yoth_knightwarningsound
title: Yoth Knightwarningsound
description: Spawns a one-frame local audio effect at a calculated position relative to the player when a Yoth Knight warning is triggered within camera range.
tags: [audio, fx, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9b6f39d6
system_scope: audio
---

# Yoth Knightwarningsound

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`yoth_knightwarningsound` is a lightweight, non-persistent prefab that plays a one-time fanfare sound effect for Yoth Knight-related warnings. It calculates the relative position of the local player and spawns the sound near the warning source—capped at a minimum distance of 15 units—to ensure spatialized audio without overloading the server. The prefab is used exclusively on the client and is destroyed after playing the sound.

## Usage example
```lua
--Typical instantiation via worldspawn or preabricated prefabs:
--The prefab is automatically instantiated and scheduled via the prefabs system:
--   Create("yothknightwarningsound")
--This is not normally called manually; it is invoked internally by event handlers for Yoth Knight warnings.
```

## Dependencies & tags
**Components used:** `transform`, `soundemitter`, `network`
**Tags:** Adds `FX`

## Properties
No public properties.

## Main functions
### `CreateSoundFxAt(x, z)`
*   **Description:** Instantiates a temporary entity, positions it at (`x`, 0, `z`), plays the `"yoth_2026/fanfare/announce"` sound, then immediately destroys the entity.
*   **Parameters:**
    *   `x` (number) — world X coordinate to play the sound at.
    *   `z` (number) — world Z coordinate to play the sound at.
*   **Returns:** Nothing.

### `PlayWarningSound(inst)`
*   **Description:** Computes distance to `ThePlayer`, clamps effective playback position to a minimum of 15 units, and triggers `CreateSoundFxAt` if within camera range (`PLAYER_CAMERA_SEE_DISTANCE + 20`).
*   **Parameters:**
    *   `inst` (entity) — ignored (the entity the component is attached to); position is taken from it, but not used directly for playback.
*   **Returns:** Nothing.

## Events & listeners
This prefab does not register or emit any events. It executes once via `DoTaskInTime(0, PlayWarningSound)` during initialization and self-destructs after one second.