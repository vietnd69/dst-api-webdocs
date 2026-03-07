---
id: walrus_tusk
title: Walrus Tusk
description: A stackable inventory item prefab used for crafting and trading, typically obtained from walruses.
tags: [inventory, crafting, consumable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0d2cdbf6
system_scope: inventory
---

# Walrus Tusk

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`walrus_tusk` is a lightweight inventory item prefab representing a tusk harvested from walruses. It is fully stackable, hauntable, and designed for crafting recipes and trade interactions. The prefab sets up basic visual, sound, physics, and network state using the `MakeInventoryPhysics`, `MakeInventoryFloatable`, and `MakeHauntableLaunch` helpers. It is strictly a client-side placeholder on non-master instances and fully functional only on the master simulation.

## Usage example
```lua
-- Typical usage in a crafting recipe or world spawn
local tusk = SpawnPrefab("walrus_tusk")
tusk.Transform:SetPosition(x, y, z)
tusk.components.stackable:SetStack(5)  -- stack to 5
tusk.components.inventoryitem:PushToInventory(player, true)
```

## Dependencies & tags
**Components used:** `inspectable`, `stackable`, `inventoryitem`, `hauntable_launch`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum number of walrus tusks per stack. |

## Main functions
*Not applicable.* No custom functions are defined beyond standard component APIs (`stackable`, `inventoryitem`, `hauntable_launch`). The prefab relies on these components’ built-in methods.

## Events & listeners
*None identified.* The prefab does not define custom event listeners or pushed events.