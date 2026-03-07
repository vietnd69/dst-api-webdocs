---
id: steeringwheel
title: Steeringwheel
description: Manages the logic for a boat's steering wheel, including player interaction, burning effects, and looting upon destruction.
tags: [boat, structure, environment, interact]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 47b2d485
system_scope: environment
---

# Steeringwheel

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`steeringwheel` is a prefab component that enables a structure (the steering wheel) to be used for controlling a boat. It integrates with the `steeringwheeluser` component to coordinate sailor positioning, animation overrides, and steering state management. It also handles destruction (via hammering), burning behavior, and looting. This component is automatically added to steering wheel entities during instantiation and interacts with `burnable`, `lootdropper`, and `workable` components.

## Usage example
```lua
local wheel = SpawnPrefab("steeringwheel")
wheel.Transform:SetPosition(x, y, z)
wheel.components.steeringwheel:SetOnStartSteeringFn(my_on_start_fn)
wheel.components.steeringwheel:SetOnStopSteeringFn(my_on_stop_fn)
```

## Dependencies & tags
**Components used:** `steeringwheel`, `burnable`, `lootdropper`, `workable`, `inspectable`
**Tags:** Adds `structure`. Checks `burnt` during looting and save/load.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sailor` | `Entity` or `nil` | `nil` | The entity currently steering the boat via this wheel. Set/managed by `SetOnStartSteeringFn` and `SetOnStopSteeringFn` callbacks. |

## Main functions
### `SetOnStartSteeringFn(fn)`
*   **Description:** Registers a callback function executed when a sailor begins steering from this wheel. Typically used to update animation states and override symbols.
*   **Parameters:** `fn` (function) - callback with signature `(inst, sailor)`.
*   **Returns:** Nothing.

### `SetOnStopSteeringFn(fn)`
*   **Description:** Registers a callback function executed when a sailor stops steering from this wheel. Used to reset animation overrides and restore visuals.
*   **Parameters:** `fn` (function) - callback with signature `(inst, sailor)`.
*   **Returns:** Nothing.

### `StartSteering(sailor)`
*   **Description:** Initiates steering state for a sailor. Not directly called in `steeringwheel.lua`; invoked by `SteeringWheelUser` when assigning this wheel.
*   **Parameters:** `sailor` (`Entity`) - the player entity steering the boat.
*   **Returns:** Nothing.

### `StopSteering()`
*   **Description:** Terminates steering state, typically triggered by breaking the wheel or removing the sailor from control.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if no sailor is currently steering.

## Events & listeners
- **Listens to:** `onbuilt` - triggers placement sound and animation.
- **Pushes:** No events are directly pushed by this component's functions. Events flow through associated components (`lootdropper`, `burnable`) and callbacks.