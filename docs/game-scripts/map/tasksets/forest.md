---
id: forest
title: Forest
description: Defines the forest world task sets used by the game's world generation system to structure playable areas.
tags: [world, generation, taskset]
sidebar_position: 1

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: c6d7776f
system_scope: world
---

# Forest

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file registers two task sets—`default` and `classic`—for the forest world using `AddTaskSet`. Task sets define collections of required and optional tasks that shape the layout and progression of generated forest levels, including mandatory set pieces, optional spawn points, and ocean prefill rules. It is part of the world generation pipeline used during map creation to determine how terrain features, structures, and gameplay objectives are distributed.

## Usage example
```lua
-- This file is auto-loaded and does not need explicit usage.
-- However, external code can reference registered task sets like so:
local taskset = GetTaskSet("default")
print(taskset.name) -- "Default"
print(#taskset.tasks) -- Number of primary tasks
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file defines only task set configurations via top-level `AddTaskSet` calls.

## Main functions
No public functions are defined — this file uses top-level `AddTaskSet` calls to register task sets.

## Events & listeners
None identified