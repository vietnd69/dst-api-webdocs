---
id: walkingplank
title: Walkingplank
description: Manages interactive mounting, extending, retracting, and abandoning behavior for a walkable plank entity in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 05715165
---

# Walkingplank

## Overview
This component provides the logic for a walkable plank entity, enabling players (or other entities) to mount and dismount it, and supporting dynamic extension/retraction animations. It maintains a reference to the current mounting entity and coordinates state transitions via events.

## Dependencies & Tags
- Adds the `"walkingplank"` tag to its entity on initialization.
- Removes the `"walkingplank"` tag on removal from entity.
- Assumes dependency on the following components being present on related entities (not added by this component itself):
  - `doer.components.walkingplankuser` (expected to be available on mounting entity)
  - `doer.Physics` (expected to provide `Teleport()`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | Reference to the entity this component is attached to. |
| `doer` | `Entity?` | `nil` | Reference to the entity currently mounted on the plank; `nil` when unoccupied. |

## Main Functions
### `Extend()`
* **Description:** Triggers the extension animation by pushing the `"start_extending"` event immediately.
* **Parameters:** None.

### `Retract()`
* **Description:** Triggers the retraction animation by pushing the `"start_retracting"` event immediately.
* **Parameters:** None.

### `MountPlank(doer)`
* **Description:** Attempts to mount the given entity (`doer`) onto the plank. Teleports the `doer` to the plank's world position, sets `doer` as the active mount, and notifies related components via events. Returns `true` on success, or `false` if already occupied.
* **Parameters:**
  - `doer` (*Entity*): The entity attempting to mount the plank.

### `StopMounting()`
* **Description:** Cancels an ongoing mount attempt (if any), clearing the `doer` reference and broadcasting `"stop_mounting"`.
* **Parameters:** None.

### `AbandonShip(doer)`
* **Description:** Initiates dismount for the currently mounted entity (`doer`). Validates ownership, triggers dismount logic via `walkingplankuser`, and broadcasts `"start_abandoning"`. Returns `true` on success, or `false` if `doer` is invalid or mismatched.
* **Parameters:**
  - `doer` (*Entity*): The entity that originally mounted and is now leaving the plank.

## Events & Listeners
- Listens for entity removal to clean up the `"walkingplank"` tag (via `OnRemoveFromEntity`).
- Pushes events:
  - `"start_extending"` (via `Extend`)
  - `"start_retracting"` (via `Retract`)
  - `"start_mounting"` (via `MountPlank`)
  - `"stop_mounting"` (via `StopMounting`)
  - `"start_abandoning"` (via `AbandonShip`)