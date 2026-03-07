---
id: rabbithole
title: Rabbithole
description: Manages a dynamic burrow that spawns rabbits based on season, weather, and player interactions, with support for spring-specific flooded behavior and Rabbit King lucky rabbit spawns.
tags: [world, spawner, environment, seasonal, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 69d45a49
system_scope: environment
---

# Rabbithole

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `rabbithole` prefab implements a dynamic world object that spawns rabbits periodically under normal conditions and transitions to a flooded "spring mode" during the Spring season or under rain. It integrates with several core systems: `spawner` for rabbit queueing and release, `workable` for player digging interactions, `hauntable` for Haunter-based mechanics, and `inspectable` for season-based status reporting. It also supports a special interaction for Rabbit King carrots and may spawn a lucky rabbit upon child release. Spring transitions are governed by weather and time-based timers.

## Usage example
```lua
-- Typically added by the framework via Prefab("rabbithole", fn, ...)
-- Not usually instantiated manually by mods
local hole = SpawnPrefab("rabbithole")
hole.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `spawner`, `lootdropper`, `workable`, `inspectable`, `hauntable`, `trader`, `worldsettingsutil` (via `WorldSettings_Spawner_SpawnDelay`, `WorldSettings_Spawner_PreLoad`)
**Tags:** Adds `cattoy` to the instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `springmode` | boolean or `nil` | `nil` | Indicates if the hole is in Spring-flooded mode (`true`) or normal mode (`false`). Initialized in `OnInit`. |
| `iscollapsed` | `net_bool` | `false` | Networked boolean representing whether the hole is flooded. Drives wet state and animation. |
| `springtask` | `DoTaskInTime` handle or `nil` | `nil` | Timer handle for season transitions. Used to delay entering or exiting spring mode. |
| `watchingrain` | boolean or `nil` | `nil` | Flag indicating if the hole is listening for rain to trigger spring transition. |
| `inittask` | `DoTaskInTime` handle or `nil` | `nil` | Initialization task handle during early load. |

## Main functions
### `dig_up(inst)`
*   **Description:** Destroys the rabbithole after dropping a rabbit loot prefab if occupied. Typically called when a player finishes digging it.
*   **Parameters:** `inst` (Entity) — the rabbithole instance.
*   **Returns:** Nothing.
*   **Error states:** May spawn no loot if `spawner` is not occupied.

### `startspawning(inst)`
*   **Description:** Initiates rabbit spawning by resetting queue mode and scheduling a spawn with a random delay between 60–180 seconds.
*   **Parameters:** `inst` (Entity) — the rabbithole instance.
*   **Returns:** Nothing.
*   **Error states:** Silently exits if `spawner` component is absent.

### `stopspawning(inst)`
*   **Description:** Halts spawning by enabling queue mode with a retry period between 60–120 seconds. Used in spring mode or when day ends.
*   **Parameters:** `inst` (Entity) — the rabbithole instance.
*   **Returns:** Nothing.
*   **Error states:** Silently exits if `spawner` component is absent.

### `SetSpringMode(inst)`
*   **Description:** Switches the rabbithole into flooded spring mode: sets animation to `"idle_flooded"`, marks as collapsed, updates wet prefix, and stops regular spawning.
*   **Parameters:** `inst` (Entity) — the rabbithole instance.
*   **Returns:** Nothing.

### `SetNormalMode(inst)`
*   **Description:** Exits spring mode, resumes day-based spawning logic, and sets animation to `"idle"`.
*   **Parameters:** `inst` (Entity) — the rabbithole instance.
*   **Returns:** Nothing.

### `OnHaunt(inst)`
*   **Description:** Handles Haunter haunt interaction. Returns `true` and releases a rabbit if not in spring mode, the hole is occupied, and release succeeds.
*   **Parameters:** `inst` (Entity) — the rabbithole instance.
*   **Returns:** `boolean` — `true` on successful haunt (rabbit released), `false` otherwise.

### `AbleToAcceptTest(inst, item, giver, count)`
*   **Description:** Determines if a carrot can be fed to the rabbithole by a player (e.g., to interact with Rabbit King mechanics).
*   **Parameters:**  
  `inst` (Entity) — the rabbithole instance.  
  `item` (Entity) — the item being offered.  
  `giver` (Entity) — the entity giving the item.  
  `count` (number) — quantity of item.  
*   **Returns:** `boolean` — `true` if the rabbithole is not collapsed, the item is a carrot, the giver is a player, and the Rabbit King manager permits feeding.
*   **Error states:** Returns `false` if any condition fails.

### `OnItemAccepted(inst, giver, item, count)`
*   **Description:** Records carrot acceptance with the Rabbit King manager for tracking.
*   **Parameters:**  
  `inst` (Entity) — the rabbithole instance.  
  `giver` (Entity) — the player.  
  `item` (Entity) — the carrot item.  
  `count` (number) — quantity.  
*   **Returns:** Nothing.

### `OnVacated(inst, child)`
*   **Description:** Called when a rabbit leaves the rabbithole. Stops regular spawning and attempts a lucky rabbit spawn for the nearest player if luck roll succeeds.
*   **Parameters:**  
  `inst` (Entity) — the rabbithole instance.  
  `child` (Entity) — the rabbit that vacated.  
*   **Returns:** Nothing.

### `OnInit(inst, springmode)`
*   **Description:** Initializes season mode and starts watching for seasonal changes. Runs immediately after construction.
*   **Parameters:**  
  `inst` (Entity) — the rabbithole instance.  
  `springmode` (boolean) — whether to start in spring mode (from save data or world state).  
*   **Returns:** Nothing.

### `OnIsSpring(inst, isspring)`
*   **Description:** Reacts to seasonal changes (spring ↔ non-spring), managing timers and weather observations for transitions.
*   **Parameters:**  
  `inst` (Entity) — the rabbithole instance.  
  `isspring` (boolean) — current season state.  
*   **Returns:** Nothing.

### `OnStartRain(inst)`
*   **Description:** Handles rain events in spring to initiate spring mode transition if not already in spring mode.
*   **Parameters:** `inst` (Entity) — the rabbithole instance.  
*   **Returns:** Nothing.

### `OnIsDay(inst, isday)`
*   **Description:** Reacts to day/night transitions in normal mode to control rabbit spawning behavior.
*   **Parameters:**  
  `inst` (Entity) — the rabbithole instance.  
  `isday` (boolean) — whether it is currently day.  
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns `"SPRING"` if the hole is flooded (collapsed) for `inspectable` display.
*   **Parameters:** `inst` (Entity) — the rabbithole instance.  
*   **Returns:** `string or nil` — `"SPRING"` if `iscollapsed` is true, otherwise `nil`.

## Events & listeners
- **Listens to:**  
  - `iscollapseddirty` — updates wet prefix and animation state when collapse state changes.  
- **Pushes:** None directly; relies on entity-level events like `loot_prefab_spawned` (via `lootdropper`) or damage/failure logic elsewhere.  
- **World state watchers:**  
  - `"isspring"` → `OnIsSpring`  
  - `"isday"` → `OnIsDay` (only in normal mode)  
  - `"startrain"` → `OnStartRain` (only in spring transition setup)  
