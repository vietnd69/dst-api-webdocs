---
id: locomotor
title: Locomotor
description: Manages entity movement, pathfinding, speed calculation, and platform hopping for all mobile entities in the world.
tags: [movement, pathfinding, locomotion, platform]
sidebar_position: 10

last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 9c897b7b
system_scope: locomotion
---

# Locomotor

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Locomotor` is the core movement component for all mobile entities in Don't Starve Together. It handles pathfinding, speed calculation with multipliers from equipment and terrain, platform hopping between walkable surfaces, and destination tracking. The component operates differently on server (mastersim) versus client, with network-replicated properties for smooth client-side prediction. It integrates with `rider` for mounted movement, `inventory` for equipment speed modifiers, and `playercontroller` for input-driven locomotion.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("locomotor")

-- Set movement speed
inst.components.locomotor.runspeed = 8
inst.components.locomotor.walkspeed = 5

-- Navigate to a point
inst.components.locomotor:GoToPoint(Vector3(10, 0, 10), nil, true)

-- Add speed modifier from external source
inst.components.locomotor:SetExternalSpeedMultiplier("buff_source", "speed_buff", 1.5)

-- Enable platform hopping
inst.components.locomotor:SetAllowPlatformHopping(true)

-- Stop movement
inst.components.locomotor:Stop()
```

## Dependencies & tags
**External dependencies:**
- `util/sourcemodifierlist` -- used for predict external speed multiplier tracking

**Components used:**
- `rider` -- checks if entity is mounted, gets mount and saddle for speed calculations
- `inventory` -- accesses equipslots for equipment speed modifiers
- `inventoryitem` -- gets owner for speed modifier calculations
- `equippable` -- calls GetWalkSpeedMult() on equipped items
- `saddler` -- gets bonus speed multiplier from saddle
- `mightiness` -- checks mighty state for speed modifier overrides
- `health` -- checks if entity is dead to stop movement
- `playercontroller` -- handles buffered actions and remote predictions
- `drownable` -- checks drowning status when not hopping
- `amphibiouscreature` -- handles water/land transition for amphibious entities
- `embarker` -- manages platform embark/disembark during hops
- `platformhopdelay` -- gets delay ticks for platform hopping
- `boatringdata` -- checks if boat is rotating for hop delay calculations
- `walkableplatform` -- checks platform capacity and hop restrictions
- `placer` -- checks if entity is a placer during wall scanning
- `player_classified` -- network-replicated movement properties (client-side)
- `replica.rider` -- client-side replica for mounted movement
- `replica.inventory` -- client-side replica for equipment

