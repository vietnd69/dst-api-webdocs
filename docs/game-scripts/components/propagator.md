---
id: propagator
title: Propagator
description: Manages heat propagation and thermal effects (e.g., fire melting, freezing relief, damage) between nearby entities.
tags: [heat, fire, environment, damage]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 63c70e54
system_scope: environment
---
# Propagator

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Propagator` handles the simulation and spread of thermal energy from an entity to its surroundings. It is used to model fire-like behaviors, such as melting ice, thawing frozen entities, damaging nearby entities with heat, and heating adjacent `propagator` components. It works closely with the `burnable`, `freezable`, `health`, and `heater` components. The component supports seasonal range modifiers (`SPRING_FIRE_RANGE_MOD`) and implements per-update heat caps to prevent excessive heating.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("propagator")
inst.components.propagator.flashpoint = 120
inst.components.propagator.propagaterange = 4
inst.components.propagator.heatoutput = 6
inst.components.propagator.damages = true
inst.components.propagator:StartSpreading(source)
```

## Dependencies & tags
**Components used:** `burnable`, `freezable`, `health`, `heater`  
**Tags:** Checks `fireimmune`, `frozen`, `meltable`, `firemelt`, `INLIMBO`; adds/removes `firemelt`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `flashpoint` | number | `100` | The heat threshold at which `onflashpoint` callback fires and heating pauses. |
| `currentheat` | number | `0` | Current accumulated heat, modified per `OnUpdate` and `AddHeat`. |
| `decayrate` | number | `1` | Rate at which `currentheat` decays per second. |
| `propagaterange` | number | `3` | Radius (world units) within which heat spreads and melting effects occur. |
| `heatoutput` | number | `5` | Base amount of heat transferred per second to adjacent entities. |
| `damages` | boolean | `false` | Whether nearby entities with `health` take fire damage. |
| `damagerange` | number | `3` | Radius within which fire damage applies (if `damages == true`). |
| `pvp_damagemod` | number | `TUNING.PVP_DAMAGE_MOD or 1` | Damage multiplier applied when source entity has `"player"` tag. |
| `acceptsheat` | boolean | `false` | Whether this entity accepts heat from neighboring propagators. |
| `pauseheating` | boolean \| nil | `nil` | Internal flag indicating if heating is paused (typically after `flashpoint` reached). |
| `spreading` | boolean | `false` | Whether this propagator is actively spreading heat. |
| `source` | entity \| nil | `nil` | Reference to the entity that originally caused this propagator to spread (e.g., a fire source). |
| `delay` | task \| nil | `nil` | Ongoing delayed task (used for temporary heating suppression). |

## Main functions
### `SetOnFlashPoint(fn)`
* **Description:** Sets a callback function to be invoked when `currentheat` exceeds `flashpoint`. Typically used to trigger visual/sound effects (e.g., fire ignition).
* **Parameters:** `fn` (function) — the callback to run when flashpoint is exceeded.
* **Returns:** Nothing.
* **Notes:** Callback only fires if the heat source is not controlled (i.e., not flagged as `controlled_burn` via `burnable:GetControlledBurn()`).

### `StartSpreading(source)`
* **Description:** Begins heat propagation from this entity. Activates the update loop and stores `source`.
* **Parameters:** `source` (entity) — the entity initiating the heat spread (often a fire source).
* **Returns:** Nothing.

### `StopSpreading(reset, heatpct)`
* **Description:** Stops heat propagation. Optionally resets `currentheat` to a fraction of `flashpoint`.
* **Parameters:**  
  - `reset` (boolean) — whether to reset `currentheat`.  
  - `heatpct` (number \| nil) — percentage of `flashpoint` to set as the new `currentheat` if `reset == true`. Applies easing (`easing.outCubic`) for smoothing.
* **Returns:** Nothing.
* **Notes:** Cancels pending tasks; clears `source` and `spreading` state.

### `AddHeat(amount, source)`
* **Description:** Increases `currentheat` by `amount`, applying heat resistance based on tile and `GetHeatResistance()`. Respects per-update heat cap (`max_heat_this_update`).
* **Parameters:**  
  - `amount` (number) — raw heat to add before scaling.  
  - `source` (entity \| nil) — source entity; used to determine if burn is controlled (i.e., `burnable:GetControlledBurn()`).
* **Returns:** Nothing.
* **Error states:** No effect if `delay` is active, entity has `"fireimmune"` tag, or heat cap is exceeded.

### `Flash()`
* **Description:** Instantly floods `currentheat` with `flashpoint + 1` units of heat if `acceptsheat` is true and heating isn’t paused.
* **Parameters:** None.
* **Returns:** Nothing.
* **Notes:** Used to force ignition under specific conditions (e.g., explosive ignition).

### `OnUpdate(dt)`
* **Description:** Core per-tick logic: decays heat, propagates heat to nearby entities, applies freezing relief (`AddColdness` with negative values), triggers melting events, and inflicts fire damage if enabled.
* **Parameters:** `dt` (number) — delta time since last update.
* **Returns:** Nothing.
* **Notes:**  
  - Only processes nearby entities if `spreading == true`.  
  - Uses `TUNING.SPRING_FIRE_RANGE_MOD` to scale ranges in spring season.  
  - Melting entities get `firemelt` tag and `"firemelt"` event.  
  - Fire damage is scaled by `pvp_damagemod` only when source is a player.

### `GetHeatResistance()`
* **Description:** Returns a multiplicative modifier to heat input based on current tile properties.
* **Parameters:** None.
* **Returns:** number — resistance factor (e.g., `0` if `no_fire_spread`, or reduced value if `flashpoint_modifier` applies).
* **Notes:** Tile-specific resistance also applies to cold spreading.

### `CanSpreadHeat()`
* **Description:** Checks if this entity can spread heat (i.e., tile permits fire).
* **Parameters:** None.
* **Returns:** boolean — `true` if tile allows fire spread, `false` otherwise.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging logs.
* **Parameters:** None.
* **Returns:** string — e.g., `"range: 3.00, output: 5.00, heatresist: 1.00, flashpoint: 100.00, delay: false, spread: true, acceptheat: false, curheat: 42.5"`.

## Events & listeners
- **Listens to:** None explicitly — tasks use `DoTaskInTime`, `DoPeriodicTask`.
- **Pushes:** `stopfiremelt` (via `v:PushEvent("stopfiremelt")` during cleanup), `firemelt` (via `v:PushEvent("firemelt")` when melting).  
  Also triggers `onflashpoint` callback when `flashpoint` is exceeded (not an event, but a custom callback).
  
