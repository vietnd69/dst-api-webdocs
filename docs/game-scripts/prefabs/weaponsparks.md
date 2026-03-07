---
id: weaponsparks
title: Weaponsparks
description: Generates and manages non-networked visual effect entities for weapon impact sparks in the Lava Arena, using predefined animation assets and positional/orientation logic based on the weapon's state.
tags: [fx, combat, arena, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2b70488e
system_scope: fx
---

# Weaponsparks

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`weaponsparks` is not a component, but a *prefab factory* that creates reusable visual effect (FX) prefabs for weapon impact sparks used in the Lava Arena. It defines multiple variations (`normal`, `piercing`, `thrusting`, `bounce`) with distinct animation and positioning behaviors. Each generated prefab spawns a temporary, non-persistent, non-networked entity that plays a spark animation and auto-removes when complete. It relies on the `lavaarena_hit_sparks_fx` animation bank and shader for visual rendering.

## Usage example
```lua
-- Spawn normal weapon sparks at the position of a proxy entity
local sparks_prefab = Prefab("weaponsparks")
local entity = sparks_prefab()
entity.components.transform:SetPosition(x, y, z)

-- No direct component interaction is required; the FX entity self-manages playback and cleanup.
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX` to spawned entities via `inst:AddTag("FX")`. No tags are checked or removed.

## Properties
No public properties. The prefab factory produces prefabs; no component is instantiated on a persistent entity.

## Main functions
Not applicable.

## Events & listeners
- **Listens to:** `animover` — registered on FX entities to trigger `inst.Remove`, ensuring automatic cleanup after animation completion.
- **Pushes:** None identified.