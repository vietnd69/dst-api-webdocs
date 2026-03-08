---
id: chest_explosion
title: Chest Explosion
description: Sets up a chest prefab to explode upon interaction, dropping a predefined set of loot items and registering a trap trigger function.
tags: [loot, trap, interaction]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 62283236
system_scope: entity
---

# Chest Explosion

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_explosion.lua` is a scenario script that configures a chest prefab to function as an explosive trap. Upon activation (typically via player interaction), it triggers a one-time loot drop using the `lootdropper` component, then registers a custom `triggertrap` function via `chestfunctions`. This script does not define a component itself but serves as a scenario callback container, linking `OnCreate`, `OnLoad`, and `OnDestroy` lifecycle hooks to helper functions from `chestfunctions.lua` and loot configuration data.

## Usage example
```lua
-- Not a component; used as a scenario return table attached to a chest prefab
-- In a prefab file (e.g., prefabs/explosive_chest.lua):
return Prefab("explosive_chest", fn, assets, prefabs, scenario)
    -- where scenario = require("scenarios/chest_explosion")
```

## Dependencies & tags
**Components used:** `lootdropper` (via `inst.components.lootdropper` in `triggertrap`)  
**Tags:** None identified  

## Properties
No public properties  

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Called when the entity is first created. Initializes the chest with custom loot items (including Fire Staff, Ash, Gunpowder, and Logs) using `chestfunctions.AddChestItems`.
*   **Parameters:**  
    - `inst` (Entity) - The entity instance representing the chest.  
    - `scenariorunner` (ScenarioRunner) - The scenario runner instance, passed for extensibility.  
*   **Returns:** Nothing.

### `OnLoad(inst, scenariorunner)`
*   **Description:** Called when the entity is loaded from save data. Initializes the trap logic by calling `chestfunctions.InitializeChestTrap`, which registers the `triggertrap` function to run on chest interaction.
*   **Parameters:**  
    - `inst` (Entity) - The entity instance.  
    - `scenariorunner` (ScenarioRunner) - The scenario runner instance.  
*   **Returns:** Nothing.

### `OnDestroy(inst)`
*   **Description:** Called when the entity is destroyed. Delegates cleanup to `chestfunctions.OnDestroy`, which likely handles removing tags or listeners associated with the trap state.
*   **Parameters:**  
    - `inst` (Entity) - The entity instance.  
*   **Returns:** Nothing.

### `triggertrap(inst)`
*   **Description:** Internal helper invoked when the chest is activated as a trap. Adds the `lootdropper` component (if not already present), sets the loot pool to a fixed list of gunpowder and firehound items, and drops them at the chest's position.
*   **Parameters:**  
    - `inst` (Entity) - The entity instance (the exploding chest).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified