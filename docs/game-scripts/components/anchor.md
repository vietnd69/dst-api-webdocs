---
id: anchor
title: Anchor
description: Controls the state, physics interaction, and player-driven raising or lowering of a boat anchor.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 7bb501ef
---

# anchor

## Overview
The `anchor` component is responsible for managing the state and behavior of an anchor entity in Don't Starve Together. It tracks whether the anchor is raised, lowered, or in a transition state (raising/lowering). It handles player interaction for raising the anchor, integrates with boat physics to apply drag, and manages visual feedback through entity tags and animation speed.

## Dependencies & Tags
This component relies on other components on its associated boat entity and potentially on player entities interacting with it.

*   **Component Dependencies:**
    *   `boat.components.boatphysics`: Required on the associated boat to add/remove drag based on anchor state.
    *   `doer.components.expertsailor`: Optional on a player (`doer`) interacting with the anchor to modify raising speed.
*   **Tags Added/Removed:**
    *   `anchor_raised`: Added when the anchor is fully raised.
    *   `anchor_lowered`: Added when the anchor is fully lowered.
    *   `anchor_transitioning`: Added when the anchor is in the process of raising or lowering.

## Properties
| Property            | Type      | Default Value | Description                                                                                             |
| :------------------ | :-------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `self.inst`         | `Entity`  | `inst`        | A reference to the entity this component is attached to.                                                |
| `self.is_anchor_lowered` | `boolean` | `false`       | True if the anchor is fully lowered, false otherwise. This property has an `on_is_anchor_lowered` setter callback. |
| `self.raisers`      | `table`   | `{}`          | A table mapping `doer` entities (players) to their individual anchor raising speed multipliers.         |
| `self.numberofraisers` | `number`  | `0`           | The current number of entities actively raising the anchor.                                             |
| `self.raiseunits`   | `number`  | `0`           | Represents the anchor's current "raisedness". `0` means fully raised, higher values mean more lowered (up to `GetCurrentDepth()`). This is saved/loaded. |
| `self.currentraiseunits` | `number`  | `0`           | The combined raising speed (units per second) from all current `raisers`.                               |
| `self.autolowerunits` | `number`  | `3`           | The speed (units per second) at which the anchor automatically lowers itself when no players are raising it. |
| `self.is_boat_moving` | `boolean` | `false`       | True if the associated boat is currently moving. This property has an `on_is_boat_moving` setter callback. |
| `self.boat`         | `Entity`  | `nil`         | A reference to the boat entity this anchor is associated with.                                          |
| `self.is_anchor_transitioning` | `boolean` | `nil`         | True if the anchor is currently in the process of raising or lowering. This property has an `on_is_anchor_transitioning` setter callback. |
| `self.max_velocity_mod` | `number` | `nil`         | A multiplier for the boat's maximum velocity when the anchor is interacting with it. Set by `SetVelocityMod`. |
| `self.rasing`       | `boolean` | `nil`         | True if there are any `raisers` currently trying to raise the anchor.                                   |

## Main Functions

### `Anchor:SetBoat(boat)`
*   **Description:** Associates this anchor component with a specific boat entity. It detaches from any previously associated boat and attaches to the new one, setting up event listeners for boat movement. This function is typically called internally during initialization or loading.
*   **Parameters:**
    *   `boat`: (`Entity`) The boat entity to associate with this anchor. Can be `nil` to de-associate.

### `Anchor:OnSave()`
*   **Description:** Returns the data that needs to be saved for this component.
*   **Parameters:** None.

### `Anchor:GetCurrentDepth()`
*   **Description:** Calculates the maximum depth the anchor can reach at its current world position, based on the `ocean_depth` of the tile.
*   **Parameters:** None.

### `Anchor:OnLoad(data)`
*   **Description:** Loads saved data into the component's properties.
*   **Parameters:**
    *   `data`: (`table`) A table containing the saved data, expected to have `raiseunits`.

### `Anchor:LoadPostPass()`
*   **Description:** Performs initialization steps after the entity and its components have been loaded. This includes re-associating with its platform (boat) and setting the initial state of the anchor (raised, lowered, or lowering) based on its saved `raiseunits` and the current `GetCurrentDepth()`.
*   **Parameters:** None.

