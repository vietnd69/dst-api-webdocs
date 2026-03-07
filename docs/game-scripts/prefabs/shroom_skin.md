---
id: shroom_skin
title: Shroom Skin
description: A consumable item prefab that can be stacked and used as a launchable item in DST.
tags: [inventory, stackable, launchable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ef92747f
system_scope: inventory
---

# Shroom Skin

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shroom_skin` is a prefab that defines a stackable, inventory-held item with animation, sound, and floatable physics capabilities. It is intended for use as a launchable item in the game. The prefab is created via `CreateEntity()` and configured with core visual and network components. On the master simulation, it gains `inspectable` and `inventoryitem` functionality, along with stackable behavior (`maxsize = TUNING.STACK_SIZE_LARGEITEM`) and hauntable launch properties via `MakeHauntableLaunch`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inspectable")
inst:AddComponent("inventoryitem")
inst:AddComponent("stackable")
inst.components.stackable.maxsize = TUNING.STACK_SIZE_LARGEITEM
inst.AnimState:SetBank("shroom_skin")
inst.AnimState:SetBuild("shroom_skin")
inst.AnimState:PlayAnimation("idle")
MakeInventoryPhysics(inst)
MakeInventoryFloatable(inst, "large", nil, 0.6)
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum stack size for this item. |

## Main functions
This prefab does not define custom methods beyond standard component functionality. Its behavior is driven by:
- `MakeInventoryPhysics(inst)` — sets up collision, weight, and pick-up physics.
- `MakeInventoryFloatable(inst, "large", nil, 0.6)` — configures floating behavior when wet.
- `MakeHauntableLaunch(inst)` — enables the item to be thrown/launched during hauntable events.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.