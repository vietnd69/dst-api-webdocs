---
id: oldager
title: Oldager
description: The Oldager component manages age-related time damage and health degradation for entities, simulating aging effects over time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 4b8161ed
---

# Oldager

## Overview
The Oldager component implements a time-based damage system that tracks and processes age-related health degradation (or reversal) for an entity. It uses a "damage remaining" meter to accumulate time damage, which is then converted into actual health damage over time via the entity's health component. It integrates with `player_classified` to synchronize age progression percentages to clients and supports special logic for healing sources that may reverse aging.

## Dependencies & Tags
- `inst.components.health`: Required for applying time damage; accessed frequently.
- `inst.player_classified`: Required for client-side sync of age percentage (`oldager_yearpercent`).
- Adds public property `damage_per_second` with custom setter `onset_damage_per_second`.
- Uses `inst:StartUpdatingComponent(self)` to register for periodic updates.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `base_rate` | `number` | `1/40` | Base aging rate (years per second) before modifiers. |
| `rate` | `number` | `1` | Multiplicative modifier applied to aging rate (todo:计划改为 source modifier list). |
| `year_timer` | `number` | `0` | Fractional part of accumulated years (0 ≤ `year_timer` < 1). |
| `damage_remaining` | `number` | `0` | Accumulated unprocessed time damage (positive = aging forward, negative = aging backward). |
| `damage_per_second` | `number` | `0` | Current rate of time damage processing (years per second). |
| `valid_healing_causes` | `table` | `{}` | Set of causes (strings) that, when healing the entity, reverse aging instead of normal healing. |
| `_taking_time_damage` | `boolean` | `nil` | Internal flag to prevent recursive age-damage loops. |

## Main Functions

### `AddValidHealingCause(cause_name)`
* **Description:** Registers a healing cause that, when applied, reverses aging (i.e., reduces age) instead of restoring health in the normal direction.
* **Parameters:**
  * `cause_name` (string): The identifier for the healing source to be recognized as an age-reversing cause.

### `OnTakeDamage(amount, overtime, cause, ignore_invincible, afflicter, ignore_absorb)`
* **Description:** Handles incoming damage or healing events. If `amount < 0` (healing) or the `cause` is registered in `valid_healing_causes`, it treats the event as time healing and adjusts `damage_remaining` and `damage_per_second` accordingly (reversing aging). Otherwise, it normalizes and ignores the event.
* **Parameters:**
  * `amount` (number): Health delta (negative = healing, positive = damage).
  * Other parameters are accepted but not used in the current implementation.

### `OnUpdate(dt)`
* **Description:** The core update loop. Processes time damage: converts `damage_remaining` into actual health damage over `dt`, updates `year_timer`, and synchronizes client state. Handles transitions across zero damage, death, and full health states.
* **Parameters:**
  * `dt` (number): Time delta (seconds) since last update.

### `StopDamageOverTime()`
* **Description:** Immediately halts ongoing time damage by resetting `damage_remaining` and `damage_per_second`, and forces a health component update to refresh HUD/badge indicators.
* **Parameters:** None.

### `GetCurrentYearPercent()`
* **Description:** Returns the current fractional year value (`year_timer`), representing the percentage of a year completed.
* **Parameters:** None.

### `LongUpdate(dt)`
* **Description:** Alias for `OnUpdate(dt)`. Allows integration with systems expecting a `LongUpdate` interface.
* **Parameters:**
  * `dt` (number): Time delta.

### `FastForwardDamageOverTime()`
* **Description:** Instantly processes all remaining time damage if currently aging forward. Halts further aging after completion.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string summarizing key internal state variables for logging or debugging.
* **Parameters:** None.

## Events & Listeners
- Listens for: None (no `inst:ListenForEvent` calls).
- Pushes events: None (no `inst:PushEvent` calls).