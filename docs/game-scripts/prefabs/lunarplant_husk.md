---
id: lunarplant_husk
title: Lunarplant Husk
description: A consumable item prefab that drops from lunar plants upon harvesting; used in crafting and interacts with the stackable system for inventory management.
tags: [item, stackable, crafting, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8df7e44f
system_scope: inventory
---

# Lunarplant Husk

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lunarplant_husk` is a prefab definition for a harvestable item dropped by lunar plants. It functions as a lightweight inventory item with standard stackable behavior and floatability, intended for use in crafting recipes. The entity is server-pristine until initialized on the master sim, where it gains `inspectable` and `inventoryitem` capabilities.

## Usage example
This prefab is not added directly by modders but instantiated by game logic (e.g., plant harvesting). However, a modder could reference or extend it:
```lua
-- Example: Creating a custom item based on lunarplant_husk logic
local inst = Prefab("my_custom_husk", nil, my_assets)
inst:AddComponent("inventoryitem")
inst:AddComponent("stackable")
inst.components.stackable.maxsize = TUNING.STACK_SIZE_MEDITEM
MakeInventoryPhysics(inst)
MakeInventoryFloatable(inst, "large", nil, 0.6)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`  
**Tags:** None explicitly added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_MEDITEM` | Maximum stack size allowed for this item. |

## Main functions
None identified — this is a prefab definition, not a runtime component with public methods.

## Events & listeners
None identified — no event listeners or pushes are configured in this prefab definition.