**Tags:**
- `locomotor` -- added on component add (server), removed on component remove
- `turfrunner_<tile>` -- added/removed on server via SetFasterOnGroundTile() based on faster_on_tiles table; checked on client in ClientIsFasterOnGroundTile() for ground tile speed bonuses
- `mightiness_mighty` -- checked for speed modifier overrides
- `vigorbuff` -- checked to bypass creep slow multiplier
- `pocketdimension_container` -- checked to avoid walking to container at origin
- `playerghost` -- checked for idle animation selection
- `walkableplatform_full` -- checked for platform capacity (client)
- `wall` -- scanned during platform hop path validation
- `blocker` -- scanned during platform hop path validation
- `INLIMBO` -- checked to skip locomotion updates
- `autopredict` -- checked for prediction speed usage
- `jumping` -- checked during hop state
- `moving` -- checked in stategraph for movement state
- `running` -- checked in stategraph for run state
- `overridelocomote` -- checked for special locomotion override states
- `canrotate` -- checked for rotation permission during movement
- `busy` -- checked to prevent rotation during busy states
- `softstop` -- checked for soft stop handling

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | -- | The entity instance that owns this component. |
| `ismastersim` | boolean | TheWorld.ismastersim | Whether running on the server simulation. |
| `dest` | Dest or nil | nil | Current destination object (entity, point, or buffered action). |
| `atdestfn` | function or nil | nil | Callback function called when destination is reached. |
| `bufferedaction` | BufferedAction or nil | nil | Current buffered action being executed. |
| `arrive_step_dist` | number | 0.15 | Distance threshold for considering a path step reached. |
| `arrive_dist` | number | 0.15 | Distance threshold for considering final destination reached. |
| `walkspeed` | number | TUNING.WILSON_WALK_SPEED (4) | Base walking speed in units per second. |
| `runspeed` | number | TUNING.WILSON_RUN_SPEED (6) | Base running speed in units per second. |
| `throttle` | number | 1 | Speed throttle multiplier (0-1 range). |
| `lastpos` | table | {} | Last known tile position `{x, y}` for ground speed updates. |
| `slowmultiplier` | number | 0.6 | Speed multiplier when on creep terrain. |
| `fastmultiplier` | number | 1.3 | Speed multiplier on fast terrain (roads, special tiles). |
| `movestarttime` | number | -1 | Timestamp when movement started. |
| `movestoptime` | number | -1 | Timestamp when movement stopped. |
| `groundspeedmultiplier` | number | 1.0 | Current ground terrain speed multiplier. |
| `enablegroundspeedmultiplier` | boolean | true | Whether ground speed multipliers are active. |
| `isrunning` | boolean | false | Whether entity is currently running (vs walking). |
| `_externalspeedmultipliers` | table | {} | Internal table tracking external speed modifier sources. |
| `externalspeedmultiplier` | number | 1 | Combined external speed multiplier from all sources. |
| `_externalvelocityvectors` | table | {} | Internal table tracking external velocity vector sources. |
| `externalvelocityvectorx` | number | 0 | External velocity vector X component. |
| `externalvelocityvectorz` | number | 0 | External velocity vector Z component. |
| `wasoncreep` | boolean | false | Whether entity was on creep last frame (for event triggering). |
| `triggerscreep` | boolean | true | Whether walking on creep triggers creep activation events. |
| `is_prediction_enabled` | boolean | false | Whether movement prediction is enabled. |
| `hop_distance` | number | TUNING.DEFAULT_LOCOMOTOR_HOP_DISTANCE | Maximum distance for platform hops. |
| `hopping` | boolean | false | Whether entity is currently in hop state. |
| `time_before_next_hop_is_allowed` | number | 0 | Cooldown time before next hop is permitted. |
| `faster_on_tiles` | table | {} | Map of ground tile IDs to boolean (true = faster on this tile). |
| `fasteronroad` | boolean | nil (assigned via ServerFasterOnRoad/ClientFasterOnRoad) | Whether entity moves faster on road terrain. |
| `fasteroncreep` | boolean | nil (assigned via SetFasterOnCreep or ServerFasterOnCreep/ClientFasterOnCreep) | Whether entity moves faster on creep terrain. |
| `allow_platform_hopping` | boolean | nil | Whether platform hopping is enabled for this entity. |
| `last_platform_visited` | string or nil | INVALID_PLATFORM_ID | ID of last platform visited (for hop prevention). |
| `hop_delay` | table or nil | nil | Hop delay tracking table with platform and tick info. |
| `strafedir` | number or nil | nil | Strafing direction in radians when strafing is active. |
| `wantstomoveforward` | boolean or nil | nil | Whether entity wants to move forward. |
| `wantstorun` | boolean or nil | nil | Whether entity wants to run instead of walk. |
| `directdrive` | boolean or nil | nil | Whether direct drive mode is active (no pathfinding). |
| `pathcaps` | table or nil | nil | Pathfinding capabilities `{allowocean, ignoreLand, allowplatformhopping}`. |
| `predictmovestarttime` | number or nil | nil | Predicted movement start time for client prediction. |
| `predictrunspeed` | number or nil | nil | Predicted run speed for client-side calculation. |
| `predictexternalspeedmultiplier` | SourceModifierList or nil | nil | Predicted external speed multiplier tracker. |
| `modifytempgroundspeedmultiplier` | function or nil | nil | Modifier function for temporary ground speed multipliers. |
| `tempgroundspeedmultiplier` | number or nil | nil | Temporary ground speed multiplier value. |
| `tempgroundspeedmulttime` | number or nil | nil | Timestamp for temporary ground speed multiplier expiry. |
| `tempgroundtile` | number or nil | nil | Ground tile associated with temporary speed multiplier. |
| `reserved_platform` | Entity or nil | nil | Platform reserved for upcoming hop. |
| `movetimeoverride` | task or nil | nil | Scheduled task for move time override. |
| `pusheventwithdirection` | boolean | false | Whether to include direction data in locomote events. |
| `softstop` | boolean or nil | nil | Whether soft stop mode is active. |
| `hop_distance_fn` | function or nil | nil | Custom function to calculate hop distance. |
| `no_predict_fastforward` | boolean or nil | nil | Whether to disable prediction fast-forward. |

