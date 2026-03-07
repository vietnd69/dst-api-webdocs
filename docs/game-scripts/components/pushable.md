---
id: pushable
title: Pushable
description: Enables an entity to be pushed by another entity and maintains relative positioning during the push.
tags: [locomotion, physics, interaction]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f111f77c
system_scope: physics
---
# Pushable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Pushable` component allows an entity to respond to being pushed by another entity (the *doer*). It manages the motion of the pushed entity during a push, optionally adjusting speed to maintain a target distance from the pusher. It integrates with the physics system via `Physics:SetMotorVel`, and supports event callbacks and game events (`startpushing`, `stoppushing`). It is typically added to objects or entities that should slide or be moved by player or creature interaction.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("pushable")
inst.components.pushable:SetTargetDist(1.5)
inst.components.pushable:SetMinDist(0.5)
inst.components.pushable:SetMaxDist(5)
inst.components.pushable:SetPushingSpeed(3)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `pushing_walk` state tag on the pusher (`doer.sg`).  
Adds no tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity. |
| `doer` | `Entity` or `nil` | `nil` | The entity currently pushing this one. |
| `targetdist` | number or `nil` | `nil` | Desired distance from the pusher; used to adjust speed dynamically. |
| `mindist` | number or `nil` | `nil` | Minimum separation; if closer, pushing forward stops. |
| `maxdist` | number or `nil` | `nil` | Maximum separation; if exceeded, pushing stops. |
| `speed` | number | `3` | Base forward velocity during a push. |
| `onstartpushingfn` | function or `nil` | `nil` | Callback fired when a push begins: `fn(inst, doer)`. |
| `onstoppushingfn` | function or `nil` | `nil` | Callback fired when a push ends: `fn(inst, doer)`. |

## Main functions
### `SetTargetDist(dist)`
* **Description:** Sets the desired distance to maintain from the pusher; used to dynamically adjust pushing speed.
* **Parameters:** `dist` (number) — target separation distance in units.
* **Returns:** Nothing.

### `SetMinDist(dist)`
* **Description:** Configures the minimum separation; if the pusher gets closer than this, forward motion ceases.
* **Parameters:** `dist` (number) — minimum allowed separation in units.
* **Returns:** Nothing.

### `SetMaxDist(dist)`
* **Description:** Configures the maximum separation; if the pusher drifts farther than this, the push is canceled.
* **Parameters:** `dist` (number) — maximum allowed separation in units.
* **Returns:** Nothing.

### `SetPushingSpeed(speed)`
* **Description:** Sets the base forward speed during a push.
* **Parameters:** `speed` (number) — base velocity in units/second.
* **Returns:** Nothing.

### `SetOnStartPushingFn(fn)`
* **Description:** Assigns a callback to run when a push begins.
* **Parameters:** `fn` (function) — callback with signature `fn(inst, doer)`.
* **Returns:** Nothing.

### `SetOnStopPushingFn(fn)`
* **Description:** Assigns a callback to run when a push ends.
* **Parameters:** `fn` (function) — callback with signature `fn(inst, doer)`.
* **Returns:** Nothing.

### `IsPushing()`
* **Description:** Reports whether an entity is currently being pushed.
* **Parameters:** None.
* **Returns:** `true` if a valid `doer` is set; otherwise `false`.

### `GetPushingSpeed()`
* **Description:** Returns the current base pushing speed.
* **Parameters:** None.
* **Returns:** number — the push speed.

### `ShouldStopForwardMotion()`
* **Description:** Determines whether forward motion should cease based on proximity to the pusher (`mindist` check).
* **Parameters:** None.
* **Returns:** `true` if the pusher is within `mindist`; otherwise `false`.

### `StartPushing(doer)`
* **Description:** Initiates a push by the given entity. Updates the physics motor, triggers callbacks, and starts the update loop.
* **Parameters:** `doer` (Entity) — the entity initiating the push; must be valid and have a valid state graph.
* **Returns:** Nothing.
* **Error states:** Silently returns if `doer` is `nil`, invalid, or lacks a state graph.

### `StopPushing(doer)`
* **Description:** Halts the current push. Clears physics motion and stops the update loop. If `doer` is provided and does not match the active pusher, nothing happens.
* **Parameters:** `doer` (Entity or `nil`) — optional filter; if `nil`, stops any active push.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called every frame while pushing. Adjusts motor velocity to move forward; optionally modulates speed to reach `targetdist`.
* **Parameters:** `dt` (number) — delta time since last frame.
* **Returns:** Nothing.
* **Error states:** Automatically calls `StopPushing` if the pusher state is invalid, missing the `pushing_walk` state tag, or exceeds `maxdist`.

## Events & listeners
- **Listens to:** N/A (this component does not register listeners itself).
- **Pushes:** `startpushing` — fired when a push begins; payload: `{ doer = Entity }`.  
  `stoppushing` — fired when a push ends; payload: `{ doer = Entity }`.
