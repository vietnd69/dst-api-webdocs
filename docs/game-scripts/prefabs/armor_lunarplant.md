---
id: armor_lunarplant
title: Armor Lunarplant
description: Provides armor protection, planar defense, damage reflection, and set-bonus resistances for equippable gear, with conditional behaviors for plantkin characters.
tags: [armor, combat, equipment, setbonus, plantkin]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 315e33bd
system_scope: inventory
---

# Armor Lunarplant

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`armor_lunarplant` is a prefab generator function producing equippable armor with defensive properties: base armor, planar defense, and resistance to `lunar_aligned` damage types. When equipped, it applies visual effects, light overrides, and handles set-bonus activation. Two variants are supported — standard and husk — the latter restricts use to plantkin characters and enables additional thorn-based reflect behaviors when equipped by Wormwood or Wortox. It integrates with components including `armor`, `planardefense`, `damagereflect`, `damagetyperesist`, `equippable`, `floater`, `inspectable`, and `colouraddersync`.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddNetwork()
MakeInventoryPhysics(inst)
inst:AddTag("lunarplant")

inst:AddComponent("armor")
inst.components.armor:InitCondition(TUNING.ARMOR_LUNARPLANT, TUNING.ARMOR_LUNARPLANT_ABSORPTION)

inst:AddComponent("planardefense")
inst.components.planardefense:SetBaseDefense(TUNING.ARMOR_LUNARPLANT_PLANAR_DEF)

inst:AddComponent("damagereflect")
inst.components.damagereflect:SetReflectDamageFn(ReflectDamageFn)

inst:AddComponent("equippable")
inst.components.equippable.equipslot = EQUIPSLOTS.BODY
inst.components.equippable:SetOnEquip(onequip)
inst.components.equippable:SetOnUnequip(onunequip)
```

## Dependencies & tags
**Components used:** `armor`, `planardefense`, `damagereflect`, `damagetyperesist`, `equippable`, `floater`, `inspectable`, `inventoryitem`, `colouraddersync`, `highlightchild`, `follower`, `setbonus`  
**Tags added:** `lunarplant`, `gestaltprotection`, `show_broken_ui`, `plantkin` (conditional), `bramble_resistant` (husk only)  
**Tags checked:** `shadow_aligned`, `plantkin`, `broken`, `debuffed`, `debuffable`

## Properties
No public properties are exposed directly by this prefab. Internal state is managed via components and local closure variables.

## Main functions
### `ReflectDamageFn(inst, attacker, damage, weapon, stimuli, spdamage)`
* **Description:** Calculates damage reflection values for the lunar plant armor, providing planar damage against shadow-aligned and general attackers.
* **Parameters:**  
  `inst` (Entity) — the armor entity.  
  `attacker` (Entity or nil) — the entity causing damage.  
  `damage` (number) — the incoming damage amount.  
  `weapon`, `stimuli`, `spdamage` — unused parameters for signature compatibility.
* **Returns:** Two values:  
  1. `0` — no normal damage is reflected (planar only).  
  2. Table containing key `planar` with value determined by `attacker`’s `shadow_aligned` tag and `TUNING.ARMOR_LUNARPLANT_REFLECT_PLANAR_DMG` constants.

### `OnBlocked(inst, owner)`
* **Description:** Plays a sound effect when the wearer blocks an attack.
* **Parameters:**  
  `inst` (Entity) — the armor entity.  
  `owner` (Entity) — the wearer.
* **Returns:** Nothing.

### `OnHit_Vines(owner, data)`
* **Description:** Applies a debuff (`wormwood_vined_debuff`) to attackers if the `wormwood_allegiance_lunar_plant_gear_1` skill is activated.
* **Parameters:**  
  `owner` (Entity) — the armor wearer.  
  `data` (table or nil) — event data containing `attacker`.
* **Returns:** Nothing.

### `OnEnabledSetBonus(inst)`
* **Description:** Adds `lunar_aligned` damage resistance when the lunar plant set bonus is active.
* **Parameters:** `inst` (Entity) — the armor entity.
* **Returns:** Nothing.

### `OnDisabledSetBonus(inst)`
* **Description:** Removes `lunar_aligned` damage resistance when the set bonus is deactivated.
* **Parameters:** `inst` (Entity) — the armor entity.
* **Returns:** Nothing.

### `onequip(inst, owner)`
* **Description:** Executed when the armor is equipped. Applies visual overrides, attaches glow FX, enables blocking events, and sets light override on the wearer.
* **Parameters:**  
  `inst` (Entity) — the armor entity.  
  `owner` (Entity) — the new wearer.
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Executed when the armor is unequipped. Clears overrides, removes events and FX, and resets light override.
* **Parameters:**  
  `inst` (Entity) — the armor entity.  
  `owner` (Entity) — the previous wearer.
* **Returns:** Nothing.

### `OnBroken(inst)`
* **Description:** Disables equippability, changes animation to "broken", updates UI string, and adds `broken` tag.
* **Parameters:** `inst` (Entity) — the armor entity.
* **Returns:** Nothing.

### `OnRepaired(inst)`
* **Description:** Restores equippability, resets animation, and removes `broken` tag and UI override.
* **Parameters:** `inst` (Entity) — the armor entity.
* **Returns:** Nothing.

### `OnAttackOther(owner, data, inst)`
* **Description (husk variant):** Counts hits; if threshold is met and skill is active, triggers thorn effect.
* **Parameters:**  
  `owner` (Entity) — armor wearer.  
  `data` (table) — attack event data.  
  `inst` (Entity) — the armor entity.
* **Returns:** Nothing.

### `OnHuskBlocked(owner, data, inst)`
* **Description (husk variant):** Triggers thorn effect on block if cooldown is free and not redirected.
* **Parameters:** Same as above.
* **Returns:** Nothing.

### `DoThorns(inst, owner)`
* **Description (husk variant):** Spawns thorn FX, plays sound, and starts cooldown.
* **Parameters:** Same as above.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `blocked` (on `owner`) — triggers `OnBlocked` and `OnHuskBlocked`.  
  `attacked` (on `owner`, husk variant only) — triggers `OnHuskBlocked`.  
  `onattackother` (on `owner`, husk variant only) — triggers `OnAttackOther`.  
  `onreflectdamage` (on `inst`) — triggers `OnReflectDamage`.  
  `skinhashdirty` (on glow FX, non-dedicated) — triggers `glow_skinhashdirty`.  
  `onremove` (on `inst` for glow FX children via `colouradder:AttachChild`) — cleanup listener.

- **Pushes:**  
  `equipskinneditem`, `unequipskinneditem` — fired during equip/unequip when using skins.  
  Events from child FX (`onreflectdamage`) — internally re-fires via `OnReflectDamage`.

