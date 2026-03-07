---
id: moonbutterflywings
title: Moonbutterflywings
description: A consumable inventory item that restores health, hunger, and sanity when eaten, but spoils quickly.
tags: [consumable, inventory, spoilable, sanity, food]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 61f433a8
system_scope: inventory
---

# Moonbutterflywings

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moonbutterflywings` is an edible inventory item prefab used as a consumable food source in DST. It provides modest health, significant sanity, and minimal hunger restoration. The item spoils rapidly and transforms into `spoiled_food` upon expiration. It is taggued as `cattoy`, making it usable as a decorative or interactive item for certain entities (e.g., Wilson's cat). The prefab integrates with multiple core systems: `edible`, `perishable`, `stackable`, `inventoryitem`, and `tradable`.

## Usage example
```lua
local inst = SpawnPrefab("moonbutterflywings")
-- Entity is immediately usable as food
-- stacks up to STACK_SIZE_SMALLITEM
-- spoils after PERISH_FAST duration
```

## Dependencies & tags
**Components used:** `edible`, `perishable`, `stackable`, `inspectable`, `inventoryitem`, `tradable`  
**Tags:** Adds `cattoy`

## Properties
No public properties defined in this file.

## Main functions
This is a prefab definition script, not a component class. The `fn()` function configures the entity on spawn; no reusable component methods are exposed.

## Events & listeners
None identified.

