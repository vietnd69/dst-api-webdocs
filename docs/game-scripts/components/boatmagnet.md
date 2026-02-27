---
id: boatmagnet
title: Boatmagnet
description: Manages the behavior of a 'magnet' entity that allows one boat to automatically follow another boat or a player holding a corresponding 'beacon'.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: db572168
---

# Boatmagnet

## Overview
The `boatmagnet` component is attached to an entity, typically a mast-like structure on a boat, that allows its boat to magnetically follow another entity equipped with a `boatmagnetbeacon` component. It handles the logic for finding, pairing with, and unpairing from a beacon. Once paired, it calculates the necessary force, direction, and velocity for the boat's `boatphysics` component to create a smooth following behavior. It also manages the state changes, such as disengaging if the beacon gets too far away or is destroyed.

## Dependencies & Tags

**Dependencies:**
* The entity's boat must have a `boatphysics` component.
* The target beacon entity must have a `boatmagnetbeacon` component.

**Tags:**
* **`paired`**: Added to the component's entity (`inst`) when it is successfully paired with a beacon. Removed upon unpairing.

## Properties

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `inst` | `Entity` | - | The entity instance this component is attached to. |
| `boat` | `Entity` | `nil` | The boat entity that this magnet is currently on. |
| `beacon` | `Entity` | `nil` | The paired beacon entity that the magnet is following. |
| `magnet_guid` | `string` | `nil` | The GUID of the magnet entity, used for persistence during save/load. |
| `pair_tags` | `table` | `nil` | An optional table of tags used to find a suitable beacon. Defaults to `{"boatmagnetbeacon"}`. |
| `canpairwithfn` | `function` | internal function | A predicate function to determine if a potential beacon is valid and available for pairing. |
| `onpairedwithbeaconfn` | `function` | `nil` | An optional callback function triggered after successfully pairing with a beacon. |
| `onunpairedwithbeaconfn` | `function` | `nil` | An optional callback function triggered after unpairing from a beacon. |
| `beaconturnedonfn` | `function` | `nil` | An optional callback function triggered when the paired beacon is turned on. |
| `beaconturnedofffn` | `function` | `nil` | An optional callback function triggered when the paired beacon is turned off. |

## Main Functions

### `SetBoat(boat)`
* **Description:** Associates the magnet with a specific boat. It handles adding and removing listeners for the boat's destruction (`onremove`, `death`) and registers the magnet with the boat's `boatphysics` component.
* **Parameters:**
    * `boat`: The boat entity to associate with. Pass `nil` to disassociate.

### `IsActivated()`
* **Description:** Checks if the magnet is currently paired with a beacon.
* **Returns:** `boolean` - `true` if paired with a beacon, otherwise `false`.

### `PairedBeacon()`
* **Description:** Returns the currently paired beacon entity.
* **Returns:** `Entity` - The beacon entity, or `nil` if not paired.

### `FindNearestBeacon()`
* **Description:** Scans the area within `TUNING.BOAT.BOAT_MAGNET.PAIR_RADIUS` for the closest valid and unpaired beacon.
* **Returns:** `Entity` - The nearest available beacon entity, or `nil` if none are found.

### `PairWithBeacon(beacon)`
* **Description:** Establishes a connection with a given beacon. This function sets up event listeners for the beacon's state (e.g., destruction, turning on/off), adds the `"paired"` tag, and begins the component's update cycle.
* **Parameters:**
    * `beacon`: The beacon entity to pair with.

### `UnpairWithBeacon()`
* **Description:** Breaks the connection with the currently paired beacon. It cleans up all event listeners, removes the `"paired"` tag, stops the component's update cycle, and notifies the beacon that it is no longer paired.

### `GetFollowTarget()`
* **Description:** Determines the precise entity that the magnet's boat should follow. This could be the beacon's boat, a player carrying the beacon, or the beacon item itself if it's on the ground.
* **Returns:** `Entity` - The target entity to follow, or `nil` if no valid target exists.

### `CalcMaxVelocity()`
* **Description:** Calculates the maximum velocity the magnet's boat should have. The speed is dynamically adjusted to match the target's speed and includes a catch-up mechanic that increases speed exponentially as the distance grows. Speed is also modified to prevent drifting when the target boat is turning.
* **Returns:** `number` - The calculated maximum velocity.

### `CalcMagnetDirection()`
* **Description:** Calculates the normalized direction vector pointing from the magnet's boat to the follow target, as well as the distance between them.
* **Returns:**
    1. `Vector3` - A normalized vector representing the direction to the target.
    2. `number` - The distance to the target.

### `CalcMagnetForce()`
* **Description:** Determines the attractive force the magnet should exert. The force is a constant value from `TUNING` as long as the distance to the target is greater than the minimum safe distance (calculated based on boat hull radii). If the boats are too close, the force is zero to prevent collision.
* **Returns:** `number` - The magnetic force to be applied.

### `OnUpdate(dt)`
* **Description:** The main update loop for the component, called every frame when the magnet is paired. It checks the distance to the beacon to handle automatic unpairing, updates the magnet's visual rotation to face the target, and pushes events based on whether the magnet is actively pulling.
* **Parameters:**
    * `dt`: `number` - The time delta since the last update.

## Events & Listeners

This component listens for several events on its associated `boat` and `beacon` entities to manage its state.

**Listens For:**
* `onremove` (on `self.boat`): Triggers a full cleanup by calling `ClearEverything`.
* `death` (on `self.boat`): Triggers a full cleanup by calling `ClearEverything`.
* `onremove` (on `self.beacon`): Unpairs from the beacon.
* `death` (on `self.beacon`): Unpairs from the beacon.
* `onturnon` (on `self.beacon`): Calls the `OnBeaconTurnedOn` handler.
* `onturnoff` (on `self.beacon`): Calls the `OnBeaconTurnedOff` handler.

**Pushes:**
* `boatmagnet_pull_start`: Pushed when the magnet is actively pulling a boat towards a beacon on a different boat.
* `boatmagnet_pull_stop`: Pushed when the magnet and beacon are on the same boat, causing the pulling to cease.