---
id: crewmember
title: Crewmember
description: Manages an entity's role as a crewmember on a boat, enabling it to contribute to the boat's movement and participate in crew-related actions.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Crewmember

## Overview
This component enables an entity to function as an active crew member on a boat. It handles assigning the entity to a boat, managing its contribution to the boat's movement (rowing), and facilitating its participation in specific boat crew behaviors such as pursuing targets or retreating. It also ensures the entity is properly tagged as a "crewmember".

## Dependencies & Tags
This component explicitly adds and removes the `"crewmember"` tag from the entity it is attached to.

It relies on the following components being present on the associated `boat` entity:
*   `boatcrew` or `boatracecrew` (for managing crew members, targets, and headings)
*   `boatphysics` (for applying rowing forces)

It also implicitly relies on the entity it is attached to having:
*   `Transform` (to get world position)
*   The ability to call `GetCurrentPlatform()` (indicating platform interaction capabilities)

## Properties
| Property          | Type     | Default Value              | Description                                                               |
| :---------------- | :------- | :------------------------- | :------------------------------------------------------------------------ |
| `inst`            | Entity   | `inst`                     | The entity this component is attached to.                                 |
| `enabled`         | Boolean  | `true`                     | Determines if the crewmember's functionality is active. Setting this value will add/remove the "crewmember" tag. |
| `max_velocity`    | Number   | `4`                        | The maximum velocity contribution this crewmember can apply while rowing. |
| `max_target_dsq`  | Number   | `TUNING.CREWMEMBER_TARGET_DSQ` | The squared distance threshold to a target, used for determining if the boat is close enough to its objective. |
| `force`           | Number   | `1`                        | The base force applied by this crewmember when rowing.                    |
| `_on_boat_removed`| Function | `function() self.boat = nil end` | Internal callback function to clear `self.boat` when the assigned boat is removed. |
| `boat`            | Entity   | `nil`                      | The boat entity this crewmember is currently assigned to.                 |
| `leavecrewfn`     | Function | `nil`                      | An optional callback function to execute when the crewmember leaves the crew. |

## Main Functions
### `CrewMember:OnRemoveFromEntity()`
*   **Description:** Called when the component is removed from its entity. It ensures the "crewmember" tag is removed from the entity.
*   **Parameters:** None

### `CrewMember:Shouldrow()`
*   **Description:** Determines if the crewmember is currently in a valid state to contribute to rowing the boat. It checks if the crewmember is on the assigned boat, if the boat has crew components, and if there's an active target or heading, considering assault targets.
*   **Parameters:** None
*   **Returns:** `true` if the crewmember should row, `nil` otherwise.

### `CrewMember:SetBoat(boat)`
*   **Description:** Assigns or unassigns the crewmember to a specified boat. If assigning, it also sets up a listener for the boat's "onremove" event.
*   **Parameters:**
    *   `boat`: (`Entity`) The boat entity to assign the crewmember to, or `nil` to unassign.

### `CrewMember:GetBoat()`
*   **Description:** Returns the boat entity the crewmember is currently assigned to.
*   **Parameters:** None
*   **Returns:** (`Entity`) The assigned boat, or `nil` if not assigned to any boat.

### `CrewMember:Leave()`
*   **Description:** Instructs the assigned boat's `boatcrew` component to remove this entity as a member.
*   **Parameters:** None

### `CrewMember:OnLeftCrew()`
*   **Description:** Executes the `leavecrewfn` callback if one has been set, passing the crewmember's entity as an argument.
*   **Parameters:** None

### `CrewMember:Enable(enabled)`
*   **Description:** Enables or disables the crewmember's functionality. If disabled while currently on a boat, it will remove the entity from the boat's crew.
*   **Parameters:**
    *   `enabled`: (`Boolean`) `true` to enable, `false` to disable.

### `CrewMember:Row()`
*   **Description:** Applies a rowing force to the assigned boat based on its current state (target, heading, status like "assault", "retreat", "delivery"). It calculates the direction and magnitude of the force.
*   **Parameters:** None

### `CrewMember:GetDebugString()`
*   **Description:** Returns a string useful for debugging, indicating the assigned boat and whether the component is disabled.
*   **Parameters:** None
*   **Returns:** (`string`) A formatted debug string.

## Events & Listeners
This component listens to the following event:
*   `"onremove"`: Listens on the assigned `boat` entity to clear `self.boat` when the boat is removed from the world.

This component pushes/triggers the following event:
*   `"rowed"`: Pushed on the `boat` entity when the `Row()` function is called, passing the `self.inst` (the crewmember entity) as an argument.