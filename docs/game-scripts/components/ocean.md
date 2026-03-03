---
id: ocean
title: Ocean
description: Manages ocean surface wave direction and speed for rendering or simulation.
tags: [ocean, environment, rendering]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 568610d1
system_scope: environment
---

# Ocean

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Ocean` is a lightweight component that tracks the current direction and speed of ocean surface waves. It is attached to an entity to provide consistent wave orientation and magnitude data, likely used for visual rendering or environmental effects. The component initializes with a random ocean angle in 45-degree increments offset by 22.5°, and maintains a fixed speed value.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("ocean")

local angle = inst.components.ocean:GetCurrentAngle()
local speed = inst.components.ocean:GetCurrentSpeed()
local vec_x, vec_y, vec_z = inst.components.ocean:GetCurrentVec3()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `currentAngle` | number | `0` | Current wave direction in degrees (initialized to 22.5° + N×45°). |
| `currentSpeed` | number | `1` | Scalar magnitude of the wave speed (set to 1 by default). |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Placeholder method; currently does nothing.
*   **Parameters:** `dt` (number) — delta time in seconds (unused).
*   **Returns:** Nothing.

### `GetCurrentAngle()`
*   **Description:** Returns the current wave direction in degrees.
*   **Parameters:** None.
*   **Returns:** number — wave angle in degrees.

### `GetCurrentSpeed()`
*   **Description:** Returns the current wave speed scalar.
*   **Parameters:** None.
*   **Returns:** number — wave speed value.

### `GetCurrentVec3()`
*   **Description:** Computes and returns a 3D directional vector representing the wave direction in the XZ plane (Y is always zero).
*   **Parameters:** None.
*   **Returns:** number — x-component (cosine term), number — y-component (always `0`), number — z-component (sine term).
*   **Error states:** None identified.

## Events & listeners
None identified
