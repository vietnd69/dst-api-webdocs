---
id: levels
title: Levels
description: Central registry and manager for level configurations, settings presets, and world generation definitions in Don't Starve Together.
tags: [world, level, settings, worldgen, map]
sidebar_position: 100
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 3b6578d7
---
# Levels

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `levels.lua` module serves as the central registry and management system for all world configuration types in the game: base `Level` definitions, `SettingsPreset` definitions, and `WorldGen` level definitions. It supports both built-in and mod-added content, handles deduplication of IDs across sources, and enables merging of location-level defaults with specific overrides. This module is used by the frontend (level selection UI), world generation system, and custom preset managers.

Key responsibilities:
- Register and query levels for different categories (`LEVELCATEGORY.LEVEL`, `LEVELCATEGORY.SETTINGS`, `LEVELCATEGORY.WORLDGEN`, `LEVELCATEGORY.COMBINED`).
- Support location-based filtering and frontend-hiding logic.
- Merge location-level data (from `map/locations.lua`) with per-level overrides using `MergeMapsDeep`.
- Store and manage mod-added data separately and clear it when reloading mods.

This module does not define a component but exports a set of module-scoped functions as its public API.

## Usage example

```lua
local Levels = require("map/levels")

-- Retrieve all level options for the forest world (frontend view)
local level_options = Levels.GetLevelList(LEVELTYPE.SURVIVAL, nil, true)
for _, opt in ipairs(level_options) do
    print(opt.text, opt.data)
end

-- Get full data for a specific level ID
local level_data = Levels.GetDataForLevelID("forest")
if level_data then
    print("Level name:", level_data.name)
    print("Location:", level_data.location)
end

-- Get the default settings preset for lava arena
local default_settings = Levels.GetDefaultSettingsData(LEVELTYPE.LAVAARENA)
if default_settings then
    print("Settings name:", default_settings.settings_name)
end
```

## Dependencies & tags
**Components used:** None. This module is a pure data and logic registry, not an entity component.

**Tags:** None identified.

## Properties
No instance-based properties are defined in this module. It uses global mutable tables (`levellist`, `settingslist`, `worldgenlist`, `modlevellist`, `modsettingslist`, `modworldgenlist`, `locations`, `modlocations`, `playstyle_defs`, `playstyle_order`) internal to the module.

## Main functions

### `GetDataForLocation(location)`
* **Description:** Returns a deep copy of the location-level default data for the given `location` string, checking mod-added data first, then built-in `locations`.
* **Parameters:**
  * `location`: String specifying the location key (e.g., `"forest"`, `"caves"`).
* **Returns:** Table containing location defaults (e.g., overrides, name, desc) or `nil` if not found.
* **Error states:** Returns `nil` if no data exists for the location.

### `ClearModData(mod)`
* **Description:** Clears all mod-added data (levels, settings, worldgen, locations) for the given mod name. If `mod` is `nil`, clears all modded data.
* **Parameters:**
  * `mod`: String mod identifier or `nil` to clear all modded data.
* **Returns:** None.
* **Error states:** No explicit error behavior; silently ignores missing keys.

### `GetLevelList(leveltype, location, frontend)`
* **Description:** Returns a list of level options (with `text` and `data` fields) for the given `leveltype` and optional `location`. Filters out frontend-hidden levels if `frontend` is `true`. Includes modded and profile presets.
* **Parameters:**
  * `leveltype`: Enum `LEVELTYPE.*`.
  * `location`: Optional string for location filtering.
  * `frontend`: Boolean; if `true`, excludes entries where `hideinfrontend` is `true`.
* **Returns:** Array of tables `{text=string, data=id}`.
* **Error states:** Returns empty array if no matches found.

### `GetDataForLevelID(id, nolocation)`
* **Description:** Returns merged level data for the given `id` (case-insensitive), combining location-level defaults and level-specific overrides. If `nolocation` is `true`, returns only level-specific overrides.
* **Parameters:**
  * `id`: String level identifier (case-insensitive).
  * `nolocation`: Optional boolean; if `true`, skips merging location defaults.
* **Returns:** Full level data table or `nil`.
* **Error states:** Returns `nil` if ID is not found. Asserts if a custom preset lacks a `location`.

