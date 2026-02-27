---
id: boatrotator
title: Boatrotator
description: Manages an entity's rotational interaction with a boat, allowing it to influence and synchronize with the boat's movement.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 01830615
---

# Boatrotator

## Overview
The Boatrotator component is attached to entities that can control the rotation of a boat, such as a mast. It identifies the boat the entity is currently on, links to the boat's `boatring` component, and synchronizes the entity's rotation with the boat. It provides the primary interface for an entity to initiate or stop the boat's rotation.

## Dependencies & Tags
- **Depends on:**
  - `boatring` (on the boat entity)
  - `Transform` (on the component's owner entity)
  - `sg` (stategraph, on the component's owner entity)
- **Checks for Tags:**
  - `boat` (on the platform entity to confirm it is a valid boat)

## Properties

| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | entity | `self.inst` | A reference to the entity instance this component is attached to. |
| `boat` | entity | `nil` | A reference to the boat entity this component is currently controlling. |
| `_setup_boat_task` | task | task handle | A handle for the initial task that finds and sets up the boat connection. |

## Main Functions

### `SetRotationDirection(dir)`
* **Description:** Sets the rotational direction for the boat this entity is on. It normalizes the input to `1` (clockwise), `-1` (counter-clockwise), or `0` (stop). It then calls the corresponding function on the boat's `boatring` component and pushes an event to notify other entities on the boat.
* **Parameters:**
    * `dir` (number): The desired rotation direction. Positive for clockwise, negative for counter-clockwise, and 0 to stop.

### `SetBoat(boat)`
* **Description:** Establishes or terminates the link between this entity and a specific boat. When a boat is set, it registers as a "rotator" with the boat's `boatring` component, syncs its rotation, and starts listening for the boat's `death` and `onremove` events. When the boat is set to `nil`, it cleans up these connections and listeners.
* **Parameters:**
    * `boat` (entity): The boat entity to link to, or `nil` to unlink from the current boat.

### `OnDeath()`
* **Description:** A callback function triggered when the linked boat is destroyed. It safely unlinks the component from the boat by calling `SetBoat(nil)`.
* **Parameters:** None.

## Events & Listeners
- **Listens for (on the boat entity):**
    - `onremove`: Triggers the `OnBoatRemoved` callback to clear the local boat reference.
    - `death`: Triggers the `OnBoatDeath` callback to handle the boat's destruction.
- **Pushes (to the boat entity):**
    - `rotationdirchanged`: Pushed when `SetRotationDirection` is called to inform other components on the boat of the new rotation direction.