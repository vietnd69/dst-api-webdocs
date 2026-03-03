---
id: vault_lobby
title: Vault Lobby
description: Defines the static layout data for the Vault Lobby map room, including tile configuration and object placements.
tags: [map, layout, vault]
sidebar_position: 1
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 7c76c965
system_scope: world
---
# Vault Lobby

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`vault_lobby.lua` is a static layout definition file that specifies the tilemap and object placement for the Vault Lobby room in Don't Starve Together. It contains map geometry (via tile layer data) and object instances (via object group entries) used during world generation to construct the physical environment of the Vault Lobby. This file is consumed by the world generation system and does not implement an ECS component or runtime logic.

## Usage example
This file is not instantiated at runtime. It is referenced by world generation tasks (e.g., `map/tasksets/caves.lua`) that load room layouts. Example usage in a taskset:
```lua
worldgen.AddRoomLayout("vault_lobby", "map/static_layouts/vault_lobby")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file is a plain Lua table literal containing static map data.

## Main functions
Not applicable.

## Events & listeners
Not applicable.
