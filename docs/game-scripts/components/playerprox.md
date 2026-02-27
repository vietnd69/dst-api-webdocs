---
id: playerprox
title: Playerprox
description: Tracks proximity of one or more players relative to an entity and triggers callbacks when players enter or exit specified distance ranges.

sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 67ad0833
---

# Playerprox

## Overview
The `PlayerProx` component monitors player proximity to an entity using configurable inner (`near`) and outer (`far`) radius thresholds. It supports four distinct operational modes—tracking all players, any single player, locking onto and tracking a single player temporarily, or locking onto and permanently tracking one player—and invokes user-defined callbacks when players cross the threshold boundaries. It periodically rechecks proximity and supports wake/sleep lifecycle integration.

## Dependencies & Tags
* **Component Usage**: Requires no specific pre-existing components on `inst`.
* **Event Listeners**: Internally listens for `"onremove"` events on tracked target players (for `LockOnPlayer` and `LockAndKeepPlayer` modes).
* **Entity Tags**: No tags added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `near` | number | `2` | Inner radius (inclusive); triggers `onnear` callback when a player enters this range. |
| `far` | number | `3` | Outer radius (exclusive); triggers `onfar` callback when a player exits this range. |
| `isclose` | boolean | `false` | Current proximity state: `true` if at least one tracked player is within `near` radius. |
| `period` | number | `10 * FRAMES` | Time interval (in frames) between proximity checks. |
| `onnear` | function | `nil` | Callback triggered when a player enters the `near` radius; signature: `(inst, player)`. |
| `onfar` | function | `nil` | Callback triggered when a player leaves the `far` radius; signature varies by mode (`(inst, player)` or `(inst)`). |
| `target` | entity | `nil` | The specific player being tracked in `SpecificPlayer`, `LockOnPlayer`, or `LockAndKeepPlayer` modes. |
| `closeplayers` | table | `{}` | Dictionary mapping tracked close players to `true`; used in `AllPlayers` mode. |
| `alivemode` | enum/boolean | `nil` | Filters players by alive state: `true` = alive only, `false` = dead only, `nil` = any state. |
| `targetmode` | function | `AnyPlayer` | Internal function pointer defining the current proximity logic (`AllPlayers`, `AnyPlayer`, `SpecificPlayer`, `LockOnPlayer`, `LockAndKeepPlayer`). |

## Main Functions
### `PlayerProx:SetOnPlayerNear(fn)`
* **Description:** Assigns the callback function invoked when a player enters the `near` radius.
* **Parameters:**
  * `fn` (function): Callback with signature `(inst, player)`.

### `PlayerProx:SetOnPlayerFar(fn)`
* **Description:** Assigns the callback function invoked when a player leaves the `far` radius.
* **Parameters:**
  * `fn` (function): Callback with signature `(inst)` for `AnyPlayer` mode, or `(inst, player)` for other modes.

### `PlayerProx:SetDist(near, far)`
* **Description:** Updates the inner and outer proximity thresholds.
* **Parameters:**
  * `near` (number): New inner radius.
  * `far` (number): New outer radius.

### `PlayerProx:Schedule([new_period])`
* **Description:** Starts or restarts the periodic proximity check task with an optional custom interval.
* **Parameters:**
  * `new_period` (number, optional): Custom interval (in frames) for the task; defaults to `self.period`.

### `PlayerProx:ForceUpdate()`
* **Description:** Immediately executes the current `targetmode` logic to update proximity state and callbacks, without waiting for the next scheduled task.

### `PlayerProx:Stop()`
* **Description:** Cancels the scheduled proximity check task and sets `self.task` to `nil`.

### `PlayerProx:SetTargetMode(mode, target, override)`
* **Description:** Switches the tracking behavior mode, sets the target player (if applicable), and restarts the task.
* **Parameters:**
  * `mode` (function): One of `AllPlayers`, `AnyPlayer`, `SpecificPlayer`, `LockOnPlayer`, or `LockAndKeepPlayer`.
  * `target` (entity, optional): Player entity for `SpecificPlayer`, `LockOnPlayer`, or `LockAndKeepPlayer` modes.
  * `override` (boolean, optional): If `true`, preserves the original mode for later restoration (used internally by `LockOnPlayer`/`LockAndKeepPlayer`).

### `PlayerProx:SetTarget(target)`
* **Description:** Assigns the tracked player entity and sets up `"onremove"` event listeners to detect target removal.
* **Parameters:**
  * `target` (entity, optional): Player entity to track.

### `PlayerProx:SetPlayerAliveMode(alivemode)`
* **Description:** Configures whether to consider alive, dead, or any players during proximity checks.
* **Parameters:**
  * `alivemode` (boolean or `nil`): `true` = alive only, `false` = dead only, `nil` = any state.

### `PlayerProx:SetLostTargetFn(func)`
* **Description:** Registers a callback invoked when a tracked player target is lost (e.g., removed or leaves far range).
* **Parameters:**
  * `func` (function): Callback with signature `()`, called when the target is lost.

### `PlayerProx:IsPlayerClose()`
* **Description:** Returns the current proximity state.
* **Returns:** `true` if at least one tracked player is within the `near` radius.

### `PlayerProx:GetDebugString()`
* **Description:** Returns a debug-friendly string representation of the proximity state.
* **Returns:** `"NEAR"` or `"FAR"`.

### `PlayerProx:OnEntityWake()`
* **Description:** Lifecycle callback (invoked when the entity wakes); restarts the task and forces an immediate update.

### `PlayerProx:OnEntitySleep()`
* **Description:** Lifecycle callback (invoked when the entity sleeps); forces an update before stopping the task.

## Events & Listeners
* **Listens to `"onremove"` on tracked target player entities** (via `self._ontargetleft`) to detect target removal in `SpecificPlayer`, `LockOnPlayer`, and `LockAndKeepPlayer` modes.
* **Triggers `onnear` and `onfar` callbacks** based on player proximity transitions (user-defined, not system events).
* **Does not push any events** via `inst:PushEvent`.