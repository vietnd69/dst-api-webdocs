---
id: playerprox
title: Playerprox
description: Monitors proximity of players to an entity and triggers callbacks when players enter or leave defined zones.
tags: [player, proximity, detection, ai]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 67ad0833
system_scope: entity
---

# Playerprox

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Playerprox` is a component that detects when one or more players are within specified distances of its owner entity. It supports four operation modes:
- `AllPlayers`: Tracks all players near/far individually.
- `AnyPlayer`: Reports proximity if *any* player is near, and only离开 when *none* remain far.
- `SpecificPlayer`: Monitors a single designated player's proximity.
- `LockOnPlayer`: Locks onto the first player who enters range and continues tracking them until they leave.
- `LockAndKeepPlayer`: Locks onto the first player and permanently switches to `SpecificPlayer` mode for them.

It is typically used for AI behaviors that depend on player presence (e.g., spawning enemies, triggering events, or changing state based on visibility or distance). The component runs as a periodic task that evaluates proximity and invokes user-defined callbacks (`onnear`, `onfar`) when state changes occur.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playerprox")

-- Set up detection zone: near = 2 units, far = 3 units
inst.components.playerprox:SetDist(2, 3)

-- Define callbacks for when a player enters or exits range
inst.components.playerprox:SetOnPlayerNear(function(ent, player) 
    print("Player entered range:", player.prefab)
end)

inst.components.playerprox:SetOnPlayerFar(function(ent, player)
    print("Player exited range:", player.prefab)
end)

-- Start monitoring (defaults to AnyPlayer mode)
inst.components.playerprox:Schedule()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `playerprox` (implicitly via usage context), but does not modify tags on its owner.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `near` | number | `2` | Inner radius (in units) where player proximity triggers the "near" state. |
| `far` | number | `3` | Outer radius (in units) where a player must be *outside* to trigger the "far" state. |
| `isclose` | boolean | `false` | Current proximity state: `true` if at least one relevant player is within `near` (or `far`, depending on mode). |
| `period` | number | `10 * FRAMES` | Interval (in seconds × frames) between proximity checks. |
| `onnear` | function? | `nil` | Callback invoked when a player enters the near zone. Signature: `fn(inst, player)` or `fn(inst)` (in `AnyPlayer` mode). |
| `onfar` | function? | `nil` | Callback invoked when a player leaves the far zone. Signature: `fn(inst, player)` or `fn(inst)` (in `AnyPlayer` mode). |
| `target` | entity? | `nil` | The specific player being tracked (for `SpecificPlayer`, `LockOnPlayer`, and `LockAndKeepPlayer` modes). |
| `alivemode` | `AliveOnly` \| `DeadOnly` \| `DeadOrAlive` \| `nil` | `nil` | Filter for player state: `true` = alive only, `false` = dead only, `nil` = both (see `SetPlayerAliveMode`). |

## Main functions
### `SetOnPlayerNear(fn)`
* **Description:** Sets the callback function to invoke when a player enters the near zone.
* **Parameters:** `fn` (function) - a function that accepts either `(inst, player)` or `(inst)` depending on the current mode.
* **Returns:** Nothing.

### `SetOnPlayerFar(fn)`
* **Description:** Sets the callback function to invoke when a player exits the far zone.
* **Parameters:** `fn` (function) - same signature rules as `SetOnPlayerNear`.
* **Returns:** Nothing.

### `SetDist(near, far)`
* **Description:** Updates the inner (`near`) and outer (`far`) proximity radii.
* **Parameters:**
  - `near` (number) — inner distance threshold.
  - `far` (number) — outer distance threshold; must be ≥ `near` for meaningful behavior.
* **Returns:** Nothing.

### `SetPlayerAliveMode(alivemode)`
* **Description:** Configures which player states are considered (alive, dead, or both).
* **Parameters:** `alivemode` (boolean or `nil`) — see `PlayerProx.AliveModes`:
  - `true` (`AliveOnly`) — only alive players are tracked.
  - `false` (`DeadOnly`) — only dead/ghost players are tracked.
  - `nil` (`DeadOrAlive`) — both states are tracked.
* **Returns:** Nothing.

### `SetLostTargetFn(func)`
* **Description:** Sets a callback invoked when the tracked player is removed or otherwise lost (specifically in `LockOnPlayer` and `LockAndKeepPlayer` modes).
* **Parameters:** `func` (function) — a function with no arguments.
* **Returns:** Nothing.

### `SetTargetMode(mode, target, override)`
* **Description:** Switches the detection behavior to one of the supported modes.
* **Parameters:**
  - `mode` (function) — one of `PlayerProx.TargetModes` (`AllPlayers`, `AnyPlayer`, `SpecificPlayer`, `LockOnPlayer`, `LockAndKeepPlayer`).
  - `target` (entity) — only used in `SpecificPlayer` mode; the player entity to monitor.
  - `override` (boolean, optional) — if `true`, suppresses saving `mode` as the original target mode (used internally).
* **Returns:** Nothing.
* **Error states:** Asserts that `mode == SpecificPlayer` requires a non-`nil` `target`.

### `Schedule(new_period)`
* **Description:** Starts or reschedules the periodic proximity-checking task.
* **Parameters:** `new_period` (number?, optional) — if provided, overrides the default `period` (in seconds × frames).
* **Returns:** Nothing.

### `ForceUpdate()`
* **Description:** Immediately triggers the current detection function (e.g., `AllPlayers`, `SpecificPlayer`) once, bypassing the periodic schedule.
* **Parameters:** None.
* **Returns:** Nothing.

### `Stop()`
* **Description:** Cancels the periodic task and halts proximity updates. Often used when the entity is removed or goes to sleep.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsPlayerClose()`
* **Description:** Returns the current proximity state.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if players are within the near/far thresholds (mode-dependent).
* **Error states:** Returns `false` if no players meet the criteria.

### `OnEntityWake()`
* **Description:** Resets and restarts proximity monitoring when the entity wakes (e.g., respawns, is loaded, or becomes active).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntitySleep()`
* **Description:** Updates state and stops monitoring when the entity sleeps (e.g., unloads, is paused, or deactivates).
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"onremove"` on the `target` player entity (in `SpecificPlayer`-based modes) — triggers the internal `losttargetfn` callback.
- **Pushes:** None. Events are *not* pushed by this component. Callbacks (`onnear`, `onfar`, `losttargetfn`) are invoked directly.
