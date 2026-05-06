---
id: followcamera
title: Followcamera
description: Manages third-person camera following for entities with smooth interpolation, zoom, and shake effects.
tags: [camera, rendering, player]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: cameras
source_hash: e09c0df0
system_scope: entity
---

# Followcamera

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`FollowCamera` is a camera component that tracks and follows a target entity with smooth interpolation for position, heading, pitch, and distance. It handles zoom controls, screen shake effects, and supports cutscene mode for cinematic sequences. The camera automatically adjusts pitch based on distance and integrates with the `FocalPoint` component on targets for dynamic focus management. Cave worlds use different default distance and pitch ranges than surface worlds.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("followcamera")
inst.components.followcamera:SetTarget(player)
inst.components.followcamera:SetDistance(25)
inst.components.followcamera:SetFOV(40)
inst.components.followcamera:ZoomIn()
```

## Dependencies & tags
**External dependencies:**
- `camerashake` -- creates CameraShake instances for screen shake effects

**Components used:**
- `focalpoint` -- calls `CameraUpdate(dt)` on target entity if present

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | nil | The entity instance that owns this camera component. |
| `target` | Entity | nil | The entity instance the camera is following. |
| `currentpos` | Vector3 | (0, 0, 0) | Current interpolated camera position in world space. |
| `currentscreenxoffset` | number | 0 | Current horizontal screen offset for UI effects. |
| `distance` | number | 30 | Current camera distance from target (interpolated). |
| `maxdist` | number | 50 | Maximum camera distance (35 in caves). |
| `extramaxdist` | number | 0 | Extra distance added to maxdist for special cases. |
| `screenoffsetstack` | table | {} | Stack of screen offset references for layered UI effects. |
| `updatelisteners` | table | {} | Table of regular update listener callbacks. |
| `largeupdatelisteners` | table | {} | Table of large update listener callbacks (significant camera movement). |
| `targetoffset` | Vector3 | (0, 1.5, 0) | Offset from target position for camera focus point. |
| `targetpos` | Vector3 | (0, 0, 0) | Target position including offset for camera calculations. |
| `headingtarget` | number | 45 | Target heading angle in degrees. |
| `fov` | number | 35 | Field of view in degrees. |
| `pangain` | number | 4 | Gain factor for position interpolation speed. |
| `headinggain` | number | 20 | Gain factor for heading interpolation speed. |
| `distancegain` | number | 1 | Gain factor for distance interpolation speed (standard zoom). |
| `continuousdistancegain` | number | 6 | Gain factor for distance interpolation speed (continuous zoom). |
| `zoomstep` | number | 4 | Default step size for ZoomIn/ZoomOut functions. |
| `time_since_zoom` | number | nil | Tracks time elapsed since last zoom action for zoom behavior logic. |
| `distancetarget` | number | 30 | Target distance for interpolation (25 in caves). |
| `mindist` | number | 15 | Minimum camera distance. |
| `mindistpitch` | number | 30 | Minimum pitch angle (25 in caves). |
| `maxdistpitch` | number | 60 | Maximum pitch angle (40 in caves). |
| `paused` | boolean | false | Whether camera updates are paused. |
| `shake` | CameraShake | nil | Active camera shake instance. |
| `controllable` | boolean | true | Whether camera can be controlled by input. |
| `cutscene` | boolean | false | Whether camera is in cutscene mode. |
| `onupdatefn` | function | dummyfn | Custom callback function called every update. |
| `gamemode_defaultfn` | function | result of GetGameModeProperty | Game mode override function for camera defaults, called in SetDefault() if present. |
| `lockdistance` | boolean | nil | When true, prevents distance interpolation during Snap(). |

## Main functions
### `SetDefaultOffset()`
* **Description:** Sets the default target offset to (0, 1.5, 0) for camera focus point.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetDefault()`
* **Description:** Resets all camera properties to default values. Adjusts defaults for cave worlds automatically. Calls gamemode override function if present.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GetRightVec()`
* **Description:** Returns the right vector based on current heading target.
* **Parameters:** None
* **Returns:** Vector3 representing the right direction.
* **Error states:** None

### `GetDownVec()`
* **Description:** Returns the down vector based on current heading target.
* **Parameters:** None
* **Returns:** Vector3 representing the down direction.
* **Error states:** None

### `GetPitchDownVec()`
* **Description:** Returns the down vector based on current pitch and heading.
* **Parameters:** None
* **Returns:** Vector3 representing the pitch-adjusted down direction.
* **Error states:** None

### `SetPaused(val)`
* **Description:** Sets whether camera updates are paused.
* **Parameters:** `val` -- boolean to pause or unpause
* **Returns:** None
* **Error states:** None

### `SetMinDistance(distance)`
* **Description:** Sets the minimum camera distance from target.
* **Parameters:** `distance` -- number for minimum distance
* **Returns:** None
* **Error states:** None

### `SetMaxDistance(distance)`
* **Description:** Sets the maximum camera distance from target.
* **Parameters:** `distance` -- number for maximum distance
* **Returns:** None
* **Error states:** None

### `SetExtraMaxDistance(distance)`
* **Description:** Sets extra distance added to maxdist. Calls MaximizeDistance() if extramaxdist changes and camera is controllable, not in cutscene mode, and not paused.
* **Parameters:** `distance` -- number for extra maximum distance
* **Returns:** None
* **Error states:** None

### `SetGains(pan, heading, distance)`
* **Description:** Sets interpolation gain factors for pan, heading, and distance.
* **Parameters:**
  - `pan` -- number for pan gain
  - `heading` -- number for heading gain
  - `distance` -- number for distance gain
* **Returns:** None
* **Error states:** None

### `GetGains()`
* **Description:** Returns current interpolation gain factors.
* **Parameters:** None
* **Returns:** Three numbers: pangain, headinggain, distancegain
* **Error states:** None

### `SetPitchRange(min, max)`
* **Description:** Sets the minimum and maximum pitch angles.
* **Parameters:**
  - `min` -- number for minimum pitch
  - `max` -- number for maximum pitch
* **Returns:** None
* **Error states:** None

### `GetPitchRange()`
* **Description:** Returns current pitch range.
* **Parameters:** None
* **Returns:** Two numbers: mindistpitch, maxdistpitch
* **Error states:** None

### `SetFOV(fov)`
* **Description:** Sets the camera field of view in degrees.
* **Parameters:** `fov` -- number for field of view
* **Returns:** None
* **Error states:** None

### `GetFOV()`
* **Description:** Returns current field of view.
* **Parameters:** None
* **Returns:** Number representing FOV in degrees
* **Error states:** None

### `GetRawMaxDistance()`
* **Description:** Returns maxdist minus extramaxdist (the base maximum distance).
* **Parameters:** None
* **Returns:** Number representing raw maximum distance
* **Error states:** None

### `IsControllable()`
* **Description:** Returns whether the camera is controllable by input.
* **Parameters:** None
* **Returns:** Boolean
* **Error states:** None

### `SetControllable(val)`
* **Description:** Sets whether the camera is controllable by input.
* **Parameters:** `val` -- boolean for controllability
* **Returns:** None
* **Error states:** None

### `CanControl()`
* **Description:** Returns whether the camera can be controlled (alias for IsControllable).
* **Parameters:** None
* **Returns:** Boolean
* **Error states:** None

### `SetOffset(offset)`
* **Description:** Sets the target offset from a Vector3 value.
* **Parameters:** `offset` -- Vector3 with Get() method
* **Returns:** None
* **Error states:** Errors if offset does not have a Get() method.

### `PushScreenHOffset(ref, xoffset)`
* **Description:** Pushes a horizontal screen offset onto the stack. Removes existing offset for same ref first.
* **Parameters:**
  - `ref` -- reference object for tracking this offset
  - `xoffset` -- number for horizontal offset
* **Returns:** None
* **Error states:** None

### `PopScreenHOffset(ref)`
* **Description:** Removes a horizontal screen offset from the stack by reference.
* **Parameters:** `ref` -- reference object to match
* **Returns:** None
* **Error states:** None

### `LockDistance(lock)`
* **Description:** Locks or unlocks distance interpolation during Snap().
* **Parameters:** `lock` -- boolean or nil to clear
* **Returns:** None
* **Error states:** None

### `GetDistance()`
* **Description:** Returns the current target distance.
* **Parameters:** None
* **Returns:** Number representing target distance
* **Error states:** None

### `SetDistance(dist)`
* **Description:** Sets the target distance for interpolation.
* **Parameters:** `dist` -- number for target distance
* **Returns:** None
* **Error states:** None

### `Shake(type, duration, speed, scale)`
* **Description:** Creates a camera shake effect if screen shake is enabled in profile settings.
* **Parameters:**
  - `type` -- shake type identifier
  - `duration` -- number for shake duration in seconds
  - `speed` -- number for shake speed
  - `scale` -- number for shake intensity scale
* **Returns:** None
* **Error states:** None

### `SetTarget(inst)`
* **Description:** Sets the target entity to follow. Updates target position immediately.
* **Parameters:** `inst` -- entity instance or nil to clear target
* **Returns:** None
* **Error states:** Errors if inst is not nil but lacks a Transform component with GetWorldPosition().

### `MaximizeDistance()`
* **Description:** Sets distancetarget to 70% of the range between mindist and maxdist.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `Apply()`
* **Description:** Applies current camera state to TheSim. Calculates position, direction, and up vectors. Updates listener if camera moved significantly.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GetHeading()`
* **Description:** Returns current heading angle.
* **Parameters:** None
* **Returns:** Number representing heading in degrees
* **Error states:** None

