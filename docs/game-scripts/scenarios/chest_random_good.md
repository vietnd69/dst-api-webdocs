---
id: chest_random_good
title: Chest Random Good
description: Generates a randomized selection of high-value loot items for a chest, applying special initialization to certain items with finite uses or fuel.
tags: [loot, chest, random, initialization]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 2ab85369
system_scope: inventory
---

# Chest Random Good

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_random_good` is a scenario logic module that defines and returns a curated, randomized set of high-tier loot items intended for placement in a chest. It selects 6 to 9 items from a predefined list, ensuring no duplicates within a single chest. Items such as tools and armor may receive custom `initfn` callbacks to initialize their `finiteuses` or `fueled` components to randomized durability/fuel values. The module depends on `scenarios/chestfunctions` to actually populate the chest.

## Usage example
```lua
local chest_random_good = require("scenarios/chest_random_good")
-- Assuming `inst` is a chest entity and `scenariorunner` is available
chest_random_good.OnCreate(inst, scenariorunner)
```

## Dependencies & tags
**Components used:**  
- `finiteuses` – via `inst.components.finiteuses:SetUses(...)` in `initfn` callbacks  
- `fueled` – via `inst.components.fueled:InitializeFuelLevel(...)` in `initfn` callbacks  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `GetLoot()`
* **Description:** Generates and returns a table of 6 to 9 randomly selected loot items, each represented as a configuration table. Duplicates are prevented by removing selected items from the source pool after each draw.
* **Parameters:** None.
* **Returns:** `table` – a list of loot entry tables; each entry has keys:
  - `item` (string): prefab name of the item.
  - `count` (number, optional): quantity (defaults to 1 if omitted).
  - `initfn` (function, optional): a callback to initialize custom properties (e.g., uses/fuel) on the spawned item instance.
* **Error states:** None — guarantees at least one item per call.

### `OnCreate(inst, scenariorunner)`
* **Description:** Called when the chest entity is created in a scenario context. Invokes `chestfunctions.AddChestItems` with the current chest entity and the result of `GetLoot()`, thereby populating the chest.
* **Parameters:**
  - `inst` (Entity): The chest entity being created.
  - `scenariorunner` (ScenarioRunner, optional): The scenario runner context (unused in this function but passed for compatibility).
* **Returns:** Nothing.

## Events & listeners
None.