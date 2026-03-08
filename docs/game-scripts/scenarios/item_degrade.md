---
id: item_degrade
title: Item Degrade
description: Reduces the initial fuel level of fueled entities to a random percentage (40%–60%) of their maximum fuel upon creation.
tags: [inventory, fuel, lifecycle]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: f440976a
system_scope: inventory
---

# Item Degrade

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`item_degrade.lua` is a scenario hook script that modifies the initial state of fueled entities when they are created in the game world. Specifically, it reduces an entity's starting fuel to a random value between `0.4 * maxfuel` and `0.6 * maxfuel`, effectively simulating partial degradation of stored fuel. It only operates on entities that possess the `fueled` component and relies on its `maxfuel` property and `InitializeFuelLevel` method.

This script is typically invoked during world or scenario initialization to create items with visibly or functionally degraded fuel reserves (e.g., worn-out lanterns or torches), adding realism or thematic consistency in specific gameplay scenarios.

## Usage example
This script is not meant to be used directly by modders. Instead, it is registered as part of a scenario's lifecycle hooks and automatically called by the scenario runner during entity instantiation.

However, an equivalent behavior can be implemented in a mod prefab as follows:
```lua
inst:DoTaskInTime(0, function()
    if inst.components.fueled then
        local maxfuel = inst.components.fueled.maxfuel
        inst.components.fueled:InitializeFuelLevel(math.random(maxfuel * 0.4, maxfuel * 0.6))
    end
end)
```

## Dependencies & tags
**Components used:** `fueled` — accessed via `inst.components.fueled` to read `maxfuel` and call `InitializeFuelLevel`.
**Tags:** None identified.

## Properties
No public properties — this script exposes only lifecycle callbacks.

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Called when the entity is first created in the world. Reduces the fuel level to a random fraction of its maximum (between 40% and 60%) if the entity has the `fueled` component.
* **Parameters:**  
  - `inst` (Entity instance) — the entity being created.  
  - `scenariorunner` (Scenario runner instance) — the scenario manager triggering this callback (not used directly).  
* **Returns:** Nothing.

### `OnLoad(inst, scenariorunner)`
* **Description:** Placeholder hook for logic that should run every time the game loads (e.g., loading from save). Currently unused.
* **Parameters:** Same as `OnCreate`.
* **Returns:** Nothing.

### `OnDestroy(inst)`
* **Description:** Placeholder hook for cleanup logic when the entity is destroyed. Currently unused.
* **Parameters:** Same as `OnCreate`.
* **Returns:** Nothing.

## Events & listeners
None.