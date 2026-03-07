---
id: wagdrone_spot_marker
title: Wagdrone Spot Marker
description: A non-networked, classified marker entity used server-side to indicate a spawn or reference point for Wagdrobes in the world.
tags: [environment, server-only, marker]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fcbc9701
system_scope: environment
---

# Wagdrone Spot Marker

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wagdrone_spot_marker` is a lightweight, non-networked entity used exclusively on the server to mark a position in the world for Wagdrobes. It is created only on the master simulation (`TheWorld.ismastersim`), and immediately removed on clients to avoid redundant presence. The entity adds the `"CLASSIFIED"` tag and includes a basic transform for positioning. It serves as a placeholder or anchor point during world generation or dynamic entity placement.

## Usage example
This prefab is not intended for manual instantiation by modders. It is created internally by the game engine, for example:
```lua
-- Internal usage (not for external mods)
local marker = SpawnPrefab("wagdrone_spot_marker")
if marker then
    marker.Transform:SetPosition(x, y, z)
    -- Marker used briefly by server-side logic before being cleaned up
end
```

## Dependencies & tags
**Components used:** None  
**Tags:** Adds `"CLASSIFIED"` only. No tags removed or checked.

## Properties
No public properties.

## Main functions
No public functions. This prefab is a passive, transient entity with no exposed API.

## Events & listeners
None identified.
