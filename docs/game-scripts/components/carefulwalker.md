---
id: carefulwalker
title: Carefulwalker
description: Monitors nearby terrain anomalies and adjusts walking speed to slow the entity when moving over uneven ground.
tags: [locomotion, terrain, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 569dd657
system_scope: locomotion
---

# Carefulwalker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Carefulwalker` enables an entity to detect uneven terrain (via `unevengrounddetected` events) and temporarily reduce movement speed to simulate cautious traversal. It interacts primarily with the `locomotor` component to apply and remove speed multipliers dynamically. When uneven terrain enters a tracked radius around the entity, it toggles a "careful walking" state that reduces speed until the terrain is no longer in range.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("carefulwalker")
-- Automatically tracks terrain anomalies via event listener
-- Manually set custom speed multiplier for careful walking
inst.components.carefulwalker:SetCarefulWalkingSpeedMultiplier(0.5)
-- Manually track a terrain patch (e.g., after receiving an event)
inst.components.carefulwalker:TrackTarget(terrain_entity, 2.5, 3.0)
-- Check if entity is in careful walking state
if inst.components.carefulwalker:IsCarefulWalking() then
    print("Entity is moving carefully!")
end
```

## Dependencies & tags
**Components used:** `locomotor` (via `SetExternalSpeedMultiplier`, `RemoveExternalSpeedMultiplier`, `FasterOnRoad`)  
**Tags:** None added, removed, or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity instance. |
| `careful` | boolean | `false` | Whether the entity is currently in "careful walking" mode (i.e., speed is reduced). |
| `carefulwalkingspeedmult` | number | `TUNING.CAREFUL_SPEED_MOD` | Current speed multiplier applied during careful walking. |
| `targets` | table | `{}` | Map of active terrain patches (entities) being monitored, keyed by target entity. Each entry contains `rangesq` (squared radius) and `remaining` (time left in seconds). |

## Main functions
### `SetCarefulWalkingSpeedMultiplier(mult)`
* **Description:** Sets the speed multiplier used when the entity is in careful walking mode. The value is clamped to `0–1`. If no targets are tracked or the multiplier is set to `1`, careful walking is disabled.
* **Parameters:** `mult` (number) — Speed multiplier, clamped to `[0, 1]`.
* **Returns:** Nothing.
* **Error states:** If `mult >= 1`, careful walking is automatically disabled.

### `TrackTarget(target, radius, duration)`
* **Description:** Begins tracking a terrain anomaly entity. The entity will enter careful walking mode if this target moves within `radius` distance while careful walking is possible.
* **Parameters:**  
  `target` (`Entity`) — The terrain anomaly entity to track.  
  `radius` (number) — Detection radius around the entity.  
  `duration` (number) — How long (in seconds) the target remains tracked.
* **Returns:** Nothing.

### `IsCarefulWalking()`
* **Description:** Returns whether the entity is currently in careful walking mode.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if speed is reduced, `false` otherwise.

### `ToggleCareful(careful)`
* **Description:** Explicitly enables or disables careful walking mode, updating the `locomotor` speed multiplier and firing the `carefulwalking` event.
* **Parameters:** `careful` (boolean) — Desired state.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Periodic update function. Evaluates all tracked targets, decrements their remaining time, and determines if any are close enough to trigger careful walking. Calls `ToggleCareful` accordingly.
* **Parameters:** `dt` (number) — Time elapsed since last update.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `unevengrounddetected` — Fires `TrackTarget` for newly detected terrain anomalies.
- **Pushes:** `carefulwalking` — Fired with `{ careful = true }` when entering careful mode, or `{ careful = false }` when exiting.
