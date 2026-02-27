---
id: panic
title: Panic
description: Causes an entity to randomly change movement direction at short intervals, simulating erratic panic behavior.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: f52d2d23
---

# Panic

## Overview
The `Panic` component is a behaviour node used in the AI behaviour tree system to simulate panicked movement. When active, it repeatedly selects a new random movement direction and instructs the entity's locomotor to run in that direction for a short duration (between 0.25s and 0.5s). This creates a jittery, unpredictable escape pattern characteristic of fleeing or startled creatures. It relies on the `locomotor` component to execute directional movement via `RunInDirection`.

## Dependencies & Tags
- **Components used:** `locomotor`
- **Tags:** None identified.

## Properties
| Property   | Type   | Default Value | Description                                                                 |
|------------|--------|---------------|-----------------------------------------------------------------------------|
| `waittime` | number | `0`           | Timestamp indicating when the next direction change should occur.           |

## Main Functions
### `Panic:Visit()`
* **Description:** Executes the panic logic. On the first visit (`status == READY`), it picks a new random direction and transitions to `RUNNING`. On subsequent visits, it checks if the current `waittime` has elapsed; if so, it picks a new direction, otherwise it sleeps until `waittime`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Panic:PickNewDirection()`
* **Description:** Sets a new random movement direction (0–360 degrees) for the entity's locomotor and schedules the next direction change 0.25–0.5 seconds in the future.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & Listeners
None.