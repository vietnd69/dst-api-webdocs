---
id: forest
title: Forest
description: Defines preset configurations for the forest level in Don't Starve Together, including world generation overrides and playstyle settings.
tags: [world, level, preset]
sidebar_position: 1
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: b4d9df82
---
# Forest

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This file defines world preset configurations for the Forest level in Don't Starve Together. It registers multiple preset definitions using `AddLevel`, `AddWorldGenLevel`, and `AddSettingsPreset`, as well as playstyle definitions via `AddPlaystyleDef`. Each preset specifies overridable world generation parameters (e.g., resource frequency, monster spawns, seasonal settings), required and optional setpieces (pre-built map layouts), and metadata (name, description, version). This file does not define a component in the Entity Component System; rather, it populates the world generation system with level presets. It serves as the authoritative source for level preset declarations used in game setup and server configuration.

## Usage example

This file does not expose a reusable component or API for direct instantiation. Instead, it is executed during game startup to register level presets. Modders may replicate its pattern to add new presets:

```lua
AddLevel(LEVELTYPE.SURVIVAL, {
    id = "MY_PRESET",
    name = "My Custom Preset",
    desc = "A custom survival experience.",
    location = "forest",
    version = 4,
    overrides = {
        season_start = "summer",
        hounds = "rare",
        -- additional overrides...
    },
    required_setpieces = { "Sculptures_1" },
    numrandom_set_pieces = 3,
    random_set_pieces = { "Chessy_1", "Maxwell1", "Warzone_1" },
})
```

## Dependencies & tags

**Components used:** None identified.  
**Tags:** None identified.  

This file operates at the level registration layer and does not interact with entity components, tags, or components directly.

## Properties

This file does not define a class or constructor and does not expose any properties. All data is structured in local tables passed to registration functions.

## Main functions

This file does not define any functions. It executes only top-level registration calls (`AddLevel`, `AddWorldGenLevel`, `AddSettingsPreset`, `AddPlaystyleDef`) using locally defined configuration tables.

## Events & listeners

This file does not define any event listeners or push any events. It operates synchronously during world generation initialization.

