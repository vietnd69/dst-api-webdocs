---
id: healer
title: Healer
description: Provides a reusable item component that restores health to valid targets when used, consuming itself afterward.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: c508c8c5
---

# Healer

## Overview
The `Healer` component enables an entity (typically a consumable item) to heal a target entity by restoring a configurable amount of health. It supports custom validation logic, heal modifiers via `efficientuser`, and post-heal effects, while consuming or removing itself upon successful use.

## Dependencies & Tags
- `inst.components.health` (on target entity): Required for applying healing; healing is skipped if missing or `canheal` is false.
- `inst.components.efficientuser` (on doer entity): Optional; applies a multiplier to the heal amount.
- `inst.components.stackable` (on healer entity): Optional; if present and the item is part of a stack, only one unit is consumed; otherwise, the entire item entity is removed.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `health` | `number` | `TUNING.HEALING_SMALL` | Base amount of health restored per use. |
| `canhealfn` | `function?` | `nil` | Optional callback `(healer, target, doer) → valid, reason` to determine if healing is allowed. |
| `onhealfn` | `function?` | `nil` | Optional callback `(healer, target, doer)` executed after successful healing. |

## Main Functions

### `SetHealthAmount(health)`
* **Description:** Updates the base health amount restored by this healer.
* **Parameters:**
  * `health` (`number`): New heal value.

### `SetOnHealFn(fn)`
* **Description:** Sets a callback function invoked after a successful heal operation.
* **Parameters:**
  * `fn` (`function`): Function with signature `(healer, target, doer)`.

### `SetCanHealFn(fn)`
* **Description:** Sets a predicate function used to validate whether the healer can act on a given target.
* **Parameters:**
  * `fn` (`function`): Function with signature `(healer, target, doer)`, returning `valid (boolean), reason? (string)`.

### `Heal(target, doer)`
* **Description:** Attempts to heal the `target` entity using `doer` as the source. Applies modified healing, checks validity, and consumes the healer item.
* **Parameters:**
  * `target` (`Entity`): Entity to heal.
  * `doer` (`Entity`): Entity performing the heal (used for efficiency multipliers and validation context).
* **Returns:**
  * `true` on success.
  * `false, reason` if healing is blocked by `canhealfn` or the target is unhealable.

## Events & Listeners
None.