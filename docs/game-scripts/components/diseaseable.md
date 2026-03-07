---
id: diseaseable
title: Diseaseable
description: Manages disease progression, symptoms, and transmission for entities, including timed warnings, environmental effects, and spread mechanics.
tags: [disease, ai, combat, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4964f7ba
system_scope: entity
---

# Diseaseable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Diseaseable` implements a state machine for entity disease, handling the transition from healthy → warning → diseased → spreading. It integrates with game tunings (e.g., `TUNING.DISEASE_*`) to control timing, spread radius, and chance. The component automatically manages tasks (delays, warnings, FX, spread), persists state via `OnSave`/`OnLoad`, and adds/removes tags (`diseaseable`, `diseased`) to reflect current condition.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("diseaseable")

-- Optionally set a custom callback when disease is contracted
inst.components.diseaseable:SetDiseasedFn(function(entity)
    print(entity.prefab .. " is now diseased!")
end)

-- Force immediate disease (bypasses delay/warning)
inst.components.diseaseable:Disease()
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `diseaseable` on construction; adds/removes `diseased` based on state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `diseased` | boolean | `false` | Whether the entity is currently diseased. |
| `_delaytask` | Task | `nil` | Pending delay task before warning/disease check. |
| `_warningtask` | Task | `nil` | Pending warning countdown before disease onset. |
| `_spreadtask` | Task | `nil` | Pending task to attempt disease spread. |
| `_fxtask` | Task | `nil` | Pending task to spawn disease FX (flies). |
| `onDiseasedFn` | function | `nil` | Optional callback fired when `Disease()` is called. |

## Main functions
### `Disease()`
* **Description:** Immediately transitions the entity to the diseased state, cancels pending tasks, schedules spread attempts, and spawns FX. No-op if already diseased.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early with no effect if `self.diseased` is `true`.

### `Spread()`
* **Description:** Attempts to infect one nearby `diseaseable` entity within `TUNING.DISEASE_SPREAD_RADIUS`. If successful, reschedules itself for future spread attempts.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if not diseased. If no target found, no further spread occurs until manually restarted.

### `SetDiseasedFn(fn)`
* **Description:** Registers a callback function that fires once when the entity transitions to `diseased` state.
* **Parameters:** `fn` (function) – Called with `inst` as sole argument at disease onset.
* **Returns:** Nothing.

### `IsDiseased()`
* **Description:** Returns whether the entity is currently diseased.
* **Parameters:** None.
* **Returns:** boolean – `true` if diseased, else `false`.

### `IsBecomingDiseased()`
* **Description:** Returns whether the entity is in the warning phase (warning timer active, but not yet diseased).
* **Parameters:** None.
* **Returns:** boolean – `true` if warning is pending, else `false`.

### `RestartNearbySpread()`
* **Description:** Cancels and restarts spread timers for all diseased entities within `TUNING.DISEASE_SPREAD_RADIUS`. Used to accelerate spread when disease becomes more aggressive (e.g., after Certain events).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes current state and pending timers for save/load compatibility.
* **Parameters:** None.
* **Returns:** table or `nil` – Contains keys `spreadtime`, `delaytime`, or `warningtime` with remaining seconds (or `-1` for cancelled). Returns `nil` if no active timers or disease state.

### `OnLoad(data)`
* **Description:** Restores state and pending tasks from serialized data.
* **Parameters:** `data` (table) – Result from `OnSave()`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for console/log inspection.
* **Parameters:** None.
* **Returns:** string – Formatted as `"diseased: <bool>, spreadtime: <sec>, delaytime: <sec>, warningtime: <sec>"`.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified. (Note: `ondiseased` is a hook for the class’s `_OnAddTag` system, not an event pushed via `inst:PushEvent`.)
