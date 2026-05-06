---
id: wx78_lightbeam
title: Wx78 Lightbeam
description: Prefab entity that creates a dynamic light beam effect attached to WX-78 character, with networked rotation and radius properties, client-side prediction for smooth movement.
tags: [prefab, fx, lighting, wx78]
sidebar_position: 10
last_updated: 2026-05-01
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: ee0fa28c
system_scope: fx
---

# Wx78 Lightbeam

> Based on game build **722832** | Last updated: 2026-05-01

## Overview
`wx78_lightbeam.lua` registers a spawnable visual effect entity that creates a dynamic light beam attached to the WX-78 character. The prefab uses network variables (`net_shortint`, `net_smallbyte`) to synchronize rotation and radius between master and clients. On the client, it employs position prediction logic via `playercontroller` to smooth rotation during movement. The light beam spawns multiple child light FX entities that orbit around the owner based on the configured radius.

## Usage example
```lua
-- Spawn the lightbeam prefab:
local inst = SpawnPrefab("wx78_lightbeam")

-- Attach to an owner entity (typically WX-78 player):
if inst.AttachToOwner ~= nil then
    inst:AttachToOwner(player_inst)
end

-- Set light radius (master only):
if TheWorld.ismastersim and inst.SetLightRadius ~= nil then
    inst:SetLightRadius(5)
end
```

## Dependencies & tags
**Components used:**
- `updatelooper` -- registered on master to call `LightBeam_OnUpdate` each frame
- `transform` -- entity transform for position/rotation
- `light` -- light component on child FX entities
- `network` -- enables network replication for netvars

**Tags:**
- `FX` -- added in `fn()` and child lights; marks entity as visual effect
- `NOCLICK` -- added in `fn()` and child lights; prevents mouse interaction
- `staysthroughvirtualrooms` -- added to child lights; persists through room transitions

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `light_rotation` | net_shortint | `0` | Networked rotation value (degrees). Dirty event: `onlightrotationdirty`. Syncs owner rotation to clients. |
| `light_radius` | net_smallbyte | --- | Networked light radius value. Dirty event: `onlightradiusdirty`. Triggers `LightBeam_UpdateLights` on change. |
| `lightbeam_rotation` | number | `0` | (master only) Interpolated rotation for smooth animation. Not networked. |
| `light_fx` | table | `{}` | (master only) Array of child light FX entity instances. Managed by `LightBeam_UpdateLights`. |
| `owner` | entity | `nil` | The parent entity (WX-78 player) this lightbeam is attached to. |
| `_is_predict_walking` | boolean | `nil` | (client only) Tracks whether owner is currently predicted to be walking. |
| `last_predict_walk_time` | number | `nil` | (client only) Timestamp of last predicted walk state for rotation lingering. |
| `started_walking_pos` | Vector3 | `nil` | (client only) Position when walking prediction started, used for distance checks. |

| `PREDICT_FROM_LAST_WALK_DELAY` | constant (local) | `2` | Seconds after walking stops to continue predicting rotation for smooth transitions. |
| `LIGHT_R, LIGHT_G, LIGHT_B` | constant (local) | `235/255, 121/255, 12/255` | RGB color values for child light entities (orange-yellow). |

## Main functions
### `fn()`
* **Description:** Prefab constructor. Creates the entity, adds network component, initializes netvars for rotation and radius. On client, sets up replication handler and dirty event listener. On master, sets up attachment and radius functions. Returns `inst` for framework to complete initialization.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on both client and master with appropriate guards.

### `SpawnLightsForOwner(inst, owner)` (local)
* **Description:** Initializes the lightbeam for a specific owner. Stores owner reference, creates empty light_fx table, sets initial rotation, calls `LightBeam_UpdateLights` to spawn child FX, and attaches updatelooper component on master. Also sets `OnRemoveEntity` cleanup handler.
* **Parameters:**
  - `inst` -- lightbeam entity instance
  - `owner` -- parent entity (WX-78 player) to attach to
* **Returns:** None
* **Error states:** Errors if `owner` is nil or lacks `Transform` component (accessed without guard).

### `AttachToOwner(inst, owner)` (local)
* **Description:** Sets the entity parent relationship and calls `SpawnLightsForOwner`. Used to attach the lightbeam to WX-78 at runtime.
* **Parameters:**
  - `inst` -- lightbeam entity instance
  - `owner` -- parent entity to attach to
