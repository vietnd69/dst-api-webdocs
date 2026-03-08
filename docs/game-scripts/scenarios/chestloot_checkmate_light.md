---
id: chestloot_checkmate_light
title: Chestloot Checkmate Light
description: Applies a predefined light loot table to a chest entity upon creation.
tags: [loot, chest, scenario]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 03f17e76
system_scope: inventory
---

# Chestloot Checkmate Light

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario script defines a one-time initialization function (`OnCreate`) that populates a chest with a fixed, lightweight loot set when the chest is created. It relies on the shared utility function `chestfunctions.AddChestItems` to apply the loot and is intended for use in specific map generation scenarios—most likely the "Checkmate Light" variant of a world preset.

## Usage example
This script is not added as a component; it is invoked directly by the scenario system during chest instantiation.

```lua
-- Internally called as:
inst:ListenForEvent("oncreate", function(inst) OnCreate(inst, scenariorunner) end)
-- where scenariorunner is passed by the scenario system.
```

## Dependencies & tags
**Components used:** None directly—uses `chestfunctions.AddChestItems(inst, loot)` to delegate loot population.  
**Tags:** None identified.

## Properties
No public properties. This script exports only a single function and contains no persistent state.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Constructs and applies a predefined light loot table to the given chest entity. The loot consists of one Straw Hat, 2–4 Fireflies, and 4–5 Twigs.  
*   **Parameters:**  
    - `inst` (entity) — The chest entity being created.  
    - `scenariorunner` (any) — The scenario runner context (not used in this function but required by signature).  
*   **Returns:** Nothing.  
*   **Error states:** None documented—assumes `inst` is a valid entity with the `loot` component (handled by `AddChestItems`).

## Events & listeners
None. This script does not register event listeners; it is invoked synchronously during chest setup.