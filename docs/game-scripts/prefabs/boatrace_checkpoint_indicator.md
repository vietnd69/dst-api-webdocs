---
id: boatrace_checkpoint_indicator
title: Boatrace Checkpoint Indicator
description: Acts as a visual marker that rotates to point toward the nearest race checkpoint during a boat race, and triggers music playback for nearby players.
tags: [boat, race, fx, audio, ui]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3959acff
system_scope: fx
---

# Boatrace Checkpoint Indicator

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`boatrace_checkpoint_indicator` is a lightweight FX prefab that visually indicates the direction to the next checkpoint during a boat race. It operates as a rotating indicator that points toward the closest unvisited checkpoint. It also participates in music state management: it triggers the `playboatracemusic` event for nearby players and uses the `timer` component to schedule periodic position updates and timed animations. The indicator is created only for the master simulation world and responds to events from the `boatrace_proximitybeacon` component (e.g., when a race starts or ends).

## Usage example
This prefab is not typically instantiated manually. It is created and managed automatically by the boat race system, and events such as `boatrace_setindex` are pushed by the race controller to configure the indicator's appearance.

```lua
-- Example of manually configuring the indicator (not typical usage)
local indicator = SpawnPrefab("boatrace_checkpoint_indicator")
indicator.AnimState:PlayAnimation("appear")
indicator.AnimState:PushAnimation("idle_marker", true)
indicator:PushEvent("boatrace_setindex", { index = 1 })
```

## Dependencies & tags
**Components used:** `timer`, `boatrace_proximitybeacon`  
**Tags:** `FX`, `NOCLICK`, `boatrace_proximitybeacon`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_current_checkpoint` | `Entity` or `nil` | `nil` | Stores the checkpoint entity the indicator is currently pointing toward. |
| `_start` | `Entity` or `nil` | `nil` | Reference to the boat race start point (used to retrieve checkpoints). |
| `_boatrace_active` | `net_bool` | `false` | Networked boolean indicating whether a boat race is active (used for music sync). |
| `_index` | `number` or `nil` | `nil` | Index used to select the correct tail symbol variant. |

## Main functions
### `DoUpdate(inst, racestart)`
* **Description:** Computes the closest unvisited checkpoint relative to the indicator’s world position, updates `_current_checkpoint`, and rotates the indicator to point toward it. This is called periodically during an active race.
* **Parameters:**
  * `inst` (Entity) – The indicator entity instance.
  * `racestart` (Entity or `nil`) – The race start entity; must implement `:GetCheckpoints()` and `:GetBeacons()`.
* **Returns:** Nothing.
* **Error states:** Early return if `racestart` is `nil` or `finished`, or if no checkpoints exist.

### `OnRaceStart(inst, start)`
* **Description:** Triggered when a boat race begins. Sets up tracking of the race start point, plays appearance/disappear animations, starts the periodic `doupdate` timer, and sets `_boatrace_active` to true to enable music playback.
* **Parameters:**
  * `inst` (Entity) – The indicator instance.
  * `start` (Entity) – The race start point entity.
* **Returns:** Nothing.

### `OnRaceEnd(inst)`
* **Description:** Triggered when the race finishes. Stops the `doupdate` timer, schedules removal of the indicator via animation end, sets `_boatrace_active` to false (disabling music), and removes the listener on the race start.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnCheckpointFound(inst)`
* **Description:** Called when the player passes a checkpoint. Pauses the `doupdate` timer, hides the indicator briefly, plays the `idle_closed` animation, and schedules an unpause and re-appearance after a fixed delay (`2.8` seconds).
* **Parameters:** None.
* **Returns:** Nothing.

### `SetBoatRaceIndex(inst, index)`
* **Description:** Sets the visual variant of the indicator’s tail using the provided index, and initiates the `idle_race_appear` animation.
* **Parameters:**
  * `inst` (Entity) – The indicator instance.
  * `index` (number) – Index of the tail symbol variant (e.g., `1`, `2`, etc.).
* **Returns:** Nothing.

### `GetCheckpoints(inst)`
* **Description:** Convenience accessor that delegates to `inst._start:GetCheckpoints()`, or returns `nil` if the start point is missing or lacks that method.
* **Parameters:** None.
* **Returns:** Table of checkpoints (or `nil`).

## Events & listeners
- **Listens to:**
  * `checkpoint_found` – Triggers `OnCheckpointFound`.
  * `timerdone` – Triggers `OnTimerDone` to handle timer events (`doupdate`, `unpauseupdate`).
  * `boatrace_setindex` – Triggers `SetBoatRaceIndex`.
  * `boatrace_idle_disappear` – Triggers `OnBoatRaceIdleDisappear`.
  * `musicdirty` (client-only) – Triggers `OnMusicDirty` to manage the music task.
  * `onremove` (on `_start` entity) – Resets `_start` when the race start entity is removed.
- **Pushes:** None (does not emit events directly).