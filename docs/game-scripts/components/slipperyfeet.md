---
id: slipperyfeet
title: SlipperyFeet
description: Manages slip accumulation and decay for entities moving on ice or slippery surfaces.
tags: [movement, physics, terrain]
sidebar_position: 10
last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: components
source_hash: 903bb7c8
system_scope: entity
---

# SlipperyFeet

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`SlipperyFeet` tracks slip accumulation for entities moving across icy or slippery terrain. It monitors nearby `slipperyfeettarget` entities (ice patches, frozen surfaces) and `nonslipgritpool` entities (grit that reduces slip), accumulating slip based on movement speed and decaying over time. When slip exceeds a threshold, the component pushes a `feetslipped` event to trigger slip animations or effects. The component uses a source modifier system to track multiple slip sources simultaneously.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("slipperyfeet")

-- Start a slip source (e.g., standing on ice)
inst.components.slipperyfeet:StartSlipperySource("ice_entity")

-- Check current slip level
local slip = inst.components.slipperyfeet.slippiness
local threshold = inst.components.slipperyfeet.threshold

-- Stop slip source when leaving ice
inst.components.slipperyfeet:StopSlipperySource("ice_entity")
```

## Dependencies & tags
**External dependencies:**
- `util/sourcemodifierlist` -- manages multiple slip source modifiers with boolean values

**Components used:**
- `slipperyfeettarget` -- checked on nearby entities to determine slip zones; calls `GetSlipperyRate()` and `IsSlipperyAtPosition()`
- `nonslipgritpool` -- checked on nearby entities to detect anti-slip grit zones; calls `IsGritAtPosition()`
- `nonslipgrituser` -- checked on self entity; calls `DoDelta()` when grit is active but not at position
- `physics` -- calls `GetMotorSpeed()` to calculate slip accumulation rate
- `transform` -- calls `GetWorldPosition()` for spatial queries
- `stategraph` -- checks state tags "running", "spinning", "noslip" via `inst.sg`

**Tags:**
- `slipperyfeettarget` -- searched for in radius to detect slip zones
- `nonslipgritpool` -- searched for in radius to detect grit zones

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity instance. |
| `_sources` | SourceModifierList | --- | Tracks active slip sources with boolean modifiers. |
| `_updating` | table | `{}` | Tracks which update loops are active by reason key. |
| `onicetile` | boolean | `false` | Whether the entity is currently on an ocean ice tile. |
| `started` | boolean | `false` | Whether the component has started listening for state changes. |
| `threshold` | number | `TUNING.WILSON_RUN_SPEED * 4` | Slip value at which `feetslipped` event is pushed. |
| `decay_accel` | number | `TUNING.WILSON_RUN_SPEED * 2` | Acceleration rate for slip decay speed. |
| `decay_spd` | number | `0` | Current decay speed used in `DoDecay()` calculations. |
| `slippiness` | number | `0` | Current accumulated slip value. |
| `inittask` | task | `nil` | Delayed initialization task handle. |
| `checknearbyentitytask` | task | `nil` | Slow update check task handle for nearby entity detection. |

## Main functions
### `OnInit(inst)`
* **Description:** Initializes the component after a short delay. Sets up ocean ice tile event listener and checks initial position for ice. Schedules slow update check if not on ocean ice.
* **Parameters:** `inst` -- the owning entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.slipperyfeet` is nil when accessing `self` via `inst.components.slipperyfeet` — no nil guard present.

### `OnOceanIce(inst, on_ocean_ice)`
* **Description:** Callback for ocean ice tile changes. Starts slip source when entering ocean ice, stops when leaving. Manages `checkice` update loop based on tile state.
* **Parameters:**
  - `inst` -- the owning entity instance
  - `on_ocean_ice` -- boolean indicating if entity is on ocean ice tile
* **Returns:** nil
* **Error states:** Errors if `inst.components.slipperyfeet` is nil when accessing `self` — no nil guard present.

### `SlowUpdateCheck(inst)`
* **Description:** Periodic check for nearby slippery entities. Reschedules itself if no entities found, or starts faster `checkiceentity` update loop when entities are detected.
* **Parameters:** `inst` -- the owning entity instance
* **Returns:** nil
* **Error states:** Errors if `inst.components.slipperyfeet` is nil when accessing `self` — no nil guard present.

### `OnLoad()`
* **Description:** Restore hook called when entity loads from save. Cancels pending init task and runs `OnInit()` immediately if task exists.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `OnRemoveFromEntity()`
* **Description:** Cleanup hook called when component is removed from entity. Cancels all pending tasks, removes event listeners, and stops all internal update loops.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `StartSlipperySource(src, key)`
* **Description:** Activates a slip source by setting a modifier in `_sources`. Calls `Start_Internal()` to begin state tracking if this is the first source.
* **Parameters:**
  - `src` -- string identifier for the slip source (e.g., "ice_entity", "ocean_ice")
  - `key` -- optional key for distinguishing multiple sources of same type
* **Returns:** nil
* **Error states:** None

### `StopSlipperySource(src, key)`
* **Description:** Removes a slip source modifier. Calls `Stop_Internal()` if no sources remain active.
* **Parameters:**
  - `src` -- string identifier for the slip source
  - `key` -- optional key matching the source started
