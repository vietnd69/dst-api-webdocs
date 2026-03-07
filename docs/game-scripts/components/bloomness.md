---
id: bloomness
title: Bloomness
description: Manages the growth stage and bloom progression of a plant entity, including timer-based progression, fertilization effects, and rate calculation.
tags: [plant, growth, progress, stage]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e713ace7
system_scope: entity
---

# Bloomness

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Bloomness` tracks and controls the developmental lifecycle of a plant entity through discrete growth stages, culminating in a final "bloom" state. It uses a timer-based system with configurable durations per stage, supports fertilization to extend bloom duration or accelerate progression, and integrates with the entity's update loop. The component calculates and maintains a dynamic bloom rate via optional callback functions and persists state across saves/load cycles.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("bloomness")
inst.components.bloomness:SetDurations(15, 30) -- stage = 15s, full bloom = 30s
inst.components.bloomness.onlevelchangedfn = function(inst, level) print("Stage:", level) end
inst.components.bloomness:Fertilize(5) -- extends timer based on current stage
inst.components.bloomness:SetLevel(1)  -- start growing
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `blooming` tag when `is_blooming` is true (via `inst:HasTag("blooming")` — inferred by pattern, not directly used in this component).  
The component is self-contained and does not require or directly interact with other components.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | number | `3` | Maximum growth stage index (inclusive), defining total stages (`0` = seed, `1..max` = progressive, `max` = bloom). |
| `level` | number | `0` | Current growth stage (integer ≥ `0`, ≤ `max`). |
| `is_blooming` | boolean | `false` | Whether the plant is currently in bloom progression (moving toward next stage). |
| `timer` | number | `0` | Remaining time (scaled by `rate`) until next stage change. |
| `rate` | number | `1` | Multiplier affecting how fast `timer` decreases (`dt * rate`). |
| `stage_duration` | number | `0` | Duration (seconds) to spend at each intermediate stage. |
| `full_bloom_duration` | number | `0` | Duration (seconds) to spend at the final (bloom) stage. |
| `fertilizer` | number | `0` | Accumulated fertilizer value applied (used in rate calculations). |
| `calcratefn` | function | `nil` | Optional callback `(inst, level, is_blooming, fertilizer)` → number to compute `rate`. |
| `calcfullbloomdurationfn` | function | `nil` | Optional callback `(inst, value, timer, base_duration)` → number to compute extended bloom time on fertilize. |
| `onlevelchangedfn` | function | `nil` | Callback `(inst, level)` triggered after each `SetLevel` call. |

## Main functions
### `SetLevel(level)`
* **Description:** Sets the growth stage to `level`, resetting timers and update behavior accordingly. Stages progress sequentially (0 → 1 → … → `max`); fertilization has no effect at `level = 0`.
* **Parameters:** `level` (number) - Target growth stage index (clamped to `≤ max`). Passing the current `level` has no effect.
* **Returns:** Nothing.
* **Error states:** Returns early without changes if `level` equals `self.level`. When setting to `max`, `timer` is incremented (not reset). For any transition *from* `level = 0`, the component begins updating via `inst:StartUpdatingComponent(self)`.

### `SetDurations(stage, full)`
* **Description:** Configures the base durations (in seconds) for intermediate and final bloom stages.
* **Parameters:**  
  - `stage` (number) - Duration to remain at each non-bloom stage (e.g., `10`).  
  - `full` (number) - Duration to remain at the final bloom stage (e.g., `20`).  
* **Returns:** Nothing.

### `Fertilize(value)`
* **Description:** Applies fertilizer to extend the current timer or advance progression. At full bloom, it extends `timer` by a calculated amount. Otherwise, it may start growth (`level = 1`), enter bloom (`is_blooming = true`), and accumulate fertilizer.
* **Parameters:** `value` (number, optional) - Fertilizer amount to apply (defaults to `0`). Ignored if `≤ 0` in some contexts, but no explicit validation.
* **Returns:** Nothing.
* **Error states:**  
  - If `level = max`, `timer` is extended by the optional `calcfullbloomdurationfn` callback.  
  - If `level = 0`, calling this implicitly calls `SetLevel(1)`.  
  - No failure paths — always updates `fertilizer` and `rate`.

### `UpdateRate()`
* **Description:** Recomputes `rate` based on current state and optional callbacks. Always sets `rate = 1` if no callback is defined. Active only when `level > 0`.
* **Parameters:** None.  
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called each frame during active update (when `level > 0`). Decrements `timer` by `dt * rate`. When `timer ≤ 0`, advances or regresses the stage.
* **Parameters:** `dt` (number) - Delta time in seconds.  
* **Returns:** Nothing.  
* **Error states:** When regressing to `level = 0`, stops updating and resets `timer = 0`.

### `OnLoad(data)`
* **Description:** Restores component state from saved data. Starts/continues updating if `level > 0`.
* **Parameters:** `data` (table | nil) - Saved state table (contains `level`, `timer`, `rate`, `is_blooming`, `fertilizer`).  
* **Returns:** Nothing.  
* **Error states:** If `data = nil`, no state is applied. Missing keys default to `0`/`1`/`false` as indicated.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging/logs.
* **Parameters:** None.  
* **Returns:** (string) - Example: `"L: 2, B: true, T: 5.30 (x1.25)"`.

### `OnSave()`
* **Description:** Returns the component’s state for persistence, or `nil` if inactive (`level = 0`).
* **Parameters:** None.  
* **Returns:** (table | nil) - Save table `{ level, timer, rate, is_blooming, fertilizer }` or `nil`.

### `LongUpdate(dt)`
* **Description:** Wrapper for `OnUpdate` that only calls it if `timer > 0`. May be used for throttled updates.
* **Parameters:** `dt` (number).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  

(No `inst:ListenForEvent` or `inst:PushEvent` calls are present in the component.)
