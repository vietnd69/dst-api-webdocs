---
id: worldwind
title: Worldwind
description: Manages dynamic wind orientation and speed for the world, updating periodically and broadcasting wind change events.
tags: [world, environment, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: de91aa67
system_scope: environment
---

# Worldwind

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Worldwind` is a world-scoped component responsible for simulating ambient wind direction and intensity. It periodically randomizes the wind angle and triggers a `windchange` event to notify other systems (e.g., visual FX, foliage, or particle systems) of the update. It maintains no server–client distinction, operating purely locally on whichever entity it is attached to (typically the world root or a dedicated wind manager).

## Usage example
```lua
local world = GetWorld()
if world then
    world:AddComponent("worldwind")
    -- Force an immediate wind update by calling OnUpdate once
    world.components.worldwind:OnUpdate(0)
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `velocity` | number | `1` | Current wind speed factor (scalar). |
| `angle` | number | random (`0` to `360`) | Current wind direction in degrees. |
| `timeToWindChange` | number | `1` | Seconds remaining until the next wind update. |

## Main functions
### `Start()`
* **Description:** Ensures the component begins receiving periodic `OnUpdate` calls. Idempotent—safe to call multiple times.
* **Parameters:** None.
* **Returns:** Nothing.

### `Stop()`
* **Description:** Halts `OnUpdate` calls for this component.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetWindAngle()`
* **Description:** Returns the current wind direction.
* **Parameters:** None.
* **Returns:** `number` — current angle in degrees (`0–360`).

### `GetWindVelocity()`
* **Description:** Returns the current wind speed factor.
* **Parameters:** None.
* **Returns:** `number` — wind velocity scalar.

### `GetDebugString()`
* **Description:** Provides a formatted debug string for logging or UI display.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Angle: 245.1234, Veloc: 1.000"`.

### `OnUpdate(dt)`
* **Description:** Callback invoked each frame. Decrements the internal timer and, when the timer expires, randomly selects a new wind angle and fires the `windchange` event.
* **Parameters:** `dt` (number) — delta time in seconds since last frame.
* **Returns:** Nothing.
* **Error states:** If `self.inst` is `nil`, calls `Stop()` and returns early.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** `windchange` — fired when the wind angle or velocity is updated. Payload: `{angle = number, velocity = number}`.
