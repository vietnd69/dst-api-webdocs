---
id: centipedebody
title: Centipedebody
description: Manages the segmented body of a centipede-like creature, controlling its creation, movement, and segment behavior.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 8c8fd8bb
---

# Centipedebody

## Overview
This component is responsible for creating and managing a multi-segmented entity, such as the Shadow Thrall Centipede. It handles the spawning of head and torso segments, linking them together with physics constraints, and coordinating their collective movement. The component also manages which "head" segment is currently in control of the creature's locomotion, allowing for dynamic changes in direction and leadership.

## Dependencies & Tags

**Dependencies:**
- Relies on the `locomotor` component of each segment to control movement.
- Interacts with the `Physics` component of each segment to create physical constraints between them.
- Assumes segments may have a `brain` component to start and stop.

**Tags:**
- Checks for the `"centipede_head"` tag on segments to apply specific logic to them.

## Properties

| Property | Type | Default Value | Description |
|---|---|---|---|
| `bodies` | `table` | `{}` | An ordered list of all entity instances that make up the creature's body segments. |
| `heads` | `table` | `{}` | A list of all head segment entities. |
| `head_in_control` | `Entity` | `nil` | A reference to the head segment currently directing movement. |
| `headprefab` | `string` | `"shadowthrall_centipede_head"` | The prefab used for spawning head segments. |
| `torsoprefab` | `string` | `"shadowthrall_centipede_body"` | The prefab used for spawning torso segments. |
| `num_torso` | `number` | `5` | The initial number of torso segments spawned when the body is created. |
| `max_torso` | `number` | `TUNING.SHADOWTHRALL_CENTIPEDE.MAX_SEGMENTS` | The maximum number of segments the creature can have. |
| `turnspeed` | `number` | `TUNING.SHADOWTHRALL_CENTIPEDE.TURNSPEED` | The speed at which segments turn to follow the one ahead. |
| `halted` | `boolean` | `false` | If true, the creature's brain is stopped and it cannot move. |

## Main Functions

### `Halt()`
* **Description:** Stops the brain of all head segments, effectively pausing the creature's movement and AI. Sets the `halted` flag to true.

### `CheckUnhalt()`
* **Description:** Checks if all body segments are awake (i.e., not sleeping). If all segments are awake, it restarts the brain for all head segments and sets the `halted` flag to false.

### `IsHalted()`
* **Description:** Returns a boolean indicating if the centipede is currently halted.
* **Returns:** `boolean` - True if the creature is halted.

### `GetControllingHead()`
* **Description:** Returns the entity instance of the head segment currently in control of the creature's movement.
* **Returns:** `Entity` - The controlling head segment.

### `CreateFullBody()`
* **Description:** Spawns and assembles the complete centipede body. It creates an initial head, the specified number of torso segments, and a final head, then assigns control to the first head.

### `SpawnHead()`
* **Description:** Spawns a new head segment and adds it to the end of the body.
* **Returns:** `Entity` - The newly spawned head segment.

### `SpawnTorso()`
* **Description:** Spawns a new torso segment and adds it to the end of the body.
* **Returns:** `Entity` - The newly spawned torso segment.

### `GrowNewSegment(index)`
* **Description:** Spawns a new torso segment and inserts it into the body at a given index. If no index is provided, a random position (not at the very end) is chosen. The new segment pushes a "grow_segment" event. This function respects the `max_torso` limit.
* **Parameters:**
    - `index` (number, optional): The position in the `bodies` table to insert the new segment.

### `GiveControlToHead(head)`
* **Description:** Transfers primary control to the specified head segment. This stops all other segments' locomotors and reorients the body to follow the new head, potentially reversing the creature's direction of travel.
* **Parameters:**
    - `head` (Entity): The head segment that will take control.

### `GiveControlToRandomHead()`
* **Description:** Gives movement control to a randomly selected head segment.

### `GiveControlToOtherHead()`
* **Description:** Switches control to the head segment that is not currently in control.

### `ForEachSegment(fn, ...)`
* **Description:** A utility function to execute a given function on every segment of the body.
* **Parameters:**
    - `fn` (function): The function to call for each segment. The segment entity will be the first argument.
    - `...` (any): Additional arguments to pass to the function `fn`.

### `OnUpdate(dt, force_pivot_update)`
* **Description:** The main update loop for the component. It's responsible for the "snaking" movement by calculating the rotation for each segment to follow the one in front of it and updating the physics constraints (pivots) accordingly. This only runs when the controlling head is moving.
* **Parameters:**
    - `dt` (number): The delta time since the last update.
    - `force_pivot_update` (boolean, optional): If true, forces an update of the physics pivots even if the head is not moving.

## Events & Listeners

The main component entity listens for the following event:
- `death`: Calls an internal function to stop the component's update loop.

The component attaches the following listeners to each individual body segment it creates:
- `entitysleep`: Triggers an attempt to halt the entire creature.
- `entitywake`: Triggers a check to see if the creature can be un-halted.
- `onremove`: Ensures the creature's controller is removed if a segment is removed.

The component pushes the following event:
- `grow_segment`: Pushed on a newly created segment from `GrowNewSegment`.