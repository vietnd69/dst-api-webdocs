---
id: yotb_pattern_fragments
title: Yotb Pattern Fragments
description: A set of three throwable pattern fragment items that serve as fuel and cat toys.
tags: [fuel, inventory, toy]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f0c147fb
system_scope: inventory
---

# Yotb Pattern Fragments

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yotb_pattern_fragments.lua` file defines three distinct prefabs representing collectible pattern fragments used in the game. Each fragment is a small inventory item with multiple gameplay properties: it functions as a fuel source, a cat toy, and a throwable item that can ignite and burn. The prefabs leverage standard DST components such as `fuel`, `stackable`, `inspectable`, and `tradable` to enable consistent behavior with other similar items.

## Usage example
This file is a factory for prefabs and is not typically instantiated directly by mods. Instead, it is referenced during prefab registration. Modders may reference these prefabs by name (e.g., `yotb_pattern_fragment_1`) to spawn or modify them:
```lua
-- Example: Spawn one of the fragments in the world
local inst = Prefab("yotb_pattern_fragment_1")
if inst then
    inst.Transform:SetPosition(x, y, z)
    TheWorld.entities:Add(inst)
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `inspectable`, `tradable`, `fuel`  
**Tags:** Adds `cattoy` and `yotb_pattern_fragment`  
*(Note: Other helper functions like `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeSmallBurnable`, `MakeSmallPropagator`, and `MakeHauntableLaunchAndIgnite` are from core libraries not shown in the source.)*

## Properties
No public properties are defined in the constructor itself — values are assigned externally via `TUNING` constants. The `fuel` component property `fuelvalue` and the `stackable` component property `maxsize` are configured in the constructor.

## Main functions
Not applicable. This file defines prefab generators, not component behavior. No functional methods are defined in a component class.

## Events & listeners
Not applicable. This file defines prefab prefabs, not components, and does not register or push events directly.