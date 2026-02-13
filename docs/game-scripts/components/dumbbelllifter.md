---
id: dumbbelllifter
title: Dumbbelllifter
description: This component manages an entity's ability to lift and interact with a mighty dumbbell, tracking the lifting state and applying workout effects.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Dumbbelllifter

## Overview
The `Dumbbelllifter` component is responsible for enabling an entity to engage in the act of lifting a specific "mighty dumbbell" item. It tracks whether the entity is currently lifting a dumbbell, provides methods to initiate and conclude the lifting action, and mediates the interaction with the dumbbell's own `mightydumbbell` component to apply workout effects. This component adds and removes a tag to the entity to signify its current lifting status.

## Dependencies & Tags
This component expects the `dumbbell` entity (passed into its methods) to possess a `mightydumbbell` component to properly function.

*   **Adds Tag:** `liftingdumbbell` (when `StartLifting` is called)
*   **Removes Tag:** `liftingdumbbell` (when `StopLifting` is called or `Lift` fails)

## Properties
| Property   | Type      | Default Value | Description                                                    |
| :--------- | :-------- | :------------ | :------------------------------------------------------------- |
| `dumbbell` | `Entity?` | `nil`         | A reference to the currently lifted `mightydumbbell` entity. Is `nil` if the entity is not currently lifting any dumbbell. |

## Main Functions
### `CanLift(dumbbell)`
*   **Description:** Checks if the entity is able to lift the provided dumbbell. In its current implementation, it always returns `true`.
*   **Parameters:**
    *   `dumbbell` (`Entity`): The dumbbell entity to check.

### `IsLiftingAny()`
*   **Description:** Returns `true` if the entity is currently lifting any dumbbell (i.e., `self.dumbbell` is not `nil`).
*   **Parameters:** None.

### `IsLifting(dumbbell)`
*   **Description:** Returns `true` if the entity is currently lifting the *specific* provided dumbbell.
*   **Parameters:**
    *   `dumbbell` (`Entity`): The dumbbell entity to compare against the currently lifted one.

### `StartLifting(dumbbell)`
*   **Description:** Initiates the lifting process for the specified dumbbell. It sets `self.dumbbell`, tells the dumbbell's `mightydumbbell` component to start the workout, and adds the "liftingdumbbell" tag to the owning entity.
*   **Parameters:**
    *   `dumbbell` (`Entity`): The dumbbell entity to start lifting. This entity is expected to have a `mightydumbbell` component.

### `StopLifting()`
*   **Description:** Terminates the lifting process. If a dumbbell is currently being lifted, it tells its `mightydumbbell` component to stop the workout and then clears the `self.dumbbell` reference. It also removes the "liftingdumbbell" tag from the owning entity.
*   **Parameters:** None.

### `Lift()`
*   **Description:** Attempts to perform a single "lift" action with the currently held dumbbell. It calls the `DoWorkout` method on the dumbbell's `mightydumbbell` component. If the workout is successful, it returns `true`. If the workout fails (e.g., due to insufficient strength or fatigue), it clears `self.dumbbell` and returns `false`.
*   **Parameters:** None.