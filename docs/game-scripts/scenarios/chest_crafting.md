---
id: chest_crafting
title: Chest Crafting
description: Initializes a chest with a predefined set of craftable items during scenario creation.
tags: [crafting, chest, scenario]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 225228bf
system_scope: crafting
---

# Chest Crafting

> Based on game build **714004** | Last updated: 2026-03-08

## Overview
`chest_crafting` is a scenario utility script responsible for populating a chest entity with a fixed list of craftable resources upon its creation. It is invoked during world/entity initialization to ensure specific prefabs (typically associated with crafting scenarios) start with a predefined inventory. The script delegates the actual item insertion logic to `chestfunctions.AddChestItems()` and does not define a component — it is a procedural setup helper.

## Usage example
```lua
local chest = TheSim:FindFirstEntityWithTag("chest")
if chest ~= nil then
    require("scenarios/chest_crafting").OnCreate(chest, ScenarioRunner)
end
```

## Dependencies & tags
**Components used:** None (the function expects the target `inst` to be an entity with a `inventory` component or compatible container interface).
**Tags:** None identified.

## Properties
No public properties — this is a stateless script module.

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Initializes the given chest entity with a curated list of common crafting materials. Typically called during scenario setup when a new chest prefab is spawned in the world.
* **Parameters:**
  * `inst` (Entity) — The chest entity to populate.
  * `scenariorunner` (ScenarioRunner) — The scenario runner context (currently unused in this implementation).
* **Returns:** Nothing.
* **Error states:** Silent failure may occur if `inst` lacks the expected container interface (e.g., missing `inventory` component); no error is explicitly thrown.

## Events & listeners
None identified.