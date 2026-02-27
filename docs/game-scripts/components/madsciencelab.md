---
id: madsciencelab
title: Madsciencelab
description: Manages the step-by-step progression and state of a science-related crafting task in a lab structure.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: crafting
source_hash: b4420852
---

# Madsciencelab

## Overview
This component implements a multi-stage crafting system for science-related experiments, where a lab structure progresses through discrete stages over time until a science product is produced. It tracks the current stage, manages timed transitions, and handles save/load and cleanup logic.

## Dependencies & Tags
- **Component**: Relies on `inst:DoTaskInTime()` and `GetTaskRemaining()` — core engine task management utilities.
- **No explicit components** are added (e.g., no `health`, `inventory`, etc.) — it operates on a generic entity.
- **No tags** are assigned or removed.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set via constructor) | Reference to the owning entity (typically a lab structure). |
| `task` | `Task?` | `nil` | Active timer task for the current stage; `nil` when idle. |
| `product` | `string|nil` | `nil` | Identifier for the science product being crafted. |
| `name` | `string|nil` | `nil` | Optional human-readable name of the recipe. |
| `stages` | `table` | `{}` | Array of stage definitions (expected to contain `time` fields). Initialized empty. |
| `stage` | `number` | *(implicit)* | Current stage index (1-based). Starts at 1 in `StartMakingScience`. |

> Note: The `stage` property is not explicitly initialized in `_ctor` but is written in `SetStage`.

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Cleanly cancels any active crafting task when the component is removed from the entity.
* **Parameters:** None.

### `IsMakingScience()`
* **Description:** Returns whether the lab is currently in the process of crafting.
* **Parameters:** None.  
* **Returns:** `true` if `self.task ~= nil`, otherwise `false`.

### `SetStage(stage, time_override)`
* **Description:** Advances the crafting to the specified stage. If beyond the last stage, finishes the craft and triggers product completion callbacks. Otherwise, schedules the next stage transition.
* **Parameters:**  
  - `stage` (`number`): Target stage index (1-based).  
  - `time_override` (`number?`): Optional remaining time for the task — used during save/load to restore exact timing.

### `StartMakingScience(product, name)`
* **Description:** Initiates a new crafting sequence with the given product identifier and optional recipe name. Starts at stage 1.
* **Parameters:**  
  - `product` (`string`): Identifier of the science product to produce (e.g., `"mecha"`).  
  - `name` (`string?`): Optional human-readable recipe name for debugging/log display.

### `OnSave()`
* **Description:** Serializes the current state for saving. Excludes the `stages` table (assumed static).
* **Parameters:** None.  
* **Returns:** A table containing: `name`, `product`, `stage`, and `time_remaining` (if a task is active).

### `OnLoad(data)`
* **Description:** Restores the crafting state from a saved `data` table. Only proceeds if `time_remaining` is present (indicating an active craft).
* **Parameters:**  
  - `data` (`table?`): The saved state, typically returned by `OnSave()`.

### `GetDebugString()`
* **Description:** Returns a human-readable string for debugging, describing the current state and progress.
* **Parameters:** None.  
* **Returns:** `"Inactive"` if no task; otherwise `"Making Science: <product>. Stage: <stage> done in <X>s."`.

### `LongUpdate(dt)`
* **Description:** Placeholder — currently unimplemented and unused.

## Events & Listeners
- **Listens for:** None.
- **Triggers events via callbacks (if set on the component instance):**
  - `self.OnStartMakingScience(self.inst)` — Called once per craft sequence upon starting.
  - `self.OnStageStarted(self.inst, self.stage)` — Called when a new stage begins (including the first).
  - `self.OnScienceWasMade(self.inst, result)` — Called when the final stage completes and the product is finalized.