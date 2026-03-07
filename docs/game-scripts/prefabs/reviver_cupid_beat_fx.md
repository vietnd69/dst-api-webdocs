---
id: reviver_cupid_beat_fx
title: Reviver Cupid Beat Fx
description: Creates a heart-themed particle effect synced to an animation for the Reviver character’s Cupid skin.
tags: [fx, animation, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 66ad97ce
system_scope: fx
---

# Reviver Cupid Beat Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`reviver_cupid_beat_fx` is a client-side particle effect prefab used to visually signal the Reviver character’s Cupid skin during specific animations. It spawns glowing, pulsating heart-shaped particles that animate in sync with the parent entity’s animation timeline. The prefab consists of two entries: the main `reviver_cupid_beat_fx` for particle effects, and `reviver_cupid_glow_fx` for a secondary glowing visual layer. Both are short-lived, non-persistent entities used exclusively for visual feedback and do not participate in gameplay logic or simulation.

## Usage example
```lua
-- The prefab is typically referenced and spawned internally by the Reviver's Cupid skin animation system.
-- Manual usage (e.g., in testing) would be:
local fx = SpawnPrefab("reviver_cupid_beat_fx")
fx.entity:SetParent(some_reviver_entity)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX`.

## Properties
No public properties.

## Main functions
Not applicable — this is a Prefab definition, not a Component with runtime methods.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:** None identified.