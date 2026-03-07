---
id: quagmire_parkspike
title: Quagmire Parkspike
description: A static obstacle prefab used in Quagmire mode that blocks pathfinding and visual movement.
tags: [obstacle, pathfinding, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5c2cd72a
system_scope: environment
---

# Quagmire Parkspike

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_parkspike` is a static environmental obstacle prefab used in Quagmire mode. It serves as a physical barrier that blocks entity movement and integrates with the world’s pathfinding system. When instantiated, it registers its position with `TheWorld.Pathfinder` as a wall obstacle and removes it upon entity destruction.

## Usage example
This prefab is typically spawned automatically by level designers or world generation systems (e.g., via `static_layouts`). Manual instantiation is uncommon but possible:
```lua
local tall_spike = Prefab("quagmire_parkspike")
local short_spike = Prefab("quagmire_parkspike_short")
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `network`, `inspectable` (added on master only)  
**Tags:** None identified

## Properties
No public properties.

## Main functions
No custom public functions beyond those inherited from the prefab construction system.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified