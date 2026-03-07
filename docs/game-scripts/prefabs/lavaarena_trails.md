---
id: lavaarena_trails
title: Lavaarena Trails
description: Creates visual trail entities for lava arena mobs, with support for variation models and automatic mob tracking.
tags: [fx, environment, boss, mob]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 09397820
system_scope: fx
---

# Lavaarena Trails

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines prefabs for visual trail entities used in the Lava Arena event. Each trail is a non-interactive entity that renders specialized animations, sound effects, and dynamic shadowing to visually connect lava arena creatures to their spawn/teleport points. Trail prefabs are created for multiple visual variations and registered with the `lavaarenamobtracker` component for automatic cleanup when removed from the world.

## Usage example
```lua
-- The trail prefabs are automatically registered by the game when the Lava Arena event loads.
-- Modders should not instantiate them directly.
-- If needed, use the returned prefabs:
local trails_prefab = PrefabExists("trails")
local trails1_prefab = PrefabExists("trails1")
local trails2_prefab = PrefabExists("trails2")
```

## Dependencies & tags
**Components used:** `None` (prefab factory only; components are added via `entity:AddX()` in the construction function)
**Tags added:** `LA_mob`, `monster`, `hostile`, `largecreature`, `fossilizable`

## Properties
No public properties — this file is a prefab factory that returns ready-to-use prefab definitions.

## Main functions
Not applicable — this file does not expose procedural functions for runtime use.

## Events & listeners
- **Listens to:** None directly.
- **Pushes:** None directly.
- **Interacts with:** Registers each trail entity with `TheWorld.components.lavaarenamobtracker:StartTracking(inst)` during spawn to ensure proper tracking and cleanup.

