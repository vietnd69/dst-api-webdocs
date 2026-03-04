---
id: quagmire
title: Quagmire
description: Registers a single optional task (`Quagmire_KitchenTask`) for Quagmire map generation, specifying room placement rules and visual properties.
tags: [quagmire, map, task, worldgen]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: 962f1fbe
system_scope: world
---

# Quagmire

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file registers the `Quagmire_KitchenTask` as a selectable optional task during Quagmire world generation. It defines constraints and visual configuration for where and how the task’s associated room(s) may appear in the world map. Unlike many components, this is not an ECS component but a world-generation task definition registration.

## Usage example
```lua
-- The task is automatically registered at load time; no manual instantiation.
-- Modders can extend or override by calling AddTask() with a different task name.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties are defined here. The `AddTask` call passes a table directly to the world-generation system.

## Main functions
This file does not define any main functions. It executes a single top-level `AddTask` call.

## Events & listeners
None identified

---