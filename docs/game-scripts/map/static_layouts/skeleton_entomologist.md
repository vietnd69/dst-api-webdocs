---
id: skeleton_entomologist
title: Skeleton Entomologist
description: A static map layout defining the layout and object placement for the Skeleton Entomologist room in the Caves.
tags: [room, map, static, layout, decoration]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 68d587bd
system_scope: world
---

# Skeleton Entomologist

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static room layout used in the Caves world generation. Specifically, it represents the *Skeleton Entomologist* room — a themed environmental encounter area containing decorative and functional in-game objects (such as bees, stingers, and blueprints) placed at fixed coordinates. It is not an ECS component but a map layout definition in Tiled-compatible Lua format used by the worldgen system.

## Usage example
This file is not directly instantiated or used by modders in gameplay code. It is automatically loaded and processed by the world generation system when building the Caves map. Modders interested in modifying or overriding this room should reference `map/levels/caves.lua` or define custom static layouts.

```lua
-- Not applicable: This is a static map data file, not a modder-facing API.
-- Changes are made via level/task overrides or custom static_layouts definitions.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this is a Lua table representing static map data, not a component class.

## Main functions
No functional methods are defined — this file is pure data with no executable logic.

## Events & listeners
Not applicable — no event handling is present in this file.