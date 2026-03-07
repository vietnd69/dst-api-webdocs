---
id: armor_yoth_knight
title: Armor Yoth Knight
description: A wearable piece of heavy metal armor that provides protection and triggers set-bonus effects when equipped as part of the Yoth Knight equipment set.
tags: [armor, combat, equipment, setbonus]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a4781d13
system_scope: inventory
---

# Armor Yoth Knight

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`armor_yoth_knight` is a prefab definition for a full-body armor item in *Don't Starve Together*. It is equipped on the `BODY` slot, provides damage mitigation via the `armor` component, and integrates with the equipment set system to enable set-bonus effects. When equipped, it overrides the owner's `swap_body` animation symbol and adds a `luckysource` tag to the owner when the Yoth Knight set bonus is active.

## Usage example
This prefab is used as a ready-to-instantiate item via the `Prefab()` system. Modders typically reference it by name when defining crafting recipes or loot tables.

```lua
-- Example: Using the prefab in a crafting recipe
Recipe("yoth_knight_helmet", { ... }, TECH.NONE)
    :SetResult("armor_yoth_knight")
    :SetUnlocks("Yoth Knight Set")

-- Example: Adding component behavior in a mod
inst.components.setbonus:SetOnEnabledFn(function(self, owner)
    owner.components.temperature.cold_resistance = owner.components.temperature.cold_resistance + 5
end)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `armor`, `equippable`, `setbonus`, `inspectable`  
**Tags added:** `metal`, `hardarmor`, `luckysource` (via set bonus activation)

## Properties
No public properties are directly exposed or documented in the constructor. All state is managed internally via component APIs.

## Main functions
The `fn()` function is the constructor and returns an entity instance. It does not accept parameters and is invoked automatically by the `Prefab()` factory.

## Events & listeners
- **Listens to:** `blocked` (on owner) — triggers `OnBlocked` sound playback when the wearer blocks an attack.
- **Pushes:** `equipskinneditem`, `unequipskinneditem` — fired during equip/unequip if the item has a skin override.