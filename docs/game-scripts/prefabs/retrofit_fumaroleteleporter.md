---
id: retrofit_fumaroleteleporter
title: Retrofit Fumaroleteleporter
description: Spawns a pair of linked wormholes to retrofit fumarole teleporter functionality in the game world, primarily for connecting cave zones via Tier4 tasks.
tags: [teleport, worldgen, cave, utility]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b7d240d4
system_scope: world
---

# Retrofit Fumaroleteleporter

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`retrofit_fumaroleteleporter` is a helper prefab used during world initialization to retroactively establish teleporter links between fumarole locations in the Caves and the main surface world. It does not persist as an active entity in gameplay, but instead executes a one-time setup routine via its `DoRetrofitting` method — spawning two `wormhole` prefabs linked bidirectionally via the `teleporter` component. This is used to ensure legacy or procedurally placed terrain features can participate in DST’s teleporter system without requiring manual world editing.

## Usage example
```lua
local inst = SpawnPrefab("retrofit_fumaroleteleporter")
inst.DoRetrofitting(inst, {x = 50, y = 0, z = -30})  -- Force spawn at world coordinates
-- or
inst.DoRetrofitting(inst)  -- Auto-select a valid Tier4 task node
```

## Dependencies & tags
**Components used:** None directly — but it spawns and configures `wormhole` prefabs (which use the `teleporter` component).
**Tags:** Adds `CLASSIFIED`, `NOCLICK`, `NOBLOCK` to itself only.

## Properties
No public properties.

## Main functions
### `DoRetrofitting(inst, force_pt)`
*   **Description:** Spawns two linked wormholes to retrofit teleporter access at or near the fumarole’s location. If `force_pt` is `nil`, it searches for valid spawn points in cave areas tagged with `KEYS.TIER4` and `KEYS.CAVE` in the world topology. If `force_pt` is provided, it places the wormhole at the exact coordinates.
*   **Parameters:**
    *   `inst` (entity) — the `retrofit_fumaroleteleporter` instance (implicitly the `self` context).
    *   `force_pt` (`{x, y, z}` or `nil`) — optional point table with numeric `x`, `y`, `z` keys for exact placement; if `nil`, auto-generates placement.
*   **Returns:** `true` if both wormholes were successfully spawned and linked; `false` otherwise.
*   **Error states:** Returns `false` if no valid point is found, if spawning `wormhole` fails, or if the `force_pt` table is malformed (e.g., missing `x`, `y`, or `z` keys).

## Events & listeners
None.