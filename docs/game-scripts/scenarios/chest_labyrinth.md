---
id: chest_labyrinth
title: Chest Labyrinth
description: Defines lifecycle callbacks for labyrinth-themed chests that generate randomized loot and associate random trap behaviors upon opening.
tags: [loot, trap, chest]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 1aed7887
system_scope: entity
---

# Chest Labyrinth

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario script (`chest_labyrinth.lua`) implements logic specific to labyrinth-themed chests. It defines three primary callbacks—`OnCreate`, `OnLoad`, and `OnDestroy`—that configure chest contents with weighted, randomized item generation and attach a randomly selected trap behavior when the chest is loaded or opened. It relies on shared utility functions from `chestfunctions` and `chest_openfunctions` to handle loot population and trap assignment.

## Usage example
This script is not instantiated directly by modders; it is imported and used internally by the game’s scenario system when a labyrinth chest is created. A modder would typically interact with the resulting chest entity, which now carries randomly generated loot and a trap component:

```lua
-- Inside a chest prefab definition, the scenario is applied like:
local SCENARIO = require("scenarios/chest_labyrinth")
inst:AddComponent("scenarioreceiver")
inst.components.scenarioreceiver:SetScenario(SCENARIO)
```

## Dependencies & tags
**Components used:** `armor`, `finiteuses` (via item initialization functions).
**Tags:** None identified.

## Properties
No public properties are defined in this script. It only exports functional callbacks.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Initializes loot contents for the chest. Selects a random subset of items based on weighted probabilities and optionally randomizes condition (for armor) or uses (for finite-use items) via optional `initfn` callbacks.
*   **Parameters:**
    *   `inst` (Entity) — The chest entity instance.
    *   `scenariorunner` (ScenarioRunner) — The scenario runner managing the chest.
*   **Returns:** Nothing.
*   **Error states:** Fails silently if `inst` lacks the expected components for `armor` or `finiteuses` on generated items.

### `OnLoad(inst, scenariorunner)`
*   **Description:** Associates a random trap behavior with the chest by selecting one from `chest_openfunctions` and passing it to `InitializeChestTrap`. This configures the chest to trigger the selected trap when opened.
*   **Parameters:**
    *   `inst` (Entity) — The chest entity instance.
    *   `scenariorunner` (ScenarioRunner) — The scenario runner managing the chest.
*   **Returns:** Nothing.
*   **Error states:** May fail if `chest_openfunctions` is empty or if `InitializeChestTrap` encounters an invalid trap definition.

### `OnDestroy(inst)`
*   **Description:** Delegates cleanup logic to `chestfunctions.OnDestroy`, ensuring any post-destruction tasks (e.g., cleanup of temporary effects) are performed.
*   **Parameters:**
    *   `inst` (Entity) — The chest entity instance being destroyed.
*   **Returns:** Nothing.

## Events & listeners
Not applicable.