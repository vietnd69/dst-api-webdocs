---
id: levels
title: Levels
description: Central registry for world generation configurations, level presets, settings presets, and playstyle definitions across all game modes.
tags: [worldgen, configuration, presets, levels]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: data_config
source_hash: d98a1a48
system_scope: world
---

# Levels

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`levels.lua` is the central configuration registry for world generation in Don't Starve Together. It manages three categories of presets: **Level** (complete world configurations), **Settings** (world option overrides), and **WorldGen** (terrain and layout configurations). The module supports both base game content and modded content through separate storage tables, with automatic merging of location-specific defaults. It also defines playstyle profiles that categorize worlds based on their settings (e.g., "survival", "chill", "competitive"). This file is required by world creation screens, server configuration tools, and the customization UI to populate available world options.

## Usage example
```lua
local Levels = require "map/levels"

-- Get all available level presets for survival mode in the forest location
local levelList = Levels.GetList(LEVELCATEGORY.LEVEL, LEVELTYPE.SURVIVAL, DEFAULT_LOCATION, true)

-- Retrieve full data for a specific level by ID
local levelData = Levels.GetDataForID(LEVELCATEGORY.LEVEL, "SURVIVAL_DEFAULT")

-- Get the default settings for a level type and location
local defaultSettings = Levels.GetDefaultData(LEVELCATEGORY.SETTINGS, LEVELTYPE.SURVIVAL, DEFAULT_LOCATION)

-- Calculate playstyle based on settings overrides
local playstyle = Levels.CalcPlaystyleForSettings({ season = "summer", day = "long" })

-- Note: Registration functions (AddLevel, AddSettingsPreset, AddWorldGenLevel,
-- AddPlaystyleDef, AddLocation) are GLOBAL functions, NOT module exports.
-- Call them directly without the Levels. prefix:
-- AddLevel(LEVELTYPE.SURVIVAL, { id = "MY_LEVEL", name = "My World", location = "forest" })
```

## Dependencies & tags
**External dependencies:**
- `map/level` -- Level class constructor for wrapping level data tables
- `map/settings` -- SettingsPreset class constructor for settings configurations
- `map/locations` -- Location definition data (loaded via require)
- `map/customize` -- Used in MergeLocationSettings and MergeLocationWorldGen for option categorization
- `map/levels/forest`, `caves`, `lavaarena`, `quagmire` -- Base game level definitions (loaded via require)
- `CustomPresetManager` -- Global manager for user-created custom presets
- `Profile` -- Player profile storage for saved customization presets
- `ModManager` -- Tracks currently loading mod for mod-specific registration

**Components used:** None identified (data configuration module, not attached to entities)

**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `levellist` | table | `{}` | Master storage for level presets indexed by LEVELTYPE. Each type contains an array of Level objects. |
| `settingslist` | table | `{}` | Master storage for settings presets indexed by LEVELTYPE. Each type contains an array of SettingsPreset objects. |
| `worldgenlist` | table | `{}` | Master storage for worldgen presets indexed by LEVELTYPE. Each type contains an array of Level objects. |
| `modlevellist` | table | `{}` | Mod-specific level storage. Keyed by mod identifier, then by LEVELTYPE, then array of Level objects. |
| `modsettingslist` | table | `{}` | Mod-specific settings storage. Keyed by mod identifier, then by LEVELTYPE, then array of SettingsPreset objects. |
| `modworldgenlist` | table | `{}` | Mod-specific worldgen storage. Keyed by mod identifier, then by LEVELTYPE, then array of Level objects. |
| `locations` | table | `{}` | Master location definitions. Keyed by location string (e.g., "forest", "caves"). |
| `modlocations` | table | `{}` | Mod-specific location definitions. Keyed by mod identifier, then by location string. |
| `playstyle_defs` | table | `{}` | Playstyle definition objects keyed by playstyle ID. Contains overrides and priority for matching. |
| `playstyle_order` | table | `{}` | Array of playstyle IDs in display order. Populated via AddPlaystyleDef. |

