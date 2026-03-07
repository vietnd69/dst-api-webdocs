---
id: slurperpelt
title: Slurperpelt
description: A consumable food item prefab with inventory and tradability properties, used as a low-value meat resource.
tags: [inventory, food, tradable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5f782ac1
system_scope: inventory
---

# Slurperpelt

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`slurperpelt` is a prefab representing a small, stackable food item (a pelt from a Slurper) that functions as a consumable resource in the game. It is designed for inventory use and integrates with the `edible`, `stackable`, `tradable`, and `inspectable` components. It is typically used as a low-tier meat item that can be eaten, sold, or traded.

## Usage example
This prefab is instantiated automatically by the game engine via `Prefab("slurper_pelt", fn, assets)` and does not require direct component instantiation by modders. As a reference, here is how to spawn one programmatically:
```lua
local pelt = SpawnPrefab("slurper_pelt")
pelt.components.stackable:SetCount(3)
pelt.components.edible:Equip() -- To equip it before eating (e.g., in inventory)
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `tradable`, `inventoryitem`, `edible`, `smallburnable`, `smallpropagator`
**Tags:** Adds `portable`, `inventory`, ` edible`, `meat`, `horrible`, `smallitem`, `burnable`, `propagator`

## Properties
No public properties are defined or modified beyond component-level defaults (e.g., `stackable.maxsize`, `tradable.goldvalue`, `edible.foodtype`). These are configured in the constructor via component assignments.

## Main functions
Not applicable — this is a prefab definition, not a component class. It uses existing components (e.g., `stackable`, `edible`) but does not define its own component class or methods.

## Events & listeners
Not applicable — no custom event listeners or event pushes are defined in this file.