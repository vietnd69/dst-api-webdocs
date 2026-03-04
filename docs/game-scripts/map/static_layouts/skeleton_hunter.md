---
id: skeleton_hunter
title: Skeleton Hunter
description: A static map layout defining spawn locations and placement of loot items and a skeleton hunter NPC in the game world.
tags: [map, environment, loot]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: efb2f9b3
system_scope: environment
---

# Skeleton Hunter

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`./map/static_layouts/skeleton_hunter.lua` defines a static Tiled map layout used in DST world generation. It specifies the tile layers and object group placements for the "Skeleton Hunter" static layout, including positions for a `skeleton` NPC and various loot items (`beefalohat`, `beefalowool`, `houndbone`, `houndstooth`, `spear`). This file is not a component but a data file describing spatial placement within a room or area.

## Usage example
This layout is not instantiated directly as a component. It is referenced internally by the world generation system (e.g., via `tasksets`, `task`, or room system) to place content in generated worlds.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this is a pure data file returning a Lua table with static layout metadata.

## Main functions
Not applicable

## Events & listeners
Not applicable