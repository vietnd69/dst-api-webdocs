---
id: worldentities
title: Worldentities
description: Provides a utility function to ensure required world-level entities (e.g., pocket dimension containers) are initialized during world save load.
tags: [world, save, initialization]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 4f6ff708
system_scope: world
---

# Worldentities

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Worldentities` is a simple utility module that ensures essential world-scoped entities—specifically pocket dimension containers—are present and properly initialized for every world and shard before entity instantiation occurs during world load. It operates on the raw save data table (`savedata.ents`) and guarantees at least one instance of each required prefab type exists by inserting placeholder position data (`{x=0,z=0}`) if none is found.

## Usage example
```lua
local worldentities = require("worldentities")
-- During world load, after loading savedata but before entity spawning:
worldentities.AddWorldEntities(savedata)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `AddWorldEntities(savedata)`
*   **Description:** Ensures that all required pocket dimension container prefabs defined in `prefabs/pocketdimensioncontainer_defs.lua` have at least one entry in `savedata.ents`. If an entry is missing, it creates a placeholder position (`{x=0,z=0}`) to allow the save system to instantiate it later.
*   **Parameters:** `savedata` (table) — The world save data table, expected to contain an `ents` key mapping prefab names to arrays of entity spawn data.
*   **Returns:** Nothing.
*   **Error states:** None documented. Assumes `savedata.ents` is a valid table and that `POCKETDIMENSIONCONTAINER_DEFS` is properly loaded.

## Events & listeners
None identified.