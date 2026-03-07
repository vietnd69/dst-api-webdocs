---
id: canopyshadows
title: Canopyshadows
description: Utility module for spawning and managing leaf canopy shadows in the world.
tags: [world, environment, fx]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1914dc72
system_scope: world
---

# Canopyshadows

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`Canopyshadows` is a lightweight utility module (not an ECS component) that provides a single function, `spawnshadow`, to procedurally generate canopy-related visual effects in the game world. It manages shared global state for shadow tile tracking and canopy/spawn coordination. It is used during world generation or dynamic environmental setup to populate shadow visuals over a circular area centered on a given position.

## Usage example
```lua
local canopy = require "prefabs/canopyshadows"
local range = 5
local no_lightrays = false

local shadow_data = canopy.spawnshadow(inst, range, no_lightrays)
-- shadow_data contains references to spawned entities for cleanup or updates
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  

## Properties
No public properties. This module only exports a function.

## Main functions
### `spawnshadow(inst, range, no_lightrays)`
*   **Description:** Spawns leaf canopy entities and/or lightrays in a circular region around the entity's position. Tracks tile usage via global `TheWorld.shadetiles` to avoid duplicate spawns and supports stacking (incrementing tile counts). Returns metadata including spawned entities and tile keys.
*   **Parameters:**  
    - `inst` (Entity) – The entity whose world position serves as the center of the shadow region.  
    - `range` (number) – The radius (in grid units of 4 tiles) over which to spawn effects.  
    - `no_lightrays` (boolean) – If `true`, lightray prefabs are not spawned; otherwise, they may spawn with 50% probability per tile where no canopy was placed.
*   **Returns:**  
    - `data` (table) with keys:  
        - `lightrays` (array of entities) – Spawns of `"lightrays_canopy"`.  
        - `shadetile_keys` (array of strings) – Tile identifiers (`"x-z"`) that were processed.
*   **Error states:** Returns `nil` implicitly if no tiles are processed, though the loop always covers a non-empty circular region for `range >= 0`.

## Events & listeners
None. This module performs synchronous world modifications and does not use event listeners or dispatch events.