---
id: age
title: Age
description: Tracks and manages a player entity's elapsed time since spawn, including pause/resume functionality and age-based notifications.
tags: [player, time, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d83599b0
system_scope: player
---

# Age

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `age` component tracks how much time has passed since a player entity was spawned, accounting for paused periods. It calculates age in seconds and days, periodically synchronizes age data over the network, and triggers in-game notifications and achievements at specific age milestones (20, 35, 55, and 70 days). It is attached exclusively to player entities and integrates with `inst.Network` for replication and `GetTime()` for time tracking.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("age")
inst.components.age:ResumeAging() -- ensure aging is active
local days = inst.components.age:GetDisplayAgeInDays()
print("Player age:", days, "days")
```

## Dependencies & tags
**Components used:** `network` (via `inst.Network`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `saved_age` | number | `0` | Accumulated elapsed time (in seconds) before last pause or at time of save. |
| `paused_time` | number | `0` | Total accumulated time (in seconds) during which aging was paused. |
| `spawntime` | number | `GetTime()` | Timestamp when the component (and entity) was created. |
| `last_pause_time` | number \| nil | `nil` | If non-`nil`, represents the start timestamp of the current pause interval. |
| `_synctask` | Task \| nil | `nil` | Ongoing periodic task used to sync age data every `SYNC_PERIOD` seconds. |

## Main functions
### `GetAge()`
* **Description:** Returns the entity's total unpause-corrected age in seconds.
* **Parameters:** None.
* **Returns:** `number` — elapsed time in seconds.

### `GetAgeInDays()`
* **Description:** Returns the entity's age in completed days (0-indexed, floored).
* **Parameters:** None.
* **Returns:** `number` — number of fully elapsed days.

### `GetDisplayAgeInDays()`
* **Description:** Returns the entity's age in days, adjusted to be human-readable (1-indexed).
* **Parameters:** None.
* **Returns:** `number` — age in days, rounded up (e.g., the first day returns `1`, not `0`).

### `PauseAging()`
* **Description:** Pauses time accumulation. Stops the periodic sync task.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Has no effect if aging is already paused (`last_pause_time ~= nil`).

### `ResumeAging()`
* **Description:** Resumes time accumulation if currently paused. Restarts the periodic sync task.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Has no effect if aging is not paused (`last_pause_time == nil`).

### `OnSave()`
* **Description:** Returns a serializable table containing state needed to restore the component later.
* **Parameters:** None.
* **Returns:** `{ age = number, ispaused = boolean }` — the current age and pause state.

### `OnLoad(data)`
* **Description:** Restores component state from `OnSave()` data.
* **Parameters:** `data` (table?) — must contain optional `age` and `ispaused` keys.
* **Returns:** Nothing.

### `LongUpdate(dt)`
* **Description:** Called frequently (e.g., every frame) to update `saved_age` and adjust `paused_time` if aging is paused. Restarts sync task if not paused.
* **Parameters:** `dt` (number) — delta time in seconds since last frame.
* **Returns:** Nothing.

### `CancelPeriodicSync()`
* **Description:** Cancels the recurring periodic sync task and forces an immediate sync.
* **Parameters:** None.
* **Returns:** Nothing.

### `RestartPeriodicSync()`
* **Description:** Cancels any existing sync task and starts a new periodic sync every `SYNC_PERIOD` seconds.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for the current age.
* **Parameters:** None.
* **Returns:** `string` — formatted age, either `X.XX s` (if < half a day) or `X.XX days`.

## Events & listeners
- **Listens to:** `setowner` — triggers immediate age sync via `OnSetOwner`.
- **Pushes:** None identified.
