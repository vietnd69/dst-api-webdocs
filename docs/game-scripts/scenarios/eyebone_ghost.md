---
id: eyebone_ghost
title: Eyebone Ghost
description: Manages the spawning of ghosts on nearby graves when an eyebone item is picked up during a scenario.
tags: [scenario, ghost, grave, event]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 8a2bdf32
system_scope: entity
---

# Eyebone Ghost

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `eyebone_ghost` scenario script provides logic for triggering ghost spawns when an "eyebone" item is picked up. It identifies nearby grave entities in the world, stores references to their mounds, and spawns ghost prefabs on those mounds upon pickup. This script is intended to be attached to an entity (likely the eyebone item) to enable scenario-specific behavior in Don't Starve Together.

It works in two phases:
1. **OnLoad**: Scans the area for graves, caches their mound entities, and registers a callback for `onpickup`.
2. **OnDestroy**: Cleans up the registered event callback to prevent memory leaks or dangling references.

## Usage example
```lua
-- Typically used by the scenario runner as a callback hook, not manually added.
-- Example registration in a scenario setup:
inst:AddComponent("eyebone_ghost")
inst.components.eyebone_ghost.OnLoad(inst, scenariorunner)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties

## Main functions
### `OnLoad(inst, scenariorunner)`
* **Description:** Initializes the scenario logic. Scans the area for grave entities, stores references to their mounds, and sets up an event handler that spawns ghosts when the entity is picked up and clears the scenario.
* **Parameters:**
  * `inst` (Entity) — The entity instance this script is attached to.
  * `scenariorunner` (ScenarioRunner) — The scenario manager instance used to clear the scenario after execution.
* **Returns:** Nothing.
* **Error states:** None documented. Assumes `scenariorunner:ClearScenario()` and `SpawnPrefab("ghost")` behave correctly.

### `OnDestroy(inst)`
* **Description:** Cleans up the `onpickup` event listener registered in `OnLoad` to avoid memory leaks or stale callbacks when the entity is destroyed.
* **Parameters:**
  * `inst` (Entity) — The entity instance being destroyed.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onpickup` — Fired when the entity is picked up by a player or inventory; triggers ghost spawning.
- **Pushes:** None identified.