## Main functions

### `EnableHopDelay(enable)`
* **Description:** Enables or disables hop delay tracking for platform transitions.
* **Parameters:** `enable` -- boolean to enable or disable hop delay.
* **Returns:** None.
* **Error states:** None.

### `StartUpdatingInternal()`
* **Description:** Starts the component update loop if entity is not asleep.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `StopUpdatingInternal()`
* **Description:** Stops the component update loop.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `OnEntitySleep()`
* **Description:** Called when entity goes to sleep; stops all movement.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `OnEntityWake()`
* **Description:** Called when entity wakes up; restarts update loop if needed.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `OnRemoveFromEntity()`
* **Description:** Called when component is removed; cleans up tags, events, and prediction data.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `GetTimeMoving()`
* **Description:** Returns the time in seconds the entity has been moving.
* **Parameters:** None.
* **Returns:** Number representing seconds of movement time.
* **Error states:** None.

### `StartMoveTimerInternal()`
* **Description:** Starts or restarts the movement timer.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `StopMoveTimerInternal()`
* **Description:** Stops the movement timer.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `OverrideMoveTimer(movetime)`
* **Description:** Overrides the movement timer with a specific value.
* **Parameters:** `movetime` -- number representing seconds to set as movement time.
* **Returns:** None.
* **Error states:** None.

### `PopOverrideTimeMoving()`
* **Description:** Pops and returns the override movement time (client-only).
* **Parameters:** None.
* **Returns:** Number representing override movement time, or nil if none.
* **Error states:** None.

### `RestartPredictMoveTimer()`
* **Description:** Restarts the prediction movement timer.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `CancelPredictMoveTimer()`
* **Description:** Cancels the prediction movement timer.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `OverridePredictTimer(t)`
* **Description:** Overrides the prediction timer with a specific timestamp.
* **Parameters:** `t` -- number representing timestamp.
* **Returns:** None.
* **Error states:** None.

### `StopMoving()`
* **Description:** Stops physics movement immediately.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Errors if `self.inst.Physics` is nil.

### `RecalculateExternalSpeedMultiplier(sources)`
* **Description:** Recalculates the combined external speed multiplier from all sources.
* **Parameters:** `sources` -- table of speed multiplier sources.
* **Returns:** Number representing combined multiplier.
* **Error states:** None.

### `SetExternalSpeedMultiplier(source, key, m)`
* **Description:** Sets an external speed multiplier from a specific source.
* **Parameters:**
  - `source` -- entity or identifier for the multiplier source
  - `key` -- string key for this specific multiplier
  - `m` -- number multiplier value (nil or 1 removes the multiplier)
* **Returns:** None.
* **Error states:** None.

### `RemoveExternalSpeedMultiplier(source, key)`
* **Description:** Removes an external speed multiplier. Key is optional to remove entire source.
* **Parameters:**
  - `source` -- entity or identifier for the multiplier source
  - `key` -- string key (optional, nil removes entire source)
* **Returns:** None.
* **Error states:** None.

### `GetExternalSpeedMultiplier(source, key)`
* **Description:** Gets the external speed multiplier from a specific source.
* **Parameters:**
  - `source` -- entity or identifier for the multiplier source
  - `key` -- string key (optional, nil returns combined source multiplier)
* **Returns:** Number representing multiplier value (1 if not found).
* **Error states:** None.

### `SetPredictExternalSpeedMultiplier(source, key, m)`
* **Description:** Sets a predicted external speed multiplier for client prediction.
* **Parameters:**
  - `source` -- entity or identifier for the multiplier source
  - `key` -- string key for this specific multiplier
  - `m` -- number multiplier value
* **Returns:** None.
* **Error states:** None.

### `RemovePredictExternalSpeedMultiplier(source, key)`
* **Description:** Removes a predicted external speed multiplier.
* **Parameters:**
  - `source` -- entity or identifier for the multiplier source
  - `key` -- string key (optional, nil removes entire source)
* **Returns:** None.
* **Error states:** None.

### `GetPredictExternalSpeedMultiplier(source, key)`
* **Description:** Gets the predicted external speed multiplier.
* **Parameters:**
  - `source` -- entity or identifier (optional)
  - `key` -- string key (optional)
* **Returns:** Number representing multiplier value (1 if not found).
* **Error states:** None.

