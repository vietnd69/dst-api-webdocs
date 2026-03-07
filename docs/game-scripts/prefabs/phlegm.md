---
id: phlegm
title: Phlegm
description: A consumable item that restores hunger and sanity but provides no health.
tags: [inventory, food, consumable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a1cc03b6
system_scope: inventory
---

# Phlegm

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`phlegm` is a prefab definition for a small, stackable, edible item used in Don't Starve Together. It functions as a consumable food source with negative sanity impact but positive hunger restoration and no health gain. The prefab uses standard inventory and edible components, and supports hauntable launch mechanics for boss interactions.

## Usage example
```lua
local phlegm = SpawnPrefab("phlegm")
phlegm.components.stackable:SetCount(5)
phlegm.components.edible:OnEat(some_character)
```

## Dependencies & tags
**Components used:** `stackable`, `edible`, `inventoryitem`, `inspectable`, `tradable`, `hauntable_launch`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |
| `edible.healthvalue` | number | `0` | Health restored on consumption. |
| `edible.hungervalue` | number | `TUNING.CALORIES_SMALL` | Hunger restored on consumption. |
| `edible.sanityvalue` | number | `-TUNING.SANITY_MED` | Sanity change on consumption (negative = loss). |
| `edible.foodtype` | FOODTYPE | `FOODTYPE.GENERIC` | Category used for dietary restrictions and effects. |

## Main functions
No unique functions are defined for the phlegm prefab itself. It relies entirely on functionality provided by its attached components.

### Inherited from `stackable`
- `SetCount(count)` – sets the current stack size.
- `GetMaxSize()` – returns `TUNING.STACK_SIZE_SMALLITEM`.

### Inherited from `edible`
- `OnEat(eater)` – consumes the item and applies health/hunger/sanity effects.
- Properties like `healthvalue`, `hungervalue`, `sanityvalue`, and `foodtype` configure consumption behavior.

## Events & listeners
None identified. The phlegm prefab does not define custom event listeners or push events.

