---
id: farmplantstress
title: Farmplantstress
description: Manages stress tracking and state calculation for farm plants based on environmental and gameplay conditions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 0b628f5d
---

# Farmplantstress

## Overview
This component tracks stress conditions affecting farm plants by monitoring named stressor categories, accumulating stress points, and determining an overall stress state (NONE, LOW, MODERATE, or HIGH). It supports dynamic stressor registration, checkpoint-based point accumulation, and deserialization for saves.

## Dependencies & Tags
- Adds the tag `"farmplantstress"` to the instance.
- No other components are explicitly added via `AddComponent`. Uses `table`, `shuffleArray`, `GetString`, and `FARM_PLANT_STRESS` constants indirectly.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity. |
| `stressors` | `table` | `{}` | Maps stressor names to boolean `true` (stressed) or `false` (not stressed). |
| `stressors_testfns` | `table` | `{}` | Maps stressor names to functions that evaluate current stress state. |
| `stressor_fns` | `table` | `{}` | Maps stressor names to callback functions invoked on state change. |
| `stress_points` | `number` | `0` | Cumulative stress points accumulated across checkpoints. |
| `num_stressors` | `number` | `0` | Count of registered stressor categories. |
| `final_stress_state` | `FARM_PLANT_STRESS.*` or `nil` | `nil` | Cached final stress state after `CalcFinalStressState` is called. |
| `checkpoint_stress_points` | `number` | `nil` | Debug-only; stores stress points added in last `MakeCheckpoint`. |
| `max_stress_points` | `number` | `nil` | Debug-only; cumulative maximum possible stress points across checkpoints. |
| `oninteractwithfn` | `function` or `nil` | `nil` | Optional callback invoked by `OnInteractWith`. |

## Main Functions

### `AddStressCategory(name, testfn, onchangefn)`
* **Description:** Registers a new stressor category with a name, a function to test its current state, and an optional callback triggered when the stressor’s state changes.
* **Parameters:**
  - `name` (string): Unique identifier for the stressor.
  - `testfn` (function): `(inst, was_stressed, do_save) → boolean`; evaluates whether the stressor is currently active.
  - `onchangefn` (function): `(inst, is_now_stressed, doer) → nil`; called when stressor state toggles.

### `Reset()`
* **Description:** Resets all stressors to the "stressed" state (`true`) and clears accumulated stress points and final state.

### `SetStressed(name, stressed, doer)`
* **Description:** Explicitly sets the state of a stressor and triggers its `onchangefn` if the state changes.
* **Parameters:**
  - `name` (string): Name of the stressor.
  - `stressed` (boolean or `true`): Desired stress state (`true` = stressed, `false` = calm).
  - `doer` (Entity): Entity causing the change, passed to the `onchangefn`.

### `MakeCheckpoint()`
* **Description:** Commits current stress states: counts active stressors, adds that count to `stress_points`, resets inactive stressors to stressed, and records debug data.

### `CalcFinalStressState()`
* **Description:** Computes and caches the final stress level based on accumulated `stress_points` using thresholds: ≤1 = NONE, ≤6 = LOW, ≤11 = MODERATE, else HIGH.
* **Returns:** `FARM_PLANT_STRESS.*` constant (e.g., `FARM_PLANT_STRESS.NONE`).

### `GetStressDescription(viewer)`
* **Description:** Generates a localized description string for a viewer, based on plant condition, visibility, and viewer tags.
* **Parameters:**
  - `viewer` (Entity): The entity inspecting the plant.

### `OnSave()` / `OnLoad(data)`
* **Description:** Serialize/deserialize the component state for saves. `OnLoad` merges saved data into existing fields.

### `GetDebugString()`
* **Description:** Returns a multi-line string for debugging, showing stress points, checkpoint stats, and per-stressor status.

## Events & Listeners
None.