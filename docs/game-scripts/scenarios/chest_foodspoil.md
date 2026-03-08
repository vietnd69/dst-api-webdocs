---
id: chest_foodspoil
title: Chest Foodspoil
description: Implements a chest trap that spoils food items in the player's inventory and equipped gear when opened.
tags: [trap, inventory, perishable, scenario]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: f02bce18
system_scope: inventory
---

# Chest Foodspoil

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_foodspoil` is a scenario module that defines behavior for a chest trap designed to spoil food items. When triggered, it reduces the freshness of perishable items in the player's equipped armor, container items (like backpacks), and inventory slots by 50%. It also spawns a toxic cloud particle effect and plays a sound. This module relies on `chestfunctions.lua` to handle chest initialization, item spawning, and trap activation logic.

## Usage example
This module is used internally by the scenario system and not added directly to entities. It exports lifecycle functions that integrate with `scenarios/chestfunctions.lua`:
```lua
-- When a chest is created with this scenario module:
local inst = CreateEntity()
inst:AddTag("chest")
inst:AddComponent("container")
inst:AddComponent("perishable") -- for chest loot

-- The scenario hooks are invoked via chestfunctions:
chestfunctions.AddChestItems(inst, loot) -- called in OnCreate
chestfunctions.InitializeChestTrap(inst, scenariorunner, triggertrap) -- called in OnLoad
```

## Dependencies & tags
**Components used:** `container`, `edible`, `perishable`, `inventory`, `sanity`  
**Tags:** None explicitly added or removed.

## Properties
No public properties — this module exports only top-level functions.

## Main functions
### `triggertrap(inst, scenariorunner, data)`
*   **Description:** Triggers the spoil effect when the chest is opened. Reduces perishable food items in the player's inventory, equipment, and container slots by 50%, spawns a `poopcloud` particle, and plays a sound.
*   **Parameters:**  
    - `inst` (entity) — the chest entity instance.  
    - `scenariorunner` (scenario runner) — the scenario execution context.  
    - `data` (table) — event data containing `player` (the entity that opened the chest).  
*   **Returns:** Nothing.
*   **Error states:** Silently skips processing if `data.player` is `nil` or lacks an `inventory` component.

### `OnCreate(inst, scenariorunner)`
*   **Description:** Called when the chest is first created. Adds predefined loot (`spoiled_food` and `blueprint` items) to the chest using `chestfunctions.AddChestItems`.
*   **Parameters:**  
    - `inst` (entity) — the chest entity instance.  
    - `scenariorunner` (scenario runner) — the scenario execution context.  
*   **Returns:** Nothing.

### `OnLoad(inst, scenariorunner)`
*   **Description:** Called when the chest is loaded from save data. Initializes the trap behavior by registering `triggertrap` as the activation callback via `chestfunctions.InitializeChestTrap`.
*   **Parameters:**  
    - `inst` (entity) — the chest entity instance.  
    - `scenariorunner` (scenario runner) — the scenario execution context.  
*   **Returns:** Nothing.

### `OnDestroy(inst)`
*   **Description:** Called when the chest is destroyed. Delegates cleanup to `chestfunctions.OnDestroy`.
*   **Parameters:** `inst` (entity) — the chest entity instance.  
*   **Returns:** Nothing.

## Events & listeners
This module does not register or fire events directly. It reacts to external triggers via `scenarios/chestfunctions.lua`.