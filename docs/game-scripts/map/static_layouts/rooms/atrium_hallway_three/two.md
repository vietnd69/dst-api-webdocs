---
id: two
title: Two
description: Defines a static map layout for the Atrium Hallway Three room variant, specifying background tiles and object placement using Tiled JSON format.
tags: [map, layout, room, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 45860b01
system_scope: environment
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout (`two.lua`) used in the `atrium_hallway_three` room type. It specifies a 32×32 grid of background tiles and places two lighting objects (`atrium_light`) in the foreground object layer. As a static layout, it is consumed by the world generation system to procedurally build rooms during map generation — not a dynamic component attached to game entities.

## Usage example
Static layouts like this are not added or manipulated directly in mod code; they are referenced by worldgen task/room definitions. For example, a room prefab or task set might include this layout in its `static_layouts` list.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file returns a plain Lua table describing Tiled map data, not a component.

## Main functions
Not applicable — this file contains no functions.

## Events & listeners
Not applicable — this file contains no event handling.