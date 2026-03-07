---
id: honey_trail
title: Honey Trail
description: Applies temporary ground speed penalty to nearby entities stepping on honey trails via the LocoMotor component.
tags: [locomotion, environment, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c7a318bb
system_scope: environment
---

# Honey Trail

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `honey_trail` prefab represents a temporary visual and gameplay effect that simulates a sticky honey trail left on the ground. It periodically detects entities in its radius and reduces their ground movement speed using the `locomotor` component's `PushTempGroundSpeedMultiplier` method. The trail animates through three stages (`_pre`, `trail`, `_pst`) and automatically removes itself after a fixed duration.

This prefab is a client-server aware entity: the master sim handles full area effect updates, while non-master clients only update for the local player to reduce overhead.

## Usage example
```lua
-- Typically instantiated internally by the game when a bee queen leaves a trail
-- Modders usually do not instantiate this directly; it is managed by the bee queen's AI.
-- Example (for reference only):
local trail = SpawnPrefab("honey_trail")
trail.components.honey_trail.SetVariation(trail, 1, 1.0, 5.0)  -- Variation index, scale, duration
```

## Dependencies & tags
**Components used:** `locomotor`, `animstate`, `soundemitter`, `transform`, `network`  
**Tags:** `FX` (added); checked `locomotor`, `flying`, `playerghost`, `INLIMBO`, `honey_ammo_afflicted`, `vigorbuff`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `trailname` | string | `nil` | Base name of the animation sequence (e.g., `"trail1"`) used for `_pre`, `_pst` suffixes. |
| `duration` | number | `nil` | Duration in seconds before the trail begins fading out. |
| `_isfading` | net_bool | `false` | Replicated boolean indicating whether the trail is in its fade-out phase. |
| `task` | Task | `nil` | Handle to the active periodic or delayed task managing updates or removal. |

## Main functions
### `SetVariation(inst, rand, scale, duration)`
*   **Description:** Initializes the trail's appearance, sound, and animation based on a random variation index. Must be called exactly once after instantiation on the master sim.
*   **Parameters:**  
    `rand` (number) – Integer index to select the animation variation (e.g., 1 → `"trail1"`).  
    `scale` (number) – Uniform scaling factor for the entity.  
    `duration` (number) – Time in seconds before fading starts.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `trailname` is already set.

### `OnUpdate(inst, x, y, z, rad)`
*   **Description:** Master sim function that scans the area for valid entities and applies a speed penalty via `locomotor:PushTempGroundSpeedMultiplier`.
*   **Parameters:**  
    `x`, `y`, `z` (numbers) – Position and origin of the effect.  
    `rad` (number) – Radius in world units to scan for entities.
*   **Returns:** Nothing.

### `OnUpdateClient(inst, x, y, z, rad)`
*   **Description:** Client-only function that applies the same speed penalty *only* for the local player if within radius.
*   **Parameters:** Same as `OnUpdate`.
*   **Returns:** Nothing.

### `OnInit(inst, scale)`
*   **Description:** Sets up the periodic update task. Chooses between `OnUpdate` (master sim) or `OnUpdateClient` based on sim role.
*   **Parameters:** `scale` (number) – Used for radius calculation (defaults to current transform scale).
*   **Returns:** Nothing.

### `OnAnimOver(inst)`
*   **Description:** Handles animation state transitions and cleanup based on current animation: advances from `_pre` to loop, then fades out on `_pst`, finally removes the entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `animover` – Triggers `OnAnimOver` to advance animation states.  
  `isfadingdirty` – Client-side only; triggers `OnIsFadingDirty` to cancel tasks when fading completes on master.
- **Pushes:** None.