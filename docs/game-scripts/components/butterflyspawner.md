---
id: butterflyspawner
title: Butterflyspawner
description: Manages butterfly spawning and tracking on the master server based on player presence and world state.
tags: [spawning, environment, master-only]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 8b62c111
system_scope: environment
---

# Butterflyspawner

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Butterflyspawner` is a master-only component that manages butterfly entity spawning and lifecycle tracking. It monitors active players and world state (day/night, season) to spawn butterflies near flowers within player proximity. The component tracks spawned butterflies to handle cleanup when they fall asleep and manages their `homeseeker` and `pollinator` components for proper behavior.

## Usage example
```lua
-- Typically attached to TheWorld entity on master sim
local inst = TheWorld
inst:AddComponent("butterflyspawner")

-- After initialization, tracking can be managed manually
local butterfly = SpawnPrefab("butterfly")
inst.components.butterflyspawner:StartTracking(butterfly)

-- Stop tracking when butterfly is no longer needed
inst.components.butterflyspawner:StopTracking(butterfly)

-- Debug info
print(inst.components.butterflyspawner:GetDebugString())
```

## Dependencies & tags
**External dependencies:**
- `TUNING.MAX_BUTTERFLIES` -- maximum butterfly count threshold for spawning

**Components used:**
- `homeseeker` -- added to spawned butterflies; sets flower as home via `SetHome()`
- `pollinator` -- calls `Pollinate(flower)` on spawned butterflies to link to flowers

**Tags:**
- `flower` -- checked when finding valid spawn points
- `butterfly` -- checked when counting existing butterflies in area

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity instance (typically TheWorld). |
| `_maxbutterflies` | number | `TUNING.MAX_BUTTERFLIES` | Maximum allowed butterflies before spawning stops. File-scope constant. |
| `_updating` | boolean | `false` | Whether the spawning update loop is currently active. File-scope. |
| `_activeplayers` | table | `{}` | List of currently connected player entities. File-scope. |
| `_scheduledtasks` | table | `{}` | Maps players to their scheduled spawn tasks. File-scope. |
| `_butterflies` | table | `{}` | Maps tracked butterfly entities to persistence restore values. File-scope. |

## Main functions
### `OnPostInit()`
*   **Description:** Called after component initialization. Triggers `ToggleUpdate(true)` to begin spawning if world conditions are met.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `SpawnModeNever()`
*   **Description:** Deprecated spawn mode setter. No functional effect.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `SpawnModeLight()`
*   **Description:** Deprecated spawn mode setter. No functional effect.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `SpawnModeMed()`
*   **Description:** Deprecated spawn mode setter. No functional effect.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `SpawnModeHeavy()`
*   **Description:** Deprecated spawn mode setter. No functional effect.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `StartTrackingFn(target)`
*   **Description:** Internal function that begins tracking a butterfly entity. Sets `persists` to false, adds `homeseeker` component if missing, and registers sleep event listener. Stores a restore value (0-3) indicating persistence and homeseeker state.
*   **Parameters:** `target` -- butterfly entity to track
*   **Returns:** nil
*   **Error states:** Errors if `target` is nil or invalid entity (no nil guard present before accessing `target.persists`).

### `StartTracking(target)`
*   **Description:** Public wrapper for `StartTrackingFn()`. Begins tracking a butterfly entity for lifecycle management.
*   **Parameters:** `target` -- butterfly entity to track
*   **Returns:** nil
*   **Error states:** Errors if `target` is nil or invalid entity (delegates to `StartTrackingFn` without additional guards).

### `StopTrackingFn(target)`
*   **Description:** Internal function that stops tracking a butterfly entity. Restores `persists` value based on stored restore code (1 or 3 = persists, 0 or 2 = does not persist). Removes `homeseeker` component if restore value is less than 2. Unregisters sleep event listener.
*   **Parameters:** `target` -- butterfly entity to stop tracking
*   **Returns:** nil
*   **Error states:** None (nil `_butterflies[target]` check prevents errors on untracked entities).

### `StopTracking(target)`
*   **Description:** Public wrapper for `StopTrackingFn()`. Stops tracking a butterfly entity and restores its persistence state.
*   **Parameters:** `target` -- butterfly entity to stop tracking
*   **Returns:** nil
*   **Error states:** None (delegates to `StopTrackingFn` which has nil guard).

### `GetDebugString()`
*   **Description:** Returns debug information about current spawner state including update status and butterfly counts.
*   **Parameters:** None
*   **Returns:** string -- formatted as `"updating:%s butterflies:%d/%d"` showing active state, current count, and max allowed.
*   **Error states:** None

### `GetSpawnPoint(player)` (local)
*   **Description:** Finds a valid flower spawn point for a player. Searches within 25 units radius, excludes flowers within 36 units squared distance of player. Returns random valid flower or nil.
*   **Parameters:** `player` -- player entity to find spawn point for
*   **Returns:** Flower entity or `nil` if no valid flower found.
*   **Error states:** Errors if `player` has no `Transform` component (no nil guard before `player.Transform:GetWorldPosition()`).

### `SpawnButterflyForPlayer(player, reschedule)` (local)
*   **Description:** Spawns a butterfly for a player if under max count. Finds spawn flower, creates butterfly prefab, calls `pollinator:Pollinate()` on flower, sets `homeseeker` home, and teleports butterfly to flower position. Clears scheduled task and calls reschedule callback.
*   **Parameters:**
    - `player` -- player entity to spawn butterfly for
    - `reschedule` -- callback function to reschedule next spawn
*   **Returns:** nil
*   **Error states:** Errors if `player` has no `Transform` component (no nil guard before `player:GetPosition()`). Errors if spawned butterfly lacks `pollinator` or `homeseeker` components (no nil guards before component access).

### `ScheduleSpawn(player, initialspawn)` (local)
*   **Description:** Schedules a butterfly spawn task for a player. Initial spawn has 0.3 second base delay, subsequent spawns have 10 second base delay. Both add random 0-10 second variance.
*   **Parameters:**
    - `player` -- player entity to schedule spawn for
    - `initialspawn` -- boolean, true for first spawn after player joins
*   **Returns:** nil
*   **Error states:** None (nil check on `_scheduledtasks[player]` prevents duplicate scheduling).

### `CancelSpawn(player)` (local)
*   **Description:** Cancels a pending spawn task for a player and clears the task reference.
*   **Parameters:** `player` -- player entity to cancel spawn for
*   **Returns:** nil
*   **Error states:** None (nil check on `_scheduledtasks[player]` prevents errors).

### `ToggleUpdate(force)` (local)
*   **Description:** Toggles the spawning update loop based on world state. Spawning activates when `isday` is true, `iswinter` is false, and `_maxbutterflies > 0`. Force parameter reschedules all player spawns immediately.
*   **Parameters:** `force` -- boolean, if true reschedules all active player spawns
*   **Returns:** nil
*   **Error states:** None

### `AutoRemoveTarget(inst, target)` (local)
*   **Description:** Removes a tracked butterfly target if it is asleep. Called via delayed task after sleep event.
*   **Parameters:**
    - `inst` -- unused parameter
    - `target` -- butterfly entity to potentially remove
*   **Returns:** nil
*   **Error states:** None (nil `_butterflies[target]` check and `IsAsleep()` guard prevent errors).

### `OnTargetSleep(target)` (local)
*   **Description:** Event handler for butterfly sleep events. Schedules `AutoRemoveTarget` with zero delay to remove sleeping butterflies.
*   **Parameters:** `target` -- butterfly entity that fell asleep
*   **Returns:** nil
*   **Error states:** None

### `OnPlayerJoined(src, player)` (local)
*   **Description:** Event handler for player join events. Adds player to `_activeplayers` list if not already present. Starts spawn scheduling if updates are active.
*   **Parameters:**
    - `src` -- event source (unused)
    - `player` -- player entity that joined
*   **Returns:** nil
*   **Error states:** None

### `OnPlayerLeft(src, player)` (local)
*   **Description:** Event handler for player leave events. Cancels spawn task for leaving player and removes from `_activeplayers` list.
*   **Parameters:**
    - `src` -- event source (unused)
    - `player` -- player entity that left
*   **Returns:** nil
*   **Error states:** None

## Events & listeners
- **Listens to:**
  - `ms_playerjoined` (TheWorld) -- triggers `OnPlayerJoined`; adds player to active list and begins spawn scheduling
  - `ms_playerleft` (TheWorld) -- triggers `OnPlayerLeft`; cancels spawn task and removes player from active list
  - `entitysleep` (tracked butterfly targets) -- triggers `OnTargetSleep`; schedules removal of sleeping butterflies

- **World state watchers:**
  - `isday` -- triggers `ToggleUpdate`; enables/disables spawning based on day/night cycle
  - `iswinter` -- triggers `ToggleUpdate`; disables spawning during winter season