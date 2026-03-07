---
id: damagereflect
title: Damagereflect
description: Provides a callback-based mechanism for reflecting damage back to attackers, typically used by the combat component.
tags: [combat, callback, damage]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 79afb2ef
system_scope: combat
---

# Damagereflect

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Damagereflect` is a lightweight component that enables entities to reflect a portion of incoming damage back to the attacker. It is designed to work in conjunction with the `combat` component and uses a configurable callback function (`reflectdamagefn`) to determine how much damage is reflected and whether special damage (e.g., fire, cold) is applied. If no custom callback is set, it defaults to reflecting a fixed amount of physical damage.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("damagereflect")

-- Set a custom reflection function
inst.components.damagereflect:SetReflectDamageFn(function(inst, attacker, damage, weapon, stimuli, spdamage)
    return damage * 0.5, spdamage or 0  -- reflect 50% of damage
end)

-- Optionally adjust the default reflected damage value
inst.components.damagereflect:SetDefaultDamage(20)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `reflectdamagefn` | function or nil | `nil` | Optional callback used to compute reflected damage. Signature: `(inst, attacker, damage, weapon, stimuli, spdamage) → (reflected_damage, reflected_spdamage)`. |
| `defaultdamage` | number | `10` | Fallback damage value used when no callback is defined or callback returns `nil` for damage. |

## Main functions
### `SetReflectDamageFn(fn)`
* **Description:** Sets the callback function responsible for computing reflected damage.  
* **Parameters:** `fn` (function or nil) – A function with signature `(inst, attacker, damage, weapon, stimuli, spdamage) → (damage, spdamage)`, or `nil` to disable custom reflection.  
* **Returns:** Nothing.  
* **Error states:** None.

### `SetDefaultDamage(value)`
* **Description:** Changes the default reflected damage value used when no callback is active or when the callback returns `nil` for damage.  
* **Parameters:** `value` (number) – The new default damage amount to reflect.  
* **Returns:** Nothing.  

### `GetReflectedDamage(attacker, damage, weapon, stimuli, spdamage)`
* **Description:** Computes and returns the amount of damage to reflect back to the attacker. Calls the reflection callback if set, otherwise uses `defaultdamage`.  
* **Parameters:**  
  - `attacker` (Entity or nil) – The entity dealing the original damage.  
  - `damage` (number) – The amount of base damage dealt.  
  - `weapon` (Entity or nil) – The weapon used in the attack, if any.  
  - `stimuli` (string or nil) – Type of damage stimulus (e.g., `"physical"`, `"fire"`).  
  - `spdamage` (number or nil) – Special damage amount, if any.  
* **Returns:**  
  - `reflected_damage` (number) – The damage amount reflected; falls back to `defaultdamage` if callback returns `nil`.  
  - `reflected_spdamage` (number or nil) – Special damage reflected, returned directly from the callback if provided.  
* **Error states:** If `reflectdamagefn` returns `nil` for damage, `defaultdamage` is used instead. If no callback is set, only `defaultdamage` is returned (no special damage).

## Events & listeners
Not applicable
