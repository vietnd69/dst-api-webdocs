---
id: forest
title: Forest
description: Defines all forest world generation presets, settings, and playstyle configurations for Don't Starve Together survival mode.
tags: [map, worldgen, preset, configuration]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: map
source_hash: ed26673c
system_scope: world
---

# Forest

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`forest.lua` is a data configuration file that registers all forest world generation presets, settings presets, and playstyle definitions for Don't Starve Together. It defines multiple game modes including Survival, Endless, RelaxED, Wilderness, Lights Out, and Classic variants. Each preset specifies world generation overrides, required set pieces, random set piece pools, and playstyle-specific rules. This file is loaded during world initialization and is not a component — it registers configuration data that the world generation system consumes.

## Usage example
```lua
-- This file is auto-loaded by the game; modders reference presets by ID
-- Example: accessing preset data through world generation APIs
local preset_id = "SURVIVAL_TOGETHER"
local playstyle_id = "endless"

-- Modders can create custom presets using the same registration functions:
AddWorldGenLevel(LEVELTYPE.SURVIVAL, {
    id = "MY_CUSTOM_PRESET",
    name = "My Custom World",
    location = "forest",
    version = 4,
    overrides = {
        season_start = "spring",
        bees = "never",
    },
})

AddPlaystyleDef({
    id = "my_playstyle",
    default_preset = "MY_CUSTOM_PRESET",
    location = "forest",
    priority = 100,
})
```

## Dependencies & tags
**External dependencies:**
- `STRINGS` -- localization strings for preset names and descriptions (STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELS, PRESETLEVELDESC)
- `IsConsole()` -- platform detection function to differentiate console vs PC presets
- `deepcopy()` -- utility function to clone existing preset tables
- `AddLevel()` -- registers a level preset for the customization screen
- `AddWorldGenLevel()` -- registers a world generation configuration
- `AddSettingsPreset()` -- registers a settings preset with world overrides
- `AddPlaystyleDef()` -- registers a playstyle definition with UI assets
- `LEVELTYPE.SURVIVAL` -- constant identifying survival game mode
- `PLAYSTYLE_DEFAULT` -- constant for default playstyle reference

**Components used:** None identified

**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` | string | — | Unique identifier for the preset (e.g., `"SURVIVAL_TOGETHER"`, `"ENDLESS"`). |
| `name` | string | — | Display name from STRINGS table shown in UI. |
| `desc` | string | — | Description from STRINGS table shown in UI. |
| `location` | string | — | Map location type; all presets in this file use `"forest"`. |
| `version` | number | — | Preset version number for migration and compatibility. |
| `overrides` | table | `{}` | Table of world generation override key-value pairs. |
| `required_setpieces` | table | — | Array of set piece names that must spawn in the world. |
| `random_set_pieces` | table | — | Pool of set pieces to randomly select from for `numrandom_set_pieces`. |
| `numrandom_set_pieces` | number | — | Number of set pieces to randomly place from the pool. |
| `playstyle` | string | — | Playstyle category (e.g., `"survival"`, `"endless"`, `"relaxed"`). |
| `hideinfrontend` | boolean | — | If `true`, hides preset from UI selection (used for fallback presets). |
| `is_default` | boolean | — | Marks this playstyle as the default selection. |
| `priority` | number | — | UI sort order for playstyles; higher values appear first. |
| `image.atlas` | string | — | Texture atlas path for playstyle icon. |
| `image.icon` | string | — | Texture name within atlas for playstyle icon. |
| `smallimage.atlas` | string | — | Texture atlas path for small playstyle icon. |
| `smallimage.icon` | string | — | Texture name within atlas for small playstyle icon. |

## Main functions
### `AddLevel(leveltype, leveldata)`
* **Description:** Registers a level preset for the customization screen. Used for legacy preset registration.
* **Parameters:**
  - `leveltype` -- LEVELTYPE constant (e.g., `LEVELTYPE.SURVIVAL`)
  - `leveldata` -- table containing `id`, `name`, `desc`, `location`, `version`, `overrides`, `required_setpieces`, `random_set_pieces`, `numrandom_set_pieces`
* **Returns:** None
* **Error states:** None

### `AddWorldGenLevel(leveltype, worldgendata)`
* **Description:** Registers a world generation configuration that defines map layout, set pieces, and resource overrides.
* **Parameters:**
  - `leveltype` -- LEVELTYPE constant (e.g., `LEVELTYPE.SURVIVAL`)
  - `worldgendata` -- table containing `id`, `name`, `desc`, `location`, `version`, `overrides`, `required_setpieces`, `random_set_pieces`, `numrandom_set_pieces`, optionally `hideinfrontend`
* **Returns:** None
* **Error states:** None

### `AddSettingsPreset(leveltype, settingsdata)`
* **Description:** Registers a settings preset that defines world overrides for gameplay rules (seasons, monsters, resources).
* **Parameters:**
  - `leveltype` -- LEVELTYPE constant (e.g., `LEVELTYPE.SURVIVAL`)
  - `settingsdata` -- table containing `id`, `name`, `desc`, `location`, `playstyle`, `version`, `overrides`, optionally `hideinfrontend`
* **Returns:** None
* **Error states:** None

### `AddPlaystyleDef(playstyledata)`
* **Description:** Registers a playstyle definition that appears in the server creation UI with icons and default preset mapping.
* **Parameters:**
  - `playstyledata` -- table containing `id`, `default_preset`, `location`, `name`, `desc`, `image`, `smallimage`, `priority`, `overrides`, optionally `is_default`
* **Returns:** None
* **Error states:** None

## Registered Presets
The following presets are defined in this file:

| Preset ID | Playstyle | Visible in UI | Description |
|-----------|-----------|---------------|-------------|
| `SURVIVAL_TOGETHER` | survival | Yes | Default survival mode with standard settings. |
| `SURVIVAL_TOGETHER_CLASSIC` | default | No | Classic mode with no seasons and reduced monsters. |
| `SURVIVAL_DEFAULT_PLUS` | default | Yes | Enhanced default with more boons and spiders (PC) or reduced resources (console). |
| `COMPLETE_DARKNESS` | lightsout | No | Deprecated alias for LIGHTS_OUT; kept for old save compatibility. |
| `RELAXED` | relaxed | Yes | Non-lethal mode with reduced penalties and always-on resurrection. |
| `ENDLESS` | endless | Yes | Endless mode with always-on resurrection and resource regrowth. |
| `WILDERNESS` | wilderness | Yes | Scattered spawn mode with no ghost players allowed. |
| `LIGHTS_OUT` | lightsout | Yes | Permanent night mode starting in darkness. |
| `TERRARIA` | default | Yes | Spring start with aggressive bees and wasps, no normal bees. |
| `MOD_MISSING` | various | No | Fallback preset when mod-defined presets are unavailable. |

## Events & listeners
None.