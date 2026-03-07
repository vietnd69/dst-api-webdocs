---
id: icefishing_hole
title: Icefishing Hole
description: Creates a stationary environmental hazard that repels players and triggers knockback upon proximity.
tags: [environment, hazard, physics, interaction]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8e920879
system_scope: environment
---

# Icefishing Hole

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `icefishing_hole` prefab represents a stationary environmental feature—typically appearing in frozen or aquatic zones—that actively prevents players from entering its radius. It uses a custom triangle mesh collision setup for realistic physical interaction, adds several strategic tags for gameplay logic (e.g., pathfinding blockers), and leverages the `playerprox` component to detect and repel nearby players via knockback and position correction. Though named for fishing, it functions primarily as a forcefield-like barrier.

## Usage example
```lua
local inst = SpawnPrefab("icefishing_hole")
inst.Transform:SetPosition(x, 0, z)
```
This spawns and places the entity at world coordinates `(x, z)` on the surface layer. The component does not need to be manually added—it is fully initialized in the prefab’s `fn()` constructor.

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `SoundEmitter`, `MiniMapEntity`, `Network`, `Physics`, `PlayerProx`
**Tags:** Adds `pond`, `antlion_sinkhole_blocker`, `birdblocker`, `NOCLICK`, `virtualocean`, `oceanfishingfocus`, `groundhole`, `ignorewalkableplatforms`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_hole_radius` | number | `1.7` (set in `fn()`) | Radius of the hole's effect zone. Used for proximity detection and repulsion calculations. |

## Main functions
### `build_hole_collision_mesh(radius, height, segment_count)`
*   **Description:** Generates a triangle mesh representing a cylindrical hole for physics collision. Used to define a physically solid barrier with a hollow core (like a pit).
*   **Parameters:** `radius` (number), `height` (number), `segment_count` (number) — controls the radial resolution of the cylinder.
*   **Returns:** A flat table of vertex coordinates (`x, y, z`) triplets forming the mesh triangles.

### `CheckForFixed(player, inst)`
*   **Description:** Ensures players are pushed *outside* the hole’s radius after being knocked back, even if they ignore knockback logic. Runs after a delay if needed.
*   **Parameters:** `player` (entity), `inst` (the hole entity).
*   **Returns:** Nothing. Modifies `player.Transform:SetPosition` to reposition the player radially outside the hole.

### `OnPlayerNear(inst, player)`
*   **Description:** Triggered when a player enters the hole’s proximity zone. Applies knockback, spawns a visual splash effect, and schedules `CheckForFixed` for safety enforcement.
*   **Parameters:** `inst` (the hole entity), `player` (entity).
*   **Returns:** Nothing. Fires `attacked` and `knockback` events on the player, and initiates a delayed task.

## Events & listeners
- **Listens to:** `playerprox` events — specifically, when a player enters the proximity radius (handled via `SetOnPlayerNear(OnPlayerNear)` on the `playerprox` component).
- **Pushes:** none directly, but triggers `attacked` and `knockback` events on the affected player entity via `player:PushEvent(...)`.