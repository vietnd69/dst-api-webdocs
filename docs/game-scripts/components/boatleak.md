---
id: boatleak
title: Boatleak
description: Manages visual, audio, and state transitions for boat leaks and repairs in DST, including plugged/unplugged states, repair timers, and integration with HullHealth for dynamic leak tracking.
tags: [boat, water, repair, visual, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 92694d8d
system_scope: entity
---

# Boatleak

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatLeak` manages the lifecycle and behavior of boat leaks, including small and medium leak states, plugged states, and repaired states. It controls animation, sound effects, and integration with the `boatpatch`, `repairable`, `hullhealth`, and `repairer` systems. It also supports dynamic leaks (e.g., from cookie cutters) with full save/load compatibility, and repairs with optional timeout-based degradation (e.g., kelp patches).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("boatleak")
inst:AddTag("boat_leak")

-- Set initial leak state
inst.components.boatleak:SetState("small_leak")

-- Apply a repair patch
local patch = SpawnPrefab("boat_patch_small")
if patch then
    inst.components.boatleak:Repair(player, patch)
end
```

## Dependencies & tags
**Components used:** `boatpatch`, `hullhealth`, `repairable`, `repairer`, `stackable`  
**Tags:** Adds `boat_leak` or `boat_repaired_patch`; removes them during state transitions.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity this component owns. |
| `has_leaks` | boolean | `false` | Whether the entity currently has any active (unplugged) leaks. |
| `leak_build` | string | `"boat_leak_build"` | Build asset to use for leak animations. |
| `leak_build_override` | string? | `nil` | Optional override build for custom leak visuals. |
| `isdynamic` | boolean | `false` | Whether the leak is dynamically spawned (e.g., by cookie cutter); affects save/load behavior. |
| `current_state` | string? | `nil` | Current internal state (e.g., `"small_leak"`, `"med_leak_plugged"`, `"repaired_treegrowth"`). |
| `_repaired_timeout_task` | `Task?` | `nil` | Task tracking the timeout before a repaired patch degrades to `"med_leak"`. |
| `boat` | `Entity?` | `nil` | Reference to the parent boat entity, used to inherit `leak_build` settings. |

## Main functions
### `Repair(doer, patch_item)`
*   **Description:** Repairs a leak using the provided patch item. Validates the patch type, consumes the patch, and transitions the leak to a repaired state.
*   **Parameters:** `doer` (`Entity?`) - the entity performing the repair; `patch_item` (`Entity`) - the repair patch being used.
*   **Returns:** `true` if repair was initiated; `false` if the entity is not a leak (`not HasTag("boat_leak")`).
*   **Error states:** Returns `false` early if `patch_item` fails repair (e.g., invalid patch or no `repairer` component). Consumes the patch item regardless.

### `ChangeToRepaired(repair_build_name, sndoverride)`
*   **Description:** Transitions the leak to a permanently repaired state, removing the `boat_leak` tag and adding `boat_repaired_patch`. Handles visual/animation changes and sound playback.
*   **Parameters:** `repair_build_name` (`string`) - asset build name for the repaired state; `sndoverride` (`string?`) - optional sound override.
*   **Returns:** Nothing.
*   **Error states:** Kills `"small_leak"` and `"med_leak"` sounds; sets `has_leaks = false`; calls optional `onrepairedleak` callback.

### `SetRepairedTime(time)`
*   **Description:** Schedules a timeout task that degrades a repaired patch back to `"med_leak"` after `time` seconds.
*   **Parameters:** `time` (`number`) - seconds until degradation.
*   **Returns:** Nothing.

### `GetRemainingRepairedTime()`
*   **Description:** Returns the remaining time (in seconds) until the repair degrades, or `nil` if no timeout is scheduled.
*   **Returns:** `number?`

### `SetPlugged(setting)`
*   **Description:** Toggles between plugged/unplugged states (e.g., `"small_leak"` ↔ `"small_leak_plugged"`).
*   **Parameters:** `setting` (`boolean?`) — `true`/`false` to plug/unplug, or omitted to toggle based on current state.
*   **Returns:** Nothing.

### `SetState(state, skip_open)`
*   **Description:** Directly sets the leak’s state and updates animations, sounds, tags, and callbacks.
*   **Parameters:** `state` (`string`) — one of: `"small_leak"`, `"small_leak_plugged"`, `"med_leak"`, `"med_leak_plugged"`, `"repaired"`, `"repaired_tape"`, `"repaired_treegrowth"`, `"repaired_kelp"`; `skip_open` (`boolean?`) — if `true`, skips initial animation delay for immediate visual sync.
*   **Returns:** Nothing.

### `SetBoat(boat)`
*   **Description:** Links the leak to its parent boat entity and inherits `leak_build` / `leak_build_override` settings.
*   **Parameters:** `boat` (`Entity`)
*   **Returns:** Nothing.

### `IsFinishedSpawning()`
*   **Description:** Checks if dynamic leak animations have fully initialized (for sync with worldgen/saving).
*   **Returns:** `true` if the current animation is `"leak_small_loop"` or `"leak_med_loop"` (for their respective states), or `true` for non-leak states.

### `OnSave(data)`
*   **Description:** Serializes dynamic leak state and remaining repair timeout for persistence.
*   **Returns:** `{ leak_state = string, repaired_timeout = number? }` if `isdynamic`; `nil` otherwise.

### `OnLoad(data)`
*   **Description:** Restores dynamic leak state and reschedules repair timeout on load; ensures leak is added to `hullhealth.leak_indicators_dynamic`.
*   **Parameters:** `data` (`table?`) — saved data from `OnSave`.
*   **Returns:** Nothing.

### `LongUpdate(dt)`
*   **Description:** Periodically checks and updates the repair timeout task (used on the server for dynamic leaks).
*   **Parameters:** `dt` (`number`) — elapsed time since last frame.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"animover"` — only for `"repaired_treegrowth"` state, to transition to `"idle"` and remove the entity once animation completes.
- **Pushes:** None.
