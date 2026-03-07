---
id: lureplant_bulb
title: Lureplant Bulb
description: A deployable item that spawns a Lureplant when placed in the world.
tags: [deployable, combat, item, plant]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7ccb09fc
system_scope: entity
---

# Lureplant Bulb

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lureplantbulb` prefab is a consumable item that, when deployed, spawns a `lureplant` entity at the placement location. It functions as a specialized tool for automated combat and resource farming, leveraging the `deployable` component to trigger plant creation and relying on `stackable`, `fuel`, and `inventoryitem` components for inventory and usage behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("deployable")
inst:AddComponent("stackable")
inst.components.stackable.maxsize = TUNING.STACK_SIZE_LARGEITEM
inst:AddComponent("fuel")
inst.components.fuel.fuelvalue = TUNING.LARGE_FUEL
inst:AddComponent("inventoryitem")

inst.components.deployable.ondeploy = function(inst, pt)
    local lp = SpawnPrefab("lureplant", inst.linked_skinname, inst.skin_id)
    if lp ~= nil then
        lp.Transform:SetPosition(pt:Get())
        inst.components.stackable:Get():Remove()
        PreventCharacterCollisionsWithPlacedObjects(lp)
        lp.sg:GoToState("spawn")
        lp:AddTag("planted")
    end
end
```

## Dependencies & tags
**Components used:** `stackable`, `fuel`, `inventoryitem`, `deployable`, `inspectable`, `burnable`, `propagator`, `hauntable`  
**Tags:** Adds `planted` (on spawn), `deployable` (implicit via component), `item` (via `MakeInventoryPhysics`), `floatable` (via `MakeInventoryFloatable`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.LARGE_FUEL` | Amount of fuel this item provides when burned (used by the `fuel` component). |
| `maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum stack size for this item (used by the `stackable` component). |

## Main functions
### `ondeploy(inst, pt)`
* **Description:** Deployment callback executed when the item is placed in the world via the deployable system. Spawns a `lureplant`, positions it at the placement point, removes the deployed bulb, prevents collision with characters, initializes its stategraph, and tags it as planted.
* **Parameters:**  
  `inst` (Entity) — The lureplant bulb entity being deployed.  
  `pt` (Vector3) — The placement point returned by the deploy system.  
* **Returns:** Nothing.
* **Error states:** If `SpawnPrefab("lureplant", ...)` returns `nil`, no further actions occur.

## Events & listeners
* **None identified.**