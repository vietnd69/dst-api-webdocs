---
id: madsciencelab
title: Madsciencelab
description: Manages a multi-stage lab-based science-generating process with stage timing and persistence support.
tags: [crafting, persistence, workflow]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b4420852
system_scope: entity
---

# Madsciencelab

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MadScienceLab` is an entity component that orchestrates a staged, timed process for generating science (e.g., for the Mad Science Lab structure). It supports progression through configurable stages, persistence across save/load cycles, and optional callbacks for game logic integration. The component itself is lightweight and state-driven, relying on scheduled tasks (`DoTaskInTime`) to advance stages.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("madsciencelab")

-- Define stage durations in seconds
inst.components.madsciencelab.stages = {
    { time = 5 },
    { time = 5 },
    { time = 5 }
}

inst.components.madsciencelab.OnScienceWasMade = function(ent, product)
    print("Science produced:", product)
end

inst.components.madsciencelab:StartMakingScience("science", "Rocket Science")
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (see constructor) | The entity instance that owns this component. |
| `task` | `Task` or `nil` | `nil` | The current scheduled task controlling stage timing. |
| `product` | `any` or `nil` | `nil` | The result to emit upon final stage completion. |
| `name` | `string` or `nil` | `nil` | Optional name for the recipe or process. |
| `stages` | `table` | `{}` | Array of stage definitions; each entry is a table (typically containing `time` in seconds). |
| `stage` | `number` | *(internal)* | Current stage index (1-based). |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up active task and resets state when component is removed from an entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsMakingScience()`
* **Description:** Reports whether a science-making task is currently active.
* **Parameters:** None.
* **Returns:** `true` if `task` is non-nil; otherwise `false`.

### `SetStage(stage, time_override)`
* **Description:** Advances the process to a given stage. If the stage is beyond the defined `stages` array, finalizes production. Otherwise schedules the next stage transition.
* **Parameters:**
  * `stage` (number) — the 1-based stage index to transition to.
  * `time_override` (number or `nil`) — custom time remaining in seconds to use for rescheduling. Used during save/load restoration.
* **Returns:** Nothing.
* **Error states:** If `stage` exceeds `#self.stages`, the product is finalized, the task is canceled, and the optional callback `OnScienceWasMade` is invoked.

### `StartMakingScience(product, name)`
* **Description:** Begins the science-making process at stage 1 with a specified product output.
* **Parameters:**
  * `product` (any) — the result to produce when all stages complete.
  * `name` (string or `nil`) — optional string identifier for the recipe or process.
* **Returns:** Nothing.
* **Side effects:** Invokes `OnStartMakingScience` callback (if defined) and triggers `SetStage(1)`.

### `OnSave()`
* **Description:** Serializes the component state for save file persistence.
* **Parameters:** None.
* **Returns:** A table containing:
  * `name` (`string` or `nil`)
  * `product` (`any`)
  * `stage` (`number`)
  * `time_remaining` (`number` or `nil`) — remaining time of the active task, if any.

### `OnLoad(data)`
* **Description:** Restores component state from a saved data table (typically during world load). Only active if `time_remaining` is present.
* **Parameters:**
  * `data` (table or `nil`) — saved state data from `OnSave()`.
* **Returns:** Nothing.
* **Error states:** No-op if `data` is `nil` or `data.time_remaining` is missing.

### `GetDebugString()`
* **Description:** Returns a human-readable string for debugging UI.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Inactive"` or `"Making Science: science. Stage: 2 done in 3.5s."`

### `LongUpdate(dt)`
* **Description:** Placeholder method included for interface compatibility. Currently has no effect.
* **Parameters:** `dt` (number) — elapsed time since last update.
* **Returns:** Nothing.

## Events & listeners
This component does not register or emit any events via `inst:ListenForEvent` or `inst:PushEvent`. Instead, it uses optional callback functions attached as properties (e.g., `OnStartMakingScience`, `OnStageStarted`, `OnScienceWasMade`) for logic hooks.
