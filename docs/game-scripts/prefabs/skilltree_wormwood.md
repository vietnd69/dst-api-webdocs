---
id: skilltree_wormwood
title: Skilltree Wormwood
description: Defines the complete skill tree configuration and data structure for the Wormwood character in Don't Starve Together.
tags: [skilltree, character, prefabs]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6cceef97
system_scope: entity
---

# Skilltree Wormwood

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`skilltree_wormwood.lua` is a data module that defines the entire skill tree configuration for the Wormwood character. It specifies all available skills (by ID), their metadata (title, description, icon), positioning, groupings, activation logic (via `onactivate`/`ondeactivate` callbacks), and dependency relationships (`connects`, `locks`). This file is not a component itself, but rather a factory function that returns structured skill data used by the shared `skilltreeupdater` system.

## Usage example
This module is typically imported and invoked by the skill tree management system. A typical usage pattern in the game codebase looks like this:

```lua
local BuildSkillsData = require("prefabs/skilltree_wormwood")
local skilltree_data = BuildSkillsData(SkillTreeFns)
-- skilltree_data.SKILLS contains all skill definitions
-- skilltree_data.ORDERS defines rendering order for UI groups
```

## Dependencies & tags
**Components used:** `bloomness`, `damagetyperesist`, `damagetypebonus`, `skilltreeupdater`, `temperature`
**Tags:** Adds/removes tags dynamically during skill activation/deactivation:
- `farmplantidentifier`, `farmplantfastpicker`
- `crafting`, `blooming`, `allegiance`, `lock`
- `lunar`, `lunar_favor`, `player_lunar_aligned`

## Properties
No public properties are defined directly on this module. It exports a function that returns a table containing:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SKILLS` | table | (generated) | A dictionary mapping skill IDs (strings) to skill definition tables. Each skill table contains `title`, `desc`, `icon`, `pos`, `group`, `tags`, `connects`, and callback fields like `onactivate`. |
| `ORDERS` | table | `{"crafting", "gathering", "allegiance1", "allegiance2"}` | Ordered list of group names used to determine UI rendering priority. |

## Main functions
### `BuildSkillsData(SkillTreeFns)`
*   **Description:** Factory function that constructs and returns all Wormwood-specific skill tree data. It accepts a table of utility functions (`SkillTreeFns`) used for skill logic (e.g., `MakeCelestialChampionLock`, `CountTags`). Skills are defined in a nested table with explicit activation/deactivation logic for component interactions.
*   **Parameters:** `SkillTreeFns` (table) — Contains helper functions such as `MakeCelestialChampionLock` and `CountTags`, typically provided by the shared skill tree system.
*   **Returns:** A table with two keys: `SKILLS` (list of skill definitions) and `ORDERS` (list of group names in display order).
*   **Error states:** None documented; relies on `SkillTreeFns` being properly supplied.

## Events & listeners
Not applicable. This module does not register or emit game events; it only provides static configuration data.