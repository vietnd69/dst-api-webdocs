---
id: healer
title: Healer
description: Applies healing to a target entity and consumes the healer item upon use.
tags: [healing, consumable, utility]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c508c8c5
system_scope: entity
---

# Healer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Healer` component enables an entity (typically a consumable item) to heal a target's `health` component. It supports configurable healing amount, conditional healing via callback functions, multiplier application via the `efficientuser` component, and automatic consumption of the healer item upon successful use.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("healer")
inst.components.healer:SetHealthAmount(TUNING.HEALING_LARGE)
inst.components.healer:SetOnHealFn(function(inst, target, doer)
    print(target_prefab .. " was healed by " .. doer_prefab)
end)
-- Later, during interaction:
inst.components.healer:Heal(target_entity, doer_entity)
```

## Dependencies & tags
**Components used:** `health`, `efficientuser`, `stackable`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `health` | number | `TUNING.HEALING_SMALL` | The base amount of health restored per heal. |
| `canhealfn` | function? | `nil` | Optional callback: `(healer_inst, target_inst, doer_inst) -> valid: boolean, reason: string?` |
| `onhealfn` | function? | `nil` | Optional callback: `(healer_inst, target_inst, doer_inst) -> void` |

## Main functions
### `SetHealthAmount(amount)`
* **Description:** Sets the base healing amount applied per use.
* **Parameters:** `amount` (number) – the healing value to assign.
* **Returns:** Nothing.

### `SetOnHealFn(fn)`
* **Description:** Assigns a callback function that executes *after* successful healing.
* **Parameters:** `fn` (function) – signature `(healer_inst, target_inst, doer_inst)`.
* **Returns:** Nothing.

### `SetCanHealFn(fn)`
* **Description:** Assigns a validation callback that determines if healing is allowed before execution.
* **Parameters:** `fn` (function) – signature `(healer_inst, target_inst, doer_inst) -> valid: boolean, reason: string?`.
* **Returns:** Nothing.

### `Heal(target, doer)`
* **Description:** Attempts to heal the `target` entity. Returns success status, consumes the healer item on success.
* **Parameters:**
  - `target` (Entity) – Entity to heal (must have `health` component).
  - `doer` (Entity) – Entity using the healer (used for multiplier checks and callbacks).
* **Returns:** `true` on successful heal, `false` otherwise (optionally with a `reason` string).
* **Error states:** 
  - Returns `false` if `target` lacks the `health` component.
  - Returns `false, reason` if `canhealfn` returns `false`.
  - Does not apply healing if `target.components.health.canheal` is `false`, but still does *not* consume the item.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