### Record schemas
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `Level.id` | string | --- | Unique identifier for the level preset. |
| `Level.name` | string | --- | Display name shown in UI. |
| `Level.desc` | string | --- | Description text for the level. |
| `Level.location` | string | --- | Location identifier (e.g., "forest", "caves"). |
| `Level.overrides` | table | --- | Table of world setting overrides. |
| `Level.hideinfrontend` | boolean | --- | If true, excluded from frontend lists when frontend=true. |
| `Level.hideminimap` | boolean | --- | If true, hides minimap display. |
| `SettingsPreset.settings_id` | string | --- | Unique identifier for the settings preset. |
| `SettingsPreset.settings_name` | string | --- | Display name shown in UI. |
| `SettingsPreset.settings_desc` | string | --- | Description text for the settings preset. |
| `SettingsPreset.location` | string | --- | Location identifier this preset applies to. |
| `SettingsPreset.overrides` | table | --- | Table of world setting overrides (LEVELCATEGORY.SETTINGS only). |
| `PlaystyleDef.id` | string | --- | Unique identifier for the playstyle. |
| `PlaystyleDef.overrides` | table | --- | Required setting overrides for this playstyle to match. |
| `PlaystyleDef.priority` | number | --- | Tiebreaker score when multiple playstyles match. |
| `PlaystyleDef.is_default` | boolean | --- | Optional; if true, starts with 0.5 base score instead of 1.0. |

## Main functions
### `GetDataForLocation(location)`
* **Description:** Retrieves location configuration data, checking mod locations first before falling back to master locations. Returns a deep copy to prevent external modification.
* **Parameters:**
  - `location` -- string location identifier (e.g., "forest", "caves")
* **Returns:** Deep copy of location data table or `nil` if not found.
* **Error states:** None.

### `ClearModData(mod)`
* **Description:** Removes all mod-specific data for a given mod identifier. Used when a mod is unloaded or disabled. If `mod` is nil, clears all mod data tables.
* **Parameters:**
  - `mod` -- mod identifier string or `nil` to clear all
* **Returns:** None
* **Error states:** None.

### `GetLevelList(leveltype, location, frontend)`
* **Description:** Returns an array of available level presets for the specified level type and location. Filters out levels marked `hideinfrontend` when `frontend` is true. Includes modded levels and profile presets.
* **Parameters:**
  - `leveltype` -- LEVELTYPE enum value (SURVIVAL, LAVAARENA, QUAGMIRE, TEST, CUSTOM)
  - `location` -- string location identifier or `nil` for all locations
  - `frontend` -- boolean; if true, excludes levels with `hideinfrontend = true`
* **Returns:** Array of `{text = level_name, data = level_id}` tables.
* **Error states:** None.

### `GetDataForLevelID(id, nolocation)`
* **Description:** Retrieves full level data for a given level ID. Searches mod levels first, then master levels, then profile presets. If `nolocation` is false or nil, merges location-specific defaults into the result.
* **Parameters:**
  - `id` -- string level identifier (case-insensitive)
  - `nolocation` -- boolean; if true, returns raw level data without location merge
* **Returns:** Merged level data table or `nil` if not found.
* **Error states:** None.

### `GetDefaultLevelData(leveltype, location)`
* **Description:** Returns the default level data for a given level type and location. Uses the first valid level from GetLevelList as the default.
* **Parameters:**
  - `leveltype` -- LEVELTYPE enum value
  - `location` -- string location identifier or `nil` for DEFAULT_LOCATION
* **Returns:** Level data table or `nil` if no valid levels exist.
* **Error states:** None.

### `GetTypeForLevelID(id)`
* **Description:** Determines the LEVELTYPE for a given level ID. Returns LEVELTYPE.UNKNOWN for custom presets or unrecognized IDs.
* **Parameters:**
  - `id` -- string level identifier
* **Returns:** LEVELTYPE enum value.
* **Error states:** None.

### `GetNameForLevelID(level_id)`
* **Description:** Retrieves the display name for a level by ID.
* **Parameters:**
  - `level_id` -- string level identifier
* **Returns:** String name or `nil` if not found.
* **Error states:** None.

### `GetDescForLevelID(level_id)`
* **Description:** Retrieves the description for a level by ID.
* **Parameters:**
  - `level_id` -- string level identifier
* **Returns:** String description or `nil` if not found.
* **Error states:** None.

### `GetLocationForLevelID(level_id)`
* **Description:** Retrieves the location identifier for a level by ID.
* **Parameters:**
  - `level_id` -- string level identifier
* **Returns:** String location or `nil` if not found.
* **Error states:** None.

### `GetSettingsList(leveltype, location, frontend)`
* **Description:** Returns an array of available settings presets for the specified level type and location. Includes modded settings and custom presets from CustomPresetManager. Marks modded entries with `modded = true`.
* **Parameters:**
  - `leveltype` -- LEVELTYPE enum value
  - `location` -- string location identifier or `nil` for all locations
  - `frontend` -- boolean; if true, excludes presets with `hideinfrontend = true`
* **Returns:** Array of `{text = settings_name, data = settings_id, modded = boolean}` tables.
* **Error states:** None.

