---
id: mudlights
title: Mudlights
description: A static map layout definition used to place cave flowers and background tiles in specific positions during world generation.
tags: [world, map, generation]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 0f6aa09d
system_scope: world
---

# Mudlights

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`mudlights.lua` is a static layout definition file used by DST's world generation system. It specifies tile placements and object positions for a particular map layout section — specifically, a subset of the underground environment where cave flowers (`flower_cave`) are placed at designated coordinates. It does not contain any ECS components, classes, or executable game logic. Instead, it is a JSON-like Lua table structure consumed by the Tiled map loader during world generation.

This file is not a component and is not added to entities. It defines layout metadata (tilemap data and object placements) rather than behavior.

## Usage example
Static layout files like this one are loaded automatically by the game during world generation, typically as part of room or task definitions. They are not instantiated directly in mod code.

```lua
-- Not applicable: This file is consumed by the engine during map generation.
-- It is referenced indirectly via level/task/room definitions.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a data-only definition file representing a Tiled map export.

## Main functions
Not applicable — this file exports a data table, not a class or component with functional methods.

## Events & listeners
Not applicable — no event handling or listeners are present.