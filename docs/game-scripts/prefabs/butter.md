---
id: butter
title: Butter
description: A consumable food item that restores health and hunger, which slowly spoils into spoiled food over time.
tags: [food, consumable, inventory]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b2a8ae1f
system_scope: inventory
---

# Butter

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `butter` prefab represents a high-value consumable food item that provides substantial health and hunger restoration. It uses the `edible`, `perishable`, and `stackable` components to define its core mechanics: nutritional value, spoilage behavior, and stacking capacity. It is designed to be lightweight, storable, and tradable, making it a versatile food resource for players.

## Usage example
This prefab is not typically instantiated manually by mods; it is loaded automatically when referenced in recipes, world generation, or item drops. However, to replicate its core behavior in a custom item:
```lua
local inst = CreateEntity()
inst:AddComponent("stackable")
inst.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM
inst:AddComponent("edible")
inst.components.edible.healthvalue = TUNING.HEALING_LARGE
inst.components.edible.hungervalue = TUNING.CALORIES_MED
inst:AddComponent("perishable")
inst.components.perishable:SetPerishTime(TUNING.PERISH_SUPERSLOW)
inst.components.perishable:StartPerishing()
inst.components.perishable.onperishreplacement = "spoiled_food"
```

## Dependencies & tags
**Components used:** `stackable`, `edible`, `perishable`, `inventoryitem`, `tradable`, `inspectable`, `hauntable`
**Tags:** None explicitly added or checked by this file.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |
| `healthvalue` | number | `TUNING.HEALING_LARGE` | Health restored when eaten. |
| `hungervalue` | number | `TUNING.CALORIES_MED` | Hunger restored when eaten. |
| `perishtime` | number | `TUNING.PERISH_SUPERSLOW` | Time (in seconds) before the item spoils. |
| `onperishreplacement` | string | `"spoiled_food"` | Prefab name to spawn upon spoilage. |

## Main functions
None defined directly in this file—functionality is implemented via components and the constructor.

## Events & listeners
- **Listens to:** None—relies on component-provided events (e.g., `perishable` updates internally).
- **Pushes:** None directly; spoilage is handled via component logic and potential `onperish` events in `perishable`.