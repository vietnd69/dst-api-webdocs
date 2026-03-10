---
id: falloffdefs
title: Falloffdefs
description: Registers specific falloff texture definitions for different tile types using the TileManager.
tags: [world, rendering, tiles]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 8b790b76
system_scope: world
---

# Falloffdefs

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`falloffdefs.lua` defines and registers distinct falloff texture configurations for various tile groups via `TileManager.AddFalloffTexture`. These definitions control how textures visually fade at tile edges (e.g., for water, docks, or invisible terrain), ensuring smooth transitions and appropriate rendering behavior across different terrain types in the world. The script uses pre-defined `FALLOFF_IDS` constants and `TileGroups` to specify which tiles need falloff and how they interact with neighboring tiles.

## Usage example
This file is loaded automatically during world initialization and does not require manual instantiation. Modders register new falloff types by calling `TileManager.AddFalloffTexture` with a unique ID and configuration table (as demonstrated in the source), typically from a custom mod script that imports `tilemanager`.

## Dependencies & tags
**Components used:** `TileManager` (via `require("tilemanager")`)
**Tags:** None identified.

## Properties
No public properties. This is a top-level script that executes during load to configure `TileManager`.

## Main functions
None. This file contains only module-level function calls (`TileManager.AddFalloffTexture`) and flag toggling (`mod_protect_TileManager`), not reusable methods.

## Events & listeners
None.