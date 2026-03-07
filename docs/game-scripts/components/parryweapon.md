---
id: parryweapon
title: Parryweapon
description: Provides parry detection logic and event hooks for combat weapons, validating whether an attack can be successfully parried based on angular alignment and stimuli type.
tags: [combat, weapon]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6e328d1a
system_scope: combat
---

# Parryweapon

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Parryweapon` component enables a weapon entity to participate in the parry mechanic during combat. It determines whether an incoming attack can be parried by checking the relative angles between the defender (`doer`) and the attacker, as well as excluding invalid stimuli (e.g., ground spikes or stun damage). It supports optional callback hooks for pre-parry and parry events, primarily intended for stategraph animation synchronization but not required for core logic.

## Usage example
```lua
local weapon = CreateEntity()
weapon:AddComponent("parryweapon")
weapon.components.parryweapon:SetParryArc(90)
weapon.components.parryweapon:SetOnParryFn(function(inst, doer, attacker, damage)
    print("Weapon parried an attack from", attacker:GetName())
end)
```

## Dependencies & tags
**Components used:** `locomotor` (via `attacker.components.locomotor` in `TryParry`)
**Tags:** Adds and removes the `"parryweapon"` tag on attach/detach.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `arc` | number | `178` | Total angular width (in degrees) within which a parry is possible. |
| `onpreparryfn` | function? | `nil` | Optional callback invoked before parry resolution. Signature: `fn(inst, doer)`. |
| `onparryfn` | function? | `nil` | Optional callback invoked upon successful parry. Signature: `fn(inst, doer, attacker, damage)`. |

## Main functions
### `SetParryArc(arc)`
*   **Description:** Sets the angular width of the parry arc. The effective parry zone extends ±`arc/2` degrees from the defender's facing direction.
*   **Parameters:** `arc` (number) — total angular threshold in degrees.
*   **Returns:** Nothing.

### `SetOnPreParryFn(fn)`
*   **Description:** Registers a callback to be invoked when parry preparation begins (e.g., before animation triggers). This hook is marked as optional and can be bypassed by game logic.
*   **Parameters:** `fn` (function?) — function to call, with signature `fn(inst, doer)`.
*   **Returns:** Nothing.

### `SetOnParryFn(fn)`
*   **Description:** Registers a callback to be invoked when a parry succeeds. Used to trigger side effects such as visual/sound feedback.
*   **Parameters:** `fn` (function?) — function to call, with signature `fn(inst, doer, attacker, damage)`.
*   **Returns:** Nothing.

### `OnPreParry(doer)`
*   **Description:** Triggers the `onpreparryfn` callback if set.
*   **Parameters:** `doer` (Entity) — the entity attempting to parry (the defender).
*   **Returns:** Nothing.

### `EnterParryState(doer, rot, duration)`
*   **Description:** Notifies the defender that a parry has occurred by pushing a `"combat_parry"` event with weapon and direction data.
*   **Parameters:**
    *   `doer` (Entity) — the entity attempting to parry.
    *   `rot` (number) — rotation (degrees) indicating parry direction.
    *   `duration` (number) — how long the parry state lasts, in seconds.
*   **Returns:** Nothing.

### `TryParry(doer, attacker, damage, weapon, stimuli)`
*   **Description:** Evaluates whether the `doer` can successfully parry the `attacker`’s strike based on angular alignment and stimuli. Returns `true` if the parry succeeds and the parry callback (if any) has been invoked.
*   **Parameters:**
    *   `doer` (Entity) — the entity performing the parry.
    *   `attacker` (Entity) — the entity launching the attack.
    *   `damage` (any) — unused in logic, passed to `onparryfn`.
    *   `weapon` (any) — unused in logic, passed to `onparryfn`.
    *   `stimuli` (string?) — type of damage stimuli; `"stun"` blocks parry; `nil` allows parry.
*   **Returns:** `true` if parry succeeds, `false` otherwise.
*   **Error states:**
    *   Returns `false` if `stimuli` is `"stun"` or not `nil` but not `"stun"` (i.e., most non-stun cases are allowed unless explicitly excluded).
    *   Returns `false` if `attacker:HasTag("groundspike")`.
    *   Returns `false` if `doer` is not facing `attacker` within the parry arc, *and* the attacker either lacks a `locomotor` component or is not facing `doer` within the parry arc.

## Events & listeners
- **Pushes:** `"combat_parry"` — fired via `doer:PushEvent(...)` in `EnterParryState`, with payload `{ weapon = self.inst, direction = rot, duration = duration }`.

## Constructor
- **Signature:** `Parryweapon = Class(function(self, inst) ... end)`
- **Behavior:** Attaches `self.inst` as the owning entity and immediately adds the `"parryweapon"` tag.

## OnRemoveFromEntity
- **Behavior:** Removes the `"parryweapon"` tag when the component is detached from its entity.
