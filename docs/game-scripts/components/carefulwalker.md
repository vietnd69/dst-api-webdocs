---
id: carefulwalker
title: Carefulwalker
description: Manages an entity's movement speed reduction when traversing uneven or hazardous ground.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Carefulwalker

## Overview
The `carefulwalker` component causes an entity to slow down its movement speed when it is near designated "uneven ground" targets. It dynamically tracks these targets for a set duration, applying a speed penalty via the `locomotor` component if the entity gets too close. This is typically used to make characters move more cautiously near hazards like spider webs or during earthquakes.

## Dependencies & Tags
**Dependencies:**
- `locomotor`: This component is required to apply the movement speed multiplier.

**Tags:**
- None identified.

## Properties

| Property                 | Type    | Default Value             | Description                                                              |
| ------------------------ | ------- | ------------------------- | ------------------------------------------------------------------------ |
| `careful`                | boolean | `false`                   | True if the entity is currently slowed down and walking carefully.       |
| `carefulwalkingspeedmult`  | number  | `TUNING.CAREFUL_SPEED_MOD`  | The speed multiplier (0.0 to 1.0) applied when walking carefully.        |
| `targets`                | table   | `{}`                      | A table of entities considered "uneven ground" that are being tracked.   |

## Main Functions
### `SetCarefulWalkingSpeedMultiplier(mult)`
* **Description:** Sets the movement speed multiplier that will be applied when the entity is walking carefully. The value is clamped between 0 and 1. The change is applied immediately if the entity is already walking carefully.
* **Parameters:**
    * `mult` (number): The new speed multiplier, where 1.0 is full speed.

### `TrackTarget(target, radius, duration)`
* **Description:** Adds a target entity to the tracking list. The component will monitor this target for the specified duration and trigger careful walking if the component's owner gets within the specified radius. If the target is already being tracked, its duration is refreshed.
* **Parameters:**
    * `target` (Entity): The entity to track as uneven ground.
    * `radius` (number): The distance from the target within which careful walking should be activated.
    * `duration` (number): The time in seconds to track this target.

### `IsCarefulWalking()`
* **Description:** Returns whether the entity is currently in a "careful walking" state (i.e., slowed down).
* **Returns:** (boolean) `true` if the entity is walking carefully, otherwise `false`.

### `OnUpdate(dt)`
* **Description:** This is the component's main update loop, which runs every frame as long as there are targets to track. It iterates through tracked targets, removes expired ones, and checks the distance to valid targets. If the entity is within range of any target, it enables the careful walking state; otherwise, it disables it.
* **Parameters:**
    * `dt` (number): The time delta since the last update.

## Events & Listeners
*   **Listens for `unevengrounddetected`:** When this event is caught on the entity, the `TrackTarget` function is called with the event data, initiating the tracking of a new uneven ground source.
*   **Pushes `carefulwalking`:** This event is pushed whenever the entity's careful walking state changes. It includes a boolean payload `{ careful = true/false }` to indicate the new state.