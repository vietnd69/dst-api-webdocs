---
id: rabbitkingspear
title: Rabbitkingspear
description: A usable weapon item that grants sanity restoration against manrabbit targets and degrades after repeated use.
tags: [combat, sanity, consumable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f7e99a3d
system_scope: combat
---

# Rabbitkingspear

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `rabbitkingspear` is a weapon prefab that combines combat functionality with a passive sanity effect. It is equipped as a held item and deals increased damage specifically against manrabbits. The item has a limited number of uses and automatically removes itself from the game when depleted. It also interacts with the sanity and shadowlevel systems, granting small sanity restoration on successful manrabbit kills and influencing a character’s shadow level while equipped.

## Usage example
```lua
local inst = Prefab("rabbitkingspear", fn, assets)
-- The item is automatically initialized via the fn() constructor
-- No additional setup is required by modders beyond referencing or overriding it
```

## Dependencies & tags
**Components used:** `weapon`, `finiteuses`, `inspectable`, `inventoryitem`, `equippable`, `shadowlevel`  
**Tags added:** `shadow_item`, `sharp`, `manrabbitscarer`, `weapon`, `shadowlevel`, `usesdepleted` (when depleted)

## Properties
No public properties defined beyond component-specific configuration.

## Main functions
### `DamageCalculator(inst, attacker, target)`
* **Description:** Computes weapon damage, applying a multiplier if the target is a manrabbit.
* **Parameters:**  
  - `inst` (Entity): The weapon instance.  
  - `attacker` (Entity): The entity wielding the weapon.  
  - `target` (Entity): The entity being attacked.  
* **Returns:** number — Base damage (`TUNING.RABBITKINGSPEAR_DAMAGE`) or multiplied damage if the target has tag `"manrabbit"`.
* **Error states:** None.

### `onequip(inst, owner)`
* **Description:** Configures the owner’s animation and override symbols upon equipping the spear. Handles skin-aware overrides if a skin is applied.
* **Parameters:**  
  - `inst` (Entity): The weapon instance.  
  - `owner` (Entity): The character equipping the item.  
* **Returns:** Nothing.
* **Error states:** None.

### `onunequip(inst, owner)`
* **Description:** Restores the owner’s default animation state and cleans up skin overrides upon unequipping.
* **Parameters:**  
  - `inst` (Entity): The weapon instance.  
  - `owner` (Entity): The character unequipping the item.  
* **Returns:** Nothing.
* **Error states:** None.

### `onattack(inst, owner, target)`
* **Description:** Applies sanity restoration to the owner when the spear hits a manrabbit.
* **Parameters:**  
  - `inst` (Entity): The weapon instance.  
  - `owner` (Entity): The character using the weapon.  
  - `target` (Entity): The entity attacked.  
* **Returns:** Nothing.
* **Error states:** If `owner.components.sanity` is `nil`, no sanity change occurs.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:**  
  - `"equipskinneditem"` — fired on equip if a skin is applied.  
  - `"unequipskinneditem"` — fired on unequip if a skin is applied.  
  - `"percentusedchange"` — fired by the `finiteuses` component when usage changes.  
  - `"sanitydelta"` — fired by the `sanity` component via `DoDelta`.  
  - `"goinsane"` / `"gosane"` — conditionally fired by `sanity:DoDelta` when sanity state shifts.