---
id: moontree_blossom
title: Moontree Blossom
description: A perishable, stackable food item that can be dried into moon_tree_blossom_dried, used as a consumable item or decorative object.
tags: [inventory, food, drying, decoration]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c4c5a4f2
system_scope: inventory
---

# Moontree Blossom

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moontree_blossom` is a consumable food item and stackable inventory object used for healing, crafting, or decoration. It can be placed in a vase or carried by a cat as a toy. When held in an inventory slot, it begins perishing; it can also be dried on a meat rack to produce `moon_tree_blossom_dried`. The prefab includes two variants: the standard `moon_tree_blossom` (inventory/dried state) and `moon_tree_blossom_worldgen` (stationary ground version used in world generation).

## Usage example
```lua
local inst = SpawnPrefab("moon_tree_blossom")
inst.components.edible.healthvalue = TUNING.HEALING_TINY
inst.components.perishable:StopPerishing() -- for custom behavior
inst.components.dryable:SetProduct("custom_dried_item") -- override drying output
```

## Dependencies & tags
**Components used:** `inventoryitem`, `tradable`, `vasedecoration`, `stackable`, `edible`, `perishable`, `dryable`, `inspectable`, `hauntable`, `propagator`, `burnable`.  
**Tags:** `cattoy`, `vasedecoration`, `dryable`.

## Properties
No public properties initialized in the constructor. All configuration occurs through component APIs.

## Main functions
No public methods are defined in this file. All functionality is delegated to attached components.

## Events & listeners
- **Listens to:** None directly (event handling is managed via component callbacks).
- **Pushes:** None directly (events are emitted by component callbacks, e.g., `onperish` from `perishable`).
