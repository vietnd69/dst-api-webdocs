---
id: minigame
title: Minigame
description: Manages the lifecycle and participant/spectator logic for minigame events in the world.
tags: [minigame, event, entity, spectator, participant]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f966c7f4
system_scope: entity
---

# Minigame

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Minigame` is an entity component that governs the activation, deactivation, and dynamic participant/spectator assignment for in-world minigame events. It tracks the minigame's state (`intro`, `playing`, `outro`), manages timed pulses during activity, and dynamically assigns nearby entities as participants or spectators based on configurable distance thresholds and tag filters. It integrates with the `minigame_participator` and `minigame_spectator` components to enforce behavioral rules (e.g., stopping followers or combat targets upon entering the minigame).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("minigame")
inst.components.minigame:SetOnActivatedFn(function(e) print("Minigame started!") end)
inst.components.minigame:SetOnDeactivatedFn(function(e) print("Minigame ended!") end)
inst.components.minigame:Activate()
inst.components.minigame:AddParticipator(player_inst)
inst.components.minigame:AddSpectator(watcher_inst)
```

## Dependencies & tags
**Components used:** `minigame_spectator`, `minigame_participator`, `follower`, `combat`, `leader`  
**Tags:** Checks `player`, `monster`, `character` tags for entity categorization; no tags are added or removed by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `active` | boolean | `false` | Whether the minigame is currently active. |
| `activate_fn` | function or `nil` | `nil` | Callback fired on activation. |
| `deactivate_fn` | function or `nil` | `nil` | Callback fired on deactivation. |
| `spectator_dist` | number | `20` | Radius in world units around the minigame entity to scan for spectators. |
| `participator_dist` | number | `20` | Radius in world units around the minigame entity to scan for participants. |
| `watchdist_min`, `watchdist_target`, `watchdist_max` | number | From `TUNING.*` | Camera/tuning-related distance thresholds for spectator positioning. |
| `gametype` | string | `"unknown"` | Identifier for the type of minigame. |
| `state` | string | `"intro"` | Current phase of the minigame (`intro`, `playing`, `outro`). |
| `excitement_time` | number | `0` | Timestamp of the last excitement event (used for time-based logic). |
| `excitement_delay` | number | `5` | Duration (in seconds) after `RecordExcitement()` during which `IsExciting()` returns `true`. |
| `active_pulse` | task or `nil` | `nil` | Reference to the periodic task that re-runs `DoActivePulse` while active. |

## Main functions
### `SetOnActivatedFn(fn)`
* **Description:** Sets a callback function to be executed when the minigame is activated.  
* **Parameters:** `fn` (function) — a function accepting a single argument (the minigame entity).  
* **Returns:** Nothing.

### `SetOnDeactivatedFn(fn)`
* **Description:** Sets a callback function to be executed when the minigame is deactivated.  
* **Parameters:** `fn` (function) — a function accepting a single argument (the minigame entity).  
* **Returns:** Nothing.

### `IsActive()`
* **Description:** Returns whether the minigame is currently active.  
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if active, otherwise `false`.

### `Activate()`
* **Description:** Activates the minigame: cancels any prior activity, starts a periodic pulse task, fires the activation callback, and pushes the `ms_minigamedeactivated` event.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `Deactivate()`
* **Description:** Deactivates the minigame: cancels the active pulse task, sets `active` to `false`, fires the deactivation callback, and pushes `ms_minigamedeactivated`. No-op if already inactive.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `AddSpectator(spectator)`
* **Description:** Ensures the given entity has the `minigame_spectator` component and registers it to watch this minigame. Automatically stops combat and drops targets if applicable.  
* **Parameters:** `spectator` (entity instance) — the entity to register as a spectator.  
* **Returns:** Nothing.  
* **Error states:** Adds the `minigame_spectator` component if missing.

### `AddParticipator(participator, notimeout)`
* **Description:** Ensures the given entity has the `minigame_participator` component, configures the timeout behavior, and registers it to participate in this minigame. Also stops followers of the participator (unless `keepleaderduringminigame` is set).  
* **Parameters:**  
  - `participator` (entity instance) — the entity to register as a participator.  
  - `notimeout` (boolean) — if `true`, disables automatic expiry timeout for the participator.  
* **Returns:** Nothing.  
* **Error states:** Adds the `minigame_participator` component if missing.

### `DoActivePulse()`
* **Description:** Scans the world around the minigame entity to dynamically assign nearby entities as spectators and participators, based on configured distances and tag rules. Intended to be called periodically during activity.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:**  
  - Spectators are only assigned if they have no active leader (`leader` component absent or `GetLeader()` returns `nil`) and pass tag checks (`character` and not `monster`/`player`).  
  - Participators must have the `player` tag.  

### `SetIsIntro()`, `GetIsIntro()`, `SetIsPlaying()`, `GetIsPlaying()`, `SetIsOutro()`, `GetIsOutro()`
* **Description:** Set or query the current state (`"intro"`, `"playing"`, `"outro"`).  
* **Parameters:** None (for getters).  
* **Returns:** `SetIs*()` methods return nothing; `GetIs*()` methods return `true`/`false`.  
* **Error states:** None.

### `RecordExcitement()`
* **Description:** Records the current time as the last excitement event. Used to drive time-based excitement windows.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `TimeSinceLastExcitement()`
* **Description:** Returns the time elapsed since the last excitement event (in seconds).  
* **Parameters:** None.  
* **Returns:** `number` — seconds elapsed since last excitement.

### `IsExciting()`
* **Description:** Returns whether the minigame is currently in an "exciting" window — within `excitement_delay` seconds after `RecordExcitement()`.  
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if recent excitement, otherwise `false`.

### `GetDebugString()`
* **Description:** Returns a short, human-readable debug string summarizing key state.  
* **Parameters:** None.  
* **Returns:** `string` — formatted as `"Is Active: <bool> Is Exciting: <bool>"`.

## Events & listeners
- **Listens to:**  
  - `onremove` (on the minigame entity) — triggers `Deactivate()` via `OnRemoveFromEntity()`.  
- **Pushes:**  
  - `ms_minigamedeactivated` — fired when `Deactivate()` is called (used by participants/spectators to clean up state).

```lua
-- Example event listener usage (outside this component's code)
inst:ListenForEvent("ms_minigamedeactivated", function(inst) print("Minigame ended") end)
