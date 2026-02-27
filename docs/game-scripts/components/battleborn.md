---
id: battleborn
title: Battleborn
description: Manages a combat-based resource that accumulates on attacks and triggers a restorative effect upon reaching a threshold.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
source_hash: b0893973
---

# Battleborn

## Overview
This component implements a combat-based resource system, primarily used by the character Wigfrid. It allows an entity to accumulate a "battleborn" value by attacking other creatures. The amount gained is proportional to the damage dealt relative to the victim's maximum health. This accumulated value decays over time if the entity stops fighting. Once the value surpasses a set threshold, it is consumed to trigger a beneficial effect, such as restoring the entity's health and sanity, or repairing their equipped armor.

## Dependencies & Tags
*   **Dependencies:**
    *   `health`: Used to check if the entity is hurt and to apply health restoration.
    *   `sanity`: Used to apply sanity restoration.
    *   `combat`: Used to retrieve damage values.
    *   `inventory`: Used to access and repair equipped items.
*   **Tags:**
    *   Checks for the `"battleborn_repairable"` tag on equipped items to determine if they can be repaired by the battleborn effect.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `battleborn` | number | `0` | The current accumulated battleborn value. |
| `battleborn_time` | number | `0` | The timestamp of the last attack that generated battleborn. Used to calculate decay. |
| `battleborn_trigger_threshold`| number | `TUNING.BATTLEBORN_TRIGGER_THRESHOLD` | The value `battleborn` must exceed to trigger the beneficial effect. |
| `battleborn_decay_time` | number | `TUNING.BATTLEBORN_DECAY_TIME` | The duration over which the `battleborn` value will decay back to zero. |
| `battleborn_store_time` | number | `TUNING.BATTLEBORN_STORE_TIME` | A grace period after an attack before the `battleborn` value begins to decay. |
| `battleborn_bonus` | number | `0` | A multiplier used in the formula for calculating battleborn gain per attack. |
| `clamp_min` | number | `0.33` | The minimum amount of battleborn that can be gained from a single valid attack. |
| `clamp_max` | number | `2.0` | The maximum amount of battleborn that can be gained from a single valid attack. |
| `allow_zero` | boolean | `true` | If `true`, attacks that deal zero damage can still trigger battleborn gain (clamped to `clamp_min`). |

## Main Functions
### `SetTriggerThreshold(threshold)`
* **Description:** Overrides the default trigger threshold for the battleborn effect.
* **Parameters:**
    * `threshold` (number): The new `battleborn` value required to trigger the effect.

### `SetDecayTime(time)`
* **Description:** Overrides the default decay time.
* **Parameters:**
    * `time` (number): The new duration, in seconds, over which the `battleborn` value decays to zero.

### `SetStoreTime(time)`
* **Description:** Overrides the default store time (grace period).
* **Parameters:**
    * `time` (number): The new duration, in seconds, after an attack before decay begins.

### `SetOnTriggerFn(ontriggerfn)`
* **Description:** Assigns a custom callback function to be executed when the battleborn effect triggers.
* **Parameters:**
    * `ontriggerfn` (function): The function to call. It will receive the entity instance and the amount of `battleborn` consumed as arguments.

### `SetBattlebornBonus(bonus)`
* **Description:** Sets the bonus multiplier used in calculating battleborn gain.
* **Parameters:**
    * `bonus` (number): The new multiplier value.

### `SetSanityEnabled(enabled)`
* **Description:** Enables or disables the sanity restoration portion of the battleborn effect.
* **Parameters:**
    * `enabled` (boolean): `true` to enable sanity gain, `false` to disable.

### `SetHealthEnabled(enabled)`
* **Description:** Enables or disables the health restoration and equipment repair portion of the battleborn effect.
* **Parameters:**
    * `enabled` (boolean): `true` to enable health/repair effects, `false` to disable.

### `SetClampMin(min)`
* **Description:** Sets the minimum amount of battleborn that can be gained from a single attack.
* **Parameters:**
    * `min` (number): The new minimum gain value.

### `SetClampMax(max)`
* **Description:** Sets the maximum amount of battleborn that can be gained from a single attack.
* **Parameters:**
    * `max` (number): The new maximum gain value.

### `SetValidVictimFn(fn)`
* **Description:** Assigns a custom function used to validate if an attacked creature should grant battleborn. If not set, all victims are considered valid.
* **Parameters:**
    * `fn` (function): The validation function. It receives the victim entity as an argument and should return `true` if the victim is valid.

### `OnAttack(data)`
* **Description:** Internal handler for the `onattackother` event. It calculates battleborn gain based on damage dealt, handles the decay of existing battleborn, and if the trigger threshold is met, consumes the battleborn to apply health/sanity/repair effects.
* **Parameters:**
    * `data` (table): The event data table, which must contain a `target` key referencing the entity that was attacked.

### `OnDeath()`
* **Description:** Internal handler for the `death` event. It resets the `battleborn` value to zero.
* **Parameters:** None.

## Events & Listeners
*   `onattackother`: Listens for this event on the entity to trigger the `OnAttack` function, which is the core of the component's logic.
*   `death`: Listens for this event to call `OnDeath` and reset the accumulated `battleborn` value.