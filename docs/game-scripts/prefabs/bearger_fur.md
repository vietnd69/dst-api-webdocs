---
id: bearger_fur
title: Bearger Fur
description: A stackable inventory item representing the fur of a Bearger, used for crafting and insulation.
tags: [inventory, crafting, stackable]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3034c5e1
system_scope: inventory
---

# Bearger Fur

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `bearger_fur` prefab defines a consumable crafting material with stackable properties. It is an inventory item that appears as a drop from Bearger enemies and is used in various crafting recipes, notably for insulation and clothing. The prefab integrates with the ECS by adding the `inspectable`, `inventoryitem`, and `stackable` components for client-server compatibility and gameplay functionality.

## Usage example
```lua
local inst = SpawnPrefab("bearger_fur")
inst.Transform:SetPosition(x, y, z)
inst.components.stackable:SetCount(5)
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `hauntable_launch`, `transform`, `animstate`, `soundemitter`, `network`, `physics`, `floatable`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum number of fur items that can be stacked in one inventory slot. |

## Main functions
No public methods are defined in the `bearger_fur` prefab itself. It relies entirely on behavior inherited from attached components (notably `stackable`). The `stackable` component's `maxsize` is explicitly set during construction.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
