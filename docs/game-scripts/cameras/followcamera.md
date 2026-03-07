---
id: followcamera
title: Followcamera
description: Manages camera positioning, movement, and update logic for following a target entity in the game world.
tags: [camera, entity, movement, world]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: camera
system_scope: world
source_hash: 3db43c9d
---

# Followcamera

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `FollowCamera` component controls the game's camera behavior when following a target entity. It calculates and applies camera position, orientation, field of view, and listener location based on the target's movement and configurable parameters (e.g., distance, pitch, gain values). It integrates with the `FocalPoint` component to dynamically adjust focus during gameplay. The camera updates occur every frame via `FollowCamera:Update(dt)` and ultimately call `TheSim` functions to set camera properties and audio listener position.

## Usage example
The following snippet shows how to attach the `FollowCamera` component to an entity and configure basic behavior:

```lua
local entity = TheWorld:SpawnPrefab("mycamera_anchor")
entity:AddComponent("followcamera")

entity.components.followcamera:SetTarget(some_entity)
entity.components.followcamera:SetDistance(30)
entity.components.followcamera:SetControllable(true)
entity.components.followcamera:SetOnUpdateFn(function(dt)
    -- Custom camera update logic here
end)
```

## Dependencies & tags
**Components used:**
- `focalpoint` — accessed via `target.components.focalpoint:CameraUpdate(dt)` to manage dynamic focus sources.
- `camerashake` — used via `CameraShake(type, duration, speed, scale)` to generate screen shake effects.

**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `instance` or `nil` | `nil` | The entity the camera is currently following. |
| `currentpos` | `Vector3` | `Vector3(0,0,0)` | Current 3D position of the camera. |
| `targetpos` | `Vector3` | `Vector3(0,0,0)` | Target position (based on `target` + `targetoffset`). |
| `targetoffset` | `Vector3` | `Vector3(0, 1.5, 0)` | Offset applied to the target's position when computing camera position. |
| `heading` | `number` | `45` (initially) | Current camera heading (in degrees). |
| `headingtarget` | `number` | `45` | Desired camera heading (in degrees). |
| `distance` | `number` | `30` | Current camera distance from target. |
| `distancetarget` | `number` | `30` | Target camera distance, modified by zooming. |
| `mindist` | `number` | `15` (or `15` in caves) | Minimum allowed camera distance. |
| `maxdist` | `number` | `50` (or `35` in caves) | Maximum allowed camera distance. |
| `extramaxdist` | `number` | `0` | Extra maximum distance added to `maxdist`. |
| `pitch` | `number` | Derived from `distance` | Camera pitch angle (interpolated between `mindistpitch` and `maxdistpitch`). |
| `fov` | `number` | `35` | Field of view (in degrees). |
| `pangain` | `number` | `4` | Gain factor for position interpolation during update. |
| `headinggain` | `number` | `20` | Gain factor for heading interpolation. |
| `distancegain` | `number` | `1` | Gain factor for distance interpolation. |
| `continuousdistancegain` | `number` | `6` | Higher gain used during continuous zoom (e.g., analog camera movement). |
| `zoomstep` | `number` | `4` | Incremental step size for discrete zoom in/out. |
| `mindistpitch` | `number` | `30` (or `25` in caves) | Minimum pitch angle when camera is at `mindist`. |
| `maxdistpitch` | `number` | `60` (or `40` in caves) | Maximum pitch angle when camera is at `maxdist`. |
| `controllable` | `boolean` | `true` | Whether the camera can be manually controlled (e.g., zoom/rotate). |
| `cutscene` | `boolean` | `false` | If true, camera moves linearly without gain-based smoothing. |
| `paused` | `boolean` | `false` | Pauses camera update logic if `true`. |
| `shake` | `CameraShake` or `nil` | `nil` | Active screen shake effect (see `camerashake.lua`). |
| `screenoffsetstack` | `table` | `{}` | Stack of screen horizontal offsets, ordered by priority. |
| `updatelisteners` | `table` | `{}` | Mapping of listener sources to callback arrays (called every frame). |
| `largeupdatelisteners` | `table` | `{}` | Mapping of listener sources to callback arrays (called only when camera motion changes significantly). |
| `large_dist_update` | `boolean` | `false` | Set to `true` when camera position/direction/up changed significantly since last update. |

## Main functions
### `SetDefaultOffset()`
* **Description:** Sets `targetoffset` to a default height offset (`Vector3(0, 1.5, 0)`).
* **Parameters:** None.
* **Returns:** None.

### `SetDefault()`
* **Description:** Resets camera parameters to default values. Configures different values for cave worlds (`TheWorld:HasTag("cave")`). Calls `gamemode_defaultfn` if present.
* **Parameters:** None.
* **Returns:** None.

