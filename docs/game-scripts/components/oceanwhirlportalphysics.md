---
id: oceanwhirlportalphysics
title: Oceanwhirlportalphysics
description: This component simulates the physics behavior of an ocean whirlpool portal by pulling and rotating nearby entities within a configurable radius.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 3d4825a9
---

# Oceanwhirlportalphysics

## Overview
This component implements the physics simulation logic for an ocean whirlpool portal entity. It detects eligible entities within a radial zone, tracks them, and applies computed inward and radial forces to simulate vortex-induced motion and rotation. It dynamically switches between fast and slow update cycles based on activity and handles entity entry/exit from the influence zone.

## Dependencies & Tags
- Requires the `physicsmodifiedexternally` component (added dynamically to entities it tracks).
- Tags entities with `physicsmodifiedexternally` as a source (`self.inst`).
- Uses the `WHIRLPORTALPHYSICS_CANT_TAGS` list to exclude entities: `"FX"`, `"DECOR"`, `"INLIMBO"`, `"oceanwhirlportal"`, `"flying"`, `"ghost"`, `"playerghost"`, `"shadow"`.
- Listens to `"onremove"` events on tracked entities.
- Depends on `TheWorld.Map:IsOceanAtPoint`, `FindRandomPointOnShoreFromOcean`, `TUNING.OCEANWHIRLBIGPORTAL_BOAT_PERCENT_DAMAGE_PER_TICK`, and the `winchtarget` and `health`/`workable` component behaviors.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `focalradius` | number | `DEFAULT_FOCAL_RADIUS` (1) | Radius around the portal center where maximum pull occurs. |
| `radius` | number | `DEFAULT_RADIUS` (4) | Outer radius of the effective vortex zone. |
| `pullstrength` | number | `DEFAULT_PULLSTRENGTH` (4) | Magnitude of the inward (radial-toward-center) force. |
| `radialstrength` | number | `DEFAULT_RADIALSTRENGTH` (2) | Magnitude of the rotational (tangential) force. |
| `forceexponent` | number | Calculated from `focalradius`/`radius` | Exponent used in force decay calculation; ensures smooth transition between focal and outer radius. |
| `tickaccumulator` | number | 0 | Accumulator for controlling update frequency (slow vs fast tick). |
| `enabled` | boolean | false | Whether the component is actively updating physics. |
| `fastcooldown` | number? | nil | Remaining time before reverting to slow updates if no entities are tracked. |
| `watchedentities` | table | empty table | Map of tracked entities currently within the vortex zone. |
| `onentitytouchingfocalfn` | function? | nil | Optional callback invoked when a tracked entity touches the focal radius. |

## Main Functions

### `SetEnabled(enabled)`
* **Description:** Enables or disables the physics simulation. When enabled, starts/stops component updates and manages tracked entities.
* **Parameters:**
  * `enabled` (boolean): Whether to activate the physics.

### `RecalculateForceExponent()`
* **Description:** Computes `forceexponent` based on `focalradius` and `radius` to control how force decays across the vortex zone.
* **Parameters:** None.

### `SetFocalRadius(focalradius)`
* **Description:** Updates the focal radius and recalculates the force exponent.
* **Parameters:**
  * `focalradius` (number): New focal radius.

### `SetRadius(radius)`
* **Description:** Updates the outer vortex radius and recalculates the force exponent.
* **Parameters:**
  * `radius` (number): New outer radius.

### `SetPullStrength(pullstrength)`
* **Description:** Sets the inward pull force magnitude.
* **Parameters:**
  * `pullstrength` (number): New pull strength.

### `SetRadialStrength(radialstrength)`
* **Description:** Sets the rotational (tangential) force magnitude.
* **Parameters:**
  * `radialstrength` (number): New radial strength.

### `SetOnEntityTouchingFocalFn(fn)`
* **Description:** Registers a callback to execute when a tracked entity enters the focal radius.
* **Parameters:**
  * `fn` (function): Callback accepting `(self.inst, ent)`.

### `CheckForEntities()`
* **Description:** Scans for entities within the outer radius, filters them, and adds/removes them from the `watchedentities` list. Handles winch targets (e.g., anchors) by optionally relocating or salvaging them.
* **Parameters:** None.

### `RememberEntity(ent)`
* **Description:** Adds an entity to the `watchedentities` list and ensures it has the `physicsmodifiedexternally` component with this component registered as a physics source.
* **Parameters:**
  * `ent` (Entity): The entity to track.

### `ForgetEntity(ent)`
* **Description:** Removes an entity from tracking, cleans up event listeners and physics source registration.
* **Parameters:**
  * `ent` (Entity): The entity to stop tracking.

### `PullEntities(tickperiod)`
* **Description:** Applies computed forces (inward + radial) to all tracked entities based on their distance from the center, modifying their velocity via `physicsmodifiedexternally`.
* **Parameters:**
  * `tickperiod` (number): Time delta used for velocity scaling (currently fixed to `TICK_FAST_PERIOD`).

### `ShouldRememberEntity(ent)`
* **Description:** Determines if an entity should be tracked. Filters out birds, static entities (with mass 0), and triggers destruction logic for the latter.
* **Parameters:**
  * `ent` (Entity): The entity to evaluate.

### `TryToBreakStaticObject(ent)`
* **Description:** Attempts to destroy or damage a static object (mass 0) by reducing health or destroying workables.
* **Parameters:**
  * `ent` (Entity): The static object to destroy/damage.

### `OnUpdate(dt)`
* **Description:** Main update loop that schedules `CheckForEntities()` and `PullEntities()` at either fast or slow intervals.
* **Parameters:**
  * `dt` (number): Delta time since last frame.

### `OnEntitySleep()` / `OnEntityWake()`
* **Description:** Pauses/resumes updates when the parent entity sleeps/wakes (e.g., during world lighting changes).
* **Parameters:** None.

## Events & Listeners
- Listens for `"onremove"` events on tracked entities via `ent:ListenForEvent("onremove", ...)` to stop tracking them when removed.
- Triggers `"flyaway"` event on bird entities.
- Triggers `"teleported"` event on winch target entities that are relocated.
- Triggers `"on_salvaged"` event on salvaged items.
- Triggers `"splash_sink"` and `"teleported"` events during winch target relocation.
- Pushes `self.inst` as a physics source via `physicsmodifiedexternally:AddSource` / `RemoveSource`.