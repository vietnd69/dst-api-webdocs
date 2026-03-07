---
id: cookiecuttershell
title: Cookiecuttershell
description: A tradable, stackable inventory item prefab used for crafting in Don't Starve Together.
tags: [inventory, crafting, item]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 936972ce
system_scope: inventory
---

# Cookiecuttershell

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`cookiecuttershell` is a prefabricated item entity used in crafting recipes. It is a physical inventory item with animation, sound, and networking support. The component sets up standard functionality required for consumable or crafting components: tradability, stackability, inspectability, and inventory integration. It is intended for use in crafting menus and player inventories.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("tradable")
inst:AddComponent("stackable")
inst.components.stackable.maxsize = TUNING.STACK_SIZE_MEDITEM
inst:AddComponent("inspectable")
inst:AddComponent("inventoryitem")
MakeInventoryPhysics(inst)
MakeInventoryFloatable(inst)
```

## Dependencies & tags
**Components used:** `tradable`, `stackable`, `inspectable`, `inventoryitem`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable. This file defines a Prefab constructor function and does not expose standalone methods. All logic is handled via attached components.

## Events & listeners
Not applicable. This prefab definition does not register event listeners or push custom events. Event interaction occurs through attached components (`tradable`, `stackable`, `inspectable`, `inventoryitem`) which are standard DST inventory system components.