### `GetRightVec()`
* **Description:** Returns the world-space right vector based on `headingtarget`.
* **Parameters:** None.
* **Returns:** `Vector3` — Right vector (perpendicular to camera direction).

### `GetDownVec()`
* **Description:** Returns the world-space forward/down vector (direction camera points) based on `headingtarget`.
* **Parameters:** None.
* **Returns:** `Vector3` — Down vector (direction of camera heading).

### `GetPitchDownVec()`
* **Description:** Returns the 3D direction vector accounting for both `pitch` and `heading`.
* **Parameters:** None.
* **Returns:** `Vector3` — Pitch-adjusted down vector.

### `SetPaused(val)`
* **Description:** Pauses or resumes camera updates.
* **Parameters:**
  - `val` (`boolean`) — If `true`, disables camera updates in `Update(dt)`.
* **Returns:** None.

### `SetMinDistance(distance)`
* **Description:** Sets the minimum allowed camera distance (`mindist`).
* **Parameters:**
  - `distance` (`number`) — Minimum distance.
* **Returns:** None.

### `SetMaxDistance(distance)`
* **Description:** Sets the maximum allowed camera distance (`maxdist`). The effective `maxdist` also accounts for `extramaxdist`.
* **Parameters:**
  - `distance` (`number`) — Maximum distance.
* **Returns:** None.

### `SetExtraMaxDistance(distance)`
* **Description:** Sets extra allowable maximum distance beyond `maxdist`. Changes to this property may trigger `MaximizeDistance()` if the camera is controllable.
* **Parameters:**
  - `distance` (`number`) — Extra max distance offset.
* **Returns:** None.

### `SetGains(pan, heading, distance)`
* **Description:** Sets interpolation gains for camera behavior:
  - `pan`: position interpolation gain (`pangain`)
  - `heading`: heading interpolation gain (`headinggain`)
  - `distance`: distance interpolation gain (`distancegain`)
* **Parameters:**
  - `pan` (`number`)
  - `heading` (`number`)
  - `distance` (`number`)
* **Returns:** None.

### `GetGains()`
* **Description:** Returns the current gain values.
* **Parameters:** None.
* **Returns:** `pan`, `heading`, `distance` — All numbers.

### `IsControllable()`
* **Description:** Returns whether the camera can be controlled.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `controllable` is `true`.

### `SetControllable(val)`
* **Description:** Sets whether the camera can be controlled. Affects behavior when `extramaxdist` changes.
* **Parameters:**
  - `val` (`boolean`)
* **Returns:** None.

### `CanControl()`
* **Description:** Alias for `IsControllable()`.
* **Parameters:** None.
* **Returns:** `boolean`.

### `SetOffset(offset)`
* **Description:** Sets `targetoffset` from a `Vector3`.
* **Parameters:**
  - `offset` (`Vector3`) — New target offset.
* **Returns:** None.

### `PushScreenHOffset(ref, xoffset)`
* **Description:** Adds a screen horizontal offset to the stack with a given priority (inserted at front). Automatically removes existing entries for the same `ref`.
* **Parameters:**
  - `ref` (`instance`) — Reference object for the offset (used for cleanup).
  - `xoffset` (`number`) — Horizontal offset in screen-height units.
* **Returns:** None.

### `PopScreenHOffset(ref)`
* **Description:** Removes the first entry in the offset stack matching `ref`.
* **Parameters:**
  - `ref` (`instance`) — Reference object to remove.
* **Returns:** None.

### `LockDistance(lock)`
* **Description:** Locks the camera distance if `lock` is truthy, preventing changes during updates.
* **Parameters:**
  - `lock` (`any`) — If truthy, locks distance; `nil` or `false` unlocks.
* **Returns:** None.

### `GetDistance()`
* **Description:** Returns the current target distance (`distancetarget`).
* **Parameters:** None.
* **Returns:** `number` — `distancetarget`.

### `SetDistance(dist)`
* **Description:** Sets the target distance (`distancetarget`).
* **Parameters:**
  - `dist` (`number`) — New target distance.
* **Returns:** None.

### `Shake(type, duration, speed, scale)`
* **Description:** Applies a screen shake effect using `CameraShake`.
* **Parameters:**
  - `type` (`string`) — Shake type (e.g., `"small"`, `"medium"`).
  - `duration` (`number`) — Shake duration in seconds.
  - `speed` (`number`) — Shake frequency.
  - `scale` (`number`) — Shake magnitude.
* **Returns:** None.

### `SetTarget(inst)`
* **Description:** Sets the entity the camera should follow. Immediately updates `targetpos` based on the new target's position.
* **Parameters:**
  - `inst` (`instance` or `nil`) — The entity to follow, or `nil` to stop following.
