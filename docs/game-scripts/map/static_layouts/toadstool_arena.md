---
id: toadstool_arena
title: Toadstool Arena
description: Defines the static layout data for the Toadstool Arena map room using Tiled JSON format, specifying background tiles and placed objects.
tags: [map, layout, environment]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 0ddf9bee
system_scope: environment
---

# Toadstool Arena

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`toadstool_arena.lua` is a static layout file defining the geometric and object composition of the Toadstool Arena map room in Don't Starve Together. It uses the Tiled map format (version 1.1, orthogonal orientation, 32×32 grid of 16×16 tiles) to specify background tile placements (via the `BG_TILES` layer) and object placements (via the `FG_OBJECTS` object group). This file is consumed by the world generation system to instantiate the arena environment during map loading. It does not contain executable logic or components and is strictly a data definition.

## Usage example
This file is not used directly by modders in code. It is referenced internally by the world generation system when loading the Toadstool Arena room. Modders may inspect or modify the `.lua` file in the source tree to adjust the room's layout for custom worldgen or scenarios.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. The file returns a Lua table conforming to the Tiled JSON schema and is not a component.

## Main functions
Not applicable.

## Events & listeners
Not applicable.