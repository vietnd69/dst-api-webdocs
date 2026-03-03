---
id: resurrectionstonelit
title: Resurrectionstonelit
description: Defines a static-layout map configuration for the resurrection stone stage with specific tile layer and object placement data.
tags: [map, layout, worldgen]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: a93a34cf
system_scope: world
---

# Resurrectionstonelit

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`resurrectionstonelit` is a static map layout definition used by DST's world generation system to place the Resurrection Stone stage environment. It specifies the tile layout (`BG_TILES`), object placement (`FG_OBJECTS`), and their positions within an 8x8 tile grid. Each object entry declares a type (e.g., `"resurrectionstone"`, `"pighead"`, `"maxwelllight_area"`) and spatial coordinates in pixels (relative to the 16×16 grid cell size). This file is not a component but a data definition used to instantiate the level during world generation.

## Usage example
This file is loaded internally by DST's worldgen system and is not directly instantiated by modders. It is referenced via tasksets or scenarios (e.g., in `map/tasksets/caves.lua` or `scenarios/archive_cookpot.lua`) that require the Resurrection Stone layout. Modders would not call functions in this file directly.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a pure data definition (Lua table literal) rather than an entity component.

## Main functions
Not applicable.

## Events & listeners
Not applicable.