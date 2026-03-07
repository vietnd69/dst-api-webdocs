---
id: smoke_plant
title: Smoke Plant
description: Renders a non-persistent visual FX entity with lighting and sound, used to simulate a smoldering smoke plant effect in the game world.
tags: [fx, lighting, sound]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3040e497
system_scope: fx
---

# Smoke Plant

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`smoke_plant` is a lightweight prefab that creates a non-persistent visual effect entity. It combines animation, light, sound, and network replication to render a smoldering smoke source (e.g., for seasonal or environmental events like summer). The entity is not saved to disk (`persists = false`), runs exclusively on the master simulation (when `TheWorld.ismastersim` is true), and includes no gameplay logic or components beyond visual/audio systems.

## Usage example
```lua
local smoke = SpawnPrefab("smoke_plant")
smoke.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None (uses built-in entity subsystems via `inst.entity:AddX()`).  
**Tags:** Adds `FX`.

## Properties
No public properties.

## Main functions
Not applicable — this is a prefab definition, not a component. No methods or constructor logic beyond initialization.

## Events & listeners
Not applicable.