### `GetHeadingTarget()`
* **Description:** Returns target heading angle.
* **Parameters:** None
* **Returns:** Number representing target heading in degrees
* **Error states:** None

### `SetHeadingTarget(r)`
* **Description:** Sets the target heading angle with normalization to 0-360 range.
* **Parameters:** `r` -- number for heading in degrees
* **Returns:** None
* **Error states:** None

### `SetContinuousHeadingTarget(r, delta)`
* **Description:** Sets target heading for continuous rotation with analog control delta.
* **Parameters:**
  - `r` -- number for heading in degrees
  - `delta` -- number for rotation speed
* **Returns:** None
* **Error states:** None

### `ContinuousZoomDelta(delta)`
* **Description:** Applies continuous zoom delta with smoothing. Clamps distance to mindist/maxdist range.
* **Parameters:** `delta` -- number for zoom change
* **Returns:** None
* **Error states:** None

### `ZoomIn(step)`
* **Description:** Zooms camera in by step amount. Resets zoom delta tracking.
* **Parameters:** `step` -- number for zoom step (defaults to zoomstep)
* **Returns:** None
* **Error states:** None

### `ZoomOut(step)`
* **Description:** Zooms camera out by step amount. Resets zoom delta tracking.
* **Parameters:** `step` -- number for zoom step (defaults to zoomstep)
* **Returns:** None
* **Error states:** None

