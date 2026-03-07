---
id: mushroombomb
title: Mushroombomb
description: Manages the lifecycle, growth, and explosive behavior of Toadstool Mushroombombs in DST, including progressive animations, lighting fade, and area-of-effect damage on detonation.
tags: [combat, fx, projectile, spawn, lighting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ee204e62
system_scope: entity
---

# Mushroombomb

> Based on game build **714001** | Last updated: 2026-03-06

## Overview
The `mushroombomb.lua` file defines two prefabs — `mushroombomb`/`mushroombomb_dark` and their projectile variants — which simulate the growth and explosion of Toadstool-generated spore bombs. The component logic governs animating growth stages, dynamic lighting fade-in/out, sound playback, and damage application within a radius on explosion. It relies on several core components: `entitytracker` to locate the parent Toadstool for damage scaling, `complexprojectile` for flight physics (projectile variant), `inspectable` for naming (dark variant), and `health`/`combat` (indirectly, for explosion validation).

## Usage example
```lua
-- Spawning a standard mushroombomb manually (e.g., via mod logic):
local bomb = SpawnPrefab("mushroombomb")
bomb.Transform:SetPosition(x, y, z)

-- Spawning via projectile (e.g., from Toadstool AI):
local proj = SpawnPrefab("mushroombomb_projectile")
proj.Transform:SetPosition(x, y, z)
-- Projectile properties (speed, gravity, etc.) are set internally and auto-trigger on impact
```

## Dependencies & tags
**Components used:** `entitytracker`, `inspectable`, `complexprojectile`, `locomotor`, `physics`, `light`, `animstate`, `soundemitter`, `network`.  
**Tags added/used:** `"FX"` (for ground effect entities), `"explosive"` (on bomb), `"NOCLICK"` (on projectile), `"projectile"`, `"complexprojectile"`.  
**Tags checked on explosion targets:** `"_health"`, `"_combat"` (must be present), `"INLIMBO"`, `"toadstool"` (must *not* be present).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prefab` | string | `"mushroombomb"` or `"mushroombomb_dark"` | Prefab name used for asset selection and instance identification. |
| `Light` | Light component instance | — | Lighting attached to the bomb; intensity/radius/falloff controlled dynamically during fade/growth. |
| `_fade` | networked smallbyte | `0` | Server-authoritative counter tracking fade/growth frame progression; updated locally on client. |
| `_fadetask` | Task | `nil` | Periodic task scheduled to run `OnUpdateFade` every `FRAMES`. |
| `_growtask` | Task | `nil` | Delayed task scheduling the next growth stage or explosion. |
| `_soundtask` | Task | `nil` | Delayed task scheduling the next spore-growth sound. |
| `_lifetime` | number | `0` | Accumulated lifetime in seconds (used for save/load recovery). |

## Main functions
### `FadeOut(inst)`
* **Description:** Initiates the fade-out phase: sets `_fade` to trigger the second half of the fade animation and schedules `OnUpdateFade` to run repeatedly to reduce lighting and fade out the bomb.
* **Parameters:** `inst` (Entity) — The bomb instance.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; assumes valid `inst` with required components (`Light`, `_fade`, `_fadetask`).

### `CreateGroundFX(bomb)`
* **Description:** Spawns a non-networked, non-persistent FX entity (background, ground-anchored) when the bomb explodes; only executed on the client (not dedicated servers).
* **Parameters:** `bomb` (Entity) — The exploding bomb; its world position is used for the FX placement.
* **Returns:** Nothing. The FX entity is created and added to the world.

### `Explode(inst)`
* **Description:** Triggers the visual explosion (animation, sound), removes the bomb, and inflicts damage to all valid entities within `TUNING.TOADSTOOL_MUSHROOMBOMB_RADIUS`.
* **Parameters:** `inst` (Entity) — The bomb instance.
* **Returns:** Nothing.
* **Error states:** If `toadstool` tracker entity is invalid, damage defaults to `TUNING.TOADSTOOL_DAMAGE_LVL[0]`. Damage is skipped for entities that are `IsInLimbo()`, dead (`Health:IsDead()`), or lack `combat`/`health` components.

### `OnProjectileHit(inst)`
* **Description:** Called when the projectile (`mushroombomb_projectile`) hits terrain. Removes the projectile and spawns a grounded `mushroombomb` prefab at the hit location.
* **Parameters:** `inst` (Entity) — The projectile instance.
* **Returns:** Nothing.

### `Grow(inst, level)`
* **Description:** Drives the progressive growth animation. Level 1 → "grow1", level 2 → "grow2", level 3+ → "explode_pre" → explosion.
* **Parameters:** `inst` (Entity) — The bomb instance. `level` (number) — Current growth stage (starting at `1`).
* **Returns:** Nothing.
* **Error states:** Sound playback is deferred (`QueueGrowSound`) to avoid overlap; delayed tasks (`_growtask`) ensure sequential animation steps.

### `OnSave(inst, data)` & `OnLoad(inst, data)`
* **Description:** Custom save/load handlers. `OnSave` stores accumulated lifetime. `OnLoad` reconstructs the bomb's current growth stage and timing based on stored lifetime to restore visual sync.
* **Parameters:** `inst` (Entity), `data` (table) — Save/load data.
* **Returns:** Nothing. May schedule new tasks (`_growtask`, `_fadetask`, `_soundtask`) on load.

## Events & listeners
- **Listens to:**  
  - `"mushroombomb._explode"` (client-side only) — triggers `CreateGroundFX`.  
  - `"fadedirty"` (client-side only) — triggers `OnFadeDirty` to restart/update lighting fade logic.  
  - `"animover"` (on ground FX entity) — removes the FX entity when its animation completes.  
- **Pushes:**  
  - Networked event via `inst._explode:push()` (client and server) when explosion occurs.  
  - Networked signal via `inst._fade:set(...)` with event `"fadedirty"` to notify clients of lighting changes.  
- **Note:** The component uses `net_event` and `net_smallbyte` for client-server sync of explosion and fade state.
