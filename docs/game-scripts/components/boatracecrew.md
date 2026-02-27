---
id: boatracecrew
title: Boatracecrew
description: Manages the crew members, captain, and target of a boat participating in the Cawnival boat race.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: a71a2af3
---

# Boatracecrew

## Overview
This component is attached to a boat entity to manage its crew during the Cawnival boat race event. It is responsible for tracking crew members, assigning a captain, setting a navigation target, and handling the addition or removal of members from the crew. It also provides functionality for persistence, allowing the crew's state to be saved and loaded.

## Dependencies & Tags

**Dependencies:**
- Crew member entities must have the `crewmember` component.

**Tags:**
- None identified.

## Properties

| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | entity | `self.inst` | The entity instance this component is attached to (the boat). |
| `members` | table | `{}` | A table where keys are crew member entities and values are `true`. |
| `captain` | entity | `nil` | The entity designated as the captain of the crew. |
| `target` | entity | `nil` | The entity the boat is currently navigating towards. |
| `status` | string | `nil` | A string representing the crew's current status. Periodically set to "assault". |
| `on_member_added` | function | `nil` | A callback function that triggers when a member is added to the crew. |
| `on_member_removed` | function | `nil` | A callback function that triggers when a member is removed from the crew. |
| `on_crew_empty` | function | `nil` | A callback function that triggers when the last member leaves the crew. |

## Main Functions

### `SetTarget(target)`
* **Description:** Sets or clears the crew's target entity. It automatically manages listeners to nullify the target if it is removed from the game.
* **Parameters:**
    * `target` (entity): The entity to set as the new target. Can be `nil` to clear the current target.

### `SetCaptain(captain)`
* **Description:** Assigns a specific entity as the crew's captain. This manages the `onremove` listener for the captain entity.
* **Parameters:**
    * `captain` (entity): The entity to set as the captain. Can be `nil` to remove the current captain.

### `AddMember(new_member, is_captain)`
* **Description:** Adds a new entity to the crew. It sets up necessary event listeners on the member, informs the member's `crewmember` component about joining the boat, and optionally designates the member as the captain.
* **Parameters:**
    * `new_member` (entity): The entity to add to the crew.
    * `is_captain` (boolean): If `true`, this new member will also be set as the crew's captain.

### `RemoveMember(member)`
* **Description:** Removes an entity from the crew. This function cleans up event listeners, notifies the member's `crewmember` component, and triggers the `on_member_removed` callback. If the crew becomes empty, it also triggers the `on_crew_empty` callback.
* **Parameters:**
    * `member` (entity): The crew member entity to remove.

### `OnUpdate()`
* **Description:** A function called periodically (every 2 seconds) by a task initiated in the constructor. It currently sets the `status` property to "assault".
* **Parameters:** None.

### `GetHeadingNormal()`
* **Description:** Calculates the normalized direction vector from the boat's current position to its target's position.
* **Parameters:** None.
* **Returns:** `(number, number)` - The x and z components of the normalized heading vector, or `nil` if there is no target.

## Events & Listeners
This component listens for events on other entities to manage the state of the crew.

*   **`"onremove"`**: Listens on each crew member, the captain, and the target. When triggered, the respective entity is removed from the crew or cleared from its role.
*   **`"death"`**: Listens on each crew member. A dead member is removed from the crew.
*   **`"teleported"`**: Listens on each crew member. A teleported member is removed from the crew, as they are no longer on the boat.