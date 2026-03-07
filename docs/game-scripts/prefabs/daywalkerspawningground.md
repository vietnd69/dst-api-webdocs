---
id: daywalkerspawningground
title: Daywalkerspawningground
description: Creates a non-entity, non-interactive world marker used to register a Daywalker spawning location.
tags: [world, boss, spawn]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a77379b9
system_scope: world
---

# Daywalkerspawningground

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`daywalkerspawningground` is a minimal prefab used to mark a location in the world as a valid spawn site for the Daywalker boss. It is a non-physical, non-interactive entity that adds specific tags and broadcasts its presence via a world event. It does not possess components, behavior logic, or visual representation beyond basic transform data.

## Usage example
```lua
-- Automatically instantiated by the world generator or event system when a Daywalker spawn is required.
-- Typical internal usage (not modder-facing):
local ground = SpawnPrefab("daywalkerspawningground")
ground.Transform:SetPosition(x, y, z)
-- Handled automatically: registration via ms_registerdaywalkerspawningground
```

## Dependencies & tags
**Components used:** None  
**Tags:** Adds `daywalkerspawningground`, `NOBLOCK`, `NOCLICK`

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
- **Pushes:** `ms_registerdaywalkerspawningground` — Fired on the `TheWorld` global to register this instance as a potential Daywalker spawn site.