### `Snap()`
* **Description:** Instantly snaps camera to target position and heading without interpolation. Updates listeners.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if target exists but lacks Transform component with GetWorldPosition().

### `CutsceneMode(b)`
* **Description:** Sets cutscene mode which changes position interpolation behavior.
* **Parameters:** `b` -- boolean for cutscene mode
* **Returns:** None
* **Error states:** None

### `SetCustomLocation(loc)`
* **Description:** Sets a custom target location instead of following an entity.
* **Parameters:** `loc` -- Vector3 with Get() method
* **Returns:** None
* **Error states:** Errors if loc does not have a Get() method.

### `Update(dt, dontupdatepos)`
* **Description:** Main update function called every frame. Interpolates position, heading, distance, and pitch. Calls custom onupdatefn and updates listeners.
* **Parameters:**
  - `dt` -- number for delta time in seconds
  - `dontupdatepos` -- boolean to skip position updates
* **Returns:** None
* **Error states:** Errors if target exists but lacks Transform component with GetWorldPosition().

### `UpdateListeners(dt)`
* **Description:** Calls all registered update listeners. Calls large update listeners if camera moved significantly.
* **Parameters:** `dt` -- number for delta time in seconds
* **Returns:** None
* **Error states:** None

### `SetOnUpdateFn(fn)`
* **Description:** Sets custom callback function called every update. Uses dummyfn if nil.
* **Parameters:** `fn` -- function or nil
* **Returns:** None
* **Error states:** None

### `AddListener(src, cb)`
* **Description:** Adds a regular update listener callback. Multiple callbacks per source supported.
* **Parameters:**
  - `src` -- source identifier for grouping listeners
  - `cb` -- function callback receiving dt parameter
* **Returns:** None
* **Error states:** None

### `RemoveListener(src, cb)`
* **Description:** Removes a specific listener callback or all listeners for a source.
* **Parameters:**
  - `src` -- source identifier
  - `cb` -- function callback or nil to remove all
* **Returns:** None
* **Error states:** None

### `AddLargeUpdateListener(src, cb)`
* **Description:** Adds a large update listener callback (called only on significant camera movement).
* **Parameters:**
  - `src` -- source identifier for grouping listeners
  - `cb` -- function callback receiving dt parameter
* **Returns:** None
* **Error states:** None

### `RemoveLargeUpdateListener(src, cb)`
* **Description:** Removes a specific large update listener callback or all for a source.
* **Parameters:**
  - `src` -- source identifier
  - `cb` -- function callback or nil to remove all
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** None identified (no ListenForEvent calls in source)
- **Pushes:** None identified (no PushEvent calls in source)
- **Custom listeners:** Uses internal listener system via `AddListener()`, `RemoveListener()`, `AddLargeUpdateListener()`, and `RemoveLargeUpdateListener()` for update callbacks