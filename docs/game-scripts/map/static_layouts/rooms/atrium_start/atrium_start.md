---
id: atrium_start
title: Atrium Start
description: Static map layout data for the Atrium Start room, defining tile placements and object positions used in world generation.
tags: [worldgen, room, static]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 51b16fce
system_scope: world
---

# Atrium Start

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file contains static layout data for the Atrium Start room, used during world generation to instantiate the room in the game world. It specifies tilelayer and objectgroup definitions conforming to the Tiled Map Editor format, including tile IDs for background layers and object placements for prefabs like tentacle_pillar_atrium, atrium_statue, atrium_fence, and cave_hole. It is not an ECS component and does not define behavior at runtime.

## Usage example
This file is not intended for direct instantiation by modders. It is loaded by the world generation system and referenced by room templates (e.g., in `./map/rooms/atrium/` or related tasksets). No Lua code execution is required.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file is a data-only module returning a JSON-like table.

## Main functions
Not applicable — no functions are defined.

## Events & listeners
Not applicable — no event interactions.