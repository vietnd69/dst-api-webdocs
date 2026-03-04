---
id: tentacle_pillar
title: Tentacle Pillar
description: Static map layout data for tentacle pillar structures, defining tile placement and object markers for world generation.
tags: [map, worldgen, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: ac6a53ba
system_scope: world
---

# Tentacle Pillar

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static map layout definition used in DST's world generation system. It specifies a 16×16 tile grid for the tentacle pillar structure, including background tile layer data and an object group with a single `wormhole_MARKER` object. It is used as a reusable room template during procedural map generation.

## Usage example
This file is not used directly as a component on entities. Instead, it is consumed by world generation systems (e.g., via `map/levels/caves.lua` or room-based tasks) to instantiate the tentacle pillar layout in the game world.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties (this is a data-only layout definition, not a component class).

## Main functions
Not applicable

## Events & listeners
Not applicable