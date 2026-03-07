---
id: one
title: One
description: Defines the layout and static object placement for a residential-style room in the game map.
tags: [map, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 5c3f53b5
system_scope: world
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static room layout definition used by the game's world generation system. It specifies the tile arrangement (via a tilelayer) and object placements (via an objectgroup) for a single room instance. It does not implement any runtime logic or entity behavior—it serves as static data consumed by map-building systems to construct the world. The layout is named `one.lua` and resides in `room_residential`, indicating its intended use in residential-type cave or surface rooms.

## Usage example
This file is not instantiated or used as a component. It is loaded as a data file by world generation tasks (e.g., in `map/tasksets/caves.lua` or similar). No direct Lua usage is required or expected by modders at runtime.

## Dependencies & tags
None identified.

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
Not applicable.