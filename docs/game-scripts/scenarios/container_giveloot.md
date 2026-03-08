---
id: container_giveloot
title: Container Giveloot
description: Provides a predefined set of loot items to a chest entity upon its creation in a scenario.
tags: [loot, chest, scenario]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 89b70976
system_scope: inventory
---

# Container Giveloot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`container_giveloot` is a scenario helper module that populates a chest entity with a fixed, randomized set of beginner-tier resources (grass, logs, and rocks) when the chest is created. It delegates the actual item insertion logic to the `chestfunctions.AddChestItems` helper, ensuring consistency with how loot is distributed across scenarios in DST. This module is intended for use in worldgen or scenario initialization scripts where chest setup occurs.

## Usage example
```lua
local container_giveloot = require("scenarios/container_giveloot")

-- Typically called during chest prefab initialization in a scenario or room generator
local function OnCreate(inst, scenariorunner)
    container_giveloot.OnCreate(inst, scenariorunner)
end

-- Attach to a chest entity's "oncreate" handler:
-- inst:DoTaskInTime(0, function() OnCreate(inst, scenario_runner) end)
```

## Dependencies & tags
**Components used:** None directly accessed (relies on `chestfunctions.AddChestItems`).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Initializes and adds a predefined set of loot items to the chest entity (`inst`). The loot consists of `cutgrass`, `log`, and `rocks`, each with randomized counts within fixed ranges.
*   **Parameters:**  
    * `inst` (entity) – The chest entity to populate.  
    * `scenariorunner` (scenario runner instance) – The scenario context (currently unused but retained for API consistency).
*   **Returns:** Nothing.
*   **Error states:** May fail silently if `inst` lacks the required `inventoryitem` or `container` components (handled internally by `chestfunctions.AddChestItems`).

## Events & listeners
None identified.