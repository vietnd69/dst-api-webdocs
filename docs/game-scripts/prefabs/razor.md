---
id: razor
title: Razor
description: A server-side prefab component that provides razor functionality as a combat/shaving tool.
tags: [combat, tool, server]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ce7b68d6
system_scope: inventory
---

# Razor

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `razor` prefab is an inventory item representing a shaving tool used in combat or grooming contexts (e.g., shaving beard or hair). It is implemented as a server-privileged entity with core inventory and animation behavior, including attachment of the `inspectable`, `inventoryitem`, and `shaver` components. It supports floatable physics and symmetrical animations for both left/right hand usage.

## Usage example
```lua
local inst = TheWorld:SpawnPrefab("razor")
inst.components.inventoryitem:SetOnActiveFn(function() 
    -- Custom activation logic
end)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `shaver`
**Tags:** Adds `donotautopick`; no other tags observed.

## Properties
No public properties.

## Main functions
Not applicable — the `razor` prefab itself contains no functional methods; behavior is delegated to attached components (`shaver`, `inventoryitem`, etc.).

## Events & listeners
Not applicable — no event listeners or pushes are defined in this prefab source.

### Components attached at runtime (server-only)
- `inspectable`: Enables inspection in the UI (e.g., via tooltip or inspect screen).
- `inventoryitem`: Grants standard inventory item behavior (carrying, equip/unequip, stacking, etc.).
- `shaver`: Provides tool-specific shaving functionality (see `components/shaver.lua` for implementation).
- `MakeHauntableLaunch(inst)`: Allows the item to be used for haunting mechanics (see `util/hauntable.lua`).

> Note: All component logic resides in external component scripts (`shaver`, `inventoryitem`, etc.). This file only defines the base prefab instantiation and asset bindings.

