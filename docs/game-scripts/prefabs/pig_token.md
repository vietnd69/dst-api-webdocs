---
id: pig_token
title: Pig Token
description: A collectible in-game item that can be stacked, traded, and burned, primarily used in crafting or as a tradable resource.
tags: [inventory, tradable, burnable, stackable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5e7f775f
system_scope: inventory
---

# Pig Token

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pig_token` is a prefab for a collectible item used as a consumable or craftable resource in the game. It functions as an inventory item with stackable, tradable, burnable, and inspectable properties. The entity is purely client-side on non-master simulators and adds core gameplay components only on the master sim (server).

## Usage example
```lua
local inst = TheWorld:SpawnPrefab("pig_token")
inst.components.stackable:SetStackSize(10)
inst.components.tradable:SetTrader(some_trader_entity)
inst.components.inventoryitem:OnDrop()
```

## Dependencies & tags
**Components used:** `stackable`, `tradable`, `inspectable`, `inventoryitem`, `smallburnable`, `smallpropagator`
**Tags:** Adds `physics` (via `MakeInventoryPhysics`), `pushable` (via `MakeInventoryPhysics`), `floatable` (via `MakeInventoryFloatable`), `burnable`, `smolderer`, `smallprop`, `hauntable_launch`, `tradable`, `inspectable`, `inventoryitem`, `object`, `item`, `pig_token`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum number of pig tokens that can be stacked in one inventory slot. |

## Main functions
Not applicable — no public instance methods are defined in the constructor. Interaction occurs through attached component APIs (`stackable`, `tradable`, etc.).

## Events & listeners
Not applicable — no event listeners or event pushes are defined directly in the `pig_token` prefab logic. Events are handled by the attached components (e.g., `tradable`, `inventoryitem`).