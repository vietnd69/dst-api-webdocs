---
id: marblebean
title: Marblebean
description: A stackable inventory item that can be planted to spawn a marblebean sapling.
tags: [inventory, plant, deployable, food]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 174975c1
system_scope: inventory
---

# Marblebean

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`marblebean` is a prefab representing a small, consumable bean item that functions as both a cat toy and a planter seed. It is primarily used as bait for moles and can be deployed in the world to grow a `marblebean_sapling`. The prefab uses the `stackable`, `inventoryitem`, and `deployable` components to manage its behavior in inventory and during placement. It is tagged for special interactions (`cattoy`, `molebait`, `treeseed`) and supports hauntable mechanics.

## Usage example
```lua
-- Create a marblebean instance
local bean = SpawnPrefab("marblebean")

-- Place it in an actor's inventory
actor.components.inventory:GiveItem(bean)

-- Deploy it onto the world (requires a valid transform and world context)
local pt = Vector3(x, y, z)
bean.components.deployable:OnDeploy(pt, actor)
```

## Dependencies & tags
**Components used:** `stackable`, `inventoryitem`, `deployable`, `inspectable`, `hauntable_launch`  
**Tags added:** `cattoy`, `molebait`, `treeseed`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum number of items allowed in a single stack. |
| `components.inventoryitem.sinks` | boolean | `true` | Whether the item sinks in water when dropped. |
| `components.deployable.mode` | enum | `DEPLOYMODE.PLANT` | Deployment mode (set to planting). |
| `components.deployable.ondeploy` | function | `ondeploy` (local) | Callback executed when deployed. |

## Main functions
Not applicable. This is a prefab definition, not a component.

## Events & listeners
Not applicable. This prefab definition does not register event listeners directly. Event handling is delegated to components (e.g., `deployable.ondeploy`).