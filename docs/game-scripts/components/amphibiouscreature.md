---
id: amphibiouscreature
title: Amphibiouscreature
description: Switches an entity's visuals, tags, and callbacks as it moves between land and water, tracking its current water state.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: ca5e1300
---

# amphibiouscreature

## Overview
The `amphibiouscreature` component is responsible for managing an entity's interaction with water and land environments. It continuously checks the entity's world position to determine if it is currently in water or on land. Based on this, it updates the entity's visual state by changing its animation bank, adds or removes the `"swimming"` tag, and triggers custom callback functions for entry and exit from water. This component is crucial for creatures that can seamlessly move between aquatic and terrestrial environments, providing visual and functional distinctions.

## Dependencies & Tags
This component relies on the following core DST entity components and global systems:
*   `inst.AnimState`: Used for setting animation banks (`SetBank`).
*   `inst.Transform`: Used to get the entity's world position (`GetWorldPosition`).
*   `TheWorld.Map`: Used to query terrain properties like passability and visual ground at a point (`IsPassableAtPoint`, `IsVisualGroundAtPoint`).
*   `inst.sg` (StateGraph): Checks for specific state tags (e.g., `"jumping"`) to temporarily halt water transition logic.
*   `IsEntityDead()`: A global helper function to check if the entity is dead before starting updates.

The component manages the following tags on its `inst`:
*   Adds: `"swimming"` (when `inst` enters water)
*   Removes: `"swimming"` (when `inst` exits water)

## Properties
| Property             | Type     | Default Value | Description                                                                                             |
| :------------------- | :------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `inst`               | `Entity` | `nil`         | A reference to the entity this component is attached to.                                                |
| `tile`               | `nil`    | `nil`         | Currently unused in the provided script. Likely a placeholder for future tile-specific logic.           |
| `tileinfo`           | `nil`    | `nil`         | Currently unused in the provided script. Likely a placeholder for future tile-specific information.     |
| `ontilechangefn`     | `nil`    | `nil`         | Currently unused in the provided script. Likely a placeholder for a callback on tile change.            |
| `in_water`           | `boolean`| `false`       | Tracks the current state of the entity: `true` if in water, `false` if on land.                         |
| `onwaterchangefn`    | `nil`    | `nil`         | Currently unused in the provided script. Likely a placeholder for a generic callback on water state change. |
| `land_bank`          | `string` | `nil`         | The animation bank name to be used when the entity is on land. Set via `SetBanks`.                      |
| `ocean_bank`         | `string` | `nil`         | The animation bank name to be used when the entity is in water. Set via `SetBanks`.                     |
| `transitiondistance` | `number` | `2.5`         | The distance used for transition logic. Currently set but not directly utilized in the `OnUpdate` or `ShouldTransition` methods. |
| `enterwaterfn`       | `function`| `nil`        | A callback function to be executed when the entity enters water. Takes the entity `inst` as an argument. |
| `exitwaterfn`        | `function`| `nil`        | A callback function to be executed when the entity exits water. Takes the entity `inst` as an argument. |

## Main Functions
### `AmphibiousCreature:OnRemoveFromEntity()`
*   **Description:** This method is called automatically when the component is removed from its parent entity. It cleans up the event listener for "death" to prevent memory leaks and ensure proper component lifecycle management.
*   **Parameters:** None.

### `AmphibiousCreature:OnEntitySleep()`
*   **Description:** This method is called automatically when the component's parent entity goes to sleep. It stops the component's `OnUpdate` loop, pausing its functionality to save performance when the entity is not active.
*   **Parameters:** None.

### `AmphibiousCreature:OnEntityWake()`
*   **Description:** This method is called automatically when the component's parent entity wakes up. It restarts the component's `OnUpdate` loop, resuming its functionality, but only if the entity is not dead.
*   **Parameters:** None.

### `AmphibiousCreature:SetBanks(land, ocean)`
*   **Description:** Sets the animation bank names to be used for the land and ocean states. These banks are applied via `inst.AnimState:SetBank()` when the entity transitions between water and land.
*   **Parameters:**
    *   `land` (`string`): The animation bank name for the entity when it is on land.
    *   `ocean` (`string`): The animation bank name for the entity when it is in water.

### `AmphibiousCreature:SetTransitionDistance(transitiondistance)`
*   **Description:** Sets the value for the `transitiondistance` property.
*   **Parameters:**
    *   `transitiondistance` (`number`): The new value for the transition distance.

### `AmphibiousCreature:GetTransitionDistance()`
*   **Description:** Returns the current value of the `transitiondistance` property.
*   **Parameters:** None.

### `AmphibiousCreature:OnUpdate(dt)`
*   **Description:** This is the main update loop for the component, called every frame (`dt` is delta time). It checks the entity's current world position. If the entity is not in a "jumping" state (to prevent immediate transitions during a jump animation), it determines if the entity's water state has changed based on the terrain at its position and calls `OnEnterOcean()` or `OnExitOcean()` accordingly.
*   **Parameters:**
    *   `dt` (`number`): The time elapsed since the last frame.

### `AmphibiousCreature:ShouldTransition(x, z)`
*   **Description:** Determines if a transition between water and land *should* occur at a given `(x, z)` coordinate. If the creature is currently in water, it returns `true` if the point is visual ground. If the creature is currently on land, it returns `true` if the point is *not* visual ground.
*   **Parameters:**
    *   `x` (`number`): The X-coordinate to check.
    *   `z` (`number`): The Z-coordinate to check.

### `AmphibiousCreature:OnEnterOcean()`
*   **Description:** Handles the logic for the entity entering water. If the entity is not already marked as `in_water`, it sets the animation bank to `ocean_bank` (if available), sets `in_water` to `true`, adds the `"swimming"` tag to the entity, and calls the `enterwaterfn` callback (if set).
*   **Parameters:** None.

### `AmphibiousCreature:OnExitOcean()`
*   **Description:** Handles the logic for the entity exiting water. If the entity is currently marked as `in_water`, it sets the animation bank to `land_bank` (if available), sets `in_water` to `false`, removes the `"swimming"` tag from the entity, and calls the `exitwaterfn` callback (if set).
*   **Parameters:** None.

### `AmphibiousCreature:SetEnterWaterFn(fn)`
*   **Description:** Sets the callback function that will be executed when the entity enters water.
*   **Parameters:**
    *   `fn` (`function`): The function to call. It should accept the entity `inst` as its only argument.

### `AmphibiousCreature:SetExitWaterFn(fn)`
*   **Description:** Sets the callback function that will be executed when the entity exits water.
*   **Parameters:**
    *   `fn` (`function`): The function to call. It should accept the entity `inst` as its only argument.

### `AmphibiousCreature:GetDebugString()`
*   **Description:** Returns a string indicating the current `in_water` state of the component, primarily for debugging purposes.
*   **Parameters:** None.

## Events & Listeners
*   Listens For:
    *   `"death"`: When the entity dies, the `OnDeath` function is called, which stops the `amphibiouscreature` component from updating.