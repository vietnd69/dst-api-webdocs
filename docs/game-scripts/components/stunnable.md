---
id: stunnable
title: Stunnable
description: A combat component that enables entities to be stunned when receiving sufficient damage within a short time window.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: e749c6c3
---

# Stunnable

## Overview
The `Stunnable` component implements a damage-over-time stun mechanic: when an entity receives a cumulative amount of damage (greater than `stun_threshold`) within a defined time window (`stun_period`), the entity becomes stunned for a fixed duration. It tracks incoming damage in a rolling window, disables further stuns during a cooldown period (`stun_cooldown`), and emits events to signal when the stun begins and ends.

## Dependencies & Tags
- Listens to the `"healthdelta"` event on the entity (`inst`) to detect incoming damage.
- Pushes `"stunned"` and `"stun_finished"` events to the entity.
- No other components or tags are explicitly added or required by this script.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage` | `table` | `{}` | A dictionary mapping timestamps (floats) to absolute damage amounts received. Used for computing rolling damage within `stun_period`. |
| `stun_threshold` | `number` | `1000` | The total damage required within `stun_period` to trigger a stun. Increases by `stun_resist` after each stun. |
| `stun_period` | `number` | `5` | The time window (in seconds) over which damage is summed to determine if stun threshold is met. |
| `stun_duration` | `number` | `10` | How long (in seconds) the entity remains stunned once triggered. |
| `stun_resist` | `number` | `150` | The amount added to `stun_threshold` after each stun, making future stuns harder to trigger. |
| `stun_cooldown` | `number` | `60` | Seconds after a stun before new stun attempts are processed (i.e., `TakeDamage` ignores damage during this time). |
| `valid_stun_time` | `number` | `0` | Timestamp indicating when the current stun cooldown ends; damage is only considered for stun potential after this time. |

## Main Functions

### `Stunnable:Stun()`
* **Description:** Triggers the stun state. Resets the damage log, extends the stun threshold by `stun_resist`, sets a cooldown timestamp, and schedules a delayed `"stun_finished"` event.
* **Parameters:** None.

### `Stunnable:TakeDamage(damage)`
* **Description:** Records incoming damage if outside the stun cooldown; checks if the total damage in the current window exceeds `stun_threshold`. If so, calls `Stun()`.
* **Parameters:**
  * `damage` (number): The damage amount from the `"healthdelta"` event. Its absolute value is recorded.

### `Stunnable:GetDamageInPeriod()`
* **Description:** Calculates and returns the sum of damage recorded within the last `stun_period` seconds. Also prunes outdated entries from the `damage` table to keep memory usage reasonable.
* **Parameters:** None.

## Events & Listeners
- **Listens to:**
  - `"healthdelta"` → triggers `TakeDamage(data.amount)`
- **Triggers:**
  - `"stunned"` — pushed immediately upon initiating stun.
  - `"stun_finished"` — pushed via `DoTaskInTime` after `stun_duration` seconds.