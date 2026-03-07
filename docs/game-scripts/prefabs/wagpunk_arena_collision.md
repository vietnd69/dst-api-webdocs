---
id: wagpunk_arena_collision
title: Wagpunk Arena Collision
description: Creates non-solid physics collision boundaries for the Wagpunk arena with client-side particle effects and entity ejection logic for intruders.
tags: [physics, collision, fx, arena, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c1e9f008
system_scope: physics
---

# Wagpunk Arena Collision

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines two prefabs: `wagpunk_arena_collision` and `wagpunk_arena_collision_oneway`. These prefabs create invisible physics boundaries around the Wagpunk arena using triangle meshes generated from `WAGPUNK_ARENA_COLLISION_DATA`. The main variant enforces non-solid collision (no physical blockage) while triggering particle effects and periodic entity removal for entities within the arena. The `oneway` variant ejects entities that attempt to move *into* the arena (e.g., when blocked by the barrier), using `locomotor.pathcaps.ignoreLand` to avoid ejecting flying entities. It does not generate client-side FX (handled by the main variant on clients). Both variants are non-persistent, non-solid, and interact with the `Map` API to determine arena occupancy.

## Usage example
```lua
-- Create the main arena boundary (client-side FX + entity ejection)
local arena = SpawnPrefab("wagpunk_arena_collision")
arena.Transform:SetPosition(0, 0, 0)

-- Create the one-way barrier (ejects entities trying to enter)
local barrier = SpawnPrefab("wagpunk_arena_collision_oneway")
barrier.Transform:SetPosition(0, 0, 0)

-- Trigger entity removal within the barrier area (on mastersim)
if TheWorld.ismastersim then
    arena.DestroyEntitiesInBarrier()
end
```

## Dependencies & tags
**Components used:** `Physics` (mass, collision group/mask, triangle mesh, callback), `Transform`, `AnimState`, `Network`  
**Tags:** Adds `NOBLOCK`, `ignorewalkableplatforms`, `CLASSIFIED`, `NOCLICK` (FX only)  
**External data dependencies:** `WAGPUNK_ARENA_COLLISION_DATA`, `TUNING.WAGPUNK_ARENA_COLLISION_NOBUILD_THICKNESS`, `Lerp`, `TheWorld.Map`, `DestroyEntity`, `TheSim:FindEntities`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `oneway_size` | number | `0.4` (only on `oneway` variant) | Offset applied to arena collision mesh vertices to prevent corner overlaps with terrain. |
| `clientbarrierfx` | entity or nil | `nil` | Client-side FX entity shown when player is very close (commented out in current logic). |
| `clientbarrierfxcooldowntask` | task or nil | `nil` | Task managing cooldown before re-enabling close-player FX (commented out). |
| `currentclientfxindex` | number | `1` | Tracks the next particle spawn index for circling arena FX. |
| `updateclientfxtask` | task or nil | `nil` | Periodic task (0.75s) that regenerates client FX when awake. |

## Main functions
### `BuildWagpunkArenaMesh(offset)`
*   **Description:** Constructs a triangle mesh from `WAGPUNK_ARENA_COLLISION_DATA` by triangulating consecutive line segments into vertical planes. The height spans from `y=0` to `y=7` to contain flying entities.
*   **Parameters:** `offset` (number) — optional scalar offset applied to x/z coordinates of each vertex (used for `oneway` variant).
*   **Returns:** Array of numbers — interleaved triangle vertex coordinates `[x0,y0,z0, x1,y1,z1, ...]`.

### `CreateFX_Oneshot(inst, closestindex, bias, index_total)`
*   **Description:** Spawns a single short-lived particle FX at a random position along a segment of the arena boundary.
*   **Parameters:** `inst` (entity) — the arena collision entity, `closestindex` (number) — nearest arena point index to the player, `bias` (number) — random offset range, `index_total` (number) — total points in `WAGPUNK_ARENA_COLLISION_DATA`.
*   **Returns:** `nil`. Side effect: spawns an FX entity parented to `inst`.

### `UpdateClientFX(inst)`
*   **Description:** Generates client-side particle effects based on player position. Spawns "focused" FX near the player’s closest arena point, and "circling" FX at fixed intervals around the arena.
*   **Parameters:** `inst` (entity) — the arena collision entity.
*   **Returns:** `nil`.

### `DestroyEntitiesInBarrier(inst)`
*   **Description:** On mastersim, destroys non-persistent structures/walls fully inside the arena barrier (when barrier is up).
*   **Parameters:** `inst` (entity) — the arena collision entity.
*   **Returns:** `nil`.

### `TryToResolveGoodSpot(ent, map, ax, az, oneway_size)`
*   **Description:** Given an entity inside the one-way barrier, tries to find a safe ejection point by testing radial directions (NESW + diagonals) outward from its current position until a valid point inside the arena is found.
*   **Parameters:** `ent` (entity), `map` (map object), `ax`, `az` (arena center), `oneway_size` (number).
*   **Returns:** `x`, `z` (numbers) — new coordinates, or `nil, nil` on failure.

### `GetIn(ent, oneway_size)`
*   **Description:** Eject callback invoked on `oneway` collision. Teleports the colliding entity to a safe location inside the arena or to the center if no spot is found. Skips flying entities (`locomotor.pathcaps.ignoreLand`).
*   **Parameters:** `ent` (entity), `oneway_size` (number).
*   **Returns:** `nil`.

### `OnCollide_oneway(inst, other)`
*   **Description:** Physics collision callback for the `oneway` variant. Delegates entity ejection to `GetIn` via a deferred task (to avoid physics-thread issues).
*   **Parameters:** `inst` (arena entity), `other` (colliding entity).
*   **Returns:** `nil`.

## Events & listeners
- **Listens to (FX entities only):** `animqueueover`, `onremove`, `animover` — cleanupFX tasks.
- **Pushes:** None directly; `GetIn` triggers `cancelhop` internally via `sg:HandleEvent` when appropriate.
- **Stategraph events (via `OnEntitySleep`/`OnEntityWake`):** Manages `updateclientfxtask` lifecycle.
