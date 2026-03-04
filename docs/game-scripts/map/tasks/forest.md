---
id: forest
title: Forest
description: Defines a collection of world generation task templates for the Forest world type in Don't Starve Together.
tags: [worldgen, task, forest, adventure]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: 4b30806c
system_scope: world
---

# Forest

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines a series of world generation tasks for the Forest world type using the `AddTask` function. These tasks control which rooms are available, what locking conditions must be met, what keys are awarded, and the visual style of the generated world. It serves as a configuration layer that drives the procedural map generation system for adventure mode scenarios. It does not implement an ECS component itself, but rather declares reusable task definitions that the world generation system consumes.

## Usage example
This file is not intended to be instantiated or used directly in mod code. Instead, it is loaded automatically by the game’s world generation system during adventure mode setup. Modders should reference this file to understand the structure of task definitions and how to extend or override tasks using the `AddTask` API defined in `dst_tasks_forestworld`.

## Dependencies & tags
**Components used:** None — this is a configuration file, not a component.
**Tags:** Adds no tags.

## Properties
No public properties.

## Main functions
This file does not define any main functions. It only calls `AddTask` (imported from `map/tasks/dst_tasks_forestworld`) multiple times with task configuration tables.

## Events & listeners
None identified.