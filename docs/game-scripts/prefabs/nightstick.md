---
id: nightstick
title: Nightstick
description: A renewable light source weapon that ignites on equip and deactivates when unequipped or pocketed; supports battery and moonspark charging.
tags: [combat, light, rechargeable, item, weapon]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 59262289
system_scope: inventory
---

# Nightstick

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `nightstick` prefab is a renewable combat item that functions as a weapon and a controllable light source. It automatically ignites when equipped and extinguishes when unequipped or pocketed. It supports two renewable fuel mechanisms: standard fuel consumption via the `fueled` component and direct battery/moonspark charging. It integrates tightly with `burnable`, `fueled`, `equippable`, `weapon`, and `moonsparkchargeable` components to manage state transitions and interactions.

## Usage example
```lua
-- Example of how the nightstick prefab is typically constructed in the game:
-- (Not intended for direct external instantiation by modders)
local inst = Prefab("nightstick", fn, assets, prefabs)
inst:AddComponent("weapon")  -- Already added internally
inst.components.weapon:SetDamage(TUNING.NIGHTSTICK_DAMAGE)
inst.components.weapon:SetElectric()  -- Enables electric wet-damage interactions
```

## Dependencies & tags
**Components used:**  
`transform`, `animstate`, `soundemitter`, `network`, `weapon`, `inventoryitem`, `equippable`, `inspectable`, `burnable`, `fueled`, `moonsparkchargeable`

**Tags added:**  
`wildfireprotected`, `moonsparkchargeable`, `weapon`

## Properties
No public properties are exposed directly by this prefab; it is defined by its components and event callbacks.

## Main functions
This prefab does not define standalone functions beyond callback hooks; its logic is embedded in event-handling functions passed to component setters.

### `onpocket(inst)`
* **Description:** Extinguishes the nightstick when it is pocketed (e.g., stored in an inventory slot that turns it off).
* **Parameters:** `inst` (Entity) – The nightstick entity.
* **Returns:** Nothing.
* **Error states:** No error states.

### `onequip(inst, owner)`
* **Description:** Ignites the nightstick upon equip, spawns and attaches a `nightstickfire` entity, updates animation and sound for the equipped state.
* **Parameters:**  
  - `inst` (Entity) – The nightstick.  
  - `owner` (Entity) – The entity equipping the nightstick.  
* **Returns:** Nothing.
* **Error states:** If `inst.fire` already exists, no duplicate fire is spawned.

### `onunequip(inst, owner)`
* **Description:** Extinguishes the nightstick, removes the fire entity, resets animation and sound when unequipped.
* **Parameters:**  
  - `inst` (Entity) – The nightstick.  
  - `owner` (Entity) – The unequipping entity.  
* **Returns:** Nothing.
* **Error states:** Fire removal is safe even if `inst.fire` is `nil`.

### `onequiptomodel(inst, owner, from_ground)`
* **Description:** Extinguishes the nightstick and removes the fire when displayed as a model (e.g., in a chest, build menu, or crafting tab).
* **Parameters:**  
  - `inst` (Entity) – The nightstick.  
  - `owner` (Entity) – The inventory owner (may be `nil`).  
  - `from_ground` (boolean) – Whether the item was picked up from the ground.  
* **Returns:** Nothing.

### `onremovefire(fire)`
* **Description:** Callback to clean up reference when the attached fire entity is removed externally.
* **Parameters:** `fire` (Entity) – The `nightstickfire` entity being removed.
* **Returns:** Nothing.

### `OnRemoveEntity(inst)`
* **Description:** Cleans up attached fire entity before the nightstick is fully removed.
* **Parameters:** `inst` (Entity) – The nightstick.
* **Returns:** Nothing.

### `onfuelchange(newsection, oldsection, inst)`
* **Description:** Handles fuel exhaustion — extinguishes the stick, announces via `itemranout` if equipped, and removes the item when fuel runs out.
* **Parameters:**  
  - `newsection` (number) – Current fuel section index.  
  - `oldsection` (number) – Previous fuel section index.  
  - `inst` (Entity) – The nightstick.  
* **Returns:** Nothing.

### `onattack(inst, attacker, target)`
* **Description:** Spawns electric hit sparks on attack, satisfying the `weapon:SetOnAttack` callback.
* **Parameters:**  
  - `inst` (Entity) – The nightstick.  
  - `attacker` (Entity) – Attacking entity.  
  - `target` (Entity) – Hit target.  
* **Returns:** Nothing.

### `OnBatteryUsed(inst, battery)`
* **Description:** Called by `batteryuser` when a battery attempts to charge the nightstick (currently commented out in default code but implemented). Charges to fullness, returning failure if already full.
* **Parameters:**  
  - `inst` (Entity) – The nightstick.  
  - `battery` (Entity) – Charging battery item.  
* **Returns:**  
  - `false, "CHARGE_FULL"` if `fueled:GetPercent() >= 1`.  
  - `true` on successful partial/complete charge.
* **Error states:** Only returns `false` if already full.

## Events & listeners
- **Listens to:**  
  - `"onremove"` (on `inst.fire`) – Triggers `onremovefire` callback.  
  - `"death"` (via `burnable.Ignite`) – Managed internally by `Burnable` component; nightstick itself does not listen.  
  - `"onextinguish"` – No custom listener attached in this file.  
  - `"equipskinneditem"`, `"unequipskinneditem"` – Pushed to `owner` during skin equip/unequip.

- **Pushes:**  
  - `"equipskinneditem"` and `"unequipskinneditem"` to owner when skin is present.  
  - `"itemranout"` to owner when fuel depletes while equipped (triggers removal).  
  - `"onignite"` and `"onextinguish"` via `burnable.Ignite/Extinguish` — handled in `Burnable`, no custom listeners here.
