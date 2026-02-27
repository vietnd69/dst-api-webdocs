---
id: groundcreep
title: Groundcreep
description: This component provides serialization support for the GroundCreep object attached to an entity by storing and restoring its state via OnSave/OnLoad.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: b491de89
---

# Groundcreep

## Overview
This component implements serialization and deserialization logic for the GroundCreep object associated with an entity. It ensures that the state of the GroundCreep—typically representing persistent environmental creep effects like rot or sludge—is properly saved and restored across sessions. It does *not* define or manage the creep behavior itself, but acts as a conduit between the game’s save/load system and the GroundCreep instance.

## Dependencies & Tags
- **Component Dependency:** Assumes that `inst.GroundCreep` exists as a valid object with methods `GetAsString()`, `SetFromString(string)`, and `FastForward()`.
- **Event Listener:** Listens for `"playeractivated"` to trigger fast-forwarding of creep state for newly activated players.
- **No tags** are added, removed, or checked.

## Properties
No public properties are initialized directly in this component’s constructor. The only stored reference is:
- `self.inst` — the owning entity instance (assigned automatically in the `Class` framework).

## Main Functions

### `OnSave()`
* **Description:** Serializes the GroundCreep state by calling `GetAsString()` on the associated `inst.GroundCreep` object. Only active on the master simulation.
* **Parameters:** None (method uses `self` and `inst`).

### `OnLoad(data)`
* **Description:** Deserializes the GroundCreep state by calling `SetFromString(data)` on `inst.GroundCreep`. Only active on the master simulation.
* **Parameters:**
  - `data` (`string`): The serialized GroundCreep state string obtained from `OnSave()`.

## Events & Listeners
- **Listens for `"playeractivated"`:** Triggers `inst.GroundCreep:FastForward()` to ensure creep state is up-to-date when a player becomes active (e.g., upon rejoining or initial spawn).