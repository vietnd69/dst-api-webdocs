---
id: carrot
title: Carrot
description: Represents a planted carrot crop that can be harvested, hauntable, and mutates under the Halloween Moon.
tags: [harvest, mutator, haunt, regrowth]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4d4c2a01
system_scope: world
---

# Carrot

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `carrot_planted` prefab defines a stationary carrot crop that grows in the world. It provides a harvestable resource via the `pickable` component, integrates with world systems like fire, propagation, and regrowth, and supports seasonal mutation under the Halloween Moon. It is designed for server-authoritative simulation and synchronizes visual state to clients.

## Usage example
```lua
-- Typical usage within the game to spawn a carrot crop
inst = SpawnPrefab("carrot_planted")
inst.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `inspectable`, `pickable`, `halloweenmoonmutable`, `hauntable`, `burnable`, `regrowth`, `propagator`  
**Tags:** None explicitly added or checked.

## Properties
No public properties are declared or exposed beyond component-level configurations.

## Main functions
This prefab does not define its own functional methods; behavior is handled via attached components.

### Component integrations

#### `inst.components.pickable`
- Configured via:
  - `picksound = "dontstarve/wilson/pickup_plants"`
  - `SetUp("carrot", 10)` — product is `"carrot"`, regen time is `10` seconds
  - `remove_when_picked = true` — entity is removed upon harvest
  - `quickpick = true` — allows rapid harvesting without delay

#### `inst.components.halloweenmoonmutable`
- Configured via `SetPrefabMutated("carrat_planted")` — when the Halloween Moon is active, this entity transforms into `carrat_planted`.

#### `inst.components.hauntable`
- Configured via `SetHauntValue(TUNING.HAUNT_TINY)` — defines the haunt difficulty or chance when players are near.

#### World system integrations
- `MakeSmallBurnable(inst)` — allows the carrot to catch fire and burn.
- `AddToRegrowthManager(inst)` — enables automatic regrowth after harvesting.
- `MakeSmallPropagator(inst)` — allows the carrot to spread fire or regrow nearby crops.

## Events & listeners
- **Listens to:** `onremove` — triggered because `pickable.remove_when_picked = true`, causing the entity to be cleaned up when harvested.
- **Pushes:** No custom events; relies on component-level event propagation (e.g., `pickable` emits `onpicked`).
