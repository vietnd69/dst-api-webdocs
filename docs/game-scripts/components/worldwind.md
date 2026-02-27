---
id: worldwind
title: Worldwind
description: Controls the periodic randomization of wind direction and speed in the game world.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: de91aa67
---

# Worldwind

## Overview
This component manages the dynamic wind system for the game world by periodically updating and broadcasting wind direction (angle) and speed (velocity) at randomized intervals. It runs as an updating component and notifies other systems via events when the wind changes.

## Dependencies & Tags
**Dependencies:**
- `inst:StartUpdatingComponent(self)` / `inst:StopUpdatingComponent(self)` — requires the host entity to support component update registration.
- Uses `TUNING.SEG_TIME` (segment time), implying a dependency on the `TUNING` constants table.

**Tags:**  
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to (typically the `world` entity). |
| `velocity` | `number` | `1` | Current wind speed. |
| `angle` | `number` | Random initial value in `[0, 360)` | Current wind direction (in degrees). |
| `timeToWindChange` | `number` | `1` | Time (in seconds) remaining until the next wind change. |

## Main Functions
### `Start()`
* **Description:** Begins updating the component by registering it with the entity's update loop.
* **Parameters:** None.

### `Stop()`
* **Description:** Stops updating the component by unregistering it from the entity's update loop.
* **Parameters:** None.

### `GetWindAngle()`
* **Description:** Returns the current wind direction in degrees.
* **Parameters:** None.

### `GetWindVelocity()`
* **Description:** Returns the current wind speed.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string containing current angle and velocity for in-game debugging.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Called each frame during updates. Decrements the wind change timer; when expired, randomizes the wind direction and velocity, pushes a `windchange` event, and schedules the next wind change within a randomized time window.
* **Parameters:**  
  - `dt` (`number`): Delta time (seconds) since the last frame.

## Events & Listeners
- **Listens for:** None.
- **Triggers:**  
  - `windchange` — dispatched with payload `{angle = self.angle, velocity = self.velocity}` whenever the wind direction or velocity is updated (note: in the current implementation, *only* `angle` is randomized; `velocity` remains constant unless elsewhere modified).