---
id: chestloot_checkmate_magic
title: Chestloot Checkmate Magic
description: Generates randomized loot for a magic-themed treasure chest in the Checkmate scenario.
tags: [loot, chest, scenario]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 64b8b70a
system_scope: inventory
---

# Chestloot Checkmate Magic

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chestloot_checkmate_magic` is a scenario loot generator that prepares a predefined list of randomized items for placement in a treasure chest. It is invoked during chest creation (via `OnCreate`) and relies on the `chestfunctions` utility to populate the chest's contents. This script is part of the Checkmate scenario's world generation system and does not define a reusable component — it is a one-time loot configuration callback.

## Usage example
This script is not intended for direct manual use. It is automatically referenced by the scenario system during chest generation:

```lua
-- Internal usage by scenario loader (not user-facing)
local chestloot_checkmate_magic = require("scenarios/chestloot_checkmate_magic")
chestloot_checkmate_magic.OnCreate(chest_entity, scenario_runner)
```

## Dependencies & tags
**Components used:** `None` (uses `chestfunctions.AddChestItems` as a utility function)  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Populates the given chest entity (`inst`) with a fixed set of randomized items (`livinglog`, `nightmarefuel`, `redgem`, `bluegem`, `purplegem`), each with a random count between 5 and 10. Called during chest initialization in the Checkmate scenario.
*   **Parameters:**  
    `inst` (entity instance) – The chest entity to populate.  
    `scenariorunner` (scenario runner object) – The active scenario manager (not used in this implementation).  
*   **Returns:** Nothing.

## Events & listeners
Not applicable