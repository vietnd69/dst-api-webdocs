---
id: emitters
title: Emitters
description: Manages particle and effect emitters with support for awake/sleep states, lifetime handling, and spatial distribution helpers.
tags: [fx, world, audio]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 751795a5
system_scope: world
---

# Emitters

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Emitters` provides two core services:  
1. An `EmitterManager` component that tracks active emitters (`inst` entities) and calls their update functions, respecting awake/sleep physics states and optional finite lifetimes.  
2. A collection of helper functions for generating spatial emitter distributions (e.g., disc, circle, ring, sphere, box, polygon area, 2D triangle) used for FX spawning.

It integrates with entity lifecycle via `onremove` events and the world's awake/sleep system (`entity:IsAwake()`), ensuring emitters stop updating when their owning entity sleeps to conserve performance.

## Usage example
```lua
-- Add a finite-lifetime emitter to an entity
local inst = CreateEntity()
inst:AddComponent("emitter")

local updateFunc = function()
    -- Spawn particles here
    inst.Transform:SetPosition(inst:GetPosition() + Vector3(math.random(), 0, math.random()))
end

inst.components.emitter:AddEmitter(inst, 3.5, updateFunc)  -- 3.5-second lifetime
```

## Dependencies & tags
**Components used:** None (this file defines `EmitterManager`, but the constructor pattern suggests `inst.components.emitter` usage — however, no component registration is shown; the manager is used directly.)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `awakeEmitters` | table | `{ limitedLifetimes = {}, infiniteLifetimes = {} }` | Stores active emitters whose entities are awake. |
| `sleepingEmitters` | table | `{ limitedLifetimes = {}, infiniteLifetimes = {} }` | Stores emitters whose entities are currently sleeping. |

## Main functions
### `AddEmitter(inst, lifetime, updateFunc)`
* **Description:** Registers an emitter entity to be updated.Emitters are stored in awake or sleeping tables depending on `inst.entity:IsAwake()`, and further categorized by lifetime (finite vs infinite). An `onremove` listener is added to auto-unregister the emitter.
* **Parameters:**
  * `inst` (entity instance) — The emitter entity.
  * `lifetime` (number or `nil`) — Duration in seconds; `nil` means infinite lifetime.
  * `updateFunc` (function) — Function called each tick to produce effects (e.g., spawn particles).
* **Returns:** Nothing.

### `RemoveEmitter(inst)`
* **Description:** Unregisters an emitter from all internal tracking tables. Called automatically on `onremove` event.
* **Parameters:** `inst` (entity instance) — The emitter to remove.
* **Returns:** Nothing.

### `PostUpdate()`
* **Description:** Global tick handler. Updates all awake and sleeping emitters. Decrements lifetimes for finite emitters and removes those that expire. Skips updates if the server is paused or an error UI is shown.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `TheNet:IsServerPaused()` is true or `global_error_widget ~= nil`.

### `Hibernate(inst)`
* **Description:** Moves an emitter from the awake list to the sleeping list, pausing its updates. Preserves lifetime and update function state.
* **Parameters:** `inst` (entity instance) — The emitter to move to sleeping.
* **Returns:** Nothing.

### `Wake(inst)`
* **Description:** Moves an emitter from the sleeping list back to the awake list to resume updates.
* **Parameters:** `inst` (entity instance) — The emitter to move to awake.
* **Returns:** Nothing.

### `CreateDiscEmitter(radius)`
* **Description:** Returns a function that emits points uniformly in a 2D disc (square-bounded by radius) centered at origin.
* **Parameters:** `radius` (number) — Radius of the disc.
* **Returns:** `function(): x, y` — Coordinates uniformly sampled in the bounding square of the disc.

### `CreateCircleEmitter(radius)`
* **Description:** Returns a function that emits points uniformly within a 2D circle (area-weighted) centered at origin.
* **Parameters:** `radius` (number) — Radius of the circle.
* **Returns:** `function(): x, y` — Coordinates sampled with uniform area distribution.

### `CreateRingEmitter(radius)`
* **Description:** Returns a function that emits points uniformly on the 2D ring (circumference) centered at origin.
* **Parameters:** `radius` (number) — Radius of the ring.
* **Returns:** `function(): x, y` — Coordinates on the circle perimeter.

### `CreateSphereEmitter(radius)`
* **Description:** Returns a function that emits points uniformly on the surface of a 3D sphere centered at origin.
* **Parameters:** `radius` (number) — Radius of the sphere.
* **Returns:** `function(): x, y, z` — 3D coordinates on the sphere surface.

### `CreateBoxEmitter(x_min, y_min, z_min, x_max, y_max, z_max)`
* **Description:** Returns a function that emits points uniformly within an axis-aligned 3D box.
* **Parameters:** Bounds defining the box.
* **Returns:** `function(): x, y, z` — Coordinates uniformly sampled in the box volume.

### `CreateAreaEmitter(polygon, centroid)`
* **Description:** Returns a function that emits points uniformly within a 2D polygon using barycentric sampling per triangle fan.
* **Parameters:**
  * `polygon` (array of points) — Array of `{x, y}` coordinates defining the polygon vertices.
  * `centroid` (array) — `{cx, cy}` origin for relative coordinates.
* **Returns:** `function(): x, y` — Relative coordinates within the polygon.

### `Create2DTriEmitter(tris, scale)`
* **Description:** Returns a function that emits points uniformly within randomly selected 2D triangles, transformed to camera-aligned coordinates and scaled.
* **Parameters:**
  * `tris` (array of triangle definitions) — Each triangle is an array of three `{x, y}` points.
  * `scale` (number) — Scale factor applied to emitted points.
* **Returns:** `function(camera_right, camera_up): vec` — Returns a `Vector3` (via `:Get()`) in camera space.

## Events & listeners
- **Listens to:** `onremove` — Automatically calls `RemoveEmitter(inst)` when the emitter entity is removed from the world.