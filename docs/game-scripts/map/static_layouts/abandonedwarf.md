---
id: abandonedwarf
title: Abandonedwarf
description: Defines a static map layout for the Abandoned Dwarf encounter in Don't Starve Together using Tiled map format data.
tags: [map, layout, static, environment]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
system_scope: environment
source_hash: 8b1aefe1
---

# Abandonedwarf

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout used for the Abandoned Dwarf encounter in the game. It specifies the structure of the map using Tiled map format v1.1, including layer configuration, tile data, and object placements. It is not a Lua component in the ECS sense but a precomputed map data asset consumed by the world generation system to instantiate the physical layout during gameplay. The layout includes background tile layers and foreground object layers with embedded spawn points for dynamic entities (e.g., miniflares).

## Usage example
This file is not instantiated directly by modders; it is automatically loaded by the world generation system when the Abandoned Dwarf static layout is requested. No direct usage code is intended or necessary for modding purposes.

## Dependencies & tags
**Components used:** None — this file is a data-only layout definition.
**Tags:** None — this file does not interact with entity tags or components.

## Properties
This file does not define any Lua component properties. It is a plain Lua table returning Tiled JSON-compatible map metadata.

## Main functions
This file exports a single table literal and contains no executable functions or methods. No functions are documented.

## Events & listeners
This file does not register or fire any events. Events & listeners section omitted.