### `GetTypeForLevelID(id)`
* **Description:** Returns the `LEVELTYPE.*` for the given `id`, or `LEVELTYPE.UNKNOWN` if not found or if it’s a custom preset.
* **Parameters:**
  * `id`: String level identifier.
* **Returns:** `LEVELTYPE.*` enum value.

### `GetNameForLevelID(level_id)`
* **Description:** Returns the `name` field of the level data, or `nil`.

### `GetDescForLevelID(level_id)`
* **Description:** Returns the `desc` field of the level data, or `nil`.

### `GetLocationForLevelID(level_id)`
* **Description:** Returns the `location` field of the level data, or `nil`.

### `GetSettingsList(leveltype, location, frontend)`
* **Description:** Returns settings preset options with `text`, `data`, and optional `modded` flag. Filters by `location`, `frontend` hiding, and includes custom presets.
* **Parameters:**
  * `leveltype`: Enum `LEVELTYPE.*`.
  * `location`: Optional string for filtering.
  * `frontend`: Boolean to hide frontend-hidden entries.
* **Returns:** Array of tables `{text=string, data=id, [modded=bool]}`.

### `MergeLocationSettings(level)`
* **Description:** Merges location defaults into `level.overrides`, keeping only overrides belonging to the `LEVELCATEGORY.SETTINGS` category (based on `map/customize.lua`).
* **Parameters:**
  * `level`: Table with a `location` and `overrides` field.
* **Returns:** New merged level table with `overrides` populated.

### `GetDataForSettingsID(id, nolocation)`
* **Description:** Returns merged settings preset data for `id`, using `MergeLocationSettings`. Behavior mirrors `GetDataForLevelID` but for settings.

### `GetTypeForSettingsID(id)`
* **Description:** Returns `LEVELTYPE.*` for settings ID, or `LEVELTYPE.CUSTOMPRESET` for custom presets.

### `GetNameForSettingsID(level_id)`, `GetDescForSettingsID(level_id)`, `GetLocationForSettingsID(level_id)`
* **Description:** Same semantics as their `*ForLevelID` counterparts, but for settings presets.

### `GetWorldGenList(leveltype, location, frontend)`
* **Description:** Returns world generation options; mirrors `GetSettingsList` but for worldgen levels. Uses `CustomPresetManager` to fetch custom worldgen presets.

### `MergeLocationWorldGen(level)`
* **Description:** Merges location defaults into `level`, excluding settings-category overrides (to retain only worldgen-relevant overrides).
* **Returns:** New `Level` object (via `Level()` constructor) with merged overrides.

### `GetDataForWorldGenID(id, nolocation)`
* **Description:** Returns merged worldgen data, or `nil`.

### `GetTypeForWorldGenID(id)`
* **Description:** Returns `LEVELTYPE.*` or `LEVELTYPE.CUSTOMPRESET`.

### `GetNameForWorldGenID(level_id)`, `GetDescForWorldGenID(level_id)`, `GetLocationForWorldGenID(level_id)`
* **Description:** Same semantics as `*ForLevelID`.

### `GetCombinedList(leveltype, location, frontend)`
* **Description:** Returns a deduplicated list of settings and worldgen entries, ensuring IDs don’t collide. Used when presenting combined world customization lists.

### `GetList(category, ...)`
* **Description:** Generic dispatcher to `Get*List` functions based on `LEVELCATEGORY.*`.

### `GetDefaultData(category, ...)`, `GetDataForID(category, ...)`, `GetTypeForID(category, ...)`, `GetNameForID(category, ...)`, `GetDescForID(category, ...)`, `GetLocationForID(category, ...)`
* **Description:** Generic dispatchers for corresponding category-specific functions.

### `GetPlaystyles()`, `GetPlaystyleDef(id)`
* **Description:** Returns ordered list of playstyle IDs (`playstyle_order`) and full definition for a given `id`.

### `CalcPlaystyleForSettings(settings_overrides)`
* **Description:** Computes the best-matching playstyle for the given `settings_overrides` by scoring each playstyle’s required overrides. Returns the ID of the highest-scoring playstyle (scores: default=0.5, match=1, mismatch=0).

## Events & listeners
This module defines no components, so it does not register or emit events.

