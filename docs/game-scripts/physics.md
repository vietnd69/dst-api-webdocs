---
id: physics
title: Physics
description: Manages physics-based entity destruction, collision callbacks, and launch mechanics for entities in the world.
tags: [physics, combat, destruction, collision]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 7a4e5a22
system_scope: physics
---

# Physics

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `physics.lua` file provides low-level utilities for handling entity destruction, physics-based launching, and collision callbacks. It is not a traditional component added to entities, but rather a shared utility module containing helper functions (`Launch`, `DestroyEntity`, `LaunchAndClearArea`, etc.) and supporting classes (`CollisionMaskBatcher`) used across the codebase. It integrates with several components (`workable`, `pickable`, `health`, `combat`, `inventoryitem`, `mine`, `locomotor`) to determine how entities react when interacted with or destroyed by physics or player actions.

## Usage example
```lua
-- Launch an entity away from a launcher
Launch(inst, launcher, 8)

-- Launch an entity with more precise control
Launch2(inst, launcher, 6, 2, 0.5, 1.0, 12, nil)

-- Destroy an entity based on its components and tags
DestroyEntity(tree, player, false, true)

-- Clear a radius and launch items up
LaunchAndClearArea(spawner, 5, 5, 1, 1, 0)
```

## Dependencies & tags
**Components used:** `workable`, `pickable`, `health`, `combat`, `inventoryitem`, `mine`, `locomotor`, `Transform`, `Physics`  
**Tags added:** None  
**Tags checked:** `no_collision_callback_for_other`, `stump`, `intense`, `_inventoryitem`, `locomotor`, `INLIMBO`, and dynamic `*_workable`/`NPC_workable` tags

## Properties
No public properties are defined in this module. It contains only functions and a helper class.

## Main functions
### `OnPhysicsCollision(...)`
*   **Description:** Internal callback invoked by the engine when two physics-enabled entities collide. Routes to registered per-entity collision callbacks and respects the `no_collision_callback_for_other` tag.
*   **Parameters:**
    *   `guid1`, `guid2` (number) — Entity GUIDs.
    *   `world_position_on_a_*`, `world_position_on_b_*` (number) — World positions of collision on each entity.
    *   `world_normal_on_b_*` (number) — Surface normal on entity B.
    *   `lifetime_in_frames` (number) — Frames since collision began.
*   **Returns:** Nothing.
*   **Error states:** No-op if either entity is invalid or if the respective callback is `nil`.

### `CollisionMaskBatcher(entormask)`
*   **Description:** Helper class for batching collision mask changes before applying them to an entity, minimizing calls to the underlying C++ physics layer.
*   **Parameters:** `entormask` — An entity instance or a raw collision mask bitmask.
*   **Properties:**
    | Property | Type | Default | Description |
    |----------|------|---------|-------------|
    | `mask` | number | `0` or entity's current mask | The accumulated bitmask for collision testing. |
*   **Methods:**
    *   `ClearCollisionMask()` — Resets `mask` to `0`.
    *   `SetCollisionMask(...)` — Sets `mask` to the bitwise OR of provided masks.
    *   `CollidesWith(mask)` — Adds `mask` to `mask` (logical OR).
    *   `ClearCollidesWith(mask)` — Removes `mask` from `mask` (logical AND NOT).
    *   `CommitTo(ent)` — Writes `mask` to `ent.Physics:SetCollisionMask`.

### `Launch(inst, launcher, basespeed)`
*   **Description:** Launches `inst` away from `launcher` at an angle with slight randomness, using a fixed vertical impulse (`10`).
*   **Parameters:**
    *   `inst` (Entity) — Entity to launch.
    *   `launcher` (Entity) — Source of launch direction.
    *   `basespeed` (number, optional) — Base horizontal speed; defaults to `5`.
*   **Returns:** Nothing.
*   **Error states:** No-op if `inst.Physics` is inactive or `nil`, or if `launcher` is `nil`.

### `Launch2(inst, launcher, basespeed, speedmult, startheight, startradius, vertical_speed, force_angle)`
*   **Description:** Launches `inst` with full control over initial position, angle, and velocity.
*   **Parameters:**
    *   `inst` (Entity) — Entity to launch.
    *   `launcher` (Entity) — Reference point for launch origin.
    *   `basespeed` (number) — Base speed multiplier.
    *   `speedmult` (number) — Random speed variance added.
    *   `startheight` (number) — Launch height above launcher.
    *   `startradius` (number) — Horizontal offset radius from launcher.
    *   `vertical_speed` (number, optional) — Initial vertical velocity.
    *   `force_angle` (number, optional) — Fixed angle in degrees; if `nil`, direction is computed from relative positions.
*   **Returns:** `number` — The computed launch angle (in radians), or `0` on failure.
*   **Error states:** Returns `0` if `inst` or `launcher` is invalid or physics inactive.

### `LaunchAt(inst, launcher, target, speedmult, startheight, startradius, randomangleoffset)`
*   **Description:** Launches `inst` toward `target` (or away from camera direction if `target` is `nil`) with angular randomness.
*   **Parameters:**
    *   `inst` (Entity) — Entity to launch.
    *   `launcher` (Entity) — Origin point.
    *   `target` (Entity, optional) — Target to face or aim near.
    *   `speedmult` (number, optional) — Speed multiplier; defaults to `1`.
    *   `startheight`, `startradius` — Launch offset parameters.
    *   `randomangleoffset` (number, optional) — Angular randomness in degrees; defaults to `30`.
*   **Returns:** Nothing.
*   **Error states:** No-op if `inst.Physics` is inactive or `launcher` is `nil`.

### `LaunchToXZ(inst, tox, toz)`
*   **Description:** Launches `inst` directly toward `(tox, toz)` on the ground plane using physics-based speed tuned to friction.
*   **Parameters:**
    *   `inst` (Entity) — Entity to launch.
    *   `tox`, `toz` (number) — Target world X and Z coordinates.
*   **Returns:** Nothing.
*   **Error states:** Teleports to height `.1` and sets vertical velocity `2` if `tox, toz` equals current position.

### `DestroyEntity(ent, destroyer, kill_all_creatures, remove_entity_as_fallback)`
*   **Description:** Handles entity destruction logic based on component state and tags. Respects workables, pickables, health, and combat.
*   **Parameters:**
    *   `ent` (Entity) — Entity to destroy.
    *   `destroyer` (Entity) — Entity performing the destruction.
    *   `kill_all_creatures` (boolean) — If true, kills health-containing entities not otherwise handled.
    *   `remove_entity_as_fallback` (boolean) — If true, removes the entity if no other action is taken.
*   **Returns:** Nothing.
*   **Error states:** Skips processing if `ent` is invalid or if a proxy entity exists (and delegates to it).

### `LaunchAndClearArea(inst, radius, launch_basespeed, launch_speedmult, launch_startheight, launch_startradius)`
*   **Description:** Destroys or launches all entities within a radius of `inst`, respecting different tags and components.
*   **Parameters:**
    *   `inst` (Entity) — Center of area effect.
    *   `radius` (number) — Search radius.
    *   `launch_basespeed`, `launch_speedmult`, `launch_startheight`, `launch_startradius` — Parameters passed to `Launch2`.
*   **Returns:** Nothing.
*   **Behavior:**
    *   Destroys collapsible entities (`*_workable`, `_combat`, `pickable`) via `DestroyEntity`.
    *   Deactivates `mine` components, then launches non-`nobounce` inventory items via `Launch2`.

## Events & listeners
- **Listens to:** None (this module does not register listeners directly).
- **Pushes:** None (this module does not fire events directly).