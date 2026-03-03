---
id: frostybreather
title: Frostybreather
description: Manages visual frost breath effects based on environmental temperature and entity state.
tags: [environment, fx, visual]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6a2e3a02
system_scope: environment
---

# Frostybreather

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Frostybreather` is a component that controls the display of frost breath visual effects on an entity. It automatically triggers the effect when the local temperature is at or below `TUNING.FROSTY_BREATH`, and stops it when the temperature rises above that threshold. The component supports manual overrides (`ForceBreathOn`/`ForceBreathOff`), custom emission positioning via offset or function, and network synchronization of breath events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("frostybreather")
-- Breath activates automatically when temperature <= TUNING.FROSTY_BREATH
inst.components.frostybreather:ForceBreathOn()  -- Force breath to be always visible
inst.components.frostybreather:SetOffset(0, 1, 0)  -- Adjust visual position
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in constructor) | Reference to the entity the component is attached to. |
| `breath` | `Entity?` | `nil` | Reference to the spawned `frostbreath` prefab instance. |
| `offset` | `Vector3` | `Vector3(0,0,0)` | Static offset applied to breath particle position. |
| `offset_fn` | `function?` | `nil` | Optional function returning dynamic offset: `fn(inst) → Vector3`. |
| `enabled` | boolean | `true` | Controls whether listeners are active; independent of breath visibility. |
| `forced_breath` | boolean | `false` | When `true`, overrides temperature-based breathing logic. |

## Main functions
### `StartBreath()`
*   **Description:** Spawns and attaches the `frostbreath` prefab if not already active, and starts listening for events if `enabled` is `true`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopBreath()`
*   **Description:** Removes and destroys the `frostbreath` prefab if active, and stops event listeners if `enabled` is `true`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Enable()`
*   **Description:** Enables the component’s event listeners. Does *not* spawn breath — use `StartBreath()` explicitly if needed.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Disable()`
*   **Description:** Disables the component’s event listeners. Does *not* stop breath — use `StopBreath()` explicitly if needed.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnTemperatureChanged(temperature)`
*   **Description:** Updates breath state based on current temperature and `forced_breath` flag. Stops breath if `temperature > TUNING.FROSTY_BREATH`; otherwise starts it.
*   **Parameters:** `temperature` (number) — The current world/local temperature.
*   **Returns:** Nothing.
*   **Error states:** No-op if `forced_breath` is `true`.

### `EmitOnce()`
*   **Description:** Triggers one breath emission (particle effect) on the `frostbreath` instance, but only if facing *not* upward (up, upright, or upleft). Sets particle position using `GetOffset()` before emitting.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ForceBreathOn()`
*   **Description:** Forces breath to remain always visible, ignoring temperature changes. Calls `StartBreath()` if not already active.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ForceBreathOff()`
*   **Description:** Clears forced state and re-evaluates breath based on current temperature. Calls `OnTemperatureChanged()` internally.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetOffset(x, y, z)`
*   **Description:** Sets the static offset used to position the frost breath relative to the entity.
*   **Parameters:** `x`, `y`, `z` (number) — Components of the offset vector.
*   **Returns:** Nothing.

### `SetOffsetFn(fn)`
*   **Description:** Sets a callback function used to compute the dynamic offset each frame. Takes `inst` as input; must return a `Vector3`.
*   **Parameters:** `fn` (function) — Signature: `fn(Entity) → Vector3`.
*   **Returns:** Nothing.

### `GetOffset()`
*   **Description:** Returns the current effective offset: uses `offset_fn` if set, otherwise falls back to `offset`.
*   **Parameters:** None.
*   **Returns:** `Vector3` — The computed offset for breath position.

## Events & listeners
- **Listens to:**  
  - `animover` (server-only) — Triggers a breath event when animation finishes and entity is idle.  
  - `frostybreather.breathevent` (client-only) — Triggers one emission when broadcast from server.  
- **Pushes:**  
  - `frostybreather.breathevent` — Networked event used to synchronize breath emission from server to clients.
