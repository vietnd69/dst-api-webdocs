---
id: chest_summer
title: Chest Summer
description: Provides loot rewards and triggers seasonal changes when a summer-themed chest is opened in the game.
tags: [loot, seasons, trap]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 7a255b69
system_scope: world
---

# Chest Summer

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario file defines behavior for a summer-themed chest entity. When created, it populates the chest with seasonal loot. When loaded, it sets up a trap function that triggers a sound effect and advances the world season to summer (twice, for full seasonal transition). It also registers a destroy handler to clean up the entity. All functionality is delegated to reusable helpers in `chestfunctions.lua`.

## Usage example
This file is not instantiated directly by modders. Instead, it is referenced as a scenario callback by the game when creating or loading the associated chest entity (e.g., via worldgen or prefab definition). Modders should not call its functions directly.

## Dependencies & tags
**Components used:** None (uses `TheWorld` and `chestfunctions` module).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `triggertrap(inst, scenariorunner)`
* **Description:** Called when the chest trap is triggered (typically on interaction). Plays a dragonfly sound and advances the season to summer twice (to reach high summer).
* **Parameters:**  
  `inst` (Entity) — the chest entity instance.  
  `scenariorunner` — scenario runner context (unused directly by this function).
* **Returns:** Nothing.
* **Error states:** May silently fail if sound or world events are unavailable.

### `OnCreate(inst, scenariorunner)`
* **Description:** Initializes loot contents on chest creation by calling `chestfunctions.AddChestItems` with predefined summer loot.
* **Parameters:**  
  `inst` (Entity) — the chest entity instance.  
  `scenariorunner` — scenario runner context.
* **Returns:** Nothing.

### `OnLoad(inst, scenariorunner)`
* **Description:** Configures the chest trap on load by calling `chestfunctions.InitializeChestTrap` with the `triggertrap` handler.
* **Parameters:**  
  `inst` (Entity) — the chest entity instance.  
  `scenariorunner` — scenario runner context.
* **Returns:** Nothing.

### `OnDestroy(inst)`
* **Description:** Cleans up the chest when destroyed by delegating to `chestfunctions.OnDestroy`.
* **Parameters:**  
  `inst` (Entity) — the chest entity instance.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `ms_setseason("summer")` — via `TheWorld:PushEvent`.
- **Pushes:** `ms_advanceseason` — twice via `TheWorld:PushEvent` during trap trigger.