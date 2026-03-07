---
id: regrowthmanager
title: Regrowthmanager
description: Manages the scheduled regrowth of harvestable plants and structures after they are collected, using time-based timers and world state conditions.
tags: [environment, harvesting, world, plant, season]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 39e9381e
system_scope: environment
---

# Regrowthmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RegrowthManager` is a server-only component responsible for scheduling and executing the delayed regrowth of harvestable entities (e.g., plants, mushrooms, mushrooms, caves). It tracks regrowth timers using internal cumulative time, applies world-state-dependent growth multipliers (e.g., season, time of day, weather), and handles placement of new prefabs when timers expire—respecting terrain, player proximity, and entity density rules. This component is typically added to the `TheWorld` entity and works with the `beginregrowth` event and periodic update loop.

## Usage example
```lua
-- Typically added automatically to TheWorld in the world initialization.
-- To configure a custom regrowth type (e.g., a mod-added plant):
inst.components.regrowthmanager:SetRegrowthForType(
    "my_modded_plant",
    TUNING.MY_PLANT_REGROWTH_TIME,
    "my_modded_plant",
    function()
        -- Return growth multiplier based on world state
        return (_worldstate.isspring and 1.5) or 1.0
    end
)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `self.inst` | The entity instance (typically `TheWorld`) this component is attached to. |

## Main functions
### `SetRegrowthForType(prefab, regrowtime, product, timemult)`
*   **Description:** Registers regrowth behavior for a given prefab type. Defines how long it takes to regrow, what prefab spawns, and a multiplier function that adjusts speed based on world state.
*   **Parameters:**
    *   `prefab` (string) – The name of the harvested entity prefab (e.g., `"carrot_planted"`).
    *   `regrowtime` (number) – Base regrowth time in seconds.
    *   `product` (string) – The prefab name to spawn on regrowth completion.
    *   `timemult` (function) – A function returning a real-valued multiplier (e.g., `0`, `0.5`, `2.0`) based on `_worldstate`, which adjusts the effective growth rate.
*   **Returns:** Nothing.
*   **Error states:** None.

### `LongUpdate(dt)`
*   **Description:** Called periodically (every `UPDATE_PERIOD = 29` seconds). Processes all pending regrowth timers for each registered prefab type, spawns new prefabs when their accumulated time reaches or exceeds the regrowth threshold, and updates internal state (remove completed timers, requeue failed ones).
*   **Parameters:**
    *   `dt` (number) – Delta time in seconds since the last update.
*   **Returns:** Nothing.
*   **Error states:** Timers may be skipped or retried depending on `DoRegrowth` outcome (`SUCCESS`, `FAILED`, `CACHE`).

### `OnSave()`
*   **Description:** Serializes in-progress regrowth timers into a table format for world save. Stores remaining regrowth time relative to current internal time.
*   **Parameters:** None.
*   **Returns:** `{ timers = { [prefab] = { { product, regrowtime, position }, ... }, ... } }` (table).

### `OnLoad(data)`
*   **Description:** Loads serialized regrowth timer data from a previous save. Recreates internal timer queues using saved positions and relative times.
*   **Parameters:**
    *   `data` (table) – Save data containing `timers`, as returned by `OnSave`.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a multi-line debug string summarizing active timer queues per prefab (count, multiplier, next timer's remaining time).
*   **Parameters:** None.
*   **Returns:** `string` – A formatted string for use in debug overlays or logs.

## Events & listeners
- **Listens to:** `beginregrowth` – Fires when an entity (e.g., harvested carrot) triggers its regrowth timer. Handler `OnBeginRegrowth` records timer data and queues it.
- **Pushes:** None identified.
