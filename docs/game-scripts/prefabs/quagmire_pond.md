---
id: quagmire_pond
title: Quagmire Pond
description: A static environmental object representing a salt pond in the Quagmire biome that acts as a water source and obstacle.
tags: [environment, obstacle, water]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4bdca9b0
system_scope: environment
---

# Quagmire Pond

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_pond` defines the prefabricated entity for a static salt pond found in the Quagmire world. It is a non-interactive environmental prop with physics configured as an obstacle, visual representation via animation states, and multiple entity tags for game logic integration (e.g., blocking placement of certain structures or entities). It serves as a `watersource` in the game world and contributes to world layout and entity placement rules.

## Usage example
This prefab is not intended for manual instantiation in mod code. It is registered and spawned automatically by the world generation system. A typical usage context involves placement via map generation tools or room/task logic, not direct component interaction.

## Dependencies & tags
**Components used:** None identified (uses built-in engine components and helper functions `MakeObstaclePhysics`, `SetDeploySmartRadius`, `event_server_data`, and `entity:Add*` methods).  
**Tags:** `watersource`, `antlion_sinkhole_blocker`, `birdblocker`, `saltpond`

## Properties
No public properties.

## Main functions
Not applicable — this is a prefab definition, not a component. The `fn()` constructor sets up the entity but defines no custom methods.

## Events & listeners
Not applicable — no event listeners or event pushes are defined within this file.

