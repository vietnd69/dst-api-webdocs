---
id: spawnpoint_multiplayer
title: Spawnpoint Multiplayer
description: Creates networked spawnpoint entities used in multiplayer world generation, distinguishing between master and non-master spawnpoint instances.
tags: [world, multiplayer, entity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bef2a33a
system_scope: world
---

# Spawnpoint Multiplayer

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines two prefabs—`spawnpoint_multiplayer` and `spawnpoint_master`—that represent spawnpoint entities in DST's world generation system. These prefabs are used to mark valid spawn locations during world creation and are differentiated by whether they serve as the *master* spawnpoint (used in fixed spawn mode) or a *non-master* spawnpoint. The component adds a `CLASSIFIED` tag and registers itself globally via the `ms_registerspawnpoint` event.

## Usage example
```lua
-- Typically used internally by the world generation system
-- Example of how the prefabs are instantiated:
local spawnpoint = SpawnPrefab("spawnpoint_multiplayer")
local masterpoint = SpawnPrefab("spawnpoint_master")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `CLASSIFIED`

## Properties
No public properties

## Main functions
No public functions exposed on entities created by these prefabs.

## Events & listeners
- **Pushes:** `ms_registerspawnpoint` — fired on world root with the spawnpoint entity as the argument. Used by the world generation system to track and manage spawnpoints.