---
id: minigame
title: Minigame
description: Manages the lifecycle and participant/spectator logic for in-game minigames by tracking active state, entity proximity, and excitement timing.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: f966c7f4
---

# Minigame

## Overview
This component manages the core behavior of a minigame entity within the Entity Component System. It handles activation/deactivation cycles, dynamically assigns spectators and participants based on proximity, tracks the current state (`intro`, `playing`, `outro`), and maintains an "excitement" timer used for UI or gameplay feedback. It operates at the world level by scanning for nearby entities and managing their roles in the minigame.

## Dependencies & Tags
- Adds `minigame_spectator` component to entities entering the spectator radius.
- Adds `minigame_participator` component to entities entering the participator radius.
- Relies on presence of:
  - `Transform` component on its host entity (for position).
  - `follower` component (optional, to filter out followers during spectator detection).
- Tags used for entity filtering:
  - Spectators: *Cannot* have tags `"monster"` or `"player"`; *must* have tag `"character"` (one-of).
  - Participators: *Must* have tag `"player"`.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the host entity. |
| `active` | `boolean` | `false` | Whether the minigame is currently active. |
| `activate_fn` | `function?` | `nil` | Optional callback invoked when the minigame activates. |
| `deactivate_fn` | `function?` | `nil` | Optional callback invoked when the minigame deactivates. |
| `spectator_dist` | `number` | `20` | Radius (units) within which eligible entities become spectators. |
| `participator_dist` | `number` | `20` | Radius (units) within which eligible players become participants. |
| `watchdist_min` | `number` | `TUNING.MINIGAME_CROWD_DIST_MIN` | Minimum viewing distance threshold (used elsewhere, not directly in this component). |
| `watchdist_target` | `number` | `TUNING.MINIGAME_CROWD_DIST_TARGET` | Target viewing distance threshold. |
| `watchdist_max` | `number` | `TUNING.MINIGAME_CROWD_DIST_MAX` | Maximum viewing distance threshold. |
| `gametype` | `string` | `"unknown"` | Identifier for the minigame type (set externally). |
| `excitement_time` | `number` | `0` | Timestamp of the last excitement event. |
| `excitement_delay` | `number` | `5` | Time window (seconds) after `excitement_time` during which `IsExciting()` returns `true`. |
| `state` | `string` | `"intro"` | Current state: `"intro"`, `"playing"`, or `"outro"`. |
| `active_pulse` | `PeriodicTask?` | `nil` | Active repeating task triggered during gameplay. |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Ensures the minigame is deactivated when the host entity is removed from the world.
* **Parameters:** None.

### `SetOnActivatedFn(fn)`
* **Description:** Registers a callback function to be executed upon activation.
* **Parameters:**
  - `fn` (`function`): A function accepting a single `Entity` argument.

### `SetOnDeactivatedFn(fn)`
* **Description:** Registers a callback function to be executed upon deactivation.
* **Parameters:**
  - `fn` (`function`): A function accepting a single `Entity` argument.

### `IsActive()`
* **Description:** Returns whether the minigame is currently active.
* **Parameters:** None.

### `Activate()`
* **Description:** Activates the minigame, cancels any prior activation, triggers the activation callback, and starts a repeating `DoActivePulse` task every 0.75 seconds.
* **Parameters:** None.

### `Deactivate()`
* **Description:** Deactivates the minigame, cancels the periodic pulse task (if any), and pushes the `"ms_minigamedeactivated"` event. Invokes the deactivation callback if registered.
* **Parameters:** None.

### `AddSpectator(spectator)`
* **Description:** Ensures the given entity has the `minigame_spectator` component and assigns this minigame as its watched minigame.
* **Parameters:**
  - `spectator` (`Entity`): The entity to register as a spectator.

### `AddParticipator(participator, notimeout)`
* **Description:** Ensures the given entity has the `minigame_participator` component, sets this minigame as its active minigame, and optionally sets the `notimeout` flag.
* **Parameters:**
  - `participator` (`Entity`): The entity to register as a participant.
  - `notimeout` (`boolean`, optional): If `true`, disables timeout for this participant.

### `DoActivePulse()`
* **Description:** Scans for eligible spectators and participants within configured radii using `TheSim:FindEntities`, then adds them to the minigame. Runs automatically at intervals while active.
* **Parameters:** None.

### `SetIsIntro()`, `GetIsIntro()`
* **Description:** Sets/gets the state to `"intro"`.
* **Parameters:** None.

### `SetIsPlaying()`, `GetIsPlaying()`
* **Description:** Sets/gets the state to `"playing"`.
* **Parameters:** None.

### `SetIsOutro()`, `GetIsOutro()`
* **Description:** Sets/gets the state to `"outro"`.
* **Parameters:** None.

### `RecordExcitement()`
* **Description:** Updates `excitement_time` to the current game time.
* **Parameters:** None.

### `TimeSinceLastExcitement()`
* **Description:** Returns the time elapsed (in seconds) since `RecordExcitement` was last called.
* **Parameters:** None.

### `IsExciting()`
* **Description:** Returns `true` if `TimeSinceLastExcitement()` is within `excitement_delay` seconds.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a formatted string with current active/excitement status for debugging.
* **Parameters:** None.

## Events & Listeners
- **Listens for:** None.
- **Pushes:**
  - `"ms_minigamedeactivated"`: Sent during `Deactivate()` when the minigame was previously active.