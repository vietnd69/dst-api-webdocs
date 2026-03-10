---
id: achievements
title: Achievements
description: Defines the list of achievements available in the game, mapping internal names to platform-specific identifiers.
tags: [achievements, data, configuration]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 65f75a2b
system_scope: world
---

# Achievements

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file is a static data definition containing all available achievements in *Don't Starve Together*. It uses a helper function `ACHIEVEMENT(id, name)` to construct achievement entries with both human-readable names and platform-specific identifiers (e.g., Steam string IDs, PSN numeric IDs). It is not a component and does not attach to entities; it is a top-level configuration table returned for use by the achievements system elsewhere in the codebase.

## Usage example
```lua
-- Example of accessing an achievement definition
local achievements = require("achievements")
local survive20 = achievements["survive_20"]
print(survive20.name) -- "survive_20"
print(survive20.id.steam) -- "1_survive_20"
print(survive20.id.psn) -- 1
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | string | — | Internal identifier used in code to refer to the achievement (e.g., `"survive_20"`). |
| `id.steam` | string | — | Platform-specific ID for Steam, formatted as `<id>_<name>`. |
| `id.psn` | number | — | Platform-specific numeric ID for PlayStation Network (from `.trp` file). |

## Main functions
### `ACHIEVEMENT(id, name)`
*   **Description:** Helper function that constructs and returns an achievement definition table with a consistent structure.
*   **Parameters:**  
    - `id` (string or number) — Platform ID. For Steam, converted to string; for PSN, kept as integer.  
    - `name` (string) — Internal achievement name (used as the key in the `Achievements` table).  
*   **Returns:** `{ name = name, id = { steam = "...", psn = ... } }`  
*   **Error states:** None.

## Events & listeners
Not applicable