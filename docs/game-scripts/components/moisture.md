---
id: moisture
title: Moisture
description: Manages a character's moisture level, including precipitation absorption, drying rates, waterproofing modifiers, and state transitions like wet or soaked.
tags: [weather, player, status, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 49dc8fd3
system_scope: entity
---

# Moisture

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Moisture` tracks and updates an entity's moisture level (from 0 to `maxmoisture`). It handles rain exposure via `GetMoistureRate`, drying based on temperature, shelter, and external heat sources (`externalheaterpower`), and equipment contributions via the `inventory` component. It also supports forced drying (e.g., from sleeping bags), waterproofing modifiers via `SourceModifierList`, and UI state updates (e.g., wet/soaked announcements and segmented visual bars). The component integrates closely with `inventory`, `sheltered`, `temperature`, `sleepingbag`, `rainimmunity`, `moistureabsorberuser`, and `talker`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moisture")
inst.components.moisture:SetPercent(0.5)  -- Set to 50% moisture
inst.components.moisture:ForceDry(true)   -- Instantly dry the character
```

## Dependencies & tags
**Components used:** `inventory`, `sheltered`, `temperature`, `sleepingbag`, `rainimmunity`, `moistureabsorberuser`, `talker`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxmoisture` | number | `100` | Maximum moisture capacity. |
| `moisture` | number | `0` | Current moisture level. |
| `numSegs` | number | `5` | Number of UI segments (drops) used for moisture bar. |
| `baseDryingRate` | number | `0` | Base drying rate multiplier. |
| `maxDryingRate` | number | `0.1` | Upper bound for drying rate from environment. |
| `minDryingRate` | number | `0` | Lower bound for drying rate. |
| `maxPlayerTempDrying` | number | `5` | Max drying bonus from optimal player temperature. |
| `optimalPlayerTempDrying` | number | `2` | Optimal drying bonus when < 3 segments wet. |
| `minPlayerTempDrying` | number | `0` | Min player temperature drying bonus. |
| `maxMoistureRate` | number | `0.75` | Max precipitation absorption rate. |
| `minMoistureRate` | number | `0` | Min precipitation absorption rate. |
| `inherentWaterproofness` | number | `0` | *Deprecated* — use `waterproofnessmodifiers`. |
| `waterproofnessmodifiers` | `SourceModifierList` | (additive list, initial value `0`) | Handles additive waterproofness bonuses. |
| `externalbonuses` | `SourceModifierList` | (additive list, initial value `0`) | External rate bonuses (e.g., from gear). |
| `forcedrysources` | table or `nil` | `nil` | Tracks active forced-dry sources; non-nil means forced dry. |
| `optimalDryingTemp` | number | `50` | Temperature (local scale) for maximum environmental drying. |
| `rate` | number | `0` | Current per-second moisture change. |
| `ratescale` | `RATE_SCALE_*` | `RATE_SCALE.NEUTRAL` | UI rate indicator scale. |
| `wet` | boolean | `false` | `true` when `GetSegs() >= 2`. |

## Main functions
### `ForceDry(force, source)`
*   **Description:** Instantly dries the entity (if `force` is `true`) or cancels forced dry state. When activated, the component stops updating and moisture is reset to `0`. Optional `source` tracks the origin (e.g., sleeping bag), preventing duplicates.
*   **Parameters:**  
    `force` (boolean) — whether to enable or disable forced dry.  
    `source` (Entity or `nil`) — entity responsible for the dry effect; used for cleanup listeners.
*   **Returns:** Nothing.

### `DoDelta(num, no_announce)`
*   **Description:** Applies a moisture delta. If in forced dry mode, returns immediately. Triggers `AnnounceMoisture` and pushes `"moisturedelta"` unless `no_announce` is `true`.
*   **Parameters:**  
    `num` (number) — moisture delta to apply.  
    `no_announce` (boolean, optional) — skip character speech announcements.
*   **Returns:** Nothing.

### `SetMoistureLevel(num)`
*   **Description:** Directly sets the moisture level to `num` (clamped to `[0, maxmoisture]`). Updates `wet` state and fires `"moisturedelta"` event.
*   **Parameters:**  
    `num` (number) — target moisture level.
*   **Returns:** Nothing.

### `GetMoistureRate()`
*   **Description:** Calculates current precipitation absorption rate (in moisture/second). Returns `0` if not raining, if floating (floater held or in bathing pool), or if immune to rain. Uses `_GetMoistureRateAssumingRain()` otherwise.
*   **Parameters:** None.
*   **Returns:** `number` — current rain-based moisture gain rate (≥ `0`).

### `GetDryingRate(moisturerate)`
*   **Description:** Calculates net drying rate based on temperature, external heater, segment count, and current moisture level. Returns `0` if `moisturerate > 0` (i.e., it's raining).
*   **Parameters:**  
    `moisturerate` (number or `nil`) — if provided, overrides `GetMoistureRate()` for rain check.
*   **Returns:** `number` — non-negative drying rate (≥ `0`). Composed of:  
    - `baseDryingRate`  
    - Linear interpolation of `externalheaterpower`  
    - Linear interpolation of local temperature around `optimalDryingTemp`  
    - Exponential increase as moisture rises (dries faster when wetter)

### `GetWaterproofness()`
*   **Description:** Computes total waterproofness from inventory, inherent, and modifier lists. Used for determining rain absorption severity.
*   **Parameters:** None.
*   **Returns:** `number` — clamped value in `[0, 1]`.

### `GetEquippedMoistureRate(dryingrate)`
*   **Description:** Retrieves moisture rate contribution from equipped items (via `inventory:GetEquippedMoistureRate`). If at or above equipment moisture capacity, rates are clamped to prevent UI flicker.
*   **Parameters:**  
    `dryingrate` (number) — current global drying rate (used to cap negative rates).
*   **Returns:** `number` — equipment-based moisture rate (non-negative). Returns `0` if no inventory component.

### `AddRateBonus(src, bonus, key)`, `RemoveRateBonus(src, key)`, `GetRateBonus()`
*   **Description:** Manages external rate modifiers via `externalbonuses` (`SourceModifierList`). Used by external systems (e.g., gear effects) to tweak moisture change rates.
*   **Parameters:**  
    `src` (any hashable key) — source identifier.  
    `bonus` (number) — additive bonus to apply.  
    `key` (any hashable key) — sub-key for overriding bonuses per source.  
*   **Returns (GetRateBonus):** `number` — sum of all active bonuses.

### `GetDesiccantBonus(rate, dt)`
*   **Description:** Queries `moistureabsorberuser` component to determine moisture removed per-second by equipped desiccant items.
*   **Parameters:**  
    `rate` (number) — current net moisture rate.  
    `dt` (number) — delta time.
*   **Returns:** `number` — desiccant’s moisture removal amount.

### `GetDebugString()`
*   **Description:** Returns a formatted diagnostic string for debugging UI.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"moisture: 20.00 rate: +0.45 (precip: +0.75 equip: +0.00 drying: -0.30)"` or `"moisture: 0.00 rate: 0.00 FORCED DRY"`.

### `OnUpdate(dt)`
*   **Description:** Core update loop called every frame. Computes net rate from precipitation, drying, equipment, external bonuses, and desiccants; applies `DoDelta` using `dt`. Also updates `ratescale` for UI feedback.
*   **Parameters:**  
    `dt` (number) — frame delta time.
*   **Returns:** Nothing.

### `OnSave()`, `OnLoad(data)`
*   **Description:** Serialization hooks for modded savegames.
*   **Parameters (OnLoad):**  
    `data` (table or `nil`) — saved data, expected to contain `data.moisture`.
*   **Returns (OnSave):** `table` — `{ moisture = <number> }`.

## Events & listeners
- **Listens to:**  
  - `"onremove"` (on source entities passed to `ForceDry`) — used to remove forced-dry source entries and resume updating.  
- **Pushes:**  
  - `"moisturedelta"` — fired in `DoDelta`/`SetMoistureLevel` with payload `{ old = <number>, new = <number> }`.  
  - *Note:* `"moisturechanged"` and `"announce"` events are *not* used here (announcements use talker directly).
