---
id: cutlichen
title: Cutlichen
description: A consumable food item that restores health and hunger but reduces sanity, and spoils over time.
tags: [food, perishable, inventory, sanity, consumable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 39fd392d
system_scope: inventory
---

# Cutlichen

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`cutlichen` is a prefab representing a small, edible plant used as food in *Don't Starve Together*. It is an inventory item with stackable capacity, edible properties (restores health and hunger, reduces sanity), and perishable behavior (spoils into `spoiled_food` after a set duration). It is typically found in the world or crafted and serves as a basic sustenance resource.

The prefab uses core components for inventory management (`inventoryitem`, `stackable`), consumption (`edible`), spoilage (`perishable`), and basic physics/sound effects. It is also made hauntable via `MakeHauntableLaunchAndPerish`.

## Usage example
```lua
-- Typically instantiated automatically via the game's prefab system
-- To spawn one manually in a mod:
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("stackable")
inst.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM
inst:AddComponent("edible")
inst.components.edible.healthvalue = TUNING.HEALING_SMALL
inst.components.edible.hungervalue = TUNING.CALORIES_SMALL
inst.components.edible.sanityvalue = -TUNING.SANITY_TINY
inst.components.edible.foodtype = FOODTYPE.VEGGIE
inst:AddComponent("perishable")
inst.components.perishable:SetPerishTime(TUNING.PERISH_TWO_DAY)
inst.components.perishable:StartPerishing()
inst.components.perishable.onperishreplacement = "spoiled_food"
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `tradable`, `edible`, `perishable`, `transform`, `animstate`, `network`

**Tags:** None identified.

## Properties
No public properties.

## Main functions
No custom public functions.

## Events & listeners
None identified.