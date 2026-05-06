---
id: nightstick
title: Nightstick
description: Prefab definition for the Nightstick weapon that provides light, electric damage, and can be recharged with batteries.
tags: [weapon, light, electric, inventory, equipment]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 98c95e62
system_scope: inventory
---

# Nightstick

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`nightstick` is a weapon prefab that functions as a light source and deals electric damage. It consumes fuel over time and can be recharged using batteries via the `batteryuser` component. When equipped, it ignites to provide illumination and spawns a fire child entity. The prefab integrates with the equipment system through the `equippable` component and handles skin overrides for customized appearances.

## Usage example
```lua
-- Spawn a nightstick in the world
local nightstick = SpawnPrefab("nightstick")

-- Access components for modification
nightstick.components.weapon:SetDamage(50)
nightstick.components.fueled:SetPercent(1.0)

-- Check partial charge setting
local allowpartial = nightstick.components.batteryuser.allowpartialcharge
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- references NIGHTSTICK_DAMAGE, NIGHTSTICK_FUEL, TURNON_FUELED_CONSUMPTION, TURNON_FULL_FUELED_CONSUMPTION

**Components used:**
- `weapon` -- sets damage, electric stimulus, and onattack callback
- `inventoryitem` -- enables item to be picked up and carried
- `equippable` -- handles equip/unequip/pocket behavior and model overrides
- `inspectable` -- enables player inspection of the item
- `burnable` -- manages ignition/extinguish state for light emission
- `fueled` -- tracks fuel consumption and depletion callbacks
- `batteryuser` -- enables battery recharging functionality

**Tags:**
- `wildfireprotected` -- added on creation, prevents wildfire spreading
- `batteryuser` -- added on creation, marks entity as rechargeable
- `weapon` -- added on creation, marks entity as a weapon

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No entity-level properties are defined. |


## Main functions

### `fn()`
* **Description:** Constructor function that creates and configures the nightstick entity. Adds all components, sets up callbacks, and applies tags. Server-side logic is guarded by TheWorld.ismastersim check.
* **Parameters:** None
* **Returns:** Entity instance (inst)
* **Error states:** None

### `onpocket(inst)`
* **Description:** Called when the nightstick is placed in a player's pocket. Extinguishes the burnable component to stop light emission.
* **Parameters:** `inst` -- the nightstick entity instance
* **Returns:** None
* **Error states:** Errors if `inst.components.burnable` is nil (no nil guard present).

### `onremovefire(fire)`
* **Description:** Callback for when the fire child entity is removed. Clears the fire reference on the nightstick.
* **Parameters:** `fire` -- the fire child entity being removed
* **Returns:** None
* **Error states:** Errors if `fire` is nil or `fire.nightstick` is nil (no nil guard present before member access).

### `onequip(inst, owner)`
* **Description:** Called when the nightstick is equipped by a player. Ignites the burnable component, spawns the fire child entity, overrides animation symbols for skin support, and plays equip sound.
* **Parameters:**
  - `inst` -- the nightstick entity instance
  - `owner` -- the player entity equipping the item
* **Returns:** None
* **Error states:** Errors if `owner.AnimState` is nil or if `SpawnPrefab` fails. May error if `inst.fire` exists but lacks `nightstick` table field.

### `onunequip(inst, owner)`
* **Description:** Called when the nightstick is unequipped. Removes the fire child entity, extinguishes the burnable component, restores normal arm animations, and stops the torch sound.
* **Parameters:**
  - `inst` -- the nightstick entity instance
  - `owner` -- the player entity unequipping the item
* **Returns:** None
* **Error states:** Errors if `owner.AnimState` is nil or if `inst.SoundEmitter` is nil.

### `onequiptomodel(inst, owner, from_ground)`
* **Description:** Called when equipping to a model (e.g., mannequin display). Removes fire entity and extinguishes burnable without player animation changes.
* **Parameters:**
  - `inst` -- the nightstick entity instance
  - `owner` -- the entity receiving the equipment
  - `from_ground` -- boolean indicating if equipped from ground
* **Returns:** None
* **Error states:** Errors if `inst.components.burnable` or `inst.SoundEmitter` is nil (no nil guard present before member access).

### `OnRemoveEntity(inst)`
* **Description:** Called when the nightstick entity is being removed from the world. Cleans up the fire child entity if it exists.
* **Parameters:** `inst` -- the nightstick entity instance
* **Returns:** None
* **Error states:** None

### `onfuelchange(newsection, oldsection, inst)`
* **Description:** Callback when fuel section changes. If fuel reaches zero, extinguishes the burnable, removes the nightstick, and pushes `itemranout` event to owner if equipped.
* **Parameters:**
  - `newsection` -- number, new fuel section value
  - `oldsection` -- number, previous fuel section value
  - `inst` -- the nightstick entity instance
* **Returns:** None
* **Error states:** Errors if `inst.components.burnable` or `inst.components.equippable` is nil when fuel depletes.

### `onattack(inst, attacker, target)`
* **Description:** Called when the nightstick successfully hits a target. Spawns electric hit spark effects.
* **Parameters:**
  - `inst` -- the nightstick entity instance
  - `attacker` -- the entity performing the attack
  - `target` -- the entity being attacked
* **Returns:** None
* **Error states:** Errors if `attacker` or `target` is nil when passed to `SpawnElectricHitSparks` (no parameter validation before global function call).

### `CalcBatteryChargeMult(inst, battery)`
* **Description:** Calculates the charge multiplier based on current fuel percentage. Returns higher multiplier when fuel is lower.
* **Parameters:**
  - `inst` -- the nightstick entity instance
  - `battery` -- the battery entity being used to charge
* **Returns:** Number between 0 and 1 representing charge multiplier
* **Error states:** Errors if `inst.components.fueled` is nil.

### `OnBatteryUsed(inst, battery, mult)`
* **Description:** Called when a battery is used to charge the nightstick. Adds charge based on multiplier if not already full. Spawns electric hit sparks on success.
* **Parameters:**
  - `inst` -- the nightstick entity instance
  - `battery` -- the battery entity used for charging
  - `mult` -- number, charge multiplier from CalcBatteryChargeMult
* **Returns:** Boolean `true` on success, or `false, "CHARGE_FULL"` if already full or `mult <= 0`
* **Error states:** Errors if `inst.components.fueled` is nil.

## Events & listeners
- **Listens to:** `onremove` -- registered on the fire child entity to clean up reference when fire is removed
- **Pushes:** `equipskinneditem` -- fired on owner when equipping with skin override
- **Pushes:** `unequipskinneditem` -- fired on owner when unequipping with skin override
- **Pushes:** `itemranout` -- fired on owner when fuel depletes while equipped