---
id: boatring
title: Boatring
description: Manages rotation behavior and bumper collision detection for a boat entity in the game world.
tags: [boat, rotation, collision, map, movement]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: a99f1f1b
system_scope: world
---

# Boatring

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatRing` handles the rotational dynamics and collision logic for a boat entity. It uses the `boatringdata` component to retrieve geometric properties like radius and segment count, coordinates rotation updates via rotator entities (e.g., paddles or motors), and manages bumper objects for collision detection. It also integrates with the event system to respond to death and rotation changes, ensuring proper sound cleanup and rotator synchronization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("boatring")
inst:AddComponent("boatringdata")
inst.components.boatringdata.radius = 10
inst.components.boatringdata.segments = 8

inst.components.boatring:AddRotator(rotator_entity)
inst.components.boatring:SetRotationDirection(1) -- start rotating clockwise
```

## Dependencies & tags
**Components used:** `boatringdata`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rotationdirection` | number | `0` | Current rotation direction: `0` = stopped, `>0` = clockwise, `<0` = counter-clockwise. |
| `rotate_speed` | number | `0.5` | Rotation speed multiplier per rotator. |
| `max_rotate_speed` | number | `2` | Maximum allowed rotation speed. |
| `updating` | boolean | `false` | Whether the component is currently being updated via `OnUpdate`. |
| `boatbumpers` | table | `{}` | Array of bumper entities associated with the boat. |
| `rotators` | table | `{}` | Array of rotator entities that drive rotation. |

## Main functions
### `GetRadius()`
* **Description:** Returns the boat's radius (in world units), retrieved from the `boatringdata` component.
* **Parameters:** None.
* **Returns:** `number` — boat radius.

### `GetNumSegments()`
* **Description:** Returns the number of angular segments defining the boat’s ring, used for segmentation-based collision checks.
* **Parameters:** None.
* **Returns:** `number` — number of segments.

### `SetRotationDirection(dir)`
* **Description:** Sets the boat’s rotation direction and starts/stops the update loop as needed. Also informs `boatringdata` and all registered rotators of the change.
* **Parameters:** `dir` (number) — rotation direction: `0` to stop, positive for clockwise, negative for counter-clockwise.
* **Returns:** Nothing.

### `AddBumper(bumper)`
* **Description:** Adds a bumper entity to the internal list for collision detection.
* **Parameters:** `bumper` (Entity) — entity representing a bumper segment.
* **Returns:** Nothing.

### `RemoveBumper(bumper)`
* **Description:** Removes a bumper entity from the internal list.
* **Parameters:** `bumper` (Entity) — entity to remove.
* **Returns:** Nothing.

### `GetBumperAtPoint(x, z)`
* **Description:** Determines which bumper (if any) covers the given world coordinates `(x, z)` based on angular sectors.
* **Parameters:**  
  - `x` (number) — world X coordinate  
  - `z` (number) — world Z coordinate  
* **Returns:** `Entity?` — the bumper entity covering the point, or `nil` if none.

### `AddRotator(rotator)`
* **Description:** Registers a rotator entity to contribute to the boat’s rotation.
* **Parameters:** `rotator` (Entity) — entity controlling rotation (e.g., paddle or motor).
* **Returns:** Nothing.

### `RemoveRotator(rotator)`
* **Description:** Unregisters a rotator entity from influencing the boat.
* **Parameters:** `rotator` (Entity) — entity to remove.
* **Returns:** Nothing.

### `OnDeath()`
* **Description:** Cleans up sounds associated with boat movement upon the entity’s death.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Performs frame-by-frame rotation logic during updates. Computes angular velocity based on active rotators and applies rotation to the boat’s transform.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes the component’s state for persistence (e.g., world save).
* **Parameters:** None.
* **Returns:** `table?` — `{ rotationdirection = <number> }`, though the function currently returns nothing due to an early `return`.

### `OnLoad(data)`
* **Description:** Restores component state from saved data.
* **Parameters:** `data` (table?) — saved state; expects `data.rotationdirection`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `death` — triggers `OnDeath()` to stop movement sounds.  
  - `rotationdirchanged` — triggers `onrotationchanged` callback to update rotator states.
- **Pushes:** None.
