---
id: hideandseekhider
title: Hideandseekhider
description: Manages the hiding behavior and state for entities participating in the Hide and Seek minigame as a hider, including going to hiding spots and responding to discovery.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: d37cb78c
---

# Hideandseekhider

## Overview
This component implements the logic for a hider in the Hide and Seek minigame. It tracks the entity's current hiding spot, handles the transition into the hidden state (including optional delays), and manages events such as being discovered or aborting a hide action. It also handles save/load persistence for ongoing Hide and Seek sessions.

## Dependencies & Tags
- Requires `inst` (an entity with `GUID`, `DoTaskInTime`, `IsValid`, and state components like `runtohidingspot_task`)
- Adds the `hideandseekhidingspot` component to the target hiding spot when hiding begins (via `GoHide`)
- Does *not* automatically add or remove entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity (passed into constructor) |
| `last_day_played` | `number` | `-1` | Stores the world cycle (day index) when the hider last participated in Hide and Seek |
| `gohide_timeout` | `number` | `3` | Default delay (in seconds) before becoming hidden when calling `GoHide` |
| `hiding_spot` | `Entity?` | `nil` | The hiding spot entity currently being used (or `nil` if not hiding) |
| `runtohidingspot_task` | `Task?` | `nil` | Task reference for the delayed hide timer (`DoTaskInTime` result), or `nil` if none active |

Note: `OnHide`, `OnFound`, and `StartGoingToHidingSpot` are optional callback functions that must be set externally; they are not initialized by the component itself.

## Main Functions
### `IsPlaying()`
* **Description:** Returns `true` if the hider is currently in a hiding state (i.e., has a non-nil `hiding_spot`).
* **Parameters:** None.

### `IsHidden()`
* **Description:** Returns `true` if the hider is fully hidden (has a valid `hiding_spot` *and* the hiding transition task has completed — i.e., `runtohidingspot_task` is `nil`).
* **Parameters:** None.

### `GoHide(hiding_spot, timeout_time, isloading)`
* **Description:** Initiates the hiding process by selecting a hiding spot. If `timeout_time > 0`, schedules a delayed hide via `_OnGoHideTimout`; if `timeout_time == 0`, hides immediately. Returns `true` on success, `false` if already hiding or the spot is invalid.
* **Parameters:**
  * `hiding_spot` (`Entity`): The entity acting as the hiding spot.
  * `timeout_time` (`number?`): Delay (seconds) before hiding completes. Use `0` to hide instantly. Falls back to `gohide_timeout` if `nil`.
  * `isloading` (`boolean`): If `true`, skips validation of `hiding_spot.components.hideandseekhidingspot`, used during loading.

### `CanPlayHideAndSeek()`
* **Description:** Returns `true` if the hider is eligible to participate in Hide and Seek (i.e., they have not played in the *current* world cycle).
* **Parameters:** None.

### `Found(doer)`
* **Description:** Ends the hiding state, cancels any pending hide timer, and fires the optional `OnFound` callback. The hider is no longer considered playing.
* **Parameters:**
  * `doer` (`Entity?`): The entity that discovered the hider (may be `nil`).

### `Abort()`
* **Description:** Aborts the current hiding attempt. Cancels the timer if active, notifies the hiding spot to abort its state, then calls `Found(nil)`.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the hider’s current state for world save. Includes `last_day_played`, and if hiding, the GUID of the hiding spot and remaining timeout (if any).
* **Parameters:** None.
* **Returns:** `(data: table, refs: table?)` — `data` contains serializable state; `refs` contains entity GUIDs required for post-pass resolution.

### `LoadPostPass(newents, data)`
* **Description:** Restores hider state after loading. Resolves the hiding spot by GUID and restores or resumes the hide task using saved timeout data if present.
* **Parameters:**
  * `newents` (`table`): Map of GUID → `{entity = Entity}` from the loaded world.
  * `data` (`table?`): Saved data returned by `OnSave`.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string describing the current hiding state.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Hiding Spot: nil"` or `"Hiding Spot: Entity[gid=1234]"`.

## Events & Listeners
- Listens to internal timeout task completion (via `inst:DoTaskInTime(...)`) to trigger `_OnGoHideTimout`.
- Fires optional callbacks on behalf of the component:
  - `self.StartGoingToHidingSpot(self.inst, hiding_spot, real_timeout_time)` — when a hide sequence begins.
  - `self.OnHide(self.inst, self.hiding_spot)` — when the hide timeout completes successfully.
  - `self.OnFound(self.inst, doer)` — when discovered or aborted.
- Does *not* call `inst:PushEvent(...)` or `inst:ListenForEvent(...)`; all event coupling is via optional callbacks.