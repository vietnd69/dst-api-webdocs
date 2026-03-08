---
id: chest_winter
title: Chest Winter
description: Defines the behavior and loot distribution for a winter-themed chest that triggers seasonal changes when opened.
tags: [winter, loot, trap, season, scenario]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 9c751b62
system_scope: world
---

# Chest Winter

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_winter` is a scenario script that configures a chest prefab to contain predefined winter-themed loot and act as a trap. When opened, the chest plays a sound, changes the season to winter (advance season twice to ensure transition), and forces precipitation. It leverages reusable functionality from `chestfunctions.lua` to manage loot population, trap initialization, and cleanup.

## Usage example
```lua
-- This scenario is not instantiated directly; it's used as a mixin for chest prefabs.
-- Example integration in a chest prefab:
inst:AddDynamicVar("scenariomixin", {
    OnCreate = ChestWinter_OnCreate,
    OnLoad = ChestWinter_OnLoad,
    OnDestroy = ChestWinter_OnDestroy,
})
```

## Dependencies & tags
**Components used:** `SoundEmitter`, `inventoryitem`, `lootdropper` (via `chestfunctions`)
**Tags:** None identified.

## Properties
No public properties. Configuration is done via local data structures.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Called when the chest entity is first created. Populates the chest with predefined loot items using `chestfunctions.AddChestItems`.
*   **Parameters:**  
    `inst` (Entity) - The chest instance being created.  
    `scenariorunner` (ScenarioRunner) - The scenario runner managing this instance.
*   **Returns:** Nothing.

### `OnLoad(inst, scenariorunner)`
*   **Description:** Called when the chest is loaded from save. Initializes the trap logic via `chestfunctions.InitializeChestTrap`, passing the custom `triggertrap` handler.
*   **Parameters:**  
    `inst` (Entity) - The loaded chest instance.  
    `scenariorunner` (ScenarioRunner) - The scenario runner instance.
*   **Returns:** Nothing.

### `OnDestroy(inst)`
*   **Description:** Called when the chest is destroyed. Invokes cleanup logic from `chestfunctions.OnDestroy`.
*   **Parameters:**  
    `inst` (Entity) - The chest instance being destroyed.
*   **Returns:** Nothing.

## Events & listeners
- **Pushes (via `triggertrap`):**  
    `ms_setseason` - Sets season to `"winter"`.  
    `ms_advanceseason` - Calls twice to ensure seasonal transition.  
    `ms_forceprecipitation` - Forces precipitation to begin.  
- **Listens to:** None. Event handling is deferred to `chestfunctions`.

## Loot Table
The chest always contains the following loot (when successfully populated):
| Item | Count | Chance |
|------|-------|--------|
| `icestaff` | 1 | 33% |
| `cutgrass` | 40 | 66% |
| `twigs` | 40 | 66% |
| `log` | 20 | 66% |
| `winterhat` | 1 | 80% |
| `trunkvest_summer` | 1 | 80% |
| `axe` | 1 | 100% |