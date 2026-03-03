---
id: farmplantstress
title: Farmplantstress
description: Tracks and evaluates stress conditions on farm plants to determine their final stress state based on environmental and gameplay factors.
tags: [agriculture, plant, entity, stress]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0b628f5d
system_scope: entity
---

# Farmplantstress

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FarmplantStress` is a component attached to farm plants that tracks stressors affecting their health and productivity. It maintains a list of named stressors (each represented by a test function and an optional callback), accumulates stress points when those stressors are active, and computes a final stress state (NONE, LOW, MODERATE, or HIGH). The component interacts with the `burnable` component to check for smoldering state and uses localization strings to generate dynamic descriptions of plant stress.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("farmplantstress")

-- Add a stressor named "dry"
inst.components.farmplantstress:AddStressCategory(
    "dry",
    function(inst, is_stressed, is_testing) return inst.components.finiteuse and inst.components.finiteuse:GetPercent() < 0.3 end,
    function(inst, is_stressed, doer) inst:PushEvent("onplantdry") end
)

-- Evaluate and retrieve final stress state
inst.components.farmplantstress:CalcFinalStressState()
print(inst.components.farmplantstress:GetFinalStressState())
```

## Dependencies & tags
**Components used:** `burnable` (for `IsSmoldering` check), `sourcemodifierlist` (via `require`)
**Tags:** Adds `farmplantstress` to the owning entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stressors` | table | `{}` | Maps stressor names to boolean values indicating whether the stressor is currently active. |
| `stressors_testfns` | table | `{}` | Maps stressor names to test functions that determine if the stressor is active. |
| `stressor_fns` | table | `{}` | Maps stressor names to callback functions triggered when a stressor state changes. |
| `stress_points` | number | `0` | Cumulative stress points accumulated across checkpoints. |
| `num_stressors` | number | `0` | Total number of registered stressor categories. |
| `final_stress_state` | FARM_PLANT_STRESS.* or `nil` | `nil` | Cached result of `CalcFinalStressState()`; one of `FARM_PLANT_STRESS.NONE`, `LOW`, `MODERATE`, or `HIGH`. |
| `checkpoint_stress_points` | number | *nil (runtime)* | Temporary value tracking stress points added during the current checkpoint. |
| `max_stress_points` | number | *nil (runtime)* | Running total of maximum possible stress points across all checkpoints. |

## Main functions
### `AddStressCategory(name, testfn, onchangefn)`
* **Description:** Registers a new stressor category with a name, a test function to evaluate its state, and an optional callback executed when the state changes.
* **Parameters:**  
  - `name` (string) – Unique identifier for the stressor.  
  - `testfn` (function) – Function `(inst, is_stressed, is_testing) -> boolean` that returns `true` if the stressor is active.  
  - `onchangefn` (function or `nil`) – Optional callback `(inst, stressed, doer)` triggered on state change.
* **Returns:** Nothing.

### `Reset()`
* **Description:** Resets all stressors to their default "stressed" state (`true`) and clears accumulated `stress_points` and `final_stress_state`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetStressed(name, stressed, doer)`
* **Description:** Manually sets the active state of a registered stressor and invokes its callback if the state changed.
* **Parameters:**  
  - `name` (string) – Name of the stressor.  
  - `stressed` (boolean or `nil`) – Desired state (`true` = stressed, `false` = not stressed). `nil` is treated as no-op.  
  - `doer` (Entity or `nil`) – Entity triggering the change, passed to the callback.
* **Returns:** Nothing.
* **Error states:** No effect if `name` is not a registered stressor.

### `MakeCheckpoint()`
* **Description:** Finalizes a stress evaluation checkpoint by counting active stressors, adding them to `stress_points`, and updating tracking metadata for debugging.
* **Parameters:** None.
* **Returns:** Nothing.

### `CalcFinalStressState()`
* **Description:** Computes the final stress state based on accumulated `stress_points`, with thresholds: `0–1 = NONE`, `2–6 = LOW`, `7–11 = MODERATE`, `12+ = HIGH`.
* **Parameters:** None.
* **Returns:** `FARM_PLANT_STRESS.*` – One of `NONE`, `LOW`, `MODERATE`, or `HIGH`.
* **Error states:** Stores result in `self.final_stress_state` for reuse; repeated calls return the cached value.

### `GetFinalStressState()`
* **Description:** Returns the precomputed final stress state (if any).
* **Parameters:** None.
* **Returns:** `FARM_PLANT_STRESS.* or nil` – Cached result of `CalcFinalStressState()`.

### `GetStressDescription(viewer)`
* **Description:** Generates a localized description string for a given viewer based on plant state, smoldering status, and active stressors.
* **Parameters:**  
  - `viewer` (Entity) – The entity observing the plant.
* **Returns:** `string or nil` – A localized description string such as `"DESCRIBE_PLANTHAPPY"` or `"DESCRIBE_PLANTSTRESSED"`.
* **Error states:**  
  - Returns `nil` if the plant is the viewer itself.  
  - Returns `"DESCRIBE_TOODARK"` if the viewer cannot see the plant.  
  - Returns `"DESCRIBE_SMOLDERING"` if the `burnable` component reports smoldering.

### `OnInteractWith(doer)`
* **Description:** Invokes an optional custom interaction handler (`oninteractwithfn`) if defined.
* **Parameters:**  
  - `doer` (Entity or `nil`) – Entity performing the interaction.
* **Returns:** `any` – Return value of `oninteractwithfn` if defined, otherwise `nil`.

### `OnSave()` and `OnLoad(data)`
* **Description:** Serialize/deserialize the component state for network replication or save/load.
* **Parameters (OnLoad):**  
  - `data` (table or `nil`) – Saved state containing `final_stress_state`, `stress_points`, and `stressors`.
* **Returns (OnSave):** `table` – A table containing current stress state, points, and stressor flags.
* **Error states:** `OnLoad` safely handles `nil` data by skipping updates.

### `GetDebugString()`
* **Description:** Returns a multiline debug string summarizing current stress state, checkpoint info, and per-stressor status.
* **Parameters:** None.
* **Returns:** `string` – Human-readable debug output.

## Events & listeners
- **Listens to:** None (this component does not register any event listeners).
- **Pushes:**  
  - Event `"onplantdry"` or similar – triggered via callbacks in `AddStressCategory` when a stressor state changes (custom to each stressor).
