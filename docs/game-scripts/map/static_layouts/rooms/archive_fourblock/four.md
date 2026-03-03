---
id: four
title: Four
description: Provides map layout data for the archive_fourblock room, defining background tile patterns and foreground object placements for the four-block area.
tags: [map, room, static_layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: c369fc70
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout (`four.lua`) used in the `archive_fourblock` room. It encodes tilemap data for background tiles (`BG_TILES`) and object placements (`FG_OBJECTS`) in a format compatible with Tiled map editing tools. It does not implement any ECS component logic, nor does it define behaviors, components, or runtime entities; it is purely data used by the world generation system to construct rooms.

## Usage example
This file is not intended to be used directly by modders at runtime. It is consumed by the world generation system (e.g., via `map/archive_worldgen.lua`) when building rooms.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
Not applicable — this file returns static configuration data, not a component class with callable methods.

## Events & listeners
Not applicable