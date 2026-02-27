---
id: lavaarena
title: Lavaarena
description: Registers the Lavaarena level configuration with the game's world generation and customization systems, defining its display strings, metadata, and feature restrictions.
tags: [level, worldgen, customization, boss]
last_updated: 2026-02-27
system_scope: world
---

# Lavaarena

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `lavaarena.lua` script registers the Lavaarena level as a configurable preset within the game's level and world generation systems. It does not define a component but instead calls top-level API functions (`AddLevel`, `AddWorldGenLevel`, `AddSettingsPreset`) to expose the level to the game's UI and worldgen infrastructure. This file serves as a declarative configuration entry point, associating internal level identifiers with user-facing strings and enabling/disabling specific world features for this level type.

## Usage example
This file is loaded automatically by the game during initialization and does not require manual instantiation. Modders intending to replicate or extend its behavior should use the same API calls:

```lua
AddLevel(LEVELTYPE.LAVAARENA, {
    id = "LAVAARENA",
    name = "Your Level Name",
    desc = "Your level description",
    location = "yourprefabname",
    version = 1,
    overrides = {
        boons = "never",
        touchstone = "never",
        traps = "never",
        poi = "never",
        protected = "never",
    },
    background_node_range = {0, 1},
})
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified.

## Properties
This file does not define a class or component; it performs direct API calls and contains no persistable state. Therefore, no properties are applicable.

## Main functions
No functions are defined in this script. It invokes the following core engine APIs:
- `AddLevel(leveltype, config)`  
- `AddWorldGenLevel(leveltype, config)`  
- `AddSettingsPreset(leveltype, config)`  

Each call supplies a configuration table with the following fields:

### `AddLevel` / `AddWorldGenLevel` / `AddSettingsPreset` configuration fields
* **Description:** Defines metadata and feature overrides for the Lavaarena level. This table is passed to one of the three registration functions to integrate the level into different contexts (customization screen, world generation, or preset loading).
* **Parameters:**
  * `id`: `string` — Unique internal identifier for the level (case-sensitive, matches the level type constant).
  * `name`: `string` — Localized display name, pulled from `STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELS.LAVAARENA`.
  * `desc`: `string` — Localized description, pulled from `STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELDESC.LAVAARENA`.
  * `location`: `string` — Name of the prefab that holds the level's layout data (`"lavaarena"`).
  * `version`: `number` — Version number for manual update tracking (e.g., `4` for `AddLevel`, `1` for `AddSettingsPreset`).
  * `overrides`: `table` — Key-value map of world feature restrictions. All entries are set to `"never"` in this level, disabling boons, touchstones, traps, points of interest, and protected zones.
  * `background_node_range`: `table of two numbers` — Specifies the range of nodes used for background rendering (`{0, 1}`).
* **Returns:** None. These functions register configuration globally and do not return values.
* **Error states:** Misconfiguration (e.g., missing `id`, `location`, or invalid `version`) may cause silent failure or level not appearing in the UI. No explicit error checks are performed by this script.

## Events & listeners
No events or listeners are registered by this file.