* **Returns:** None
* **Error states:** Errors if `owner` is nil or lacks `entity` component.

### `LightBeam_SetLightradius(inst, light_radius)` (local)
* **Description:** Sets the networked light radius value and triggers an update to spawn/remove child FX entities accordingly. Master-only function (called via `inst.SetLightRadius` which is only assigned on master).
* **Parameters:**
  - `inst` -- lightbeam entity instance
  - `light_radius` -- number, desired light radius
* **Returns:** None
* **Error states:** Errors if called on client — inst.SetLightRadius is nil on client, calling it crashes (no guard present).

### `LightBeam_OnUpdate(inst, dt)` (local)
* **Description:** **Periodic update callback.** Called by updatelooper each frame on master. Calculates target rotation via `LightBeam_GetTargetRotation`, interpolates current rotation toward target (75% blend), and updates all child light FX positions to orbit around owner.
* **Parameters:**
  - `inst` -- lightbeam entity instance
  - `dt` -- delta time since last update
* **Returns:** None
* **Error states:** Errors if `inst.owner` is nil or lacks `Transform` component.

### `LightBeam_GetTargetRotation(inst)` (local)
* **Description:** Calculates the target rotation for the lightbeam. On master, reads owner's transform rotation directly. On client, attempts prediction using `playercontroller:CanLocomote()` and `GetRemotePredictPositionExternal()` to smooth rotation during movement. Falls back to networked `light_rotation` value if prediction is unavailable.
* **Parameters:** `inst` -- lightbeam entity instance
* **Returns:** number, rotation in degrees
* **Error states:** Errors if `inst.owner` is nil or lacks `Transform` component. Client prediction path errors if `playercontroller` component is missing on owner. Errors if `inst.sg` is nil (no guard before inst.sg:HasStateTag call on line 61).

### `LightBeam_UpdateLights(inst)` (local)
* **Description:** Manages the pool of child light FX entities based on current `light_radius`. Spawns new lights if radius increases, removes excess lights if radius decreases. Updates each light's offset position and radius. Called on radius change and initial spawn.
* **Parameters:** `inst` -- lightbeam entity instance
* **Returns:** None
* **Error states:** Errors if `inst.light_fx` table is nil or `inst.light_radius:value()` returns nil.

### `CreateLight(i, light_rad)` (local)
* **Description:** Creates a single child light FX entity. Adds Transform and Light components, sets color/intensity/falloff, applies tags, and assigns `SetLightRadius` method. Used internally by `LightBeam_UpdateLights`.
* **Parameters:**
  - `i` -- integer index for this light in the sequence
  - `light_rad` -- base light radius for sizing calculations
* **Returns:** entity instance (child light FX)
* **Error states:** None — entity creation is guarded by engine.

### `LightFx_SetLightRadius(inst, light_radius)` (local)
* **Description:** Sets the light radius on a child FX entity. Uses a square-root scaling formula: `radius = math.sqrt(light_radius * 0.08) * inst.i`. Called on each child light during `LightBeam_UpdateLights`.
* **Parameters:**
  - `inst` -- child light FX entity
  - `light_radius` -- base radius value from parent
* **Returns:** None
* **Error states:** Errors if `inst.Light` component is nil.

### `LightBeam_OnRemoveEntity(inst)` (local)
* **Description:** Cleanup handler called when the lightbeam entity is removed. Iterates through all child light FX entities and calls `Remove()` on each to clean up spawned entities.
* **Parameters:** `inst` -- lightbeam entity instance
* **Returns:** None
* **Error states:** Errors if `inst.light_fx` table is nil or contains invalid entities.

### `OnEntityReplicated(inst)` (local)
* **Description:** Client-side replication handler. Called when the entity is replicated on client. Retrieves the parent entity and calls `SpawnLightsForOwner` to initialize the light FX on the client side.
* **Parameters:** `inst` -- lightbeam entity instance (client replica)
* **Returns:** None
* **Error states:** Errors if `inst.entity:GetParent()` returns nil.

## Events & listeners
**Listens to:**
- `onlightradiusdirty` (client only) -- triggers `LightBeam_UpdateLights` when `light_radius` netvar changes; syncs child light count to master value. **Data:** none

**World state watchers:**
- None identified.