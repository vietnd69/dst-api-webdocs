---
id: moonrocknugget
title: Moonrocknugget
description: Prefab for a small, reusable crafting material that can be consumed for minimal nutrition, used in repairs, and dropped as loot.
tags: [crafting, consumable, repair, loot]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 62856e7c
system_scope: inventory
---

# Moonrocknugget

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moonrocknugget` prefab represents a small, elemental-tier item used for crafting, minor repair, and consumable purposes. It is built using an Entity Component System, attaching core functional components like `edible`, `stackable`, `repairer`, `tradable`, `inventoryitem`, `inspectable`, and `snowmandecor`. It functions both as a consumable food item and as a repair material, specifically for moon rock–based structures and items. Being lightweight, it stacks in small quantities and sinks when dropped.

## Usage example
```lua
local inst = Prefab("moonrocknugget", fn, assets)
-- Note: This prefab is built via the `fn()` constructor and instantiated as a dynamic entity in-world.
-- Typically, it is spawned using:
local nugget = TheWorld:SpawnPrefab("moonrocknugget")
nugget.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `edible`, `tradable`, `stackable`, `inspectable`, `inventoryitem`, `repairer`, `snowmandecor`  
**Tags:** None explicitly added or removed in this file.

## Properties
No public properties are defined directly on the prefab instance in this file. All configuration is done through attached component properties.

## Main functions
Not applicable.

## Events & listeners
Not applicable.
