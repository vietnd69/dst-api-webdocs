---
id: skeleton_batfight
title: Skeleton Batfight
description: A static map layout describing the skeleton batfight arena scene configuration, including placement markers for entities like skeletons, bats, and guano.
tags: [map, layout, scene]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: c00a668e
system_scope: world
---

# Skeleton Batfight

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`Skeleton Batfight` is a static map layout file used to define the world configuration for the skeleton batfight arena. It is a Tiled map data file (in Lua table format) containing tile layer and object group definitions. The object group `FG_OBJECTS` specifies placement locations and types for in-game entities such as `skeleton`, `bat`, `batbat`, `guano`, and `batwing`. This layout is consumed by the world generation system to position these prefabs during arena initialization.

## Usage example
This file is not used as a component in the ECS. It is loaded and parsed as map data by the world generation system (e.g., via `ArchiveWorldGen` or `StaticLayout` utilities). Example usage in a worldgen context is not possible directly in mod code — it is referenced via `tasksets` or `static_layouts` loaders.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file is a pure data structure returning a Lua table describing map layout.

## Main functions
None identified — this file defines only a static data table and contains no functions.

## Events & listeners
None identified — no event interaction.