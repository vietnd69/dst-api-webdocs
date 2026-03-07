---
id: honeycomb
title: Honeycomb
description: A consumable food item that restores health and hunger, tradable and stackable, commonly used in crafting or as bait.
tags: [food, inventory, crafting]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8cf6a75a
system_scope: inventory
---

# Honeycomb

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `honeycomb` prefab represents an in-game food item. It is an inventory-based entity with physical and visual properties suitable for handling by players (e.g., pickup, stacking, floating on water). Though the `edible` component is commented out in the current source, its intended use aligns with consumable food items via `components.edible`. It integrates with DST's inventory system, tradability, inspectability, and hauntable mechanics.

## Usage example
```lua
local honeycomb = SpawnPrefab("honeycomb")
-- Honeycomb is automatically stackable and tradable
-- When edible (uncommented), it restores health and hunger on consumption
```

## Dependencies & tags
**Components used:** `tradable`, `inspectable`, `inventoryitem`, `stackable`, `transform`, `animstate`, `network`, `physics`, `floating` (via `MakeInventoryFloatable`)  
**Tags:** Adds `honeyed`

## Properties
No public properties are defined directly in this file.

## Main functions
Not applicable.

## Events & listeners
None identified.