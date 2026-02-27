---
id: caves
title: Caves
description: Registers and configures cave-level world generation presets and settings for the Caves dimension in Don't Starve Together, including default, enhanced (Cave Plus), and Terraria-style variants.
tags: [worldgen, level, configuration]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: d3d0dafd
---

# Caves

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file registers predefined Caves-level configurations used in world generation and game settings menus. It defines three preset levels—`DST_CAVE`, `DST_CAVE_PLUS`, and `TERRARIA_CAVE`—each with specific resource and mob density overrides. These presets are registered via `AddLevel`, `AddWorldGenLevel`, and `AddSettingsPreset` for use across survival mode world creation and in-game settings UI.

Each preset specifies a `location` (`"cave"`), `version` (`4`), `name`, `desc`, and `overrides` (resource/mob spawn frequencies) that modify world generation behavior. The `background_node_range` is consistently set to `{0,1}`, indicating default background node usage.

## Usage example
```lua
-- Registering a custom cave preset with elevated wormlight density
AddLevel(LEVELTYPE.SURVIVAL, {
    id = "MY_CAVE_PRESET",
    name = STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELS.MY_CAVE_PRESET,
    desc = STRINGS.UI.CUSTOMIZATIONSCREEN.PRESETLEVELDESC.MY_CAVE_PRESET,
    location = "cave",
    version = 4,
    overrides = {
        wormlights = "often",
        bats_setting = "common",
        cave_spiders = "rare",
    },
    background_node_range = {0,1},
})
```

## Dependencies & tags
**Components used:** None — this script does not interact with components directly.  
**Tags:** None identified.

## Properties
No public properties or state variables are defined in this file. All configuration data is embedded in inline table arguments passed to registration functions.

## Main functions
No custom functions are defined in this file. All logic resides in external registration calls.

## Events & listeners
No event listeners or event pushes are present in this file.