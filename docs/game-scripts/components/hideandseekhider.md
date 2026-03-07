---
id: hideandseekhider
title: Hideandseekhider
description: Manages hide-and-seek gameplay logic for an entity acting as a hider, including hiding spot assignment, timing, and state transitions.
tags: [gameplay, hideandseek, state]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d37cb78c
system_scope: world
---

# Hideandseekhider

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`hideandseekhider` tracks and controls an entity's participation in hide-and-seek gameplay as a *hider*. It manages interactions with `hideandseekhidingspot` components, coordinates movement and hide timers, and handles save/load state for multiplayer persistence. It is typically attached to player characters during hide-and-seek events.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("hideandseekhider")

-- Attempt to hide in a spot with default timeout
local spot = SpawnPrefab("kitchen_cabinet")
local success = inst.components.hideandseekhider:GoHide(spot, 0)

-- Check if currently playing (i.e., assigned a hiding spot)
if inst.components.hideandseekhider:IsPlaying() then
    print("Player is currently hiding!")
end
```

## Dependencies & tags
**Components used:** `hideandseekhidingspot` (via `hiding_spot.components.hideandseekhidingspot`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `last_day_played` | number | `-1` | The world cycle count when the hider last played hide-and-seek. |
| `gohide_timeout` | number | `3` | Default delay (in seconds) before physically hiding after initiating `GoHide`. |
| `hiding_spot` | Entity or `nil` | `nil` | Reference to the entity currently acting as the hiding spot. |
| `runtohidingspot_task` | Task or `nil` | `nil` | Pending timer task used to delay hiding; cancels if aborted. |

## Main functions
### `IsPlaying()`
*   **Description:** Returns whether the entity is currently assigned a hiding spot (i.e., in the process of or successfully hiding).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `hiding_spot` is non-`nil`, otherwise `false`.

### `IsHidden()`
*   **Description:** Returns whether the entity is *fully* hidden (i.e., assigned a spot and no pending movement timer).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `hiding_spot` is non-`nil` and `runtohidingspot_task` is `nil`.

### `GoHide(hiding_spot, timeout_time, isloading)`
*   **Description:** Initiates hiding in the provided spot. Assigns the spot, starts a delay task (unless `timeout_time == 0`), and updates internal state. Handles loading from save data via `isloading`.
*   **Parameters:**
    *   `hiding_spot` (Entity) — The entity that will serve as the hiding location (must support the `hideandseekhidingspot` component).
    *   `timeout_time` (number or `nil`) — Delay in seconds before fully hiding; defaults to `gohide_timeout`. Pass `0` to hide instantly.
    *   `isloading` (boolean) — If `true`, bypasses component validation to allow reloading from saved state.
*   **Returns:** `boolean` — `true` if the hide operation was initiated, `false` if already playing or spot invalid.
*   **Error states:** Returns `false` if `hiding_spot` already has an active hider (unless `isloading` is `true`) or if the component is already active.

### `CanPlayHideAndSeek()`
*   **Description:** Checks if the entity is allowed to play hide-and-seek in the current world cycle (i.e., they did not already play today).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `last_day_played < TheWorld.state.cycles`.

### `Found(doer)`
*   **Description:** Ends hiding early (e.g., when discovered). Cleans up the hiding spot reference, cancels pending timers, and fires `OnFound` callback.
*   **Parameters:** `doer` (Entity or `nil`) — The entity that discovered the hider (can be `nil`).
*   **Returns:** Nothing.
*   **Error states:** No-op if `hiding_spot` is `nil`.

### `Abort()`
*   **Description:** Aborts the current hide attempt. Delegates to `hideandseekhidingspot:Abort()` if valid, then calls `Found(nil)`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Prepares state data for serialization (used for save/load in multiplayer).
*   **Parameters:** None.
*   **Returns:** `data` (table), `refs` (table or `nil`) — Save data containing `last_day_played`, optional `hiding_spot` GUID, and optional `hiding_timeout`. References table contains the hiding spot’s GUID for dependency resolution.

### `LoadPostPass(newents, data)`
*   **Description:** Restores state after world load. Recreates pending timers or spot assignments based on saved data.
*   **Parameters:**
    *   `newents` (table) — Map of GUID → `{entity, ...}` for resolved saved references.
    *   `data` (table or `nil`) — Saved state from `OnSave()`.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a debug-friendly string for logging or overlays.
*   **Parameters:** None.
*   **Returns:** `string` — `"Hiding Spot: <guid>"` or `"Hiding Spot: nil"`.

## Events & listeners
- **Listens to:** `picked`, `worked`, `onignite`, `onopen`, `onactivated`, `onpickup`, `haunted` (on `hiding_prop`) — triggers `evict_fn` callback via `hideandseekhidingspot` to remove hider upon spot interaction.
- **Pushes:** None directly (callbacks like `OnHide` and `OnFound` are user-defined function references, not events).

## Additional Notes
- Callback properties (`OnHide`, `StartGoingToHidingSpot`, `OnFound`) are optional function references that callers can assign to hook into lifecycle events (e.g., UI feedback or sound triggers). They are not managed by this component itself.
- The component assumes `TheWorld.state.cycles` is defined and tracks daily progression.
