---
id: steeringwheel
title: Steeringwheel
description: Manages player interaction with a steering wheel entity, tracking occupancy and notifying listeners on start/stop events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: dc5b81d3
---

# Steeringwheel

## Overview
This component enables an entity (typically a steering wheel) to track when a player ("sailor") is actively steering it. It manages occupancy state by applying/removing the "occupied" tag, listens for sailor removal events, and invokes optional callback functions when steering begins or ends.

## Dependencies & Tags
- Adds the `"steeringwheel"` tag to the entity in the constructor.
- Adds the `"occupied"` tag when a sailor begins steering.
- Relies on the presence of `"steeringwheeluser"` component on the sailor entity for proper cleanup during removal (though it does not explicitly add it).
- Registers a listener for the `"onremove"` event on the sailor entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | Reference to the entity the component is attached to. |
| `sailor` | `Entity?` | `nil` | Reference to the current sailor (player) steering the wheel. |
| `onstartfn` | `function?` | `nil` | Optional callback invoked when steering starts. |
| `onstopfn` | `function?` | `nil` | Optional callback invoked when steering stops. |
| `onsailorremoved` | `function` | *(defined inline)* | Internal handler that stops steering if the sailor is removed. |

## Main Functions
### `SetOnStartSteeringFn(fn)`
* **Description:** Sets the optional callback function that will be executed when a sailor starts steering the wheel.
* **Parameters:** `fn` — A function accepting two arguments: `(inst, sailor)`, where `inst` is the steering wheel entity and `sailor` is the player entity.

### `SetOnStopSteeringFn(fn)`
* **Description:** Sets the optional callback function that will be executed when a sailor stops steering the wheel.
* **Parameters:** `fn` — A function accepting two arguments: `(inst, sailor)`.

### `StartSteering(sailor)`
* **Description:** Marks the steering wheel as occupied by the given sailor, registers cleanup listeners, and invokes the `onstartfn` callback if defined.
* **Parameters:** `sailor` — The player entity (sailor) beginning to steer the wheel.

### `StopSteering()`
* **Description:** Releases occupancy of the steering wheel, removes the `"occupied"` tag, unregisters the sailor removal listener, invokes the `onstopfn` callback (if defined), and clears the `sailor` reference.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Handles cleanup when the component is removed from the entity, particularly ensuring the sailor's steering reference is properly cleared.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string identifying the current sailor (or `nil`), used for inspector tools.
* **Parameters:** None.

## Events & Listeners
- **Listens for `"onremove"` on the sailor entity** — Triggers `onsailorremoved`, which in turn calls `StopSteering()` if the sailor being removed is the current one.
- **Pushes no events** — The component does not emit any events itself.