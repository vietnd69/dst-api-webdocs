---
id: caves
title: Caves
description: Defines cave level presets and world generation configurations for Don't Starve Together survival mode.
tags: [map, worldgen, config, survival, caves]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: map
source_hash: 3bbb1517
system_scope: world
---

# Caves

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`caves.lua` defines multiple cave level preset configurations for survival mode world generation. It registers level definitions using `AddLevel()`, `AddWorldGenLevel()`, and `AddSettingsPreset()` functions. The file includes three distinct cave presets: `DST_CAVE` (standard), `DST_CAVE_PLUS` (enhanced resources), and `TERRARIA_CAVE` (cross-over themed). Platform-specific naming is applied via `IsConsole()` check for PS4 builds. This is a configuration file that runs at world initialization to populate the level selection menu.

## Usage example
```lua
-- This file auto-executes at world initialization - do not require() it
-- Preset IDs are referenced when creating custom worlds via level system APIs

-- Example: Reference preset ID in custom world configuration
local preset_id = "DST_CAVE_PLUS"  -- Use in AddWorldGenLevel or AddSettingsPreset calls

-- Presets appear in customization screen under STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELS
-- Access via: STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELS.DST_CAVE_PLUS
```

## Dependencies & tags
**External dependencies:**
- `STRINGS` -- localization strings for preset names and descriptions
- `IsConsole()` -- platform detection function for console-specific naming
- `AddLevel()` -- registers level preset in survival mode
- `AddWorldGenLevel()` -- registers world generation level configuration
- `AddSettingsPreset()` -- registers settings preset for customization screen
- `LEVELTYPE.SURVIVAL` -- enum constant for survival game mode

**Components used:** None identified

**Tags:** None identified

## Config table schema
The following fields define the structure of config tables passed to `AddLevel`, `AddWorldGenLevel`, and `AddSettingsPreset`. This file does not export a table via return statement - it registers presets via engine API calls.

| Field | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` | string | --- | Unique preset identifier (e.g., `DST_CAVE`, `DST_CAVE_PLUS`, `TERRARIA_CAVE`) |
| `name` | string | --- | Display name from `STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELS` |
| `desc` | string | --- | Description from `STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELDESC` |
| `location` | string | --- | World location type (`cave`) |
| `version` | number | --- | Preset version number (4) |
| `overrides` | table | --- | World setting overrides (boons, cave_spiders, rabbits, etc.) |
| `background_node_range` | table | --- | Background node distribution range |

## Main functions
This file contains no local function definitions. It registers preset data by calling external engine APIs (`AddLevel`, `AddWorldGenLevel`, `AddSettingsPreset`). These functions are part of the Don't Starve Together world generation system and are not defined in this file.

## Events & listeners
None.