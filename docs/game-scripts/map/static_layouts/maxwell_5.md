---
id: maxwell_5
title: Maxwell 5
description: Static map layout data for the Maxwell 5 level, defining tile placements and object positions for a custom level in DST.
tags: [world, level, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 0abcf0c0
system_scope: world
---

# Maxwell 5

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`maxwell_5.lua` defines a static map layout used for a specific level configuration in Don't Starve Together. It specifies the visual and spatial arrangement of background tiles, foreground objects (including statues, flower_evil, and a knight), and adheres to the Tiled Map Editor data format (orientation = orthogonal, tile-based grid). This file is consumed by the world generation system to instantiate the level geometry in-game. It contains no executable logic or components; it is a data definition used during level loading.

## Usage example
Static layout files like this one are not directly instantiated or used by modders at runtime. Instead, they are referenced in level/task definitions (e.g., in `map/tasksets/caves.lua` or via worldgen overrides) and processed by the engine's Tiled loader to generate the level background and place objects.

No direct component or function call is needed from modding code.

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.  

## Properties
No public properties — this file is a pure data export, returning a plain Lua table.

## Main functions
Not applicable.

## Events & listeners
Not applicable.