---
id: oasislake
title: Oasislake
description: Represents a dynamic water source in the Desert biome that can dry up during sandstorms and regrow vegetation afterward.
tags: [environment, water, weather]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 834c4791
system_scope: environment
---

# Oasislake

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`oasislake` is a static environmental prefab representing a desert oasis lake. It functions as a `watersource`, `fishable` entity with dynamic behavior tied to the world's sandstorm system. During active sandstorms, the lake freezes (becomes non-clickable, unfishable, and unavailable as a water source) and gradually dries up. When the sandstorm ends and the lake is wet again, it refills, thaws, and triggers regrowth of succulents and fireflies (via `SpawnSucculents` and `SpawnOasisBugs`). It also integrates with the `pointofinterest` system to render a custom minimap icon and height.

## Usage example
```lua
-- In a worldgen or modded prefab, spawn the oasis lake prefab:
local oasis = SpawnPrefab("oasislake")
oasis.Transform:SetPosition(x, y, z)

-- The component interactions are automatic and triggered by the world's sandstorm state.
-- Manual tuning via tuning values is possible (e.g., TUNING.OASISLAKE_MAX_FISH).
```

## Dependencies & tags
**Components used:** `fishable`, `hauntable`, `oasis`, `watersource`, `pointofinterest`, `inspectable`, `physics`  
**Tags added:** `watersource`, `birdblocker`, `antlion_sinkhole_blocker`, `allow_casting`, `NOCLICK` (added during sandstorms)  
**Tags checked:** `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `playerghost`, `ghost`, `flying`, `structure`, `succulent`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isdamp` | boolean | `false` | True when the lake is currently wet/damp. |
| `driedup` | boolean | `false` | True after the lake has dried up (once per drying cycle). |
| `regrowth` | boolean | `false` | True if regrowth (fireflies and succulents) should be triggered on sandstorm end. |
| `filltask` | task | `nil` | Deferred task used to retry lake refilling if blocked. |

## Main functions
### `SpawnOasisBugs(inst)`
*   **Description:** Spawns up to three `fireflies` entities around the oasis to simulate ambient bugs. Positions are calculated relative to existing fireflies and the lake center.
*   **Parameters:** `inst` (entity) — the oasis lake instance.
*   **Returns:** Nothing.
*   **Error states:** No explicit failure paths; relies on `SpawnPrefab` success.

### `SpawnSucculents(inst)`
*   **Description:** Spawns succulent plants around the lake within a ring between `WATER_RADIUS + 0.5` and `SUCCULENT_RANGE`, up to `MAX_SUCCULENTS`. Ensures no overlapping entities via `FindWalkableOffset`.
*   **Parameters:** `inst` (entity) — the oasis lake instance.
*   **Returns:** Nothing.
*   **Error states:** Skips a succulent if `FindWalkableOffset` returns `nil`.

### `OnIsWetChanged(inst, iswet, skipanim)`
*   **Description:** Updates the lake’s animation state and `isdamp` flag in response to changes in world wetness (`iswet`). Handles transitions between dry, drying, wet, and idle animations.
*   **Parameters:**  
  `inst` (entity) — the oasis lake instance.  
  `iswet` (boolean) — current world wet state.  
  `skipanim` (boolean) — whether to skip animation transitions (e.g., on initial load).
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `skipanim` is `true` and the lake is already in the target state.

### `TryFillLake(inst, skipanim, OnSandstormChanged)`
*   **Description:** Attempts to refill the lake when sandstorms end. Blocks if physics colliders (e.g., structures) are on the lake. If blocked, schedules a retry after 5 seconds. Once clear, restores wet state and updates collision.
*   **Parameters:**  
  `inst` (entity) — the oasis lake instance.  
  `skipanim` (boolean) — whether to skip animation transitions.  
  `OnSandstormChanged` (function) — callback for state changes.
*   **Returns:** Nothing.
*   **Error states:** May reschedule itself via `filltask` if blockers are present.

### `OnSandstormChanged(inst, active, skipanim)`
*   **Description:** Core sandstorm handler. Freezes the lake (disables water source, fishable, and clickability) when active and triggers refilling and regrowth when inactive.
*   **Parameters:**  
  `inst` (entity) — the oasis lake instance.  
  `active` (boolean) — whether a sandstorm is currently active.  
  `skipanim` (boolean) — whether to skip animations.
*   **Returns:** Nothing.
*   **Error states:** Canceling `filltask` ensures no race conditions if a storm reactivates.

### `GetFish(inst, fisherman)`
*   **Description:** Determines what loot to drop when fishing from the oasis. Uses luck-based logic to optionally yield a `wetpouch` instead of the default `pondfish`.
*   **Parameters:**  
  `inst` (entity) — the oasis lake instance (unused in function body, passed for API consistency).  
  `fisherman` (entity) — the entity performing the fishing action.
*   **Returns:** `"wetpouch"` or `"pondfish"` (string).
*   **Error states:** Returns `nil` only if `TryLuckRoll` does so (rare in practice).

## Events & listeners
- **Listens to:** `ms_stormchanged` (on `TheWorld`) — triggers `OnSandstormChanged` when the global sandstorm state changes.
- **Pushes:** `ms_registeroasis` (on `TheWorld`) — registers this oasis with the world for tracking or event purposes during initialization.