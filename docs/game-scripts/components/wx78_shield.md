---
id: wx78_shield
title: Wx78 Shield
description: Manages WX-78's shield system including charge generation, damage absorption, and penetration threshold mechanics.
tags: [wx78, shield, damage, charge]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: b1674609
system_scope: entity
---

# Wx78 Shield

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Wx78_Shield` manages the shield mechanic for the WX-78 character. It tracks current and maximum shield values, handles charge generation from multiple sources via `SourceModifierList`, and absorbs incoming damage when the shield is at or above the penetration threshold. The component syncs state to the `wx78_classified` component for client replication and pushes events when shield values change. Shield charging is gated by combat and hurt status checks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wx78_shield")
inst.components.wx78_shield:SetMax(150)
inst.components.wx78_shield:AddChargeSource(inst, 5, "circuit_bonus")
inst.components.wx78_shield:DoDelta(25)
print(inst.components.wx78_shield:GetPercent())
```

## Dependencies & tags
**External dependencies:**
- `util/sourcemodifierlist` — manages additive charge generation modifiers from multiple sources

**Components used:**
- `combat` — checked in `IsInCombat()` for last attacker and attack timestamps
- `health` — checked via `IsHurt()` to gate shield charging
- `wx78_classified` — custom component for syncing shield values to clients

**Tags:**
- `wx78_shield` — added on construction; identifies entities with shield capability

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `penetrationthreshold` | number | `15` | Shield value at which damage is fully absorbed. Assignment fires `on_penetrationthreshold` watcher. |
| `currentshield` | number | `0` | Current shield health. Clamped to `0`–`maxshield`. Assignment fires `on_currentshield` watcher. |
| `maxshield` | number | `100` | Maximum shield capacity. Assignment fires `on_maxshield` watcher. |
| `canshieldcharge` | boolean | `false` | Whether shield can currently regenerate. Assignment fires `on_canshieldcharge` watcher and pushes `wx_canshieldcharge` event. |
| `chargegenerationsources` | SourceModifierList | base `0` | Tracks per-source charge rate modifiers; combined additively. Call `Get()` for effective charge rate. |
| `effect_cooldown` | number | `5` | Cooldown timer in seconds between shield visual effects. |
| `updating` | boolean | `false` | Internal flag indicating if component update loop is active. |
| `COMBAT_TIMEOUT` | constant (local) | `6` | Seconds after last combat action to consider entity "in combat" for charge gating. |
| `EFFECT_TIME` | constant (local) | `10` | Base interval in seconds between shield visual effect spawns. |
| `EFFECT_TIME_VAR` | constant (local) | `8` | Random variance added to `EFFECT_TIME` for effect spawn timing. |

## Main functions
### `ChargeSourceChanged_Internal()`
* **Description:** Internal method that checks if charge generation sources are active. Starts or stops the component update loop based on whether total charge rate is non-zero.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `AddChargeSource(source, amount, reason)`
* **Description:** Adds a charge generation modifier from a specific source. Triggers `ChargeSourceChanged_Internal()` to update the component update state.
* **Parameters:**
  - `source` — entity or identifier for the charge source
  - `amount` — number; charge rate contribution from this source
  - `reason` — string key identifying the modifier type
* **Returns:** nil
* **Error states:** None

### `RemoveChargeSource(source, reason)`
* **Description:** Removes a charge generation modifier from a specific source. Triggers `ChargeSourceChanged_Internal()` to update the component update state.
* **Parameters:**
  - `source` — entity or identifier for the charge source
  - `reason` — string key identifying the modifier type to remove
* **Returns:** nil
* **Error states:** None

### `SetMax(amount)`
* **Description:** Sets the maximum shield capacity. Calls `DoDelta(0)` to trigger shield value event pushes. Asserts that amount is positive.
* **Parameters:** `amount` — number; must be greater than 0
* **Returns:** nil
* **Error states:** Errors if `amount <= 0` due to `assert()` statement.

