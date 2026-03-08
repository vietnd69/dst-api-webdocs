---
id: chest_terrarium
title: Chest Terrarium
description: Generates loot for a terrarium chest and initializes its trap system during chest creation and loading.
tags: [loot, trap, chest, scenarios]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: a0d2f201
system_scope: inventory
---

# Chest Terrarium

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_terrarium` is a scenario hook component that populates a terrarium chest with predefined loot items upon creation and initializes trap functionality upon loading. It leverages `chestfunctions` to handle the item spawning and trap setup logic, and does not constitute a reusable ECS component itself—it exists as a scenario-specific initializer.

## Usage example
This script is not added as a component to entities. Instead, it is used internally by the game's scenario system when a terrarium chest is created or loaded:
```lua
-- Internally invoked by scenario runner during chest setup
OnCreate(inst, scenariorunner)   -- Populates the chest with loot
OnLoad(inst, scenariorunner)     -- Initializes the chest trap
```

## Dependencies & tags
**Components used:** `chestfunctions`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Populates the target chest entity with a curated set of loot items using `chestfunctions.AddChestItems`. The loot includes the "terrarium" item, weapons, consumables, materials, and resources with randomized quantities and drop chances.
* **Parameters:** 
  - `inst` (entity) — The chest entity being created.
  - `scenariorunner` (unknown) — The scenario runner context; passed through to `chestfunctions`.
* **Returns:** Nothing.

### `OnLoad(inst, scenariorunner)`
* **Description:** Initializes the chest trap system using `chestfunctions.InitializeChestTrap`. Passes a no-op callback and `0.0` as the trap delay, effectively deferring trap activation logic (e.g., visual FX or delay-based triggers) to external systems like `terrariumchest_fx`.
* **Parameters:** 
  - `inst` (entity) — The chest entity being loaded.
  - `scenariorunner` (unknown) — The scenario runner context.
* **Returns:** Nothing.

## Events & listeners
None identified.