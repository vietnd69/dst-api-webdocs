---
id: attackdodger
title: Attackdodger
description: Manages attack dodging logic including cooldown state and custom dodge/can-dodge behavior callbacks for an entity.
tags: [combat, ai, utility]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9dfca8d9
system_scope: combat
---

# Attackdodger

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AttackDodger` provides a flexible, callback-driven system for controlling when and how an entity can dodge incoming attacks. It supports configurable cooldowns and custom logic for determining whether a dodge attempt is allowed and what happens when a dodge succeeds. The component is typically attached to entities that need dynamic dodge mechanics (e.g., bosses or agile creatures), and integrates with the combat system via custom functions rather than hardcoded behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("attackdodger")

-- Configure behavior
inst.components.attackdodger:SetCooldownTime(3)
inst.components.attackdodger:SetCanDodgeFn(function(ent, attacker) return ent:HasTag("player") end)
inst.components.attackdodger:SetOnDodgeFn(function(ent, attacker) ent:PushEvent("dodged", { attacker = attacker }) end)

-- Later, when an attack is incoming:
if inst.components.attackdodger:CanDodge(attacker) then
    inst.components.attackdodger:Dodge(attacker)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity reference | `nil` | The entity instance that owns this component. |
| `ondodgefn` | function | `nil` | Callback invoked when a dodge succeeds (`(entity, attacker)`). |
| `candodgefn` | function | `nil` | Callback invoked to determine if dodging is allowed (`(entity, attacker)`). |
| `cooldowntime` | number | `nil` | Duration (in seconds) of the dodge cooldown. If `nil`, no cooldown is enforced. |
| `oncooldown` | boolean | `false` | Whether the entity is currently in dodge cooldown. |

## Main functions
### `SetOnDodgeFn(fn)`
* **Description:** Sets the callback function executed when an attack is successfully dodged.
* **Parameters:** `fn` (function) – A function accepting two arguments: the dodging entity and the attacker entity.
* **Returns:** Nothing.

### `SetCanDodgeFn(fn)`
* **Description:** Sets the callback function used to determine whether dodging is currently allowed.
* **Parameters:** `fn` (function) – A function accepting two arguments: the candidate dodging entity and the attacker entity; must return a boolean (or truthy/falsy value).
* **Returns:** Nothing.

### `SetCooldownTime(n)`
* **Description:** Configures the duration of the dodge cooldown period after a successful dodge.
* **Parameters:** `n` (number) – Cooldown duration in seconds. If `nil`, cooldown is disabled.
* **Returns:** Nothing.

### `CanDodge(attacker)`
* **Description:** Evaluates whether the entity can currently dodge an attack from the specified attacker, based on `candodgefn` and cooldown state.
* **Parameters:** `attacker` (Entity reference or `nil`) – The entity attempting to attack; passed to `candodgefn`.
* **Returns:** `boolean` – `true` if dodging is allowed, `false` otherwise.
* **Error states:** Returns `true` if either `candodgefn` or cooldown logic is missing but the other condition is met; no robust fallback is enforced.

### `Dodge(attacker)`
* **Description:** Executes a successful dodge: invokes `ondodgefn` and starts the cooldown timer if configured.
* **Parameters:** `attacker` (Entity reference or `nil`) – The attacker entity; passed to `ondodgefn`.
* **Returns:** Nothing.
* **Error states:** No cooldown task is started if `cooldowntime` is `nil`; no callback is invoked if `ondodgefn` is `nil`.

### `OnRemoveFromEntity()`
* **Description:** Cleanup method called when the component is removed from its entity; cancels any pending cooldown task.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None
