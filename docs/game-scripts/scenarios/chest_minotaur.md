---
id: chest_minotaur
title: Chest Minotaur
description: Initializes loot content for the Minotaur Chest by populating it with condition-managed armor, finite-uses weapons, and random resource stacks based on weighted probabilities.
tags: [loot, chest, boss, items]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 209a0ee7
system_scope: inventory
---

# Chest Minotaur

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario script defines the loot configuration for the Minotaur Chest — a boss reward container. It uses `chestfunctions.AddChestItems()` to populate the chest with items grouped into categories (armor, weapons, resources), each with associated drop chances and optional initialization functions. Armor and weapon items are initialized with randomized durability/charge levels, while resource stacks have randomly assigned counts. The script does not define a component class itself but serves as a top-level configuration handler invoked by the chest entity during creation.

## Usage example
```lua
local chest = CreateEntity()
-- ... entity setup ...
chest_minotaur = require("scenarios/chest_minotaur")
chest_minotaur.OnCreate(chest, scenariorunner)
```

## Dependencies & tags
**Components used:** `armor`, `finiteuses`  
**Tags:** None identified  

## Properties
No public properties — this script exports only a single top-level function.

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Populates the given chest entity with Minotaur-specific loot. Called automatically when the chest is created.  
* **Parameters:**  
  * `inst` (Entity) — The chest entity to populate.  
  * `scenariorunner` (Entity/nil) — The scenario runner context; unused in this implementation.  
* **Returns:** Nothing.  
* **Error states:** None — assumes `chestfunctions.AddChestItems()` and item components (`armor`, `finiteuses`) exist and are properly initialized.

## Events & listeners
None identified.