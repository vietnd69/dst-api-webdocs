---
id: charliecutscene
title: Charliecutscene
description: Manages the Charlie NPC cutscene sequence at the Atrium Gate, including camera control, pillar data collection, and gate repair animation.
tags: [cutscene, camera, boss, atrium]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 28cd9efa
system_scope: entity
---

# Charliecutscene

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`CharlieCutscene` controls the scripted cutscene sequence that plays when players approach the Atrium Gate in the Ruins. It manages camera focus and locking, collects data about the four Atrium Pillars for spawn point calculations, spawns Charlie NPC and Charlie Hand entities, and handles the gate repair animation sequence. The component uses netvars to synchronize camera lock state to clients and pushes world events to coordinate with other systems like the nightmare phase lock.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("charliecutscene")

-- Master only: start the cutscene sequence
if TheWorld.ismastersim then
    inst.components.charliecutscene:Start()
end

-- Check if gate repair is complete
local isFixed = inst.components.charliecutscene:IsGateRepaired()

-- Client-side: camera lock state is synced via netvar
if inst.replica.charliecutscene ~= nil then
    local isLocked = inst.replica.charliecutscene._iscameralocked:value()
end
```

## Dependencies & tags
**Components used:**
- `trader` -- disabled during cutscene, restored on finish via `Disable()`/`Enable()`
- `pickable` -- checked for `caninteractwith` to determine gate icon state
- `worldsettingstimer` -- checked for `destabilizedelay` and `cooldown` timers
- `colourtweener` -- used for screen fade to black and revert effects
- `entitytracker` -- tracks Charlie Hand entity reference
- `focalpoint` -- world component used for camera focus source management

**Tags:**
- None identified

**External dependencies:**
- `FocalPoint_CalcBaseOffset` -- global function for camera offset calculation
- `ShakeAllCameras` -- global function for camera shake effect
- `SpawnPrefab` -- spawns Charlie NPC and Charlie Hand entities

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `gate_pos` | Vector3 | `nil` | Cached position of the Atrium Gate entity. Set by `CollectAtriumPillarsData()`. |
| `atrium_pillars` | table | `nil` | Pillar data table with `back` and `side` pillar references. Set by `CollectAtriumPillarsData()`. |
| `_iscameralocked` | net_bool | `false` | Synced camera lock state. Dirty event: `iscameralockeddirty`. Controls client camera focus. |
| `_cameraangle` | net_ushortint | `0` | Synced camera heading angle in degrees. Used by clients to set camera target. No dirty event declared (third parameter omitted in net_ushortint constructor). |
| `_running` | boolean | `false` | Whether the cutscene sequence is currently active. Master only. |
| `_gatefixed` | boolean | `false` | Whether the gate repair animation has completed. Persists across save/load. |
| `_traderenabled` | boolean | `nil` | Stores original trader enabled state before cutscene. Restored on `Finish()`. Master only. |
| `charlie` | entity | `nil` | Reference to spawned Charlie NPC entity. Master only. |
| `hand` | entity | `nil` | Reference to spawned Charlie Hand entity. Master only. |

### File-scope constants
| Constant | Type | Value | Usage |
|----------|------|-------|-------|
| `LOOK_FOR_ATRIUM_PILLARS_RANGE` | number | `50` | Search radius for pillar collection in `InternalCollectAtriumPillarsData()`. |
| `ATRIUM_PILLAR_MUSTTAGS` | table | `{"pillar_atrium"}` | Required tags for pillar entity search. |
| `CAMERA_FOCUS_ID` | string | `"charlie_cutscene"` | Focus source identifier for `TheFocalPoint`. |
| `CAMERA_FOCUS_DIST_MIN` | number | `12` | Minimum camera focus distance. |
| `CAMERA_FOCUS_DIST_MAX` | number | `25` | Maximum camera focus distance. |
| `CAMERA_PAN_GAIN` | number | `4` | Camera pan gain applied in `ClientLockCamera()`. |
| `CAMERA_HEADING_GAIN` | number | `1.2` | Camera heading gain applied in `ClientLockCamera()`. |
| `CAMERA_DISTANCE_GAIN` | number | `0.7` | Camera distance gain applied in `ClientLockCamera()`. |
| `CAMERA_FINAL_DISTANCE` | number | `25` | Final camera distance set in `ClientLockCamera()`. |
| `REPAIR_GATE_ANIM_LENGTH` | number | `114 * FRAMES` | Base animation length for gate repair sequence. |
| `CHARLIE_SPAWN_DELAY` | number | `2` | Delay before spawning Charlie NPC in `Start()`. |
| `CHARLIE_START_CAST_DELAY` | number | `3` | Delay before Charlie starts casting. |
| `CHARLIE_CAST_TIME` | number | `REPAIR_GATE_ANIM_LENGTH + 0.5 + (20 * FRAMES)` | Total casting time for Charlie NPC. |
| `START_REPAIRING_GATE_DELAY` | number | `CHARLIE_START_CAST_DELAY + (80 * FRAMES)` | Delay before starting gate repair animation. |
| `REPAIR_GATE_DELAY` | number | `START_REPAIRING_GATE_DELAY + REPAIR_GATE_ANIM_LENGTH` | Delay before completing gate repair. |
| `START_TWEENING_DELAY` | number | `REPAIR_GATE_ANIM_LENGTH * 0.95` | Delay before starting colour tween to black. |
| `TWEEN_TO_BLACK_TIME` | number | `REPAIR_GATE_ANIM_LENGTH - START_TWEENING_DELAY` | Duration of colour tween to black. |
| `REVERT_COLOUR_TIME` | number | `3.5` | Duration of colour tween back to normal.

## Main functions
### `ClientLockCamera()`
* **Description:** Locks player camera control and applies custom camera settings for the cutscene view. Sets camera to non-controllable, applies custom pan/heading/distance gains, sets final distance to 25 units, and sets heading target to the stored camera angle.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `TheCamera` global is nil or invalid. No nil guard present.

### `ClientUnlockCamera()`
* **Description:** Restores player camera control by setting controllable to true. TheFocalPoint component handles resetting gain values automatically when the focus source is removed.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `TheCamera` global is nil or invalid. No nil guard present.

### `Start()` (master only)
* **Description:** Initiates the full cutscene sequence. Sets `_running` to true, pushes world events for cutscene start and nightmare phase lock, disables the trader component, collects pillar data, schedules Charlie spawn and gate repair tasks, calculates and sets camera angle, locks camera, and triggers the camera lock dirty event.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `inst.components.trader` is nil (no guard before `Disable()` call). Errors if `TheWorld` global is nil.

### `Finish()` (master only)
* **Description:** Ends the cutscene sequence. Sets `_running` to false, pushes world events for cutscene end and nightmare phase unlock, restores trader enabled state if it was originally enabled, unlocks camera, and pushes `shadowrift_opened` world event.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `inst.components.trader` is nil (no guard before `Enable()` call). Errors if `TheWorld` global is nil.

### `CollectAtriumPillarsData()`
* **Description:** Collects and caches data about the four Atrium Pillars surrounding the gate. Returns early if data already collected. Stores gate position and calls `InternalCollectAtriumPillarsData()` to find pillars within 50 units with `pillar_atrium` tag, calculate their angles, and determine back/side pillar relationships.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `self.inst:GetPosition()` returns nil. Errors if `InternalCollectAtriumPillarsData()` fails to find valid pillars.

### `FindSceneCameraAngle()`
* **Description:** Calculates the optimal camera angle for the cutscene based on pillar positions. Uses the back pillar position and gate position to compute an angle via `math.atan2`, rounds to nearest 90-degree increment via `RoundPillarAngle()`, then applies a -90 or +90 offset depending on the angle value.
* **Parameters:** None
* **Returns:** number -- camera angle in degrees (0-360)
* **Error states:** Errors if `self.atrium_pillars.back` is nil (no guard before `GetPosition()` call).

### `StartRepairingGateWithDelay(delay, delay_to_fix)`
* **Description:** Schedules the gate repair animation sequence. Uses `DoTaskInTime` to call `StartRepairingGate` at `delay` seconds and `RepairGate` at `delay_to_fix` seconds.
* **Parameters:**
  - `delay` -- number, delay in seconds before starting repair animation
  - `delay_to_fix` -- number, delay in seconds before completing repair
* **Returns:** nil
* **Error states:** None

### `RepairGate()`
* **Description:** Completes the gate repair sequence. Sets `_gatefixed` to true, switches animation build to `atrium_gate_build`, plays `fixed` animation, kills the `fixing` sound, triggers camera shake, plays `fixed` sound, updates minimap icon based on pickable/timer state, and pushes `cooldown` or `idle` animation based on worldsettings timer state.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `inst.components.pickable` is nil (no guard before `caninteractwith` access). Errors if `inst.components.worldsettingstimer` is nil (no guard before `ActiveTimerExists()` call). Errors if `inst.MiniMapEntity` is nil.

### `FindCharlieSpawnPoint()`
* **Description:** Calculates Charlie NPC spawn position. Selects a random side pillar, computes a weighted position between pillar and gate (40% pillar, 60% gate), then applies a 3-unit offset in the camera direction to position Charlie slightly ahead of the gate.
* **Parameters:** None
* **Returns:** Vector3 -- spawn position, or `nil` if no valid pillar found
* **Error states:** Errors if `self.atrium_pillars` is nil (no guard before access).

### `SpawnCharlieWithDelay(delay)`
* **Description:** Schedules Charlie NPC spawn after the specified delay. Spawns `charlie_npc` prefab, sets `atrium` reference to the gate entity, positions Charlie at the calculated spawn point, forces Charlie to face the gate, and starts Charlie's casting sequence with the configured delays.
* **Parameters:**
  - `delay` -- number, delay in seconds before spawning
* **Returns:** nil
* **Error states:** Errors if `SpawnPrefab("charlie_npc")` returns nil. Errors if `self.charlie` has no `Transform` or `ForceFacePoint` methods.

### `FindCharlieHandSpawnPoint()`
* **Description:** Calculates Charlie Hand spawn position using pillar geometry. Collects pillar data if not already cached, then computes the inverse point of the back pillar relative to the two side pillars using vector math: `side1 + side2 - back`.
* **Parameters:** None
* **Returns:** Vector3 -- spawn position for Charlie Hand
* **Error states:** Errors if `self.atrium_pillars` is nil or any pillar reference is nil (no guards before `GetPosition()` calls).

### `SpawnCharlieHand()`
* **Description:** Spawns the Charlie Hand entity and establishes bidirectional entity tracking. Spawns `charlie_hand` prefab, tracks the hand entity on the gate and the gate entity on the hand via `entitytracker` component, calculates spawn position, and initializes the hand entity.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `SpawnPrefab("charlie_hand")` returns nil. Errors if `inst.components.entitytracker` is nil. Errors if `self.hand.components.entitytracker` is nil.

### `IsGateRepaired()`
* **Description:** Returns whether the gate repair animation has completed.
* **Parameters:** None
* **Returns:** boolean -- `true` if `_gatefixed` is true, `false` otherwise
* **Error states:** None

### `OnSave()`
* **Description:** Returns save data table for world persistence. Returns `{running = true}` if cutscene is active, or `{gatefixed = true}` if gate is repaired. Returns `nil` if neither condition is met.
* **Parameters:** None
* **Returns:** table or `nil` -- save data table
* **Error states:** None

### `OnLoad(data)`
* **Description:** Restores state from save data. If `data.running` is true, calls `Finish()` to skip the cutscene and sets `_running` to false. If `data.running` or `data.gatefixed` is true, sets `_gatefixed` to true, switches animation build, and updates minimap icon based on pickable/timer state.
* **Parameters:**
  - `data` -- table -- save data from `OnSave()`, or `nil`
* **Returns:** nil
* **Error states:** Errors if `inst.components.pickable` is nil (no guard before `caninteractwith` access). Errors if `inst.components.worldsettingstimer` is nil. Errors if `inst.MiniMapEntity` is nil.

### `OnIsCameraLockedDirty(inst)` (local)
* **Description:** File-scope callback triggered by `iscameralockeddirty` netvar change on clients. Returns early on dedicated servers. If camera is locked, starts a focus source on `TheFocalPoint` with the configured update function and distance bounds. If unlocked, stops the focus source and calls `ClientUnlockCamera()`.
* **Parameters:**
  - `inst` -- entity instance with charliecutscene component
* **Returns:** nil
* **Error states:** Errors if `TheFocalPoint.components.focalpoint` is nil. Errors if `inst.components.charliecutscene` is nil.

### `CharlieCam_UpdateFn(dt, params, parent, dist_sq)` (local)
* **Description:** File-scope camera update function for the focal point system. Calculates base offset via `FocalPoint_CalcBaseOffset`, adjusts Y offset by +1, applies to camera. Then checks distance squared against maxrange to determine if camera should be locked or unlocked based on player proximity.
* **Parameters:**
  - `dt` -- number -- delta time
  - `params` -- table -- focal point params including source component reference
  - `parent` -- entity -- focal point parent entity
  - `dist_sq` -- number -- squared distance from camera to source
* **Returns:** nil
* **Error states:** Errors if `params.source.components.charliecutscene` is nil. Errors if `TheCamera` global is nil.

### `TweenToNormalColour(inst)` (local)
* **Description:** File-scope helper that starts a colour tween back to normal (white) over `REVERT_COLOUR_TIME` (3.5 seconds). Called after the black fade completes.
* **Parameters:**
  - `inst` -- entity instance with colourtweener component
* **Returns:** nil
* **Error states:** Errors if `inst.components.colourtweener` is nil.

### `RevertToNormalColour(inst)` (local)
* **Description:** File-scope helper that schedules `TweenToNormalColour` after 0.2 seconds delay.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** None

### `TweenToBlack(inst)` (local)
* **Description:** File-scope helper that starts a colour tween to black over `TWEEN_TO_BLACK_TIME` with `RevertToNormalColour` as the completion callback.
* **Parameters:**
  - `inst` -- entity instance with colourtweener component
* **Returns:** nil
* **Error states:** Errors if `inst.components.colourtweener` is nil.

### `StartRepairingGate(inst)` (local)
* **Description:** File-scope helper that begins the gate repair animation sequence. Plays `fixing` animation, starts the `fixing` sound loop, and schedules `TweenToBlack` after `START_TWEENING_DELAY`.
* **Parameters:**
  - `inst` -- entity instance with charliecutscene component
* **Returns:** nil
* **Error states:** Errors if `inst.SoundEmitter` is nil.

### `RepairGate(inst)` (local)
* **Description:** File-scope wrapper that calls `inst.components.charliecutscene:RepairGate()`. Provided for task scheduling compatibility.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** result of `RepairGate()` call
* **Error states:** Errors if `inst.components.charliecutscene` is nil.

## Events & listeners
- **Listens to:** `iscameralockeddirty` (client only) -- triggered when `_iscameralocked` netvar changes; calls `OnIsCameraLockedDirty` to manage camera focus source
- **Pushes:** `charliecutscene` -- world event with boolean data (`true` on start, `false` on finish)
- **Pushes:** `ms_locknightmarephase` -- world event with string `"wild"` on start, `nil` on finish
- **Pushes:** `shadowrift_opened` -- world event fired when cutscene completes