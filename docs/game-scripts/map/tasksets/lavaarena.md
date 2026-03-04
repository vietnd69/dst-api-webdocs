---
id: lavaarena
title: Lavaarena
description: Registers a custom task set named 'Lava Arena' for use in world generation.
tags: [world, map, task]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: fc8434b0
system_scope: world
---

# Lavaarena

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines and registers a task set named `lavaarena_taskset` for the Lava Arena map area using `AddTaskSet`. It associates the task set with the `lavaarena` location and specifies that `LavaArenaTask` is both the sole task in the set and a valid starting task. Task sets like this are used by the worldgen system to determine which tasks (e.g., room layouts or procedural elements) can appear in specific world areas.

## Usage example
This file does not define a component; it executes top-level logic during initialization. Typical usage involves engine-level registration and is not manually invoked by modders.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
No public functions defined — this file only invokes `AddTaskSet` at the top level.

## Events & listeners
Not applicable.