---
id: halloween_ornaments
title: Halloween Ornaments
description: Generates prefab instances for Halloween-themed decorative inventory items with floatable physics and limited fuel value.
tags: [inventory, decoration, halloween, physics, fuel]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d0d9cb1a
system_scope: inventory
---

# Halloween Ornaments

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This script defines the prefabs for Halloween Ornament items used in the game. Each ornament is an inventoryable, stackable decorative item with floatable physics properties, intended for use as moles bait and cat toys. The component logic is embedded directly in the prefab construction function (`fn`), not as a standalone component class. It attaches `fuel`, `stackable`, `inventoryitem`, and `inspectable` components conditionally on the master simulation.

## Usage example
```lua
-- The prefabs are returned via unpack(ornament), so individual items are referenced directly:
local ornament1 = "halloween_ornament_1"
local ornament2 = "halloween_ornament_2"
-- These prefabs can then be spawned via spawnid, spawnanim, or prefabspawnedfn as usual.
```

## Dependencies & tags
**Components used:** `fuel`, `stackable`, `inventoryitem`, `inspectable`  
**Tags added:** `halloween_ornament`, `molebait`, `cattoy`

## Properties
No public properties — this file defines prefabs, not a reusable component class.

## Main functions
Not applicable — no component functions exist in this file. The logic resides in the prefab factory function `fn` passed to `Prefab()`.

## Events & listeners
None identified.