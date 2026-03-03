---
id: moose_nest
title: Moose Nest
description: Defines the static layout and object placement for the moose nesting area in the Forest world.
tags: [map, static_layout, environment]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: d2279d5c
system_scope: environment
---

# Moose Nest

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file describes a Tiled map layout used to define the terrain, background tiles, and object placements for the moose nesting environment in the Forest world. It does not implement a game component in the ECS sense but serves as a static data file that the world generation system consumes to instantiate objects and terrain at runtime.

## Usage example
This file is not used directly by modders. It is loaded by the world generation system (e.g., via `map/levels/forest.lua` or associated tasksets) to spawn static geometry and prefabs like berry bushes, trees, ponds, and carrot plants at predefined coordinates.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties  
(this file returns raw Tiled JSON data — no Lua component class or instance is defined.)

## Main functions
Not applicable  
(this is a static data file returning a table; no executable functions are declared.)

## Events & listeners
Not applicable