---
id: sharkboi_water
title: Sharkboi Water
description: Defines the 'sharkboi_water' prefab — a large, ocean-dwelling monster entity with swimming capabilities, named identity, and water-specific locomotion.
tags: [locomotion, ai, monster, aquatic, named]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d12ac441
system_scope: entity
---

# Sharkboi Water

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sharkboi_water` is a Prefab definition for a large, ocean-dwelling monster entity in DST. It is designed for swimming-only movement with specialized components for visual identity, communication (`talker`), naming (`named`), and locomotion (`locomotor`). It uses a dedicated state graph (`SGsharkboi_water`) and brain (`sharkboi_waterbrain`). Tags include `swimming`, `wet`, `monster`, and `largecreature`, indicating its role as a fearsome aquatic predator.

## Usage example
This is a Prefab definition, not a reusable component. It is instantiated by the game engine when spawning the `sharkboi_water` entity. A typical modder would not call this directly, but may reference its structure when creating custom aquatic monster prefabs:
```lua
-- Usage via game engine (e.g., via worldgen, spawner, or debug command):
 SpawnPrefabs("sharkboi_water", {x, y, z})
```

## Dependencies & tags
**Components used:** `talker`, `named`, `inspectable`, `locomotor`  
**Tags added:** `scarytoprey`, `scarytooceanprey`, `monster`, `animal`, `largecreature`, `shark`, `wet`, `epic`, `swimming`, `_named` (temporary), later `named` (via `named` component)  
**Tags removed (during mastersim init):** `_named`

## Properties
No public properties are initialized in this file — it defines a Prefab factory function (`fn`) that configures an `inst` entity. Properties belong to added components (see dependencies), but those are not defined here.

## Main functions
The file exports a single function `fn()` used as the Prefab factory. It is not a component method.

## Events & listeners
No events or listeners are registered in this file.
