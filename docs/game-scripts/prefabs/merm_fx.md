---
id: merm_fx
title: Merm Fx
description: Creates visual effects for merm lunar thorns that deal damage to nearby enemies within an expanding radius, with owner-aware targeting logic.
tags: [fx, combat, merm]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4234e3b9
system_scope: fx
---

# Merm Fx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`merm_fx` defines two prefabs used for merm-related visual and mechanical effects: the `lunarmerm_thorns_fx` effect (an expanding damage field) and the `merm_soil_marker` (a temporary blocker). The thorns effect is typically attached to a merm and expands its radius over time, damaging non-ally entities within range while respecting PvP rules and leader relationships. It relies heavily on the `updatelooper`, `combat`, and `follower` components for execution and targeting.

## Usage example
```lua
-- To spawn the thorns effect attached to an owner (e.g., a merm)
local fx = SpawnPrefab("lunarmerm_thorns_fx")
if fx ~= nil and fx.components.updatelooper then
    fx:SetFXOwner(merm_character)
end

-- The thorns will automatically expand, deal damage, and remove themselves
-- when radius reaches MAXRANGE (3 units)
```

## Dependencies & tags
**Components used:** `updatelooper`, `combat`, `follower`
**Tags added:** `FX`, `thorny`, `NOBLOCK`, `merm_soil_blocker`
**Tags checked (via `HasTag`/`HasDebuff`):** `player`, `merm`, `INLIMBO`, `notarget`, `noattack`, `flight`, `invisible`, `wall`, `playerghost`, `player`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage` | number | `TUNING[damage]` | Damage dealt per update cycle (e.g., from `TUNING.MERM_LUNAR_THORN_DAMAGE`) |
| `range` | number | `0.75` | Current radius of effect; increases by `0.75` per update |
| `ignore` | table | `{}` | Map of entity instances to ignore (prevents repeated hits per frame) |
| `canhitplayers` | boolean | `true` | Whether the effect can damage players; set based on owner tag and PvP settings |
| `owner` | Entity or nil | `nil` | Entity that owns the effect; used for targeting and damage attribution |
| `spdmg` | nil | `nil` | Special damage type (never assigned in source — unused) |

## Main functions
### `SetFXOwner(inst, owner)`
* **Description:** Attaches the effect to a specific entity (the owner), positions the FX at the owner’s location, sets PvP validity, and excludes the owner from damage. Enables bloom effect if owner has the `wurt_merm_planar` debuff.
* **Parameters:** 
  * `inst` (Entity) — the FX entity instance.
  * `owner` (Entity) — the entity that will own this effect.
* **Returns:** Nothing.

### `OnUpdateThorns(inst)`
* **Description:** Called each frame via `updatelooper` to expand the effect radius and damage eligible targets within range. Handles leader-based alliance checks, PvP logic, and ignores entities after first hit. Stops updating when `range >= MAXRANGE`.
* **Parameters:** 
  * `inst` (Entity) — the FX entity instance.
* **Returns:** Nothing.
* **Error states:** 
  * No-op if `owner` is invalid and `inst.owner` is not reset.
  * Does not damage targets already in `inst.ignore`.
  * Does not damage if target is not visible, invalid, or has a blocking tag.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove` to clean up the FX when animation completes.
- **Pushes:** None.