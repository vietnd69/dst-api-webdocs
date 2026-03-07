---
id: shovel
title: Shovel
description: Implements the shovel and golden shovel prefabs with dig capability, limited durability, weapon damage, and equip/unequip animation handling.
tags: [tool, weapon, inventory, equipment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9af16869
system_scope: inventory
---

# Shovel

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shovel` prefab defines the base shovel and golden shovel entities in DST. It integrates multiple components—including `tool`, `weapon`, `finiteuses`, `equippable`, and `floater`—to provide digging functionality, wear-and-tear durability, combat capability, and visual feedback during equip/unequip cycles. The shovel is optimized for performance by adding the `tool` and `weapon` tags to the base entity in the pristine state, while server-side components are conditionally added for non-Quagmire game modes.

## Usage example
```lua
-- Create a new shovel (server-side only)
local inst = CreateEntity()
inst:AddComponent("tool")
inst:AddComponent("finiteuses")
inst:AddComponent("weapon")
inst:AddComponent("equippable")

inst.components.tool:SetAction(ACTIONS.DIG)
inst.components.finiteuses:SetMaxUses(TUNING.SHOVEL_USES)
inst.components.finiteuses:SetUses(TUNING.SHOVEL_USES)
inst.components.finiteuses:SetConsumption(ACTIONS.DIG, 1)
inst.components.weapon:SetDamage(TUNING.SHOVEL_DAMAGE)
```

## Dependencies & tags
**Components used:** `tool`, `finiteuses`, `weapon`, `equippable`, `floater`, `inspectable`, `inventoryitem`
**Tags:** Adds `tool`, `weapon` (only in non-Quagmire modes), and `shovel` via `MakeInventoryFloatable`.

## Properties
No public properties.

## Main functions
Not applicable — this file defines prefab constructors, not a standalone component class.

## Events & listeners
- **Listens to:** None.
- **Pushes:** 
  - `"equipskinneditem"` — pushed to the owner when a skinned shovel is equipped.
  - `"unequipskinneditem"` — pushed to the owner when a skinned shovel is unequipped.
  - `"shovel_dug"` — implicitly triggered via the `tool` component’s `ACTIONS.DIG` handling (not directly in this file, but implied by usage).
  - `"finished"` — fired by the `finiteuses` component when durability is exhausted (`SetOnFinished(inst.Remove)`).