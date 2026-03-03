---
id: chess_blocker_c
title: Chess Blocker C
description: A static layout file for a chess-themed map used in Don't Starve Together, defining tile layers and object placements for a chessboard-like arena environment.
tags: [map, layout, chess, arena, static]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 40bb7462
system_scope: environment
---

# Chess Blocker C

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

This file is a static map layout definition used in the game Don't Starve Together. It defines a square 52x52 tile grid (with `tilewidth=16`, `tileheight=16`) using the Tiled map format. The layout contains two layers: a tile layer (`BG_TILES`) for background visuals and an object group (`FG_OBJECTS`) that specifies the placement of game entities such as `marblepillar`, `marbletree`, chess pieces (`rook`, `knight`, `bishop`), `flower_evil`, and `statuemaxwell`. This layout appears to model a chessboard-style arena with symbolic chess pieces and environmental assets. The file is used during world generation to instantiate this structured environment in-game.

## Usage example

This file is not a Lua component in the Entity Component System sense; it is a Tiled `.lua` map export used as static data by the world generation system. It is not directly instantiated as a component on an entity. Instead, the game loads it via the map loading pipeline (e.g., through `static_layouts` loading logic). Therefore, no typical "component usage" pattern applies. Modders typically reference this file when designing custom layouts or inspecting pre-made arena configurations.

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  

## Properties
This file is a plain Lua table conforming to the Tiled map format and contains no entity component properties.

## Main functions
This file exports only a top-level table and does not define any executable functions or component methods.

## Events & listeners
This file does not register or trigger any events.