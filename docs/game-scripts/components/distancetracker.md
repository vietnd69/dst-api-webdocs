---
id: distancetracker
title: Distancetracker
description: This component calculates and stores the distance an entity has moved between updates.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: ee127131
---

# Distancetracker

## Overview
This component attaches to an entity and continuously tracks the distance it travels. It stores the entity's position from the previous game frame and uses it to calculate the displacement in the current frame, effectively measuring movement over time.

## Dependencies & Tags
None identified.

## Properties
| Property       | Type     | Default Value | Description                                                    |
| :------------- | :------- | :------------ | :------------------------------------------------------------- |
| `previous_pos` | `Vector3` | `nil`         | The `Point` (Vector3) representing the entity's world position from the immediately preceding update frame. |

## Main Functions
### `OnUpdate(dt)`
*   **Description:** This function is called every game frame the component is active. It retrieves the entity's current position, calculates the distance traveled since the last `OnUpdate` call using the stored `previous_pos`, and then updates `previous_pos` to the current location for the next frame's calculation. The commented-out code indicates a historical intention to send game statistics related to distance traveled.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed in seconds since the last frame.