---
id: flint
title: Flint
description: A small, stackable item used as bait for moles and renewable debris, consumable to restore minimal hunger.
tags: [inventory, bait, renewable, consumable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 197ce30a
system_scope: inventory
---

# Flint

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `flint` prefab represents a small, reusable tool component in DST — a renewable source of elemental material used primarily as bait for moles and as debris after earthquake events. As an inventory item, it supports stacking, sinking in water, and consumption via the `edible` component (providing minimal hunger restoration). It is also integrated into the hauntable system and interacts with the snowman decoration system.

## Usage example
```lua
local flint = SpawnPrefab("flint")
flint.Transform:SetPosition(x, y, z)
flint.components.edible:OnEat(inst)  -- consume the flint
```

## Dependencies & tags
**Components used:** `edible`, `tradable`, `stackable`, `inspectable`, `inventoryitem`, `snowmandecor`, `bait`  
**Tags added:** `molebait`, `renewable`, `quakedebris`

## Properties
No public properties are exposed directly by the `flint` prefab itself (all state is managed by its attached components).

## Main functions
The `flint` prefab does not define custom methods on itself. Core behavior is delegated to its components (e.g., `edible:OnEat`, `stackable:SetSize`).

## Events & listeners
**Listens to:** None (no `inst:ListenForEvent` calls in `flint.lua`)  
**Pushes:** None (no direct event firing in `flint.lua`)  

Events used via component callbacks (e.g., `edible` on consumption) are handled internally by the component system and are not directly exposed at this level.
