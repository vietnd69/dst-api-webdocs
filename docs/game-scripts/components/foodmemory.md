---
id: foodmemory
title: Foodmemory
description: Tracks how often a player entity has consumed specific food items and applies behavioral multipliers based on that memory.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 9b6f8b29
---

# Foodmemory

## Overview
This component maintains a time-limited memory of consumed food items for an entity (typically a player), recording how many times each food has been eaten and fading memories over time. It supports food grouping (via `spicedfoods` base-name mapping) and enables external systems to retrieve current memory counts or applicable multipliers based on repeated consumption.

## Dependencies & Tags
- Relies on: `spicedfoods` module for base food name resolution.
- Entity must have: `inst:DoTaskInTime()` (i.e., the entity should be a `GOOPY`/`Sim` object with task scheduling).
- No tags are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the entity this component belongs to. |
| `duration` | `number` | `TUNING.TOTAL_DAY_TIME` | Time in seconds before a food memory expires and is forgotten. |
| `foods` | `table` | `{}` | Table mapping base food prefab names to memory records (each record includes `count` and `task`). |
| `mults` | `table?` | `nil` | Optional ordered list of multipliers; index corresponds to memory count. |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Called when the component is removed from its entity. Cancels all pending food-expiration tasks to prevent memory leaks.
* **Parameters:** None.

### `SetDuration(duration)`
* **Description:** Updates the duration (in seconds) after which a food memory expires.
* **Parameters:**
  - `duration` (`number`): New expiration time in seconds.

### `SetMultipliers(mults)`
* **Description:** Sets the list of multipliers to apply based on the number of times a food has been remembered.
* **Parameters:**
  - `mults` (`table`): An array of numbers where index `i` corresponds to multiplier for `i` instances of the food in memory.

### `GetBaseFood(prefab)`
* **Description:** Resolves the base food name for a given prefab. Spiced or variant foods map back to their canonical base name using the `spicedfoods` mapping.
* **Parameters:**
  - `prefab` (`string`): The prefab name of the food.

### `RememberFood(prefab)`
* **Description:** Registers consumption of a food item. If already present, increments count and resets the forgetting timer; otherwise, creates a new memory entry with initial count 1 and schedules expiration.
* **Parameters:**
  - `prefab` (`string`): The prefab name of the food consumed.

### `GetMemoryCount(prefab)`
* **Description:** Returns how many times the given food has been remembered (i.e., consumed) and not yet forgotten.
* **Parameters:**
  - `prefab` (`string`): The prefab name of the food.

### `GetFoodMultiplier(prefab)`
* **Description:** Returns the multiplier associated with the current memory count for the food. If no memory exists or `mults` is not set, returns `1`.
* **Parameters:**
  - `prefab` (`string`): The prefab name of the food.
* **Notes:** Uses `math.min(#mults, count)` to clamp index within bounds.

### `OnSave()`
* **Description:** Serializes active food memories into a saveable structure, storing count and remaining time until expiration for each.
* **Returns:** `table?` — A table with key `foods`, mapping base food names to `{ count = number, t = number }`. Returns `nil` if no memories exist.

### `OnLoad(data)`
* **Description:** Restores food memories from saved data, rescheduling expiration tasks based on stored remaining times.
* **Parameters:**
  - `data` (`table`): Save data containing `data.foods`, where keys are base food names and values are `{ count, t }`.

## Events & Listeners
- Listens to:
  - Internal expiration via `self.inst:DoTaskInTime(...)`, which invokes `OnForgetFood` when the scheduled time elapses.
  - `OnForgetFood(inst, self, prefab)` — Internal callback that removes a food entry from memory (`self.foods[prefab] = nil`).
- Does *not* push or listen to any broadcast game events (e.g., `"onupdate"`, `"onkilled"`).