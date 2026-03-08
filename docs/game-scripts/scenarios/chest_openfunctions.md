---
id: chest_openfunctions
title: Chest Openfunctions
description: Provides callback functions that apply random player-affecting effects when a chest is opened in a scenario.
tags: [scenario, inventory, fx, loot]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 383afd1d
system_scope: scenario
---

# Chest Openfunctions

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_openfunctions` defines a set of standalone functions used as scenario callbacks when a chest is opened. Each function randomly modifies the player's (`data.doer` or `data.worker`) stats or inventory upon interaction — such as adjusting sanity, hunger, health, item durability, or spawning monsters. It serves as a utility module for scenario-based events and does not implement a component itself.

## Usage example
```lua
local chest_openfunctions = require "scenarios/chest_openfunctions"

-- Example: Apply a random effect when a chest opens
chest_openfunctions.sanity(inst, scenariorunner, { doer = player })
chest_openfunctions.health(inst, scenariorunner, { worker = player })
chest_openfunctions.summonmonsters(inst, scenariorunner, {})
```

## Dependencies & tags
**Components used:** `sanity`, `hunger`, `health`, `inventory`, `finiteuses`, `perishable`, `armor`, `fueled`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `sanitydelta(inst, scenariorunner, data)`
* **Description:** Applies a random sanity change to the doer/worker (between -20 and +20).  
* **Parameters:**  
  - `inst`: The chest entity triggering the effect (unused internally).  
  - `scenariorunner`: The scenario runner instance (unused internally).  
  - `data`: Table containing `doer` or `worker` entity.  
* **Returns:** Nothing.  
* **Error states:** Returns early if `data.doer` and `data.worker` are both `nil`.

### `hungerdelta(inst, scenariorunner, data)`
* **Description:** Applies a random hunger change to the doer/worker (between -20 and +20).  
* **Parameters:** Same as `sanitydelta`.  
* **Returns:** Nothing.  
* **Error states:** Returns early if no valid target is found.

### `healthdelta(inst, scenariorunner, data)`
* **Description:** Applies a random health gain to the doer/worker (0 to +20).  
* **Parameters:** Same as `sanitydelta`.  
* **Returns:** Nothing.  
* **Error states:** Returns early if no valid target is found.

### `inventorydelta(inst, scenariorunner, data)`
* **Description:** Randomly adjusts the percentage (via `SetPercent`) of one item in the target's inventory:  
  - 25% chance: `finiteuses` (e.g., torch, lantern).  
  - 25% chance: `perishable` (e.g., meat, berries).  
  - 25% chance: `armor` (e.g., suit, helmet).  
  - 25% chance: `fueled` (e.g., campfire, firepit).  
  Uses `GetRandomWithVariance` with ±0.2 variance and clamps result to `1.0` for max.  
* **Parameters:** Same as above.  
* **Returns:** Nothing.  
* **Error states:** Returns early if no target inventory or matching item found.

### `summonmonsters(inst, scenariorunner, data)`
* **Description:** Spawns up to 3 `spider_dropper` entities in a circular ring around the chest using a 12-point angular distribution on land tiles. Each spawned monster transitions to the `"dropper_enter"` state.  
* **Parameters:** Same as above.  
* **Returns:** Nothing.  
* **Notes:** Uses `TheWorld.Map` and `TileGroupManager:IsLandTile` to validate spawn positions.

## Events & listeners
None.