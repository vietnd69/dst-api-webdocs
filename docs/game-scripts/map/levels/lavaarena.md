---
id: lavaarena
title: Lavaarena
description: Defines registration data for the Lava Arena event level, including world generation overrides and settings presets.
tags: [map, event, configuration, worldgen]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: map
source_hash: c7921ecb
system_scope: world
---

# Lavaarena

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`lavaarena.lua` registers the Lava Arena event level with the map system using `AddLevel`, `AddWorldGenLevel`, and `AddSettingsPreset`. It defines specific world generation overrides that disable standard features like boons, traps, and touchstones to enforce the event's unique gameplay rules. This file is executed during map initialization to ensure the level type is available for selection in customization screens. It references global string tables for localization and the `LEVELTYPE` enum for identification.

## Usage example
```lua
-- Requires the file to register the level with the map system (side effect)
require "map/levels/lavaarena"

-- The level is now available in LEVELTYPE enum
print(LEVELTYPE.LAVAARENA)

-- Access localization strings defined in the registration
print(STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELS.LAVAARENA)
```

## Dependencies & tags
**External dependencies:**
- `LEVELTYPE` -- Enum used to identify the level type during registration.
- `STRINGS` -- Global localization table used for level name and description.
- `AddLevel` -- Global function to register level data.
- `AddWorldGenLevel` -- Global function to register world generation settings.
- `AddSettingsPreset` -- Global function to register settings presets.

**Components used:** None identified

**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `Level Config Table` | table | --- | Structure passed to `AddLevel`, `AddWorldGenLevel`, and `AddSettingsPreset` functions. |
| `id` | string | --- | Unique identifier for the level, typically matching the level type enum (e.g., `"LAVAARENA"`). |
| `name` | string | --- | Localization key for the level name displayed in UI (e.g., `STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELS.LAVAARENA`). |
| `desc` | string | --- | Localization key for the level description displayed in UI (e.g., `STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELDESC.LAVAARENA`). |
| `location` | string | --- | Prefab name associated with the level location (e.g., `"lavaarena"`). |
| `version` | number | --- | Version number of the level configuration; used for migration or validation. |
| `overrides` | table | --- | Table of world generation settings forced to specific values for this level. |
| `overrides.boons` | string | --- | Setting for boons generation; set to `"never"` for this event. |
| `overrides.touchstone` | string | --- | Setting for touchstone generation; set to `"never"` for this event. |
| `overrides.traps` | string | --- | Setting for trap generation; set to `"never"` for this event. |
| `overrides.poi` | string | --- | Setting for points of interest generation; set to `"never"` for this event. |
| `overrides.protected` | string | --- | Setting for protected status; set to `"never"` for this event. |
| `background_node_range` | table | --- | Array defining the range of background nodes used for this level (e.g., `{0, 1}`). |

## Main functions
None identified. This file executes registration calls rather than defining exportable functions.

## Events & listeners
None identified. This file does not listen for or push any events.