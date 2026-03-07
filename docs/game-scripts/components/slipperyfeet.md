---
id: slipperyfeet
title: Slipperyfeet
description: Manages the accumulation and decay of slippiness on an entity, enabling ice-related movement mechanics and slip events based on speed and environmental factors.
tags: [locomotion, physics, environment]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b5bb16a7
system_scope: physics
---
# Slipperyfeet

> Based on game build **714004** | Last updated: 2026-03-03

## Overview
The `slipperyfeet` component tracks how much slippiness an entity accumulates based on movement speed and environmental conditions (e.g., ocean ice tiles or nearby slippery entities). When slippiness exceeds a predefined threshold, the `feetslipped` event is fired. The component supports gradual buildup during motion and decay when the entity slows or leaves icy zones. It cooperates closely with the `slipperyfeettarget`, `nonslipgritpool`, and `nonslipgrituser` components to modulate slippiness behavior dynamically.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("slipperyfeet")
-- Slippiness accumulates automatically when the entity runs on ice.
-- Event listener example:
inst:ListenForEvent("feetslipped", function() 
    print("Entity slipped!") 
end)
```

## Dependencies & tags
**Components used:** `slipperyfeettarget`, `nonslipgritpool`, `nonslipgrituser`
**Tags:** Checks for `slipperyfeettarget` and `nonslipgritpool`; adds no new tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `slippiness` | number | `0` | Current slippiness value; increases with movement speed on ice and decreases over time. |
| `threshold` | number | `TUNING.WILSON_RUN_SPEED * 4` | Threshold at which `feetslipped` event is triggered. |
| `decay_accel` | number | `TUNING.WILSON_RUN_SPEED * 2` | Acceleration used to compute decay speed during slowdown. |
| `decay_spd` | number | `0` | Current decay speed, updated each frame during decay. |
| `onicetile` | boolean | `false` | Whether the entity is currently standing on an ocean ice tile. |
| `started` | boolean | `false` | Whether the component has begun tracking slippiness (state-dependent). |
| `_sources` | SourceModifierList | `SourceModifierList(...)` | Tracks active sources (e.g., `"ocean_ice"`, `"ice_entity"`) that enable slippiness. |
| `_updating` | table | `{}` | Tracks active updater tasks (e.g., `"accumulate"`, `"decay"`) to prevent duplicates. |

## Main functions
### `StartSlipperySource(src, key)`
*   **Description:** Activates a source (e.g., `"ocean_ice"`, `"ice_entity"`) that contributes to slippiness and starts internal update mechanisms if not already running.
*   **Parameters:**  
    `src` (string) – Name of the source.  
    `key` (any, optional) – Identifier for deduplication when the same source may be added multiple times.
*   **Returns:** Nothing.

### `StopSlipperySource(src, key)`
*   **Description:** Deactivates a previously added source; stops internal updates if no sources remain.
*   **Parameters:**  
    `src` (string) – Name of the source.  
    `key` (any, optional) – Identifier matching the key used in `StartSlipperySource`.
*   **Returns:** Nothing.

### `DoDelta(delta)`
*   **Description:** Adjusts `slippiness` by `delta`. Triggers decay or `feetslipped` event as appropriate.
*   **Parameters:**  
    `delta` (number) – Amount to add to `slippiness`.
*   **Returns:** Nothing.

### `Start_Internal()`
*   **Description:** Begins update-related logic when slippiness can accumulate (e.g., entity is running and not blocked by `noslip`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Stop_Internal()`
*   **Description:** Stops update-related logic when slippiness should no longer accumulate (e.g., entity stops running or enters `noslip` state).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetCurrent(val)`
*   **Description:** Sets the current `slippiness` value directly and manages decay task state.
*   **Parameters:**  
    `val` (number) – New slippiness value.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Primary per-frame update loop. Handles ice tile tracking, entity proximity checks, slippiness accumulation, and grit-based decay.
*   **Parameters:**  
    `dt` (number) – Delta time since last frame.
*   **Returns:** Nothing.

### `LongUpdate(dt)`
*   **Description:** Infrequent update used when the entity moves slowly (e.g., paused in air), accumulating slippiness for a single simulated frame instead of per `dt`.
*   **Parameters:**  
    `dt` (number) – Delta time (used for decay, not accumulation).
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted string for debugging, showing current slippiness, threshold, and current accumulation/decay rate.
*   **Parameters:** None.
*   **Returns:**  
    `string` – e.g., `"12.3/32.0 (+5.1/s)"`

## Events & listeners
- **Listens to:**  
  `on_OCEAN_ICE_tile` – triggers state change when the entity enters or leaves ocean ice.  
  `newstate` – detects when the entity enters/exits `running` state or `noslip` state.
- **Pushes:**  
  `feetslipped` – fired when `slippiness` reaches or exceeds `threshold`.
