---
id: icebox_summer
title: Icebox Summer
description: Handles seasonal trap logic and loot setup for a special ice-themed chest that triggers summer season upon opening.
tags: [season, chest, trap]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 7c98a33c
system_scope: world
---

# Icebox Summer

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario script manages a specialized chest (likely in the Icebox variant of the Summer event) that dispenses seasonal loot and triggers a transition to summer when opened. It does not define a component in the traditional ECS sense but provides lifecycle hooks (`OnCreate`, `OnLoad`, `OnDestroy`) used by the scenario system. It depends on `chestfunctions.lua` for chest behavior and loot initialization.

## Usage example
This script is applied implicitly by the scenario system during world initialization and is not manually instantiated. It is invoked via scenario callbacks, e.g.:
```lua
-- Scenario framework usage (not direct modder code)
local IceboxSummer = require("scenarios/icebox_summer")
-- Called automatically:
IceboxSummer.OnCreate(inst, scenariorunner)
```

## Dependencies & tags
**Components used:** `SoundEmitter` (via `inst.SoundEmitter`), and external functions from `scenarios/chestfunctions` (`AddChestItems`, `InitializeChestTrap`, `OnDestroy`).  
**Tags:** None identified.

## Properties
No public properties. Configuration is embedded in the local `loot` table and function closures.

## Main functions
### `triggertrap(inst, scenariorunner)`
*   **Description:** Plays a dragonfly sound effect and advances the world season to summer twice (effectively setting and advancing to full summer). Called when the chest trap is triggered (i.e., opened).
*   **Parameters:** 
    - `inst` (entity) - the chest entity instance.
    - `scenariorunner` (scenario runner) - the scenario context.
*   **Returns:** Nothing.
*   **Error states:** No known failure conditions.

### `OnCreate(inst, scenariorunner)`
*   **Description:** Initializes chest loot by calling `chestfunctions.AddChestItems` with predefined items (`ice`, `petals`, `watermelon`) and their respective drop chances.
*   **Parameters:** 
    - `inst` (entity) - the chest entity instance.
    - `scenariorunner` (scenario runner) - the scenario context.
*   **Returns:** Nothing.

### `OnLoad(inst, scenariorunner)`
*   **Description:** Attaches trap functionality to the chest via `InitializeChestTrap`, configuring it to invoke `triggertrap` upon opening.
*   **Parameters:** 
    - `inst` (entity) - the chest entity instance.
    - `scenariorunner` (scenario runner) - the scenario context.
*   **Returns:** Nothing.

### `OnDestroy(inst)`
*   **Description:** Performs cleanup when the chest is destroyed, delegating to `chestfunctions.OnDestroy`.
*   **Parameters:** 
    - `inst` (entity) - the chest entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `"ms_setseason"` (with `"summer"` as argument), `"ms_advanceseason"` (twice) — via `TheWorld:PushEvent`, triggered in `triggertrap`.
