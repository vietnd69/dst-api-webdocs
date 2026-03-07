---
id: wathgrithr_shield
title: Wathgrithr Shield
description: A wearable shield that provides defensive parry capabilities and periodic offensive damage via AoE when discharged, exclusive to the Wathgrithr character.
tags: [combat, shield, parry, cooldown, wathgrithr]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b22d9a85
system_scope: combat
---

# Wathgrithr Shield

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wathgrithr_shield` prefab implements a character-specific combat item that functions as both a defensive parry weapon and a limited-use spell-carrying AoE device. It relies heavily on the `parryweapon`, `weapon`, `armor`, `rechargeable`, `aoetargeting`, and `equippable` components to manage parry timing, damage output, cooldown cycles, and equip/unequip visual effects. The shield is tied to the Wathgrithr character's skill tree, where specific skills modify parry duration and bonus damage mechanics.

## Usage example
```lua
--Typically instantiated via Prefab system; usage by modders involves modifying tuning values or extending behavior:
local shield = Prefab("wathgrithr_shield", fn, assets, prefabs)
-- Modders may override the OnParryFn or SpellFn by reassigning component callbacks after construction.
```

## Dependencies & tags
**Components used:** `aoetargeting`, `aoespell`, `armor`, `equippable`, `parryweapon`, `rechargeable`, `weapon`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`, `soundemitter`, `inventoryphysics`, `hauntable`
**Tags:** `toolpunch`, `battleshield`, `shield`, `parryweapon`, `weapon`, `rechargeable`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_lastparrytime` | number (optional) | `nil` | Stores timestamp of the last successful parry for bonus damage calculation. |
| `_bonusdamage` | number (optional) | `nil` | Stores calculated bonus damage from the last parry when `wathgrithr_arsenal_shield_3` is active. |

## Main functions
### `ReticuleTargetFn()`
*   **Description:** Returns a fixed target position 6.5 units ahead of the player in local space for reticule placement.
*   **Parameters:** None.
*   **Returns:** `Vector3` — world-space target position.

### `ReticuleMouseTargetFn(inst, mousepos)`
*   **Description:** Calculates a target position on a circle of radius 6.5 around the shield owner based on mouse position.
*   **Parameters:**  
    `inst` (Entity) — the shield instance.  
    `mousepos` (Vector3?) — mouse position in world space; if `nil`, returns current reticule position.
*   **Returns:** `Vector3` — interpolated target on the 6.5-unit radius circle.

### `ReticuleUpdatePositionFn(inst, pos, reticule, ease, smoothing, dt)`
*   **Description:** Aligns the reticule with the shield owner's position and rotates it toward the target position.
*   **Parameters:**  
    `inst` (Entity) — the shield instance.  
    `pos` (Vector3) — target position.  
    `reticule` (Entity) — the reticule entity to update.  
    `ease` (boolean) — whether to interpolate rotation.  
    `smoothing` (number) — interpolation factor.  
    `dt` (number) — delta time for interpolation.
*   **Returns:** Nothing.

### `OnEquip(inst, owner)`
*   **Description:** Handles equip logic: updates owner's animation state, applies skin overrides if present, and resets cooldown if near full charge.
*   **Parameters:**  
    `inst` (Entity) — the shield instance.  
    `owner` (Entity) — the character equipping the shield.
*   **Returns:** Nothing.

### `OnUnequip(inst, owner)`
*   **Description:** Reverses `OnEquip`: clears animation overrides and restores normal arm animations.
*   **Parameters:**  
    `inst` (Entity) — the shield instance.  
    `owner` (Entity) — the character unequipping the shield.
*   **Returns:** Nothing.

### `SpellFn(inst, doer, pos)`
*   **Description:** Triggers a parry state on `doer` and discharges the cooldown. Adjusts parry duration based on skill tree activation.
*   **Parameters:**  
    `inst` (Entity) — the shield instance.  
    `doer` (Entity) — the character performing the parry.  
    `pos` (Vector3) — the target position for parry direction.
*   **Returns:** Nothing.

### `OnParry(inst, doer, attacker, damage)`
*   **Description:** Handles parry effects: camera shake, partial cooldown refund, and bonus damage tracking via skill tree.
*   **Parameters:**  
    `inst` (Entity) — the shield instance.  
    `doer` (Entity) — the character who parried.  
    `attacker` (Entity) — the attacking entity.  
    `damage` (number) — damage amount of the incoming attack.
*   **Returns:** Nothing.

### `DamageFn(inst)`
*   **Description:** Computes damage output based on base damage plus bonus damage from recent successful parries.
*   **Parameters:**  
    `inst` (Entity) — the shield instance.
*   **Returns:** `number` — total damage value.

### `OnAttackFn(inst, attacker, target)`
*   **Description:** Resets parry-related state and consumes armor condition when the shield is used for attack.
*   **Parameters:**  
    `inst` (Entity) — the shield instance.  
    `attacker` (Entity) — the entity using the shield.  
    `target` (Entity) — the target being attacked.
*   **Returns:** Nothing.

### `OnDischarged(inst)`
*   **Description:** Disables AoE targeting when the shield is fully discharged.
*   **Parameters:**  
    `inst` (Entity) — the shield instance.
*   **Returns:** Nothing.

### `OnCharged(inst)`
*   **Description:** Re-enables AoE targeting when the shield is fully charged.
*   **Parameters:**  
    `inst` (Entity) — the shield instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  None directly in this file; but `inst:PushEvent` is used via `onpreparryfn` (disabled), `onparryfn`, and `onattack` callbacks.  
- **Pushes:**  
  `armordamaged`, `combat_parry`, `equipskinneditem`, `unequipskinneditem` (via component callbacks and owner).