### `SetSlowMultiplier(m)`
* **Description:** Sets the slow speed multiplier (used for creep terrain).
* **Parameters:** `m` -- number multiplier value.
* **Returns:** None.
* **Error states:** None.

### `SetTriggersCreep(triggers)`
* **Description:** Sets whether walking on creep triggers creep activation.
* **Parameters:** `triggers` -- boolean.
* **Returns:** None.
* **Error states:** None.

### `SetFasterOnCreep(faster)`
* **Description:** Sets whether entity moves faster on creep terrain.
* **Parameters:** `faster` -- boolean.
* **Returns:** None.
* **Error states:** None.

### `EnableGroundSpeedMultiplier(enable)`
* **Description:** Enables or disables ground speed multiplier calculations.
* **Parameters:** `enable` -- boolean.
* **Returns:** None.
* **Error states:** None.

### `GetWalkSpeed()`
* **Description:** Returns the current walk speed with all multipliers applied.
* **Parameters:** None.
* **Returns:** Number representing walk speed in units per second.
* **Error states:** None.

### `GetRunSpeed()`
* **Description:** Returns the current run speed with all multipliers applied.
* **Parameters:** None.
* **Returns:** Number representing run speed in units per second.
* **Error states:** None.

### `SetFasterOnGroundTile(ground_tile, is_faster)`
* **Description:** Sets whether entity moves faster on a specific ground tile type (server only).
* **Parameters:**
  - `ground_tile` -- number ground tile ID
  - `is_faster` -- boolean
* **Returns:** None.
* **Error states:** None.

### `UpdateGroundSpeedMultiplier()`
* **Description:** Updates the ground speed multiplier based on current terrain. TheWorld.GroundCreep and TheWorld.Map are always available in normal gameplay.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `PushTempGroundSpeedMultiplier(mult, tile)`
* **Description:** Pushes a temporary ground speed multiplier that expires after a short time.
* **Parameters:**
  - `mult` -- number multiplier value
  - `tile` -- number ground tile ID
* **Returns:** None.
* **Error states:** None.

### `TempGroundSpeedMultiplier()`
* **Description:** Returns the current temporary ground speed multiplier if still valid.
* **Parameters:** None.
* **Returns:** Number multiplier value, or nil if expired.
* **Error states:** None.

### `TempGroundTile()`
* **Description:** Returns the ground tile associated with the temporary speed multiplier if still valid.
* **Parameters:** None.
* **Returns:** Number ground tile ID, or nil if expired.
* **Error states:** None.

### `SetTempGroundSpeedMultiplierModifier(modifierfn)`
* **Description:** Sets a modifier function for temporary ground speed multipliers.
* **Parameters:** `modifierfn` -- function(inst, mult) that returns modified multiplier.
* **Returns:** None.
* **Error states:** None.

### `StartStrafing()`
* **Description:** Starts strafing mode (server only).
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `StopStrafing()`
* **Description:** Stops strafing mode (server only).
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `SetStrafing(strafing)`
* **Description:** Sets strafing mode state.
* **Parameters:** `strafing` -- boolean.
* **Returns:** None.
* **Error states:** Errors if strafing is true and self.inst.Transform is nil (no guard before GetRotation call).

### `SetMoveDir(dir)`
* **Description:** Sets the movement direction in radians.
* **Parameters:** `dir` -- number direction in radians.
* **Returns:** None.
* **Error states:** Errors if not strafing and self.inst.Transform is nil (no guard before SetRotation call).

### `FaceMovePoint(x, y, z)`
* **Description:** Faces the entity toward a point.
* **Parameters:**
  - `x` -- number X coordinate
  - `y` -- number Y coordinate
  - `z` -- number Z coordinate
* **Returns:** None.
* **Error states:** Errors if not strafing and self.inst lacks FacePoint or GetAngleToPoint methods.

### `SetMotorSpeed(speed)`
* **Description:** Sets the physics motor speed.
* **Parameters:** `speed` -- number speed value.
* **Returns:** None.
* **Error states:** Errors if `self.inst.Physics` is nil.

### `OnStrafeFacingChanged(dir)`
* **Description:** Called when strafe facing direction changes.
* **Parameters:** `dir` -- number new direction in radians.
* **Returns:** None.
* **Error states:** Errors if `self.inst.Transform` or `self.inst.Physics` is nil.

