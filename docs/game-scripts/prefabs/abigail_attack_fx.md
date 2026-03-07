---
id: abigail_attack_fx
title: Abigail Attack Fx
description: Spawns visual and audio effects for Abigail's attack animations, handling both normal and ground-specific variants.
tags: [fx, combat, visual, entity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 637e3d72
system_scope: fx
---

# Abigail Attack Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`abigail_attack_fx` is a lightweight prefab factory that creates temporary visual/audio effect entities used to display Abigail's attack animations. It defines two prefabs: one for standard (airborne) attacks and one for ground-based attacks. These effects are short-lived, non-persistent entities that are destroyed automatically after playing a single animation sequence. The component is self-contained and does not require or interact with other components beyond the standard ECS base (transform, animstate, soundemitter, light, network).

## Usage example
```lua
-- Spawn a normal attack effect
local fx = SpawnPrefab("abigail_attack_fx")
fx.Transform:SetPosition(x, y, z)
fx.kill_fx(fx, 1)

-- Spawn a ground attack effect
local ground_fx = SpawnPrefab("abigail_attack_fx_ground")
ground_fx.Transform:SetPosition(x, y, z)
ground_fx.kill_fx(ground_fx, 2)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `light`, `network`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `kill_fx` | function | `nil` (assigned at creation) | A callback function (either `normal_kill_fx` or `ground_kill_fx`) that plays the appropriate animation and schedules entity removal. |

## Main functions
No standalone functions are exported or intended for external use beyond the internal `kill_fx` callback. The prefabs are consumed via `SpawnPrefab("abigail_attack_fx")` and `SpawnPrefab("abigail_attack_fx_ground")`.

## Events & listeners
None identified.