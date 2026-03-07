---
id: carnivalgame_common
title: Carnivalgame Common
description: Provides shared functionality for carnival minigame stations, including activation/deactivation lifecycle, scoring, rewards, and camera/focus management.
tags: [minigame, carnival, structure, camera, trader]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8711bef1
system_scope: entity
---

# Carnivalgame Common

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines helper functions and a factory (`carnival_station_fn`) for creating carnival minigame stations. It encapsulates the full game lifecycle: activation (intro), gameplay (playing), stopping (outro), reward spawning, and deactivation. It integrates tightly with the `minigame`, `trader`, `workable`, `lootdropper`, `inspectable`, and `focalpoint` components to manage state, interaction, physics, loot, and camera behavior.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddLight()
inst.entity:AddMiniMapEntity()
inst.entity:AddNetwork()

inst:AddComponent("savedrotation")
inst:AddComponent("inspectable")
inst:AddComponent("trader")
inst:AddComponent("minigame")
inst:AddComponent("workable")
inst:AddComponent("lootdropper")

-- Set up minigame callbacks using the module's helper functions:
inst.components.minigame.gametype = "carnivalgame"
inst.components.minigame:SetOnActivatedFn(OnActivateMinigame)
inst.components.minigame:SetOnDeactivatedFn(OnDeactivateMinigame)

inst.components.trader:SetAbleToAcceptTest(Trader_AbleToAcceptTest)
inst.components.trader.onaccept = OnAcceptItem

inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
inst.components.workable:SetWorkLeft(3)
inst.components.workable:SetOnFinishCallback(onhammered)
inst.components.workable:SetOnWorkCallback(onhit)

return inst
```

## Dependencies & tags
**Components used:** `savedrotation`, `inspectable`, `trader`, `minigame`, `workable`, `lootdropper`, `focalpoint`, `light`, `animstate`, `transform`, `soundemitter`, `minimapentity`, `network`  
**Tags:** `structure`, `birdblocker`, `carnivalgame_part`  
**Internal components:** `inst._camerafocus` (network bool), `inst._minigametask` (task), `inst._musiccheck` (task), `inst._minigame_score` (number)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_game_duration` | number | `TUNING.CARNIVALGAME_DURATION` | Total gameplay duration in seconds. |
| `_turnon_time` | number | `1.5` | Delay in seconds between minigame activation and gameplay start. |
| `_camerafocus_dist_min` | number | `TUNING.CARNIVALGAME_CAMERA_FOCUS_MIN` | Minimum distance for camera focus. |
| `_camerafocus_dist_max` | number | `TUNING.CARNIVALGAME_CAMERA_FOCUS_MAX` | Maximum distance for camera focus. |
| `_minigame_score` | number | `0` | Current player score for the game session. |
| `_minigametask` | task or `nil` | `nil` | Active periodic task (e.g., timer or update loop). |
| `_musiccheck` | task or `nil` | `nil` | Periodic task used to check player proximity for music. |
| `Light` | Light component | — | Light component for the station; disabled by default. |

## Main functions
### `carnival_station_fn(common_postinit, master_postinit)`
*   **Description:** Factory function to construct a carnival station entity with all required components and behaviors. Sets up lifecycle hooks, camera focus, trading, workability, loot, and network sync.
*   **Parameters:**  
    `common_postinit` (function or `nil`) – Callback invoked before entity initialization completes on both client and server.  
    `master_postinit` (function or `nil`) – Callback invoked after server-specific initialization.
*   **Returns:** `inst` – The fully initialized entity instance.
*   **Error states:** None.

### `EnableCameraFocus(inst, enable)`
*   **Description:** Enables or disables camera focus on the station using the `focalpoint` component. Syncs focus state to clients.
*   **Parameters:**  
    `inst` (entity) – The carnival station instance.  
    `enable` (boolean) – Whether to enable camera focus.
*   **Returns:** Nothing.

### `OnActivateMinigame(inst)`
*   **Description:** Handler invoked when the minigame is activated (e.g., player inserts a token). Enters intro state, sets up focus, pauses hound AI, schedules delayed gameplay start.
*   **Parameters:**  
    `inst` (entity) – The carnival station instance.
*   **Returns:** Nothing.
*   **Error states:** May silently skip re-initialization if `_minigametask` is already active.

### `OnDeactivateMinigame(inst)`
*   **Description:** Handler invoked when the minigame ends (e.g., timeout or manual stop). Restores trader, disables focus, resumes hound AI, cancels tasks, and calls `OnDeactivateGame`.
*   **Parameters:**  
    `inst` (entity) – The carnival station instance.
*   **Returns:** Nothing.

### `FlagGameComplete(inst)`
*   **Description:** Called when gameplay time expires. Cancels the active update task, sets the minigame state to "outro", removes temporary items, triggers `OnStopPlaying`, schedules reward spawning.
*   **Parameters:**  
    `inst` (entity) – The carnival station instance.
*   **Returns:** Nothing.

### `DoSpawnRewards(inst)`
*   **Description:** Calls `SpawnRewards`, then schedules `ShutdownGame` after the returned delay.
*   **Parameters:**  
    `inst` (entity) – The carnival station instance.
*   **Returns:** Nothing.

### `UpdateGameFn(inst)`
*   **Description:** Periodically called during gameplay to check for time expiration and invoke `OnUpdateGame`.
*   **Parameters:**  
    `inst` (entity) – The carnival station instance.
*   **Returns:** Nothing.

### `ScorePoints(inst, doer, points)`
*   **Description:** Records score for a player action, updates minigame excitement, and randomly triggers a connected cannon animation.
*   **Parameters:**  
    `inst` (entity) – The carnival station instance.  
    `doer` (entity) – The player/entity scoring points.  
    `points` (number) – Number of points to add (defaults to `1`).
*   **Returns:** Nothing.

### `IsMinigameActive(inst)`
*   **Description:** Returns whether the minigame is currently running (i.e., `_minigametask` is non-`nil`).
*   **Parameters:**  
    `inst` (entity) – The carnival station instance.
*   **Returns:** `boolean` – `true` if the game is active, otherwise `false`.

### `GetStatus(inst)`
*   **Description:** Inspector callback; returns `"PLAYING"` if the minigame is active, otherwise `nil`.
*   **Parameters:**  
    `inst` (entity) – The carnival station instance.
*   **Returns:** `"PLAYING"` or `nil`.

### `ActivateRandomCannon(inst)`
*   **Description:** Finds a random nearby cannon with tags `carnivalcannon` and `inactive`, and calls `FireCannon` on it.
*   **Parameters:**  
    `inst` (entity) – The carnival station instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    `camerafocusdirty` – Updates camera focus state (client-side).  
    `entitywake` / `entitiesleep` – Starts/stops music proximity check.  
    `onremove` – Internal cleanup (via `FocalPoint` when camera focus source is removed).  
    `OnRemoveEntity` – Handles shutdown and `OnRemoveGame` callback.  
    `OnEntityWake` / `OnEntitySleep` – Manages music and gameplay state.

- **Pushes:**  
    `pausehounded` – Pauses hound AI while minigame is active.  
    `unpausehounded` – Resumes hound AI after game ends.  
    `playcarnivalmusic` – Triggered for nearby players when game is near.  
    `entity_droploot` – Pushed by `lootdropper` during hammering/ Destruction.  
    `ms_minigamedeactivated` – Pushed by `minigame` component on deactivation.