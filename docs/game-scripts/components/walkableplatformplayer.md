---
id: walkableplatformplayer
title: Walkableplatformplayer
description: Manages player interaction with walkable platforms, including camera behavior, music triggers, collision, and platform entry/exit logic.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: c39dfd1d
---

# Walkableplatformplayer

## Overview
This component handles player-specific behavior when riding or standing on a walkable platform (e.g., a boat). It manages platform entry/exit, movement prediction, camera control (including smooth follow and dynamic zoom), and periodic music triggers based on platform speed. It operates under the assumption that the parent entity is a player and integrates closely with the `walkableplatform` component and camera subsystems.

## Dependencies & Tags
- **Component Dependencies**:
  - `inst.Transform:SetIsOnPlatform(bool)` — relies on transform support for platform state.
  - `TheFocalPoint.components.focalpoint` — uses focal point system for camera focus.
  - `platform.components.walkableplatform` — accesses platform methods such as `AddPlayerOnPlatform`, `RemovePlayerOnPlatform`, `HasPlatformCamera`, `SpawnPlayerCollision`, and `DespawnPlayerCollision`.
- **Tags Added/Removed**: None explicitly added or removed by this component.
- **Network Scope**: Uses `TheNet:IsDedicated()` and `TheWorld.ismastersim` to differentiate client and server behavior.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning player entity. |
| `platform` | `Entity?` | `nil` | Current walkable platform the player is on. |
| `boat_camera_enabled` | `boolean` | `false` | Controls whether boat-specific camera behavior is active. |
| `player_zoomed_out` | `boolean` | `false` | Indicates if zoom-out is currently applied. *(Note: Not directly written, but `player_zoomout` is used in zoom logic.)* |
| `player_zooms` | `number` | `NUM_ZOOMS` (20) | Counter tracking number of zoom steps applied. |
| `player_zoom_task` | `DoTaskInTime?` | `nil` | Periodic task for progressive zoom steps. |
| `player_zoomout` | `boolean` | `false` | Requested zoom-out state (set via `"doplatformcamerazoomdirty"` event). |
| `test_boat_speed_task` | `DoTaskInTime?` | `nil` | Periodic task for boat speed monitoring (used to trigger music). |
| `boatpos` | `Vector3?` | `nil` | Cached last platform position for speed calculation. |
| `boatspeed` | `number?` | `nil` | Cached squared platform speed (previous frame). |
| `movement_prediction_enabled` | `boolean` | `false` | Controls whether movement prediction and collision is active. |
| `_doplatformcamerazoomdirty` | `function` | — | Listener callback for platform camera zoom state changes. |

## Main Functions

### `StartBoatMusicTest()`
* **Description:** Starts a periodic task (every 0.5s) to monitor platform speed and trigger `"playboatmusic"` event when the platform exceeds the speed threshold (`BOAT_SPEED_MUSIC_THRESHOLD = 0.2`). Only runs on the client (`TheNet:IsDedicated()` check is in higher-level callers).
* **Parameters:** None.

### `StopBoatMusicTest()`
* **Description:** Cancels the speed-monitoring task and clears position caches (`boatpos`, `test_boat_speed_task`).

### `StartBoatCamera()`
* **Description:** Registers the platform as a focus source for the camera with custom update/active functions (`BoatCam_UpdateFn`, `BoatCam_ActiveFn`). Enables smooth camera following and dynamic pan gain based on platform velocity.
* **Parameters:** None.

### `StopBoatCamera()`
* **Description:** Removes the platform from the camera focal point system, stopping custom boat camera behavior.

### `StartBoatCameraZooms()`
* **Description:** Begins listening for `"doplatformcamerazoomdirty"` events from the platform and initiates zoom progression if `doplatformcamerazoom` is active. Launches a periodic task (`player_zoom`) that emits `"zoomcamera"` events to gradually zoom out/in.

### `StopBoatCameraZooms()`
* **Description:** Stops listening for `"doplatformcamerazoomdirty"` events. Cancels zoom task and ensures final zoom state is reset if needed.

### `GetOnPlatform(platform)`
* **Description:** Handles logic when the player lands on or moves onto a walkable platform. Sets platform state on transform, adds player to platform’s list, spawns collision if prediction is enabled, and conditionally starts camera/zoom/music on client.
* **Parameters:**
  * `platform` (`Entity`) — The walkable platform entity being entered.

### `GetOffPlatform()`
* **Description:** Handles cleanup when leaving a platform: stops camera/zoom/music on client, removes player from platform’s list, despawns collision if prediction was enabled, and clears platform state.

### `TestForPlatform()`
* **Description:** Reevaluates which platform (if any) the player is standing on. Triggers `GetOffPlatform()` and `GetOnPlatform()` as needed. Runs differently on master (`TheWorld.ismastersim`) vs. client (determines platform via `TheWorld.Map:GetPlatformAtPoint`).
* **Parameters:** None.

### `OnRemoveEntity()`
* **Description:** Cleans up platform state upon entity removal (e.g., player logout/death), ensuringfollowership and player count are correctly decremented and transform state cleared.

## Events & Listeners
- **Listens For:**
  - `"enableboatcamera"` → calls `EnableBoatCamera(inst, enabled)`
  - `"enablemovementprediction"` → calls `EnableMovementPrediction(inst, enabled)`
  - `"playeractivated"` → triggers delayed `DoStartBoatCamera`
  - `"doplatformcamerazoomdirty"` (on platform) → triggers `OnDoPlatformCameraZoomDirty`
- **Emits:**
  - `"playboatmusic"` — when platform speed crosses threshold.
  - `"got_on_platform", platform` — upon entering a platform (client only).
  - `"got_off_platform", platform` — upon exiting a platform (client only).
  - `"zoomcamera", {zoomout = bool, zoom = step}` — during zoom progression.

*Note: Event emitters `EnableBoatCamera`, `EnableMovementPrediction`, and `DoStartBoatCamera` are helper functions (not part of the class itself), but the component registers them as event listeners.*