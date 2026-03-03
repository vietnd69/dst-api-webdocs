---
id: total_darkness_start
title: Total Darkness Start
description: Defines a static map layout for the starting area of the Total Darkness scenario, containing fixed-position objects and tile data.
tags: [world, map, scenario]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 7c6bbf0f
system_scope: world
---

# Total Darkness Start

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`total_darkness_start.lua` defines a static map layout used as the initial spawn area for the *Total Darkness* scenario. It is not an ECS component but a data structure describing tile layers and object placements in a Tiled-compatible format. The layout includes background tile patterns and foreground objects such as a treasure chest, skeleton, campfire, and shared spawn/multiplayer portal points.

This file contributes to world generation by providing a predefined room or area configuration used during scenario initialization.

## Usage example
This file is not intended for direct use in mod code. It is consumed by the world generation system when loading the *Total Darkness* scenario. The game engine uses the returned table to construct the initial map layout at runtime.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a standalone data file returning a static map configuration table.

## Main functions
No functional methods — this file exports a single static table describing the map layout.

## Events & listeners
Not applicable.