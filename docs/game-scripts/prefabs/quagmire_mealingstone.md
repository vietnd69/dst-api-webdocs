---
id: quagmire_mealingstone
title: Quagmire Mealingstone
description: A craftable structure prefab used in the Quagmire DLC that enables storage of ground ingredients and acts as a crafting node for Quagmire-specific recipes.
tags: [structure, crafting, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3a223e61
system_scope: crafting
---

# Quagmire Mealingstone

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_mealingstone` prefab represents a durable stone table used for storing and preparing ground ingredients in the Quagmire biome. It is instantiated as a static environmental entity with physics, animation, and networking support. The component itself is a standard prefab definition that configures visual, physical, and logical properties. While it does not define a dedicated component class (i.e., no custom `Class(function(self, inst) ... end)` constructor), it is functionally linked to the Quagmire recipe system via `quagmire_shoptab` and initialized on the master simulation with a `master_postinit` hook that registers craftable items.

## Usage example
```lua
-- The quagmire_mealingstone is automatically instantiated by the world generator when Quagmire rooms are placed.
-- To craft it manually (e.g., via debug tools):
local inst = SpawnPrefab("quagmire_mealingstone")
inst.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `structure` and `prototyper`. Uses `MakeObstaclePhysics`, `MakeSnowCoveredPristine`, and `entity` subsystems (`Transform`, `AnimState`, `MiniMapEntity`, `SoundEmitter`, `Network`).

## Properties
No public properties are defined or accessed directly in this file.

## Main functions
Not applicable — this is a prefab definition file, not a component with functional methods. Logic is handled during prefab instantiation and via the external `master_postinit` callback referenced via `event_server_data`.

## Events & listeners
- **Listens to:** None identified (event handling occurs in the `master_postinit` function defined externally).
- **Pushes:** None identified (no events are fired by this prefab definition itself).