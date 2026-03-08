---
id: chestloot_checkmate_rot
title: Chestloot Checkmate Rot
description: Applies a predefined rot-loot configuration to a chest entity upon creation.
tags: [loot, chest, scenario]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: ef234df7
system_scope: world
---

# Chestloot Checkmate Rot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chestloot_checkmate_rot` is a scenario helper module that defines and applies a specific loot configuration to chest entities. It specifies that chests should be populated with `spoiled_food` items in a random quantity between 80 and 300. This module is intended to be invoked during chest instantiation—typically via the `OnCreate` callback—as part of world or event generation logic.

## Usage example
This module is used internally by the game's scenario system and is not intended for direct manual instantiation. However, if needed, it can be integrated as follows:

```lua
local chestloot_checkmate_rot = require("scenarios/chestloot_checkmate_rot")
local chest = SpawnPrefab("chest")
chestloot_checkmate_rot.OnCreate(chest, nil)
```

Note: The second argument (`scenariorunner`) is unused in this implementation.

## Dependencies & tags
**Components used:** None directly (relies on `chestfunctions.AddChestItems`, which operates on the chest entity's loot component).  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Configures and populates the given chest with a predefined rot-based loot set (`spoiled_food` in quantities 80–300). This function is called automatically when the chest is created as part of a scenario generation step.
* **Parameters:**  
  - `inst` (Entity) – The chest entity to populate.  
  - `scenariorunner` (Entity or `nil`) – Optional; unused in current implementation.  
* **Returns:** Nothing.
* **Error states:** No explicit error handling; will fail silently if `inst` lacks a `loot` component or is not a valid chest entity.

## Events & listeners
None.