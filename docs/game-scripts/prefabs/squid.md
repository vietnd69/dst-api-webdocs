---
id: squid
title: Squid
description: A mobile aquatic predator that attacks enemies with ink projectiles, shares combat targets with nearby squids, and switches between land and water movement modes.
tags: [combat, ai, boss, aquatic, party]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b0a67cea
system_scope: entity
---

# Squid

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `squid` prefab represents a large, aggressive ocean-dwelling enemy in DST. It functions as a boss-like entity that uses ink-based projectile attacks, has amphibious locomotion, and coordinates with others in a herd via target sharing. The prefab defines its core behavior through components attached in its constructor `fncommon()`, including `combat`, `amphibiouscreature`, `locomotor`, `sleeper`, `follower`, and `oceanfishable`. It interacts heavily with other prefabs including `squidherd`, `squideyelight`, and ink-based FX effects.

## Usage example
```lua
-- Typical usage is via spawning the prefab directly
local squid = SpawnPrefab("squid")
squid.Transform:SetPosition(x, y, z)

-- Manually wake a sleeping squid
if squid.components.sleeper:IsAsleep() then
    squid.components.sleeper:WakeUp()
end

-- Set a new combat target
squid.components.combat:SetTarget(some_target_entity)

-- Check if squid is fully hooked by a fishing line
local is_fully_hooked = not squid:HasTag("partiallyhooked")
```

## Dependencies & tags
**Components used:** `amphibiouscreature`, `burnable`, `combat`, `complexprojectile`, `debuff`, `eater`, `embarker`, `follower`, `health`, `herdmember`, `homeseeker`, `locomotor`, `lootdropper`, `oceanfishable`, `sanityaura`, `sleeper`, `inspectable`, `spawnfader`, `entitytracker`, `knownlocations`, `timer`, `fader`, `light`, `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `network`, `fader`

**Tags:** Adds `scarytooceanprey`, `monster`, `squid`, `herdmember`, `likewateroffducksback`, `FX`, `NOCLICK`. Checks tags: `squid`, `partiallyhooked`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sounds.attack` | string | `"hookline/creatures/squid/attack"` | Sound path for attack sound. |
| `sounds.bite` | string | `"hookline/creatures/squid/gobble"` | Sound path for bite sound. |
| `sounds.death` | string | `"hookline/creatures/squid/death"` | Sound path for death sound. |
| `sounds.hurt` | string | `"hookline/creatures/squid/hit"` | Sound path for hurt sound. |
| `squid.eyeglow` | Entity | `SpawnPrefab("squideyelight")()` | Light source attached to the squid. |
| `squid.LaunchProjectile` | function | `LaunchProjectile(inst, targetpos)` | Projectile launch utility method. |
| `squid.geteatchance` | function | `geteatchance(inst, target)` | Returns catch chance (0.3). |
| `squid.OnSave` | function | `OnSave(inst, data)` | Serialization stub. |
| `squid.OnLoad` | function | `OnLoad(inst, data)` | Deserialization stub. |
| `inst.components.combat.target` | Entity or nil | `nil` | Current combat target. |
| `inst.components.locomotor.runspeed` | number | `TUNING.SQUID_RUNSPEED` | Squid’s land run speed. |
| `inst.components.locomotor.walkspeed` | number | `TUNING.SQUID_WALKSPEED` | Squid’s land walk speed. |

## Main functions
### `LaunchProjectile(inst, targetpos)`
* **Description:** Spawns and launches an `inksplat` projectile from the squid toward the given world position. Speed is scaled linearly by distance using `easing.linear`.
* **Parameters:** `targetpos` (Vector3) — World position to aim at.
* **Returns:** Nothing.
* **Error states:** Does not validate `targetpos` — may launch inaccurately if malformed.

### `ShouldWakeUp(inst)`
* **Description:** Default wake test; returns true if leader is too far (> `WAKE_TO_FOLLOW_DISTANCE`) or `DefaultWakeTest` passes.
* **Parameters:** `inst` (Entity) — The squid instance.
* **Returns:** `boolean` — Whether the squid should wake.
* **Error states:** Assumes `inst.components.follower` exists; may return `false` if leader is missing.

### `ShouldSleep(inst)`
* **Description:** Currently always returns `false` due to commented-out conditions. Intended to govern natural sleep.
* **Parameters:** `inst` (Entity) — The squid instance.
* **Returns:** `false`.

### `OnNewTarget(inst, data)`
* **Description:** Automatically wakes the squid when it gains a new combat target.
* **Parameters:** `data.attacker` (Entity) — Attacker who triggered the new target.
* **Returns:** Nothing.

### `retargetfn(inst)`
* **Description:** Retarget function for `combat` component. Currently returns `nil` (no automatic retarget).
* **Parameters:** `inst` (Entity).
* **Returns:** `nil`.

### `KeepTarget(inst, target)`
* **Description:** Retains combat target if still within `TUNING.SQUID_TARGET_KEEP` range.
* **Parameters:** `target` (Entity).
* **Returns:** `boolean`.

### `OnAttacked(inst, data)`
* **Description:** Responds to being attacked by aggroing the attacker and sharing the target with up to 5 nearby squids (unless they are dead or currently targeting the squid’s leader).
* **Parameters:** `data.attacker` (Entity).
* **Returns:** Nothing.

### `OnAttackOther(inst, data)`
* **Description:** After attacking another entity, shares that target with nearby squids (similar filters as `OnAttacked`).
* **Parameters:** `data.target` (Entity).
* **Returns:** Nothing.

### `OnReelingIn(inst, doer)`
* **Description:** Converts "partially hooked" status to "fully hooked" when caught during fishing.
* **Parameters:** `doer` (Entity) — Player fishing the squid.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `newcombattarget` — triggers `OnNewTarget`.
  - `attacked` — triggers `OnAttacked`.
  - `onattackother` — triggers `OnAttackOther`.
  - `animover` — attached to ink FX to remove entity after animation ends.
  - `OnChangeFollowSymbol` — internal hook for ink debuff follow symbol updates (not used via listener).
- **Pushes:** No direct events; relies on component events (`onwakeup`, `onhurt`, etc.) and prefab events (e.g., `squideyelight` emits `OnAttached`).