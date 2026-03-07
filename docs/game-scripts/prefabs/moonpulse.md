---
id: moonpulse
title: Moonpulse
description: Manages the moon pulse post-processing effect and associated visual/audio feedback in the Grotto biome, including wave propagation simulation, screen flashes, and wisp spawning.
tags: [postprocessing, fx, audio, visual]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0ab45206
system_scope: fx
---

# Moonpulse

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moonpulse` component orchestrates the cinematic moon pulse effect triggered during Grotto events. It controls a multi-stage wave progression system that modulates a post-processing effect (MoonPulse and MoonPulseGrading), manages camera shake, screen flashes, sound playback, and wisp particle effects that radiate from the Moon Altar. The effect fades in, cycles through three distinct stages with increasing intensity, then fades out and self-removes. This is a client-side only component that does not persist or synchronize over the network.

## Usage example
```lua
-- The moonpulse effect is typically spawned automatically during Grotto events
local pulse = SpawnPrefab("moonpulse")
-- Or via spawner for automatic instantiation:
local spawner = SpawnPrefab("moonpulse_spawner")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `NOCLICK` and `NOBLOCK` to both prefab instances.  
**External dependencies:** `ThePlayer`, `TheWorld`, `TheFocalPoint`, `PostProcessor`, `VecUtil_GetAngleInRads`, `VecUtil_Length`, `math.clamp`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `wave_progress` | number | `0` | Normalized progress (`0` to `1`) of the current wave cycle within a stage. |
| `glow_intensity` | number | `0` | Current intensity of the post-processing glow, clamped between `0` and `1`. |
| `stage` | number | `1` (initialized in `StartPostFX`) | Current stage index (`1` to `#STAGES`). |
| `hold_time` | number \| `nil` | `nil` | Remaining time (in frames) to hold at wave peak before advancing stage. |
| `fading_out` | boolean \| `nil` | `nil` | Set to `true` when effect enters fade-out phase. |
| `num_spawn_wisps` | number \| `nil` | `nil` | Count of remaining wisps to spawn in the current wave. |

## Main functions
### `StartPostFX(inst)`
*   **Description:** Initializes and starts the post-processing effect, begins the periodic update loop, and triggers the first stage.
*   **Parameters:** `inst` (entity) — the entity instance the effect is attached to.
*   **Returns:** Nothing.
*   **Error states:** Only runs on non-dedicated clients; does nothing if `TheNet:IsDedicated()` is true.

### `Update(inst)`
*   **Description:** Periodically called to advance the wave progression, adjust glow intensity, and update `PostProcessor` parameters based on player position.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.
*   **Error states:** Effectively no-ops if `ThePlayer` is invalid or `nil`.

### `incrementStage(inst)`
*   **Description:** Advances to the next stage of the pulse effect and resets wave progress.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.
*   **Error states:** If `stage` exceeds `#STAGES`, sets `fading_out = true` instead of entering a new stage.

### `SpawnWisp(inst)`
*   **Description:** Spawns a moon altar link effect (wisp) at a random angular offset around the player and recursively schedules more.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.
*   **Error states:** Exits early if `ThePlayer` is invalid or `nil`; only spawns wisps while `num_spawn_wisps > 0`.

### `SmallWaveFX(inst)`
*   **Description:** Triggers a small wave effect: camera shake, wisp spawning, a moon pulse FX, and sound playback.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `BigWaveFX(inst)`
*   **Description:** Triggers a large wave effect: multi-stage camera shake, wisp spawning, a moonpulse2 FX, and sound playback.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — triggers `onremove(inst)` to disable MoonPulse and MoonPulseGrading post effects when the entity is removed.
- **Pushes:** `TheWorld:PushEvent("screenflash", .5)` — fired by `PlayScreenFlash` at regular intervals to trigger screen flash visuals.
- **Pushes via `TheFocalPoint.SoundEmitter`:** Plays `"grotto/common/moon_alter/link/wave1"` or `"grotto/common/moon_alter/link/wave2"` sounds.
