---
id: long
title: Long
description: Defines a static layout for the Atrium Hallway room in the caves, containing tile data and embedded objects such as lights and droppers.
tags: [map, room, static_layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 50afca53
system_scope: environment
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static map layout for the `atrium_hallway/long` room used in the Caves world generation. It contains tile layer data (`BG_TILES`) and an object group (`FG_OBJECTS`) specifying placements of environment objects like lights, droppers, and cave holes. The file is a Tiled JSON-compatible table used by the worldgen system to instantiate room geometry during map assembly.

## Usage example
This file is not intended for direct use in mod code. It is loaded by the worldgen subsystem automatically when generating the Atrium Hallway room. Example manual usage (for advanced debugging or custom level generation) is not recommended and not supported.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties.

## Main functions
This file returns a static table and contains no functions.

## Events & listeners
None identified