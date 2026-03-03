---
id: blowinwind
title: Blowinwind
description: Simulates wind-driven movement and speed variation for an entity by accumulating velocity in the wind direction and applying it to the locomotor component.
tags: [locomotion, environment, physics]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a485065c
system_scope: locomotion
---

# Blowinwind

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Blowinwind` is a component that models physics-based movement driven by a directional wind force. It accumulates velocity over time in the wind direction, modulates movement speed using sine-based variation, and applies the resulting speed and rotation to the entity’s `locomotor` component. It also manages a sound loop whose playback parameter scales with movement speed. The component is typically used for entities exposed to environmental wind (e.g., gusts in the Caves or outdoors). It interacts directly with `locomotor` to control forward movement speed and rotation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("blowinwind")
inst.components.blowinwind:SetAverageSpeed(8)
inst.components.blowinwind:SetMaxSpeedMult(1.3)
inst.components.blowinwind:SetMinSpeedMult(0.7)
inst.components.blowinwind:Start(math.rad(90), 1.0) -- wind from the right
```

## Dependencies & tags
**Components used:** `locomotor`, `SoundEmitter`, `Transform`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `entity` | `nil` (assigned in constructor) | The entity instance the component is attached to. |
| `maxSpeedMult` | number | `1.5` | Maximum multiplier applied to base speed during sine-based variation. |
| `minSpeedMult` | number | `0.5` | Minimum multiplier applied to base speed during sine-based variation. |
| `averageSpeed` | number | `(TUNING.WILSON_RUN_SPEED + TUNING.WILSON_WALK_SPEED)/2` | Baseline speed used for remapping velocity magnitude to walkspeed. |
| `speed` | number | `0` | Current calculated walkspeed applied to `locomotor.walkspeed`. |
| `windAngle` | number | `0` | Wind direction angle in radians (XZ plane). |
| `windVector` | `Vector3` | `(0,0,0)` | Normalized wind direction vector derived from `windAngle`. |
| `currentAngle` | number | `0` | Current rotation angle of the entity, updated per-frame. |
| `currentVector` | `Vector3` | `(0,0,0)` | Normalized vector for current direction. |
| `velocity` | `Vector3` | `(0,0,0)` | Accumulated velocity in the wind direction, updated per-frame. |
| `speedVarTime` | number | `0` | Time elapsed since last reset of speed variation cycle. |
| `speedVarPeriod` | number | Random value near `5` (see constructor) | Duration of one full sine wave period for speed variation. |
| `soundName` | string or `nil` | `nil` | Name of sound loop to manage (if set externally). |
| `soundPath` | string or `nil` | `nil` | Path to sound asset (if set externally). |
| `soundParameter` | string or `nil` | `nil` | Name of sound parameter to modulate with speed (if set externally). |
| `velocMult` | number or `nil` | `nil` | Unused in current implementation; comment suggests future intent. |

## Main functions
### `Start(ang, vel)`
* **Description:** Initializes wind-driven movement by setting the wind direction, updating the entity's rotation, and beginning the update loop. Starts the sound loop if configured.
* **Parameters:**  
  `ang` (number, optional) — Wind direction in radians (XZ plane). If provided, sets `windAngle`, `windVector`, `currentAngle`, and `currentVector`.  
  `vel` (number, optional) — Intended velocity multiplier (currently unused; assignment is commented out).  
* **Returns:** Nothing.  
* **Error states:** No explicit failure cases; silent no-op if `ang`/`vel` are omitted.

### `Stop()`
* **Description:** Halts wind-driven movement by stopping the update loop and killing the sound loop.
* **Parameters:** None.  
* **Returns:** Nothing.  

### `ChangeDirection(ang, vel)`
* **Description:** Updates the wind direction without affecting the update loop or sound. Updates `windAngle` and `windVector` only.
* **Parameters:**  
  `ang` (number, optional) — New wind direction in radians.  
  `vel` (number, optional) — Intended velocity multiplier (commented out in implementation; ignored).  
* **Returns:** Nothing.  

### `SetMaxSpeedMult(spd)`
* **Description:** Sets the upper bound of speed variation multiplier during sine-based oscillation.
* **Parameters:** `spd` (number) — New maximum multiplier (e.g., `1.5`).  
* **Returns:** Nothing.  

### `SetMinSpeedMult(spd)`
* **Description:** Sets the lower bound of speed variation multiplier during sine-based oscillation.
* **Parameters:** `spd` (number) — New minimum multiplier (e.g., `0.5`).  
* **Returns:** Nothing.  

### `SetAverageSpeed(spd)`
* **Description:** Overrides the default baseline speed used for remapping velocity to walkspeed.
* **Parameters:** `spd` (number) — New average speed reference (e.g., `8`).  
* **Returns:** Nothing.  

### `GetSpeed()`
* **Description:** Returns the most recently calculated walkspeed applied to the `locomotor`.
* **Parameters:** None.  
* **Returns:** number — Current `speed`.  

### `GetVelocity()`
* **Description:** Returns the accumulated velocity vector in the wind direction.
* **Parameters:** None.  
* **Returns:** `Vector3` — Current `velocity`.  

### `OnUpdate(dt)`
* **Description:** Core update function (called per frame while component is active). Accumulates velocity toward wind direction, remaps magnitude to a walkspeed, applies sine-based variation, updates rotation and sound, and drives `locomotor:WalkForward()`.
* **Parameters:** `dt` (number) — Delta time in seconds.  
* **Returns:** Nothing.  
* **Error states:** Stops itself and returns early if `inst` is nil or destroyed.

### `OnEntityWake()`
* **Description:** Reactivates movement when the entity wakes (e.g., after sleeping). Calls `Start()` using last-known `windAngle` and `velocMult`.
* **Parameters:** None.  
* **Returns:** Nothing.  

### `OnEntitySleep()`
* **Description:** Deactivates movement when the entity sleeps. Calls `Stop()`.
* **Parameters:** None.  
* **Returns:** Nothing.  

### `StartSoundLoop()`
* **Description:** Starts the configured sound loop if emitter and sound are valid and not already playing.
* **Parameters:** None.  
* **Returns:** Nothing.  

### `StopSoundLoop()`
* **Description:** Stops the configured sound loop if emitter and sound name are valid.
* **Parameters:** None.  
* **Returns:** Nothing.  

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:** None identified.
