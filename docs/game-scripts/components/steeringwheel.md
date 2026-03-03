---
id: steeringwheel
title: Steeringwheel
description: Manages the logic and state for a steering wheel entity that allows sailors to control boat movement.
tags: [locomotion, vehicle, interaction]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: dc5b81d3
system_scope: locomotion
---
# Steeringwheel

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SteeringWheel` is a component that enables an entity (typically a physical steering wheel object) to mediate sailor interaction for boat control. It tracks whether a sailor is currently using the wheel (`self.sailor`), handles start/stop callbacks, and coordinates cleanup when the wheel is removed from the world or a sailor leaves. It works in tandem with the `steeringwheeluser` component attached to sailors.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("steeringwheel")
inst.components.steeringwheel:SetOnStartSteeringFn(function(wheel, sailor)
    -- Custom logic on sailor starting to steer
end)
inst.components.steeringwheel:SetOnStopSteeringFn(function(wheel, sailor)
    -- Custom logic on sailor stopping steering
end)
```

## Dependencies & tags
**Components used:** `steeringwheeluser` (accessed via `sailor.components.steeringwheeluser`)
**Tags:** Adds `steeringwheel` on initialization; adds/.removes `occupied` when a sailor starts/stops using the wheel.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (injected) | The entity instance this component is attached to. |
| `onstartfn` | function or `nil` | `nil` | Optional callback fired when `StartSteering` is called. |
| `onstopfn` | function or `nil` | `nil` | Optional callback fired when `StopSteering` is called. |
| `sailor` | `Entity` or `nil` | `nil` | The sailor entity currently using the wheel. |

## Main functions
### `SetOnStartSteeringFn(fn)`
*   **Description:** Sets the callback function to execute when a sailor begins using the steering wheel.
*   **Parameters:** `fn` (function or `nil`) — function accepting `(wheel, sailor)` arguments.
*   **Returns:** Nothing.

### `SetOnStopSteeringFn(fn)`
*   **Description:** Sets the callback function to execute when a sailor stops using the steering wheel.
*   **Parameters:** `fn` (function or `nil`) — function accepting `(wheel, sailor)` arguments.
*   **Returns:** Nothing.

### `StartSteering(sailor)`
*   **Description:** Registers a sailor as the current user of this steering wheel. Adds the `occupied` tag and sets up an event listener for the sailor's removal.
*   **Parameters:** `sailor` (`Entity`) — the sailor entity initiating steering.
*   **Returns:** Nothing.
*   **Error states:** If `sailor` is already assigned, it will be overwritten without warning.

### `StopSteering()`
*   **Description:** Ends the current sailor's use of this wheel. Removes the `occupied` tag and clears the sailor reference.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Ensures proper cleanup when the steering wheel is removed from its entity. If a sailor is actively using the wheel, it notifies the sailor's `steeringwheeluser` component to disengage.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string summarizing the current sailor assignment.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"Sailor: Entity #123"` or `"Sailor: nil"`.

## Events & listeners
- **Listens to:** `onremove` — fired on the `sailor` entity; triggers `StopSteering()` if the sailor is removed while assigned.
- **Pushes:** None — this component does not fire events directly.