### `Anchor:SetIsAnchorLowered(is_lowered)`
*   **Description:** Sets the `is_anchor_lowered` state and updates the associated boat's `boatphysics` component to add or remove drag.
*   **Parameters:**
    *   `is_lowered`: (`boolean`) `true` to lower the anchor and apply drag, `false` to raise it and remove drag.

### `Anchor:StartRaisingAnchor()`
*   **Description:** Initiates the anchor raising process if it's not burnt or already raised. It pushes the `"raising_anchor"` event.
*   **Parameters:** None.

### `Anchor:StartLoweringAnchor()`
*   **Description:** Initiates the anchor lowering process if it's not burnt or already lowered. It sets `is_anchor_transitioning` to true, adds the `"anchor_transitioning"` tag, and pushes the `"lowering_anchor"` event.
*   **Parameters:** None.

### `Anchor:AddAnchorRaiser(doer)`
*   **Description:** Adds a `doer` (typically a player) to the list of entities actively raising the anchor. It calculates the `doer`'s individual raising speed based on `expertsailor` component and `master_crewman` tag, and updates the total `currentraiseunits`.
*   **Parameters:**
    *   `doer`: (`Entity`) The entity attempting to raise the anchor.

### `Anchor:RemoveAnchorRaiser(doer)`
*   **Description:** Removes a `doer` from the list of entities actively raising the anchor. It reduces `currentraiseunits` and pushes the `"stopraisinganchor"` event on the `doer`. If no raisers remain, it may trigger the anchor to start lowering.
*   **Parameters:**
    *   `doer`: (`Entity`) The entity to remove from the raisers list.

### `Anchor:AnchorRaised()`
*   **Description:** Finalizes the state when the anchor becomes fully raised. It clears `is_anchor_transitioning`, resets animation speed, removes the `"anchor_transitioning"` tag, removes all current raisers, and pushes the `"anchor_raised"` event.
*   **Parameters:** None.

### `Anchor:AnchorLowered()`
*   **Description:** Finalizes the state when the anchor becomes fully lowered. It clears `is_anchor_transitioning`, resets animation speed, removes the `"anchor_transitioning"` tag, and pushes the `"anchor_lowered"` event.
*   **Parameters:** None.

### `Anchor:OnUpdate(dt)`
*   **Description:** The core update loop for the anchor, called every frame if the component is updating. It handles the continuous raising or lowering of the anchor by adjusting `self.raiseunits` based on `currentraiseunits` (if raising) or `autolowerunits` (if lowering). It also adjusts the animation speed and triggers `AnchorRaised()` or `AnchorLowered()` when the anchor reaches its limits. If the anchor is partially lowered but not transitioning, it will initiate lowering.
*   **Parameters:**
    *   `dt`: (`number`) The delta time since the last update.

### `Anchor:GetDebugString()`
*   **Description:** Provides a debug string with information about the boat, number of raisers, raise units, current raise units, and current depth.
*   **Parameters:** None.

## Events & Listeners

*   **Listens For (from `self.boat`):**
    *   `onremove`: When the associated boat is removed, `self.OnBoatRemoved` is called to clear the boat reference.
    *   `boat_stop_moving`: When the associated boat stops moving, `self.OnBoatStopMoving` is called to update `self.is_boat_moving`.
    *   `boat_start_moving`: When the associated boat starts moving, `self.OnBoatStartMoving` is called to update `self.is_boat_moving`.

*   **Pushes/Triggers (from `self.inst` unless specified):**
    *   `raising_anchor`: Triggered when `StartRaisingAnchor()` or `AddAnchorRaiser()` is called.
    *   `lowering_anchor`: Triggered when `StartLoweringAnchor()` is called or if all raisers are removed while the anchor is transitioning.
    *   `anchor_raised`: Triggered when the anchor becomes fully raised via `AnchorRaised()`.
    *   `anchor_lowered`: Triggered when the anchor becomes fully lowered via `AnchorLowered()`.
    *   `stopraisinganchor` (on `doer` entity): Triggered on a `doer` when `RemoveAnchorRaiser()` is called for that `doer`.