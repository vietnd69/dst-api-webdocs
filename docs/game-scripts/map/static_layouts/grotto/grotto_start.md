---
id: grotto_start
title: Grotto Start
description: Defines the static layout data for the Grotto starting area, including tilemap configuration, light placements, and spawn points.
tags: [map, layout, static, grotto]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: c8e22c0b
system_scope: environment
---
# Grotto Start

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file (`grotto_start.lua`) defines a static map layout for the Grotto's starting chamber in JSON-like Lua format (Tiled map data). It specifies tile layer data, object groups (including debug objects), lighting placements, and key game entities like spawn points and portals. It is consumed by the world generation system during map initialization and is not an ECS component attached to entities.

## Usage example
This file is not intended for direct runtime use by modders. It is loaded as part of the world generation pipeline when initializing the Grotto level. Modders typically do not interact with this file directly; instead, they may modify or reference it indirectly via map/room scripts or level definitions.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file returns a plain Lua table describing static map data, not an ECS component.

## Main functions
Not applicable — this file exports a data structure, not a component or script module.

## Events & listeners
Not applicable — this file does not define or listen to events.

