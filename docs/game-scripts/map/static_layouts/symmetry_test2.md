---
id: symmetry_test2
title: Symmetry Test2
description: A static map layout definition used for testing symmetry in world generation, containing tile and object placement data.
tags: [map, worldgen, test]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 2e3eaf91
system_scope: world
---

# Symmetry Test2

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`symmetry_test2.lua` is a static map layout file that defines a 24×24 tile grid for testing symmetry in world generation. It includes background tile layers (`BG_TILES`) and foreground object placements (`FG_OBJECTS`) arranged in a symmetrical pattern across the map. This file is not a runtime component but rather static data consumed by the map/room loading system to instantiate world geometry and prefabs during world generation. It does not define any executable logic or component behavior.

## Usage example
This file is not used directly in mod code. It is referenced by the world generation system when loading test layouts. Example usage in worldgen code would be via `static_layouts` tasksets (e.g., `map/tasksets/caves.lua`), but modders do not interact with this file directly.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this is a static data table, not an ECS component.

## Main functions
Not applicable.

## Events & listeners
Not applicable.