---
id: packloot_nightmare
title: Packloot Nightmare
description: Assigns loot items to a chest entity when it is created, selecting from a fixed base set and one of two randomized chance-based sets.
tags: [loot, chest, scenario, random]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 07087f75
system_scope: inventory
---

# Packloot Nightmare

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`packloot_nightmare` is a scenario script that defines the loot distribution for a chest when it is instantiated. It uses `chestfunctions.AddChestItems` to populate the chest with a fixed base set of items (`cutgrass`, `log`, and `minerhat_blueprint`) and appends one randomly selected set from a list of two chance-based loot sets (`gunpowder`/`firestaff` bundle or `fishingrod_blueprint`). This file is designed to be invoked during chest creation in the context of a specific game scenario, likely tied to Nightmare-themed events or biomes.

## Usage example
```lua
-- Typically invoked by the scenario system during chest creation:
-- inst is the chest entity, scenariorunner is the scenario controller.

local packloot_nightmare = require("scenarios/packloot_nightmare")
packloot_nightmare.OnCreate(inst, scenariorunner)
```

## Dependencies & tags
**Components used:** `chestfunctions` (via `require("scenarios/chestfunctions")`)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Populates the given chest entity (`inst`) with predefined loot. It always adds a base set of grass, logs, and a miner hat blueprint, then appends one of two randomized loot sets (each containing either gunpowder/firestaff or a fishing rod blueprint).
*   **Parameters:**  
  `inst` (Entity) — the chest entity to populate with loot.  
  `scenariorunner` (Entity or `nil`) — the scenario controller instance (currently unused in the function body).
*   **Returns:** Nothing.
*   **Error states:** Relies on `math.random` and `chestfunctions.AddChestItems`; failures would arise only if the chest is invalid or `chestfunctions` is missing.

## Events & listeners
None.