---
id: customize
title: Customize
description: Central registry and API for world generation and world settings customization options used by the sandbox menu and world configuration systems.
tags: [world, configuration, ui, modding]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 1e36626c
---

# Customize

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `customize.lua` module serves as the backend registry for all world generation and world settings customization options in Don't Starve Together. It defines structured metadata for options such as "hounds frequency", "season length", "starting items", and many others. These options are consumed by the sandbox menu UI and world configuration logic to present and enforce user choices when creating or editing a world.

The module does not operate on a per-entity basis. Instead, it is a shared data store and query engine used by the server and client to configure world behavior at creation time. It interacts with `Levels`, `tasksets`, `tasks`, `startlocations`, and `worldsettings_overrides.lua` to enforce structure, validation, and mod compatibility.

## Usage example

This component is not intended to be attached to entities. Instead, mods or game code interact with its exported API to register or query options.

```lua
-- Example: Register a new world generation customization option via mod code
local Customize = require("map/customize")

-- Define a new group (optional)
Customize.AddCustomizeGroup(
    "mymod",                        -- modname
    "worldgen",                     -- category (LEVELCATEGORY.WORLDGEN or LEVELCATEGORY.SETTINGS)
    "my_custom_group",              -- group name
    STRINGS.UI.SANDBOXMENU.MY_GROUP_LABEL,
    nil,                            -- description (nil = use default)
    "images/my_custom_group.xml",   -- atlas
    10                              -- order
)

-- Register a new option under that group
Customize.AddCustomizeItem(
    "mymod",
    "worldgen",
    "my_custom_group",
    "my_custom_option",
    {
        value = "default",
        image = "my_custom_option.tex",
        desc = { -- custom description list
            { text = "Never", data = "never" },
            { text = "Default", data = "default" },
        },
        world = { "forest", "cave" }
    }
)

-- Later, query option metadata
local option = Customize.GetOption("my_custom_option")
if option then
    print("Default value:", option.value)
end
```

## Dependencies & tags

**Components used:** None. This is a pure data and API module with no component instances.

**Tags:** None identified.

## Properties

No properties are initialized as instance variables because this is not a component. Instead, it exports a set of public functions and precomputed data tables.

## Main functions

### `GetOption(option_name)`
* **Description:** Retrieves metadata for a customization option by its key name (e.g., `"hounds"`, `"season_start"`).
* **Parameters:**  
  `option_name` (`string`) — The internal key name of the option.
* **Returns:**  
  `table` — Option metadata table (includes `name`, `value`, `desc`, `world`, `order`, `group`, etc.) or `nil` if not found (including if disabled).
* **Error states:** Returns `nil` if the option is disabled by a mod or not registered.

### `GetOptions(location, is_master_world)`
* **Description:** Returns a list of all customization options available for a given location (e.g., `"forest"`, `"cave"`) and world type. Filters by `world` key and `master_controlled` flag.
* **Parameters:**  
  `location` (`string?`) — The world location name. `nil` means no location filtering.  
  `is_master_world` (`boolean`) — If true, includes master-controlled options; otherwise excludes them.
* **Returns:**  
  `table` — Array of option summaries, each containing `{name = "…", options = [...], default = "…", group = "…"}`.

### `AddCustomizeItem(modname, category, group, name, itemsettings)`
* **Description:** Registers a new customization option from a mod. Valid only during mod initialization; duplicate keys are silently ignored.
* **Parameters:**  
  `modname` (`string`) — Mod identifier.  
  `category` (`string`) — `"worldgen"` or `"settings"` (`LEVELCATEGORY.WORLDGEN` / `LEVELCATEGORY.SETTINGS`).  
  `group` (`string?`) — Existing group name to attach to, or `nil` to add as a misc option.  
  `name` (`string`) — Unique option key.  
  `itemsettings` (`table`) — Configuration: `value`, `image`, `desc`, `world`, `order`, etc.
* **Returns:** `nil`.

### `RemoveCustomizeItem(modname, category, name)`
* **Description:** Removes or disables a customization option. If `modname` matches the option’s mod, the option is removed entirely. Otherwise, it is disabled for that mod only.
* **Parameters:**  
  `modname` (`string`) — Mod identifier.  
  `category` (`string`) — `"worldgen"` or `"settings"`.  
  `name` (`string`) — Option key to remove/disable.
* **Returns:** `nil`.

### `ValidateOption(option_name, option_value, location)`
* **Description:** Checks whether `option_value` is a valid value for `option_name` at the given `location`, based on the option’s `desc` list.
* **Parameters:**  
  `option_name` (`string`)  
  `option_value` (`string`)  
  `location` (`string?`)
* **Returns:**  
  `boolean` — `true` if the value is valid; `false` otherwise.

### `GetDescription(description_name)`
* **Description:** Returns a deep copy of a predefined description list (e.g., `"frequency_descriptions"`, `"day_descriptions"`).
* **Parameters:**  
  `description_name` (`string`) — Key of the description list to retrieve.
* **Returns:**  
  `table` — Array of `{text = "Label", data = "value"}` tables, or `nil` if not found.

### `ClearModData(modname)`
* **Description:** Removes all customization data associated with a specific mod, including groups and items. If `modname` is `nil`, clears all mod-added data.
* **Parameters:**  
  `modname` (`string?`)
* **Returns:** `nil`.

## Events & listeners

None. This module does not use event-based interactions. It is entirely static data with getter/setter functions.