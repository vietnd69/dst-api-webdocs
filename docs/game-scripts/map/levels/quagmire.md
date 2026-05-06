---
id: quagmire
title: Quagmire
description: Defines the level configuration and generation presets for the Quagmire event map.
tags: [map, worldgen, event, configuration]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: map
source_hash: fb80463c
system_scope: world
---

# Quagmire

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`quagmire.lua` registers the Quagmire event level preset with the world generation system. It executes global registration functions (`AddLevel`, `AddWorldGenLevel`, `AddSettingsPreset`) during initialization to define level metadata, override settings, and background node ranges. This file does not return a table or define a class; it performs side effects to populate the level registry used by the map generation system.

## Usage example
```lua
-- This file is executed by the engine during initialization.
-- Modders typically do not require this file directly.
-- Below is the structure used to define a level preset:

AddLevel(LEVELTYPE.QUAGMIRE, {
    id = "QUAGMIRE",
    name = STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELS.QUAGMIRE,
    desc = STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELDESC.QUAGMIRE,
    location = "quagmire",
    version = 4,
    overrides = {
        boons = "never",
        wildfires = "never",
        -- ... other overrides
    },
    background_node_range = {0, 1},
})
```

## Dependencies & tags
**External dependencies:**
- `STRINGS` -- Used for localized level name and description text.
- `LEVELTYPE` -- Enum used to specify the level type (e.g., `LEVELTYPE.QUAGMIRE`).

**Components used:**
None identified

**Tags:**
None identified

## Properties
`<`!-- Configuration fields used in the registration tables passed to global functions. -->
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `LevelConfig` | table | --- | Conceptual table structure passed to registration functions (`AddLevel`, etc.). |
| `id` | string | --- | Unique identifier for the level preset (e.g., `"QUAGMIRE"`). |
| `name` | string | --- | Localized display name retrieved from `STRINGS`. |
| `desc` | string | --- | Localized description retrieved from `STRINGS`. |
| `location` | string | --- | Prefab name or identifier for the location type (e.g., `"quagmire"`). |
| `version` | number | --- | Version number of the level definition (e.g., `4` for levels, `1` for presets). |
| `overrides` | table | --- | Table of world generation override settings forcing specific rules. |
| `overrides.boons` | string | --- | Setting for boons generation (e.g., `"never"`). |
| `overrides.touchstone` | string | --- | Setting for touchstone generation (e.g., `"never"`). |
| `overrides.traps` | string | --- | Setting for trap generation (e.g., `"never"`). |
| `overrides.poi` | string | --- | Setting for points of interest generation (e.g., `"never"`). |
| `overrides.protected` | string | --- | Setting for protected area generation (e.g., `"never"`). |
| `overrides.disease_delay` | string | --- | Setting for disease spread delay (e.g., `"none"`). |
| `overrides.prefabswaps_start` | string | --- | Setting for initial prefab swaps (e.g., `"classic"`). |
| `overrides.petrification` | string | --- | Setting for petrification mechanics (e.g., `"none"`). |
| `overrides.wildfires` | string | --- | Setting for wildfire events (e.g., `"never"`). |
| `background_node_range` | table | --- | Array of two numbers defining the background node range (e.g., `{0, 1}`). |

## Main functions
`<`!-- This file calls global registration functions rather than defining local ones. -->

### `AddLevel(type, config)`
* **Description:** Global function called by this file to register a standard level definition.
* **Parameters:**
  - `type` -- Level type enum (e.g., `LEVELTYPE.QUAGMIRE`).
  - `config` -- Table containing level definition data (id, name, overrides, etc.).
* **Returns:** None (Global registration side effect).
* **Error states:** None.

### `AddWorldGenLevel(type, config)`
* **Description:** Global function called by this file to register a world generation level definition (deprecated/legacy variant in this file).
* **Parameters:**
  - `type` -- Level type enum.
  - `config` -- Table containing level definition data.
* **Returns:** None (Global registration side effect).
* **Error states:** None.

### `AddSettingsPreset(type, config)`
* **Description:** Global function called by this file to register a settings preset associated with the level.
* **Parameters:**
  - `type` -- Level type enum.
  - `config` -- Table containing preset data (id, name, overrides).
* **Returns:** None (Global registration side effect).
* **Error states:** None.

## Events & listeners
None.