---
id: skeleton_mushjack
title: Skeleton Mushjack
description: Static layout data for the skeleton mushjack map room, defining background tiles and object placements for world generation.
tags: [map, worldgen, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 330b82e2
system_scope: world
---

# Skeleton Mushjack

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static layout (room template) for use in DST's world generation system. It specifies the arrangement of background tiles and foreground objects (e.g., `"skeleton"`, `"strawhat"`, `"log"`, `"cutgrass"`, `"twigs"`, `"stumps"`) in a 12×12 tile grid using Tiled map format metadata. It is consumed by the world generation system to place pre-defined scenery in specific map rooms.

## Usage example
This file is not intended for direct component use or instantiation by modders. It is loaded automatically by the world generation system during map room placement. Modders typically interact with it indirectly via custom `tasksets` or `levels` that reference this layout.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua interpreter version target |
| `orientation` | string | `"orthogonal"` | Map rendering orientation |
| `width` / `height` | number | `12` | Grid dimensions in tiles |
| `tilewidth` / `tileheight` | number | `16` | Tile pixel dimensions |
| `tilesets` | table | — | List of tileset definitions |
| `layers` | table | — | Layer definitions (`BG_TILES`, `FG_OBJECTS`) |

## Main functions
None identified — this file returns static data only.

## Events & listeners
None identified — this file does not participate in the event system.