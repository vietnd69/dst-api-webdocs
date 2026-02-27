---
id: blinkstaff
title: Blinkstaff
description: Manages the teleportation logic, visual effects, and sound cues for staff-like items.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 0da7bd0d
---

# Blinkstaff

## Overview
The `blinkstaff` component orchestrates the teleportation (blinking) sequence for an item, typically a staff. It handles the initiation of the teleport, spawning visual and audio effects at the origin and destination, performing map validity checks, and executing the caster's position change after a short delay.

## Dependencies & Tags
None identified. This component acts upon a `caster` entity, which is expected to have components like `Physics`, `SoundEmitter`, and potentially `health`, but these are not direct dependencies of the entity hosting the `blinkstaff` component itself.

## Properties

| Property    | Type     | Default Value                            | Description                                                                 |
|-------------|----------|------------------------------------------|-----------------------------------------------------------------------------|
| `onblinkfn` | function | `nil`                                    | An optional callback function that is triggered when a blink is initiated.  |
| `blinktask` | task     | `nil`                                    | A reference to the scheduled task that completes the teleportation.         |
| `frontfx`   | string   | `nil`                                    | The prefab name for the "front" visual effect spawned during a blink.       |
| `backfx`    | string   | `nil`                                    | The prefab name for the "back" visual effect spawned during a blink.        |
| `presound`  | string   | `"dontstarve/common/staff_blink"` | The sound asset path played at the start of the teleport.                   |
| `postsound` | string   | `"dontstarve/common/staff_blink"` | The sound asset path played at the end of the teleport.                     |

## Main Functions
### `SetFX(front, back)`
* **Description:** Sets the names of the prefabs to be used for the visual effects when blinking.
* **Parameters:**
    * `front` (string): The prefab name for the foreground visual effect.
    * `back` (string): The prefab name for the background visual effect.

### `ResetSoundFX()`
* **Description:** Resets the pre-blink and post-blink sounds to their default values.

### `SetSoundFX(presound, postsound)`
* **Description:** Overrides the default sound effects for the teleport sequence.
* **Parameters:**
    * `presound` (string): The sound asset to play at the start of the teleport.
    * `postsound` (string): The sound asset to play upon arrival at the destination.

### `SpawnEffect(inst)`
* **Description:** Spawns the configured `frontfx` and `backfx` prefabs at the world position of the provided entity instance.
* **Parameters:**
    * `inst` (Entity): The entity at whose location the effects should be spawned.

### `Blink(pt, caster)`
* **Description:** Initiates the teleportation sequence for a caster to a target point. It performs safety checks to ensure the target location is valid, plays initial sound and visual effects, hides the caster, and schedules a delayed task to complete the teleportation.
* **Parameters:**
    * `pt` (Point): The target destination point (Vector3) for the teleport.
    * `caster` (Entity): The entity that will be teleported.
* **Returns:** `true` if the blink was successfully initiated, `false` otherwise (e.g., if the target location is invalid).