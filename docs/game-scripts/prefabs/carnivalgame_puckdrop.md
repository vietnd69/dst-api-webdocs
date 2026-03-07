---
id: carnivalgame_puckdrop
title: Carnivalgame Puckdrop
description: Implements the puck drop carnival minigame station entity, managing gameplay state transitions, door selection timing, and reward spawning.
tags: [minigame, carnival, platform]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b1361f6b
system_scope: world
---

# Carnivalgame Puckdrop

> Based on game build **714004** | Last updated: 2026-03-04

## Overview
The `carnivalgame_puckdrop` prefab implements the physical station and supporting entities for the "Puck Drop" carnival minigame. It manages the core gameplay loop: turning on, cycling through doors, accepting player interaction during active play, and spawning rewards based on performance score. It relies heavily on the `activatable`, `minigame`, `workable`, `placer`, and `lootdropper` components to handle interaction, state tracking, lighting, and item drops.

## Usage example
```lua
-- Typical usage is internal to DST via the provided prefabs
-- Example of adding and configuring the component on a custom station entity:
local inst = CreateEntity()
inst:AddComponent("activatable")
inst:AddComponent("minigame")
inst:AddComponent("workable")
inst:AddComponent("lootdropper")
inst:AddComponent("placer")

-- Attach minigame callbacks
inst.components.minigame._spectator_rewards_score = 14
inst.OnActivateGame = function(inst) inst.sg:GoToState("turn_on") end
inst.OnStartPlaying = function(inst)
    -- Set inactive timeout and start cycle
    inst._inactive_timeout = inst:DoTaskInTime(TUNING.CARNIVALGAME_PUCKDROP_INACTIVE_TIMEOUT_MIN + math.random() * TUNING.CARNIVALGAME_PUCKDROP_INACTIVE_TIMEOUT_VAR, PickCurrentDoor)
    inst.sg:GoToState("cycle_doors")
    inst.components.activatable.inactive = true
    inst._current_game = math.random(5)
end

-- Set callback for physical hits (e.g., by tools)
inst.components.workable:SetOnWorkCallback(function(inst, worker) ... end)

inst:SetStateGraph("SGcarnivalgame_puckdrop_station")
```

## Dependencies & tags
**Components used:**  
- `activatable` – for activation/deactivation and quick action behavior  
- `minigame` – for crowd-distancing, excitement tracking, and score interaction  
- `workable` – for handling physical hits on the station  
- `placer` – for linking child entities (e.g., floor and decor)  
- `lootdropper` – for spawning reward tickets  

**Tags added:** `CLASSIFIED`, `NOCLICK`, `DECOR`, `carnivalgame_part` (on floor/decor children), `carnivalgame_part` (on station via placement logic)  

**Prefabs spawned:** `carnival_prizeticket` (via `lootdropper:SpawnLootPrefab`)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_inactive_timeout` | Task or `nil` | `nil` | Handle to a delayed task that cancels the current door selection after the timeout. Canceled on game start/stop. |
| `_current_game` | number | `nil` | Randomly assigned door index (`1`–`5`) that is the winning target for the current round. |
| `_current_door` | number | `1` | Current door selected during the cycling animation. Updated via state graph logic. |
| `_minigame_score` | number | `nil` | Player’s score during gameplay, used to determine how many tickets to spawn. |
| `_spawn_rewards_delay` | number | `1` | Base delay (in seconds) used before spawning first reward ticket. |
| `lightdelay_turnon` | number | `5 * FRAMES` | Time (in frames) to delay lighting activation after state graph enters `"turn_on"`. |
| `lightdelay_turnoff` | number | `6 * FRAMES` | Time (in frames) to delay lighting deactivation after state graph enters `"turn_off"`. |

## Main functions
### `PickCurrentDoor(inst)`
* **Description:** Cancels the `_inactive_timeout` task and stops door cycling (typically called when the player interacts). Called on player press (via `OnActivateGame`) or timeout.
* **Parameters:** `inst` (Entity) – the station instance.
* **Returns:** Nothing.

### `OnStartPlaying(inst)`
* **Description:** Initiates the active gameplay phase. Starts the inactive timeout, transitions the state graph to `"cycle_doors"`, sets the station as inactive, and picks a random winning door.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnUpdateGame(inst)`
* **Description:** Called periodically during gameplay (e.g., via `minigame` loop) to register excitement (used for crowd behavior and tuning). Records the current simulation time for excitement calculation.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnStopPlaying(inst)`
* **Description:** Ends gameplay: sets station to active state (`inactive = false`), cancels any pending timeout, and returns the duration of the off phase (used for state graph timing).
* **Parameters:** `inst` (Entity).
* **Returns:** `0.5` (number) – duration (in seconds) for the `"off"` state before transitioning.

### `SpawnRewards(inst)`
* **Description:** Initiates reward spawning. Enters the `"gameover"` state and schedules a loop of `spawnticket` calls based on `_minigame_score`. Uses `_spawn_rewards_delay` plus per-item offset (0.25s) to space tickets.
* **Parameters:** `inst` (Entity).
* **Returns:** total delay (number) in seconds until last reward spawns.

### `spawnticket(inst)`
* **Description:** Spawns one prize ticket (`carnival_prizeticket`) using the `lootdropper` and triggers a random cannon animation via `ActivateRandomCannon`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnDeactivateGame(inst)`
* **Description:** Handles deactivation: transitions to `"turn_off"`, sets `inactive = false`, and cancels the timeout.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `station_OnPress(inst, doer)`
* **Description:** Activation callback for `activatable` component. If the minigame is currently playing (`GetIsPlaying()` returns `true`), calls `PickCurrentDoor` to lock in the selected door. Returns `true` to confirm activation was handled.
* **Parameters:**  
  - `inst` (Entity) – the station.  
  - `doer` (Entity) – the player or activator.  
* **Returns:** `true` (boolean) – activation successful.

### `station_onhit(inst, worker)`
* **Description:** Workable hit callback. Plays the `"hit"` animation and queues `"idle_off"` (with note to handle doors in future). Only triggers if no active minigame task is running (`_minigametask == nil`).
* **Parameters:**  
  - `inst` (Entity) – the station.  
  - `worker` (Entity) – the entity performing the hit.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onbuilt"` (on station) – triggers `OnBuilt` to transition state graph to `"place"`.  
  - `"onbuilt"` (on floor part) – triggers transition from `"place"` to `"idle"` animation.  

- **Pushes:** None defined in this file. (Events are pushed by attached state graphs or components such as `minigame` and `activatable`.)
