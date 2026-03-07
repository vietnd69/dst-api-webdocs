---
id: wagboss_util
title: Wagboss Util
description: Utility module for managing lunar arena mechanics including fissures, lunar burn damage, and supernova line-of-sight blocking.
tags: [combat, boss, arena, utility]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bcd8ae4e
system_scope: combat
---

# Wagboss Util

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wagboss_util` is a shared utility module for the WagBoss (Alter Guardian) arena system. It provides helper functions for tracking and managing lunar fissures (arena hazards), calculating lunar burn damage with planar defense and equipment modifiers, and determining supernova blockage via line-of-sight checks against blocker entities. This module is not a component but a collection of stateful and pure functions used by prefabs and components related to the Lunar Boss arena.

## Usage example
```lua
local WagBossUtil = require("prefabs/wagboss_util")

-- Register or check a fissure
local id = WagBossUtil.TileCoordsToId(tx, ty)
if not WagBossUtil.HasFissure(id) then
    local fissure = WagBossUtil.SpawnFissureAtXZ(x, z, id, tx, ty)
end

-- Check supernova visibility
local blockers = WagBossUtil.FindSupernovaBlockersNearXZ(x, z)
if not WagBossUtil.IsSupernovaBlockedAtXZ(srcx, srcz, x, z, blockers) then
    -- Apply supernova damage
end
```

## Dependencies & tags
**Components used:** `spdamageutil`, `damagetyperesist`, `inventory`, `rideable`  
**Tags:** `lunarsupernovablocker` (used for `FindEntities` query)  
**Flags:** `LunarBurnFlags.GENERIC`, `NEAR_SUPERNOVA`, `SUPERNOVA`, `ALL`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `LunarBurnFlags.GENERIC` | number | `0x1` | Generic lunar burn damage flag. |
| `LunarBurnFlags.NEAR_SUPERNOVA` | number | `0x2` | Damage flag for near-supernova effect. |
| `LunarBurnFlags.SUPERNOVA` | number | `0x4` | Direct supernova damage flag. |
| `LunarBurnFlags.ALL` | number | `0x7` | Bitmask covering all lunar burn damage flags. |
| `SupernovaNoArenaRange` | number | `24` | Maximum distance outside arena to prevent spawn. |
| `SupernovaNoArenaRangeSq` | number | `576` | Squared range (`24^2`) for optimized distance checks. |

## Main functions
### `TileCoordsToId(tx, ty)`
* **Description:** Converts tile coordinates to a canonical string ID (`"tx.ty"`), used to uniquely identify fissure locations.
* **Parameters:** `tx` (number) - tile X coordinate; `ty` (number) - tile Y coordinate.
* **Returns:** string — the formatted ID (e.g., `"3.-5"`).
* **Error states:** None.

### `IdToTileCoords(id)`
* **Description:** Parses a fissure ID back into tile coordinates.
* **Parameters:** `id` (string) — the fissure ID (e.g., `"3.-5"`).
* **Returns:** two numbers — `tx`, `ty`.

### `SpawnFissureAtXZ(x, z, id, tx, ty)`
* **Description:** Spawns and registers a fissure prefab at the given world position, associating it with a unique tile-based ID.
* **Parameters:**  
  - `x` (number) — world X position  
  - `z` (number) — world Z position  
  - `id` (string) — fissure ID (tile coordinate string)  
  - `tx` (number) — tile X  
  - `ty` (number) — tile Y  
* **Returns:** `inst` — the spawned fissure entity.
* **Error states:** Asserts if the ID is already registered in dev builds.

### `DespawnFissure(fissure, anim)`
* **Description:** Safely removes a fissure, playing a post-death animation first. Handles removal during loading (`POPULATING`) or sleep states.
* **Parameters:**  
  - `fissure` (inst) — fissure entity to remove  
  - `anim` (string) — base animation name (e.g., `"idle"`), used to build `anim.."_pst"`  
* **Returns:** Nothing.

### `OnLoadFissure(fissure)`
* **Description:** Registers a fissure during save/load to maintain state. Ensures no duplicate fissure IDs exist.
* **Parameters:** `fissure` (inst) — fissure entity being loaded.
* **Returns:** `true` if successfully registered; `false` if ID conflict detected (prints/Asserts in dev).
* **Error states:** May print or assert in dev if duplicate ID found.

### `HasFissure(id)`
* **Description:** Checks if a fissure with the given ID currently exists.
* **Parameters:** `id` (string) — fissure ID.
* **Returns:** boolean — `true` if fissure exists, `false` otherwise.

### `HasLunarBurnDamage(flags)`
* **Description:** Determines if a flag bitmask includes any actual damage-causing lunar burn (generic or supernova).
* **Parameters:** `flags` (number) — bitmask of `LunarBurnFlags`.
* **Returns:** boolean — `true` if `flags & (GENERIC | SUPERNOVA)` is non-zero.

### `CalcLunarBurnTickDamage(target, dps)`
* **Description:** Calculates per-frame lunar burn damage after applying planar defense, equipment, and saddle mitigations, plus resistances (e.g., `lunar_aligned`).
* **Parameters:**  
  - `target` (inst) — entity taking damage  
  - `dps` (number) — damage per second rate  
* **Returns:** number — tick damage (per frame) guaranteed ≥ `0`.
* **Details:**  
  - Aggregates defense from target, equipment (via `inventory.equipslots`), and saddle (via `rideable.saddle`).  
  - Applies defense reduction: `def / 4`.  
  - Multiplies incoming damage by resistances via `damagetyperesist:GetResistForTag("lunar_aligned")`.

### `FindSupernovaBlockersNearXZ(x, z)`
* **Description:** Finds entities tagged `lunarsupernovablocker` within a 4-unit radius of the position.
* **Parameters:** `x` (number) — world X; `z` (number) — world Z.
* **Returns:** array of entities — up to `FindEntities` limit.

### `IsSupernovaBlockedAtXZ(srcx, srcz, x, z, blockers)`
* **Description:** Checks if a supernova line from `(srcx, srcz)` to `(x, z)` is blocked by any blocker in `blockers`.
* **Parameters:**  
  - `srcx` (number) — source X  
  - `srcz` (number) — source Z  
  - `x` (number) — target X  
  - `z` (number) — target Z  
  - `blockers` (array) — list of blocker entities (e.g., from `FindSupernovaBlockersNearXZ`)  
* **Returns:** boolean — `true` if blocked, `false` otherwise.
* **Details:** Uses angular occlusion logic with blocker radius to determine if the line segment intersects.

## Events & listeners
- **Listens to:** `onremove` — registered on fissure prefabs to deregister them from internal tracking.
- **Pushes:** None. This module only contains utility functions and does not fire events itself.