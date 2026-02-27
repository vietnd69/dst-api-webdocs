---
id: boatcrew
title: Boatcrew
description: Manages a group of entities as a crew on a boat, coordinating their behavior, targets, and members.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: e3b594bc
---

# Boatcrew

## Overview
The `boatcrew` component is attached to a boat entity to manage a collection of other entities as its crew. It is responsible for tracking crew members, designating a captain, and controlling the overall state and behavior of the crew, such as hunting for targets, assaulting, or retreating. This component also handles crew-wide actions like victory celebrations and loot management.

## Dependencies & Tags
None identified.

## Properties

| Property          | Type              | Default Value                       | Description                                                                          |
|-------------------|-------------------|-------------------------------------|--------------------------------------------------------------------------------------|
| `members`         | `table`           | `{}`                                | A table containing all current crew member entities as keys.                         |
| `membercount`     | `number`          | `0`                                 | The current number of crew members.                                                  |
| `membertag`       | `string`          | `nil`                               | An optional tag used to identify members belonging to this specific crew.            |
| `loot_per_member` | `number`          | `TUNING.BOATCREW_LOOT_PER_MEMBER`     | The amount of loot required per member to trigger a victory state.                   |
| `captain`         | `Entity`          | `nil`                               | The designated captain entity of the crew.                                           |
| `tinkertargets`   | `table`           | `{}`                                | A table to track and reserve entities that are targets for tinkering.                |
| `addmember`       | `function`        | `nil`                               | A custom callback function executed when a new member is added to the crew.          |
| `removemember`    | `function`        | `nil`                               | A custom callback function executed when a member is removed from the crew.          |
- `heading`         | `number`          | `nil`                               | The current directional heading of the boat, in degrees.                             |
| `target`          | `Entity`/`Vector3`| `nil`                               | The current target entity or position for the crew's actions.                        |
| `flee`            | `boolean`         | `nil`                               | A flag indicating if the crew should be in a fleeing state.                          |
| `status`          | `string`          | `"hunting"`                         | The current behavioral state of the crew (e.g., "hunting", "assault", "retreat").    |

## Main Functions

### `TestForLootToSteal()`
* **Description:** Checks if any crew member, excluding the captain, is carrying any items that can be considered loot (i.e., they are not flagged with `nothingtosteal`).
* **Parameters:** None.
* **Returns:** `true` if loot is found, `false` otherwise.

### `TestForVictory()`
* **Description:** Determines if the crew has met the conditions for victory. This can be achieved either by collecting more loot than the `loot_per_member` threshold or if any individual crew member has their `victory` flag set to true.
* **Parameters:** None.
* **Returns:** `true` if victory conditions are met, `false` otherwise.

### `CrewCheer()`
* **Description:** Triggers a victory cheer for all crew members who haven't already done so. It schedules a delayed task for each member to push a "cheer" event with a random victory line.
* **Parameters:** None.

### `CountPirateLoot()`
* **Description:** Calculates the total number of loot items held by all crew members. It iterates through each member's inventory, ignoring items tagged as "personal_possession".
* **Parameters:** None.
* **Returns:** The total count of loot items.

### `CountCrew()`
* **Description:** Returns the current number of members in the crew.
* **Parameters:** None.
* **Returns:** The number of crew members.

### `SetMemberTag(tag)`
* **Description:** Sets a specific tag to identify members of this crew. This also configures a search table used to find potential crew members.
* **Parameters:**
    * `tag` (`string`): The tag to assign to this crew.

### `areAllCrewOnBoat()`
* **Description:** Checks if every member of the crew is currently on the same boat platform as the component's owner.
* **Parameters:** None.
* **Returns:** `true` if all members are on the boat, `false` otherwise.

### `GetHeadingNormal()`
* **Description:** Calculates the normalized direction vector for the boat's movement. The direction points towards the `target` if one is set, or follows the `heading` if not. It includes logic to lead a moving boat target.
* **Parameters:** None.
* **Returns:** A normalized `Vector3` representing the direction of travel, or `nil` if no direction can be determined.

### `SetCaptain(captain)`
* **Description:** Designates an entity as the captain of the crew. It also sets up listeners to handle the captain's removal.
* **Parameters:**
    * `captain` (`Entity`): The entity to be set as the captain.

### `AddMember(inst, setcaptain)`
* **Description:** Adds a new entity to the crew. It sets up event listeners for the new member, assigns the boat to the member's `crewmember` component, and optionally sets the new member as the captain.
* **Parameters:**
    * `inst` (`Entity`): The entity to add as a crew member.
    * `setcaptain` (`boolean`): If `true`, this new member will also be set as the captain.

### `RemoveMember(inst)`
* **Description:** Removes an entity from the crew. It cleans up event listeners and updates the member's `crewmember` component. If the crew becomes empty, the `boatcrew` and `vanish_on_sleep` components are removed from the boat entity.
* **Parameters:**
    * `inst` (`Entity`): The entity to remove from the crew.

### `checktinkertarget(target)`
* **Description:** Checks if a given target is currently reserved for tinkering.
* **Parameters:**
    * `target` (`Entity`): The target entity to check.
* **Returns:** `true` if the target is reserved, otherwise `nil`.

### `reserveinkertarget(target)`
* **Description:** Reserves a target, marking it as a destination for tinkering by a crew member.
* **Parameters:**
    * `target` (`Entity`): The target entity to reserve.

### `removeinkertarget(target)`
* **Description:** Removes the reservation on a tinkering target.
* **Parameters:**
    * `target` (`Entity`): The target entity to un-reserve.

### `IsCrewOnDeck()`
* **Description:** Checks if all crew members are currently on the boat platform.
* **Parameters:** None.
* **Returns:** `true` if all members are on deck, `false` otherwise.

### `OnUpdate()`
* **Description:** This function is called periodically to update the crew's overall status. It changes the `status` property to "retreat", "assault", or "hunting" based on the current target, loot status, and whether the crew is fleeing.
* **Parameters:** None.

## Events & Listeners

* **Listens for `onremove` on self:** When the boat entity is removed, it notifies the `piratespawner` world component to remove its data.
* **Listens for `onremove`, `death`, `teleported` on crew members:** When a crew member is removed, dies, or teleports away, it triggers `RemoveMember` to correctly remove them from the crew roster.
* **Listens for `onremove` on captain:** When the captain entity is removed, it triggers logic to remove the `boatcrew` and `vanish_on_sleep` components from the boat, effectively disbanding the crew.
* **Pushes `cheer` event to crew members:** During `CrewCheer`, this event is pushed to individual crew members to make them perform a cheer animation and play a sound.