### `SetCurrent(amount)`
* **Description:** Sets the current shield value, clamped between `0` and `maxshield`. Pushes `wxshielddelta` event with percentage change data. Spawns shield visual effects based on threshold crossings.
* **Parameters:** `amount` — number; new shield value (will be clamped)
* **Returns:** nil
* **Error states:** None
* **Effect spawn logic:**
  - `currentshield >= penetrationthreshold` and `old <= 0` — spawns `wx78_shield_full`
  - `currentshield >= penetrationthreshold` and `old <= penetrationthreshold` — spawns `wx78_shield_half_to_full`
  - `currentshield < penetrationthreshold` and `currentshield == 0` and `was_over_threshold` — spawns `wx78_shield_full_to_empty`
  - `currentshield < penetrationthreshold` and `currentshield > 0` and `was_over_threshold` — spawns `wx78_shield_full_to_half`
  - `currentshield < penetrationthreshold` and `currentshield == 0` and `not was_over_threshold` — spawns `wx78_shield_half_to_empty`
  - `currentshield < penetrationthreshold` and `currentshield > 0` and `old <= 0` — spawns `wx78_shield_half`

### `GetMax()`
* **Description:** Returns the maximum shield capacity.
* **Parameters:** None
* **Returns:** number; current `maxshield` value
* **Error states:** None

### `GetCurrent()`
* **Description:** Returns the current shield value.
* **Parameters:** None
* **Returns:** number; current `currentshield` value
* **Error states:** None

### `GetPenetrationThreshold()`
* **Description:** Returns the shield penetration threshold value.
* **Parameters:** None
* **Returns:** number; current `penetrationthreshold` value
* **Error states:** None

### `GetPercent()`
* **Description:** Returns the current shield as a percentage of maximum.
* **Parameters:** None
* **Returns:** number; `currentshield / maxshield` (0.0 to 1.0)
* **Error states:** None

### `SetPercent(p)`
* **Description:** Sets the current shield value based on a percentage of maximum.
* **Parameters:** `p` — number; percentage value (0.0 to 1.0 recommended)
* **Returns:** nil
* **Error states:** None

### `Impenetrable()`
* **Description:** Checks if the current shield is at or above the penetration threshold, meaning incoming damage will be fully absorbed.
* **Parameters:** None
* **Returns:** boolean; `true` if `currentshield >= penetrationthreshold`
* **Error states:** None

### `DoDelta(delta)`
* **Description:** Applies a delta value to the current shield by calling `SetCurrent(currentshield + delta)`.
* **Parameters:** `delta` — number; positive or negative change to apply
* **Returns:** nil
* **Error states:** None

### `UpdateCanShieldCharge()`
* **Description:** Updates the `canshieldcharge` property based on current state. Shield can charge only if: component is updating, current shield is below max, entity is not in combat, and entity is not hurt.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `inst.components.combat` or `inst.components.health` is nil when `IsInCombat()` or `IsHurt()` is called — no nil guards present in those helper functions.

### `GetCanShieldCharge()`
* **Description:** Returns whether the shield can currently regenerate charge.
* **Parameters:** None
* **Returns:** boolean; current `canshieldcharge` value
* **Error states:** None

### `OnTakeDamage(amount, overtime, cause, ignore_invincible, afflicter, ignore_absorb)`
* **Description:** Damage handler called by the combat system. Returns modified damage value based on shield state.
* **Parameters:**
  - `amount` — number; incoming damage (negative values indicate damage)
  - `overtime` — boolean; whether damage is over-time effect
  - `cause` — string; damage source type
  - `ignore_invincible` — boolean; whether to bypass invincibility
  - `afflicter` — entity; source of the damage
  - `ignore_absorb` — boolean; whether to bypass shield absorption
* **Returns:** number; damage value to apply to health (0 if fully absorbed, or `amount + current` if partially absorbed)
* **Error states:** None — `afflicter` nil case is guarded by early return (`afflicter == nil` check at start of function body).
* **Damage calculation logic:**
  - If `ignore_absorb` or `amount >= 0` or `overtime` or `afflicter == nil` — returns `amount` unchanged (no shield absorption)
  - If `Impenetrable()` — applies full damage to shield via `DoDelta(amount)` and returns `0` (health takes no damage)
  - Otherwise — applies damage to shield and returns `amount + current` (health takes damage plus shield depletion)

