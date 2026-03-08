---
id: chest_tools
title: Chest Tools
description: Provides a setup function to populate a chest with a predefined set of tools and blueprints when the chest is created.
tags: [chest, tools, blueprint, setup]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: d7e3b502
system_scope: entity
---

# Chest Tools

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This script defines a scenario setup handler for chests that should be pre-filled with a standard starter set of tools and blueprints. It is not a component itself, but rather a module exporting a standalone `OnCreate` function that is invoked during chest instantiation. The function leverages `chestfunctions.AddChestItems` to add specific items to the chest’s contents.

## Usage example
```lua
-- Inside a chest prefab's script or a room's static layout setup:
local chest_tools = require("scenarios/chest_tools")

local inst = CreateEntity()
-- ... configure entity ...
chest_tools.OnCreate(inst)
```

## Dependencies & tags
**Components used:** `chestfunctions` (via `chestfunctions.AddChestItems`)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Populates the given chest entity (`inst`) with a predefined list of tools and blueprint items. It is called automatically when the chest is created in a context where this scenario handler applies.
*   **Parameters:**  
    - `inst` (TheEntity) – The chest entity to populate.  
    - `scenariorunner` (any) – Unused parameter, present for interface compatibility.
*   **Returns:** Nothing.
*   **Error states:** None documented.

## Events & listeners
Not applicable.