---
id: chest_food
title: Chest Food
description: Provides initial food items for a food chest in the Forest World scenario.
tags: [scenario, inventory, loot, chest]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 68ec686f
system_scope: world
---

# Chest Food

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_food` is a scenario initializer function that populates a food chest with a predefined set of raw food items upon creation. It is part of the scenario-specific setup for the Forest World and delegates the actual chest population logic to `chestfunctions.AddChestItems`. This file serves as a data-driven configuration, not an ECS component — it defines behavior that is invoked during world/entity creation.

## Usage example
```lua
-- Internally used by the scenario system when creating a food chest entity
local inst = CreateEntity()
inst.prefab = "foodchest"
inst:AddTag("chest")
inst:AddComponent("inventoryitem")
inst:AddComponent("loot")

chestfood.OnCreate(inst, scenariorunner)
-- The chest now contains a predefined set of food items
```

## Dependencies & tags
**Components used:** `None` (relies on external function `chestfunctions.AddChestItems`)
**Tags:** Adds `chest` externally (not in this file)

## Properties
No public properties. This file exports only the `OnCreate` function.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Initializes a food chest entity by adding a fixed list of food items to it using `chestfunctions.AddChestItems`.
*   **Parameters:**  
    `inst` (entity) — The chest entity being created. Must support item storage (e.g., have an inventory component).  
    `scenariorunner` (any) — The scenario runner context; unused in this implementation.
*   **Returns:** Nothing.
*   **Error states:** If `chestfunctions.AddChestItems` fails (e.g., `inst` lacks required components), items may not be added silently.

## Events & listeners
Not applicable.

