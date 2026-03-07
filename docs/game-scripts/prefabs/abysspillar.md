---
id: abysspillar
title: Abysspillar
description: Manages the lifecycle, state transitions, collision behavior, and pathfinding integration for abyss pillars in the game world.
tags: [platform, collision, world, pathfinding, boss]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a46d7deb
system_scope: world
---

# Abysspillar

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`abysspillar` is a prefabricated entity component that implements the logic for abyss pillars — dynamic, collapsible walkable platforms in the game. It integrates with the `walkableplatform` component to detect entities on the pillar, manages state transitions (e.g., `EMPTY` → `OCCUPIED` → `WARNING` → `COLLAPSE`), handles player-specific collapse timers, and integrates with the world pathfinding system. It also creates and manages dedicated non-networked physics entities for player and item collisions, and coordinates with `abysspillargroup` to track pillar formation and collapse chains.

## Usage example
```lua
local pillar = SpawnPrefab("abysspillar")
pillar.Transform:SetPosition(x, 0, z)
pillar.components.walkableplatform:StartUpdating()
-- When a player steps onto the pillar, the component detects it automatically.
-- The pillar automatically transitions to OCCUPIED and schedules collapse after a delay.
```

## Dependencies & tags
**Components used:** `walkableplatform`, `drownable`, `locomotor`, `abysspillargroup`
**Tags:** Adds `NOCLICK`, `ignorewalkableplatforms`, `abysspillar`, `teeteringplatform`. Uses `walkableplatform_full` dynamically.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `state` | number | `PillarStates.EMPTY` | Current state of the pillar; one of `EMPTY`, `OCCUPIED`, `WARNING`, `COLLAPSE`, `FORMING`, `FORMING_DELAY`, `FORMING_ABOVE` (from `PillarStates`). |
| `nocollapse` | boolean | `nil` | If `true`, pillar will not collapse when vacated. Set via `MakeNonCollapsible`. |
| `flipped` | boolean | `nil` | Indicates if the pillar’s visual mesh is horizontally flipped. |
| `player_collision` | Entity or `nil` | `nil` | Dedicated non-networked physics entity for player collision detection. |
| `item_collision` | Entity or `nil` | `nil` | Dedicated non-networked physics entity for item collision detection. |
| `_abysspillargroup` | AbyssPillarGroup instance or `nil` | `nil` | Reference to the group this pillar belongs to. |

## Main functions
### `AlignToTile(x, y, z)`
*   **Description:** Aligns the pillar to the center of the tile and updates its collision entities’ positions accordingly. Typically called when the pillar is repositioned.
*   **Parameters:** Not applicable — bound to `inst` as `inst:AlignToTile()`.
*   **Returns:** Nothing.

### `AlignToWall()`
*   **Description:** Snaps the pillar position to the nearest wall tile center (`(floor(x)+0.5, floor(z)+0.5)`), aligning it flush with walls. Updates collision entities.
*   **Parameters:** Not applicable — bound to `inst` as `inst:AlignToWall()`.
*   **Returns:** Nothing.

### `Flip()`
*   **Description:** Horizontally flips the pillar’s visual mesh and propagate the flip to child `abovefx` if present.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Sets `inst.flipped = true`.

### `CollapsePillar()`
*   **Description:** Immediately triggers pillar collapse: spawns FX, teleports entities on the platform, and removes the pillar entity.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if the pillar is already `COLLAPSE`; handles entities via `drownable` component’s teleport logic.

### `MakeNonCollapsible()`
*   **Description:** Prevents the pillar from collapsing upon entity vacating. Also calls `AlignToWall()` and registers the pillar in the pathfinding system.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnAddPlatformFollower(inst, child)`
*   **Description:** Event handler for an entity stepping onto the pillar. Triggers `OCCUPIED` state if `EMPTY`, schedules warning/collapse timer for players, and fires `startteetering` event.
*   **Parameters:** `inst` (entity), `child` (entity stepping onto the pillar).
*   **Returns:** Nothing.

### `OnRemovePlatformFollower(inst, child)`
*   **Description:** Event handler for an entity leaving the pillar. Cancels timers and may trigger immediate or delayed `COLLAPSE` state depending on `nocollapse`. Fires `stopteetering` event.
*   **Parameters:** `inst` (entity), `child` (entity leaving the pillar).
*   **Returns:** Nothing.

### `TryToReservePlatform(inst, ent)`
*   **Description:** Attempts to reserve the platform for `ent` when entering. Registers teleport override (via `drownable:PushTeleportPt`) to ensure safe landing if falling into the abyss.
*   **Parameters:** `inst` (the pillar), `ent` (the entity stepping on).
*   **Returns:** `true` if reservation succeeded, `false` otherwise.
*   **Error states:** Only reserves if `state == EMPTY` and platform is not full.

### `TryToClearReservedPlatform(inst, ent)`
*   **Description:** Clears a reservation if the platform is full but entering entity is leaving before state change.
*   **Parameters:** `inst` (the pillar), `ent` (the entity).
*   **Returns:** `true` if cleared, `false` otherwise.

## Events & listeners
- **Listens to:** `animover` (client: `fx_Finish`), `onispathfindingdirty` (`OnIsPathFindingDirty`), `onremove` (on pillar and followers via `abysspillargroup`).
- **Pushes:** `startteetering`, `stopteetering`, `abysspillar_playeroccupied`, `abysspillar_playervacated`, `onfallinvoid` (to entities on the pillar during collapse).