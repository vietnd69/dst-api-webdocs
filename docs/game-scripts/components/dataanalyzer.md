---
id: dataanalyzer
title: Dataanalyzer
description: Manages creature data collection, regeneration, and consumption for scanner-like entities in the game.
tags: [scanner, data, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 87a23ed2
system_scope: entity
---

# Dataanalyzer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DataAnalyzer` is a component that tracks and manages creature scan data for an entity. It maintains a history of data values per prefab, supports periodic regeneration of data up to creature-specific maximums, and allows data to be spent (consumed). It integrates with external definition data via `GetCreatureScanData`, which defines maximum data limits for each creature type. This component is designed for use with scanner-like prefabs that gather and use creature-specific data.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("dataanalyzer")
inst.components.dataanalyzer:StartDataRegen(1.0) -- regenerate every 1 second
local data = inst.components.dataanalyzer:GetData("bee")
local spent = inst.components.dataanalyzer:SpendData("bee")
inst.components.dataanalyzer:StopDataRegen()
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X`. Relies on `GetCreatureScanData` from `wx78_moduledefs`.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `datahistory` | table | `{}` | Maps prefab names to current data values (stored as floating-point numbers). |

## Main functions
### `StartDataRegen(dt)`
*   **Description:** Starts a periodic task that increases stored data for all known prefabs at intervals of `dt` seconds, up to their respective maximums defined by `GetCreatureScanData`.
*   **Parameters:** `dt` (number) - the interval in seconds between regeneration ticks.
*   **Returns:** Nothing.
*   **Error states:** If called multiple times, previous regeneration tasks are cancelled before starting a new one.

### `StopDataRegen()`
*   **Description:** Cancels the periodic data regeneration task, if active.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if no regeneration task is running.

### `GetData(prefab)`
*   **Description:** Returns the current floor value of stored data for the specified prefab. If no data exists yet, initializes it to the prefab’s maximum data value (from `GetCreatureScanData`) and returns that value.
*   **Parameters:** `prefab` (string) - the name of the creature prefab.
*   **Returns:** number - the stored data amount (rounded down), or `0` if the prefab has no associated data definition.
*   **Error states:** Returns `0` if `GetCreatureScanData(prefab)` returns `nil`.

### `SpendData(prefab)`
*   **Description:** Deducts all currently stored data for the given prefab and returns the amount spent. The internal data value is reset to `0`.
*   **Parameters:** `prefab` (string) - the name of the creature prefab.
*   **Returns:** number - the amount of data spent (an integer), or `0` if no data was available.
*   **Error states:** If `GetCreatureScanData(prefab)` is `nil`, `prefab` entry is not created in `datahistory`, and `0` is returned.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
