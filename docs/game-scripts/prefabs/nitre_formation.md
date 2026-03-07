---
id: nitre_formation
title: Nitre Formation
description: A non-interactive visual effect entity representing a cluster of nitre crystals, used for environmental decoration and light emission in cave ponds.
tags: [environment, fx, visual]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7fa30f8e
system_scope: environment
---

# Nitre Formation

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`nitre_formation` is a simple, non-simulated visual-only prefab that represents decorative nitre crystal clusters in cave ponds. It provides visual and lighting effects without simulation logic on the client or server. The entity is pristinely rendered (no simulation state), uses `ANIM` and `ANIMSTATE` components for animation, and participates in parent pond highlighting logic on the client via replication events. It is tagged as `FX` and only exists as a visual enhancement in the game world.

## Usage example
```lua
-- Nitre formations are instantiated by worldgen (e.g., cave pond rooms) and not directly spawned via mod code.
-- Example of how it appears in the world:
-- The game spawns "nitre_formation" prefabs under pond_cave entities as children.
-- Example spawn pattern (not mod-facing):
local formation = SpawnPrefab("nitre_formation")
formation.entity:SetParent(pond_entity)
formation.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`
**Tags:** Adds `FX`

## Properties
No public properties.

## Main functions
This component does not define any public functions. All logic is handled in inline callbacks (`OnRemoveEntity`, `OnEntityReplicated`) during entity creation.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.