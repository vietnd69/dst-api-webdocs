---
id: groundcreepdefs
title: Groundcreepdefs
description: Registers a ground creep asset type (web) with the TileManager system for use in world tile generation.
tags: [world, environment, tile, asset]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 156b1523
system_scope: world
---

# Groundcreepdefs

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`groundcreepdefs.lua` defines and registers a ground creep asset named `"web"` with the `TileManager` system. It does not implement a traditional ECS component; instead, it serves as a static asset definition used during world generation to populate the environment with visually and functionally distinct ground cover (specifically spider web-like terrain features).

This file operates at a higher level of abstraction than typical components—it shapes the world geometry and aesthetics by registering naming and texture metadata that `TileManager` consumes during tile generation.

## Usage example
This file is loaded automatically as part of the game's initialization and does not require manual instantiation. Modders extending ground creep support would add similar `TileManager.AddGroundCreep(...)` calls elsewhere (e.g., in a mod’s main `.lua` file).

## Dependencies & tags
**Components used:** None  
**Tags:** None  
**External dependency:** `tilemanager.lua` (`TileManager` namespace)

## Properties
No public properties are defined. This is a configuration script, not a class with stateful properties.

## Main functions
### `TileManager.AddGroundCreep(id, definition)`
*   **Description:** Registers a new ground creep type with the `TileManager` so it can be used in tile layout definitions and world generation. In this case, it registers the `"web"` creep under the identifier `GROUND_CREEP_IDS.WEBCREEP`.
*   **Parameters:**  
    `id` — A unique identifier (typically from `GROUND_CREEP_IDS`, a global enum) used to reference this creep elsewhere in tile layouts.  
    `definition` (table) — Configuration object containing:  
    &nbsp;&nbsp;• `name` (string): internal name for logging/identification  
    &nbsp;&nbsp;• `noise_texture` (string): filename stem for the noise texture asset (e.g., `"web_noise"` → `"web_noise.tex"`)
*   **Returns:** Nothing (void).
*   **Error states:** May assert or fail at load time if the specified texture file is missing or if `id` conflicts with an existing ground creep registration.

## Events & listeners
Not applicable. This is a one-time registration script with no runtime event handling.
