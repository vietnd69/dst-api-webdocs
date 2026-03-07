---
id: locomotor
title: Locomotor
description: Manages entity movement, pathfinding, and speed calculations, including walking, running, platform hopping, and speed modifier interactions.
tags: [locomotion, pathfinding, movement, physics, player]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4eb22e46
system_scope: locomotion
---

# Locomotor

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Locomotor` is the core component responsible for entity locomotion in DST. It handles movement logic, including walking/running, pathfinding, platform hopping between platforms (e.g., boats), creep speed penalties, ground tile bonuses, and integration with speed modifiers from equipment and external sources. It supports both server and client behavior, with special handling for prediction, replication, and networking via `PlayerController`. It is typically added to players and other mobile entities, and adds the `locomotor` tag on the server.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("locomotor")

-- Start moving forward at walk speed
inst.components.locomotor:WalkForward()

-- Start moving toward a target entity
inst.components.locomotor:GoToEntity(target_entity, nil, false)

-- Set an external speed multiplier (e.g., from a buff)
inst.components.locomotor:SetExternalSpeedMultiplier("mybuff", "speed", 1.25)

-- Enable platform hopping (e.g., for boat-based entities)
inst.components.locomotor:SetAllowPlatformHopping(true)
```

## Dependencies & tags
**Components used:** `amphibiouscreature`, `boatringdata`, `drownable`, `embarker`, `equippable`, `health`, `inventory`, `inventoryitem`, `mightiness`, `placer`, `platformhopdelay`, `playercontroller`, `rider`, `saddler`, `walkableplatform`  
**Tags added/removed:** Adds `"locomotor"` on server startup; adds/removes `"turfrunner_` + `ground_tile` tags dynamically when ground tile speed modifiers change.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this component owns. Set in constructor. |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | True if this instance is on the server. |
| `dest` | `Dest` or `nil` | `nil` | Current movement destination. |
| `atdestfn` | `function` or `nil` | `nil` | Callback invoked when destination is reached. |
| `bufferedaction` | `BufferedAction` or `nil` | `nil` | Buffered action associated with current movement. |
| `arrive_dist` | `number` | `ARRIVE_STEP` (0.15) | Distance threshold to consider destination reached. |
| `arrive_step_dist` | `number` | `ARRIVE_STEP` (0.15) | Distance threshold for intermediate path steps. |
| `walkspeed` | `number` | `TUNING.WILSON_WALK_SPEED` (4) | Base walk speed. |
| `runspeed` | `number` | `TUNING.WILSON_RUN_SPEED` (6) | Base run speed. |
| `throttle` | `number` | `1` | Global movement speed multiplier (applied in `GetSpeedMultiplier`). |
| `slowmultiplier` | `number` | `0.6` | Speed multiplier applied when walking on creep (unless `vigorbuff`). |
| `fastmultiplier` | `number` | `1.3` | Speed multiplier applied when walking on road or fast tiles. |
| `groundspeedmultiplier` | `number` | `1.0` | Current ground-based speed multiplier. |
| `enablegroundspeedmultiplier` | `boolean` | `true` | Whether ground speed modifiers are active. |
| `wasoncreep` | `boolean` | `false` | Whether last update was on creep. |
| `triggerscreep` | `boolean` | `true` | Whether creep effects (penalties, events) are active. |
| `fasteroncreep` | `boolean` | `nil` | Whether creep provides speed bonus (rare). |
| `faster_on_tiles` | `table` | `{}` | Map of `ground_tile` → `is_faster`. Used to tag `"turfrunner_..."`. |
| `hopping` | `boolean` | `false` | Whether currently in a hop (platform jump) state. |
| `hop_distance` | `number` | `TUNING.DEFAULT_LOCOMOTOR_HOP_DISTANCE` | Default maximum hop distance. |
| `allow_platform_hopping` | `boolean` or `nil` | `nil` | Enables platform hopping logic if set. |
| `last_platform_visited` | `WalkablePlatform` or `INVALID_PLATFORM_ID` | `nil` / `"INVALID PLATFORM"` | Tracks last visited platform to prevent back-and-forth hopping. |
| `time_before_next_hop_is_allowed` | `number` | `0` | Cooldown before next hop allowed. |
| `pathcaps` | `table` or `nil` | `nil` | Optional pathfinding caps (`allowocean`, `ignoreLand`, etc.). |
| `isrunning` | `boolean` | `false` | Whether entity is in run mode. |
| `wantstomoveforward` | `boolean` | `false` | Whether entity wants to move forward. |
| `wantstorun` | `boolean` | `false` | Whether entity prefers run mode. |
| `strafedir` | `number` or `nil` | `nil` | Target facing angle for strafing. |

