---
id: retrofit_savedata
title: Retrofit Savedata
description: A utility module that applies worldgen retrofits to saved game data, updating legacy maps with new content and mechanics introduced in the Return of Them, Waterlogged, and other DLC updates.
tags: [world, retrofit, worldgen, save, network]
sidebar_position: 10
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: fadfacd3
---
# Retrofit Savedata

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This module provides a single public function, `DoRetrofitting`, which applies optional legacy-world retrofits to `savedata` and the associated `world_map`. It is used when loading older saves to inject content and mechanics introduced in post-launch updates—such as the Return of Them, Waterlogged, Moon Quay, and Junk Yard DLCs—without breaking existing save compatibility. The retrofits are applied only once per save (flags are cleared after execution) and typically update tile maps, populate layouts (e.g., brine pools), or regenerate internal data structures like node ID tile maps.

## Usage example

The function is called internally by the game when loading a world with legacy save flags. For debugging or mod testing, it can be invoked manually as follows:

```lua
local retrofit_savedata = require("map/retrofit_savedata")
retrofit_savedata.DoRetrofitting(savedata, TheWorld.Map)
```

Where `savedata` is a valid world save data table (e.g., from `WorldGenManager:GetSavedData()`), and `TheWorld.Map` is the active world map instance.

## Dependencies & tags
**Components used:** None. This module is purely functional and does not rely on entity components or tags.

**Tags:** None. The module operates on raw world and entity data.

## Properties
None. This module exports only a single function and contains no persistent state or instance properties.

## Main functions

### `DoRetrofitting(savedata, world_map)`
* **Description:** Applies conditional retrofits to the world based on flags present in `savedata`. Each flag triggers a specific retrofit function, modifies `savedata.ents`, updates `world_map` tiles, and regenerates encoded map data. After applying a retrofit, the corresponding flag is removed from `savedata` to prevent repeated execution. If any retrofits are applied, `savedata.map.tiles` and `savedata.map.nodeidtilemap` are refreshed from `world_map`.
* **Parameters:**
  - `savedata` (table): The world save data table. Must contain optional boolean keys like `"retrofit_oceantiles"` to indicate pending retrofits. Keys are removed after execution.
  - `world_map` (WorldMap): The in-memory world map instance. Used for tile queries, layout placement, and encoding.
* **Returns:** `nil`. Side effects only.
* **Error states:** Assumes `savedata.map` and `savedata.ents` exist. If a required dependency (e.g., `require("map/...")`) fails or tiles exceed map bounds, errors may be raised by underlying functions (e.g., ` layouts.Place`, `world_map:RepopulateNodeIdTileMap`). No internal error handling is present.

## Events & listeners
None. This module does not register or dispatch events.

