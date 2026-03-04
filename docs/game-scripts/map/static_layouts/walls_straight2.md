---
id: walls_straight2
title: Walls Straight2
description: A static map layout containing wall segments with varying health states for use in dungeon generation.
tags: [map, environment, walls]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 30c5edcd
system_scope: environment
---

# Walls Straight2

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static tile-based map layout used in the game’s world generation system. It is not a component in the Entity Component System but a JSON/TMX-style map definition used by the game’s map loader. It contains a 16×16 tile layer (`BG_TILES`) with tile ID `29` placed in specific positions (representing wall segments), and an object layer (`FG_OBJECTS`) containing wall entities with metadata (including health percentage) used during room instantiation.

## Usage example
This file is loaded and processed internally by the world generation system during level setup. Modders typically reference it indirectly via room/task layouts or static layout loaders, rather than using it directly.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
Not applicable