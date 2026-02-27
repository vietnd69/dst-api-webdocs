---
id: grottowaterfallsoundcontroller
title: Grottowaterfallsoundcontroller
description: Manages dynamic sound emitter assignment and volume fading for grotto waterfall audio based on proximity to the player.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: audio
source_hash: 5e5e8c4c
---

# Grottowaterfallsoundcontroller

## Overview
This component dynamically manages up to three sound emitters for grotto waterfall audio, assigning each to the nearest physical grotto pools (large or small) within range of the player. It maintains volume fading between emitters to ensure smooth audio transitions as the player moves, and tracks pool entities to update emitter assignments when pools are added or removed.

## Dependencies & Tags
- **Component Dependencies:** Relies on the `fader` component (used for volume interpolation) on each emitter prefab (`grottopool_sfx`).
- **Entity Tags:** No explicit tags added or removed by this component.
- **External Prefabs:** Spawns 3 instances of `"grottopool_sfx"` as sound emitters during initialization.
- **Event Listeners:** Registers for `"ms_registergrottopool"` to track grotto pools.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed in) | The entity instance this component is attached to. |
| `_player` | `Entity?` | `ThePlayer` | Cached reference to the local player; updated if invalid. |
| `_largepools` | `table` | `{}` | Table tracking valid large grotto pools (keys are pool entities). |
| `_smallpools` | `table` | `{}` | Table tracking valid small grotto pools (keys are pool entities). |
| `_soundemitters` | `table` | `{}` | Array of 3 spawned `grottopool_sfx` emitter prefabs. |
| `_process_task` | `Task?` | `nil` | Periodic task (every 5 frames) running `ProcessPlayer` to refresh emitter assignments. |

*Note: Most properties are private (`_`-prefixed) and managed internally.*

## Main Functions
### `ProcessPlayer()`
* **Description:** Computes the distance of each pool (large/small) to the player, sorts them, and reassigns up to three emitters to the closest pools. Handles volume fading when emitters are reassigned or removed.
* **Parameters:** None.

### `TrackPool(inst, data)`
* **Description:** Registers a grotto pool for tracking, distinguishing between large and small pools based on `data.small`. Adds an `"onremove"` callback to stop tracking when the pool is destroyed.
* **Parameters:**  
  - `inst`: The event emitter (unused).  
  - `data`: Table containing `pool = pool_entity, small = boolean`.

### `StopTrackingPool(pool)`
* **Description:** Removes a pool from tracking (`_largepools` or `_smallpools`) and removes its `"onremove"` listener. Called automatically when a tracked pool is removed.
* **Parameters:**  
  - `pool`: The pool entity to stop tracking.

### `GetDebugString()`
* **Description:** Returns a formatted debug string reporting counts of tracked large pools, small pools, and currently active sound emitters.
* **Parameters:** None.

### `get_pools_close_to_player_dsqsorted()`
* **Description:** (Private helper) Returns a sorted list of \{pool, dsq, is_large\} for pools within `EMITTER_MAXDSQ` (1600) of the player, excluding the pool’s radius.
* **Parameters:** None.

### `generate_emitter_pairs(pools_with_distances)`
* **Description:** (Private helper) Attempts to pair up to `NUM_EMITTERS` (3) closest pools with existing emitters, prioritizing reused assignments. Unpaired pools are stored under `"unclaimed"`.
* **Parameters:**  
  - `pools_with_distances`: Sorted list of `pool, dsq, is_large` entries.

### `FadeUpdate(val, e)` and `FadeFinished(e, val2)`
* **Description:** (Private helpers) Callbacks for volume fading—`FadeUpdate` sets the emitter’s volume during the fade, and `FadeFinished` restarts the emitter with full volume after fading out.
* **Parameters:**  
  - `val`/`val2`: Interpolated volume during/after fade.  
  - `e`: Sound emitter entity.

## Events & Listeners
- **Listens for:**
  - `"ms_registergrottopool"` → triggers `TrackPool`
- **Triggers no events itself** (does not call `PushEvent` on `inst`).

---