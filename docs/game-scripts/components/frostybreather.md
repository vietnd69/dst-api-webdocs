---
id: frostybreather
title: Frostybreather
description: Manages the conditional appearance and emission of frost breath effects on an entity based on ambient temperature and animation states.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 6a2e3a02
---

# Frostybreather

## Overview
This component dynamically controls the activation and visual emission of frost breath effects (via the `frostbreath` prefab) for an entity. It monitors the local temperature and automatically toggles the breath effect when the temperature drops below the configured `TUNING.FROSTY_BREATH` threshold, unless overridden by forced states. It also handles synchronization between server and clients through network events.

## Dependencies & Tags
- Relies on `TheWorld.state.temperature` (via `WatchWorldState`).
- Adds a child prefab: `frostbreath`.
- Uses the network event `"frostybreather.breathevent"` for client-server coordination.
- No explicit tags are added or removed by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | The entity this component is attached to. |
| `breath` | `PrefabInstance` | `nil` | Reference to the spawned `frostbreath` entity. |
| `offset` | `Vector3` | `Vector3(0, 0, 0)` | Static positional offset for the breath effect. |
| `offset_fn` | `function` or `nil` | `nil` | Optional callback returning a dynamic `Vector3` offset. |
| `enabled` | `boolean` | `true` | Controls whether the breath effect responds to temperature and animation events. |
| `forced_breath` | `boolean` | `false` | If `true`, overrides temperature-based activation (forces breath on). |
| `breathevent` | `net_event` | Network event instance | Custom network event used to trigger breath emission on clients. |

## Main Functions

### `StartBreath()`
* **Description:** Spawns and attaches the `frostbreath` prefab as a child of the entity, positions it using `GetOffset()`, and (if enabled) registers animation/network listeners for breath emission.
* **Parameters:** None.

### `StopBreath()`
* **Description:** Removes the `frostbreath` child entity (if present) and detaches associated listeners.
* **Parameters:** None.

### `Enable()`
* **Description:** Sets `enabled` to `true` and re-registers listeners (if breath is active), restoring normal behavior.
* **Parameters:** None.

### `Disable()`
* **Description:** Sets `enabled` to `false` and removes listeners (if breath is active), halting automatic breath emission.
* **Parameters:** None.

### `OnTemperatureChanged(temperature)`
* **Description:** Compares the local temperature to `TUNING.FROSTY_BREATH`. If not forced, starts or stops breath based on whether the temperature is below the threshold.
* **Parameters:**
  * `temperature`: `number` — The current world/local temperature value.

### `EmitOnce()`
* **Description:** Triggers a single breath emission *only* if the entity is not facing upward, upward-left, or upward-right (to avoid visual clipping). Positions the breath effect before calling `Emit()` on the `frostbreath` instance.
* **Parameters:** None.

### `ForceBreathOn()`
* **Description:** Overrides temperature logic to permanently enable the breath effect until `ForceBreathOff()` is called.
* **Parameters:** None.

### `ForceBreathOff()`
* **Description:** Disables forced mode and re-evaluates temperature to resume normal activation/deactivation logic.
* **Parameters:** None.

### `SetOffset(x, y, z)`
* **Description:** Sets the static `offset` vector for breath positioning.
* **Parameters:**
  * `x`, `y`, `z`: `number` — The new offset coordinates.

### `SetOffsetFn(fn)`
* **Description:** Assigns a dynamic callback function to compute the breath offset per-frame (useful for animated offsets).
* **Parameters:**
  * `fn`: `function(entity) → Vector3` — Function that returns a `Vector3` offset based on the entity instance.

### `GetOffset()`
* **Description:** Returns the current offset: either the dynamic value from `offset_fn` (if set), or the static `offset` vector.
* **Parameters:** None.

## Events & Listeners

- **Listens for:**
  - `"animover"` (server only): Triggers `EmitOnce()` when animation completes during an idle state.
  - `"frostybreather.breathevent"` (clients only): Triggers `EmitOnce()` upon receiving the network event from the server.

- **Emits:**
  - `"frostybreather.breathevent"`: Network event pushed after `animover` on the server to synchronize client-side emission.