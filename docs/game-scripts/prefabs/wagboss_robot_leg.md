---
id: wagboss_robot_leg
title: Wagboss Robot Leg
description: Manages the landing and blocking behavior of a boss-related physics-based obstacle that reacts to environmental changes and boss presence.
tags: [boss, physics, obstacle, blocker, sound]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d84d1f50
system_scope: physics
---

# Wagboss Robot Leg

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wagboss_robot_leg` prefab implements a physics-enabled obstacle used during boss encounters—specifically for the Wagstaff boss. It handles vertical landing mechanics (including sinking, sound playback, and transition to a grounded state), activates as a lunar supernova blocker, and maintains awareness of the boss entity to self-destruct if the boss is removed. It relies on `updatelooper` for continuous landing-state checks, `entitytracker` to monitor boss presence, and `lunarsupernovablocker` to block lunar supernova effects.

## Usage example
```lua
local leg = Prefab("wagboss_robot_leg", fn, assets)
local inst = MakePrefab("wagboss_robot_leg")
inst.Transform:SetPosition(x, y, z)
inst.components.entitytracker:TrackEntity("boss", boss_entity)
inst.components.updatelooper:AddOnUpdateFn(inst.components.updatelooper.onupdatefns[1]) -- or rely on default logic
```

## Dependencies & tags
**Components used:** `updatelooper`, `entitytracker`, `lunarsupernovablocker`, `colouradder`, `inspectable`, `physics`, `animstate`, `soundemitter`, `dynamicshadow`, `transform`, `network`  
**Tags:** Adds `mech`, `blocker`, `FX`, `NOCLICK`. Checks `NOCLICK`, `blocker`, `FX` for behavior.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `landedt` | number | `FRAMES * 2` | Timer counting down during landing; triggers finalization when expired. |
| `landsfx` | boolean or nil | `nil` | Controls whether landing sound plays only once per landing event. |
| `_onremoveboss` | function | (lambda: calls `KillMe`) | Callback fired when the tracked boss entity is removed. |

## Main functions
### `KillMe(inst)`
* **Description:** Finalizes and removes the entity: disables physics, removes blocker, fades out (via `ErodeAway` or immediate removal), and marks as non-persistent.
* **Parameters:** `inst` (Entity) — the instance to kill.
* **Returns:** Nothing.
* **Error states:** May defer removal until after sleep or static task depending on `POPULATING` state.

### `MakeLandedAtXZ(inst, x, z)`
* **Description:** Finalizes the leg's state after landing: positions it, enables blocker behavior, sets physics to static obstacle mode, and begins boss tracking.
* **Parameters:**  
  `inst` (Entity) — the instance to finalize.  
  `x`, `z` (number or nil) — world coordinates; if `nil`, no position change occurs.
* **Returns:** Nothing.

### `UpdateLanding(inst, dt)`
* **Description:** Called per frame by `updatelooper`; handles falling, sinking, and transition from air to landed state.
* **Parameters:**  
  `inst` (Entity) — the instance.  
  `dt` (number) — delta time in seconds.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; relies on `y`, `vy`, and `ShouldEntitySink` checks.

### `StartTrackingBoss(inst, boss)`
* **Description:** Updates the boss entity reference in `entitytracker` and manages `onremove` event listening.
* **Parameters:**  
  `inst` (Entity) — the instance.  
  `boss` (Entity or nil) — the new boss entity.
* **Returns:** Nothing.

### `OnLoad(inst)`
* **Description:** Ensures the entity is landed if loaded at or below `y = 0.01`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnLoadPostPass(inst)`
* **Description:** Post-load hook to re-establish boss dependency if not already landed.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — when the tracked boss entity is removed, triggers `KillMe`.
- **Pushes:** None (no `PushEvent` calls in this file).