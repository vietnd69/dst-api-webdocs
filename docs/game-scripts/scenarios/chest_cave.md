---
id: chest_cave
title: Chest Cave
description: Provides initial inventory items for cave-entry chests in DST's cave biome.
tags: [cave, loot, chest]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: ce093358
system_scope: world
---

# Chest Cave

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_cave` is a scenario helper script that populates cave-entry chests with starting items. It is invoked during world generation or chest creation to ensure players find essential survival gear (tools, armor, food, and raw materials) upon first entering the caves. It relies on the `chestfunctions` module to handle the actual item insertion logic.

## Usage example
This script is not added as a component to entities. Instead, it is referenced by scenario/worldgen configurations and executed during chest initialization:
```lua
-- In a scenario or worldgen context, the OnCreate callback is passed to chest prefabs
local chest_cave = require("scenarios/chest_cave")
chest_cave.OnCreate(inst, scenariorunner)
```

## Dependencies & tags
**Components used:** `chestfunctions` — calls `chestfunctions.AddChestItems(inst, items)`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Initializes the chest with a predefined list of items suitable for early cave exploration. This function is called during chest creation (typically from a scenario or prefab definition).
* **Parameters:**
  * `inst` (Entity) — the chest entity instance to populate.
  * `scenariorunner` (any) — the scenario runner context (unused in current implementation but required for interface compatibility).
* **Returns:** Nothing.

## Events & listeners
None.