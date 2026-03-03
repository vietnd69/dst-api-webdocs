---
id: pigtown
title: Pigtown
description: Defines static layout data for the Pig Town biome using Tiled map format, specifying tile layers and object placements for Pig houses.
tags: [map, world, environment]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: c6346d7c
system_scope: world
---

# Pigtown

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`pigtown.lua` is a static layout definition file for the Pig Town biome in DST's world generation system. It uses the Tiled map format (v1.1) to declare tile layers (`BG_TILES`) and object placements (`FG_OBJECTS`) — specifically, locations where Pig houses should be instantiated. This file is not a component or prefab itself, but rather a map data structure consumed by the world generation system to populate the environment during world startup.

## Usage example
This file is not used directly by modders or prefabs. It is loaded automatically by the world generation engine when constructing Pig Town biomes.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file returns a plain Lua table containing map metadata (Tiled JSON-compatible structure). It does not define a class, constructor, or component.

## Main functions
None — this file exports a data table only.

## Events & listeners
None identified