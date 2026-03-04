---
id: walledgarden
title: Walledgarden
description: A static map layout definition for the Walled Garden world generation room, containing tile layers and object groups used to construct the arena's visuals and structures.
tags: [map, worldgen, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 3e260776
system_scope: environment
---

# Walledgarden

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`walledgarden.lua` defines a static map layout used for generating the Walled Garden arena in DST. It is not a mod component in the ECS sense (i.e., it does not define a component class with methods or properties to attach to entities), but rather a structured JSON-like table conforming to Tiled map format conventions. It specifies tile layers (`BG_TILES`) and object groups (`FG_OBJECTS`) that represent visual and structural elements of the arena — including decorative ruins, broken walls, regular walls, and spawn points for entities such as the Minotaur.

This file is consumed during world generation and used by the engine to place prefabs or tile-based assets, but it does not contain executable logic or runtime behavior code. Therefore, it has no constructor, no components, no events, and no invocable functions.

## Usage example
Not applicable — this is a data-only map layout definition used internally by the worldgen system. It is not meant to be instantiated or called directly by mod code.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
Not applicable

## Main functions
Not applicable

## Events & listeners
Not applicable