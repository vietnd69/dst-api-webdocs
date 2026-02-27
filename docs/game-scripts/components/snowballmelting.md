---
id: snowballmelting
title: Snowballmelting
description: Manages the melting behavior of snowball entities based on ambient temperature and snow coverage conditions in the world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 2a7f6b6a
---

# Snowballmelting

## Overview
This component handles the dynamic melting logic for snowball entities in the game. It monitors ambient temperature (via `GetTemperatureAtXZ`) and snow cover state (`issnowcovered`), transitioning the snowball between `solid` and `melting` states. It uses periodic timers to recheck environmental conditions and supports configurable callbacks for when melting starts, continues, or stops. Melting ceases immediately if the entity is removed.

## Dependencies & Tags
- Relies on `Transform` component to access world position (`self.inst.Transform:GetWorldPosition()`).
- Uses `TheWorld.state.issnowcovered` world state for snow coverage detection.
- Attaches and detaches a world state watcher (`issnowcovered`) via `inst:WatchWorldState` and `inst:StopWatchingWorldState`.
- Manages delayed tasks using `inst:DoTaskInTime`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owner entity. |
| `state` | `string` | `"solid"` | Current melting state: `"solid"` or `"melting"`. |
| `temperaturechecktask` | `Task?` | `nil` | Task scheduling future temperature checks. |
| `temperaturecheckinittask` | `Task?` | `nil` | Task scheduling immediate initial melting check. |
| `watchingissnowcovered` | `boolean?` | `nil` | Flag indicating whether the component currently listens to `issnowcovered` world state changes. |
| `ondomeltaction` | `function?` | `nil` | Callback invoked each tick while melting (if state is already `"melting"`). |
| `onstartmelting` | `function?` | `nil` | Callback invoked once when state transitions to `"melting"`. |
| `onstopmelting` | `function?` | `nil` | Callback invoked once when state transitions to `"solid"`. |

## Main Functions

### `ShouldMelt()`
* **Description:** Determines if the snowball *should* be melting based solely on ambient temperature at its position. Returns `true` if temperature > 0°C.
* **Parameters:** None.

### `CheckTemperature()`
* **Description:** The core loop for evaluating and updating the snowball’s melting state. Handles:
  - Snow cover override: if `issnowcovered` is `true`, forces `"solid"` state and begins watching snow state changes.
  - Temperature-based melting: if no snow cover, checks if `ShouldMelt()` is `true`.
  - Triggers callbacks (`onstartmelting`, `ondomeltaction`, `onstopmelting`) as appropriate.
  - Schedules the next `CheckTemperature` call with randomized delay (base ± variance).
* **Parameters:** None (called via bridge functions from scheduled tasks).

### `CheckStartMelting()`
* **Description:** A lightweight, one-time check to start melting *if* conditions permit (i.e., not already melting and ambient temperature > 0°C). Does *not* schedule further checks or handle snow coverage.
* **Parameters:** None.

### `AllowMelting()`
* **Description:** Enables melting monitoring by resetting/canceling pending tasks and starting both an immediate check and scheduled temperature checks. Used to reinitialize melting after pause/stop.
* **Parameters:** None.

### `StopMelting()`
* **Description:** Halts all melting activity: cancels scheduled tasks, stops watching snow coverage, and forces state to `"solid"` (triggering `onstopmelting` if state changed).
* **Parameters:** None.

### `SetOnStartMelting(fn)`
* **Description:** Registers a callback to be executed when the snowball first begins melting (i.e., state changes to `"melting"`).
* **Parameters:** `fn` — Function called with `inst` as the sole argument.

### `SetOnDoMeltAction(fn)`
* **Description:** Registers a callback to be invoked each time `CheckTemperature()` runs *while* the snowball is in `"melting"` state (i.e., repeated action during melting).
* **Parameters:** `fn` — Function called with `inst` as the sole argument.

### `SetOnStopMelting(fn)`
* **Description:** Registers a callback to be executed when the snowball stops melting (i.e., state changes back to `"solid"`).
* **Parameters:** `fn` — Function called with `inst` as the sole argument.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string with current timer status, snow observation state, and melting state.
* **Parameters:** None.

## Events & Listeners
- **Listens to:**
  - `"issnowcovered"` world state change via `inst:WatchWorldState("issnowcovered", ...)`, triggering `CheckTemperature_Bridge`.
- **Triggers (via callbacks):**
  - `onstartmelting(self.inst)` — When state transitions to `"melting"`.
  - `ondomeltaction(self.inst)` — Each iteration while in `"melting"` state.
  - `onstopmelting(self.inst)` — When state transitions to `"solid"` (e.g., via `CheckTemperature`, `StopMelting`, or `OnRemoveEntity`).
- **Component lifecycle event:**
  - Calls `StopMelting()` when the entity is removed (`OnRemoveEntity`).