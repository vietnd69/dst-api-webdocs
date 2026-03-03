---
id: fuelmaster
title: Fuelmaster
description: Manages fuel-burning multiplier bonuses for entities that consume fuel, such as fire sources or lanterns.
tags: [fuel, entity, utility]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c310f291
system_scope: entity
---

# Fuelmaster

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Fuelmaster` provides a mechanism to dynamically adjust the fuel efficiency multiplier for an entity. It is designed to be attached to entities that burn fuel (e.g., campfires, lanterns, beefalo ovens) and allows external systems (e.g., upgrades, environment effects, or character modifiers) to modify how long fuel lasts or how efficiently it burns. The component supports a static multiplier (`bonusmult`) and a dynamic callback function (`bonusfn`) that can compute per-item adjustments.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fuelmaster")
inst.components.fuelmaster:SetBonusMult(1.5)
inst.components.fuelmaster:SetBonusFn(function(inst, item, target) return item.bonus or 1 end)
local multiplier = inst.components.fuelmaster:GetBonusMult(item, target)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bonusmult` | number | `1` | A constant multiplier applied to all fuel consumption/burn calculations. |
| `bonusfn` | function or nil | `nil` | An optional callback function that computes per-item bonuses. |

## Main functions
### `SetBonusMult(mult)`
*   **Description:** Sets the constant bonus multiplier applied to fuel usage calculations.
*   **Parameters:** `mult` (number) — the multiplier to apply (e.g., `1.5` for +50% fuel efficiency).
*   **Returns:** Nothing.

### `SetBonusFn(fn)`
*   **Description:** Sets the optional callback function used to compute item-specific bonuses. The function can override or adjust the base `bonusmult` dynamically based on the item being used and the target entity.
*   **Parameters:** `fn` (function) — a function of the form `fn(inst, item, target)`, expected to return a numeric multiplier.
*   **Returns:** Nothing.

### `GetBonusMult(item, target)`
*   **Description:** Computes and returns the final fuel multiplier, combining the `bonusfn` result (if present) and `bonusmult`. Used by other systems (e.g., fuel components) to determine how fuel should be consumed.
*   **Parameters:**  
    - `item` (any) — the fuel item being consumed (e.g., a torch, log, or bulb).  
    - `target` (any) — the entity consuming the fuel (typically `self.inst`).  
*   **Returns:** number — the effective multiplier. Defaults to `1` if `bonusfn` is `nil`.  
*   **Error states:** No explicit error handling; returns `bonusmult` alone if `bonusfn` is `nil`. Behavior depends on the correctness of `bonusfn`'s return value.

## Events & listeners
None identified
