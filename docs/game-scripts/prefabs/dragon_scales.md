---
id: dragon_scales
title: Dragon Scales
description: A stackable inventory item representing a resource dropped by dragons, used for crafting and construction.
tags: [inventory, item, resource]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4b280d46
system_scope: inventory
---

# Dragon Scales

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`dragon_scales` is a prefab defining a stackable inventory item used in crafting and construction. It includes visual, audio, and network support via standard entity components (`Transform`, `AnimState`, `SoundEmitter`, `Network`). It implements physics for inventory use, floatability in water, and integrates with the game's stackable and inspectable systems. The component inherits behavior from `stackable.lua`, specifically overriding the `maxsize` property to allow larger stack capacity than typical items.

## Usage example
```lua
-- To spawn a single dragon scale item
local item = SpawnPrefab("dragon_scales")
-- To increase stack size (if modifying or spawning programmatically)
if item and item.components.stackable then
    item.components.stackable.maxsize = TUNING.STACK_SIZE_LARGEITEM
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`
**Tags:** Adds `dragon_scales` (inferred from prefab name; used by game logic to identify item type), `meditem` (via `MakeInventoryPhysics`), `hauntable_launch` (via `MakeHauntableLaunch`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum number of dragon scales that can stack in a single inventory slot. |

## Main functions
Not applicable.

## Events & listeners
Not applicable.