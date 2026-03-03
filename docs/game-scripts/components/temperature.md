---
id: temperature
title: Temperature
description: Manages entity body temperature, including heating/cooling logic, insulation, moisture penalties, and health impact from extreme temperatures.
tags: [temperature, player, entity, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: be308083
system_scope: entity
---

# Temperature

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Temperature` tracks and updates an entity's internal body temperature, simulating environmental heat exchange with modifiers from insulation, moisture, carried/equipped items, nearby heaters, and belly temperature from food. It interacts closely with the `health` component to apply cold/hot damage, and uses `heater`, `insulator`, `beard`, `moisture`, `inventory`, `sleepingbag`, and `preserver` components to compute thermal dynamics. Temperature changes are clamped between `mintemp` and `maxtemp`, and transitions across 0°C and `overheattemp` trigger gameplay events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("temperature")
inst.components.temperature:SetTemperature(20)
inst.components.temperature:DoDelta(5)
inst.components.temperature:SetModifier("custom_cooling", -3)
inst.components.temperature:IgnoreTags("INLIMBO", "NOHEAT")
```

## Dependencies & tags
**Components used:** `health`, `heater`, `insulator`, `beard`, `inventory`, `moisture`, `preserver`, `sleepingbag`, `inventoryitem`, `player_classified`
**Tags:** Checks `INLIMBO`, `player`, `pocketdimension_container`, `fridge`, `nocool`, `lowcool`, `HASHEATER`, `spawnlight`, `WET`. Adds no tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `settemp` | number or nil | `nil` | Target temperature override (if not `nil`, overrides environmental calculation). |
| `current` | number | `TUNING.STARTING_TEMP` | Current body temperature in °C. |
| `maxtemp` | number | `TUNING.MAX_ENTITY_TEMP` | Upper bound for `current`. |
| `mintemp` | number | `TUNING.MIN_ENTITY_TEMP` | Lower bound for `current`. |
| `overheattemp` | number | `TUNING.OVERHEAT_TEMP` | Threshold above which overheating damage applies. |
| `hurtrate` | number | `TUNING.WILSON_HEALTH / TUNING.FREEZING_KILL_TIME` | Damage per second applied while freezing. |
| `overheathurtrate` | number or nil | `nil` | Damage per second applied while overheating (defaults to `hurtrate`). |
| `inherentinsulation` | number | `0` | Base winter insulation. |
| `inherentsummerinsulation` | number | `0` | Base summer insulation. |
| `shelterinsulation` | number | `TUNING.INSULATION_MED_LARGE` | Insulation bonus when sheltered. |
| `maxmoisturepenalty` | number | `TUNING.MOISTURE_TEMP_PENALTY` | Max cooling penalty from full moisture. |
| `totalmodifiers` | number | `0` | Sum of all active temperature modifiers. |
| `externalheaterpower` | number | `0` | Total heater influence factor from nearby heat sources. |
| `delta` | number | `0` | Immediate temperature change target (debug/logging use). |
| `rate` | number | `0` | Current rate of temperature change per second (debug/logging use). |
| `sheltered` | boolean | `false` | Whether the entity is under shelter (e.g., trees, structures). |
| `sheltered_level` | number | `1` | Shelter depth level (affects overheating ambient cap). |
| `ignoreheatertags` | table of strings | `{ "INLIMBO" }` | Tags excluded from heater influence calculations. |
| `usespawnlight` | boolean or nil | `nil` | If true, `spawnlight` tag is considered during heater lookup. |

## Main functions
### `SetFreezingHurtRate(rate)`
* **Description:** Sets the damage rate per second applied when freezing (`current < 0`).
* **Parameters:** `rate` (number) — damage per second.
* **Returns:** Nothing.

### `SetOverheatHurtRate(rate)`
* **Description:** Sets the damage rate per second applied when overheating (`current > overheattemp`). Defaults to `hurtrate` if not set.
* **Parameters:** `rate` (number) — damage per second.
* **Returns:** Nothing.

### `DoDelta(delta)`
* **Description:** Applies a temperature change `delta` adjusted by current seasonal insulation.
* **Parameters:** `delta` (number) — raw temperature change (positive = warm, negative = cool).
* **Returns:** Nothing.

### `SetTemperatureInBelly(delta, duration)`
* **Description:** Applies a temporary temperature offset (simulating effects of hot/cold food). Overrides any existing belly effect.
* **Parameters:**  
  - `delta` (number) — temperature offset to apply.  
  - `duration` (number) — how long the effect lasts in seconds.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Cleanup method called when component is removed. Cancels belly timer and clears UI state.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetCurrent()`
* **Description:** Returns the current body temperature.
* **Parameters:** None.
* **Returns:** `number` — current temperature in °C.

### `GetMax()`
* **Description:** Returns the maximum allowed body temperature.
* **Parameters:** None.
* **Returns:** `number` — `maxtemp`.

### `OnSave()`
* **Description:** Returns a serializable table of belly temperature and current temperature for persistence.
* **Parameters:** None.
* **Returns:** `{ current: number, bellytemperaturedelta: number or nil, bellytime: number or nil }`.

### `OnLoad(data)`
* **Description:** Restores saved temperature state, applying world temperature clamping for players to prevent abrupt jumps.
* **Parameters:**  
  - `data` (table) — save data as returned by `OnSave`.
* **Returns:** Nothing.

### `IgnoreTags(...)`
* **Description:** Extends the list of tags excluded from heater influence. Starts with default `"INLIMBO"`.
* **Parameters:** Variable arguments — tag strings to add.
* **Returns:** Nothing.

### `SetTemp(temp)`
* **Description:** Sets `settemp` and immediately updates `current` to `temp` (overrides environmental update).
* **Parameters:** `temp` (number or nil) — target temperature (`nil` clears override).
* **Returns:** Nothing.

### `SetTemperature(value)`
* **Description:** Directly sets `current` temperature, triggers events for freezing/overheating transitions.
* **Parameters:** `value` (number) — new temperature in °C.
* **Returns:** Nothing.
* **Error states:** None.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging, including temperature, rate, delta, modifiers, and insulation.
* **Parameters:** None.
* **Returns:** `string`.

### `IsFreezing()`
* **Description:** Checks if `current < 0`.
* **Parameters:** None.
* **Returns:** `boolean`.

### `IsOverheating()`
* **Description:** Checks if `current > overheattemp`.
* **Parameters:** None.
* **Returns:** `boolean`.

### `SetModifier(name, value)`
* **Description:** Applies or updates a named temperature modifier. Values are summed into `totalmodifiers`.
* **Parameters:**  
  - `name` (string) — modifier identifier.  
  - `value` (number) — modifier value (0 or nil removes it).
* **Returns:** Nothing.

### `RemoveModifier(name)`
* **Description:** Removes a named modifier. Does nothing if the modifier does not exist.
* **Parameters:** `name` (string).
* **Returns:** Nothing.

### `GetInsulation()`
* **Description:** Computes and returns seasonal insulation values considering body insulation, beard (winter-only bonus, summer penalty), shelter, and time-of-day bonuses (not caves).
* **Parameters:** None.
* **Returns:** `winterInsulation` (number), `summerInsulation` (number) — both clamped to `>= 0`.

### `GetMoisturePenalty()`
* **Description:** Returns the cooling penalty (negative value) applied due to moisture level.
* **Parameters:** None.
* **Returns:** `number` — negative value between `0` and `-maxmoisturepenalty`.

### `OnUpdate(dt, applyhealthdelta)`
* **Description:** Computes the next temperature step. Computes ambient temperature, applies modifiers, heat/cold from equipment and carried items, belly effects, shelter, and nearby heaters (considering falloff, wetness, and radius). Updates `current` via `SetTemperature`, and applies health damage if freezing/overheating.
* **Parameters:**  
  - `dt` (number) — time elapsed since last update (seconds).  
  - `applyhealthdelta` (boolean or nil) — if `false`, skips health damage. Defaults to `true`.
* **Returns:** Nothing.

### `TransferComponent(newinst)`
* **Description:** Copies temperature and belly state to a new entity's `temperature` component (e.g., upon death/resurrection).
* **Parameters:**  
  - `newinst` (Entity) — destination entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"sheltered"` — updates `sheltered` and `sheltered_level` via `onsheltered` callback.  
- **Pushes:**  
  - `"startfreezing"` / `"stopfreezing"` — fired when crossing `0°C`.  
  - `"startoverheating"` / `"stopoverheating"` — fired when crossing `overheattemp`.  
  - `"temperaturedelta"` — fired whenever `current` changes, with `{ last: number, new: number, hasrate: boolean }`.  
  - `"healthdelta"` — indirectly via `health:DoDelta` during freezing or overheating.
