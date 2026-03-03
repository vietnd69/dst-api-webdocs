---
id: winter_start_easy
title: Winter Start Easy
description: A static map layout defining the initial player starting area in the Easy difficulty winter season.
tags: [map, winter, spawn, environment]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 10e62c63
system_scope: world
---

# Winter Start Easy

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static layout (`winter_start_easy.lua`) used to set up the initial player spawn area during the Winter season on Easy difficulty. It specifies background tile data, object placements (such as spawns, trees, grass, and campfire), and world geometry in Tiled map format. It is consumed by the world generation system to position entities and terrain features reliably at the start of the season.

## Usage example
This file is not used directly by modders in Lua code. It is loaded by the world generation engine as part of `map/tasksets/caves.lua` and `map/tasksets/forest.lua` depending on world configuration. Modders should reference it to understand expected asset and object naming conventions for winter spawn layouts.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this is a data-only Lua table returning static map metadata.

## Main functions
Not applicable — this file is a pure data module with no executable functions.

## Events & listeners
None identified