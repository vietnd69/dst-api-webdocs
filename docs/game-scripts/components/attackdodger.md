---
id: attackdodger
title: Attackdodger
description: Manages evasion mechanics and cooldown periods for entities avoiding attacks.
tags: [combat, ai, mechanics]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: 9dfca8d9
system_scope: combat
---

# Attackdodger

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`AttackDodger` provides a framework for entities to evade incoming attacks. It relies on external callback functions to determine if a dodge is permissible and to handle the logic upon a successful dodge. The component manages a cooldown state to prevent continuous evasion, ensuring balanced gameplay mechanics. It is typically attached to creatures or characters capable of defensive maneuvers.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("attackdodger")

local dodger = inst.components.attackdodger
dodger:SetCooldownTime(10)
dodger:SetCanDodgeFn(function(inst, attacker) return inst:IsAsleep() == false end)
dodger:SetOnDodgeFn(function(inst, attacker) inst.SoundEmitter:PlaySound("dodge") end)

if dodger:CanDodge(attacker) then
    dodger:Dodge(attacker)
end
```

## Dependencies & tags
**Components used:** None identified (accesses `inst` directly).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `cooldowntime` | number | `nil` | Duration in seconds before dodging is allowed again. |
| `oncooldown` | boolean | `false` | Indicates if the dodge ability is currently unavailable. |
| `ondodgefn` | function | `nil` | Callback executed when a dodge successfully occurs. |
| `candodgefn` | function | `nil` | Callback executed to check if a dodge is currently possible. |

## Main functions
### `SetOnDodgeFn(fn)`
*   **Description:** Assigns the function called when a dodge is triggered.
*   **Parameters:** `fn` (function) - Must accept `(inst, attacker)` as arguments.
*   **Returns:** Nothing.

### `SetCanDodgeFn(fn)`
*   **Description:** Assigns the function used to validate if a dodge can occur.
*   **Parameters:** `fn` (function) - Must accept `(inst, attacker)` and return a boolean.
*   **Returns:** Nothing.

### `SetCooldownTime(n)`
*   **Description:** Sets the duration of the cooldown period after a dodge.
*   **Parameters:** `n` (number) - Time in seconds.
*   **Returns:** Nothing.

### `CanDodge(attacker)`
*   **Description:** Evaluates whether the entity can currently dodge an attack from the specified attacker. Checks the condition callback and cooldown state.
*   **Parameters:** `attacker` (entity) - The entity initiating the attack.
*   **Returns:** `boolean` - `true` if dodge is allowed, `false` otherwise.
*   **Error states:** Returns `false` if callbacks are not set or if `oncooldown` is `true`.

### `Dodge(attacker)`
*   **Description:** Executes the dodge logic. Triggers the dodge callback and initiates the cooldown timer if configured.
*   **Parameters:** `attacker` (entity) - The entity initiating the attack.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `ondodgefn` is `nil`.

### `OnRemoveFromEntity()`
*   **Description:** Lifecycle hook called when the component is removed from the entity. Cleans up pending cooldown tasks.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified. This component uses direct function callbacks instead of the global event system.