---
id: deerspawningground
title: Deerspawningground
description: A non-networked entity tag registry that signals deer spawning locations to the world system.
tags: [spawn, location, world]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 60ae24cc
system_scope: world
---

# Deerspawningground

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`deerspawningground` is a minimal prefab definition used to mark specific locations in the world where deer are eligible to spawn. It is instantiated as a non-networked, tag-registered entity that does not participate in gameplay logic directly but serves as a signal to the world generation and spawn systems via the `ms_registerdeerspawningground` event.

## Usage example
```lua
-- Typically used internally by world generation systems:
-- This prefab is not manually instantiated by mods.
-- It is placed by level/room/task systems (e.g., in static layouts or grotto rooms).
local ground = SpawnPrefab("deerspawningground")
ground.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** `deerspawningground`, `NOBLOCK`, `NOCLICK`

## Properties
No public properties

## Main functions
No custom functions defined — the prefab uses only a default `fn()` constructor.

## Events & listeners
- **Pushes:** `ms_registerdeerspawningground` — fired once during instantiation to register the entity as a valid deer spawn location. The entity (`inst`) is passed as the event payload.

