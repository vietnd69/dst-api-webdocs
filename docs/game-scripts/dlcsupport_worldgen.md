---
id: dlcsupport_worldgen
title: Dlcsupport Worldgen
description: Provides core DLC support utilities for world generation, enabling conditional logic based on enabled DLC content.
tags: [worldgen, dlc, config]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: c0c8ba4e
system_scope: world
---

# Dlcsupport Worldgen

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This module implements a lightweight DLC support system used during world generation to determine which DLC content (e.g., Reign of Giants) should be considered active. It defines DLC identifiers, maintains an internal enablement table, and exposes utility functions (`IsDLCEnabled`, `SetDLCEnabled`) to query and configure DLC state. It is typically invoked early in the worldgen pipeline, parsing `GEN_PARAMETERS` to initialize the active DLC set.

## Usage example
```lua
require "dlcsupport_worldgen"

if IsDLCEnabled(REIGN_OF_GIANTS) then
    -- Apply RoG-specific worldgen logic
    worldgen_params.seasons_enabled = true
end
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `IsDLCEnabled(index)`
*   **Description:** Returns whether the DLC identified by `index` is currently enabled.
*   **Parameters:** `index` (number) — A numeric identifier such as `MAIN_GAME` (`0`) or `REIGN_OF_GIANTS` (`1`).
*   **Returns:** `true` if the DLC is enabled; otherwise `false`.

### `SetDLCEnabled(tbl)`
*   **Description:** Updates the global DLC enablement state using a provided table. Any DLC not present in the table defaults to disabled.
*   **Parameters:** `tbl` (table or `nil`) — A key-value table where keys are DLC index numbers and values are booleans indicating enablement. If `nil`, clears all enablement state.
*   **Returns:** Nothing.

## Events & listeners
None identified