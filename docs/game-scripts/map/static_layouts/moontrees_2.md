---
id: moontrees_2
title: Moontrees 2
description: Static layout definition for moon tree placements and terrain regions in a moon-themed world room.
tags: [worldgen, layout, static, environment]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: ffcd72f0
system_scope: world
---

# Moontrees 2

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static room layout (`moontrees_2.lua`) used in world generation. It specifies map geometry, tile layers, and object placement data in Tiled Map Editor format. It does not implement an ECS component — instead, it provides metadata for the world generator to place moon trees and environmental features during map construction. The layout includes `tilelayer` data for background tiles and an `objectgroup` layer (`FG_OBJECTS`) that defines placement zones for moon trees and fissures.

## Usage example
This file is not used directly by modders at runtime. Instead, it is consumed by the world generation system via `map/levels/caves.lua` or equivalent level/task definitions. Modders can reference or replace this file when designing custom caves or moon-related rooms.

```lua
-- Not applicable — this file is a data definition, not a component.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
Not applicable — this is a static data file returning a table, not a component with runtime functions.

## Events & listeners
Not applicable