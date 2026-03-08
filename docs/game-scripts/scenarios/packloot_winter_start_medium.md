---
id: packloot_winter_start_medium
title: Packloot Winter Start Medium
description: Defines the loot pool and chest initialization logic for medium-difficulty winter-start scenarios by selecting a randomized chance-based loot set.
tags: [loot, chest, scenario]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: bfcc45c7
system_scope: world
---

# Packloot Winter Start Medium

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`packloot_winter_start_medium` is a scenario initializer that populates a chest entity with a predefined loot table. It defines two sets of items: a base `loot` array with fixed contents and variable counts, and a `chanceloot` array containing eight distinct loot sets, one of which is randomly selected and added at runtime. This script is used to configure starting loot for winter scenarios with medium difficulty and is invoked via its exported `OnCreate` function when a chest is created.

The component relies exclusively on `chestfunctions.AddChestItems`, meaning it does not manage components or tags directly.

## Usage example
```lua
local chest = CreateEntity()
chest:AddTag("loot")
chest:AddTag("chest")
chest:AddTag("loot_lootable")
chest:AddComponent("loot")
chest:AddComponent("inventory")
chest:AddComponent("lootdrop")

-- Later, during scenario initialization:
local packloot_winter_start_medium = require("scenarios/packloot_winter_start_medium")
packloot_winter_start_medium.OnCreate(chest, scenario_runner_instance)
```

## Dependencies & tags
**Components used:** None directly. Uses `chestfunctions.AddChestItems`, which internally expects the target `inst` to have `loot`, `inventory`, and `lootdrop` components.  
**Tags:** None added or checked. Assumes caller has already added appropriate tags (`loot`, `chest`, `loot_lootable`, etc.).

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Initializes the chest's loot contents for a medium-difficulty winter start scenario. Selects and applies a base loot set and one randomly chosen chance-based loot set from eight predefined options.
* **Parameters:**  
  - `inst` (entity instance) – The chest entity to populate with loot. Must have `loot` and `inventory` components.  
  - `scenariorunner` (ScenarioRunner instance) – The scenario runner instance; currently unused in this implementation.
* **Returns:** Nothing.
* **Error states:** None documented; failure may occur if `inst` lacks required components (`loot`, `inventory`, `lootdrop`), though this is handled by `chestfunctions.AddChestItems`.

## Events & listeners
None.