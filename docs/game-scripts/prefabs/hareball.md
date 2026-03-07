---
id: hareball
title: Hareball
description: A consumable, renewable cat toy that perishes over time and can be ignited or thrown.
tags: [consumable, inventory, perishable, toy]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7452ee96
system_scope: inventory
---

# Hareball

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`hareball` is a lightweight inventory item that functions as a cat toy. It is perishable, flammable, and renewable, and is typically used to interact with cats (e.g., Abigail). When thrown and lands, it emits a sound effect. The prefab uses the `perishable` component to model decay over time, and can be replaced by `spoiled_food` upon spoilage.

## Usage example
```lua
local inst = SpawnPrefab("hareball")
if inst and inst.components then
    inst.components.perishable:SetPerishTime(TUNING.PERISH_FAST)
    inst.components.perishable:StartPerishing()
    -- Optional: Listen for when it lands
    inst:ListenForEvent("on_landed", function(e) print("Hareball landed!") end)
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `edible`, `inspectable`, `tradable`, `perishable`
**Tags:** Adds `cattoy`, `renewable`

## Properties
No public properties.

## Main functions
None.

## Events & listeners
- **Listens to:** `on_landed` — triggers `on_hareball_landed` to play a sound effect when the item hits the ground.
- **Pushes:** None.