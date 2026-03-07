---
id: winona_battery_sparks
title: Winona Battery Sparks
description: A client-side visual effect prefab that displays randomized spark animations for battery-related interactions, synced to world time and never persisted.
tags: [fx, network, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 195bd5e7
system_scope: fx
---

# Winona Battery Sparks

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`winona_battery_sparks` is a lightweight FX prefab responsible for rendering spark animations associated with battery-related mechanics in DST. It creates a transient, non-interactive entity with an `ANIM`-based visual effect that plays a random animation sequence (`sparks_1`, `sparks_2`, or `sparks_3`). It is designed to be *non-persistent* and *client-simulated* (i.e., it only runs fully on the master world simulation while still spawning on clients), and is not intended to be added as a component to existing entities—it is instantiated and used directly as a standalone prefab instance.

## Usage example
```lua
local sparks = SpawnPrefab("winona_battery_sparks")
if sparks ~= nil then
    sparks.Transform:SetPosition(x, y, z)
end
-- The sparks will auto-remove after their animation completes
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX`, `NOCLICK`

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
- **Listens to:** `animover` — fires `inst.Remove` to automatically destroy the entity when the animation finishes playing.  
- **Pushes:** None identified
