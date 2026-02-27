---
id: parryweapon
title: Parryweapon
description: Adds parry capability to an entity by checking facing directions and triggering parry logic when an attack is successfully parried.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: 6e328d1a
---

# Parryweapon

## Overview
This component enables an entity (typically a weapon or shield) to perform combat parries. It validates whether an incoming attack can be parried based on the relative facing directions of the defender (`doer`) and attacker, and triggers parry-specific behavior such as custom callbacks and a `"combat_parry"` event.

## Dependencies & Tags
- Adds the tag `"parryweapon"` to its owning entity on initialization.
- Removes the `"parryweapon"` tag when removed from an entity via `OnRemoveFromEntity`.
- Does not directly add or depend on other components; relies on entity components like `Transform`, `locomotor` (for attacker), and `combat` logic external to this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `arc` | number | `178` | Total angular range (in degrees) in front of the entity where a parry is valid. Half-degree thresholds are computed from this value. |
| `onpreparryfn` | function? | `nil` | Optional callback invoked *before* a parry animation/state begins (used for SFX/stategraph integration). Signature: `fn(inst, doer)`. |
| `onparryfn` | function? | `nil` | Optional callback invoked *during* a successful parry (after facing validation). Signature: `fn(inst, doer, attacker, damage)`. |

## Main Functions

### `SetParryArc(arc)`
* **Description:** Sets the angular width (in degrees) of the parry cone in front of the entity.
* **Parameters:**
  * `arc` (number): Total angular range for valid parries (e.g., `178` means ±89° from forward).

### `SetOnPreParryFn(fn)`
* **Description:** Assigns a callback function to be invoked before a parry animation/state is entered. Primarily used for synchronizing animations/SFX. Can be bypassed.
* **Parameters:**
  * `fn` (function?): Function to invoke; receives `(inst, doer)` arguments.

### `SetOnParryFn(fn)`
* **Description:** Assigns a callback function to be invoked *only* when a parry succeeds (i.e., facing checks pass). Used to apply visual/audio feedback or game-state changes.
* **Parameters:**
  * `fn` (function?): Function to invoke; receives `(inst, doer, attacker, damage)` arguments.

### `OnPreParry(doer)`
* **Description:** Invokes the `onpreparryfn` callback (if set), signaling the start of a parry attempt. Used for SFX/stategraph state changes.
* **Parameters:**
  * `doer` (Entity): The entity attempting to parry.

### `EnterParryState(doer, rot, duration)`
* **Description:** Triggers the `"combat_parry"` event on the `doer` to notify the combat system of a successful parry setup. Does not perform validation itself.
* **Parameters:**
  * `doer` (Entity): The entity performing the parry.
  * `rot` (number): Direction (in degrees) of the parry (typically the `doer`’s facing).
  * `duration` (number): Duration (in seconds) of the parry state.

### `TryParry(doer, attacker, damage, weapon, stimuli)`
* **Description:** Determines whether an attack can be parried. Validates facing alignment for both defender and (if necessary) attacker (e.g., for charge attacks). Returns `true` if the parry succeeds and invokes `onparryfn`; otherwise returns `false`. Ignores parries against non-stun stimuli or ground spikes.
* **Parameters:**
  * `doer` (Entity): Entity attempting to parry.
  * `attacker` (Entity): Source of the incoming attack.
  * `damage` (number): Damage value of the attack (passed to `onparryfn`).
  * `weapon` (Entity): Weapon used to attack (unused in logic).
  * `stimuli` (string?): Type of stimuli causing the attack; parrying fails if not `"stun"` and not `nil`.

## Events & Listeners
- **Listens to:** None
- **Triggers:** `"combat_parry"` (via `EnterParryState`) with payload `{ weapon = self.inst, direction = rot, duration = duration }`.