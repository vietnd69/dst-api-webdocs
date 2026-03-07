---
id: quagmire_kitchen
title: Quagmire Kitchen
description: Provides map data structure for Quagmire kitchen layouts with no runtime logic or entity behavior.
tags: [quagmire, map, data]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 16d6abdd
system_scope: world
---

# Quagmire Kitchen

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The Quagmire Kitchen module returns a static Tiled map data structure as a Lua table. It serves as a data container for level layout information and contains no executable logic, component behavior, event handling, or runtime entity interaction.

## Usage example
As this module exports only data and performs no actions, it is used by referencing its returned table:
```lua
local kitchen_data = require("maps/quagmire/kitchen")
-- kitchen_data contains Tiled tile, object, and layer information
```

## Dependencies & tags
**Components used:** None  
**Tags:** None  

## Properties
The returned table contains Tiled map data fields (not modder-facing properties). Modders should treat the output as a read-only data structure. Typical Tiled fields include (but are not limited to):
| Field | Type | Description |
|-------|------|-------------|
| `width`, `height` | number | Dimensions of the map in tiles |
| `tilewidth`, `tileheight` | number | Dimensions of individual tiles in pixels |
| `layers` | table | Array of tile/object layers |
| `objects` | table | Array of object groups (if any) |
| `properties` | table | Custom map properties |

Note: Actual structure depends on the exported Tiled map and is not defined as a modder API surface.

## Main functions
No functions are defined. The module exports a single table literal.

## Events & listeners
No events are defined or listened to.