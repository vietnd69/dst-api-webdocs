---
id: woby_treat
title: Woby Treat
description: A consumable meat item that restores minimal hunger and health but reduces sanity; used as pet food or quick bait.
tags: [consumable, pet, monstermeat]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d55912da
system_scope: inventory
---

# Woby Treat

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`woby_treat` defines a prefab for an in-game consumable item — specifically, a small meat treat that can be eaten by characters or fed to pets. It is implemented as a prefabricated entity with multiple components: `edible`, `stackable`, `tradable`, `inventoryitem`, and support components for burnable, propagator, and hauntable behavior. It carries tags indicating it is meat, monster meat, and pet-friendly, enabling specific feeding interactions and inventory behaviors.

## Usage example
This prefab is not typically instantiated directly by mods; instead, it is referenced via its prefab name `"woby_treat"` when spawning items (e.g., via `SpawnPrefab("woby_treat")`). Modders can customize its properties by overriding the prefab or extending it, e.g.:
```lua
local treat = SpawnPrefab("woby_treat")
treat.components.edible.healthvalue = 10 -- override default negative value
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `edible`, `tradable`
**Tags:** `meat`, `quickeat`, `monstermeat`, `quickfeed`, `pet_treat`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |
| `ismeat` | boolean | `true` | Indicates the item is meat (affects spoilage and consumption rules). |
| `foodtype` | FOODTYPE enum | `FOODTYPE.MEAT` | Primary food classification. |
| `secondaryfoodtype` | FOODTYPE enum or `nil` | `FOODTYPE.MONSTER` | Secondary food classification (for mixed-type consumables). |
| `healthvalue` | number | `-TUNING.HEALING_TINY` | Health restored (negative = damage). |
| `hungervalue` | number | `TUNING.CALORIES_TINY` | Hunger restored. |
| `sanityvalue` | number | `-TUNING.SANITY_TINY` | Sanity change upon consumption. |
| `goldvalue` | number | `0` | Value when sold to NPCs (e.g., Wilson's shop). |

## Main functions
Not applicable. This is a prefab definition, not a component class with custom methods.

## Events & listeners
Not applicable. The prefab does not define custom event listeners or emissions in the provided source.