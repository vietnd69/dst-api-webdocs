---
id: willow_flame_fx
title: Willow Flame Fx
description: Creates and manages visual and gameplay effects for Willow's shadow flame projectiles, flamethrower projectiles, and frenzy visual effects.
tags: [combat, fx, willow, projectile]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dd3f19a7
system_scope: fx
---

# Willow Flame Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`willow_flame_fx.lua` defines three prefabs used by Willow's abilities: `willow_shadow_flame` (shadow fire projectiles), `willow_throw_flame` (flamethrower projectiles), and `willow_frenzy` (frenzy visual effect). Each prefab is a non-persistent FX entity with dedicated behavior: shadow flames seek targets and explode on close contact, throw flames are transient projectiles, and the frenzy FX rotates and animates on the ground. It leverages components like `firefx`, `weapon`, `planardamage`, `damagetypebonus`, and `updatelooper` to integrate into combat and rendering systems.

## Usage example
```lua
-- Spawn a shadow flame with a target and duration
local flame = SpawnPrefab("willow_shadow_flame")
flame.Transform:SetPosition(x, y, z)
flame:settarget(target, 10, source)

-- Spawn a throw flame
local throw = SpawnPrefab("willow_throw_flame")
throw.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `firefx`, `weapon`, `planardamage`, `damagetypebonus`, `updatelooper`, `combat`, `follower`, `shadowsubmissive`  
**Tags added:** `FX`, `NOCLICK`, `willow_shadow_flame` (shadow flame only), `player` (via source), `hostile` (via target check)  
**Tags checked:** `_health`, `_combat`, `INLIMBO`, `invisible`, `noattack`, `notarget`, `flight`

## Properties
No public properties defined in this file.

## Main functions
This file defines no component methods directly; instead, it defines prefab factory functions (`shadowfn`, `throwfn`, `frenzyfn`) and helper functions. The `settarget` function is attached as a method on shadow flame instances.

### `settarget(inst, target, life, source)`
*   **Description:** Recursive target-locking and projectile-spawning function for shadow flames. Acquires the closest valid hostile target within range, spawns a new shadow flame if life > 0, or triggers an explosion if close enough to the target.
*   **Parameters:** 
    *   `inst` (Entity) — the shadow flame entity.
    *   `target` (Entity or nil) — current tracked target.
    *   `life` (number) — remaining number of hops before fade-out.
    *   `source` (Entity) — the Willow entity that spawned this flame.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `life <= 0`. If `source` is invalid or `source.components.combat` is missing, `target` is reset to nil.

## Events & listeners
- **Listens to:** `animover` (shadow flame and throw flame only) — removes the entity when its animation completes.
- **Pushes:** `willow_frenzy._kill` (network event) — triggers `OnFrenzyKilled` on all clients.
- **Listens to (frenzy only):** `killdirty` — triggers `OnFrenzyKilled`.