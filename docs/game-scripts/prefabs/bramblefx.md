---
id: bramblefx
title: Bramblefx
description: Creates visual effect entities that deal contact damage to nearby enemies within a growing radius, typically used for thorn-based armor or trap damage.
tags: [combat, fx, damage]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6ee604ba
system_scope: fx
---

# Bramblefx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bramblefx` is a prefab factory function that generates FX entities responsible for simulating thorn-like area-of-effect damage. These FX entities grow their effect radius over time (up to a maximum of `3` units) and repeatedly check for valid combat targets within that radius. When a target is found and meets damage criteria, it triggers `combat:GetAttacked`, optionally treating the FX as a direct attacker or deferring to an assigned owner. The FX is typically attached to wearable items (e.g., armor) or static traps and is not persisted across sessions.

## Usage example
```lua
-- Create and configure a bramblefx armor effect
local fx = MakePrefabInstance("bramblefx_armor", TheWorld, x, y, z)
fx:SetFXOwner(player) -- Attaches to player; damage may originate from player or FX
```

## Dependencies & tags
**Components used:** `updatelooper`
**Tags added:** `FX`, `thorny`, `trapdamage` (only for `bramblefx_trap`)
**Tags checked in filtering:** `bramble_resistant`, `INLIMBO`, `notarget`, `noattack`, `flight`, `invisible`, `wall`, `player`, `playerghost`, `_combat`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `range` | number | `0.75` | Current radius (in world units) for damage application; increases by `0.75` per update. |
| `damage` | number | `TUNING.ARMORBRAMBLE_DMG` or `TUNING.TRAP_BRAMBLE_DAMAGE` | Physical damage dealt per hit. |
| `spdmg` | table or nil | `{ planar = TUNING.ARMORBRAMBLE_DMG_PLANAR_UPGRADE }` (for upgrade) | Planar damage table; `nil` for non-planar variants. |
| `owner` | entity or nil | `nil` | Entity that "owns" the FX; used to determine attack origin (e.g., player wearing armor). |
| `canhitplayers` | boolean | `true` | Whether the FX can damage players; controlled by PvP setting and owner tag. |
| `ignore` | table | `{}` | A dictionary of entity instances to skip when checking for damage targets. |

## Main functions
### `SetFXOwner(inst, owner)`
*   **Description:** Attaches the FX entity to a specified owner (e.g., player wearing armor), syncs position, sets PvP awareness, and adds the owner to the ignore list.
*   **Parameters:** `owner` (entity) — the entity that is the source of the effect.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove()` to clean up the FX entity after its animation completes.
- **Pushes:** None (no `PushEvent` calls in the source).