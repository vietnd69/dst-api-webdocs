---
id: saltrock
title: Saltrock
description: An elemental food item that serves as bait for moles, preserves other items, and repairs equipment using salt-based crafting material.
tags: [inventory, crafting, bait, preservation, repair]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1aca234d
system_scope: inventory
---

# Saltrock

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`saltrock` is a prefab representing a consumable item in the game. It functions as a food item with low nutritional value, a preservative agent, and a repair material. It is also used as bait for moles. The component logic resides primarily in the `fn()` prefab constructor, which attaches multiple standard DST components: `edible`, `stackable`, `preservative`, and `repairer`. Networked properties are configured via standard ECS patterns.

## Usage example
```lua
local inst = SpawnPrefab("saltrock")
-- Configure or interact with its components
inst.components.edible:Feed(entity, 1)  -- consume it
inst.components.preservative:GetPreservationBonus()  -- get preservation multiplier
inst.components.repairer:Repair(item, 1)  -- repair an item
```

## Dependencies & tags
**Components used:** `bait`, `inspectable`, `inventoryitem`, `tradable`, `edible`, `stackable`, `preservative`, `repairer`  
**Tags:** Adds `molebait` (used by mole AI to detect bait)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foodtype` | FOODTYPE | `FOODTYPE.ELEMENTAL` | Classification of the food for hunger and effects. |
| `hungervalue` | number | `1` | Hunger restored when consumed. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size. |
| `percent_increase` | number | `TUNING.SALTROCK_PRESERVE_PERCENT_ADD` | Bonus preservation percentage when used as a preservative. |
| `repairmaterial` | MATERIALS | `MATERIALS.SALT` | Material type used for repair calculations. |
| `finiteusesrepairvalue` | number | `TUNING.SALTLICK_IMPROVED_MAX_LICKS / CACHED_SALT_LICK_IMPROVED_RECIPE_COST` | Number of repair uses per item. |

## Main functions
None identified. This prefab only initializes components in the constructor and does not define custom methods.

## Events & listeners
None identified. No events are directly listened to or pushed by this prefab’s logic.