---
id: chest_labyrinth_mimic
title: Chest Labyrinth Mimic
description: Configures random item rewards for labyrinth chests and conditionally adds a chance for mimic entities to appear on items.
tags: [loot, chest, mimic]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: d9c04c4f
system_scope: world
---

# Chest Labyrinth Mimic

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario script defines reward generation logic for labyrinth chest prefabs. It assigns randomized items (including weapons, armor, and consumables) with varying drop chances, applies condition/uses to item components based on RNG, and introduces a `MIMIC_CHANCE` (33%) for each generated item to receive the `itemmimic` component—effectively turning it into a trap. It integrates with `chestfunctions` and `chest_openfunctions` to finalize chest setup on creation and load.

## Usage example
This script is not intended for direct instantiation. It is referenced and executed by the scenario system when a labyrinth chest entity is created or loaded. The game engine calls `OnCreate(inst, scenariorunner)` for chest entities in the Labyrinth level.

```lua
-- Internal usage by game engine during chest spawn
local chest_prefab = "labyrinth_chest"
local inst = Prefab("labyrinth_chest")
inst.OnCreate = function(inst, scenariorunner)
    require("scenarios/chest_labyrinth_mimic").OnCreate(inst, scenariorunner)
end
```

## Dependencies & tags
**Components used:** `armor`, `finiteuses`, `itemmimic`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Generates a randomized loot table for the chest instance, populating it with items and optionally adding the `itemmimic` component to eligible items based on `MIMIC_CHANCE`.
*   **Parameters:**  
    - `inst` (Entity) — the chest entity being created.  
    - `scenariorunner` (ScenarioRunner) — the scenario runner instance managing world generation state.  
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `OnLoad(inst, scenariorunner)`
*   **Description:** Initializes trap mechanics for the chest by registering the appropriate open function (selected randomly from `chest_openfunctions`) and applying trap logic via `InitializeChestTrap`.
*   **Parameters:**  
    - `inst` (Entity) — the chest entity being loaded.  
    - `scenariorunner` (ScenarioRunner) — the scenario runner instance.  
*   **Returns:** Nothing.

### `OnDestroy(inst)`
*   **Description:** Performs cleanup when the chest entity is destroyed (e.g., removing references, cleanup hooks).
*   **Parameters:**  
    - `inst` (Entity) — the chest entity being destroyed.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.