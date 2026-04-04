---
id: bearger_fur
title: Bearger Fur
description: Defines the Bearger Fur inventory item prefab, including stacking and hauntable behavior.
tags: [inventory, item, prefab, stacking]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3034c5e1
system_scope: inventory
---

# Bearger Fur

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`bearger_fur` is a prefab definition for the Bearger Fur item dropped by the Bearger boss. It configures the entity as an inventory item with physics and animation states. On the server simulation, it adds inspection capabilities, stacking behavior configured to large item sizes, and hauntable logic allowing ghosts to launch the item.

## Usage example
```lua
-- Spawn the prefab into the world
local fur = SpawnPrefab("bearger_fur")

-- Access component properties on server
if TheWorld.ismastersim then
    print(fur.components.stackable.maxsize)
    fur.components.inventoryitem:GiveTo(inv)
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable` (server-side); `transform`, `animstate`, `soundemitter`, `network` (base).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
None identified.