---
id: archive_cookpot
title: Archive Cookpot
description: Configures the loot table for the archive cookpot chest by defining and adding default items upon chest creation.
tags: [loot, chest, crafting, server, world]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: d0b02932
system_scope: world
---

# Archive Cookpot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`archive_cookpot` is a scenario helper script that customizes the contents of the archive cookpot chest. It uses `chestfunctions` to inject a predefined set of items (`refined_dust`) into the chest’s loot table during entity creation. This script does not define a component itself, but serves as a configuration callback for chest prefabs (e.g., used in archivable or event-specific cookpots), ensuring consistent drop behavior.

## Usage example
```lua
-- Typically referenced in a prefab's OnCreate callback:
local archive_cookpot = require("scenarios/archive_cookpot")

local function OnCreate(inst)
    -- Perform other setup...
    archive_cookpot.OnCreate(inst, scenario_runner_instance)
end

return prefabutil.CreatePrefab("archive_cookpot", "archive_cookpot", ...)
```

## Dependencies & tags
**Components used:** `chestfunctions`, `chest_openfunctions`  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Adds default loot (`refined_dust` with 100% chance) to the provided chest entity using `chestfunctions.AddChestItems`. Called during chest instantiation.
* **Parameters:**  
  - `inst` (TheiaEntity) — The chest entity being created.  
  - `scenariorunner` (ScenarioRunner?) — The scenario runner context; unused in this implementation but required for signature compatibility.
* **Returns:** Nothing.

## Events & listeners
None.