---
id: chest_presummer
title: Chest Presummer
description: Configures predefined loot items for a summer-themed chest during the Presummer event.
tags: [event, loot, chest]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 89eee327
system_scope: inventory
---

# Chest Presummer

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_presummer` is a scenario script responsible for defining and populating loot contents for a specific chest used during the Presummer event. It does not define a component itself but rather exports a `OnCreate` callback function that is invoked when the associated chest entity is created. The loot configuration is declarative and uses `chestfunctions.AddChestItems` to apply the items to the chest instance.

## Usage example
This script is not intended for direct usage by modders. It is automatically loaded and executed by the DST scenario system when a Presummer event chest is instantiated. A modder would reference it indirectly via scenario configuration:
```lua
-- Pseudo-example: How the scenario system might use this script
local chest_presummer = require("scenarios/chest_presummer")
chest_presummer.OnCreate(chest_instance, scenario_runner_instance)
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X`; relies on `chestfunctions.AddChestItems` (from `scenarios/chestfunctions.lua`) to modify the chest.
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Populates the given chest entity with a predefined set of summer-themed items (`log`, `winterhat`, `flint`) using the shared `chestfunctions.AddChestItems` helper. This function is called automatically when the chest is created in the context of the Presummer event.
*   **Parameters:**  
    - `inst` (GameEntity) – The chest entity being created.  
    - `scenariorunner` (ScenarioRunner) – The scenario runner instance managing the current event.
*   **Returns:** Nothing.

## Events & listeners
None.