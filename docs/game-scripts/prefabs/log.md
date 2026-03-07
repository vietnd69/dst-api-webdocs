---
id: log
title: Log
description: A stackable, edible wood item that serves as fuel, repair material, and trash food in the game.
tags: [inventory, fuel, crafting]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 83ced237
system_scope: inventory
---

# Log

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`log` is a base prefab representing a stackable piece of wood used primarily as fuel, a repair material, or consumable trash food. It is a foundational item in DST's crafting and survival systems. The prefab integrates with the `edible`, `fuel`, and `repairer` components to define its properties as food (nutritionally inert), burnable resource, and repairer for wooden structures. It also includes networking, animation, physics, and inventory capabilities.

## Usage example
```lua
--Typical usage in a mod to spawn logs (e.g., from a tree砍伐):
local log = SpawnPrefab("log")
log.Transform:SetPosition(x, y, z)
log.components.stackable:SetSize(10)
```

## Dependencies & tags
**Components used:** `edible`, `fuel`, `repairer`, `tradable`, `inspectable`, `inventoryitem`, `stackable`, `burnable`, `propagator`, `hauntable`  
**Tags:** Adds `log` and implicitly `wood` via `MakeSmallBurnable`/`MakeSmallPropagator`.

## Properties
No public properties are defined directly in this file's constructor. Properties are configured via component members after component addition.

## Main functions
This is a prefab definition file (returns a `Prefab`), not a component class. It does not define methods or functions; it configures an entity via component properties and setup functions.

## Events & listeners
None identified in this file.