* **Returns:** None.

### `MaximizeDistance()`
* **Description:** Sets `distancetarget` to 70% of the distance range (above `mindist`).
* **Parameters:** None.
* **Returns:** None.

### `Apply()`
* **Description:** Applies computed camera state (position, direction, up, FOV) to `TheSim`, and sets the audio listener location.
* **Parameters:** None.
* **Returns:** None.

### `GetHeading()`
* **Description:** Returns the current camera heading (`heading`).
* **Parameters:** None.
* **Returns:** `number` — Current heading in degrees.

### `GetHeadingTarget()`
* **Description:** Returns the target heading (`headingtarget`).
* **Parameters:** None.
* **Returns:** `number` — Target heading in degrees.

### `SetHeadingTarget(r)`
* **Description:** Instantly sets `headingtarget`, resetting delta tracking for smooth rotation.
* **Parameters:**
  - `r` (`number`) — Target heading (normalized to `[0,360)`).
* **Returns:** None.

### `SetContinuousHeadingTarget(r, delta)`
* **Description:** Sets target heading and calculates average delta for smooth analog camera rotation (used in controller mods).
* **Parameters:**
  - `r` (`number`) — Target heading.
  - `delta` (`number`) — Rotation speed/direction.
* **Returns:** None.

### `ContinuousZoomDelta(delta)`
* **Description:** Applies a zoom delta (e.g., from analog control), clamping between `mindist` and `maxdist`.
* **Parameters:**
  - `delta` (`number`) — Zoom amount (positive zooms out, negative zooms in).
* **Returns:** None.

### `ZoomIn(step)`
* **Description:** Decreases `distancetarget` by `step` (or `zoomstep`).
* **Parameters:**
  - `step` (`number` or `nil`) — Zoom increment.
* **Returns:** None.

### `ZoomOut(step)`
* **Description:** Increases `distancetarget` by `step` (or `zoomstep`).
* **Parameters:**
  - `step` (`number` or `nil`) — Zoom increment.
* **Returns:** None.

### `Snap()`
* **Description:** Instantly aligns current camera state (`currentpos`, `heading`, `distance`) to the target and applies settings.
* **Parameters:** None.
* **Returns:** None.

### `CutsceneMode(b)`
* **Description:** Sets whether the camera is in cutscene mode (linear movement vs. gain-based smoothing).
* **Parameters:**
  - `b` (`boolean`) — `true` enables linear interpolation in `Update(dt)`.
* **Returns:** None.

### `SetCustomLocation(loc)`
* **Description:** Overrides `targetpos` with a custom world position.
* **Parameters:**
  - `loc` (`Vector3`) — Custom target position.
* **Returns:** None.

### `Update(dt, dontupdatepos)`
* **Description:** Main update loop — computes new camera state using gains, handles zoom/heading smoothing, shake, screen offsets, and focal points.
* **Parameters:**
  - `dt` (`number`) — Delta time.
  - `dontupdatepos` (`boolean`) — If `true`, skips updating `currentpos`.
* **Returns:** None.

### `UpdateListeners(dt)`
* **Description:** Invokes registered callbacks in `updatelisteners` (every frame) and `largeupdatelisteners` (only when camera motion changed significantly).
* **Parameters:**
  - `dt` (`number`) — Delta time.
* **Returns:** None.

### `SetOnUpdateFn(fn)`
* **Description:** Sets the per-frame callback invoked at the end of `Update(dt)`. Use for custom camera logic.
* **Parameters:**
  - `fn` (`function` or `nil`) — Callback (`function(dt) end`). `nil` uses a no-op dummy function.
* **Returns:** None.

### `AddListener(src, cb)`
* **Description:** Registers a per-frame listener callback for a given source.
* **Parameters:**
  - `src` (`any`) — Unique source identifier (used for removal).
  - `cb` (`function`) — Callback (`function(dt) end`).
* **Returns:** None.

### `RemoveListener(src, cb)`
* **Description:** Removes a per-frame listener callback for a source.
* **Parameters:**
  - `src` (`any`) — Source identifier.
  - `cb` (`function` or `nil`) — Specific callback or `nil` to remove all for `src`.
* **Returns:** None.

### `AddLargeUpdateListener(src, cb)`
* **Description:** Registers a listener callback for only large camera motion changes.
* **Parameters:**
  - `src` (`any`)
  - `cb` (`function`)
* **Returns:** None.

### `RemoveLargeUpdateListener(src, cb)`
* **Description:** Removes a large-update listener callback for a source.
* **Parameters:**
  - `src` (`any`)
  - `cb` (`function` or `nil`)
* **Returns:** None.

## Events & listeners
None — the component does not register or push any DST events.