---
id: tallbird_blocker
title: Tallbird Blocker
description: A map-level data structure defining spawn locations for tallbird nests and rocks in the forest biome.
tags: [map, environment, spawn]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: bb8d53ea
system_scope: environment
---

# Tallbird Blocker

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is not a gameplay component or scriptable module—it is a static level layout definition exported from the Tiled Map Editor. It specifies tile placement (via a data array) and object placement for forest map generation, particularly for tallbird-related world elements. The layout includes coordinates for `tallbirdnest` and `rock1`/`rock2` prefabs, which are used by the game’s world generation system to populate the forest world with appropriate environmental features.

## Usage example
This file is not intended for direct use in mod code. It is loaded by the world generation engine during map building. Modders typically do not interact with it directly; instead, they may modify or replace static layouts through worldgen overrides or custom map prebuilds.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties exist in the ECS sense. This file returns a plain Lua table conforming to the Tiled JSON/JS format, containing metadata for map rendering and object instantiation.

## Main functions
Not applicable.

## Events & listeners
Not applicable.