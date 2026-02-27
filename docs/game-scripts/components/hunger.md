---
id: hunger
title: Hunger
description: Manages a character's hunger level, decay over time, starvation effects, and interaction with health damage.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 9084000e
---

# Hunger

## Overview
The Hunger component tracks and regulates a character's hunger value, which decays periodically based on configured rates and burn modifiers. When hunger reaches zero, the character begins taking health damage from starvation unless a custom starvation function is provided or the hunger is paused.

## Dependencies & Tags
- **Dependencies:**
  - `inst.components.health`: Required for starvation-based health damage and invincibility checks.
- **Tags:** None explicitly added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | `number` | `100` | Maximum hunger value; also used to initialize `current`. |
| `current` | `number` | `max` | Current hunger level; clamped to `[0, max]`. |
| `hungerrate` | `number` | `1` | Base rate of hunger decay per tick. |
| `hurtrate` | `number` | `1` | Health damage rate applied per tick when starving. |
| `overridestarvefn` | `function?` | `nil` | Optional custom function called when starving instead of default health damage. |
| `burning` | `boolean` | `true` | Controls whether hunger is actively decaying (`false` = paused). |
| `burnrate` | `number` | `1` | Deprecated multiplier for burn rate; retained for compatibility. |
| `burnratemodifiers` | `SourceModifierList` | `SourceModifierList(self.inst)` | Dynamic modifier list used to compute effective burn rate. |
| `updatetask` | `Task?` | Periodic task running every `UPDATE_PERIOD` (1 sec) | Scheduled task responsible for calling `DoDec()` regularly. |

## Main Functions

### `Hunger:SetMax(amount)`
* **Description:** Sets the maximum hunger value and immediately resets current hunger to this new maximum.
* **Parameters:**
  - `amount` (`number`): The new maximum hunger value.

### `Hunger:SetRate(rate)`
* **Description:** Updates the base hunger decay rate (`hungerrate`).
* **Parameters:**
  - `rate` (`number`): New hunger decay rate per tick.

### `Hunger:SetKillRate(rate)`
* **Description:** Updates the rate of health damage per tick while starving (`hurtrate`).
* **Parameters:**
  - `rate` (`number`): New health damage rate per tick during starvation.

### `Hunger:SetOverrideStarveFn(fn)`
* **Description:** Assigns a custom function to handle starvation logic instead of the default health damage behavior.
* **Parameters:**
  - `fn` (`function?`): A function with signature `fn(inst, dt)` that will be called when the character is starving.

### `Hunger:IsPaused()`
* **Description:** Returns whether hunger decay is currently paused.
* **Returns:** `boolean` — `true` if `burning` is `false`, otherwise `false`.

### `Hunger:IsStarving()`
* **Description:** Returns whether the character is currently starving (i.e., hunger ≤ 0).
* **Returns:** `boolean` — `true` if `current ≤ 0`, otherwise `false`.

### `Hunger:Pause()`
* **Description:** Pauses hunger decay by disabling the periodic task and setting `burning` to `false`.
* **Parameters:** None.

### `Hunger:Resume()`
* **Description:** Resumes hunger decay by re-enabling the periodic task if not already active, and setting `burning` to `true`.
* **Parameters:** None.

### `Hunger:GetPercent()`
* **Description:** Returns the current hunger as a fraction (0.0 to 1.0) of maximum hunger.
* **Returns:** `number` — `current / max`.

### `Hunger:SetPercent(p, overtime)`
* **Description:** Sets current hunger to `p * max`, effectively scaling hunger by percentage.
* **Parameters:**
  - `p` (`number`): Target percentage (e.g., 0.5 for 50%).
  - `overtime` (`boolean?`): Flag passed to `SetCurrent`.

### `Hunger:SetCurrent(current, overtime)`
* **Description:** Sets the current hunger value (clamped between 0 and `max`), and triggers relevant events (`hungerdelta`, `startstarving`, or `stopstarving`).
* **Parameters:**
  - `current` (`number`): New hunger value.
  - `overtime` (`boolean?`): Optional flag indicating whether the change occurred over time.

### `Hunger:DoDelta(delta, overtime, ignore_invincible)`
* **Description:** Adjusts current hunger by `delta`, respecting invincibility and optional redirection via `redirect`.
* **Parameters:**
  - `delta` (`number`): Amount to add to current hunger (can be negative).
  - `overtime` (`boolean`): Passed through to `SetCurrent`.
  - `ignore_invincible` (`boolean?`): Skip invincibility check if `true`.

### `Hunger:DoDec(dt, ignore_damage)`
* **Description:** Decrements hunger over a time interval `dt`, or applies health damage if already starving.
* **Parameters:**
  - `dt` (`number`): Time delta in seconds.
  - `ignore_damage` (`boolean?`): Skip health damage if `true` (used by `LongUpdate`).

### `Hunger:LongUpdate(dt)`
* **Description:** Calls `DoDec` with `ignore_damage = true`, used for slower, damage-safe updates (e.g., world tick intervals).
* **Parameters:**
  - `dt` (`number`): Time delta in seconds.

### `Hunger:TransferComponent(newinst)`
* **Description:** Transfers current hunger state to a new entity’s Hunger component by percentage.
* **Parameters:**
  - `newinst` (`Entity`): Destination entity instance.

### `Hunger:OnSave()`
* **Description:** Returns minimal save data (only if current hunger differs from max).
* **Returns:** `{ hunger = self.current }` or `nil` if hunger is full.

### `Hunger:OnLoad(data)`
* **Description:** Restores hunger value from save data if present and non-default.
* **Parameters:**
  - `data` (`table`): Save data table, may contain `hunger`.

### `Hunger:OnRemoveFromEntity()`
* **Description:** Cleans up the periodic task upon component removal.
* **Parameters:** None.

### `Hunger:GetDebugString()`
* **Description:** Returns a formatted string for debug overlays showing current state and rates.
* **Returns:** `string` — Human-readable debug info.

## Events & Listeners
- **Events Pushed:**
  - `"hungerdelta"` — Pushed when `current` changes (via `SetCurrent`), with payload: `{ oldpercent, newpercent, overtime, delta }`.
  - `"startstarving"` — Pushed when `current` drops from >0 to ≤0.
  - `"stopstarving"` — Pushed when `current` rises from ≤0 to >0.
- **Events Not Explicitly Listened For:** This component does not register listeners for external events.