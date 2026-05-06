---
id: customize
title: Customize
description: Defines the schema and API for world generation and server settings configuration options.
tags: [config, worldgen, settings, ui, modding]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: map
source_hash: 79b82313
system_scope: world
---

# Customize

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`customize.lua` serves as the central configuration module for world generation and server settings. It defines the structure of customization options (grouped by categories like monsters, resources, and survivors) and provides the API for mods to register, remove, or query these options. This file aggregates data from task sets, levels, and start locations to validate and apply user settings during world creation.

## Usage example
```lua
local Customize = require("map/customize")

-- Add a custom option to the World Settings menu
Customize.AddCustomizeItem("mymod", LEVELCATEGORY.SETTINGS, "misc", "my_option", {
    value = "default",
    image = "myicon.tex",
    desc = { { text = "Off", data = "off" }, { text = "On", data = "on" } }
})

-- Get all available world gen options for the forest
local options = Customize.GetWorldGenOptions("forest", true)

-- Validate a setting value
local valid = Customize.ValidateOption("beefaloheat", "often", "forest")
```

## Dependencies & tags
**External dependencies:**
- `map/tasksets` -- retrieves task list definitions for world generation.
- `map/tasks` -- required for task data (internal usage).
- `map/startlocations` -- retrieves starting location definitions.
- `map/levels` -- accesses level data and location-specific overrides.
- `worldsettings_overrides` -- validates that customization options have corresponding override handlers.

**Components used:**
None identified

