---
id: voidcloth
title: Voidcloth
description: A consumable prefab that functions as a stacking inventory item with network replication and floatable physics.
tags: [inventory, stacking, floatable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 696950b3
system_scope: inventory
---

# Voidcloth

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`voidcloth` is a prefab definition for an in-game item that serves as a stacking, inventory-bound consumable with floatable behavior (likely for use in water-based mechanics). It uses the `stackable` component to define its maximum stack size and integrates with the inventory system, inspectable interface, and physics for floating on water.

## Usage example
This prefab is instantiated by the engine when the game loads it; modders typically do not instantiate it directly. However, an instance can be created programmatically:
```lua
local inst = SpawnPrefab("voidcloth")
if inst and inst.components.stackable then
    inst.components.stackable:SetStackSize(5)
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `hauntable`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` (via `stackable` component) | number | `TUNING.STACK_SIZE_MEDITEM` | Maximum number of voidcloths allowed per stack. |

## Main functions
None.

## Events & listeners
None.