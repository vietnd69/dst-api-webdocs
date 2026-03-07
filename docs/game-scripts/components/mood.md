---
id: mood
title: Mood
description: Manages timed and seasonal mood states for entities, such as mating behavior in beefalo, by tracking mood duration, season-based activation, and world settings multipliers.
tags: [entity, ai, season, behavior, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8100a657
system_scope: entity
---

# Mood

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Mood` is a component that controls whether an entity is in a specific behavioral "mood" — for example, breeding readiness in beefalo — based on day counts, seasonal conditions, and configurable world settings. It integrates with the world state to listen for day completions and season changes, and supports persistence via `OnSave`/`OnLoad`. The component does not modify the entity directly but provides state and callback hooks for consuming systems (e.g., `beefalo` AI/behaviour logic) to respond to mood transitions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("mood")

-- Configure mood timing and season triggers
inst.components.mood:SetMoodTimeInDays(10, 5, false) -- 10 days in mood, 5 days wait
inst.components.mood:SetMoodSeason("spring")

-- Define callbacks for mood state changes
inst.components.mood:SetInMoodFn(function(ent) print(ent .. " entered mood") end)
inst.components.mood:SetLeaveMoodFn(function(ent) print(ent .. " left mood") end)

-- Manually trigger mood validation (e.g., at world load)
inst.components.mood:ValidateMood()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `true` | Whether the mood system is active. Disabling prevents state changes. |
| `moodtimeindays.length` | number | `nil` | Duration (in days) the entity stays in mood once activated. |
| `moodtimeindays.wait` | number | `nil` | Duration (in days) the entity waits before re-entering mood. |
| `forcemood` | boolean | `false` | If true, mood state toggles forcibly on timer expiry; otherwise, it toggles only if currently not in mood. |
| `isinmood` | boolean | `false` | Current mood state (`true` = in mood). |
| `daystomoodchange` | number | `nil` | Remaining days until the mood state should change. |
| `onentermood` | function | `nil` | Callback invoked when the entity enters mood. |
| `onleavemood` | function | `nil` | Callback invoked when the entity leaves mood. |
| `moodseasons` | table | `{}` | List of season names (strings) during which the entity can enter mood. |
| `firstseasonadded` | boolean | `false` | Internal flag indicating whether season listener is active. |
| `worldsettingsmultiplier_inmood` | number | `1` | Multiplier applied to day counts while in mood (for world settings). |
| `worldsettingsmultiplier_outmood` | number | `1` | Multiplier applied to day counts while not in mood (for world settings). |
| `worldsettingsenabled` | boolean | `true` | Whether world settings affect mood timing. |
| `seasonmood` | boolean | `false` | Internal flag indicating whether the current mood state is season-locked. |

## Main functions
### `GetDebugString()`
* **Description:** Returns a human-readable summary of the mood state for debugging purposes (e.g., in dev tools or logs).
* **Parameters:** None.
* **Returns:** `string` — Formatted debug string showing mood status, days until change, and season dependency.

### `Enable(enabled)`
* **Description:** Enables or disables the mood component. Disabling immediately resets mood state and prevents future state changes.
* **Parameters:** `enabled` (boolean) — `true` to enable, `false` to disable.
* **Returns:** Nothing.

### `SetMoodTimeInDays(length, wait, forcemood, worldsettingsmultiplier_inmood, worldsettingsmultiplier_outmood, worldsettingsenabled)`
* **Description:** Configures the core timing parameters for mood cycles. Resets internal counters and sets initial mood state to not-in-mood.
* **Parameters:**
  * `length` (number) — Days the entity remains in mood.
  * `wait` (number) — Days the entity waits before re-entering mood.
  * `forcemood` (boolean) — If `true`, toggles mood state unconditionally on timer expiry.
  * `worldsettingsmultiplier_inmood` (number, optional) — Multiplier for day countdown while in mood (e.g., from world settings). Defaults to `1`.
  * `worldsettingsmultiplier_outmood` (number, optional) — Multiplier for day countdown while out of mood. Defaults to `1`.
  * `worldsettingsenabled` (boolean, optional) — If `false`, disables world-settings timing modifications. Defaults to `true`.
* **Returns:** Nothing.

### `SetMoodSeason(activeseason)`
* **Description:** Adds a season to the list of seasons that can trigger mood. Automatically registers the season-change listener on first call.
* **Parameters:** `activeseason` (string) — Season name (e.g., `"spring"`, `"summer"`).
* **Returns:** Nothing.

### `ValidateMood()`
* **Description:** Recalculates current mood state based on the active season and configured `moodseasons`. Used to ensure correct initial mood at world load or season start.
* **Parameters:** None.
* **Returns:** Nothing.

### `CheckForMoodChange()`
* **Description:** Evaluates whether the mood state should toggle based on the `daystomoodchange` counter. Called automatically when days complete (if `worldsettingsenabled` is `true`).
* **Parameters:** None.
* **Returns:** Nothing.

### `SetInMoodFn(fn)`
* **Description:** Sets the callback function invoked when the entity enters mood.
* **Parameters:** `fn` (function) — Function that receives `inst` as its sole argument.
* **Returns:** Nothing.

### `SetLeaveMoodFn(fn)`
* **Description:** Sets the callback function invoked when the entity leaves mood.
* **Parameters:** `fn` (function) — Function that receives `inst` as its sole argument.
* **Returns:** Nothing.

### `ResetMood()`
* **Description:** Exits mood state if active *and* if it was triggered by season (i.e., `seasonmood` is `true`). Resets the countdown to the `wait` period.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetIsInMood(inmood, entireseason)`
* **Description:** Explicitly sets the mood state. Handles logic for seasonal vs. timed mood entry/exit, countdown updates, and callback invocation.
* **Parameters:**
  * `inmood` (boolean) — Target mood state.
  * `entireseason` (boolean) — If `true`, mood is locked for the *entire* current season; `daystomoodchange` is set to season length instead of `length`.
* **Returns:** Nothing.
* **Error states:** No-op if `inmood` is `true` but either `enabled` or `worldsettingsenabled` is `false`.

### `IsInMood()`
* **Description:** Returns the current mood state.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if currently in mood.

### `OnSave()`
* **Description:** Serializes mood state for world persistence. Includes mood status, adjusted day count (scaled by world settings), season list, and version.
* **Parameters:** None.
* **Returns:** `table` — Save data:
  * `inmood` (boolean)
  * `daysleft` (number)
  * `moodseasons` (table)
  * `version` (number) — Always `2`.

### `OnLoad(data)`
* **Description:** Restores mood state from persisted data. Handles version compatibility (`version == 2` vs. legacy).
* **Parameters:** `data` (table) — Saved state from `OnSave()`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `cycles` — Triggers `OnDayComplete` at the end of each day.  
  - `season` — Triggers `OnSeasonChange` when the active season changes (added after `SetMoodSeason` is called once).  
- **Pushes:** None identified.
