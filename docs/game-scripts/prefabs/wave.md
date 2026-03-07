---
id: wave
title: Wave
description: Simulates an ocean wave entity that moves, interacts with boats and items, and triggers splash effects upon collision or contact with land.
tags: [physics, environment, fx, ocean]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 34068702
system_scope: environment
---

# Wave

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wave` prefab creates an environment effect entity representing a moving ocean wave. It is designed to interact physically with boats (via `boatphysics`), push nearby pickup-able items, and generate splash effects when colliding with entities or reaching dry land. It operates primarily on the master simulation and uses periodic tasks to check for ground contact and nearby items. The component is non-persistent and self-cleans after a short lifetime.

## Usage example
```lua
-- Wave prefabs are instantiated internally by the game (e.g., via Turn of the Tides mechanics)
-- Typical instantiation is done by the prefab factory:
local wave = SpawnPrefab("wave_med")
if wave ~= nil then
    wave.Transform:SetPosition(x, y, z)
    -- Wave behavior is controlled by state graph and internal tasks; no further setup required
end
```

## Dependencies & tags
**Components used:** `boattrail`, `moisture` (via `v.components.moisture`), `boatphysics` (via `other.components.boatphysics`)
**Tags:** Adds `scarytoprey`, `wave`, `FX`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `waveactive` | boolean | `false` | Controls whether the wave pushes items and applies force to boats. Set via state graph. |
| `DoSplash` | function | `DoSplash` (defined locally) | Public method reference used to manually trigger splash effects. |

## Main functions
### `DoSplash(inst)`
* **Description:** Spawns a splash prefab at the wave’s position, applies wetness to nearby entities with a `moisture` component, and removes the wave entity.
* **Parameters:** `inst` (Entity) — the wave instance triggering the splash.
* **Returns:** Nothing.
* **Error states:** May skip splash logic if no `moisture` component is found on a nearby entity.

### `oncollidewave(inst, other)`
* **Description:** Collision callback that triggers splash and applies force to boats when the wave collides.
* **Parameters:**  
  - `inst` (Entity) — the wave entity.  
  - `other` (Entity) — the entity colliding with the wave.
* **Returns:** Nothing.
* **Error states:** Does nothing if `inst.waveactive` is false and `other` is *not* another wave (i.e., prevents wave-on-wave interaction unless active).

### `CheckGround(inst)`
* **Description:** Checks ahead of the wave’s current velocity to see if the next position is land; if so, triggers a splash and removes the wave.
* **Parameters:** `inst` (Entity) — the wave entity.
* **Returns:** Nothing.

### `CheckForItems(inst)`
* **Description:** Scans for nearby pickup-able items (e.g., inventory items, kelp) within a radius of 2, ignoring entities with tags in `NO_PUSH_TAGS`, and applies velocity to them to simulate being pushed by the wave.
* **Parameters:** `inst` (Entity) — the wave entity.
* **Returns:** Nothing.
* **Error states:** Returns early if `inst.waveactive` is false.

### `launch_in_direction(thing_to_launch, vx, vz)`
* **Description:** Applies velocity to a target entity in the wave’s forward direction (X/Z plane only).
* **Parameters:**  
  - `thing_to_launch` (Entity or `nil`) — the entity to push.  
  - `vx` (number) — X-axis velocity component.  
  - `vz` (number) — Z-axis velocity component.
* **Returns:** Nothing.

### `OnRemoveEntity(inst)`
* **Description:** Cleanup function called when the entity is removed; stops the wave’s looping sound.
* **Parameters:** `inst` (Entity) — the wave entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers removal of `wave_splash` when animation completes.
- **Pushes:** None.