### `OnUpdate(dt)`
* **Description:** Periodic update called when component is active. Updates charge eligibility, applies charge generation if eligible, and manages visual effect cooldown.
* **Parameters:** `dt` — number; delta time in seconds since last update
* **Returns:** nil
* **Error states:** None
* **Effect spawn logic:** When `effect_cooldown <= 0` and `currentshield > 0`, spawns `wx78_shield_half` if below threshold or `wx78_shield_full` if at/above threshold. Resets cooldown to `EFFECT_TIME + random(0, EFFECT_TIME_VAR)`.

### `OnSave()`
* **Description:** Returns save data for the shield component. Only saves if current shield is non-zero.
* **Parameters:** None
* **Returns:** table `{ current = number }` or `nil` if current shield is 0
* **Error states:** None

### `OnLoad(data)`
* **Description:** Restores shield state from save data.
* **Parameters:** `data` — table; saved data from `OnSave()`
* **Returns:** nil
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing current and maximum shield values.
* **Parameters:** None
* **Returns:** string; format `"%2.2f / %2.2f"` with current and max values
* **Error states:** None

### `on_penetrationthreshold(self, threshold, old_threshold)` (local)
* **Description:** Property watcher callback fired when `penetrationthreshold` is assigned. Syncs the new value to `wx78_classified` component.
* **Parameters:**
  - `threshold` — number; new threshold value
  - `old_threshold` — number; previous threshold value
* **Returns:** nil
* **Error states:** None; guards against `wx78_classified` being nil.

### `on_currentshield(self, current, old_current)` (local)
* **Description:** Property watcher callback fired when `currentshield` is assigned. Syncs the new value to `wx78_classified` component.
* **Parameters:**
  - `current` — number; new shield value
  - `old_current` — number; previous shield value
* **Returns:** nil
* **Error states:** None; guards against `wx78_classified` being nil.

### `on_maxshield(self, max, old_max)` (local)
* **Description:** Property watcher callback fired when `maxshield` is assigned. Syncs the new value to `wx78_classified` component.
* **Parameters:**
  - `max` — number; new max shield value
  - `old_max` — number; previous max shield value
* **Returns:** nil
* **Error states:** None; guards against `wx78_classified` being nil.

### `on_canshieldcharge(self, val)` (local)
* **Description:** Property watcher callback fired when `canshieldcharge` is assigned. Syncs the value to `wx78_classified.canshieldcharge` netvar and pushes `wx_canshieldcharge` event.
* **Parameters:** `val` — boolean; new charge eligibility state
* **Returns:** nil
* **Error states:** None; guards against `wx78_classified` being nil.

### `IsInCombat(inst)` (local)
* **Description:** Helper function that determines if an entity is currently in combat. Checks last attacker validity, target relationship, and combat timeout.
* **Parameters:** `inst` — entity; the entity to check
* **Returns:** boolean; `true` if entity is in combat
* **Error states:** Errors if `inst.components.combat` is nil — returns `false` early with guard. Errors if `lastattacker.components.health` or `lastattacker.components.combat` is nil when accessed — no nil guards present for those chained accesses.

### `IsHurt(inst)` (local)
* **Description:** Helper function that checks if an entity's health is below maximum.
* **Parameters:** `inst` — entity; the entity to check
* **Returns:** boolean; `true` if health is below max
* **Error states:** None; guards against `inst.components.health` being nil.

## Events & listeners
- **Pushes:** `wx_canshieldcharge` — fired when `canshieldcharge` property changes; data: direct boolean param (`val`) — not a data table
- **Pushes:** `wxshielddelta` — fired when `SetCurrent()` changes shield value; data includes `oldpercent`, `newpercent`, `maxshield`, `penetrationthreshold`