### `WalkForward(direct)`
* **Description:** Starts walking forward.
* **Parameters:** `direct` -- boolean for direct movement mode.
* **Returns:** None.
* **Error states:** Errors if `self.inst.Physics` is nil.

### `RunForward(direct)`
* **Description:** Starts running forward.
* **Parameters:** `direct` -- boolean for direct movement mode.
* **Returns:** None.
* **Error states:** Errors if `self.inst.Physics` is nil.

### `Clear()`
* **Description:** Clears destination, buffered action, and movement flags.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `ResetPath()`
* **Description:** Resets the current path and kills any pending path search.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `KillPathSearch()`
* **Description:** Kills any pending pathfinding search.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Errors if TheWorld.Pathfinder is nil or self.path.handle is accessed when self.path is nil.

### `SetReachDestinationCallback(fn)`
* **Description:** Sets a callback function to call when destination is reached.
* **Parameters:** `fn` -- function(inst) to call on arrival.
* **Returns:** None.
* **Error states:** None.

### `PreviewAction(bufferedaction, run, try_instant)`
* **Description:** Previews a buffered action without committing to it.
* **Parameters:**
  - `bufferedaction` -- BufferedAction to preview
  - `run` -- boolean whether to run to destination
  - `try_instant` -- boolean to attempt instant execution
* **Returns:** None.
* **Error states:** Errors if bufferedaction methods are called on nil action.

### `PushAction(bufferedaction, run, try_instant)`
* **Description:** Pushes a buffered action for execution.
* **Parameters:**
  - `bufferedaction` -- BufferedAction to execute
  - `run` -- boolean whether to run to destination
  - `try_instant` -- boolean to attempt instant execution
* **Returns:** None.
* **Error states:** Errors if bufferedaction methods are called on nil action.

### `GoToEntity(target, bufferedaction, run)`
* **Description:** Sets destination to an entity and starts pathfinding.
* **Parameters:**
  - `target` -- entity instance to move to
  - `bufferedaction` -- BufferedAction context (optional)
  - `run` -- boolean whether to run instead of walk
* **Returns:** None.
* **Error states:** Errors if target lacks required components for distance calculation.

### `GoToPoint(pt, bufferedaction, run, overridedest)`
* **Description:** Sets destination to a point and starts pathfinding.
* **Parameters:**
  - `pt` -- Vector3 or nil destination point
  - `bufferedaction` -- BufferedAction context (optional)
  - `run` -- boolean whether to run instead of walk
  - `overridedest` -- Dest object to override destination (optional)
* **Returns:** None.
* **Error states:** None.

### `SetBufferedAction(act)`
* **Description:** Sets the current buffered action, failing any previous action.
* **Parameters:** `act` -- BufferedAction or nil.
* **Returns:** None.
* **Error states:** None.

### `Stop(sgparams)`
* **Description:** Stops all movement and clears destination.
* **Parameters:** `sgparams` -- table of stategraph parameters (optional).
* **Returns:** None.
* **Error states:** None.

### `WalkInDirection(direction, should_run)`
* **Description:** Walks in a specific direction without a destination.
* **Parameters:**
  - `direction` -- number direction in radians
  - `should_run` -- boolean whether to run
* **Returns:** None.
* **Error states:** None.

### `RunInDirection(direction, throttle)`
* **Description:** Runs in a specific direction with optional throttle.
* **Parameters:**
  - `direction` -- number direction in radians
  - `throttle` -- number throttle value 0-1 (optional, default 1)
* **Returns:** None.
* **Error states:** None.

### `GetDebugString()`
* **Description:** Returns a debug string with current locomotion state.
* **Parameters:** None.
* **Returns:** String with movement state, speed, destination, and tile info.
* **Error states:** Errors if `TheWorld` is nil.

### `HasDestination()`
* **Description:** Checks if entity has a valid destination.
* **Parameters:** None.
* **Returns:** Boolean.
* **Error states:** None.

### `SetShouldRun(should_run)`
* **Description:** Sets whether entity should run instead of walk.
* **Parameters:** `should_run` -- boolean.
* **Returns:** None.
* **Error states:** None.

### `WantsToRun()`
* **Description:** Checks if entity wants to run.
* **Parameters:** None.
* **Returns:** Boolean.
* **Error states:** None.

### `WantsToMoveForward()`
* **Description:** Checks if entity wants to move forward.
* **Parameters:** None.
* **Returns:** Boolean.
* **Error states:** None.

