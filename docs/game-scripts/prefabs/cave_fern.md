---
id: cave_fern
title: Cave Fern
description: A destructible ground foliage prop that can be picked for resources and burned, using the pickable and burnable systems.
tags: [environment, interactible, resource]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9d318dcb
system_scope: environment
---

# Cave Fern

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cave_fern` is a non-player entity prefab representing decorative and harvestable foliage found in caves. It uses the `pickable` component to allow players to harvest it for `foliage`, and integrates with DST’s burn and ignite systems for environmental interactivity. As a prefabricated asset, it is defined via a factory function `fn()` that constructs the entity, sets up animations, components, and save/load hooks, and returns a fully configured `Prefab`.

## Usage example
```lua
-- Typical usage within a level generator or worldgen task
local inst = SpawnPrefab("cave_fern")
inst.Transform:SetPosition(x, y, z)
inst:AddTag("plant")
```

## Dependencies & tags
**Components used:** `pickable`, `inspectable`
**Tags:** None explicitly added or removed. The `MakeSmallBurnable`, `MakeSmallPropagator`, and `MakeHauntableIgnite` helper functions modify internal behavior but do not add new tags.

## Properties
No public properties are defined in the constructor. The `animname` is assigned but is internal state.

## Main functions
Not applicable. This is a prefab factory, not a component. No component-level methods are defined.

## Events & listeners
- **Listens to:** None directly.
- **Pushes:** None directly.
- **Save/Load hooks:**
  - `onsave(inst, data)` — serializes `inst.animname` into the `data.anim` field.
  - `onload(inst, data)` — restores `animname` and replays the animation if present in loaded `data`.

> **Note:** The `pickable` component contributes its own events (`onpick`, `onregen`, etc.) and listeners internally, but `cave_fern` does not register additional event handlers beyond save/load hooks.
