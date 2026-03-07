---
id: heavyobstaclephysics
title: Heavyobstaclephysics
description: Manages dynamic physics behavior for large in-game obstacles that transition between solid, falling, and pushed states based on proximity and interactions.
tags: [physics, environment, obstacle]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 83c8c121
system_scope: physics
---

# Heavyobstaclephysics

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HeavyObstaclePhysics` governs how large static obstacles in the world behave under various physical and gameplay conditions. It enables dynamic radius adjustment based on nearby characters, transitions between solid obstacle, item (falling/loose), and pushing states, and handles gravity-based falling. It is designed to be used in conjunction with `MakeHeavyObstaclePhysics`prefab helper and typically attaches to large environmental props like rocks, pillars, or moveable structures. The component coordinates collision groups, damping, mass, and periodic tasks to maintain realistic physical behavior.

## Usage example
```lua
local inst = CreateEntity()
-- ... (entity setup)
inst:AddComponent("heavyobstaclephysics")
inst.components.heavyobstaclephysics:SetRadius(2.5)
inst.components.heavyobstaclephysics:AddFallingStates()
inst.components.heavyobstaclephysics:AddPushingStates()
inst.components.heavyobstaclephysics:SetOnPhysicsStateChangedFn(function(inst, state) print("State:", state) end)
```

## Dependencies & tags
**Components used:** `inventoryitem` (checked via `IsHeld()`), `physics`, `transform` (for position and teleportation).
**Tags:** Checks characters with tags `"character"` and `"locomotor"`, excludes those with `"INLIMBO"`, `"NOCLICK"`, `"flying"`, `"ghost"`. Does not modify tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxradius` | number | `nil` | The maximum radius this obstacle can occupy when solid. |
| `currentradius` | number | `nil` | The current capsule radius used for physics, dynamically adjusted. |
| `physicsstate` | number (`PHYSICS_STATE`) | `nil` | Current state index: 1 = ITEM, 2 = OBSTACLE, 3 = FALLING. |
| `ischaracterpassthrough` | boolean or nil | `nil` | Indicates whether characters can currently pass through; toggled when shrinking. |
| `issmall` | boolean or nil | `nil` | If true, obstacle uses `SMALLOBSTACLES` collision group instead of `OBSTACLES`. |
| `task` | Task or nil | `nil` | Periodic task reference for radius updates during obstacle state. |
| `onphysicsstatechangedfn` | function or nil | `nil` | Callback fired when `physicsstate` changes. |
| `onchangetoitemfn` | function or nil | `nil` | Callback fired before transitioning to ITEM state. |
| `onchangetoobstaclefn` | function or nil | `nil` | Callback fired before transitioning to OBSTACLE state. |
| `onstartfallingfn` | function or nil | `nil` | Callback fired before transitioning to FALLING state. |
| `onstopfallingfn` | function or nil | `nil` | Callback fired before transitioning from FALLING to OBSTACLE. |
| `onstartpushingfn` | function or nil | `nil` | Callback fired when the object begins being pushed by a character. |
| `onstoppushingfn` | function or nil | `nil` | Callback fired when the object stops being pushed. |
| `deprecated_floating_exploit` | boolean or nil | `nil` | Legacy flag used to prevent auto-dropping when floating; internal use. |

## Main functions
### `SetRadius(radius)`
* **Description:** Initializes the obstacle’s maximum physical radius and registers listeners for inventory events to control state transitions. Must be called once during setup.
* **Parameters:** `radius` (number) – the maximum radius the obstacle can occupy when acting as a solid obstacle.
* **Returns:** Nothing.

### `MakeSmallObstacle()`
* **Description:** Marks the obstacle as “small”, causing it to use the `SMALLOBSTACLES` collision group instead of `OBSTACLES` when solid.
* **Parameters:** None.
* **Returns:** Nothing.

### `AddFallingStates()`
* **Description:** Registers listeners for `"startfalling"` and `"stopfalling"` events to enable gravity-based falling and recovery.
* **Parameters:** None.
* **Returns:** Nothing.

### `AddPushingStates()`
* **Description:** Registers listeners for `"startpushing"` and `"stoppushing"` events to manage behavior when characters push the object.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetPhysicsState()`
* **Description:** Returns a string name of the current physics state.
* **Parameters:** None.
* **Returns:** string – one of `"ITEM"`, `"OBSTACLE"`, or `"FALLING"`.

### `IsItem()`
* **Description:** Returns whether the obstacle is currently in the ITEM state.
* **Parameters:** None.
* **Returns:** boolean – `true` if `physicsstate == ITEM`.

### `IsObstacle()`
* **Description:** Returns whether the obstacle is currently in the OBSTACLE state.
* **Parameters:** None.
* **Returns:** boolean – `true` if `physicsstate == OBSTACLE`.

### `IsFalling()`
* **Description:** Returns whether the obstacle is currently falling (ITEM state with no gravity constraints).
* **Parameters:** None.
* **Returns:** boolean – `true` if `physicsstate == FALLING`.

### `ForceDropPhysics()`
* **Description:** Immediately drops the object from a spawned state (e.g., after loot drop) by forcing transitions through ITEM and OBSTACLE states without delay. Useful for prefabs spawned programmatically.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetOnPhysicsStateChangedFn(fn)`
* **Description:** Sets the callback invoked when the obstacle’s physics state changes.
* **Parameters:** `fn` (function) – signature: `function(inst, stateName)` where `stateName` is `"ITEM"`, `"OBSTACLE"`, or `"FALLING"`.
* **Returns:** Nothing.

### `SetOnChangeToItemFn(fn)`
* **Description:** Sets the callback invoked before transitioning to ITEM state.
* **Parameters:** `fn` (function) – signature: `function(inst)`.
* **Returns:** Nothing.

### `SetOnChangeToObstacleFn(fn)`
* **Description:** Sets the callback invoked before transitioning to OBSTACLE state.
* **Parameters:** `fn` (function) – signature: `function(inst)`.
* **Returns:** Nothing.

### `SetOnStartFallingFn(fn)`
* **Description:** Sets the callback invoked before the obstacle begins falling.
* **Parameters:** `fn` (function) – signature: `function(inst)`.
* **Returns:** Nothing.

### `SetOnStopFallingFn(fn)`
* **Description:** Sets the callback invoked before falling ends and the obstacle becomes solid again.
* **Parameters:** `fn` (function) – signature: `function(inst)`.
* **Returns:** Nothing.

### `Setonstartpushingfn(fn)`
* **Description:** Sets the callback invoked when a character starts pushing the object (switches to ITEM state).
* **Parameters:** `fn` (function) – signature: `function(inst)`.
* **Returns:** Nothing.

### `Setonstoppushingfn(fn)`
* **Description:** Sets the callback invoked when pushing ends (resumes obstacle behavior unless held).
* **Parameters:** `fn` (function) – signature: `function(inst)`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onputininventory` – triggers transition to ITEM state.
- **Listens to:** `ondropped` – triggers transition to OBSTACLE state.
- **Listens to:** `startfalling` – triggers falling logic (ITEM state with cleared collision masks).
- **Listens to:** `stopfalling` – transitions back to OBSTACLE state.
- **Listens to:** `startpushing` – forces transition to ITEM state (loose/weightless).
- **Listens to:** `stoppushing` – reverts to OBSTACLE state unless currently held.
- **Pushes:** None directly (callbacks may fire side effects).
- **Removes event callbacks on removal:** All events listed above are unregistered in `OnRemoveFromEntity()`.
