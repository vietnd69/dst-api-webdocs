---
id: moonaltarrockglass
title: Moonaltarrockglass
description: Defines a static map layout asset for a decorative rock glass object associated with the moon altar, used in level design.
tags: [map, static, environment]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 77ada1fb
system_scope: environment
---

# Moonaltarrockglass

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`moonaltarrockglass.lua` is a static map layout file in Tiled Map Editor format (JSON-like Lua table). It defines a 2×2 tile arrangement for placing a decorative rock glass object near the moon altar. This file is not a game entity component but a level design asset used to author static geometry and object placements in the game world. It contains no game logic, components, or runtime behavior—only structural map data.

## Usage example
This file is loaded automatically by the game's world generation system during map initialization and is not intended for manual runtime use by modders. Example use cases are handled internally by the engine via `map/archive_worldgen.lua` and related tools.

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No public properties—this file exports raw map metadata as a Lua table for external consumption.

## Main functions
Not applicable

## Events & listeners
Not applicable