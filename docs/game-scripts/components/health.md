---
id: health
title: Health
description: Manages an entity's health points, damage application, regeneration, and death-related behavior within the Entity Component System.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: e984e3b6
---

# Health

## Overview
The Health component manages an entity's current and maximum health, handles damage application (including fire damage and damage modifiers), tracks health regeneration, supports health penalties (e.g., for multiplayer death penalties), and coordinates death-related logic such as corpse generation and fade-out behavior.

## Dependencies & Tags
- **Components used:** `combat`, `repairable`, `burnable`
- **Tags added/removed:** `invincible` (only in debug/cheats mode), `NOCLICK` (on death if fading out)
- **Events listened to:** `onremove` (for lunar burn sources and regen sources)
- **Events pushed:** `invincibletoggle`, `startfiredamage`, `stopfiredamage`, `changefiredamage`, `firedamage`, `startlunarburn`, `stoplunarburn`, `pre_health_setval`, `minhealth`, `death`, `entity_death`, `healthdelta`, plus custom regeneration-related events

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxhealth` | number | `100` | Maximum health capacity before penalty adjustments. |
| `minhealth` | number | `0` | Minimum health threshold; entity dies if falling below this. |
| `currenthealth` | number | `self.maxhealth` | Current health value; starts equal to `maxhealth`. |
| `invincible` | boolean | `false` | If true, the entity is immune to damage. |
| `takingfiredamage` | boolean | `false` | Indicates if the entity is currently taking fire damage. |
| `takingfiredamagetime` | number | `0` | (Deprecated; unused) |
| `takingfiredamagelow` | boolean? | `nil` | Indicates if the entity is taking low-intensity fire damage. |
| `lunarburnflags` | number? | `nil` | Bitmask of active lunar burn effects. |
| `lastlunarburnpulsetick` | number? | `nil` | (Unused placeholder for lunar burn timing) |
| `fire_damage_scale` | number | `1` | Base multiplier for fire damage calculations. |
| `externalfiredamagemultipliers` | SourceModifierList | `SourceModifierList(inst)` | Modifier list for external fire damage multipliers. |
| `fire_timestart` | number | `1` | Duration (in seconds) before full-intensity fire damage begins. |
| `firedamageinlastsecond` | number | `0` | Accumulated fire damage in the last second (used for rate limiting). |
| `firedamagecaptimer` | number | `0` | Timer used to track fire damage per second. |
| `nofadeout` | boolean | `false` | If true, prevents the entity from fading out after death. |
| `penalty` | number | `0` | Health penalty (0 to `MAXIMUM_HEALTH_PENALTY`). |
| `disable_penalty` | boolean | `not TUNING.HEALTH_PENALTY_ENABLED` | Controls whether health penalties are applied. |
| `absorb` | number | `0` | (Deprecated) Total damage absorption from external sources. Use `externalabsorbmodifiers` instead. |
| `playerabsorb` | number | `0` | (Deprecated) Player-specific absorption. Use `externalabsorbmodifiers` instead. |
| `externalabsorbmodifiers` | SourceModifierList | `SourceModifierList(inst, 0, additive)` | Modifiers reducing incoming damage. |
| `externalreductionmodifiers` | SourceModifierList | `SourceModifierList(inst, 0, additive)` | Additional flat damage reductions. |
| `destroytime` | number? | `nil` | Time (in seconds) before the corpse fades out (used post-death). |
| `canmurder` | boolean | `true` | Whether this entity can kill others. |
| `canheal` | boolean | `true` | Whether this entity can be healed. |
| `nonlethal_temperature` | number | `TUNING.NONLETHAL_TEMPERATURE` | If true, temperature-related damage does not reduce health below this threshold. |
| `nonlethal_hunger` | number | `TUNING.NONLETHAL_HUNGER` | If true, hunger-related damage does not reduce health below this threshold. |
| `nonlethal_pct` | number | `TUNING.NONLETHAL_PERCENT` | Minimum health percentage (0–1) before nonlethal rules apply. |

## Main Functions

### `Health:DoDelta(amount, overtime, cause, ignore_invincible, afflicter, ignore_absorb)`
* **Description:** Applies a health delta (positive or negative) to the entity, handling absorption, invincibility, nonlethal thresholds, and damage caps. Triggers `healthdelta` and related events, and handles death logic if health reaches zero.
* **Parameters:**
  - `amount` (number): The health change to apply (negative for damage, positive for healing).
  - `overtime` (boolean): Whether the change occurred over time (e.g., regen or environmental).
  - `cause` (string?): A string describing the cause (e.g., `"fire"`, `"hunger"`, `"regen"`).
  - `ignore_invincible` (boolean?): If true, bypasses invincibility checks.
  - `afflicter` (Entity?): The entity responsible for the damage (for statistics and effects).
  - `ignore_absorb` (boolean?): If true, skips absorption calculations.

### `Health:SetVal(val, cause, afflicter)`
* **Description:** Sets the entity's current health to a specific value, enforcing min/max constraints and handling death if the new value is ≤ 0.
* **Parameters:**
  - `val` (number): Target health value.
  - `cause` (string?): Cause of the health change (used for statistics and logging).
  - `afflicter` (Entity?): Source entity (e.g., killer or healer), passed to death events.

### `Health:Kill()`
* **Description:** Instantly reduces health to zero, triggering death logic (e.g., events, corpse generation). Respects invincibility unless bypassed via internal flag.
* **Parameters:** None.

### `Health:ForceKill()`
* **Description:** Instantly kills the entity, bypassing invincibility and damage modifiers entirely.
* **Parameters:** None.

### `Health:SetPercent(percent, overtime, cause)`
* **Description:** Sets health to a percentage of maximum health (e.g., `0.5` = 50% health).
* **Parameters:**
  - `percent` (number): Target health as a fraction (0–1).
  - `overtime` (boolean): Whether the change was gradual.
  - `cause` (string?): Cause of the change (e.g., `"file_load"`).

### `Health:DoFireDamage(amount, doer, instant)`
* **Description:** Applies fire damage over time. Handles intensity ramp-up, damage rate limiting (`MAX_FIRE_DAMAGE_PER_SECOND`), and fire-state management (low vs full damage).
* **Parameters:**
  - `amount` (number): Raw fire damage per call.
  - `doer` (Entity?): Entity causing the fire damage.
  - `instant` (boolean): If true, applies damage immediately without ramp-up.

### `Health:StartRegen(amount, period, interruptcurrentregen)`
* **Description:** Starts a periodic health regeneration task.
* **Parameters:**
  - `amount` (number): Health to restore per regen tick.
  - `period` (number): Time interval (in seconds) between regen ticks.
  - `interruptcurrentregen` (boolean?, default `true`): If true, cancels existing regen before starting.

### `Health:AddRegenSource(source, amount, period, key)`
* **Description:** Registers a dedicated regeneration source (e.g., food buff or aura) with optional key-based stacking.
* **Parameters:**
  - `source` (Entity?): The entity providing the regen (for cleanup tracking).
  - `amount` (number): Health restored per tick.
  - `period` (number): Regen interval (seconds).
  - `key` (string?): Unique identifier for stacking multiple effects from the same source.

### `Health:RemoveRegenSource(source, key)`
* **Description:** Removes a regen source or specific regen key. Cancels associated tasks and cleans up event listeners.
* **Parameters:**
  - `source` (Entity?): Source entity to remove.
  - `key` (string?): Optional key to remove only a specific regen effect.

### `Health:StopRegen()`
* **Description:** Cancels any active periodic regeneration task.

### `Health:SetPenalty(penalty)`
* **Description:** Sets the health penalty (0–`MAXIMUM_HEALTH_PENALTY`). Disabled if `disable_penalty` is true.
* **Parameters:**
  - `penalty` (number): Penalty value (e.g., 0.5 for 50% health cap reduction).

### `Health:DeltaPenalty(delta)`
* **Description:** Adjusts the penalty by a delta and updates the HUD.
* **Parameters:**
  - `delta` (number): Amount to add to the current penalty.

### `Health:GetMaxWithPenalty()`
* **Description:** Returns the effective maximum health after applying the penalty multiplier.
* **Parameters:** None.

### `Health:IsHurt()`
* **Description:** Returns `true` if current health is below the *penalty-adjusted* maximum.
* **Parameters:** None.

### `Health:IsDead()`
* **Description:** Returns `true` if `currenthealth <= 0`.
* **Parameters:** None.

### `Health:IsInvincible()`
* **Description:** Returns `true` if invincible flag is set or if the entity has the `"temp_invincible"` state tag (used in finite state machines).
* **Parameters:** None.

### `Health:GetPercent()`
* **Description:** Returns current health as a fraction of raw `maxhealth` (not penalty-adjusted).
* **Parameters:** None.

### `Health:GetPercentWithPenalty()`
* **Description:** Returns current health as a fraction of the penalty-adjusted maximum.
* **Parameters:** None.

### `Health:GetDebugString()`
* **Description:** Returns a formatted debug string: `"HP / MaxHP, regen X every Ys"`.
* **Parameters:** None.

### `Health:ForceUpdateHUD(overtime)`
* **Description:** Forces a UI update for health display. Simulates a zero-delta call to refresh HUD visuals.
* **Parameters:**
  - `overtime` (boolean): Whether the update is part of an ongoing effect.

### `Health:RegisterLunarBurnSource(source, flags)`
* **Description:** Registers a lunar burn source (e.g., a moon phase mechanic) and calculates/updates burn flags.
* **Parameters:**
  - `source` (Entity?): The source entity (listens for `onremove` if valid).
  - `flags` (number): Bitmask describing the burn effect.

### `Health:UnregisterLunarBurnSource(source)`
* **Description:** Removes a lunar burn source and recalculates flags; stops lunar burn if no sources remain.
* **Parameters:**
  - `source` (Entity?): Source to remove.

### `Health:GetLunarBurnFlags()`
* **Description:** Returns the current bitmask of lunar burn effects (or `0` if none).
* **Parameters:** None.

### `Health:OnUpdate(dt)`
* **Description:** Clears fire damage state if no fire damage has occurred recently (`FIRE_TIMEOUT = 0.5s`).
* **Parameters:**
  - `dt` (number): Time since last update.

### `Health:GetFireDamageScale()`
* **Description:** Computes the effective fire damage multiplier, incorporating external modifiers and controlled-burn settings.
* **Parameters:** None.

### `Health:OnSave()`
* **Description:** Returns serialized data: `health`, optional `penalty`, and optional `maxhealth` if saved separately.
* **Parameters:** None.

### `Health:OnLoad(data)`
* **Description:** Loads health data from save. Handles `health`, `maxhealth`, `penalty`, and `percent`.
* **Parameters:**
  - `data` (table): Save data loaded by the engine.

### `Health:OnRemoveFromEntity()`
* **Description:** Cleans up component state on removal: stops regen, unregisters lunar burn and regen sources.
* **Parameters:** None.

### `Health:TransferComponent(newinst)`
* **Description:** Transfers fire damage state to a new entity instance (e.g., during item reattachment).
* **Parameters:**
  - `newinst` (Entity): Target entity.

### `Health:SetCurrentHealth(amount)`
* **Description:** Directly sets `currenthealth` without validation or events.
* **Parameters:**
  - `amount` (number): New current health value.

### `Health:SetMaxHealth(amount)`
* **Description:** Sets `maxhealth` and resets `currenthealth` to full, then forces HUD update.
* **Parameters:**
  - `amount` (number): New maximum health.

### `Health:SetMinHealth(amount)`
* **Description:** Sets the `minhealth` threshold.
* **Parameters:**
  - `amount` (number): Minimum health value.

### `Health:SetMaxDamageTakenPerHit(maxdamagetakenperhit)`
* **Description:** Caps maximum damage per hit (used to prevent insta-kills).
* **Parameters:**
  - `maxdamagetakenperhit` (number?): Maximum damage allowed per hit; must be positive (internally negated).

### `Health:SetInvincible(val)`
* **Description:** Toggles invincibility state and fires `invincibletoggle` event.
* **Parameters:**
  - `val` (boolean): True to enable invincibility.

### `Health:CanFadeOut()`
* **Description:** Returns `true` if the entity can fade out after death (no `nofadeout` flag and no existing corpse).
* **Parameters:** None.

## Events & Listeners
- Listens for `onremove` (on regen sources and lunar burn sources) to clean up tasks and event handlers.
- Triggers:
  - `invincibletoggle` (on invincibility toggle)
  - `startfiredamage`, `stopfiredamage`, `changefiredamage`, `firedamage` (on fire damage state changes)
  - `startlunarburn`, `stoplunarburn` (on lunar burn activation)
  - `pre_health_setval`, `minhealth`, `death`, `entity_death`, `healthdelta` (on health changes)
  - `registerlunarburn`, `unregisterlunarburn` (implied; not explicitly in code but event-driven)
  - `stopregen`, `startregen` (implied via task lifecycle)