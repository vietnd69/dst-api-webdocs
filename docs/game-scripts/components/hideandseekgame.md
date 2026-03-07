---
id: hideandseekgame
title: Hideandseekgame
description: Manages the Hide and Seek minigame logic, tracking seekers, hiding spots, game state, and rewards.
tags: [minigame, player, event]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6be61142
system_scope: entity
---

# Hideandseekgame

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HideAndSeekGame` is an entity component that orchestrates the Hide and Seek minigame by tracking active seekers, registered hiding spots, and game state transitions. It listens for entity removals and hiding spot discoveries to update internal state and trigger callbacks. It coordinates with the `hideandseeker` component on seekers and the `hideandseekhidingspot` component on hiding spots to manage lifecycle events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hideandseekgame")

-- Start the game by registering hiding spots
for _, spot in ipairs(hiding_spots) do
    spot:AddComponent("hideandseekhidingspot")
    inst.components.hideandseekgame:RegisterHidingSpot(spot)
end

-- Later, add a seeker manually or let the pulse task auto-detect them
inst.components.hideandseekgame:AddSeeker(some_player, true)
```

## Dependencies & tags
**Components used:** `hideandseeker`, `hideandseekhidingspot`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `seekers` | table | `{}` | Map of active seeker entities to `true`. |
| `hiding_spots` | table | `{}` | Map of active hiding spot entities to `true`. |
| `hiding_range` | number | `10` | Max squared distance for a player to be auto-detected as a seeker (used with `hiding_range * hiding_range`). |
| `hiding_range_toofar` | number | `10` | Unused in current implementation; likely reserved for future logic. |
| `num_hiders_found` | number | `0` | Count of hiding spots discovered by players (used for rewards, not game progress). |
| `onremove_hiding_spot` | function | — | Handler for when a hiding spot is removed; deregisters it and ends game if none remain. |
| `onremove_seeker` | function | — | Handler for when a seeker is removed; cleans up internal tracking. |
| `dounregisterhidingspot` | function | — | Handler for `onhidingspotremoved` events; increments `num_hiders_found` if found by a player, then deregisters. |
| `pulse_task` | Task | `nil` | Periodic task (1-second interval) that auto-detects seekers near the game entity. |

## Main functions
### `OnRemoveEntity()`
* **Description:** Cleans up when the game entity is removed. Aborts all registered hiding spots.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsActive()`
* **Description:** Returns `true` if at least one hiding spot is registered.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if hiding spots exist, `false` otherwise.

### `Abort()`
* **Description:** Immediately ends the game. Unregisters all hiding spots and aborts their components.
* **Parameters:** None.
* **Returns:** Nothing.

### `_HideAndSeekOver()`
* **Description:** Internal method called when no hiding spots remain. Cancels the pulse task, triggers the `OnHideAndSeekOver` callback, and clears internal seeker state.
* **Parameters:** None.
* **Returns:** Nothing.

### `AddSeeker(seeker, started_game)`
* **Description:** Adds a player or entity as a seeker. Creates the `hideandseeker` component if missing and registers removal callbacks.
* **Parameters:**
  * `seeker` (entity) — The entity to add as a seeker.
  * `started_game` (boolean) — Indicates whether this seeker started the game (passed to `OnAddSeeker` callback).
* **Returns:** Nothing.
* **Error states:** No effect if `seeker.components.hideandseeker` already exists.

### `RegisterHidingSpot(hiding_spot)`
* **Description:** Registers a hiding spot entity. Adds listeners for its removal and discovery, and starts the pulse task if not already running.
* **Parameters:** `hiding_spot` (entity) — The hiding spot to register.
* **Returns:** Nothing.

### `UnregisterHidingSpot(hiding_spot)`
* **Description:** Removes a hiding spot from tracking. Cleans up event listeners and ends the game if none remain.
* **Parameters:** `hiding_spot` (entity) — The hiding spot to unregister.
* **Returns:** Nothing.

### `GetNumHiding()`
* **Description:** Returns the count of currently active hiding spots.
* **Parameters:** None.
* **Returns:** `number` — Number of registered hiding spots.

### `GetNumSeekers()`
* **Description:** Returns the count of active seekers.
* **Parameters:** None.
* **Returns:** `number` — Number of registered seekers.

### `GetNumFound()`
* **Description:** Returns how many hiding spots have been found by players.
* **Parameters:** None.
* **Returns:** `number` — Value of `num_hiders_found`.

### `OnSave()`
* **Description:** Prepares serializable data for save/load. Returns GUIDs of hiding spots and current `num_hiders_found`.
* **Parameters:** None.
* **Returns:** `{ hiding_spots: number[], num_hiders_found: number }, number[]` — Save data and list of GUIDs.

### `LoadPostPass(newents, data)`
* **Description:** Restores hiding spots after load using GUIDs from save data.
* **Parameters:**
  * `newents` (table) — Map of GUIDs to loaded entities.
  * `data` (table) — Save data with `hiding_spots` (list of GUIDs) and `num_hiders_found`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a debug-friendly status string.
* **Parameters:** None.
* **Returns:** `string` — Formatted as `"Hiders: X, Found: Y"`.

## Events & listeners
- **Listens to:**  
  - `"onremove"` on hiding spots and seekers — triggers `onremove_hiding_spot` and `onremove_seeker` handlers respectively.  
  - `"onhidingspotremoved"` on hiding spots — triggers `dounregisterhidingspot`, incrementing `num_hiders_found` if discovered by a player.
- **Pushes:**  
  - No events are directly pushed by this component (callbacks like `OnHidingSpotFound`, `OnHideAndSeekOver`, and `OnAddSeeker` are assigned externally and invoked as needed).