### `WaitingForPathSearch()`
* **Description:** Checks if entity is waiting for a pathfinding search to complete.
* **Parameters:** None.
* **Returns:** Boolean.
* **Error states:** None.

### `UpdateHopping(dt)`
* **Description:** Deprecated hopping update function.
* **Parameters:** `dt` -- number delta time.
* **Returns:** None.
* **Error states:** None.

### `FinishHopping()`
* **Description:** Finishes the hop state and clears reserved platform.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `SetAllowPlatformHopping(enabled)`
* **Description:** Enables or disables platform hopping.
* **Parameters:** `enabled` -- boolean.
* **Returns:** None.
* **Error states:** None.

### `CheckEdge(my_platform, map, my_x, my_z, dir_x, dir_z, radius)`
* **Description:** Checks if a point is at the edge of the current platform.
* **Parameters:**
  - `my_platform` -- entity current platform
  - `map` -- world map object
  - `my_x` -- number current X position
  - `my_z` -- number current Z position
  - `dir_x` -- number direction X component
  - `dir_z` -- number direction Z component
  - `radius` -- number check radius
* **Returns:** Boolean.
* **Error states:** Errors if map methods are nil.

### `IsAtEdge(my_platform, map, my_x, my_z, dir_x, dir_z)`
* **Description:** Checks if entity is at the edge of its platform.
* **Parameters:**
  - `my_platform` -- entity current platform
  - `map` -- world map object
  - `my_x` -- number current X position
  - `my_z` -- number current Z position
  - `dir_x` -- number direction X component
  - `dir_z` -- number direction Z component
* **Returns:** Boolean.
* **Error states:** Errors if `self.inst.Physics` is nil.

### `GetHopDistance(speed_mult)`
* **Description:** Returns the hop distance with optional speed multiplier.
* **Parameters:** `speed_mult` -- number speed multiplier (optional).
* **Returns:** Number hop distance.
* **Error states:** None.

### `IsValidDestinationPlatform(my_platform, dest_platform)`
* **Description:** Checks if a destination platform is valid for hopping.
* **Parameters:**
  - `my_platform` -- entity current platform
  - `dest_platform` -- entity destination platform
* **Returns:** Boolean.
* **Error states:** Errors if dest_platform lacks required components.

### `ScanForPlatformInDir_Internal(my_platform, map, my_x, my_z, dir_x, dir_z, steps, steps_to_land, step_size, nodelay, from_floating)`
* **Description:** Internal function to scan for platforms in a direction.
* **Parameters:**
  - `my_platform` -- entity current platform (nil if from floating)
  - `map` -- world map object
  - `my_x` -- number current X position
  - `my_z` -- number current Z position
  - `dir_x` -- number direction X component
  - `dir_z` -- number direction Z component
  - `steps` -- number maximum steps to scan
  - `steps_to_land` -- number additional steps when jumping to land (optional)
  - `step_size` -- number size of each step
  - `nodelay` -- boolean to skip hop delay
  - `from_floating` -- boolean whether jumping from floating platform
* **Returns:** Multiple values: can_hop (boolean), hop_x (number), hop_z (number), platform (entity or nil).
* **Error states:** Errors if TheSim, map, or platform components are nil.

### `ScanForPlatformInDir(my_platform, map, my_x, my_z, dir_x, dir_z, steps, step_size)`
* **Description:** Scans for platforms in a direction from current platform.
* **Parameters:**
  - `my_platform` -- entity current platform
  - `map` -- world map object
  - `my_x` -- number current X position
  - `my_z` -- number current Z position
  - `dir_x` -- number direction X component
  - `dir_z` -- number direction Z component
  - `steps` -- number maximum steps to scan
  - `step_size` -- number size of each step
* **Returns:** Multiple values: can_hop (boolean), hop_x (number), hop_z (number), platform (entity or nil).
* **Error states:** Errors if `self.inst.Physics` is nil.

### `ScanForPlatformInDirFromFloating(map, my_x, my_z, dir_x, dir_z, steps_to_platform, steps_to_land, step_size, nodelay)`
* **Description:** Scans for platforms from a floating position.
* **Parameters:**
  - `map` -- world map object
  - `my_x` -- number current X position
  - `my_z` -- number current Z position
  - `dir_x` -- number direction X component
  - `dir_z` -- number direction Z component
  - `steps_to_platform` -- number steps to scan for platform
  - `steps_to_land` -- number steps to scan for land
  - `step_size` -- number size of each step
  - `nodelay` -- boolean to skip hop delay
