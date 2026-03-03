---
id: caves
title: Caves
description: Defines the cave world taskset configuration used for procedural level generation in Don't Starve Together.
tags: [world, generation, taskset]
sidebar_position: 1

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: 737167f1
system_scope: world
---

# Caves

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines the `cave_default` taskset, which specifies the full suite of tasks and constraints used during procedural generation of the Caves world. It includes lists of required tasks (mandatory structure nodes), optional tasks (randomly selected additional features), valid starting points, required prefabs (set pieces), and per-set-piece task compatibility rules. Tasksets are consumed by the worldgen system to build the cave layout.

## Usage example
This taskset is registered automatically at load time and cannot be instantiated directly by mods. It is referenced by world generation code via the taskset ID `"cave_default"`.

```lua
-- Example of referencing the taskset (internal usage only)
local taskset = GetTaskSet("cave_default")
print(taskset.name) -- localized string for "Caves"
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file defines only a static taskset configuration table and registers it.

## Main functions
Not applicable.

## Events & listeners
Not applicable.