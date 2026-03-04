---
id: dst_tasks_forestworld
title: Dst Tasks Forestworld
description: Defines and registers all world generation tasks used for constructing the forest world in Don't Starve Together.
tags: [worldgen, forest, tasks]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: e6d2b9fc
system_scope: world
---

# Dst Tasks Forestworld

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file registers a collection of world generation *tasks* for the forest world using the `AddTask` function. Each task specifies constraints (locks), rewards (keys_given), and room generation rules (room_choices) to influence how rooms are placed during world construction. These tasks are used by the map generation system to ensure procedural world layouts meet progression and thematic requirements. The file only uses `LOCKS` and `KEYS` constants and references `WORLD_TILES` for background definitions.

## Usage example
This file does not expose a reusable component; it is a configuration script executed during world generation initialization. Modders should not directly invoke or reference it. Tasks defined here become available to the worldgen task system automatically upon game startup.

## Dependencies & tags
**Components used:** None  
**Tags:** None identified.

## Properties
No public properties are defined in this file.

## Main functions
This file does not define any custom functions. It only calls `AddTask(...)` multiple times to register tasks.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None