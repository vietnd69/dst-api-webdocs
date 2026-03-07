---
id: stunnable
title: Stunnable
description: Tracks incoming damage over time and triggers a stun effect when damage exceeds a threshold within a specified window.
tags: [combat, ai, status_effect]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e749c6c3
system_scope: combat
---

# Stunnable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Stunnable` is a combat-related component that enables entities to be stunned when subjected to sufficient damage within a rolling time window. It records recent damage events, computes the total damage over a defined period (`stun_period`), and compares it against a threshold (`stun_threshold`). If exceeded, the entity enters a stunned state for a fixed duration. The component automatically resets and increases the next stun threshold upon successful stuns, providing progressive stun resistance.

This component is typically added to aggressive enemies or bosses that should respond dynamically to sustained attacks, such as during boss fights (e.g.,bee queens, bosses in the grotto or quagmire).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("stunnable")
inst.components.stunnable.stun_threshold = 1200
inst.components.stunnable.stun_duration = 5
-- Optional: customize other parameters (e.g., stun_period, stun_cooldown, stun_resist)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage` | table | `{}` | A map of timestamps to absolute damage values, used to compute damage over the `stun_period`. |
| `stun_threshold` | number | `1000` | Damage total required within `stun_period` to trigger a stun. Increases by `stun_resist` after each stun. |
| `stun_period` | number | `5` | Time window (in seconds) over which damage is summed. |
| `stun_duration` | number | `10` | Duration (in seconds) the entity remains stunned once triggered. |
| `stun_resist` | number | `150` | Amount added to `stun_threshold` after each successful stun, making subsequent stuns harder. |
| `stun_cooldown` | number | `60` | Minimum time (in seconds) between stun triggers. Prevents rapid re-stun. |
| `valid_stun_time` | number | `0` | Timestamp after which the entity can be stunned again. Updated on each stun. |

## Main functions
### `Stun()`
* **Description:** Initiates the stunned state: clears recorded damage, sets the stun cooldown, increases `stun_threshold`, fires the `stunned` event, and schedules `stun_finished` after `stun_duration`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No known failure conditions; safe to call repeatedly.

### `TakeDamage(damage)`
* **Description:** Records incoming damage and checks if the damage sum over the `stun_period` exceeds `stun_threshold`. If so, calls `Stun()`.
* **Parameters:** `damage` (number) — the amount of damage taken. Absolute value is used.
* **Returns:** Nothing.
* **Error states:** Early return (no effect) if the entity is currently within its `valid_stun_time` (i.e., under the `stun_cooldown`).

### `GetDamageInPeriod()`
* **Description:** Computes the total damage within the last `stun_period` seconds, and cleans up expired entries from the `damage` table.
* **Parameters:** None.
* **Returns:** (number) — total damage within the time window.
* **Error states:** None.

## Events & listeners
- **Listens to:** `healthdelta` — triggers `TakeDamage(amount)` with the damage amount.
- **Pushes:** `stunned` — fired when a stun is triggered.  
- **Pushes:** `stun_finished` — fired after `stun_duration` seconds, indicating the stun has ended.
