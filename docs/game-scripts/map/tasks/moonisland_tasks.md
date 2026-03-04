---
id: moonisland_tasks
title: Moonisland Tasks
description: Placeholder module containing no functional code — all its tasks were migrated to dst_tasks_forestworld.
tags: [map, task, deprecated]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: 9e552d81
system_scope: world
---

# Moonisland Tasks

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This module (`moonisland_tasks.lua`) serves only as a legacy stub file. It contains no functional logic — its only operation is a `require` statement that imports and incorporates all task definitions from `dst_tasks_forestworld`. This indicates the content was moved and consolidated as part of a refactoring effort to centralize forest-related world-generation tasks.

## Usage example
```lua
-- This module does not define new functionality.
-- Use the dst_tasks_forestworld module directly:
require "map/tasks/dst_tasks_forestworld"
-- Tasks defined there are used internally by the world-generation system.
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  

## Properties
No public properties  

## Main functions
No functions are defined in this file.

## Events & listeners
None identified.