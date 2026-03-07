---
id: cotl_trinket
title: Cotl Trinket
description: A small, non-functional trinket item used as bait for moles and tradable for in-game currency or tribute.
tags: [inventory, loot, trade, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 93dc49ab
system_scope: inventory
---

# Cotl Trinket

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cotl_trinket` is a game prefab representing a decorative, low-value item dropped by certain structures (e.g., Cattle Troughs of Light). It serves no gameplay mechanic beyond acting as mole bait (via the `molebait` tag) and contributing to item stacking, trade, and tribute systems. It is purely visual and consumable for specific interactions.

## Usage example
```lua
-- Example of adding a cotl_trinket to an entity's inventory and using it as mole bait
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("stackable")
inst:AddTag("molebait")
-- The actual trinket prefab is created via `TheWorld:PushEvent("spawn prefab", "cotl_trinket")`
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `tradable`, `stackable`, `hauntable`
**Tags:** Adds `molebait` to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_anim` | string | `"1"` | Animation name used in the scrapbook UI (server-only). |
| `tradable.goldvalue` | number | `TUNING.GOLD_VALUES.COTL_TRINKET` | In-game gold value for trading. |
| `tradable.rocktribute` | number | `6` | Amount of tribute paid when trading to a Rock Tribute system. |
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size allowed for this item. |

## Main functions
None identified.

## Events & listeners
None identified.