---
id: chest_bees
title: Chest Bees
description: Manages the initialization and behavior of a beehive trap chest that spawns bees when opened and regulates bee spawning based on time of day and season.
tags: [trap, bee, chest, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: d66fffe0
system_scope: environment
---

# Chest Bees

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario script configures a chest prefab to function as a beehive trap. It initializes a `childspawner` component to manage bee spawning, sets spawner parameters using tuning values, and starts/stops spawning based on the world’s time of day and season (specifically disabling spawning during winter nights). When the chest is opened, it drops predefined honey-related loot and releases all stored bees before removing the `childspawner` component.

The script relies on `chestfunctions.lua` for trap initialization and chest-specific lifecycle management, and on `childspawner.lua` for creature-spawning mechanics.

## Usage example
This file is not intended for manual use. It is automatically applied as a scenario loader to relevant chest prefabs during world generation. It exports `OnLoad` and `OnDestroy` callbacks that the engine invokes when the chest entity is spawned or destroyed.

## Dependencies & tags
**Components used:** `childspawner`, `chesttrap` (via `chestfunctions`), `health` (indirectly in `childspawner`), `inventory` (indirectly via `AddChestItems`)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `triggertrap(inst, scenariorunner)`
* **Description:** Activates the trap: populates the chest with predefined honey-based loot and releases all bees from the spawner. Removes the `childspawner` component afterward.
* **Parameters:** 
  - `inst` (Entity) — The chest entity instance.
  - `scenariorunner` (ScenarioRunner) — The scenario runner context (unused in this function but included for interface compatibility).
* **Returns:** Nothing.
* **Error states:** If `inst.components.childspawner` is `nil`, the bee-release step is skipped.

### `OnIsDay(inst, isday)`
* **Description:** Adjusts bee spawning based on whether it is daytime and not winter.
* **Parameters:** 
  - `inst` (Entity) — The chest entity instance.
  - `isday` (boolean) — Whether the current time is day.
* **Returns:** Nothing.
* **Error states:** If `inst.components.childspawner` is `nil`, the function exits without action.

### `OnLoad(inst, scenariorunner)`
* **Description:** Initializes the trap chest: adds and configures the `childspawner`, sets regen/spawn periods and max children using tuning values, starts spawning if conditions permit (not winter), and registers a listener for day/night changes. Also calls `chestfunctions.InitializeChestTrap` to register the trap trigger function.
* **Parameters:** 
  - `inst` (Entity) — The chest entity instance.
  - `scenariorunner` (ScenarioRunner) — The scenario runner context.
* **Returns:** Nothing.

### `OnDestroy(inst)`
* **Description:** Delegates cleanup to `chestfunctions.OnDestroy`.
* **Parameters:** 
  - `inst` (Entity) — The chest entity instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `isday` — observed via `inst:WatchWorldState("isday", OnIsDay)`, fires when the world’s day/night cycle updates.
- **Pushes:** None.