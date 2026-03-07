---
id: minotaurhorn
title: Minotaurhorn
description: A consumable meat item that restores health, hunger, and reduces sanity when eaten.
tags: [consumable, food, inventory, sanity, combat]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b8c53ee6
system_scope: inventory
---

# Minotaurhorn

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`minotaurhorn` is a prefab representing a large, edible horn dropped by the Minotaur. It functions as a high-value food item that provides substantial health and hunger restoration but imposes a sanity penalty. The component setup includes physics, animation, network replication, inventory support, stackability, and edibility. It also inherits the `hauntable` property via `MakeHauntableLaunch`, allowing it to spawn a Haunter when used on a Haunted Ruin.

## Usage example
```lua
local inst = SpawnPrefab("minotaurhorn")
-- The prefab is pre-configured with all necessary components and values.
-- To consume it, a player can call:
inst.components.edible:OnEat(player)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `edible`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum number of horns that can stack in one inventory slot. |
| `foodtype` | FOODTYPE | `FOODTYPE.MEAT` | Classification used by other systems to determine compatibility with recipes or AI behavior. |
| `healthvalue` | number | `TUNING.HEALING_HUGE` | Health restored when eaten. |
| `hungervalue` | number | `TUNING.CALORIES_HUGE` | Hunger restored when eaten. |
| `sanityvalue` | number | `-TUNING.SANITY_MED` | Sanity change (negative) when eaten. |

## Main functions
None identified (no custom methods defined; relies on inherited component APIs).

## Events & listeners
- **Pushes:** `hauntable_launch` — fired if the item is used on a Haunted Ruin, triggering Haunter spawn.

Events are handled via the `edible` and `hauntable` logic. No direct `inst:ListenForEvent` calls are present in this file.