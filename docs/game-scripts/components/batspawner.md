---
id: batspawner
title: Batspawner
description: Manages the periodic spawning and tracking of bats from a central entity point.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Batspawner

## Overview
The Batspawner component is responsible for spawning and managing a population of bats around its host entity. It controls the rate of spawning, the maximum number of active bats, and finds valid spawn locations in the world. It also tracks the bats it creates and can despawn them under certain conditions.

## Dependencies & Tags
None identified.

## Properties

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| inst | `EntityScript` | - | The entity instance this component is attached to. |
| bats | `table` | `{}` | A table that tracks all active bat entities spawned by this component. |
| timetospawn | `number` | `0` | A countdown timer for when the next bat should be spawned. |
| batcap | `number` | `6` | The maximum number of bats this spawner will manage at one time. |
| spawntime | `table` or `number` | `TUNING.BIRD_SPAWN_DELAY` | The delay between bat spawn attempts. |
| battypes | `table` | `{"bat"}` | A list of bat prefab names that can be spawned. |

## Main Functions
### `GetDebugString()`
* **Description:** Returns a formatted string showing the current number of active bats versus the maximum capacity. Useful for debugging.
* **Parameters:** None.

### `SetSpawnTimes(times)`
* **Description:** Sets the time delay between bat spawns.
* **Parameters:**
    * `times` (`number` or `table`): The new spawn time value.

### `SetMaxBats(max)`
* **Description:** Sets the maximum number of bats this spawner can have active at once.
* **Parameters:**
    * `max` (`number`): The new maximum bat capacity.

### `StartTracking(inst)`
* **Description:** Adds a newly spawned bat to the tracking table. It also marks the bat as non-persistent, meaning it will not be saved, and sets up a listener to remove the bat if it ever enters a "sleep" state.
* **Parameters:**
    * `inst` (`EntityScript`): The bat entity instance to begin tracking.

### `GetSpawnPoint(pt)`
* **Description:** Finds a valid point on the ground near a given location to spawn a bat. The search is performed in a circular fan pattern. A valid point must be passable and not covered by Ground Creep.
* **Parameters:**
    * `pt` (`Vector3`): The central point to search around for a spawn location.

## Events & Listeners
* **Listens To:**
    * `"entitysleep"` on a spawned bat: When a tracked bat goes into its sleep state (e.g., becomes inactive because a player is far away), this listener triggers a function to remove the bat entity from the world. This helps manage entity counts and prevents inactive bats from persisting.