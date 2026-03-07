---
id: walkableplatformplayer
title: Walkableplatformplayer
description: Manages player behavior and camera integration when the player is on a walkable platform (such as a boat), including movement prediction, boat-based camera effects, and zoom handling.
tags: [locomotion, camera, physics, network]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c39dfd1d
system_scope: entity
---
# Walkableplatformplayer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WalkablePlatformPlayer` handles player integration with walkable platforms (e.g., boats). It manages platform attachment/detachment, movement prediction (collision spawning), boat music triggers, and dynamic camera behavior including boat-specific camera updates and zooming. It relies on the `walkableplatform` and `focalpoint` components to coordinate physics alignment, camera focus, and player collision.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("walkableplatformplayer")

-- Attach to a boat entity
local boat = SpawnPrefab("boat")
inst.components.walkableplatformplayer:GetOnPlatform(boat)

-- Enable boat camera and movement prediction
inst:PushEvent("enableboatcamera", true)
inst:PushEvent("enablemovementprediction", true)

-- Detach when leaving the platform
inst.components.walkableplatformplayer:GetOffPlatform()
```

## Dependencies & tags
**Components used:**  
- `focalpoint` (via `TheFocalPoint.components.focalpoint`)  
- `walkableplatform` (via `platform.components.walkableplatform`)  
- `Transform` (`inst.Transform:SetIsOnPlatform()`)  
- `TheWorld.Map:GetPlatformAtPoint()` (client-side only)  
- `TheCamera`, `TheNet`, `ThePlayer`, `VecUtil_Lerp`, `Lerp`

**Tags:** Sets `is_on_platform` state via `Transform:SetIsOnPlatform(true/false)`. No persistent tags added.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance the component is attached to (typically the player). |
| `boat_camera_enabled` | boolean | `false` | Whether boat-specific camera behavior is enabled. |
| `movement_prediction_enabled` | boolean | `false` | Whether client-side movement prediction (collision spawning) is active. |
| `platform` | `Entity?` | `nil` | Reference to the current walkable platform the player is on. |
| `player_zoomed_out` | boolean | `false` | *(Deprecated/unused)* Placeholder for zoom state. |
| `player_zooms` | number | `NUM_ZOOMS` | Counter tracking how many zoom steps remain when zooming in/out. |
| `player_zoom_task` | `Task?` | `nil` | Periodic task used to incrementally zoom camera. |
| `player_zoomout` | boolean | `false` | Desired final zoom state (`true` = zoomed out). |
| `test_boat_speed_task` | `Task?` | `nil` | Periodic task used for boat music detection. |
| `boatpos` | `Vector3?` | `nil` | Last known boat position for speed calculation. |
| `boatspeed` | number? | `nil` | Last computed squared boat speed. |
| `_doplatformcamerazoomdirty` | function | — | Callback used to respond to `doplatformcamerazoomdirty` events from platform. |

## Main functions
### `GetOnPlatform(platform)`
* **Description:** Attaches the player to the specified platform. Sets platform tracking state, spawns player collision (if prediction is enabled), syncs platform data (server), and triggers camera/music behaviors on the client.
* **Parameters:**  
  - `platform` (`Entity`) — The walkable platform entity the player is entering.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; silently skips client-side logic in dedicated servers or if `inst ~= ThePlayer`.

### `GetOffPlatform()`
* **Description:** Detaches the player from the current platform. Stops camera, zoom, and music tasks; cleans up collision and platform tracking; synchronizes removal on server.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartBoatCamera()`
* **Description:** Registers the current platform as a camera focus source with boat-specific update logic (pan gain, lookahead offset, velocity smoothing).
* **Parameters:** None.
* **Returns:** Nothing.

### `StopBoatCamera()`
* **Description:** Removes the current platform as a camera focus source.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartBoatCameraZooms()`
* **Description:** Begins listening for platform zoom state changes (`doplatformcamerazoomdirty`) and initiates the zoom-in/out task if zooming is active.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Only acts if `HasPlatformCamera()` returns `true`.

### `StopBoatCameraZooms()`
* **Description:** Stops zoom-related event listening and cancels any pending zoom task.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartBoatMusicTest()`
* **Description:** Starts a periodic task that monitors boat movement speed and fires the `playboatmusic` event when speed crosses the threshold.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopBoatMusicTest()`
* **Description:** Stops the boat speed monitoring task and clears tracked position/speed data.
* **Parameters:** None.
* **Returns:** Nothing.

### `TestForPlatform()`
* **Description:** Checks whether the player is currently on a platform and transitions between platform states as needed (master simulation on server; client-side prediction on client).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Differing platform resolution logic for master sim vs. client (no collision spawning on client if prediction disabled).

### `OnRemoveEntity()`
* **Description:** Cleanup handler called when the entity is removed. Ensures platform detachment and collision cleanup.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"enableboatcamera"` — Toggles boat camera behavior via `EnableBoatCamera`.  
  - `"enablemovementprediction"` — Toggles movement prediction (collision spawning) via `EnableMovementPrediction`.  
  - `"playeractivated"` — Triggers delayed `DoStartBoatCamera` to initialize camera after player is ready.  
  - `"doplatformcamerazoomdirty"` — Responds to platform zoom state changes (via `_doplatformcamerazoomdirty` callback).  
  - `"got_on_platform"` — Pushed on platform entry (client only).  
  - `"got_off_platform"` — Pushed on platform exit (client only).  
  - `"playboatmusic"` — Pushed when boat speed exceeds threshold (internal use by music system).  
  - `"zoomcamera"` — Pushed during zoom step tasks (zooming logic).

- **Pushes:**  
  - `"got_on_platform", platform` — Client notification of platform entry.  
  - `"got_off_platform", platform` — Client notification of platform exit.  
  - `"playboatmusic"` — Triggers boat music when movement begins (used by sound system).  
  - `"zoomcamera", {zoomout = bool, zoom = step}` — Used to incrementally adjust camera zoom.  
