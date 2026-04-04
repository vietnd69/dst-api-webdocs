---
id: achievements
title: Achievements
description: Defines a lookup table of achievement constants mapped to platform-specific identifiers.
tags: [data, progression, ui]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 65f75a2b
system_scope: ui
---

# Achievements

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
The `achievements.lua` script serves as a centralized data registry for game achievements. It constructs a global table mapping internal achievement names to platform-specific identifiers required by services like Steam or PlayStation Network. This file is typically required by UI systems or backend managers to reference achievement metadata without hardcoding IDs elsewhere in the codebase.

## Usage example
```lua
local Achievements = require("achievements")
-- Access the first achievement definition in the list
local achievement = Achievements[1]
print(achievement.name) -- Outputs: "survive_20"
print(achievement.id.steam) -- Outputs: "1_survive_20"
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
The module returns a list (array) of achievement definition tables. Each entry in the list contains the following structure:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | string | `nil` | Internal identifier used in code to refer to this achievement. |
| `id` | table | `nil` | Contains platform-specific IDs, keyed by `steam` (string) and `psn` (integer). |

## Main functions
### `ACHIEVEMENT(id, name)`
*   **Description:** Internal helper function used during module load to generate achievement table entries. It formats the raw ID and name into the standard data structure.
*   **Parameters:** `id` (string) - Numeric ID string; `name` (string) - Internal achievement name key.
*   **Returns:** table - Structured achievement data containing `name` and nested `id` table.
*   **Error states:** This function is local to the file and not exposed in the returned module table.

## Events & listeners
None identified.