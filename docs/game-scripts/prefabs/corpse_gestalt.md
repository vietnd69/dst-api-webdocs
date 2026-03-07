---
id: corpse_gestalt
title: Corpse Gestalt
description: A flying lunar-aligned entity that spawns near players to track and interact with a target entity, utilizing rifts when available for teleportation.
tags: [lunar, entity, tracking, boss]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0c095759
system_scope: entity
---

# Corpse Gestalt

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`corpse_gestalt` is a prefab representing a flying, lunar-aligned entity (commonly known as the "Corpse Gestalt") used in DST's lunar cycle mechanics. It spawns near players and tracks a designated target entity, teleporting to a rift portal if one is nearby and aligned with lunar affinity; otherwise, it spawns at a walkable offset from the target. The entity depends heavily on the `entitytracker`, `locomotor`, and `sanityaura` components for its core behavior, and integrates with the rift system via ` RiftSpawner:GetRiftsOfAffinity()`. It is typically instantiated as a boss or event-driven entity tied to lunar phases.

## Usage example
```lua
-- Typical usage when spawning the entity during a lunar event:
local inst = Prefab("corpse_gestalt", fn, assets)()
if inst and inst:IsValid() then
    inst:SetTarget(target_entity)
    inst.Spawn()
end
```

## Dependencies & tags
**Components used:** `entitytracker`, `sanityaura`, `locomotor`, `knownlocations`, `transform`, `animstate`, `soundemitter`, `network`, `physics`  
**Tags added:** `brightmare`, `NOBLOCK`, `soulless`, `lunar_aligned`

## Properties
No public properties exposed directly on the instance beyond standard component properties (`inst.components.sanityaura.aura`, etc.). The prefab function returns an entity instance with runtime properties such as `inst.Spawn` and `inst.SetTarget`, which are assigned as methods on the entity.

## Main functions
### `SetTarget(inst, target)`
*   **Description:** Assigns the entity to track `target`. If valid, it begins tracking the target and spawns the gestalt either at a rift with lunar affinity or at a nearby walkable position. If `target` is `nil` or invalid, tracking is removed.
*   **Parameters:** `target` (entity instance or `nil`) — the entity to track.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `target` is invalid; does not error but skips rift-based spawn if no suitable rift is found.

### `Spawn(inst)`
*   **Description:** Initializes the entity’s orientation and transitions its stategraph to the `"spawn"` state.
*   **Parameters:** None (uses `inst`).
*   **Returns:** Nothing.

### `GetFirstLunarRift()`
*   **Description:** Utility function that returns the first rift portal with lunar affinity, if any exist in the world.
*   **Parameters:** None.
*   **Returns:** Entity instance or `nil`.

### `GeSpawnPoint(inst, target)`
*   **Description:** Calculates a nearby walkable spawn position for the gestalt relative to the target, avoiding obstacles and ocean tiles.
*   **Parameters:** `target` (entity instance) — used to compute base spawn position.
*   **Returns:** Vector3 spawn position.

### `GetRiftToSpwanFrom()`
*   **Description:** Scans all players and returns the first rift with lunar affinity that is within the camera see distance of any player. Note: Contains a typo (`Spwan` vs `Spawn`) in the original source.
*   **Parameters:** None.
*   **Returns:** Rift entity instance or `nil`.

## Events & listeners
- **Listens to:** `onremove` (via `EntityTracker:TrackEntity`) — to automatically forget a tracked target when it is removed from the world.
- **Pushes:** No events directly; relies on stategraph transitions (`"spawn"`) and component interactions for side effects.