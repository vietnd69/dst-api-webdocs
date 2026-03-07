---
id: oceanfishinglure
title: Oceanfishinglure
description: Generates ocean fishing lure prefabs with configurable appearance, data, and behavior for use in the Ocean Fishing subsystem.
tags: [ocean, fishing, inventory, entity]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1ca21b78
system_scope: inventory
---

# Oceanfishinglure

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`oceanfishinglure.lua` defines and registers multiple fishing lure prefabs used in DST’s Ocean Fishing subsystem. Each lure type is parameterized via the `LURES` table and instantiated as an inventory item with specific visual, behavioral, and network configuration. This file does not define a reusable component class; instead, it is a prefab factory that creates multiple entity instances with shared structure but differentiated data.

The prefabs are integrated with the `oceanfishingtackle` component to expose lure-specific configuration and are assigned the `inventoryitem`, `stackable`, and `inspectable` components for gameplay integration.

## Usage example
```lua
-- Example: spawn a red spoon lure in the world
local lure = Prefab("oceanfishinglure_spoon_red")
lure:PushEvent("spawn")
```

## Dependencies & tags
**Components used:** `oceanfishingtackle`, `inventoryitem`, `stackable`, `inspectable`, `weighable` (indirectly via helper function `heavy_charmfish`)
**Tags:** Adds `oceanfishing_lure`

## Properties
No public properties. The prefabs are instantiated via `item_fn`, and their configuration is encapsulated in the `data` parameter passed to that function (derived from `LURES`).

## Main functions
### `heavy_charmfish(fish)`
*   **Description:** A helper function used to compute a bonus modifier for the “heavy” lure. It returns `1` if the given fish’s weight percentage meets or exceeds `TUNING.WEIGHABLE_HEAVY_WEIGHT_PERCENT`, otherwise `0`.
*   **Parameters:** `fish` (optional entity) — an entity with a `weighable` component.
*   **Returns:** `0` or `1` (number).
*   **Error states:** Returns `0` if `fish` is `nil`, invalid, or lacks the `weighable` component.

### `item_fn(data, name)`
*   **Description:** Factory function that constructs and configures a single lure prefab instance.
*   **Parameters:**
    *   `data` (table) — lure configuration from the `LURES` table; includes `build`, `symbol`, `lure_data`, and optional `fns`.
    *   `name` (string) — the prefab name (e.g., `"oceanfishinglure_spoon_red"`).
*   **Returns:** The fully configured `inst` (entity).
*   **Error states:** Returns early on non-master instances (client-side only setup); only full setup occurs on `TheWorld.ismastersim`.

### `SetupLure(data)` (via `oceanfishingtackle` component)
*   **Description:** Configures the lure’s data in the `oceanfishingtackle` component (see `./components/oceanfishingtackle.lua`).
*   **Parameters:** `data` (table) — the same `data` table passed to `item_fn`, including `lure_data` and `fns`.
*   **Returns:** Nothing.

## Events & listeners
This file does not register or fire any events directly. Entity instances may fire events via other components (e.g., `inventoryitem`, `inspectable`), but none are defined in this file.