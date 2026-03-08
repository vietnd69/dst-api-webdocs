---
id: chest_cavefood
title: Chest Cavefood
description: Populates a chest with randomized cave-appropriate food items, each with a random initial perishability percentage.
tags: [loot, food, perishable, chest]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 80ed972c
system_scope: inventory
---

# Chest Cavefood

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_cavefood` is a scenario initializer function that populates a chest with a randomized selection of perishable food items commonly found or usable in the Caves dimension. It relies on `chestfunctions.AddChestItems` to handle inventory population and directly manipulates the `perishable` component of each item to assign a random starting spoilage level via `SetPercent`.

## Usage example
```lua
local inst = CreateEntity()
-- The function expects to be called as part of a scenario's OnCreate handler
-- Typically invoked like: OnCreate(inst, scenariorunner)
-- (No direct manual invocation needed for modders.)
```

## Dependencies & tags
**Components used:** `perishable`, `chest`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Initializes the chest with a predefined set of cave-compatible food items. Each item is spawned with a random count (where applicable) and assigned a random perish percentage between `0.0` and `1.0`.
* **Parameters:**
  * `inst` (Entity) — The chest entity to populate.
  * `scenariorunner` (Entity or nil) — The scenario runner context (unused in current implementation).
* **Returns:** Nothing.
* **Error states:** None documented; assumes valid `inst` with a `chest` component and `perishable` component support on spawned items.

## Events & listeners
- **Pushes:** None.
- **Listens to:** None.

**Item list includes:**
- `berries` (5–9)
- `carrot` (3–6)
- `lightbulb` (4–9)
- `batwing` (1)
- `meat` (2–4)
- `smallmeat` (2–5)
- `monstermeat` (2–5)

Each item’s `perishable:SetPercent(math.random())` is called during initialization to assign a random initial spoilage state.