* **Returns:** nil
* **Error states:** None

### `GetSlipperyAndNearbyEnts()`
* **Description:** Searches within `SLIPPERY_CHECK_RADIUS` for entities with `slipperyfeettarget` component. Returns the first entity that is slippery at the current position, plus the first nearby entity found.
* **Parameters:** None
* **Returns:** Two values: slippery entity (or `nil`), first nearby entity (or `nil`)
* **Error states:** Errors if `self.inst.Transform` is nil when calling `GetWorldPosition()` — no nil guard present.

### `Start_Internal()`
* **Description:** Begins component state tracking. Sets `started` flag, registers `newstate` event listener, and calls `OnNewState()` to initialize accumulation state based on current stategraph tags.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `inst.sg` is nil when calling `HasAnyStateTag()` or `HasStateTag()` — no nil guard present.

### `Stop_Internal()`
* **Description:** Stops component state tracking. Clears `started` flag, removes `newstate` event listener, and disables accumulation via `SetAccumulating_Internal(false)`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `SetAccumulating_Internal(accumulating)`
* **Description:** Controls whether slip is accumulating based on movement. Starts or stops the `accumulate` update loop. Resets `decay_spd` to 0 when toggling state.
* **Parameters:** `accumulating` -- boolean to enable or disable accumulation
* **Returns:** nil
* **Error states:** None

### `SetCurrent(val)`
* **Description:** Sets the current slip value directly. Starts `decay` update loop if value is positive. Pushes `feetslipped` event if value meets or exceeds threshold.
* **Parameters:** `val` -- number representing slip value
* **Returns:** nil
* **Error states:** None

### `DoDelta(delta)`
* **Description:** Applies a delta to current slip value. Positive deltas reset `decay_spd` to 0. Negative deltas are clamped to minimum 0 via `math.max()`.
* **Parameters:** `delta` -- number to add to current slippiness (can be negative)
* **Returns:** nil
* **Error states:** None

### `CalcAccumulatingSpeed()`
* **Description:** Calculates slip accumulation rate based on entity movement speed. Applies curved formula `(speed * speed) / TUNING.WILSON_RUN_SPEED`. Reduces speed for spinning state using `TUNING.WX78_SPIN_RUNSPEED_MULT` and `TUNING.WX78_SPIN_SLIPPERY`.
* **Parameters:** None
* **Returns:** number representing accumulation speed
* **Error states:** Errors if `inst.Physics` is nil when calling `GetMotorSpeed()` — no nil guard present. Errors if `inst.sg` is nil when calling `HasStateTag()` — no nil guard present.

### `StartUpdating_Internal(reason)`
* **Description:** Registers an update loop by reason key. Starts component updating via `StartUpdatingComponent()` if this is the first active update. Cancels `checknearbyentitytask` when starting.
* **Parameters:** `reason` -- string key identifying the update loop (e.g., "accumulate", "decay", "checkice")
* **Returns:** nil
* **Error states:** Errors if `self.inst` is nil when calling `StartUpdatingComponent()` — no nil guard present.

### `StopUpdating_Internal(reason)`
* **Description:** Unregisters an update loop by reason key. Stops component updating via `StopUpdatingComponent()` if no updates remain. Reschedules `checknearbyentitytask` when all updates stop.
* **Parameters:** `reason` -- string key identifying the update loop to stop
* **Returns:** nil
* **Error states:** None — includes nil guard checking `self.inst.components.slipperyfeet ~= nil` before rescheduling task.

### `DoDecay(dt)`
* **Description:** Applies slip decay over time. Uses average speed calculation: `(speed + decay_spd) / 2`. Increases `decay_spd` by `decay_accel * dt` each call. Calls `DoDelta()` with negative value.
* **Parameters:** `dt` -- delta time in seconds
* **Returns:** nil
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Main update loop called every frame when component is updating. Checks ocean ice tile status, nearby ice entities, and grit pools. Accumulates slip based on movement speed or decays existing slip. Applies random variation `(0.7 + 0.3 * math.random())` to accumulation rate.
* **Parameters:** `dt` -- delta time in seconds
* **Returns:** nil
* **Error states:** Errors if `TheWorld.Map` is nil when calling `IsOceanTileAtPoint()` or `IsVisualGroundAtPoint()` — no nil guard present. Errors if `self.inst.Transform` is nil when calling `GetWorldPosition()` — no nil guard present.

### `LongUpdate(dt)`
* **Description:** Less frequent update loop for when entity is idle. Accumulates slip for one frame only if accumulating, or continues decay if slip exists. Uses `FRAMES` constant instead of `dt` for accumulation.
* **Parameters:** `dt` -- delta time in seconds
* **Returns:** nil
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns formatted debug string showing current slip, threshold, and accumulation/decay rate. Format: `slippiness/threshold (+/-rate/s)`.
* **Parameters:** None
* **Returns:** string for debug display
* **Error states:** None

## Events & listeners
- **Listens to:** `on_OCEAN_ICE_tile` -- triggers `OnOceanIce()` when entity enters/exits ocean ice tiles
- **Listens to:** `newstate` -- triggers `OnNewState()` to update accumulation state based on stategraph tags
- **Pushes:** `feetslipped` -- fired when `slippiness` reaches or exceeds `threshold`