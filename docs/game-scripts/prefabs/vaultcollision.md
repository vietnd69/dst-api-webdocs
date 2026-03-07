---
id: vaultcollision
title: Vaultcollision
description: Creates non-blocking, static collision mesh prefabs for the Vault and Lobby areas, preventing character movement through designated zones.
tags: [collision, physics, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 28c6147b
system_scope: physics
---

# Vaultcollision

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`vaultcollision.lua` defines two prefabs—`vaultcollision_lobby` and `vaultcollision_vault`—that implement custom static collision shapes for specific regions in the Vault and Lobby areas. These prefabs use precomputed triangle meshes based on static layout coordinates to enforce impassable boundaries where standard grid-based collision generation would be insufficient (e.g., curved or non-axial walls). The prefabs are non-physics entities with zero mass that interact solely as character collision obstacles, and are intended for use in zones where precise boundary control is required.

## Usage example
```lua
-- Create a lobby collision mesh at world position (0,0,0)
local inst = TheWorld:SpawnPrefab("vaultcollision_lobby")
inst.Transform:SetPosition(0, 0, 0)

-- Similarly for vault collision
local vault = TheWorld:SpawnPrefab("vaultcollision_vault")
vault.Transform:SetPosition(50, 0, 0)
```

## Dependencies & tags
**Components used:** `transform`, `network`, `physics`
**Tags:** Adds `NOBLOCK`, `ignorewalkableplatforms`, `staysthroughvirtualrooms`.  
None of these tags are checked or removed during runtime.

## Properties
No public properties

## Main functions
Not applicable — this file defines prefab factory functions only.

## Events & listeners
Not applicable — this file does not define or use any events or listeners.