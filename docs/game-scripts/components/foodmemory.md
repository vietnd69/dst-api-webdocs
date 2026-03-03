---
id: foodmemory
title: Foodmemory
description: Tracks remembered food items and calculates consumption-based multipliers for an entity over time.
tags: [food, memory, multiplier, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9b6f8b29
system_scope: entity
---

# Foodmemory

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Foodmemory` maintains a record of food items consumed by an entity, tracking how many times each food type has been eaten. It supports automatic forgetting of food memories after a configurable duration and computes multiplicative bonuses based on consumption frequency using a provided multiplier list. This component is typically used for characters or entities that benefit from dietary repetition, such as沃尔特 or Wathgrithr in *Don't Starve Together*.

The component interacts with the `spicedfoods.lua` module to resolve food prefabs to their base food names (e.g., handling spiced variants).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("foodmemory")
inst.components.foodmemory:SetDuration(TUNING.TOTAL_DAY_TIME)
inst.components.foodmemory:SetMultipliers({1.1, 1.2, 1.3})
inst.components.foodmemory:RememberFood("berries")
local count = inst.components.foodmemory:GetMemoryCount("berries")
local mult = inst.components.foodmemory:GetFoodMultiplier("berries")
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (injected) | The entity instance that owns the component. |
| `duration` | number | `TUNING.TOTAL_DAY_TIME` | Time in seconds before a food memory is forgotten. |
| `foods` | table | `{}` | Maps food base prefab names to memory records (`{count: number, task: Task}`). |
| `mults` | table or `nil` | `nil` | Ordered list of multiplier values; index corresponds to memory count (capped at table length). |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleans up scheduled forgetting tasks when the component is removed from an entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetDuration(duration)`
*   **Description:** Sets the duration after which consumed food memories are automatically forgotten.
*   **Parameters:** `duration` (number) — time in seconds before food memories expire.
*   **Returns:** Nothing.

### `SetMultipliers(mults)`
*   **Description:** Configures the multiplier array used by `GetFoodMultiplier`. The `i`-th element applies when a food has been eaten `i` times (up to table length).
*   **Parameters:** `mults` (table or `nil`) — ordered list of numeric multipliers; `nil` disables multipliers.
*   **Returns:** Nothing.

### `GetBaseFood(prefab)`
*   **Description:** Returns the base food prefab name by resolving spiced food variants via the `spicedfoods` module.
*   **Parameters:** `prefab` (string) — food prefab name (e.g., `"spicedberries"` or `"berries"`).
*   **Returns:** string — the canonical base prefab name (e.g., `"berries"`).

### `RememberFood(prefab)`
*   **Description:** Records consumption of a food item, increments its count, resets the forgetting timer, or creates a new memory record if this is the first consumption.
*   **Parameters:** `prefab` (string) — food prefab name; automatically resolved to base food.
*   **Returns:** Nothing.

### `GetMemoryCount(prefab)`
*   **Description:** Returns how many times a specific food has been consumed (counted by base food name).
*   **Parameters:** `prefab` (string) — food prefab name.
*   **Returns:** number — count of consumptions (`0` if not remembered).
*   **Error states:** Returns `0` for foods not yet remembered.

### `GetFoodMultiplier(prefab)`
*   **Description:** Computes the multiplicative bonus for a food based on consumption count and configured multipliers.
*   **Parameters:** `prefab` (string) — food prefab name.
*   **Returns:** number — multiplier value; defaults to `1` if no multipliers set or count is `0`.
*   **Error states:** Returns `1` if `mults` is `nil` or no memory exists for the food.

### `OnSave()`
*   **Description:** Serializes current food memory state for saving, including remaining time for each forgetting task.
*   **Parameters:** None.
*   **Returns:** table or `nil` — structure `{ foods = { [foodname] = { count = number, t = number } } }` if memories exist; `nil` otherwise.

### `OnLoad(data)`
*   **Description:** Restores food memory state from save data, reconstructing tasks with remaining time.
*   **Parameters:** `data` (table) — must contain `data.foods` as `{ [foodname] = { count = number, t = number } }`.
*   **Returns:** Nothing.
*   **Error states:** Safely handles missing or partial data; `t` defaults to `self.duration` if absent.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None
