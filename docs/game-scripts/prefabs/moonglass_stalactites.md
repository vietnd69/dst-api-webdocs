---
id: moonglass_stalactites
title: Moonglass Stalactites
description: Generates three prefabs for non-blocking moonglass stalactite decorative entities used in world environments.
tags: [environment, decor, prefabs]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 03e0b8b2
system_scope: environment
---

# Moonglass Stalactites

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines three variant prefabs (`moonglass_stalactite1`, `moonglass_stalactite2`, `moonglass_stalactite3`) for decorative stalactite entities in the Moonglass biome. Each prefab creates an entity with an `AnimState`, `Transform`, and `Network` component, sets a specific animation, and tags it as `NOBLOCK` so it does not obstruct movement or placement. It is self-contained and does not add or use any gameplay components.

## Usage example
```lua
-- Spawn a random stalactite variant
local variant = math.random(1, 3)
local stalactite = Prefab("moonglass_stalactite"..variant)
local entity = SpawnPrefab("moonglass_stalactite"..variant)

if entity ~= nil then
    entity.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `network`  
**Tags:** Adds `NOBLOCK` to each entity.

## Properties
No public properties

## Main functions
### `stalactite(num)`
* **Description:** Factory function that returns a `Prefab` definition for a stalactite variant (`num` ∈ {1, 2, 3}). Instantiates the entity with geometry, animation, and network sync.
* **Parameters:** `num` (number) – the variant index (1, 2, or 3).
* **Returns:** `Prefab` – a prefabricated entity definition.
* **Error states:** Returns `nil` on the client when `TheWorld.ismastersim` is `false`; only the master simulation returns the fully initialized `inst`.

## Events & listeners
None identified.