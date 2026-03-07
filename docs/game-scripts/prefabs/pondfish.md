---
id: pondfish
title: Pondfish
description: Generates fish and eel prefabs with lifecycle, cooking, and weight traits for in-game consumption and trade.
tags: [food, fishing, loot, weight]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 19fcb631
system_scope: entity
---

# Pondfish

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pondfish.lua` defines two prefabs—`pondfish` and `pondeel`—that represent raw fish and eel items in the world. These prefabs are created via shared factory logic (`commonfn`) and assembled with components that handle perishability, cooking, edibility, tradability, weight measurement, and animations. The prefabs also feature a periodic "flop" animation to simulate life before pickup. They interact with the `bait`, `inventoryitem`, `perishable`, `cookable`, `edible`, `lootdropper`, `tradable`, `weighable`, and `murderable` components.

## Usage example
This file is not directly instantiated as a component. Instead, it exports prefabs (`pondfish` and `pondeel`) that are used elsewhere in the codebase, for example when fishing:

```lua
-- Example: Fishingrod.lua spawns pondfish prefabs as loot
local fish = SpawnPrefab("pondfish")
```

## Dependencies & tags
**Components used:** `bait`, `perishable`, `cookable`, `inspectable`, `inventoryitem`, `murderable`, `lootdropper`, `edible`, `tradable`, `weighable`

**Tags added:** `fish`, `pondfish`, `meat`, `catfood`, `smallcreature`, `weighable_fish` (conditionally added when weight data is provided)

## Properties
No public properties—this file defines prefab constructors, not a component class.

## Main functions
Not applicable

## Events & listeners
- **Listens to:** `on_loot_dropped` — triggers `ondroppedasloot` to set `weighable.prefab_override_owner` when dropped by another entity.
- **Pushes:** None directly (events are handled by attached components).