### `MergeLocationSettings(level)`
* **Description:** Merges a settings preset with location-specific defaults. Filters overrides to only include options categorized as LEVELCATEGORY.SETTINGS via the Customize module.
* **Parameters:**
  - `level` -- settings preset data table
* **Returns:** Merged settings data table with location overrides applied.
* **Error states:** None.

### `GetDataForSettingsID(id, nolocation)`
* **Description:** Retrieves full settings data for a given settings ID. Searches mod settings first, then master settings, then custom presets. If `nolocation` is false, merges location-specific defaults.
* **Parameters:**
  - `id` -- string settings identifier (case-insensitive)
  - `nolocation` -- boolean; if true, returns raw settings data without location merge
* **Returns:** Merged settings data table or `nil` if not found.
* **Error states:** None.

### `GetDefaultSettingsData(leveltype, location)`
* **Description:** Returns the default settings data for a given level type and location. Uses the first valid settings preset from GetSettingsList as the default.
* **Parameters:**
  - `leveltype` -- LEVELTYPE enum value
  - `location` -- string location identifier or `nil` for DEFAULT_LOCATION
* **Returns:** Settings data table or `nil` if no valid presets exist.
* **Error states:** None.

### `GetTypeForSettingsID(id)`
* **Description:** Determines the LEVELTYPE for a given settings ID. Returns LEVELTYPE.CUSTOMPRESET for custom presets, LEVELTYPE.UNKNOWN for unrecognized IDs.
* **Parameters:**
  - `id` -- string settings identifier
* **Returns:** LEVELTYPE enum value.
* **Error states:** None.

### `GetNameForSettingsID(level_id)`
* **Description:** Retrieves the display name for a settings preset by ID.
* **Parameters:**
  - `level_id` -- string settings identifier
* **Returns:** String name or `nil` if not found.
* **Error states:** None.

### `GetDescForSettingsID(level_id)`
* **Description:** Retrieves the description for a settings preset by ID.
* **Parameters:**
  - `level_id` -- string settings identifier
* **Returns:** String description or `nil` if not found.
* **Error states:** None.

### `GetLocationForSettingsID(level_id)`
* **Description:** Retrieves the location identifier for a settings preset by ID.
* **Parameters:**
  - `level_id` -- string settings identifier
* **Returns:** String location or `nil` if not found.
* **Error states:** None.

### `GetWorldGenList(leveltype, location, frontend)`
* **Description:** Returns an array of available worldgen presets for the specified level type and location. Includes modded worldgen and custom presets. Marks modded entries with `modded = true`.
* **Parameters:**
  - `leveltype` -- LEVELTYPE enum value
  - `location` -- string location identifier or `nil` for all locations
  - `frontend` -- boolean; if true, excludes presets with `hideinfrontend = true`
* **Returns:** Array of `{text = worldgen_name, data = worldgen_id, modded = boolean}` tables.
* **Error states:** None.

### `MergeLocationWorldGen(level)`
* **Description:** Merges a worldgen preset with location-specific defaults. Filters overrides to exclude options categorized as LEVELCATEGORY.SETTINGS (only includes terrain/layout options). Returns a Level object.
* **Parameters:**
  - `level` -- worldgen preset data table
* **Returns:** Level object with merged location overrides.
* **Error states:** None.

### `GetDataForWorldGenID(id, nolocation)`
* **Description:** Retrieves full worldgen data for a given worldgen ID. Searches mod worldgen first, then master worldgen, then custom presets. If `nolocation` is false, merges location-specific defaults.
* **Parameters:**
  - `id` -- string worldgen identifier (case-insensitive)
  - `nolocation` -- boolean; if true, returns raw worldgen data without location merge
* **Returns:** Merged worldgen data (Level object) or `nil` if not found.
* **Error states:** None.

### `GetDefaultWorldGenData(leveltype, location)`
* **Description:** Returns the default worldgen data for a given level type and location. Uses the first valid worldgen preset from GetWorldGenList as the default.
* **Parameters:**
  - `leveltype` -- LEVELTYPE enum value
  - `location` -- string location identifier or `nil` for DEFAULT_LOCATION
* **Returns:** WorldGen data (Level object) or `nil` if no valid presets exist.
* **Error states:** None.

### `GetTypeForWorldGenID(id)`
* **Description:** Determines the LEVELTYPE for a given worldgen ID. Returns LEVELTYPE.CUSTOMPRESET for custom presets, LEVELTYPE.UNKNOWN for unrecognized IDs.
* **Parameters:**
  - `id` -- string worldgen identifier
