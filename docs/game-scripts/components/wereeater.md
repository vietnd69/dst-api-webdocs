---
id: wereeater
title: Wereeater
description: Tracks consumption of monster meat and forces transformation to were-form when the internal counter reaches a threshold.
tags: [transform, combat, state]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 03421d47
system_scope: entity
---

# Wereeater

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Wereeater` manages the progression toward transformation into the Werebeefalo (or Wereperson) state for entities with the `wereplayer` tag. It increments a counter when the entity consumes `monstermeat`, and triggers transformation once the counter reaches 2. It also handles resetting the counter over time and persists state across saves.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wereeater")
inst:AddTag("wereplayer")

-- Simulate eating monster meat
local food = SpawnPrefab("monstermeat")
inst.components.wereeater:EatMosterFood({ food = food })
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `wereplayer` and `wereitem`; pushes event `wereeaterchanged`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `duration` | number | `TUNING.TOTAL_DAY_TIME / 2` | Time (in seconds) before monster meat counter decays by 1. |
| `monster_count` | number | `0` | Current count of eaten monster meat items. |
| `forget_task` | Task or `nil` | `nil` | Scheduled task that decrements `monster_count` after `duration`. |
| `forcetransformfn` | function or `nil` | `nil` | Optional callback used to force transformation to a specific were-mode. |

## Main functions
### `EatMosterFood(data)`
* **Description:** Processes consumption of monster meat. Increments `monster_count`, schedules decay, and triggers transformation if the count reaches 2. No effect if `inst` already has the `wereplayer` tag.
* **Parameters:** `data` (table) - must contain `food` (a prefab instance) as a field.
* **Returns:** Nothing.
* **Error states:** Early return if `inst` already has tag `wereplayer`.

### `ResetFoodMemory()`
* **Description:** Resets `monster_count` to `0` and cancels any pending decay task.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetForceTransformFn(fn)`
* **Description:** Sets the optional callback used by `ForceTransformToWere`.
* **Parameters:** `fn` (function) - signature: `(inst: Entity, mode: string?) -> nil`.
* **Returns:** Nothing.

### `ForceTransformToWere(mode)`
* **Description:** Invokes the `forcetransformfn` callback (if set) to transform the entity.
* **Parameters:** `mode` (string or `nil`) - the transformation mode to request (e.g., `"werebeefalo"`), or `nil`.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns serialization data for saving. Returns `nil` if `monster_count` is `0`.
* **Parameters:** None.
* **Returns:** 
  * `nil` if not storing state.
  * `table` with `monster_count` (number) and `task_left` (number, remaining time on decay task) otherwise.

### `OnLoad(data)`
* **Description:** Restores state from saved data. Recreates the decay task if needed.
* **Parameters:** `data` (table) - must contain `monster_count` (number) and optionally `task_left` (number).
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for in-game debugging tools.
* **Parameters:** None.
* **Returns:** string - formatted as `"monster_count: X/4 (Y/Z)"`, where `X` is `monster_count`, `Y` is remaining time on decay task (or `0`), and `Z` is `duration`.

## Events & listeners
- **Listens to:** `oneat` - triggers `EatMosterFood(data)`.
- **Pushes:** `wereeaterchanged` - fired after `monster_count` changes, with payload:
  * `old` (number) - previous count,
  * `new` (number) - updated count,
  * `istransforming` (boolean) - whether this change caused a transformation trigger.
