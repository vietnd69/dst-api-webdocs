---
id: hideandseekgame
title: Hideandseekgame
description: Manages the Hide and Seek game state, including tracking hiding spots, seekers, and game lifecycle events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 6be61142
---

# Hideandseekgame

## Overview
This component orchestrates the Hide and Seek minigame by tracking active hiding spots and seekers, detecting when players interact with hiding spots, and managing the game's start, progress, and end phases. It operates at the world level, typically attached to a central game coordinator entity (e.g., a game board or beacon), and handles game persistence, periodic seeker detection, and event-driven state transitions.

## Dependencies & Tags
- **Component Dependency**: Relies on entities having the `hideandseeker` component for seekers and `hideandseekhidingspot` for hiding spots (applied dynamically when needed).
- **Tag Behavior**: Does not add or remove tags itself; relies on external components (`hideandseeker`, `hideandseekhidingspot`) to manage entity state.
- **Event Dependencies**: Listens for `onremove` and `onhidingspotremoved` events on hiding spots and seekers.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `seekers` | `table` | `{}` | Map of active seeker entities (`entity → true`). |
| `hiding_spots` | `table` | `{}` | Map of active hiding spot entities (`entity → true`). |
| `hiding_range` | `number` | `10` | Squared radius (not actual distance) within which players may be detected as seekers during the pulse cycle. |
| `hiding_range_toofar` | `number` | `10` | Unused in current code (commented out in analysis). |
| `num_hiders_found` | `number` | `0` | Counter for how many hiding spots have been found by players (used for reward calculation, not game progress). |
| `pulse_task` | `Task` | `nil` | Periodic task (1 second interval) that scans for new seekers near the game coordinator. |
| `onremove_hiding_spot` | `function` | `nil` | Internal callback for when a hiding spot is removed from the world. |
| `onremove_seeker` | `function` | `nil` | Internal callback for when a seeker entity is removed. |
| `dounregisterhidingspot` | `function` | `nil` | Internal callback for `onhidingspotremoved` events, increments `num_hiders_found` if found by a player. |
| `OnAddSeeker` | `function?` | `nil` | Optional external hook called when a new seeker is added. |
| `OnHidingSpotFound` | `function?` | `nil` | Optional external hook called when a hiding spot is found by a player. |
| `OnHideAndSeekOver` | `function?` | `nil` | Optional external hook called when the game ends (no hiding spots remain). |
| `OnHideAndSeekPulse` | `function?` | `nil` | Optional external hook called each pulse cycle. |

## Main Functions

### `OnRemoveEntity()`
* **Description:** Cleans up when the game coordinator entity is removed from the world. Aborts all active hiding spots to prevent orphaned logic.
* **Parameters:** None.

### `IsActive()`
* **Description:** Returns whether the game is currently active (i.e., at least one hiding spot is registered).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if hiding spots exist, `false` otherwise.

### `Abort()`
* **Description:** Immediately ends the game by unregistering all hiding spots and aborting their internal state.
* **Parameters:** None.

### `_HideAndSeekOver()`
* **Description:** Internal method triggered when the last hiding spot is removed. Cancels the pulse task, clears seekers, resets counters, and fires the `OnHideAndSeekOver` hook.
* **Parameters:** None.

### `AddSeeker(seeker, started_game)`
* **Description:** Registers a new seeker entity to the game, adding the `hideandseeker` component if missing. Listens for its removal and fires the `OnAddSeeker` hook.
* **Parameters:**  
  - `seeker`: `Entity` — The player or entity becoming a seeker.  
  - `started_game`: `boolean` — Whether this seeker initiated the game (unused in current logic but passed to the hook).

### `RegisterHidingSpot(hiding_spot)`
* **Description:** Adds a hiding spot to the game. Sets up event listeners, resets `num_hiders_found`, and starts the pulse task if not already running.
* **Parameters:**  
  - `hiding_spot`: `Entity` — The entity acting as a hiding spot.

### `UnregisterHidingSpot(hiding_spot)`
* **Description:** Removes a hiding spot from the game. Cleans up listeners and triggers game end if no spots remain.
* **Parameters:**  
  - `hiding_spot`: `Entity` — The entity to remove as a hiding spot.

### `GetNumHiding()`
* **Description:** Returns the count of currently registered hiding spots.
* **Parameters:** None.
* **Returns:** `number`.

### `GetNumSeekers()`
* **Description:** Returns the count of registered seekers.
* **Parameters:** None.
* **Returns:** `number`.

### `GetNumFound()`
* **Description:** Returns the total count of hiding spots found (by players) during this game instance.
* **Parameters:** None.
* **Returns:** `number`.

### `OnSave()`
* **Description:** Prepares serializable data for saving. Returns references to hiding spot GUIDs and current `num_hiders_found`.
* **Parameters:** None.
* **Returns:**  
  - `table`: `{ hiding_spots = { GUIDs... }, num_hiders_found = number }`  
  - `table`: List of GUIDs for additional save handling.

### `LoadPostPass(newents, data)`
* **Description:** Restores hiding spots after game data is loaded. Re-registers entities using saved GUIDs and restores `num_hiders_found`.
* **Parameters:**  
  - `newents`: `table` — Map of GUID → entity from saved data.  
  - `data`: `table` — Saved game state with `hiding_spots` (list of GUIDs) and `num_hiders_found`.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for diagnostics.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Hiders: 3, Found: 1"`.

## Events & Listeners
- **Listens for:**
  - `onremove` on hiding spots → triggers `onremove_hiding_spot`
  - `onhidingspotremoved` on hiding spots → triggers `dounregisterhidingspot`
  - `onremove` on seekers → triggers `onremove_seeker`
- **Triggers:**
  - Calls external hooks: `OnAddSeeker`, `OnHidingSpotFound`, `OnHideAndSeekOver`, `OnHideAndSeekPulse` when applicable.