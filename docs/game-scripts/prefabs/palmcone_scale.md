---
id: palmcone_scale
title: Palmcone Scale
description: A consumable fuel item used for campfires and related ignition sources, providing moderate fuel value and burn duration.
tags: [fuel, inventory, consumable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6d1fe2db
system_scope: inventory
---

# Palmcone Scale

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `palmcone_scale` prefab is a lightweight, handheld inventory item representing a piece of flammable vegetation. It serves as a standard fuel source for campfires and other burnable objects, offering moderate fuel value (`TUNING.MED_FUEL`) and burn duration (`TUNING.MED_BURNTIME`). As a prefab, it defines the base entity structure and behavior upon instantiation, attaching multiple components to support inventory handling, networking, floatability, and combustion properties.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddNetwork()

MakeInventoryPhysics(inst)
inst.AnimState:SetBank("palmcone_scale")
inst.AnimState:SetBuild("palmcone_scale")
inst.AnimState:PlayAnimation("idle")

inst:AddComponent("inventoryitem")
inst:AddComponent("stackable")
inst:AddComponent("inspectable")
inst:AddComponent("tradable")

inst:AddComponent("fuel")
inst.components.fuel.fuelvalue = TUNING.MED_FUEL

MakeSmallBurnable(inst, TUNING.MED_BURNTIME)
MakeSmallPropagator(inst)
```

## Dependencies & tags
**Components used:** `fuel`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.MED_FUEL` | The amount of fuel this item contributes when consumed by a fuel-consuming component. |

## Main functions
The component itself (`fuel`) does not define custom methods in this context; only its `fuelvalue` property is modified. Standard `Fuel` component behavior applies (see `components/fuel.lua`).

## Events & listeners
None identified.