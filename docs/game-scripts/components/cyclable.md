---
id: cyclable
title: Cyclable
description: Manages cyclic step-based states for entities, such as toggling between multiple modes or phases.
tags: [state, inventory, ui]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: fc19b833
system_scope: entity
---

# Cyclable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Cyclable` enables entities to cycle through a fixed number of discrete steps (e.g., 1 to `num_steps`), typically representing alternating modes, phases, or configurations (such as clothing variants for a Beefalo or equipment states). It supports both manual cycling (e.g., via user input) and programmatic step control, and integrates with the game’s save/load system via `OnSave`/`OnLoad`. It also maintains a `"cancycle"` tag on the entity based on its `cancycle` state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("cyclable")
inst.components.cyclable:SetNumSteps(4)
inst.components.cyclable:SetOnCycleFn(function(inst, step, doer)
    -- update visual state or behavior based on step
    print("Cycled to step", step)
end)
inst.components.cyclable:Cycle(inst)  -- cycles forward
inst.components.cyclable:SetStep(2, inst)  -- sets step explicitly
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Manages the `"cancycle"` tag on the owning entity — adds it when `cancycle` becomes `true`, removes it when `false`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `cancycle` | boolean | `true` | Controls whether cycling is allowed; determines presence of `"cancycle"` tag. |
| `step` | number | `1` | Current step in the cycle (1-indexed, clamped between `1` and `num_steps`). |
| `num_steps` | number | `3` | Total number of steps in the cycle. Must be ≥ 1. |

## Main functions
### `SetNumSteps(num)`
* **Description:** Updates the total number of steps in the cycle. Automatically clamps the current `step` to stay within bounds.
* **Parameters:** `num` (number) — new total number of steps (should be ≥ 1).
* **Returns:** Nothing.

### `SetOnCycleFn(fn)`
* **Description:** Sets a callback function invoked after each step change (via `SetStep` or `Cycle`). The callback is optional and allows external logic (e.g., visual updates).
* **Parameters:** `fn` (function or `nil`) — callback with signature `(inst, step, doer)`, where `inst` is the entity, `step` is the new step index, and `doer` is the entity that triggered the change (e.g., player).
* **Returns:** Nothing.

### `SetStep(step, doer, ignore_callback)`
* **Description:** Sets the current step to a specific value, clamped between `1` and `num_steps`. Triggers the callback unless explicitly ignored.
* **Parameters:**
  * `step` (number) — desired step (non-zero integer).
  * `doer` (entity or `nil`) — entity performing the action; passed to the callback.
  * `ignore_callback` (boolean) — if `true`, skips callback execution.
* **Returns:** Nothing.

### `Cycle(doer, negative)`
* **Description:** Advances or retreats the step counter in a circular manner. If `negative` is `true`, decrements; otherwise increments.
* **Parameters:**
  * `doer` (entity or `nil`) — entity triggering the cycle; passed to the callback.
  * `negative` (boolean) — direction: `true` for decrement (wrap to `num_steps`), `false` for increment (wrap to `1`).
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes the component’s state for saving to disk.
* **Parameters:** None.
* **Returns:** `{ step = number }` — table containing the current step value.

### `OnLoad(data)`
* **Description:** Restores the component’s state from saved data. Clamps and ensures consistency.
* **Parameters:** `data` (table or `nil`) — data returned by `OnSave`.
* **Returns:** Nothing.
* **Error states:** If `data.step` is missing or invalid, falls back to the current `self.step` and re-applies clamping.

## Events & listeners
* **Listens to:** None.
* **Pushes:** None.
