---
id: skeleton_construction
title: Skeleton Construction
description: A static map layout definition used to place pre-authored object instances in the game world, such as the skeleton and crafting materials.
tags: [map, static, decoration]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: f77a7443
system_scope: environment
---

# Skeleton Construction

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is not a component but a static layout definition in Tiled JSON format, used to author and place specific objects in the game world. It defines a 12×12 tile grid with background tiles (all empty) and an object layer (`FG_OBJECTS`) that specifies locations and types of in-game prefabs (e.g., `skeleton`, `footballhat`, `hammer`, `boards`, `cutstone`, `rope`, `blueprint`). The `blueprint` object includes metadata (`data.recipetouse = "birdcage"`) indicating which recipe it unlocks. Such static layouts are consumed by world generation or room placement systems to instantiate prefabs at specified world coordinates.

## Usage example
Not applicable — this file is a data asset, not an ECS component. It is used internally by the world generation system (e.g., via `map/worldgen.lua` or room/task placement systems) rather than by modders adding components directly.

## Dependencies & tags
None identified.

## Properties
No public properties — this is a pure data definition returning a Lua table conforming to Tiled's JSON format.

## Main functions
Not applicable — no executable logic or methods are defined.

## Events & listeners
Not applicable — no event handling is performed in this file.