## Main functions
### `SetExternalSpeedMultiplier(source, key, m)`
*   **Description:** Adds or updates a speed multiplier from a named source and key. Multiplicative changes are applied cumulatively to `externalspeedmultiplier`. Supplying `m = nil` or `m = 1` removes the multiplier. Sources are registered with `onremove` callbacks for cleanup.
*   **Parameters:** `source` (any hashable), `key` (any hashable or `nil`), `m` (number) - multiplier to apply.
*   **Returns:** Nothing.

### `RemoveExternalSpeedMultiplier(source, key)`
*   **Description:** Removes a speed multiplier. If `key` is `nil`, removes all multipliers for the entire `source`. Automatically deregisters the source's `onremove` event listener if fully removed.
*   **Parameters:** `source` (any hashable), `key` (any hashable or `nil`).
*   **Returns:** Nothing.

### `GetWalkSpeed()`
*   **Description:** Returns the current walk speed by multiplying base `walkspeed` by the computed speed multiplier (which includes ground modifiers, equipped items, external multipliers, etc.).
*   **Parameters:** None.
*   **Returns:** `number` - effective walk speed.

### `GetRunSpeed()`
*   **Description:** Returns the current run speed by multiplying `RunSpeed()` (which accounts for mounted speed if riding) by the computed speed multiplier.
*   **Parameters:** None.
*   **Returns:** `number` - effective run speed.

### `SetFasterOnGroundTile(ground_tile, is_faster)`
*   **Description:** On server, sets whether a given `ground_tile` (e.g., `"grass"`, `"woodfloor"`) should grant a speed bonus (`fastmultiplier`) to this entity. Automatically toggles the `"turfrunner_` + `ground_tile` tag.
*   **Parameters:** `ground_tile` (string or tile constant), `is_faster` (boolean).
*   **Returns:** Nothing.

### `GoToEntity(target, bufferedaction, run)`
*   **Description:** Initiates movement toward a target entity. Resolves arrival distance using entity physics radii and buffered action overrides. If `directdrive` is enabled, uses direct physics control; otherwise, starts pathfinding via `FindPath()`.
*   **Parameters:** `target` (`Entity`), `bufferedaction` (`BufferedAction` or `nil`), `run` (boolean) - whether to run instead of walk.
*   **Returns:** Nothing.

### `GoToPoint(pt, bufferedaction, run, overridedest)`
*   **Description:** Initiates movement toward an absolute point `pt` (a `Vector3` or point table). May accept an `overridedest` for network controller support. Uses `Dest` wrapper for target management.
*   **Parameters:** `pt` (`Vector3` or point `{x,y,z}`), `bufferedaction` (`BufferedAction` or `nil`), `run` (boolean), `overridedest` (`Dest` or `nil`).
*   **Returns:** Nothing.

### `PreviewAction(bufferedaction, run, try_instant)`
*   **Description:** Performs client-side preview logic for a buffered action (e.g., before committing). Handles special cases like `LOOKAT`, `CASTAOE`, and close-inspect behavior. If no locomotion is needed, triggers preview immediately. On success, sets `dest` and begins pathfinding.
*   **Parameters:** `bufferedaction` (`BufferedAction`), `run` (boolean), `try_instant` (boolean).
*   **Returns:** Nothing.

### `PushAction(bufferedaction, run, try_instant)`
*   **Description:** Server-side method to push and execute a buffered action. Validates with `bufferedaction:TestForStart()`, then calls `GoToEntity`/`GoToPoint` or triggers the action immediately if instant/short-range. Integrates with `PlayerController:OnRemoteBufferedAction()` for networking.
*   **Parameters:** `bufferedaction` (`BufferedAction`), `run` (boolean), `try_instant` (boolean).
*   **Returns:** Nothing on success; fires `"actionfailed"` event on failure.

### `WalkForward(direct)`
*   **Description:** Sets entity to walk forward at `GetWalkSpeed()`, updates motor velocity, and starts component updates.
*   **Parameters:** `direct` (boolean) - if `true`, sets `wantstomoveforward`.
*   **Returns:** Nothing.

### `RunForward(direct)`
*   **Description:** Sets entity to run forward at `GetRunSpeed()`, updates motor velocity, and starts component updates.
*   **Parameters:** `direct` (boolean) - if `true`, sets `wantstomoveforward`.
*   **Returns:** Nothing.