* **Returns:** LEVELTYPE enum value.
* **Error states:** None.

### `GetNameForWorldGenID(level_id)`
* **Description:** Retrieves the display name for a worldgen preset by ID.
* **Parameters:**
  - `level_id` -- string worldgen identifier
* **Returns:** String name or `nil` if not found.
* **Error states:** None.

### `GetDescForWorldGenID(level_id)`
* **Description:** Retrieves the description for a worldgen preset by ID.
* **Parameters:**
  - `level_id` -- string worldgen identifier
* **Returns:** String description or `nil` if not found.
* **Error states:** None.

### `GetLocationForWorldGenID(level_id)`
* **Description:** Retrieves the location identifier for a worldgen preset by ID.
* **Parameters:**
  - `level_id` -- string worldgen identifier
* **Returns:** String location or `nil` if not found.
* **Error states:** None.

### `GetCombinedList(leveltype, location, frontend)`
* **Description:** Returns a unified list of both settings and worldgen presets for the specified level type and location. Deduplicates by ID to prevent entries appearing twice if they exist in both categories.
* **Parameters:**
  - `leveltype` -- LEVELTYPE enum value
  - `location` -- string location identifier or `nil` for all locations
  - `frontend` -- boolean; if true, excludes presets with `hideinfrontend = true`
* **Returns:** Array of `{text = preset_name, data = preset_id, modded = boolean}` tables.
* **Error states:** None.

### `GetList(category, ...)`
* **Description:** Category dispatcher that routes to the appropriate list function based on LEVELCATEGORY. Supports LEVEL, SETTINGS, WORLDGEN, and COMBINED categories.
* **Parameters:**
  - `category` -- LEVELCATEGORY enum value
  - `...` -- arguments passed to the underlying list function (leveltype, location, frontend)
* **Returns:** Array of preset entries from the corresponding category.
* **Error states:** None.

### `GetDefaultData(category, ...)`
* **Description:** Category dispatcher that routes to the appropriate default data function based on LEVELCATEGORY. Supports LEVEL, SETTINGS, and WORLDGEN categories.
* **Parameters:**
  - `category` -- LEVELCATEGORY enum value
  - `...` -- arguments passed to the underlying default function (leveltype, location)
* **Returns:** Default data table for the specified category.
* **Error states:** None.

### `GetDataForID(category, ...)`
* **Description:** Category dispatcher that routes to the appropriate data lookup function based on LEVELCATEGORY. For COMBINED category, checks settings first, then worldgen.
* **Parameters:**
  - `category` -- LEVELCATEGORY enum value
  - `...` -- arguments passed to the underlying lookup function (id, nolocation)
* **Returns:** Data table for the specified ID or `nil` if not found.
* **Error states:** None.

### `GetTypeForID(category, ...)`
* **Description:** Category dispatcher that routes to the appropriate type lookup function based on LEVELCATEGORY.
* **Parameters:**
  - `category` -- LEVELCATEGORY enum value
  - `...` -- arguments passed to the underlying type function (id)
* **Returns:** LEVELTYPE enum value.
* **Error states:** None.

### `GetNameForID(category, ...)`
* **Description:** Category dispatcher that routes to the appropriate name lookup function based on LEVELCATEGORY. For COMBINED category, checks settings first, then worldgen.
* **Parameters:**
  - `category` -- LEVELCATEGORY enum value
  - `...` -- arguments passed to the underlying name function (level_id)
* **Returns:** String name or `nil` if not found.
* **Error states:** None.

### `GetDescForID(category, ...)`
* **Description:** Category dispatcher that routes to the appropriate description lookup function based on LEVELCATEGORY. For COMBINED category, checks settings first, then worldgen.
* **Parameters:**
  - `category` -- LEVELCATEGORY enum value
  - `...` -- arguments passed to the underlying desc function (level_id)
* **Returns:** String description or `nil` if not found.
* **Error states:** None.

### `GetLocationForID(category, ...)`
* **Description:** Category dispatcher that routes to the appropriate location lookup function based on LEVELCATEGORY.
* **Parameters:**
  - `category` -- LEVELCATEGORY enum value
  - `...` -- arguments passed to the underlying location function (level_id)
* **Returns:** String location or `nil` if not found.
* **Error states:** None.

### `GetPlaystyles()`
* **Description:** Returns the ordered array of registered playstyle IDs.
* **Parameters:** None
* **Returns:** Array of playstyle ID strings.
* **Error states:** None.

### `GetPlaystyleDef(id)`
* **Description:** Retrieves the playstyle definition object for a given playstyle ID.
* **Parameters:**
  - `id` -- string playstyle identifier
