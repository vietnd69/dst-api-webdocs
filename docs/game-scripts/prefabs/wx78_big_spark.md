---
id: wx78_big_spark
title: Wx78 Big Spark
description: Creates a temporary visual and lighting effect (spark) that can align to a target entity and trigger screen flash visuals.
tags: [fx, visual, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 79c7b88d
system_scope: fx
---

# Wx78 Big Spark

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wx78_big_spark` is a non-persistent FX prefab that generates a short-lived animated spark effect (light, sound, and animation) when spawned. It supports alignment to a target entity via `AlignToTarget`, after which it optionally drives a screen flash by updating the target's additive colour (blinking effect). The prefab is designed to be lightweight and non-networked on clients, with server-side lifetime management and client-side rendering only when not dedicated.

## Usage example
```lua
local spark = SpawnPrefab("wx78_big_spark")
if spark ~= nil then
    spark.AlignToTarget(target_entity)
end
```

## Dependencies & tags
**Components used:** `updatelooper`, `colouradder`, `freezable`, `AnimState`, `SoundEmitter`, `Light`, `Transform`, `Network`
**Tags:** Adds `FX` to the created entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_fx_intensity` | number | `0.90` | Controls the initial light intensity, decayed over time in the `onupdate` loop. |
| `_has_soundemitter` | boolean | `nil` | Tracks whether `SoundEmitter` exists to ensure sound is played only once. |
| `_update_task` | Task | `nil` | Periodic task handle for updating the FX decay. |
| `_target` | Entity | `nil` | Reference to the entity being aligned to and flashed (set by `AlignToTarget`). |
| `_flashtime` | number | `1` | Flash duration accumulator used in the blinking update loop. |
| `_blinkcycle` | number | `0` | Counter for blink cycle state in the flash effect. |
| `_intensity` | number | `0.2` | Base flash intensity used during screen flash. |
| `killfx` | boolean | `nil` | Flag that triggers removal of the FX entity when animation completes. |
| `OnRemoveEntity` | function | `nil` | Callback invoked when the entity is removed, used to reset additive colour. |

## Main functions
### `StartFX(proxy, anim, build)`
*   **Description:** Spawns and configures a local FX entity for the spark effect (light, sound, animation), starts the decay loop, and registers the animation-over callback.
*   **Parameters:** `proxy` (Entity) — the source entity whose transform to mirror; `anim` (string) — not used in current implementation; `build` (string) — not used.
*   **Returns:** Nothing (side-effect only).
*   **Error states:** Sound emitter is not added on dedicated servers; FX entity is pruned on animation over if `killfx` is true or task cancellation otherwise.

### `AlignToTarget(inst, target)`
*   **Description:** Aligns this FX entity to the world position of `target` and, if not already active, initializes the screen flash effect by adding an `updatelooper` with `OnUpdateFlash` and setting `OnRemoveEntity`.
*   **Parameters:** `target` (Entity) — the entity to align to and flash.
*   **Returns:** Nothing.
*   **Error states:** If `target` is invalid or lacks required components, flash effect terminates early.

### `onupdate(inst, dt)`
*   **Description:** Periodic update loop for the spark FX entity; decays light intensity, plays sound once (if emitter exists), and removes the entity when intensity reaches zero or `killfx` is set.
*   **Parameters:** `inst` (Entity) — the FX entity; `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.

### `OnAnimOver(inst)`
*   **Description:** Callback triggered when the spark animation completes; cancels updates if not already scheduled for removal.
*   **Parameters:** `inst` (Entity) — the FX entity.
*   **Returns:** Nothing.

### `OnUpdateFlash(inst)`
*   **Description:** Updates the screen flash effect by adjusting the target’s additive colour based on blink cycle and remaining flash time, using `PushColour` or `SetAddColour`.
*   **Parameters:** `inst` (Entity) — the FX entity.
*   **Returns:** Nothing.
*   **Error states:** Terminates flash effect if target becomes invalid.

### `OnRemoveFlash(inst)`
*   **Description:** Resets additive colour on the target entity upon FX removal, preferring `PopColour` via `colouradder`, otherwise using `SetAddColour` or `UpdateTint`.
*   **Parameters:** `inst` (Entity) — the FX entity being removed.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `OnAnimOver` when the spark animation completes.
- **Pushes:** None.