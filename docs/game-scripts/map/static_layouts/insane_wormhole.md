---
id: insane_wormhole
title: Insane Wormhole
description: Static map layout for the Insane World's wormhole room, defining tile configurations and static object placements (e.g., basalt, insanity rocks, and wormhole trigger).
tags: [wormhole, environment, map, layout, static]
sidebar_position: 10
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 81e3ac55
system_scope: world
---
# Insane Wormhole

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

This file defines a Tiled JSON-style static layout (`insane_wormhole.lua`) used to generate a specific room in the Insane World (caves event map). It specifies background tile patterns, foreground object placements, and one interactive object: the wormhole. As a static layout, it is consumed by the world generation system to instantiate the room—no ECS component logic is present in this file. It serves as a declarative map descriptor, not a runtime component.

## Usage example

Static layouts like this one are automatically loaded by the world generation system and applied during map room instantiation. Modders do not typically load or manipulate them directly in Lua code.

To reference this layout during room generation, the engine internally uses paths like `map/static_layouts/insane_wormhole.lua` in room/task definitions (e.g., in `map/tasksets/caves.lua`), but no manual component usage occurs.

## Dependencies & tags

**Components used:** None — this is a data-only layout file.

**Tags:** None identified.

## Properties

No Lua properties or variables exist in this file. It is a pure data table matching the Tiled JSON export format (version `1.1`, `5.1` Lua export). All properties are metadata fields used by the map loader:

| Field         | Type   | Description                                                                 |
|---------------|--------|-----------------------------------------------------------------------------|
| `version`     | string | Tiled format version (`"1.1"`).                                            |
| `luaversion`  | string | Lua version used for export (`"5.1"`).                                     |
| `orientation` | string | Map orientation (`"orthogonal"`).                                           |
| `width`       | number | Room width in tiles (`16`).                                                 |
| `height`      | number | Room height in tiles (`16`).                                                |
| `tilewidth`   | number | Tile pixel width (`16`).                                                    |
| `tileheight`  | number | Tile pixel height (`16`).                                                   |
| `tilesets`    | table  | Tileset definitions (one set, referencing `tiles.png`).                    |
| `layers`      | table  | Layer definitions: `BG_TILES` (tile layer), `FG_OBJECTS` (object group).  |

## Main functions

This file contains no functions. It is a top-level table constant.

## Events & listeners

Not applicable — no runtime code or event logic is present.

