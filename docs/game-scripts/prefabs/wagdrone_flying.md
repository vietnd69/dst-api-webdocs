---
id: wagdrone_flying
title: Wagdrone Flying
description: Implements the flying mechanical enemy entity with targeting visualization, lighting, and stategraph-driven behavior in DST.
tags: [enemy, flying, boss, ai, light]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f5a26a12
system_scope: entity
---

# Wagdrone Flying

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wagdrone_flying` prefab implements a flying enemy entity equipped with lighting, a dedicated targeting system, and stategraph-controlled behavior. It depends heavily on shared logic via `wagdrone_common.lua` and integrates with the `locomotor`, `inspectable`, and `updatelooper` components. Targeting visuals are rendered using a non-networked FX entity (`wagdrone_projectile_fx`) that synchronizes animation with the parent during aiming phases.

## Usage example
This prefab is not intended for direct manual instantiation by mods. It is used as a core game entity defined by the `Prefab("wagdrone_flying", fn, assets, prefabs)` call. Modders may interact with it indirectly—e.g., by spawning it via world generation or custom prefabs.

## Dependencies & tags
**Components used:**  
- `inspectable` — provides status via `GetStatus`
- `locomotor` — controls flight speed (`runspeed`), sets `directdrive`, applies speed multiplier
- `updatelooper` — adds post-update and on-update callbacks for FX syncing and lighting offset

**Tags added:**  
- `can_offset_sort_pos` — special flag for render sorting  
- `mech`, `electricdamageimmune`, `soulless`, `lunar_aligned`, `wagdrone` — gameplay classification tags

**External dependencies:**  
- `easing.lua` — used for fade-out animation (`outQuad`)  
- `wagdrone_common.lua` — shared logic (`MakeHackable`, `PreventTeleportFromArena`, `ChangeToLoot`, `HackableLoadPostPass`)  
- `wagdrone_projectile_fx`, `wagdrone_parts`, `gears`, `transistor`, `wagpunk_bits` — prefabs spawned on death/damage

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `targeting` | `net_tinybyte` | `nil` initially | Networked value (0, 1, or 2) representing targeting state: `0` = cancel, `1` = commit, `2` = show |
| `targetingfx` | entity reference | `nil` | Reference to the targeting FX entity when active |
| `ShowTargeting(show, commit)` | function | `ShowTargeting` | Public method to trigger targeting visual state changes |
| `OnSave(inst, data)` | function | `OnSave` | Callback for persistence, records power state and loot status |
| `OnLoad(inst, data, ents)` | function | `OnLoad` | Callback for restoration, handles state recovery and loot conversion |

## Main functions
### `ShowTargeting(show, commit)`
* **Description:** Controls the targeting visual state by setting the `targeting` net value and triggering FX updates on the client.  
* **Parameters:**  
  - `show` (boolean or `nil`) — if `true`, sets targeting state to `2` (show).  
  - `commit` (boolean) — if `true` and `show` is `false`, sets targeting state to `1` (commit/finalize). Otherwise, sets to `0` (cancel).  
* **Returns:** Nothing.  
* **Error states:** No-op if the server is dedicated (`TheNet:IsDedicated()` is true), or if the new value matches the current `targeting` value.

### `GetStatus(inst, viewer)`
* **Description:** Returns the status string shown when inspecting the entity.  
* **Parameters:**  
  - `inst` (entity) — the entity instance.  
  - `viewer` (player/entity) — the inspecting viewer (unused).  
* **Returns:**  
  - `"DAMAGED"` if the `workable` component exists (i.e., entity is being looted).  
  - `"INACTIVE"` if the entity’s stategraph has the `"off"` tag.  
  - `nil` otherwise (standard visible state).  

### `CreateTargetingFx()`
* **Description:** Helper that constructs the client-only targeting FX entity (`wagdrone_projectile_fx`).  
* **Parameters:** None.  
* **Returns:** `fx` (entity) — a non-persistent entity with `updatelooper`, `animstate`, `transform`, and `soundemitter`.  
* **Details:** Sets up animations ("marker_pre", "marker_loop"), multicolor blending, bloom, light override, and background layering. Adds `FX` and `NOCLICK` tags.

### `Target_OnPostUpdate(fx)`
* **Description:** Post-update callback that positions the targeting FX at `y=0` and syncs animation with the parent during targeting.  
* **Parameters:**  
  - `fx` (entity) — the targeting FX entity.  
* **Returns:** Nothing.  
* **Details:** Adjusts world position to avoid vertical offset artifacts, and triggers `Target_SyncMarkerAnim` to mirror the parent’s attack pre-animation frames.

### `Target_OnUpdateCancel(fx, dt)`
* **Description:** Updates the FX’s fade-out when canceling targeting.  
* **Parameters:**  
  - `fx` (entity) — the targeting FX entity.  
  - `dt` (number) — delta time in seconds.  
* **Returns:** Nothing.  
* **Details:** Uses `easing.outQuad` over `0.2` seconds to fade alpha from `1` to `0`; removes the FX when complete.

## Events & listeners
- **Listens to:**  
  - `"targetingdirty"` — triggers `OnTargetingDirty` on clients to sync targeting visuals when the `targeting` net value changes.  
  - `"animover"` — on targeting commit (`state == 1`), removes the FX after animation completes.  
- **Pushes:** None.