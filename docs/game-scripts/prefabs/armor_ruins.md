---
id: armor_ruins
title: Armor Ruins
description: A wearable piece of high-defense armor that provides substantial damage absorption and integrates with DST’s skinning and shadow level systems.
tags: [combat, equipment, armor, skinning, shadow]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 81f4aab7
system_scope: inventory
---

# Armor Ruins

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`armor_ruins` is a prefab that represents a durable set of armor in DST, granting high damage reduction and integrating with the equippable, armor, shadow level, and skinning systems. It is typically obtained in the Ruins biome and used by players to mitigate incoming damage significantly. The prefab leverages component-based behavior for equip/unequip effects, including dynamic animation overrides for skinned variants and sound feedback on block events.

## Usage example
This prefab is instantiated automatically by the game when spawned (e.g., via loot or crafting) and not typically constructed manually. However, a modder may reference or extend it as follows:

```lua
local armor = Prefab("armorruins", fn, assets)  -- internal definition
-- To add armor to a player:
player.inventory:GiveItem("armorruins")
-- The equippable, armor, and shadowlevel components activate automatically.
```

## Dependencies & tags
**Components used:**  
- `armor` (via `inst:AddComponent("armor")`, then `InitCondition`)  
- `equippable` (via `equipslot`, `dapperness`, `is_magic_dapperness`, `SetOnEquip`, `SetOnUnequip`)  
- `shadowlevel` (via `SetDefaultLevel`)  
- `inspectable`, `inventoryitem`, `animstate`, `transform`, `network`  

**Tags added:**  
- `ruins`  
- `metal`  
- `hardarmor`  
- `shadowlevel` (used internally for optimization and shadow-based gameplay)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foleysound` | string | `"dontstarve/movement/foley/metalarmour"` | Sound played for movement footstep effects when equipped. |
| `equipslot` | `EQUIPSLOTS` | `EQUIPSLOTS.BODY` | Inventory slot the item occupies (BODY). |
| `dapperness` | number | `TUNING.DAPPERNESS_MED` | How much this item reduces Dapperness loss (modifies sanity drain). |
| `is_magic_dapperness` | boolean | `true` | Indicates dapperness is magic-based (affected by Shadow Magic). |

## Main functions
Not applicable — this file defines a Prefab factory (`fn`), not a component class. It does not expose user-callable methods beyond component methods (`armor:InitCondition`, `equippable:SetOnEquip`, `shadowlevel:SetDefaultLevel`) which are invoked internally during setup.

## Events & listeners
- **Listens to:**  
  - `blocked` (on `owner`) — triggers `OnBlocked(owner)` to play armor hit sound when the wearer blocks an attack.

- **Pushes (indirect via equipment callbacks):**  
  - `equipskinneditem` — fires when a skinned variant is equipped, with `inst:GetSkinName()` as payload.  
  - `unequipskinneditem` — fires when a skinned variant is unequipped.
