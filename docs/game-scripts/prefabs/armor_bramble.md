---
id: armor_bramble
title: Armor Bramble
description: A wearable armor item that triggers thorn-based retaliation effects when the wearer is blocked or attacks, conditional on skill tree activation.
tags: [combat, armor, utility, equipment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9565c104
system_scope: equipment
---

# Armor Bramble

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`armor_bramble` is an equipment prefab that provides defensive armor stats and activates a thorn retaliation mechanic. When worn, it monitors two key combat events: `blocked` (taking damage that is mitigated) and `attacked` (dealing damage). If the player has the `wormwood_armor_bramble` skill activated in their skill tree, attacking will increment a hit counter until a threshold is reached; otherwise, only blocking triggers the thorn effect directly. Upon activation, it spawns a visual FX, plays a sound, and resets a short cooldown to prevent spam. It modifies the wearer's appearance via anim state overrides and respects skin builds.

## Usage example
```lua
local inst = GetPlayer().entity:GetParent()
if inst ~= nil and inst.prefab == "wormwood" then
    local armor = SpawnPrefab("armor_bramble")
    inst.components.inventory:EquipItem(armor)
    -- The armor automatically listens for combat events and applies thorns when triggered
end
```

## Dependencies & tags
**Components used:** `armor`, `equippable`, `fuel`, `inspectable`, `inventoryitem`, `skilltreeupdater`
**Tags added by the prefab:** `bramble_resistant`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_specialinfo` | string | `"ARMORBRAMBLE"` | Identifier for scrapbook entry display. |
| `scrapbook_damage` | number | `TUNING.ARMORBRAMBLE_DMG` | Damage value shown in scrapbook. |
| `foleysound` | string | `"dontstarve/movement/foley/cactus_armor"` | Sound played when walking. |
| `_hitcount` | number | `0` | Internal counter tracking successful hits for skill-triggered thorns. |
| `_cdtask` | task or nil | `nil` | Cooldown timer task; prevents rapid thorn activation. |

## Main functions
### `OnBlocked(owner, data, inst)`
* **Description:** Event callback triggered when the owner is blocked. Initiates thorn retaliation if cooldown is not active and the damage was not redirected.
* **Parameters:**  
  `owner` (Entity) – The entity wearing the armor.  
  `data` (table or nil) – Damage event data; must be non-nil.  
  `inst` (Entity) – The armor instance itself.  
* **Returns:** Nothing.

### `DoThorns(inst, owner)`
* **Description:** Spawns the thorn FX, plays the cactus armor sound, and resets `_hitcount` to zero. Acts as the core retaliation trigger.
* **Parameters:**  
  `inst` (Entity) – The armor instance.  
  `owner` (Entity) – The entity wearing the armor.  
* **Returns:** Nothing.

### `OnAttackOther(owner, data, inst)`
* **Description:** Event callback triggered when the owner attacks another entity. Only activates thorn retaliation *if* the `wormwood_armor_bramble` skill is activated and the hit count reaches the tuning threshold; otherwise, it resets the hit counter.
* **Parameters:**  
  `owner` (Entity) – The entity wearing the armor.  
  `data` (table) – Attack event data.  
  `inst` (Entity) – The armor instance.  
* **Returns:** Nothing.

### `onequip(inst, owner)`
* **Description:** Equip handler. Applies skin overrides, adds event listeners for `blocked`, `attacked`, and `onattackother`, and initializes `_hitcount`.
* **Parameters:**  
  `inst` (Entity) – The armor instance.  
  `owner` (Entity) – The entity equipping the item.  
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Unequip handler. Clears anim state overrides, removes event listeners, and nullifies `_hitcount`.
* **Parameters:**  
  `inst` (Entity) – The armor instance.  
  `owner` (Entity) – The entity unequipping the item.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `blocked`, `attacked`, `onattackother` – routed through `inst._onblocked` and `inst._onattackother` handlers.
- **Pushes:** No events are directly pushed by this component.
