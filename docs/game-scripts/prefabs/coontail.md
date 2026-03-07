---
id: coontail
title: Coontail
description: A lightweight inventory item prefab that functions as a cat toy, adding the `cattoy` tag and supporting stacking, hauntable launches, and floating behavior.
tags: [inventory, item, toy]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 24692312
system_scope: inventory
---

# Coontail

> Based on game build **714014** | Last updated: 2026-03-004

## Overview
`coontail` is a simple item prefab representing a cat toy in DST. It is primarily used as an interactive object for cats (e.g., Webweavers). The prefab sets up basic visual and physics properties via `AnimState`, `Transform`, and network sync, then attaches key components (`inspectable`, `inventoryitem`, `stackable`) on the master simulation. It also adds the `cattoy` tag for gameplay classification and integrates with floating mechanics and hauntable launch interactions.

## Usage example
```lua
local inst = SpawnPrefab("coontail")
if inst ~= nil then
    inst.components.stackable:SetStackSize(5)
    inst.components.inventoryitem:PushToInventory()
    inst.components.inspectable:GetDescription()
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`  
**Tags:** Adds `cattoy`

## Properties
No public properties

## Main functions
This prefab does not define custom main functions; functionality is delegated to attached components (`inventoryitem`, `stackable`, `inspectable`). Standard usage interacts directly with those components.

## Events & listeners
None identified.