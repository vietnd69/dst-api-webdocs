---
id: slipperyfeet
title: Slipperyfeet
description: This component manages ice-based slippiness mechanics by tracking movement-based accumulation and decay of slip effects, responding to nearby ice entities and ocean ice tiles.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: b5bb16a7
---

# Slipperyfeet

## Overview
This component implements a slippiness system for player entities, dynamically adjusting a `slippiness` value based on movement speed while on slippery surfaces (e.g., ocean ice or ice-covered entities). It accumulates slip when running on ice and decays over time when stationary, triggering a `feetslipped` event when the value exceeds a defined threshold.

## Dependencies & Tags
- **Component Dependencies:** None (no explicit `inst:AddComponent` calls).
- **Tags Used:** Listens for entities with the `"slipperyfeettarget"` tag to determine local slip sources; checks for `"nonslipgritpool"` tag entities for grit-based nonslip effects.
- **Tag Adds/Removes:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_sources` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Tracks active slippery sources (e.g., `"ocean_ice"`, `"ice_entity"`). Boolean list used to gate `slippiness` accumulation. |
| `_updating` | `table` | `{}` | Tracks which update loops are active (e.g., `"accumulate"`, `"decay"`, `"checkice"`). Keys are string identifiers; values are booleans. |
| `onicetile` | `boolean` | `false` | `true` when the player is standing directly on an ocean ice tile. |
| `started` | `boolean` | `false` | Indicates whether the component is actively updating (i.e., listening to state changes). |
| `threshold` | `number` | `TUNING.WILSON_RUN_SPEED * 4` | Minimum `slippiness` value to trigger the `feetslipped` event. |
| `decay_accel` | `number` | `TUNING.WILSON_RUN_SPEED * 2` | Acceleration used for decay rate calculation (applied over time). |
| `decay_spd` | `number` | `0` | Current decay speed (used for linear interpolation of decay over time). |
| `slippiness` | `number` | `0` | Current accumulated slippiness value. Ranges from `0` (not slippery) upward; triggers `feetslipped` when exceeding `threshold`. |

## Main Functions

### `StartSlipperySource(src, key)`
* **Description:** Enables a slippery source (e.g., `"ocean_ice"` or `"ice_entity"`), activates internal updates, and begins accumulation of `slippiness` if not already active.  
* **Parameters:**  
  * `src` (string): The source identifier (e.g., `"ice_entity"`).  
  * `key` (any, optional): Optional key used for `SourceModifierList` scoping.

### `StopSlipperySource(src, key)`
* **Description:** Disables a slippery source. If no sources remain active, stops internal updates and `slippiness` accumulation.  
* **Parameters:**  
  * `src` (string): The source identifier to stop.  
  * `key` (any, optional): Optional key used for `SourceModifierList` scoping.

### `GetSlipperyAndNearbyEnts()`
* **Description:** Scans for nearby entities with the `"slipperyfeettarget"` tag within `SLIPPERY_CHECK_RADIUS` (12 units). Returns the first *valid* slippery entity (where `IsSlipperyAtPosition` returns `true`) and the first entity found (even if non-slippery). Used for detecting nearby ice patches or entities.  
* **Parameters:** None.

### `SetCurrent(val)`
* **Description:** Sets `slippiness` to `val`. If `val > 0`, starts the `decay` update loop; if `val ≥ threshold`, pushes the `feetslipped` event.  
* **Parameters:**  
  * `val` (number): The new `slippiness` value.

### `DoDelta(delta)`
* **Description:** Adjusts `slippiness` by `delta`, clamping to non-negative values. Handles both accumulation (positive `delta`) and decay (negative `delta`).  
* **Parameters:**  
  * `delta` (number): Change to apply to `slippiness`.

### `CalcAccumulatingSpeed()`
* **Description:** Computes a *curved* accumulation rate based on movement speed. Formula: `speed² / TUNING.WILSON_RUN_SPEED`. Used to increase slippiness faster at higher speeds.  
* **Parameters:** None.

### `StartUpdating_Internal(reason)`, `StopUpdating_Internal(reason)`
* **Description:** Manages component-level update cycles. `StartUpdating_Internal` activates `inst:StartUpdatingComponent`, cancelling any slow-check task; `StopUpdating_Internal` deactivates updates and restarts the slow-check task if no other updates are running.  
* **Parameters:**  
  * `reason` (string): Identifier for the update loop (e.g., `"accumulate"`, `"checkice"`).

### `DoDecay(dt)`
* **Description:** Applies decay to `slippiness` using a linearly accelerating speed (`decay_spd`), based on `decay_accel`. Simulates gradual loss of slip effect over time.  
* **Parameters:**  
  * `dt` (number): Delta time (seconds).

### `OnUpdate(dt)`
* **Description:** Main update loop called every frame when the component is active. Performs:  
  1. Ocean ice tile tracking (stops slip if visually grounded off-ice).  
  2. Slippery entity proximity checks (updates `"ice_entity"` source).  
  3. Accumulation or decay logic, influenced by grit pools and entity-specific slip rates.  
* **Parameters:**  
  * `dt` (number): Delta time (seconds).

### `LongUpdate(dt)`
* **Description:** High-interval update (e.g., for infrequent but precise adjustments). Accumulates slip in a single-frame burst (`FRAMES`), or decays if `slippiness > 0`.  
* **Parameters:**  
  * `dt` (number): Delta time (seconds).

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing: current `slippiness`, `threshold`, and either accumulation rate or current decay speed.  
* **Parameters:** None.

## Events & Listeners
- **Listens to `"on_OCEAN_ICE_tile"`**: Calls `OnOceanIce` when the entity enters or exits ocean ice tiles.
- **Listens to `"newstate"`**: Calls `OnNewState` to enable/disable accumulation when the entity enters or exits `"running"` state (and lacks `"noslip"`).
- **Triggers `"feetslipped"`**: Pushed via `inst:PushEvent` when `slippiness ≥ threshold` (within `SetCurrent`).