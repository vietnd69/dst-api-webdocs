---
id: trunk
title: Trunk
description: Creates the raw trunk item (summer, winter, cooked variants) for Koalephant, a meat-based food item with perishable and tradable properties.
tags: [inventory, food, perishable, cooking]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 51b3c733
system_scope: inventory
---

# Trunk

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`trunk.lua` defines the prefab factory functions for the three variants of the trunk item: `trunk_summer`, `trunk_winter`, and `trunk_cooked`. It uses a shared `create_common()` function to establish core inventory properties, and then configures variant-specific stats for raw (season-based) and cooked forms. Raw trunks are perishable and cookable; cooked trunks are non-cookable, have improved food stats, and spoil slower. The prefab relies on standard components for inventory management, tradability, edibility, perishability, and cooking.

## Usage example
```lua
-- Create a raw summer trunk (raw, cookable, perishable)
local trunk = CreatePrefab("trunk_summer")

-- Create a cooked trunk (non-cookable, non-perishable at fast rate)
local cooked_trunk = CreatePrefab("trunk_cooked")

-- Access edible stats
local health = trunk.components.edible.healthvalue
local hunger = trunk.components.edible.hungervalue

-- Trigger perish manually (e.g., for custom logic)
trunk.components.perishable:StartPerishing()
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `tradable`, `edible`, `cookable`, `perishable`, `transform`, `animstate`, `network`, `physics`, `floatable`

**Tags:** Adds `cookable` to raw (pristine) variants only.

## Properties
No public properties are defined directly in this file. Properties are configured via component APIs on `inst.components.*`.

## Main functions
### `create_common(anim, cookable)`
*   **Description:** Internal factory function that creates the base entity instance for all trunk variants. Configures common visual, network, and core component behavior, including stackability, tradability, edibility, and perishability.
*   **Parameters:**  
    `anim` (string) – Animation bank state name (e.g., `"idle_summer"`, `"cooked"`).  
    `cookable` (boolean) – If `true`, adds the `cookable` tag and `cookable` component; otherwise, omits cooking support.
*   **Returns:** `inst` (Entity) – The initialized entity instance.

### `create_summer()`
*   **Description:** Factory function that returns a raw summer trunk (raw, perishable, cookable). Applies夏季-specific values for health, hunger, gold, and perish time.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) – Fully configured trunk_summer prefab instance.

### `create_winter()`
*   **Description:** Factory function that returns a raw winter trunk (raw, perishable, cookable). Applies冬季-specific values identical to summer in stats.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) – Fully configured trunk_winter prefab instance.

### `create_cooked()`
*   **Description:** Factory function that returns a cooked trunk. Non-cookable, with higher food stats and slower perish rate.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) – Fully configured trunk_cooked prefab instance.

## Events & listeners
None identified — no custom event listeners or pushes are defined in this file. Perish-related events are handled by the `perishable` component (e.g., `onperish`).