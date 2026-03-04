---
id: pigguards
title: Pigguards
description: Defines a Tiled map layout for pig guard enclosures, specifying background tiles and object placements for walls and pig torches.
tags: [map, level, environment, prefabs]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 7f98a152
system_scope: environment
---

# Pigguards

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout for pig guard enclosures in DST's world generation system. It is a Tiled JSON-style table (not an ECS component) used by the world generation engine to place environmental assets like `wall_wood` and `pigtorch` prefabs. The layout uses a 40x40 tile grid with 16x16 tile dimensions and includes two layers: `BG_TILES` (background tile data) and `FG_OBJECTS` (object placements for structures and lighting). It is consumed by the map/level generation system and does not function as an ECS component.

## Usage example
This file is loaded and processed by the world generation system during world creation and cannot be directly instantiated by modders. It is referenced internally by map generation code (e.g., `static_layouts` loader). No modder-facing API calls are exposed.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this is a data-only table defining a static layout.

## Main functions
None — this file exports a static table and contains no functional methods.

## Events & listeners
None identified.