**Tags:**
None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ITEM_EXPORTS` | table | — | Map of exporter functions used to format option data for the UI. |
| `ITEM_EXPORTS.atlas` | function | — | Returns the atlas path for the option icon (item or group atlas). |
| `ITEM_EXPORTS.name` | function | — | Returns the option name string. |
| `ITEM_EXPORTS.image` | function | — | Returns the image texture name for the option. |
| `ITEM_EXPORTS.options` | function | — | Returns the list of selectable values for the option (calls desc function). |
| `ITEM_EXPORTS.default` | function | — | Returns the default value string for the option. |
| `ITEM_EXPORTS.group` | function | — | Returns the group name the option belongs to. |
| `ITEM_EXPORTS.grouplabel` | function | — | Returns the localized group label text. |
| `ITEM_EXPORTS.widget_type` | function | — | Returns the UI widget type (defaults to `"optionsspinner"`). |
| `ITEM_EXPORTS.options_remap` | function | — | Returns image remapping data for the option UI element. |

## Main functions
### `GetOptions(location, is_master_world)`
* **Description:** Retrieves a list of all available customization options filtered by location and host permissions.
* **Parameters:**
  - `location` -- string world location (e.g., `"forest"`, `"cave"`) or nil for all.
  - `is_master_world` -- boolean indicating if the query is for the master shard.
* **Returns:** Array of option tables containing `name`, `options`, `default`, and `group`.
* **Error states:** None.

### `GetOptionsWithLocationDefaults(location, is_master_world)`
* **Description:** Retrieves options with default values overridden by location-specific data if available.
* **Parameters:**
  - `location` -- string world location or nil.
  - `is_master_world` -- boolean indicating if the query is for the master shard.
* **Returns:** Array of option tables with location-adjusted defaults.
* **Error states:** None.

### `GetWorldSettingsOptions(location, is_master_world)`
* **Description:** Retrieves only the World Settings category options (survival, events, giants, etc.).
* **Parameters:**
  - `location` -- string world location or nil.
  - `is_master_world` -- boolean indicating if the query is for the master shard.
* **Returns:** Array of formatted option tables for settings.
* **Error states:** None.

### `GetWorldSettingsOptionsWithLocationDefaults(location, is_master_world)`
* **Description:** Retrieves World Settings options with location-specific default overrides applied.
* **Parameters:**
  - `location` -- string world location or nil.
  - `is_master_world` -- boolean indicating if the query is for the master shard.
* **Returns:** Array of formatted option tables.
* **Error states:** None.

### `GetWorldGenOptions(location, is_master_world)`
* **Description:** Retrieves only the World Generation category options (monsters, animals, resources, etc.).
* **Parameters:**
  - `location` -- string world location or nil.
  - `is_master_world` -- boolean indicating if the query is for the master shard.
* **Returns:** Array of formatted option tables for world gen.
* **Error states:** None.

### `GetWorldGenOptionsWithLocationDefaults(location, is_master_world)`
* **Description:** Retrieves World Generation options with location-specific default overrides applied.
* **Parameters:**
  - `location` -- string world location or nil.
  - `is_master_world` -- boolean indicating if the query is for the master shard.
* **Returns:** Array of formatted option tables.
* **Error states:** None.

### `GetWorldSettingsFromLevelSettings(overrides)`
* **Description:** Filters a table of overrides to return only those belonging to the World Settings category.
* **Parameters:**
  - `overrides` -- table of option name-value pairs.
* **Returns:** Table containing only settings category overrides.
* **Error states:** None.

### `GetMasterOptions()`
* **Description:** Returns a table of option names that are controlled by the master server only.
* **Parameters:** None
* **Returns:** Table mapping option names to `true`.
* **Error states:** None.

### `GetSyncOptions()`
* **Description:** Returns a table of option names that must be synchronized across shards.
* **Parameters:** None
* **Returns:** Table mapping option names to `true`.
* **Error states:** None.

### `GetLocationDefaultForOption(location, option)`
* **Description:** Retrieves the default value for an option specific to a location, falling back to global default.
* **Parameters:**
  - `location` -- string world location.
  - `option` -- string option name.
* **Returns:** Default value string or nil.
* **Error states:** None.

### `ValidateOption(option_name, option_value, location)`
* **Description:** Checks if a given value is valid for the specified option.
* **Parameters:**
  - `option_name` -- string name of the customization option.
  - `option_value` -- string value to validate.
  - `location` -- string world location context.
* **Returns:** `true` if valid, `false` otherwise.
* **Error states:** None.

### `GetDefaultForOption(option_name)`
* **Description:** Returns the global default value for a customization option.
* **Parameters:**
  - `option_name` -- string name of the option.
* **Returns:** Default value string or nil.
* **Error states:** None.

### `GetCategoryForOption(option_name)`
* **Description:** Returns the category (World Gen or Settings) for a given option.
* **Parameters:**
  - `option_name` -- string name of the option.
* **Returns:** `LEVELCATEGORY` enum value or nil.
* **Error states:** None.

### `IsCustomizeOption(option_name)`
* **Description:** Checks if an option name exists in the customization registry.
* **Parameters:**
  - `option_name` -- string name to check.
* **Returns:** `true` if exists, `false` otherwise.
* **Error states:** None.

### `GetGroupForOption(target)`
* **Description:** Deprecated function to retrieve group data for an option.
* **Parameters:**
  - `target` -- option target identifier.
* **Returns:** `nil` (currently returns nil in source).
* **Error states:** None.

### `AddCustomizeGroup(modname, category, name, text, desc, atlas, order)`
* **Description:** Registers a new group of options for a mod in the customization menu.
* **Parameters:**
  - `modname` -- string unique identifier for the mod.
  - `category` -- `LEVELCATEGORY` enum (SETTINGS or WORLDGEN).
  - `name` -- string internal group name.
  - `text` -- string localized display name.
  - `desc` -- table or function describing option values.
  - `atlas` -- string image atlas path.
  - `order` -- number sort order (optional).
* **Returns:** None
* **Error states:** None (silently returns if group already exists).

### `RemoveCustomizeGroup(modname, category, name)`
* **Description:** Removes a mod-registered group or disables a default group for a mod.
* **Parameters:**
  - `modname` -- string mod identifier.
  - `category` -- `LEVELCATEGORY` enum.
  - `name` -- string group name.
* **Returns:** None
* **Error states:** None.

### `AddCustomizeItem(modname, category, group, name, itemsettings)`
* **Description:** Adds a new customization option item to a group.
* **Parameters:**
  - `modname` -- string mod identifier.
  - `category` -- `LEVELCATEGORY` enum.
  - `group` -- string group name (optional, if nil adds to misc).
  - `name` -- string option name.
  - `itemsettings` -- table containing value, image, desc, etc.
* **Returns:** None
* **Error states:** None (silently returns if item already exists).

### `RemoveCustomizeItem(modname, category, name)`
* **Description:** Removes a mod-registered item or disables a default item for a mod.
* **Parameters:**
  - `modname` -- string mod identifier.
  - `category` -- `LEVELCATEGORY` enum.
  - `name` -- string option name.
* **Returns:** None
* **Error states:** None.

### `GetDescription(description)`
* **Description:** Returns a deep copy of a predefined description table by key.
* **Parameters:**
  - `description` -- string key (e.g., `"frequency_descriptions"`).
* **Returns:** Table copy or nil.
* **Error states:** None.

### `ClearModData(modname)`
* **Description:** Clears all customization data registered by a specific mod.
* **Parameters:**
  - `modname` -- string mod identifier or nil to clear all mods.
* **Returns:** None
* **Error states:** None.

## Events & listeners
None.