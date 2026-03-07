---
id: stinger
title: Stinger
description: A small throwable item prefab that can be stacked and launched as a projectile.
tags: [combat, projectile, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 40307f8e
system_scope: inventory
---

# Stinger

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `stinger` prefab defines a small, throwable item used in combat, typically deployed by the Bee Queen or other entities. It supports stacking via the `stackable` component, self-stacking via `selfstacker`, and integrates with DST's inventory, burn, propagator, and haunt systems. It is a client-server synchronized prefab that renders with a dedicated animation bank and build.

## Usage example
```lua
local inst = SpawnPrefab("stinger")
if inst then
    -- The stinger is already stackable by default in this prefab's definition
    -- Stack size is TUNING.STACK_SIZE_SMALLITEM (typically 50)
    inst.components.inventoryitem:SayYesToOwner()
    inst.components.inventoryitem:PushToSlot("inventory")
end
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `selfstacker`, `burnable`, `propagator`, `hauntable`
**Tags:** `selfstacker`, `smallitem`, `burnable`, `projectile`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum number of stingers that can be stacked in one inventory slot. |

## Main functions
None identified — this is a prefab definition, not a component class. All behavior is configured via component initialization in the constructor (`fn`).

## Events & listeners
None identified — no event listeners or pushes are defined directly in this file.