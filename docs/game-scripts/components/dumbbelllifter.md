---
id: dumbbelllifter
title: Dumbbelllifter
description: Manages the ability for an entity to lift and use a dumbbell for workout-related gameplay effects.
tags: [workout, combat, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1baa2143
system_scope: entity
---

# Dumbbelllifter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DumbbellLifter` is a component that enables an entity to interact with a `MightyDumbbell` instance—lifting it, initiating workouts, and performing repeated exercises. It acts as a controller that tracks the currently lifted dumbbell and synchronizes workout state changes (e.g., starting, stopping, doing work) with the dumbbell’s `mightydumbbell` component. It also manages the `"liftingdumbbell"` tag on the lifter entity to indicate active usage.

This component is typically added to player characters and works in conjunction with `MightyDumbbell` to deliver strength-building mechanics.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("dumbbelllifter")

-- Assume 'dumbbell' is a valid entity with a 'mightydumbbell' component
local dumbbell = GetDumbbellSomehow()
inst.components.dumbbelllifter:StartLifting(dumbbell)
inst.components.dumbbelllifter:Lift()  -- performs a single rep
inst.components.dumbbelllifter:StopLifting()
```

## Dependencies & tags
**Components used:** `mightydumbbell`
**Tags:** Adds `"liftingdumbbell"` when lifting starts; removes it on stop.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `dumbbell` | `Entity` or `nil` | `nil` | Reference to the currently lifted dumbbell entity. |

## Main functions
### `CanLift(dumbbell)`
* **Description:** Determines whether the entity is allowed to lift the given dumbbell. Currently always permits lifting.
* **Parameters:** `dumbbell` (Entity) – the dumbbell entity to check.
* **Returns:** `true` – lifting is always allowed.

### `IsLiftingAny()`
* **Description:** Checks if the entity is currently lifting *any* dumbbell.
* **Parameters:** None.
* **Returns:** `true` if a dumbbell is being lifted; `false` otherwise.

### `IsLifting(dumbbell)`
* **Description:** Checks if the entity is currently lifting the *specific* dumbbell provided.
* **Parameters:** `dumbbell` (Entity) – the dumbbell entity to compare against.
* **Returns:** `true` if the given dumbbell is the one currently being lifted; `false` otherwise.

### `StartLifting(dumbbell)`
* **Description:** Begins lifting a dumbbell: stores a reference, notifies the dumbbell component, and applies the `"liftingdumbbell"` tag.
* **Parameters:** `dumbbell` (Entity) – the dumbbell to start lifting.
* **Returns:** Nothing.
* **Error states:** Does not validate dumbbell; assumes caller ensures validity.

### `StopLifting()`
* **Description:** Ends lifting: notifies the dumbbell to stop, clears the reference, and removes the `"liftingdumbbell"` tag.
* **Parameters:** None.
* **Returns:** Nothing.

### `Lift()`
* **Description:** Performs a single repetition: calls `DoWorkout` on the currently lifted dumbbell. Updates internal state if the workout completes or the dumbbell is depleted.
* **Parameters:** None.
* **Returns:** `true` if the workout succeeded and the dumbbell remains usable; `false` if the workout failed or the dumbbell ran out of uses and was cleared.
* **Error states:** Returns `false` and clears `self.dumbbell` if the dumbbell becomes invalid or runs out of uses during the workout.

## Events & listeners
- **Pushes:** None.
- **Listens to:** None.
