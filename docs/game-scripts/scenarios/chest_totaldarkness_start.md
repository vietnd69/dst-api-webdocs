---
id: chest_totaldarkness_start
title: Chest Totaldarkness Start
description: Initializes a chest with a predefined set of starter items for the Total Darkness scenario.
tags: [scenario, chest, inventory, storage]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 88a7e792
system_scope: inventory
---

# Chest Totaldarkness Start

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This script defines the `OnCreate` callback used to populate a chest with specific starter items when a Total Darkness scenario begins. It is a scenario initialization hook—typically invoked by the scenario runner—rather than an ECS component. It relies on `chestfunctions.AddChestItems` to procedurally fill the chest with a curated list of basic crafting materials and tools.

## Usage example
```lua
-- This script is used internally by the scenario system and is not added directly as a component.
-- The scenario runner calls its `OnCreate` callback when creating the starting chest:
local inst = CreateEntity()
inst:AddTag("chest")
inst:AddComponent("inventory")
-- ... other setup ...
chest_totaldarkness_start.OnCreate(inst, scenariorunner)
```

## Dependencies & tags
**Components used:** `inventory` (via `chestfunctions.AddChestItems`, assumed to require the target entity to have this component)  
**Tags:** None directly managed; assumes the target entity has the `chest` tag and `inventory` component.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Initializes the chest (`inst`) with a predefined set of items for Total Darkness starting gear. It is called once during chest creation as part of scenario initialization.
*   **Parameters:**  
    - `inst` (entity) — The chest entity to populate. Must have the `chest` tag and `inventory` component.  
    - `scenariorunner` (unknown) — The scenario runner instance; currently unused in this implementation.
*   **Returns:** Nothing.
*   **Error states:** Will fail if `inst` lacks the `inventory` component or if `chestfunctions.AddChestItems` encounters invalid item prefabs (e.g., missing prefabs).

## Events & listeners
None.