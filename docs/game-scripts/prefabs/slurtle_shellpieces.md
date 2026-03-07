---
id: slurtle_shellpieces
title: Slurtle Shellpieces
description: An inventory item that can be used to repair structures by providing shell-based repair material and a fixed health value.
tags: [inventory, crafting, repair, materials]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b68a7b0f
system_scope: inventory
---

# Slurtle Shellpieces

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`slurtle_shellpieces` is an inventory item prefab representing slurtle shell fragments used for repairing structures. It implements the `stackable` and `repairer` components to enable stacking and structural repair functionality. It is primarily used in crafting or as a repair material in-game, especially for shell-based rebuilding mechanics.

## Usage example
```lua
local inst = SpawnPrefab("slurtle_shellpieces")
if inst then
    inst.components.stackable:SetStackSize(5)
    inst.components.repairer.healthrepairvalue = TUNING.REPAIR_SHELL_HEALTH
    inst.components.repairer.repairmaterial = MATERIALS.SHELL
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `repairer`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum number of pieces that can stack in one inventory slot. |
| `healthrepairvalue` | number | `TUNING.REPAIR_SHELL_HEALTH` | Amount of health restored per repair action. |
| `repairmaterial` | string | `MATERIALS.SHELL` | Material type标识, used to determine compatibility with repair targets. |

## Main functions
No custom methods are defined in this prefab’s `fn()` constructor. It relies entirely on externally defined component functionality (`stackable`, `repairer`). No public methods are added directly to the prefab instance.

## Events & listeners
No event listeners or pushed events are defined directly in this file. Event handling is delegated to attached components (`stackable`, `repairer`, `inventoryitem`) via their own logic.