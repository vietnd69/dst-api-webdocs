---
id: evergreensinkhole
title: Evergreensinkhole
description: Provides static layout data for the Evergreen Sinkhole map region, defining background tile placement and foreground object regions.
tags: [map, static_layout, environment]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 75459535
system_scope: environment
---

# Evergreensinkhole

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines the static layout for the Evergreen Sinkhole region in Don't Starve Together. It is a Tiled Map Format (JSON-compatible Lua table) specification describing the visual and spatial configuration of the area, including tile layer data for background terrain and an object group defining regions for foreground assets like trees and lights. It does not implement any runtime logic or component behavior — it is consumed during world generation to instantiate the level geometry.

## Usage example
This file is not a component and is not instantiated directly in gameplay. It is loaded as a data file by the world generation system (e.g., `worldgen.lua` or related worldgen tasks), and its layout data is used to populate tile layers and place static entities. Modders may reference it to understand the coordinate structure or modify layout definitions for custom maps.

## Dependencies & tags
**Components used:** None  
**Tags:** None  
This is a pure data file — it contains no Lua code, does not define any components, and does not interact with the ECS at runtime.

## Properties
No public properties exist, as this is not an ECS component. The returned table contains Tiled map metadata:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `version` | `string` | `"1.1"` | Tiled format version |
| `luaversion` | `string` | `"5.1"` | Lua compatibility version (for serialization) |
| `orientation` | `string` | `"orthogonal"` | Map projection type |
| `width`, `height` | `number` | `32` | Map dimensions in tiles |
| `tilewidth`, `tileheight` | `number` | `16` | Tile size in pixels |
| `properties` | `table` | `{}` | Empty custom properties object |
| `tilesets` | `table[]` | see source | Tileset definitions (not used directly in runtime ECS) |
| `layers` | `table[]` | see source | Layer definitions (tile layer + object groups) |

## Main functions
This file contains no executable functions. It is a static data structure returned by the module.

## Events & listeners
None. This file does not define or handle any events.