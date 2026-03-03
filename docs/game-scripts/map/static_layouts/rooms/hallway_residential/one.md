---
id: one
title: One
description: Defines the layout structure of a residential hallway room using Tiled map data for world generation.
tags: [room, worldgen, layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: d6a65f8e
system_scope: world
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file describes a static room layout for use in DST's world generation system. It is a Tiled map JSON-compatible Lua table defining a `32x32` tile grid (with `16x16` tiles) containing background tile data for a residential hallway. The room includes a tile layer (`BG_TILES`) populated with repeated floor/wall patterns (tiles `22` and `29`) at regular intervals, and an empty object layer (`FG_OBJECTS`) for foreground entities. It belongs to the `hallway_residential` room family and is likely one of several variants (hence the `one` filename).

## Usage example
This file is not instantiated as a component. It is referenced directly by the world generation system as a static layout asset. Modders load such files via `require("map/static_layouts/rooms/hallway_residential/one")` to inspect or override room definitions.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file returns a configuration table with top-level fields used by DST's map loading logic.

## Main functions
Not applicable

## Events & listeners
Not applicable