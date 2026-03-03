---
id: oldager
title: Oldager
description: Manages time-based aging mechanics by converting accumulated damage into health damage over time, simulating biological aging effects on entities.
tags: [aging, combat, time, health]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4b8161ed
system_scope: entity
---

# Oldager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `OldAger` component implements a legacy aging system where entities accumulate "time damage" that gradually translates into health damage over time. This mimics natural aging by converting damage events (typically negative health deltas) into a damage-per-second (`damage_per_second`) value that scales with accumulated damage, which is then applied to the entity's `health` component at a fixed base rate. It works closely with the `health` component and the `player_classified` component to synchronize aging progress across clients.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("oldager")
inst.components.oldager:AddValidHealingCause("food") -- e.g., healing via food reverses aging slightly
inst.components.oldager:FastForwardDamageOverTime() -- e.g., to rapidly age an entity
```

## Dependencies & tags
**Components used:** `health`, `player_classified`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `base_rate` | number | `1/40` | Base aging rate in years per second. |
| `rate` | number | `1` | Multiplier applied to `base_rate` for effective aging rate. |
| `year_timer` | number | `0` | Fractional year counter; full integer parts trigger health damage. |
| `damage_remaining` | number | `0` | Accumulated unprocessed time damage; positive means aging forward, negative means aging backward. |
| `damage_per_second` | number | `0` | Current rate of aging, derived from `damage_remaining`. |
| `valid_healing_causes` | table | `{}` | Set of healing causes that reverse aging instead of causing it. |
| `_taking_time_damage` | boolean | `false` | Internal flag to prevent recursive aging during aging-induced health changes. |

## Main functions
### `AddValidHealingCause(cause_name)`
* **Description:** Registers a healing cause that, when applied, reduces accumulated age damage (i.e., reverses aging).
* **Parameters:** `cause_name` (string) — identifier for the healing cause (e.g., `"food"`, `"healing_potion"`).
* **Returns:** Nothing.
* **Error states:** None.

### `OnTakeDamage(amount, overtime, cause, ignore_invincible, afflicter, ignore_absorb)`
* **Description:** Handles incoming damage or healing to update the aging meter. Negative health changes (damage) increase aging; valid healing causes reduce aging. This method calculates the new `damage_per_second` and updates `damage_remaining`.
* **Parameters:**  
  - `amount` (number) — health delta (negative = damage, positive = healing).  
  - `overtime` (boolean) — unused in this implementation.  
  - `cause` (string) — source of damage/healing (e.g., `"fire"`, `"food"`).  
  - Other parameters (`ignore_invincible`, `afflicter`, `ignore_absorb`) are ignored.  
* **Returns:** `true` — always, allowing the damage event to proceed normally.  
* **Error states:** Early return with `false` if `_taking_time_damage` is already `true` (prevents recursion).

### `OnUpdate(dt)`
* **Description:** Processes frame-by-frame aging: converts `damage_remaining` into `damage_per_second`, updates `year_timer`, and triggers health damage when accumulated years reach integer thresholds. Syncs aging progress to clients via `player_classified`.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.
* **Error states:** None. Handles edge cases such as crossing zero in `damage_remaining`, entity death, and zero damage scenarios.

### `StopDamageOverTime()`
* **Description:** Immediately ends all ongoing aging damage by resetting `damage_remaining`, `damage_per_second`, and `year_timer`. Forces a health update event to refresh UI badges.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetCurrentYearPercent()`
* **Description:** Returns the fractional year component of `year_timer`, representing progress within the current year of aging.
* **Parameters:** None.
* **Returns:** `number` — value in `[0, 1)`.

### `FastForwardDamageOverTime()`
* **Description:** Immediately processes all accumulated `damage_remaining` by applying aging at full rate until all damage is resolved.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Early return with no effect if `damage_per_second <= 0` or `damage_remaining <= 0`.

### `GetDebugString()`
* **Description:** Returns a formatted string with debugging info: current year timer, damage meter, DPS, rate, and delta.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Year timer: 0.750, Meter: 120.00, DPS: 30.000, Rate: 1.000, delta 0.02500"`.

## Events & listeners
- **Listens to:** None (the component is self-scheduling via `inst:StartUpdatingComponent(self)`).
- **Pushes:** `healthdelta` — indirectly via `health:DoDelta()`; used for UI updates (e.g., badges).
