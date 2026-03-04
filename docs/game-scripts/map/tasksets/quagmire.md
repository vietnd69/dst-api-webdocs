---
id: quagmire
title: Quagmire
description: Registers the Quagmire task set used to define valid and initial tasks for Quagmire gameplay.
tags: [task, world, quagmire]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: be41bc23
system_scope: world
---

# Quagmire

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `quagmire.lua` file defines and registers a task set named `"quagmire_taskset"` for the Quagmire world type using `AddTaskSet`. This task set specifies which tasks are valid and acceptable as starting tasks in Quagmire-mode gameplay. It is part of the world/task generation system and is used by the task assignment logic during world setup.

## Usage example
```lua
-- Task set registration is performed automatically on startup.
-- Modders can reference it via its name:
local taskset = GetTaskSet("quagmire_taskset")
-- taskset.tasks contains the list of valid tasks
-- taskset.valid_start_tasks contains the list of tasks eligible as starts
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties. This file executes top-level logic to register a task set via `AddTaskSet` and does not define a component class or expose mutable state.

## Main functions
Not applicable — this file contains only a single top-level call to `AddTaskSet`.

## Events & listeners
Not applicable — no event listeners or event firing occurs in this file.
(End of documentation)