---
id: charlie_stage
title: Charlie Stage
description: Manages the performance stage environment including camera focus, stage music, hound spawns, and interaction with cast members during stageplays in DST.
tags: [stage, camera, music, hound, performance]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 57ec7cf5
system_scope: environment
---

# Charlie Stage

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `charlie_stage` component manages the game's theatrical stage system, handling stage setup, performance lifecycle events, camera focus transitions, background music changes, and hound reward spawns. It interacts with multiple components to coordinate stage actor behavior, manage player proximity triggers, and handle Yoth Knight Shrine-specific content. The component is attached to the `charlie_stage_post` prefab and orchestrates child prefabs like the lecturn, seats, and stage lip.

## Usage example
```lua
-- The component is attached to the charlie_stage_post prefab and initialized automatically.
-- Key interactions include:
inst.components.stageactingprop.onperformancebegun = my_custom_on_performance_start
inst.SetMusicType("drama")  -- Set background music type
inst.components.playerprox:SetDist(12, 15)  -- Modify player proximity ranges
```

## Dependencies & tags
**Components used:** `stageactingprop`, `entitytracker`, `playerprox`, `focalpoint`, `talker`, `pointofinterest`, `timer`, `inspectable`, `locomotor`, `combat`, `inventory`, `yoth_knightmanager`  
**Tags:** Adds `stage`, `DECOR`, `NOCLICK` on main stage entity; `charlie_seat` on seat prefabs.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_ushers` | table | `{}` | Collection of nearby ushers used for combat targeting during performances. |
| `_rewardpool` | table | `REWARDPOOL` | Pool of reward sets used to determine hound spawns after successful performances. |
| `_camerafocus` | `net_tinybyte` | `0` | Networked value indicating camera focus level. |
| `_musictype` | `net_tinybyte` | `0` | Networked value representing the current stage music type (1–4). |
| `_camerafocusvalue` | number | `nil` | Internal value for smoothing camera focus transitions. |
| `spawned_princess_costume` | boolean | `false` | Tracks if Yoth-specific princess costume items have been spawned. |
| `delay_princess_playbill_check` | number | `nil` | Timestamp used to throttle Princess playbill checks. |
| `lip` | EntityRef | `nil` | Reference to the `charlie_stage_lip` child entity. |
| `floor` | EntityRef | `nil` | Reference to the stage floor child entity. |

## Main functions
### `SetStagePostMusicType(inst, music_type)`
*   **Description:** Sets the background music type for the stage (e.g., "happy", "drama") and updates the `_musictype` network variable. Triggers music events when players are near.
*   **Parameters:**  
    *   `music_type` (string or number) — Case-insensitive string ("happy", "mysterious", "drama", "confession") or integer (1–4).
*   **Returns:** Nothing. The value is normalized to 0 (off), 1–4 internally.

### `OnPlayPerformed(inst, data)`
*   **Description:** Handles post-performance logic, including spawning hounds for rewards and disabling the stage prop for a configured duration.
*   **Parameters:**  
    *   `data` (table) — Contains `next`, `error`, and `skip_hound_spawn` fields. If no error and not continuing, hounds are spawned using the reward pool.
*   **Returns:** Nothing.

### `enablefn(inst)` / `disablefn(inst)`
*   **Description:** Control stage openness state by transitioning the stategraph to "open" or "close".
*   **Parameters:**  
    *   `inst` (EntityRef) — The stage entity instance.
*   **Returns:** Nothing.

### `on_stage_performance_begun(inst, script, cast)`
*   **Description:** Sets up stage during a performance start, including camera focus activation, ushers listening for attacks to suggest targets, and pausing hound-related events.
*   **Parameters:**  
    *   `script` (table) — Performance script data.  
    *   `cast` (table) — Map of cast roles to member entities.
*   **Returns:** Nothing.

### `on_stage_performance_ended(inst, ender, script, cast)`
*   **Description:** Cleans up after a performance ends, stopping camera focus, clearing hound pauses, and resetting music type.
*   **Parameters:**  
    *   `ender` (string or EntityRef) — Reason/method the performance ended.  
    *   `script`, `cast` — Performance metadata.
*   **Returns:** Nothing.

### `SetStagePostCameraFocus(inst, level)`
*   **Description:** Sets camera focus level and manages camera focus lifecycle (start/stop/transition).
*   **Parameters:**  
    *   `level` (number) — Focus level (0 = off, 1 = active).
*   **Returns:** Nothing.

### `setup(inst)`
*   **Description:** Initializes stage geometry and entities (lecturn, seats, mannequin, lips, birds) on first spawn. Runs only if `inst.loaded` is false.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  *   `play_performed` (via `inst:ListenForEvent`) — Triggered after a stage performance ends, calls `OnPlayPerformed`.  
  *   `timerdone` (via `inst:ListenForEvent`) — Handles spawning Yoth princess costume rewards via timers.  
  *   `onremove` — For ushers (cleaning up `_ushers` table) and lecturn (via `entitytracker`).  
  *   `attacked` — Added dynamically to cast members during performance start; triggers ushers to suggest attacker as combat target.  
  *   `camerafocusdirty` — Client-side listener to update camera focus based on `_camerafocus` changes.  
  *   `ms_register_charlie_stage` — Pushed by world to register the stage for multiplayer sync.  
- **Pushes:**  
  *   `stageplaymusic` — Sent to nearby players to set music type.  
  *   `pausehounded` / `unpausehounded` — Controls hound spawn behavior during performances.  
  *   `ms_register_charlie_stage` — Registers stage with world for synchronization.  
  *   `onstage` — Sent to entities on the stage tile to indicate stage presence.