### `Stop(sgparams)`
*   **Description:** Halts movement, clears destination, resets pathfinding, and stops physics motor. Fires `"locomote"` event. Does not clear `bufferedaction`.
*   **Parameters:** `sgparams` (table or `nil`) - parameters passed to `"locomote"` event.
*   **Returns:** Nothing.

### `FindPath()`
*   **Description:** Submits a pathfinding request from current position to `dest` point via `TheWorld.Pathfinder`. Optimizes by skipping redundant pathfinds for identical destination tiles. Handles "line-of-sight" (direct) path checks before resorting to full pathfinding.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartHopping(x, z, target_platform)`
*   **Description:** Initiates a platform hop (jump). Sets `hopping = true`, activates `embarker` if present, and sets a `time_before_next_hop_is_allowed` cooldown (default ~0.2s) to prevent rapid successive hops.
*   **Parameters:** `x`, `z` (`number`) - hop target coordinates, `target_platform` (`WalkablePlatform` or `nil`).
*   **Returns:** Nothing.

### `ScanForPlatform(my_platform, target_x, target_z, hop_distance)`
*   **Description:** Scans forward from current position up to `hop_distance` for a valid platform to hop to. Performs edge and blocker checks, respects platform rules (`player_only`, `no_mounts`, `isfull`). Returns success status and target coordinates.
*   **Parameters:** `my_platform` (`WalkablePlatform` or `nil`), `target_x`, `target_z` (numbers), `hop_distance` (number).
*   **Returns:** `can_hop` (boolean), `px`, `pz` (target hop coordinates), `found_platform` (`WalkablePlatform` or `nil`), `blocked` (boolean).

### `OnUpdate(dt, arrive_check_only)`
*   **Description:** Core per-frame update method. Handles arrival checks, path-following, strafe facing, platform hopping, creep detection, drown checks, and motor speed adjustment. Runs on both server and client. If `arrive_check_only` is `true`, only performs arrival logic (used for instant checks).
*   **Parameters:** `dt` (number) - time since last frame, `arrive_check_only` (boolean).
*   **Returns:** Nothing.

### `SetAllowPlatformHopping(enabled)`
*   **Description:** Enables or disables platform hopping logic. On enabling, initializes `last_platform_visited = "INVALID_PLATFORM_ID"` to allow immediate hopping.
*   **Parameters:** `enabled` (boolean).
*   **Returns:** Nothing.

### `SetMoveDir(dir)`
*   **Description:** Rotates the entity to face angle `dir` (degrees). Respects `strafedir`: if strafing, `dir` sets the strafe direction; otherwise, sets entity facing directly.
*   **Parameters:** `dir` (number) - rotation angle in degrees.
*   **Returns:** Nothing.

### `SetStrafing(strafing)`
*   **Description:** Enables/disables strafing mode. When enabled, future `SetMoveDir` calls update `strafedir` instead of entity facing.
*   **Parameters:** `strafing` (boolean).
*   **Returns:** Nothing.

### `IsAquatic()`, `IsTerrestrial()`, `CanPathfindOnWater()`, `CanPathfindOnLand()`
*   **Description:** Helpers to query current pathfinding capabilities based on `pathcaps`. Returns `true`/`false`.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `AdjustPathCaps(enabled, capname)`
*   **Description:** Enables or disables a pathfinding capability (e.g., `"allowplatformhopping"`). Auto-creates/destroys `pathcaps` table as needed.
*   **Parameters:** `enabled` (boolean), `capname` (string).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"onremove"` from external speed multiplier sources (via `inst:ListenForEvent`) to clean up modifier state.  
- **Pushes:** `"onreachdestination"`, `"walkoncreep"`, `"walkoffcreep"`, `"locomote"`, `"startstrafing"`, `"stopstrafing"`, `"bufferedcastaoe"`, `"actionfailed"`, `"onhop"`, `"onremove"`.

### Special behavior:
- Client-side components patch `removesetter` for `runspeed`, `externalspeedmultiplier`, etc., to sync values via `player_classified` replica fields (`runspeed`, `externalspeedmultiplier`, `externalvelocityvectorx`, `externalvelocityvectorz`).
- Client prediction (`predictmovestarttime`, `predictrunspeed`) integrates with `PlayerController` and `dest` management to reduce jitter.
- Platform hopping includes delay logic via `PlatformHopDelay` component when hopping off non-fixed platforms.
