---
id: pigguard_berries
title: Pigguard Berries
description: Defines a static map layout for a pig guard berry patch area using Tiled map data.
tags: [map, worldgen, static_layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 43c9c52f
system_scope: world
---

# Pigguard Berries

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static layout definition for a berry patch area used in world generation. It specifies a 16x16 tile grid with background tile placements and foreground object placements, including berry bushes (`berrybush`, `berrybush_juicy`) and pig torches (`pigtorch`). As part of the `static_layouts` directory, it is consumed by the world generation system to inject predefined environmental content into generated worlds. It contains no executable logic or entity components—only structural data.

## Usage example
Not applicable. This file is not a component or script module; it is raw map data in JSON/Tiled format and is loaded and interpreted by the engine's map loader, not directly used in mod Lua code.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. This file returns a plain Lua table of map metadata and tile/object layers, as defined by the Tiled map format.

## Main functions
Not applicable. This file has no callable functions.

## Events & listeners
Not applicable.