* **Returns:** Playstyle definition table or `nil` if not found.
* **Error states:** None.

### `CalcPlaystyleForSettings(settings_overrides)`
* **Description:** Calculates the best-matching playstyle for a given set of settings overrides. Scores each playstyle by comparing its required overrides against the provided settings. Default playstyles start with 0.5 score; non-default start with 1.0. A single mismatch sets score to 0. Returns the highest-scoring playstyle ID, with priority as tiebreaker.
* **Parameters:**
  - `settings_overrides` -- table of setting name to value pairs
* **Returns:** String playstyle ID of the best match.
* **Error states:** Errors if `playstyle_defs` is empty (scores table will be empty, causing nil access on `scores[1].id`).

### `AddLocation(data)`
* **Description:** Registers a new location definition. Automatically routes to AddModLocation if a mod is currently loading. Asserts if the location already exists.
* **Parameters:**
  - `data` -- location data table with `location` key as identifier
* **Returns:** None
* **Error states:** Asserts if location already exists in master locations table.

### `AddModLocation(mod, data)`
* **Description:** Registers a mod-specific location definition. Logs error if location already exists.
* **Parameters:**
  - `mod` -- mod identifier string
  - `data` -- location data table with `location` key as identifier
* **Returns:** None
* **Error states:** None (logs moderror instead of asserting).

### `AddLevel(type, data)`
* **Description:** Registers a new level preset. Automatically routes to AddModLevel if a mod is currently loading. Asserts if the level ID already exists. Wraps data in Level() constructor.
* **Parameters:**
  - `type` -- LEVELTYPE enum value
  - `data` -- level data table with `id`, `name`, `location`, and `overrides` keys
* **Returns:** None
* **Error states:** Asserts if level ID already exists.

### `AddModLevel(mod, type, data)`
* **Description:** Registers a mod-specific level preset. Automatically creates corresponding settings and worldgen presets from the level data. Asserts if ID uses reserved "CUSTOM_" prefix.
* **Parameters:**
  - `mod` -- mod identifier string
  - `type` -- LEVELTYPE enum value
  - `data` -- level data table
* **Returns:** None
* **Error states:** Asserts if ID starts with "CUSTOM_". Logs moderror if ID already exists.

### `AddSettingsPreset(type, data)`
* **Description:** Registers a new settings preset. Automatically routes to AddModSettingsPreset if a mod is currently loading. Asserts if the settings ID already exists. Wraps data in SettingsPreset() constructor.
* **Parameters:**
  - `type` -- LEVELTYPE enum value
  - `data` -- settings data table with `settings_id`, `settings_name`, `location`, and `overrides` keys
* **Returns:** None
* **Error states:** Asserts if settings ID already exists.

### `AddModSettingsPreset(mod, type, data)`
* **Description:** Registers a mod-specific settings preset. Asserts if ID uses reserved "CUSTOM_" prefix.
* **Parameters:**
  - `mod` -- mod identifier string
  - `type` -- LEVELTYPE enum value
  - `data` -- settings data table
* **Returns:** None
* **Error states:** Asserts if ID starts with "CUSTOM_". Logs moderror if ID already exists.

### `AddWorldGenLevel(type, data)`
* **Description:** Registers a new worldgen preset. Automatically routes to AddModWorldGenLevel if a mod is currently loading. Asserts if the worldgen ID already exists. Wraps data in Level() constructor.
* **Parameters:**
  - `type` -- LEVELTYPE enum value
  - `data` -- worldgen data table with `id`, `name`, `location`, and `overrides` keys
* **Returns:** None
* **Error states:** Asserts if worldgen ID already exists.

### `AddModWorldGenLevel(mod, type, data)`
* **Description:** Registers a mod-specific worldgen preset. Asserts if ID uses reserved "CUSTOM_" prefix.
* **Parameters:**
  - `mod` -- mod identifier string
  - `type` -- LEVELTYPE enum value
  - `data` -- worldgen data table
* **Returns:** None
* **Error states:** Asserts if ID starts with "CUSTOM_". Logs moderror if ID already exists.

### `AddPlaystyleDef(def)`
* **Description:** Registers a new playstyle definition. Asserts if the playstyle ID already exists. Adds ID to playstyle_order array and stores definition in playstyle_defs table.
* **Parameters:**
  - `def` -- playstyle definition table with `id`, `overrides`, `priority`, and optional `is_default` keys
* **Returns:** None
* **Error states:** Asserts if playstyle ID already exists.

## Events & listeners
None.