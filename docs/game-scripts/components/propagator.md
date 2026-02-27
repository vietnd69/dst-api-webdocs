---
id: propagator
title: Propagator
description: Manages heat transfer, propagation, and fire-related effects for entities in the game world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 63c70e54
---

# Propagator

## Overview
The Propagator component handles heat accumulation, decay, and spatial propagation for entities (e.g., fires), including interactions with nearby objects such as melting frozen items, damaging entities, and cooling adjacent heat acceptors. It operates as a periodic task that updates heat levels and triggers effects within a configurable range.

## Dependencies & Tags
- **Components used:**  
  - `Transform` (via `GetWorldPosition`)  
  - `heater` (for endothermic check)  
  - `burnable` (for controlled burn state check)  
  - `freezable` (for coldness application)  
  - `health` (for fire damage)  
- **Tags manipulated:**  
  - Removes/Checks `firemelt`, `frozen`, `INLIMBO`, `fireimmune`  
- **No components added by this component itself.**

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity. |
| `flashpoint` | `number` | `100` | Heat threshold at which the propagator "flashes" (ignites or triggers side effects). |
| `currentheat` | `number` | `0` | Current accumulated heat on the entity. |
| `decayrate` | `number` | `1` | Rate at which heat decays per second when not spreading. |
| `propagaterange` | `number` | `3` | Maximum distance (world units) to propagate heat to adjacent entities/tiles. |
| `heatoutput` | `number` | `5` | Heat amount transferred per second to adjacent heat-accepting entities. |
| `damages` | `boolean` | `false` | Whether the propagator deals fire damage to entities in range. |
| `damagerange` | `number` | `3` | Radius within which fire damage is applied. |
| `pvp_damagemod` | `number` | `TUNING.PVP_DAMAGE_MOD or 1` | Damage multiplier applied when the heat source is a player. |
| `acceptsheat` | `boolean` | `false` | Whether this entity can receive heat from propagators. |
| `spreading` | `boolean` | `false` | Whether the propagator is actively spreading heat. |
| `source` | `Entity?` | `nil` | Reference to the entity that caused this propagator to ignite/spread (for traceability). |
| `onflashpoint` | `function?` | `nil` | Callback executed when `currentheat > flashpoint`. |
| `pauseheating` | `boolean?` | `nil` | Internal flag preventing further heat addition after flashpoint. |
| `heat_this_update` | `number` | `0` | Heat accumulated in the current update window. |
| `max_heat_this_update` | `number` | `0` | Max allowable heat per update (dynamically calculated via `CalculateHeatCap`). |
| `delay` | `Task?` | `nil` | Active delay timer (used for temporary heat block). |
| `task` | `PeriodicTask?` | `nil` | Active update task scheduled at `PROPAGATOR_DT` intervals. |

## Main Functions

### `CalculateHeatCap()`
* **Description:** Recalculates the maximum heat that can be added during the current update cycle using a randomized ease-out cubic factor and `PROPAGATOR_DT`. Resets `heat_this_update` to zero.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleanup when component is removed from an entity. Stops spreading, forces one last update, and cancels any pending delay task.
* **Parameters:** None.

### `OnRemoveEntity()`
* **Description:** When the entity is fully removed from the world, stops fire-melting effects on nearby entities (if not endothermic). Pushes `"stopfiremelt"` and removes `"firemelt"` tag from affected entities.
* **Parameters:** None.

### `SetOnFlashPoint(fn)`
* **Description:** Assigns a callback function to be invoked when `currentheat` exceeds `flashpoint`.
* **Parameters:**  
  - `fn`: `function(self)` — Callback accepting the propagator instance as argument.

### `Delay(time)`
* **Description:** Sets a delay during which heat addition is blocked. Cancels any existing delay before creating a new one.
* **Parameters:**  
  - `time`: `number` — Duration (in seconds) for the delay.

### `StopUpdating()`
* **Description:** Cancels the periodic update task and recalculates heat capacity (resetting per-update limits).
* **Parameters:** None.

### `StartUpdating()`
* **Description:** Starts the periodic update task (`PROPAGATOR_DT` interval) to process heat decay and propagation logic. Skips if already running.
* **Parameters:** None.

### `StartSpreading(source)`
* **Description:** Begins heat propagation from this entity. Sets `spreading = true` and starts the update task.
* **Parameters:**  
  - `source`: `Entity` — The entity responsible for initiating spreading (e.g., a burning object).

### `StopSpreading(reset, heatpct)`
* **Description:** Stops propagation. If `reset = true`, resets current heat to zero or a specified percentage of `flashpoint`, and clears the pause flag.
* **Parameters:**  
  - `reset`: `boolean` — Whether to reset state.  
  - `heatpct`: `number?` — Optional heat fraction (0–1) to compute retained heat.

### `GetHeatResistance()`
* **Description:** Returns a multiplier (0–1) that reduces incoming heat based on tile properties (e.g., `no_fire_spread` tiles block propagation, `flashpoint_modifier` tiles dampen heat gain).
* **Parameters:** None.

### `CanSpreadHeat()`
* **Description:** Checks if heat can spread from the current tile (i.e., not on a `no_fire_spread` tile).
* **Parameters:** None.

### `AddHeat(amount, source)`
* **Description:** Adds heat to the propagator, respecting per-update limits, resistance, and delays. Triggers `onflashpoint` if flashpoint is exceeded.
* **Parameters:**  
  - `amount`: `number` — Raw heat to apply.  
  - `source`: `Entity?` — Optional source entity (used for controlled burn/PvP logic).

### `Flash()`
* **Description:** Forces a flash by subtracting negative heat (simulating deficit) and adding a large amount of heat (`flashpoint + 1`), if heating is not paused and not delayed.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Main periodic update logic. Handles heat decay, propagation to nearby entities (via heat acceptors, freezing, and melting), and fire damage. Also handles cleanup of `"firemelt"` effects when not spreading.
* **Parameters:**  
  - `dt`: `number` — Delta time since last update.

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing current state values (range, heat output, resistance, flashpoint, delay status, spreading state, etc.).
* **Parameters:** None.

## Events & Listeners
- **Listens to:**  
  - *Internal periodic task callbacks* (via `DoPeriodicTask` / `DoTaskInTime`).  
- **Triggers (pushes):**  
  - `"firemelt"` — Pushed to entities in range that are frozen/meltable to initiate melting.  
  - `"stopfiremelt"` — Pushed to nearby entities to halt melting (e.g., on propagator removal or when not spreading).  
- **Uses (component-level events):**  
  - `self.onflashpoint(self.inst)` — Custom callback invoked when flashpoint is breached.