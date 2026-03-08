---
id: chestloot_checkmate_refined
title: Chestloot Checkmate Refined
description: Defines a loot table and initializer function for spawning randomized chest contents in specific scenarios, utilizing shared chest utilities.
tags: [loot, scenario, chest]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 26d67d53
system_scope: inventory
---

# Chestloot Checkmate Refined

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario helper defines a static loot configuration (`OnCreate`) used to populate chest entities with randomized items. It relies on the `chestfunctions` module to apply the loot, specifically adding `boards`, `cutstone`, `rope`, and `goldnugget` with random counts per session. This is intended for use in scenario-specific chest setups where consistent, theme-appropriate loot with inherent randomness is desired.

## Usage example
```lua
local chestloot_checkmate_refined = require("scenarios/chestloot_checkmate_refined")

-- When creating a chest entity (e.g., inside a scenario or room generator)
chestloot_checkmate_refined.OnCreate(chest_entity, scenariorunner_entity)
```

## Dependencies & tags
**Components used:** `chestfunctions` — via `chestfunctions.AddChestItems(inst, loot)`.
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Initializes and applies a predefined loot table to the given `inst` entity (typically a chest). The loot contents are randomized at runtime using `math.random()` bounds.
*   **Parameters:**
    *   `inst` (entity) — The chest entity to populate with loot.
    *   `scenariorunner` (entity) — The scenario runner entity (unused in current implementation, but retained for API compatibility).
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling is defined; failure occurs silently if `chestfunctions.AddChestItems` is not available or if `inst` lacks required chest functionality.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
