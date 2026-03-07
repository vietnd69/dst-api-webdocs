---
id: merm_tool
title: Merm Tool
description: Implements a reusable, tool-based weapon for Merm NPCs with damage modified by combat state and finite durability for chopping, mining, digging, and tilling actions.
tags: [combat, tool, inventory, npc, durability]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 705a5807
system_scope: entity
---

# Merm Tool

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`merm_tool` defines a reusable weapon/tool entity specifically for Merm NPCs. It combines functionality from the `weapon`, `tool`, `equippable`, and `finiteuses` components to provide context-sensitive damage, tool action support (CHOP, MINE, DIG, TILL), and consumable durability. The tool's damage is dynamically computed based on whether the wielder is a Merm NPC. It is instantiated for both standard and upgraded variants via a factory function.

## Usage example
```lua
-- Standard usage: add the tool to an NPC entity and equip it
local inst = CreateEntity()
inst:AddPrefabOverride("merm_tool")
inst:AddTag("merm_npc")
inst.components.inventory:Equip(inst.components.inventory:GetSlot("hands"), inst)
-- Tool will show 'ARM_carry', apply weapon damage, and consume uses on tool actions
```

## Dependencies & tags
**Components used:** `combat`, `equippable`, `finiteuses`, `tool`, `weapon`, `inventoryitem`, `farmtiller`, `inspectable`, `soundemitter`, `transform`, `animstate`, `network`
**Tags:** `merm_tool`, `tool`, `weapon`, `merm_npc` (used as a restriction tag), `usesdepleted` (added when durability reaches zero)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `non_merm_damage` | number | inherited from `TUNING.MERM_TOOL.DAMAGE` | Base damage value assigned on creation, used unless wielder is a non-Merm NPC (damage is capped to `combat.defaultdamage`). |
| `_build` | string | e.g., `"mermtool"` | Symbol build name used for anim state overrides. |
| `_swapsymbol` | string | e.g., `"swap_mermtool"` | Symbol name used for anim state overrides. |

## Main functions
### `OnEquip(inst, owner)`
* **Description:** Handles equipping the tool: applies skin overrides if present, anim state changes (`ARM_carry` shown, `ARM_normal` hidden), and signals skin events.
* **Parameters:**  
  `inst` (Entity) — the tool instance being equipped.  
  `owner` (Entity) — the entity equipping the tool.  
* **Returns:** Nothing.
* **Error states:** No explicit error handling; relies on `owner.AnimState` existing.

### `OnUnequip(inst, owner)`
* **Description:** Handles unequipping the tool: signals skin removal if applicable and restores arm animation state (`ARM_carry` hidden, `ARM_normal` shown).
* **Parameters:**  
  `inst` (Entity) — the tool instance being unequipped.  
  `owner` (Entity) — the entity unequipping the tool.  
* **Returns:** Nothing.

### `getDamage(inst, attacker, target)`
* **Description:** Computes the effective damage dealt by the tool. For Merm NPC attackers (`HasTag("merm_npc")`), damage is the greater of `non_merm_damage` or the attacker's default combat damage. For non-Merm attackers, it simply returns `non_merm_damage`.
* **Parameters:**  
  `inst` (Entity) — the tool instance.  
  `attacker` (Entity) — the entity performing the attack.  
  `target` (Entity) — the entity being attacked (unused in logic).  
* **Returns:** `number` — effective damage value.

### `CreateMermTool(data)`
* **Description:** Factory function that builds and configures a `merm_tool` or `merm_tool_upgraded` prefab instance. Sets up components, animations, sound, and durability tuning.
* **Parameters:**  
  `data` (table) — configuration with keys: `prefab` (string), `bank` (string), `build` (string), `tuning` (string), `assets` (table of Asset definitions), and optional `skindata`.  
* **Returns:** `Prefab` — fully defined prefab object ready for world instantiation.
* **Error states:** None. Relies on `TUNING[data.tuning]` being defined.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:**  
  - `"equipskinneditem"` — sent to the owner when equipping a skinned tool.  
  - `"unequipskinneditem"` — sent to the owner when unequipping a skinned tool.  
  - `"percentusedchange"` — sent by `finiteuses` when durability changes (e.g., on use or deactivation).  
  - `"usesdepleted"` — tag added by `finiteuses` when durability reaches zero.  
  - `"toolfinished"` — sent when `finiteuses.onfinished` (i.e., `inst.Remove`) is called.