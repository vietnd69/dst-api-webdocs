---
id: perfutil
title: Perfutil
description: Provides utilities for profiling and monitoring game performance, including entity counting, server/client stats, and world metadata collection.
tags: [debug, profiling, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 525c3d2c
system_scope: world
---

# Perfutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`perfutil` is a utility module (not an ECS component) containing standalone functions to gather runtime performance and world metadata for diagnostics and profiling. It collects statistics on active entities, player pings, mod usage, and world save data. These functions are typically invoked manually or via developer tools to analyze server/client state.

## Usage example
```lua
-- Collect and display entity counts and breakdown
CountEntities()

-- Gather comprehensive profiler metadata
local meta = GetProfilerMetaData()
print("Players:", meta.numplayers)
print("Client mode:", meta.ClientMode)
print("Mods loaded:", meta.mods)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `CountEntities()`
*   **Description:** Iterates over all entities in the world and prints a summary of total, awake, and invalid entities, plus a sorted list of prefab counts.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Safely skips entities missing a `prefab` property or marked invalid.

### `GetProfilerSave(results)`
*   **Description:** Attempts to load the current world save data and stores it in `results.levelstring` for profiling purposes. Only runs on the master simulation.
*   **Parameters:** `results` (table) — output table to which `levelstring` is added.
*   **Returns:** Nothing.

### `GetProfilerPlayers(results)`
*   **Description:** Collects player count and ping information from connected clients.
*   **Parameters:** `results` (table) — output table to which `numplayers` and `pings` are added.
*   **Returns:** Nothing.

### `GetProfilerServerStats(results)`
*   **Description:** Determines and stores the server role (Dedicated Server, Server, or Client).
*   **Parameters:** `results` (table) — output table to which `ClientMode` is added.
*   **Returns:** Nothing.

### `GetProfilerModInfo(results)`
*   **Description:** Collects the list of active server mods and formats them into a string for profiling.
*   **Parameters:** `results` (table) — output table to which `mods` (e.g., `"3:[mod1][mod2][mod3]"`) is added.
*   **Returns:** Nothing.

### `GetProfilerMetaData()`
*   **Description:** Convenience function that aggregates all profiler data via the above helpers into a single results table.
*   **Parameters:** None.
*   **Returns:** `results` (table) — contains keys: `ClientMode`, `levelstring`, `numplayers`, `pings`, `mods`.

### `ExpandWorldFromProfile()`
*   **Description:** Loads a `profile.json` file, parses embedded world generation metadata, and writes the decoded level string back as `profile_world`. Used for world restoration or testing.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Silently does nothing if the profile file is missing, malformed, or lacks expected fields.

## Events & listeners
None