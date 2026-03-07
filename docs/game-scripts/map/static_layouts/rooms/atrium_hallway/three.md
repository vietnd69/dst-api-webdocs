---
id: three
title: Three
description: A static map layout definition for the Atrium Hallway room, containing background tile data and foreground object placements.
tags: [map, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: b8565ba2
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`three` is a static room layout definition for the Atrium Hallway in Don't Starve Together. It defines the visual tile map (`BG_TILES` layer) and object placements (`FG_OBJECTS` layer), including light sources and environmental props like a dropperweb. This file is used by the world generation system to reconstruct the Atrium Hallway room during dungeon generation.

## Usage example
This file is not intended for direct instantiation by modders. It is consumed by the engine's Tiled-based map loader (via `static_layouts.lua`) when building the Atrium Hallway room. A typical integration point is in a room taskset or task, such as `atrium.lua`, which references `"rooms/atrium_hallway/three"`.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties.

## Main functions
Not applicable — this file returns a plain Lua table describing map data and does not define or expose any functions.

## Events & listeners
Not applicable — this file does not define or interact with events.