* **Returns:** Multiple values: can_hop (boolean), hop_x (number), hop_z (number), platform (entity or nil).
* **Error states:** None.

### `TestForBlocked(my_x, my_z, dir_x, dir_z, radius, test_length)`
* **Description:** Tests if a path is blocked by obstacles.
* **Parameters:**
  - `my_x` -- number start X position
  - `my_z` -- number start Z position
  - `dir_x` -- number direction X component
  - `dir_z` -- number direction Z component
  - `radius` -- number check radius
  - `test_length` -- number length to test
* **Returns:** Boolean (true if blocked).
* **Error states:** Errors if TheSim is nil.

### `ScanForPlatform(my_platform, target_x, target_z, hop_distance)`
* **Description:** Scans for a valid platform to hop to toward a target.
* **Parameters:**
  - `my_platform` -- entity current platform
  - `target_x` -- number target X position
  - `target_z` -- number target Z position
  - `hop_distance` -- number maximum hop distance
* **Returns:** Multiple values: can_hop (boolean), px (number), pz (number), found_platform (entity or nil), blocked (boolean).
* **Error states:** Errors if `self.inst.Transform` is nil.

### `StartHopping(x, z, target_platform)`
* **Description:** Starts the hop state toward a platform.
* **Parameters:**
  - `x` -- number target X position
  - `z` -- number target Z position
  - `target_platform` -- entity target platform (optional)
* **Returns:** None.
* **Error states:** None.

### `CheckDrownable()`
* **Description:** Wrapper function to check drownable component.
* **Parameters:** None.
* **Returns:** Boolean (true if drownable check passes).
* **Error states:** None.

### `OnUpdate(dt, arrive_check_only)`
* **Description:** Main update function called every frame during movement.
* **Parameters:**
  - `dt` -- number delta time
  - `arrive_check_only` -- boolean to only check arrival without moving
* **Returns:** None.
* **Error states:** Errors if TheWorld, map, or pathfinder components are nil.

### `IsAquatic()`
* **Description:** Checks if entity is configured for aquatic pathfinding.
* **Parameters:** None.
* **Returns:** Boolean.
* **Error states:** None.

### `CanPathfindOnWater()`
* **Description:** Checks if entity can pathfind on water.
* **Parameters:** None.
* **Returns:** Boolean.
* **Error states:** None.

### `IsTerrestrial()`
* **Description:** Checks if entity is configured for terrestrial pathfinding.
* **Parameters:** None.
* **Returns:** Boolean.
* **Error states:** None.

### `CanPathfindOnLand()`
* **Description:** Checks if entity can pathfind on land.
* **Parameters:** None.
* **Returns:** Boolean.
* **Error states:** None.

### `AdjustPathCaps(enabled, capname)`
* **Description:** Adjusts pathfinding capabilities.
* **Parameters:**
  - `enabled` -- boolean to enable or disable
  - `capname` -- string capability name (allowocean, ignoreLand, allowplatformhopping)
* **Returns:** None.
* **Error states:** None.

### `FindPath()`
* **Description:** Initiates pathfinding to the current destination.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Errors if self.dest is nil (calls :IsValid() on nil) or TheWorld.Pathfinder is nil.

## Events & listeners
- **Listens to:** `onremove` -- triggered when external speed multiplier source is removed, recalculates combined multiplier.
- **Pushes:** `locomote` -- fired when movement state changes, includes direction if pusheventwithdirection is true.
- **Pushes:** `onreachdestination` -- fired when destination is reached, includes target entity and position.
- **Pushes:** `walkoncreep` -- fired when entity starts walking on creep terrain, includes spawner data.
- **Pushes:** `walkoffcreep` -- fired when entity stops walking on creep terrain.
- **Pushes:** `startstrafing` -- fired when strafing mode starts (server only).
- **Pushes:** `stopstrafing` -- fired when strafing mode stops (server only).
- **Pushes:** `onhop` -- fired when hop begins, includes x/z coordinates if amphibious transition.
- **Pushes:** `bufferedcastaoe` -- fired when casting AOE action with buffered locomotion.
- **Pushes:** `actionfailed` -- fired when buffered action fails validation.