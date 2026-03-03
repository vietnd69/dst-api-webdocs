---
id: skeleton_night_hunter
title: Skeleton Night Hunter
description: A static layout configuration for the Skeleton Night Hunter event, defining the placement of loot items and character references in a 12x12 tile area.
tags: [event, loot, static_layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 6cfb513b
system_scope: world
---

# Skeleton Night Hunter

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`Skeleton Night Hunter` is a static map layout file in Tiled JSON format, used to define the spatial configuration for the Skeleton Night Hunter event in Don't Starve Together. It specifies a fixed 12×12 grid with a background tile layer and an object layer (`FG_OBJECTS`) that marks placeholder positions for in-game entities and loot: `skeleton`, `nightstick`, `molehat`, and `armorwood`. These serve as coordinates for procedural generation logic to spawn relevant prefabs during the event.

This file is not a component or Lua class; it is a data file used at runtime by world generation systems to position elements for the Skeleton Night Hunter event. It does not contain executable logic, event handlers, or class definitions.

## Usage example
This file is not used directly by modders. It is consumed internally by DST's map generation system when loading the `skeleton_night_hunter` layout during event initialization (e.g., in `events/lava_arena.lua` or similar).

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
No public functions.

## Events & listeners
Not applicable.

## See also
- `map/events/lava_arena.lua`
- `map/static_layouts/` directory for other static layout definitions.