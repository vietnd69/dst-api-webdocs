---
id: antliontrinket
title: Antliontrinket
description: A small collectible item used as bait for moles and for sale to the Antlion, with stacking and tradable properties.
tags: [inventory, tradable, loot]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 405436c2
system_scope: inventory
---

# Antliontrinket

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `antliontrinket` prefab represents a collectible trinket used as mole bait and as a tradable resource sold to the Antlion boss. It is a lightweight inventory item that supports stacking and integrates with the `tradable` and `stackable` components for game-wide economy and inventory mechanics.

## Usage example
```lua
-- Typical usage in a prefab definition
local inst = CreateEntity()
-- ... entity setup ...
inst:AddTag("molebait")  -- Enables interaction with moles

-- In a player inventory context, the item automatically supports:
-- - Stacking up to TUNING.STACK_SIZE_SMALLITEM
-- - Trading for gold (TUNING.GOLD_VALUES.ANTLION) or rock tribute (9 rocks)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `tradable`, `stackable`  
**Tags:** Adds `molebait`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animstate.bank` | string | `"antliontrinket"` | Animation bank for rendering. |
| `animstate.build` | string | `"antliontrinket"` | Animation build name. |
| `scrapbook_anim` | string | `"1"` | Animation used in the scrapbook. |
| `components.tradable.goldvalue` | number | `TUNING.GOLD_VALUES.ANTLION` | Gold value when sold to Antlion. |
| `components.tradable.rocktribute` | number | `9` | Number of rocks required for tribute to Antlion. |
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size. |

## Main functions
Not applicable.

## Events & listeners
None identified.