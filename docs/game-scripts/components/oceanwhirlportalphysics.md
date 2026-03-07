---
id: oceanwhirlportalphysics
title: Oceanwhirlportalphysics
description: Simulates physics forces (pull and radial rotation) on entities near an ocean whirlpool portal, and handles interaction with static objects and winch targets.
tags: [physics, environment, ocean, winch]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3d4825a9
system_scope: physics
---
# Oceanwhirlportalphysics

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Oceanwhirlportalphysics` is a server-side component that applies dynamic physics forces to entities within the influence radius of an ocean whirlpool portal. It models a centripetal pull toward a focal point combined with a radial (tangential) force for rotation. It also detects entities entering the radius, damages or destroys static/indestructible objects in its path, and handles winch-target salvage behavior when entities are moved out of the ocean. This component is exclusively used on the master simulation and must not exist on clients.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("oceanwhirlportalphysics")
inst.components.oceanwhirlportalphysics:SetEnabled(true)
inst.components.oceanwhirlportalphysics:SetRadius(8)
inst.components.oceanwhirlportalphysics:SetPullStrength(6)
inst.components.oceanwhirlportalphysics:SetRadialStrength(3)
```

## Dependencies & tags
**Components used:** `health`, `inventoryitem`, `physicsmodifiedexternally`, `winchtarget`, `workable`  
**Tags:** Checks for `bird`, `boat`, `winchtarget`, and internal exclusion tags (`FX`, `DECOR`, `INLIMBO`, `oceanwhirlportal`, `flying`, `ghost`, `playerghost`, `shadow`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `focalradius` | number | `1` | Inner radius around the center where maximum pull force is applied. |
| `radius` | number | `4` | Outer radius beyond which no physics forces are applied. |
| `pullstrength` | number | `4` | Strength of the inward (centripetal) force. |
| `radialstrength` | number | `2` | Strength of the rotational (tangential) force. |
| `forceexponent` | number | computed | Derived exponent used for smooth falloff of forces between `focalradius` and `radius`. |
| `enabled` | boolean | `false` | Whether the physics simulation is active. |
| `tickaccumulator` | number | `0` | Accumulator for time-based tick scheduling. |
| `fastcooldown` | number? | `nil` | Remaining cooldown before reverting to slow tick updates. |

## Main functions
### `SetEnabled(enabled)`
*   **Description:** Enables or disables the physics simulation. When enabled, starts updating; when disabled, stops updates and forgets all watched entities.
*   **Parameters:** `enabled` (boolean) — whether to activate the component.
*   **Returns:** Nothing.
*   **Error states:** No-op if `enabled` matches current state or if the entity is asleep.

### `SetFocalRadius(focalradius)`
*   **Description:** Sets the inner radius of influence and recomputes the force exponent for smooth falloff.
*   **Parameters:** `focalradius` (number) — new focal radius value.
*   **Returns:** Nothing.

### `SetRadius(radius)`
*   **Description:** Sets the outer radius of influence and recomputes the force exponent.
*   **Parameters:** `radius` (number) — new outer radius value.
*   **Returns:** Nothing.

### `SetPullStrength(pullstrength)`
*   **Description:** Configures the magnitude of the inward pull force.
*   **Parameters:** `pullstrength` (number) — new pull strength multiplier.
*   **Returns:** Nothing.

### `SetRadialStrength(radialstrength)`
*   **Description:** Configures the magnitude of the rotational (tangential) force.
*   **Parameters:** `radialstrength` (number) — new radial strength multiplier.
*   **Returns:** Nothing.

### `SetOnEntityTouchingFocalFn(fn)`
*   **Description:** Registers a callback invoked when an entity passes within half its own radius of the focal center.
*   **Parameters:** `fn` (function) — function accepting `(portal_inst, ent)` as arguments.
*   **Returns:** Nothing.

### `CheckForEntities()`
*   **Description:** Scans the local area for entities within `radius`, filters by tag and position, and adds qualifying entities to `watchedentities`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** If an entity has `winchtarget`, it may be teleported or salvaged and removed instead of being added.

### `PullEntities(tickperiod)`
*   **Description:** Applies radial and inward physics forces to each watched entity based on distance, using `physicsmodifiedexternally`.
*   **Parameters:** `tickperiod` (number) — time delta used to scale velocity (should be `TICK_FAST_PERIOD`).
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Main update loop; toggles between fast and slow update rates based on entity activity.
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — fires `OnRemove_WatchedEntity` for watched entities to clean up references.  
- **Pushes:** `flyaway` (to birds), `teleported` (on winch-target teleports), `on_salvaged` (after salvaging items).

## Notes
- Entities with `Physics:GetMass() == 0` are treated as static and are either damaged via `health` or destroyed via `workable:Destroy`.
- The `OnEntitySleep` and `OnEntityWake` callbacks allow the component to pause/resume updates when the owner entity sleeps.
- Updates skip or slow down when no entities are being affected, conserving performance (`TICK_FAST_PERIOD = 0.1` vs `TICK_SLOW_PERIOD = 1.0`).
- Uses `TheWorld.Map:IsOceanAtPoint` to validate positions before moving winch targets out of the ocean.
