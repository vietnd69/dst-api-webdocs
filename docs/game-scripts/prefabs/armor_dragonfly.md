---
id: armor_dragonfly
title: Armor Dragonfly
description: Provides fire-resistant body armor with a chance to ignite attackers on successful block or parry.
tags: [combat, equipment, fire, defense]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9f0ebc4b
system_scope: inventory
---

# Armor Dragonfly

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`armor_dragonfly` is a wearable body armor prefab that grants high defense and fire resistance. When equipped, it reduces external fire damage applied to the wearer and has a built-in chance to ignite attackers upon blocking or parrying an attack. It uses the standard DST `armor`, `equippable`, and `inventoryitem` components and integrates with the `burnable`, `health`, and `inspectable` systems.

## Usage example
```lua
-- Typical use in a prefab definition:
inst:AddComponent("armor")
inst.components.armor:InitCondition(TUNING.ARMORDRAGONFLY, TUNING.ARMORDRAGONFLY_ABSORPTION)

inst:AddComponent("equippable")
inst.components.equippable.equipslot = EQUIPSLOTS.BODY
inst.components.equippable:SetOnEquip(function(inst, owner) ... end)
inst.components.equippable:SetOnUnequip(function(inst, owner) ... end)
```

## Dependencies & tags
**Components used:** `armor`, `equippable`, `inventoryitem`, `inspectable`, `burnable`, `health`, `weapon`, `projectile` (via property checks)
**Tags:** None added or removed directly; relies on external tags like `"fireimmune"` and `"thorny"` for conditional behavior.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `condition` | number | `TUNING.ARMORDRAGONFLY` | Total durability of the armor (set via `armor:InitCondition`). |
| `absorb_percent` | number | `TUNING.ARMORDRAGONFLY_ABSORPTION` | Fraction of damage absorbed by the armor (e.g., `0.75` = 75% absorption). |
| `equipslot` | `EQUIPSLOTS` | `EQUIPSLOTS.BODY` | The body slot the item occupies. |
| `dapperness` | number | `TUNING.DAPPERNESS_MED` | Modifier to the wearer's dapperness (appeal to creatures). |

## Main functions
### `OnBlocked(owner, data)`
* **Description:** Handles the logic for igniting an attacker when the armor blocks or parries a non-thorny, non-projectile attack. It plays a sound effect and calls `burnable:Ignite` on the attacker if conditions are met.
* **Parameters:**  
  - `owner` (Entity) – The entity wearing this armor.  
  - `data` (table) – Event payload containing `attacker`, `weapon`, `redirected` fields.
* **Returns:** Nothing.
* **Error states:**  
  - Early exit if `attacker` is `nil`, dead, or has `"thorny"` tag.  
  - Early exit if attack was redirected or is projectile-based.

### `onequip(inst, owner)`
* **Description:** Executed when the armor is equipped. Applies visual overrides (including skin support), registers listeners for `"blocked"` and `"attacked"` events, and modifies the wearer's fire damage multiplier via `health.externalfiredamagemultipliers`.
* **Parameters:**  
  - `inst` (Entity) – The armor instance.  
  - `owner` (Entity) – The entity equipping the armor.
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Executed when the armor is unequipped. Cleans up visual overrides, removes event listeners, and removes the fire-resistance modifier.
* **Parameters:**  
  - `inst` (Entity) – The armor instance.  
  - `owner` (Entity) – The entity unequipping the armor.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"blocked"` – Triggers `OnBlocked` on the armor owner.  
  - `"attacked"` – Also triggers `OnBlocked` (used for parry-style behavior).  
- **Pushes (via owner):**  
  - `"equipskinneditem"` and `"unequipskinneditem"` – Sent to the owner when equipping/unequipping a skinned variant (if `GetSkinBuild` returns non-`nil`).