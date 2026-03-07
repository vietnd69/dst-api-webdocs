---
id: nightsword_sharp_fx
title: Nightsword Sharp Fx
description: Spawns particle effects synchronized with weapon attack animations for the Nightsword, emitting smoke, sparks, and embers during combat.
tags: [fx, combat, animation, weapon]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 98823743
system_scope: fx
---

# Nightsword Sharp Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`nightsword_sharp_fx` is a particle-effect prefab that generates visual feedback during weapon attacks. It is attached to an entity and emits three types of particles — smoke, sparks, and embers — when its parent entity performs an attack animation (`"atk"`). The emitter positioning accounts for facing direction and uses a custom offset derived from camera vectors. It only runs on non-dedicated servers and clients; dedicated servers skip full initialization.

## Usage example
This prefab is typically instantiated automatically by the game when equipping or using the Nightsword weapon. It does not need to be manually added in mod code, but an example of referencing its emitter pattern is:

```lua
-- Example: Spawning the FX entity manually (rare; used for debugging or custom behavior)
local fx = Prefab("nightsword_sharp_fx")
local inst = SpawnPrefab("nightsword_sharp_fx")
inst.Transform:SetPosition(x, y, z)
-- Parent must have a 'rider' component and perform an 'atk' animation to trigger effects
inst.entity:SetParent(player)
```

## Dependencies & tags
**Components used:** `rider` (via `parent.components.rider:GetMount()`)
**Tags:** Adds `FX`

## Properties
No public properties are defined or exposed.

## Main functions
Not applicable — this is a prefab definition, not a component with callable methods. The `fn()` function is the constructor for the prefab and is not intended for direct external invocation.

## Events & listeners
- **Listens to:** None — the particle emission logic is driven by a time-based `EmitterManager` callback that checks animation state and parent entity state on each tick.
- **Pushes:** None — this entity does not fire any events.
