---
id: island_hopping
title: Island Hopping
description: Registers a series of linked task nodes for the "Island Hopping" world generation sequence, defining how islands are procedurally connected and what rooms they contain.
tags: [world, procedural, tasks]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: c3fa7ed3
system_scope: world
---

# Island Hopping

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `island_hopping.lua` file defines a sequence of task nodes that drive the procedural world generation for the "Island Hopping" game mode. Each `AddTask` call registers a task node representing a stage in the island progression (e.g., starting island, hostile island, forest island), specifying locked conditions, room generation rules, background themes, and visual coloration. These tasks are part of the worldgen task system used to assemble islands in sequence.

## Usage example
This file is executed automatically during world generation initialization and does not require manual usage. It is included in the worldgen task pipeline via the `map/tasks/caves.lua` and `map/tasks/dst_tasks_forestworld.lua` tasksets.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
This file does not define any functional methods — it only calls `AddTask()` with task configuration tables. Each `AddTask` invocation registers a named task node into the world generation system.

## Events & listeners
None identified