---
id: snowballmelting
title: Snowballmelting
description: Tracks ambient temperature and manages melting state transitions for entities like snowballs in response to environmental conditions and snow cover.
tags: [environment, weather, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2a7f6b6a
system_scope: environment
---

# Snowballmelting

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SnowballMelting` is a state-tracking component that monitors ambient temperature and snow cover to determine whether an entity should be in `solid`, `melting`, or transitioning states. It periodically checks the world temperature at the entity’s location and watches for changes in the `issnowcovered` world state. When conditions change, it triggers optional callback functions to handle start, continuous, and stop melting logic.

This component is typically added to physics-based or environmental prefabs such as snowballs, ice blocks, or other temperature-sensitive objects. It does not modify physics or visual properties itself but delegates those actions through callback hooks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("snowballmelting")
inst.components.snowballmelting:SetOnStartMelting(function(inst)
    print("Started melting!")
end)
inst.components.snowballmelting:SetOnDoMeltAction(function(inst)
    print("Melting in progress...")
end)
inst.components.snowballmelting:SetOnStopMelting(function(inst)
    print("Melting stopped.")
end)
inst.components.snowballmelting:AllowMelting()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `issnowcovered` world state; no tags added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `state` | string | `"solid"` | Current melting state: `"solid"` or `"melting"`. |
| `temperaturechecktask` | task? | `nil` | Scheduled task to recheck temperature periodically. |
| `temperaturecheckinittask` | task? | `nil` | Initial task to check melting condition immediately. |
| `watchingissnowcovered` | boolean? | `nil` | Whether the component is currently watching the `issnowcovered` world state. |

## Main functions
### `ShouldMelt()`
* **Description:** Determines whether the ambient temperature at the entity’s position indicates melting conditions (temperature `> 0`).
* **Parameters:** None.
* **Returns:** `true` if the entity should melt, `false` otherwise.

### `CheckTemperature()`
* **Description:** Performs the full temperature and snow-cover check, updating the `state` and invoking callbacks as needed. Automatically schedules the next temperature check and handles the `issnowcovered` listener.
* **Parameters:** None (called via bridge functions).
* **Returns:** Nothing.
* **Error states:** No explicit error handling; relies on `self.inst:IsValid()` before rescheduling.

### `CheckStartMelting()`
* **Description:** Quick check to see if the entity should begin melting; only transitions from `solid` to `melting` if `ShouldMelt()` returns `true`.
* **Parameters:** None.
* **Returns:** Nothing.

### `AllowMelting()`
* **Description:** Initializes and resumes the melting check loop. Cancels any pending tasks and schedules fresh ones for periodic checks and initial evaluation.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopMelting()`
* **Description:** Immediately halts all melting behavior: cancels pending tasks, stops watching the `issnowcovered` world state, and forces `state` to `"solid"`, invoking the stop callback if defined.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetOnStartMelting(fn)`
* **Description:** Registers a callback triggered once when the state transitions to `"melting"`.
* **Parameters:** `fn` (function) - callback receiving `inst` as argument.
* **Returns:** Nothing.

### `SetOnDoMeltAction(fn)`
* **Description:** Registers a callback invoked repeatedly while the state remains `"melting"` and checks are run.
* **Parameters:** `fn` (function) - callback receiving `inst` as argument.
* **Returns:** Nothing.

### `SetOnStopMelting(fn)`
* **Description:** Registers a callback triggered when the state transitions back to `"solid"`.
* **Parameters:** `fn` (function) - callback receiving `inst` as argument.
* **Returns:** Nothing.

### `OnRemoveEntity()`
* **Description:** Cleanup method called when the entity is removed from the world. Ensures all tasks and listeners are canceled and stopped.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string summarizing the component’s current state and task status.
* **Parameters:** None.
* **Returns:** string - formatted as `"Melt timer: X.X, watching snow: 0/1, state: Y"`, where `X.X` is remaining time and `Y` is `"solid"` or `"melting"`.

## Events & listeners
- **Listens to:** `issnowcovered` world state via `inst:WatchWorldState("issnowcovered", ...)` — only when snow cover is active.
- **Pushes:** No events pushed; communicates via optional callback functions only.
