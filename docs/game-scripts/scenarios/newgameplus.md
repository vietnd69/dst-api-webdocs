---
id: newgameplus
title: Newgameplus
description: Applies special world initialization logic for New Game+ mode by randomizing spider den stages.
tags: [world, spider, progression]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 613e74f6
system_scope: world
---

# Newgameplus

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`newgameplus` is a scenario-level initialization module that modifies the game world upon creation when New Game+ mode is active. Its sole responsibility is to iteratively inspect all spider den entities in the world and probabilistically upgrade their growth stage (using the `growable` component) to make them more dangerous. This increases gameplay difficulty by ensuring many spider dens spawn with higher-stage spawns (stage 3) instead of the default.

## Usage example
```lua
-- This module is invoked internally by the game at world creation when New Game+ is enabled.
-- Modders do not typically call this directly.
local newgameplus = require("scenarios/newgameplus")
newgameplus.OnCreate(my_world_entity, my_scenario_runner)
```

## Dependencies & tags
**Components used:** `growable` — accessed via `v.components.growable:SetStage(...)`.
**Tags:** Checks `spiderden` on entities; uses `growable` component conditionally.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Called during world generation to apply New Game+ rules. Iterates over all entities in `Ents`, locates those with the `spiderden` tag and a `growable` component, then sets their growth stage to 3 with 25% probability or 2 otherwise.
*   **Parameters:**
    * `inst` (Entity) — The world entity being created.
    * `scenariorunner` (Entity) — The scenario runner entity managing game progression.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; silently skips entities missing the `growable` component or tag.

## Events & listeners
None.