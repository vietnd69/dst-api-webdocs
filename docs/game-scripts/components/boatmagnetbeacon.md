---
id: boatmagnetbeacon
title: Boatmagnetbeacon
description: Manages the state and pairing logic for a beacon that attracts a Boat Magnet.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Boatmagnetbeacon

## Overview
The `Boatmagnetbeacon` component is attached to an entity that serves as a target for a `boatmagnet`. Its primary responsibility is to manage its own state (on/off, picked up, paired), detect which boat it is currently on, and handle the pairing and unpairing process with a corresponding `boatmagnet` entity. It persists its paired state across game sessions.

## Dependencies & Tags
**Dependencies:**
- `inventoryitem` (optional): To change the entity's inventory image based on its on/off state.

**Tags:**
- `turnedoff`: Added to the entity when the beacon is deactivated.
- `paired`: Added to the entity when it is successfully paired with a `boatmagnet`.

## Properties
| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `turnedoff` | boolean | `false` | Tracks if the beacon is currently deactivated. |
| `ispickedup` | boolean | `false` | Tracks if the beacon is currently in a player's inventory. |
| `boat` | Entity | `nil` | A reference to the boat entity the beacon is currently on. |
| `magnet` | Entity | `nil` | A reference to the `boatmagnet` entity this beacon is paired with. |
| `magnet_guid` | string | `nil` | The GUID of the paired `boatmagnet`, used for saving and loading. |
| `magnet_must_tags` | table | `{"boatmagnet"}` | List of tags an entity must have to be considered a potential magnet. |
| `magnet_cant_tags` | table | `{"paired"}` | List of tags a potential magnet entity must not have. |
| `magnet_distance` | number | `TUNING.BOAT.BOAT_MAGNET.MAX_DISTANCE` | The maximum distance to search for a magnet to pair with. |

## Main Functions

### `OnSave()`
* **Description:** Serializes the component's state for saving the game. It stores whether the beacon is turned off, picked up, and the GUID of its paired magnet.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Deserializes the component's state upon loading a game. It restores the `turnedoff` and `ispickedup` states, as well as the `magnet_guid`. It also updates the entity's inventory image if applicable.
* **Parameters:**
    - `data` (table): The saved data table from `OnSave`.

### `GetBoat()`
* **Description:** Determines and returns the boat entity that the beacon is currently on. It first checks if the beacon's owner is on a platform, and verifies that the platform has the "boat" tag.
* **Parameters:** None.

### `SetBoat(boat)`
* **Description:** Assigns a boat entity to this beacon and sets up event listeners to monitor the boat's removal or death, ensuring the component state remains valid.
* **Parameters:**
    - `boat` (Entity): The boat entity to associate with this beacon. Can be `nil` to clear the association.

### `PairedMagnet()`
* **Description:** A simple getter that returns the currently paired magnet entity.
* **Parameters:** None.

### `PairWithMagnet(magnet)`
* **Description:** Pairs this beacon with a specified `boatmagnet` entity. It stores the magnet's reference and GUID, adds listeners for the magnet's death or removal, turns the beacon on, and adds the "paired" tag to itself.
* **Parameters:**
    - `magnet` (Entity): The `boatmagnet` entity to pair with.

### `UnpairWithMagnet()`
* **Description:** Breaks the connection with the currently paired `boatmagnet`. It clears the magnet reference and GUID, removes event listeners, turns the beacon off, and removes the "paired" tag.
* **Parameters:** None.

### `TurnOnBeacon()`
* **Description:** Activates the beacon. It sets `turnedoff` to false, updates the inventory image, plays the "activate" state in the stategraph, and pushes an "onturnon" event.
* **Parameters:** None.

### `TurnOffBeacon()`
* **Description:** Deactivates the beacon. It sets `turnedoff` to true, updates the inventory image, plays the "deactivate" state in the stategraph, and pushes an "onturnoff" event.
* **Parameters:** None.

### `SetIsPickedUp(pickedup)`
* **Description:** Updates the `ispickedup` status of the beacon. If the beacon is being dropped (`pickedup` is false), it will attempt to find the boat it is on.
* **Parameters:**
    - `pickedup` (boolean): `true` if the beacon is being picked up, `false` if it's being dropped.

## Events & Listeners
* **Listens for:**
    - `onpickup` on self: Sets the `ispickedup` state to true.
    - `ondropped` on self: Sets the `ispickedup` state to false.
    - `onremove` on `self.boat`: Clears the reference to the boat.
    - `death` on `self.boat`: Clears the reference to the boat.
    - `onremove` on `self.magnet`: Triggers `UnpairWithMagnet` if the paired magnet is removed.
    - `death` on `self.magnet`: Triggers `UnpairWithMagnet` if the paired magnet is destroyed.
* **Pushes:**
    - `onturnon`: Pushed when `TurnOnBeacon` is called.
    - `onturnoff`: Pushed when `TurnOffBeacon` is called.