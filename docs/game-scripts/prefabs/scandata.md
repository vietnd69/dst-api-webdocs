---
id: scandata
title: Scandata
description: Defines a stackable inventory item representing scanned data that is flammable and hauntable.
tags: [inventory, item, collectible, fire]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 58e61e55
system_scope: entity
---

# Scandata

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
The `Scandata` prefab defines a collectible inventory item representing scanned information. It is designed to be stacked in inventory slots and interacts with fire and haunting mechanics. The prefab uses helper functions to attach burnable, propagator, and hauntable behaviors automatically.

## Usage example
```lua
local inst = SpawnPrefab("scandata")
if inst and inst.components.inventoryitem then
    inst.components.inventoryitem:GiveToPlayer(player)
end
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- accessed for `STACK_SIZE_SMALLITEM` constant

**Components used:**
- `inspectable` -- enables examination text
- `inventoryitem` -- enables pickup and storage
- `stackable` -- enables stacking logic (maxsize configured)

**Tags:**
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pickupsound` | string | `"paper"` | Sound asset played on pickup. |

## Main functions
None identified.

## Events & listeners
None. This prefab file does not register any direct event listeners via `ListenForEvent` or fire events via `PushEvent`. Event behavior is handled internally by helper functions (`MakeSmallBurnable`, `MakeSmallPropagator`, `MakeHauntableLaunchAndIgnite`) which may attach their own listeners to the entity.