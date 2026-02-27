---
id: mightiness
title: Mightiness
description: Tracks and manages a player character's mightiness level, dynamically adjusting physical attributes, animations, and behaviors based on a numeric value that evolves over time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: f093f786
---

# Mightiness

## Overview
The Mightiness component manages the dynamic transformation system for Wolfgang (and similar characters), maintaining a numeric `current` value that ranges between 0 and `max`. This value determines the player's "state" — `wimpy`, `normal`, or `mighty` — each of which triggers distinct visual, audio, stat, and gameplay effects. It automatically updates skin, sounds, damage modifiers, insulation, hunger rates, rowing performance, and work effectiveness based on the current state.

## Dependencies & Tags
- `inst:AddTag("mightiness_normal")` added during initialization (also dynamically added/removed per state).
- Relies on the following components being present on the entity:
  - `skinner`
  - `combat` (for `externaldamagemultipliers`)
  - `temperature`
  - `hunger`
  - `talker`
  - `expert sailor`
  - `workmultiplier`
  - `efficientuser`
  - `rider` (forriding checks)
- Listens for events: `hungerdelta`, `invincibletoggle`, `mounted`, `dismounted`.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the owner entity. |
| `max` | `number` | `TUNING.MIGHTINESS_MAX` | Maximum possible mightiness value. |
| `current` | `number` | `max / 2` | Current mightiness value; determines state. |
| `rate` | `number` | `TUNING.MIGHTINESS_DRAIN_RATE` | Base rate of passive mightiness loss per second. |
| `drain_multiplier` | `number` | `TUNING.MIGHTINESS_DRAIN_MULT_NORMAL` | Hunger-based multiplier applied to the drain rate. |
| `ratescale` | `RATE_SCALE` | `RATE_SCALE.NEUTRAL` | Global scaling factor applied to drain rate (e.g., from modifiers). |
| `draining` | `boolean` | `true` | Whether passive draining is active (can be paused/resumed). |
| `drain_delay` | `number` | `0` | Timestamp after which draining resumes (used after power-up). |
| `ratemodifiers` | `SourceModifierList` | `SourceModifierList(self.inst)` | Aggregator for external rate modifiers. |
| `state` | `string` | `"normal"` | Current mightiness state: `"wimpy"`, `"normal"`, or `"mighty"`. |
| `invincible` | `boolean` | `false` | If true, prevents mightiness drain during state transitions. |
| `overmaxmax` | `number` | `0` | Additional buffer above `max` achievable via gym use. |

## Main Functions

### `DoDelta(delta, force_update, delay_skin, forcesound, fromgym)`
* **Description:** Adjusts `current` mightiness by `delta`, triggers state transitions if thresholds are crossed, and fires the `mightinessdelta` event.
* **Parameters:**
  - `delta` (number): Amount to change current mightiness. Positive increases it; negative decreases.
  - `force_update` (boolean, optional): If `true`, state transition occurs even if current state matches new threshold.
  - `delay_skin` (boolean, optional): If `true`, defers skin updates by ~88 frames.
  - `forcesound` (boolean, optional): Forces sound to play even if state change is silent (e.g., for non-visual contexts).
  - `fromgym` (boolean, optional): If `true`, allows raising `current` above `max` (up to `max + overmaxmax`).

### `BecomeState(state, silent, delay_skin, forcesound)`
* **Description:** Transitions the player to the specified `state` (`wimpy`, `normal`, or `mighty`), applying corresponding visual (skin), audio (sound, speech), combat (damage multiplier), environmental (insulation), and gameplay (hunger rate, work effectiveness, sailing stats) effects.
* **Parameters:**
  - `state` (string): Target state to become.
  - `silent` (boolean, optional): If `true`, suppresses announcement speech and sound.
  - `delay_skin` (boolean, optional): Defer skin update.
  - `forcesound` (boolean, optional): Play sound regardless of `silent`.

### `OnHungerDelta(data)`
* **Description:** Updates `drain_multiplier` based on the player’s hunger percentage, enabling hunger-aware mightiness drain rates (e.g., starving causes faster drain).
* **Parameters:**
  - `data` (table): Contains `newpercent`, the player’s new hunger fraction.

### `OnTaskTick(inst, self, period)`
* **Description:** Periodically calls `DoDec(dt)` (drain logic) if the drain delay has elapsed.
* **Parameters:**
  - `inst` (Entity): The entity owning this component.
  - `self` (Mightiness): The component instance.
  - `period` (number): Tick interval (1 second).

### `LongUpdate(dt)`
* **Description:** Passive drain handler for longer time steps (e.g., from world updates).
* **Parameters:**
  - `dt` (number): Delta time in seconds.

### `Pause()`, `Resume()`, `IsPaused()`
* **Description:** Control active draining.
  - `Pause()`: Sets `draining = false`.
  - `Resume()`: Sets `draining = true`.
  - `IsPaused()`: Returns whether draining is currently disabled.

### `DelayDrain(time)`
* **Description:** Postpones the start of passive drain until `GetTime() + time`.
* **Parameters:**
  - `time` (number): Duration to delay in seconds.

### `GetState()`, `IsMighty()`, `IsNormal()`, `IsWimpy()`
* **Description:** State query helpers.
  - `GetState()`: Returns current state string (`"wimpy"`, `"normal"`, `"mighty"`).
  - `IsMighty()`: Returns `true` if state is `"mighty"` or `"over"`.
  - `IsNormal()`, `IsWimpy()`: Equivalent checks.

### `GetScale()`, `SetMax(amount)`, `GetMax()`, `GetCurrent()`, `SetOverMax(amount)`, `GetOverMax()`
* **Description:** Basic getters and setters for attributes and lifecycle management.

### `SetPercent(percent, force_update, delay_skin, forcesound)`
* **Description:** Sets `current` to `percent * max`, internally computes and applies delta.
* **Parameters:**
  - `percent` (number): Desired fraction of `max` (0–1 or beyond if `overmaxmax` is set).
  - Other args: Same as in `DoDelta`.

### `SetRate(rate)`, `SetRateScale(ratescale)`, `GetRateScale()`
* **Description:** Configures drain rate and scaling.

### `GetDebugString()`
* **Description:** Returns a formatted debug string including current value, rate components, and paused status.

### `UpdateSkinMode(skin_data, delay)`
* **Description:** Applies skin changes via the `skinner` component. Supports delayed application.
* **Parameters:**
  - `skin_data` (table): Contains `skin_mode` and `default_build`.
  - `delay` (boolean): Whether to defer the change.

### `OnSave()`, `OnLoad(data)`
* **Description:** Serialization hooks.
  - `OnSave()`: Returns `{ mightiness = self.current }`.
  - `OnLoad(data)`: Restores `current` from save data and triggers an immediate update if changed.

### `GetSkinMode()`
* **Description:** Returns the `skin_mode` string for the current state.

## Events & Listeners
- **Listens for:**
  - `"hungerdelta"` → `OnHungerDelta(data)`
  - `"invincibletoggle"` → `OnSetInvincible(data)`
  - `"mounted"` → `ApplyAnimScale("mightiness", 1)`
  - `"dismounted"` → `ApplyAnimScale("mightiness", GetScale())`
- **Pushes:**
  - `"mightinessdelta"`: `{ oldpercent, newpercent, delta }` on `DoDelta`.
  - `"mightiness_statechange"`: `{ previous_state, state }` on state transitions.