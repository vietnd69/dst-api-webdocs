---
id: chest_ghosts
title: Chest Ghosts
description: A scenario script that modifies chest behavior to spawn ghosts and drain sanity when opened.
tags: [scenario, trap, sanity, ghost]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: cd2c4d87
system_scope: world
---

# Chest Ghosts

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_ghosts` is a scenario script that customizes chest behavior by attaching a trap. When the chest is opened, it spawns 12 ghosts in a circular formation around the player, attempts to position them on passable terrain, sets them to target the player, and triggers a large sanity drain for the player. It also forces precipitation in the world. This script extends `chestfunctions.lua` to add scenario-specific trap logic without altering core chest mechanics.

## Usage example
This script is not designed for direct manual instantiation. It is applied as part of a scenario's chest setup via `scenariorunner` hooks. A typical integration in a scenario definition would look like:
```lua
local chest_ghosts = require("scenarios/chest_ghosts")
-- ...
OnCreate = chest_ghosts.OnCreate,
OnLoad = chest_ghosts.OnLoad,
OnDestroy = chest_ghosts.OnDestroy,
```

## Dependencies & tags
**Components used:** `sanity`, `brain`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Initializes the chest with predefined loot items. Called when the chest entity is first created.
*   **Parameters:**  
    `inst` (Entity) - The chest entity instance.  
    `scenariorunner` (ScenarioRunner) - The scenario runner managing world state.
*   **Returns:** Nothing.
*   **Error states:** Relies on `chestfunctions.AddChestItems` to validate loot structure and entity state.

### `OnLoad(inst, scenariorunner)`
*   **Description:** Attaches the trap function (`triggertrap`) to the chest's open event. Called when the chest is loaded from save data.
*   **Parameters:**  
    `inst` (Entity) - The chest entity instance.  
    `scenariorunner` (ScenarioRunner) - The scenario runner managing world state.
*   **Returns:** Nothing.
*   **Error states:** Relies on `chestfunctions.InitializeChestTrap` to register the callback.

### `OnDestroy(inst)`
*   **Description:** Performs cleanup when the chest is destroyed.
*   **Parameters:**  
    `inst` (Entity) - The chest entity instance.
*   **Returns:** Nothing.
*   **Error states:** Relies on `chestfunctions.OnDestroy` to handle cleanup logic.

### `triggertrap(inst, scenariorunner, data)`
*   **Description:** The core trap logic executed when the chest is opened. Spawns ghosts in a ring around the player, sets them to follow the player, reduces player sanity by `TUNING.SANITY_HUGE`, and forces rain/snow.
*   **Parameters:**  
    `inst` (Entity) - The chest entity that was opened.  
    `scenariorunner` (ScenarioRunner) - The scenario runner instance (unused in this implementation).  
    `data` (table) - Event payload containing at least `player` (Entity).
*   **Returns:** Nothing.
*   **Error states:**  
    - Skips ghost spawn if `map:IsPassableAtPoint` returns `false` for a candidate position.  
    - Sanity delta is applied only if `player` and `player.components.sanity` are non-nil.  
    - World precipitation is forced regardless of weather state via `TheWorld:PushEvent("ms_forceprecipitation", true)`.

### `settarget(inst, player)`
*   **Description:** Helper function used to assign the opened chest's spawned ghost's brain follow target.
*   **Parameters:**  
    `inst` (Entity) - The ghost entity instance.  
    `player` (Entity) - The player entity to follow.
*   **Returns:** Nothing.
*   **Error states:** Only sets `brain.followtarget` if `inst` and `inst.brain` exist.

## Events & listeners
- **Pushes:** `ms_forceprecipitation` — forces precipitation (rain/snow) in the world via `TheWorld:PushEvent`.
- **Listens to:** None identified (no `inst:ListenForEvent` calls occur in this script; event participation is via scenario hooks).