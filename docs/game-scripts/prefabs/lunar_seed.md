---
id: lunar_seed
title: Lunar Seed
description: Prefab definition for the lunar seed item, a collectible with inventory, tradable, stackable, and inspectable functionality, used in seasonal or event-based gameplay.
tags: [inventory, tradable, event]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 44aa286d
system_scope: inventory
---

# Lunar Seed

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lunar_seed` is a consumable or collectible item prefab that functions as an inventory item. It supports stacking, inspection, and trading. It features visual assets including animations, sound, dynamic shadow, and dynamic lighting effects via symbol light overrides. On the server (master simulation), it initializes with a randomized frame and gains standard utility components (`inspectable`, `inventoryitem`, `tradable`, `stackable`) to integrate into DST's item systems.

## Usage example
```lua
-- Spawn a lunar seed in the world
local seed = SpawnPrefab("lunar_seed")
seed.Transform:SetPosition(x, y, z)

-- Or add directly to an inventory
player.components.inventory:GiveItem(seed)
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `tradable`, `stackable`
**Tags:** Adds `lunarseed`

## Properties
No public properties

## Main functions
Not applicable — this file defines only a prefab factory function (`seedfn`), not a standalone component.

## Events & listeners
Not applicable — no event listeners or event pushes are defined in this file.