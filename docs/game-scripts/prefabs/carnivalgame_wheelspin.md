---
id: carnivalgame_wheelspin
title: Carnivalgame Wheelspin
description: Manages the wheel-spin carnival minigame station, including spin logic, scoring, and reward spawning.
tags: [minigame, carnival, reward, networked]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8a1f432c
system_scope: world
---

# Carnivalgame Wheelspin

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `carnivalgame_wheelspin` prefabs implement a multiplayer minigame station where players can interact to spin a wheel and earn prizes. The core station (`carnivalgame_wheelspin_station`) integrates with the `activatable`, `minigame`, and `lootdropper` components. It uses networked state (`net_float`, `net_bool`) to synchronize hand rotation and game state across clients. Two helper prefabs (`carnivalgame_wheelspin_hand_inner`, `carnivalgame_wheelspin_hand_outer`) provide visual rotation effects driven by the server. Rewards are dropped as `carnival_prizeticket` items based on spin outcome.

## Usage example
```lua
local station = SpawnPrefab("carnivalgame_wheelspin_station")
station.Transform:SetPosition(x, y, z)
station:PushEvent("onbuilt")
-- Players can then press the station to start/stop the spin
station:PushEvent("activate", {doer = player})
```

## Dependencies & tags
**Components used:** `activatable`, `minigame`, `lootdropper`, `placer`  
**Tags:** `CLASSIFIED`, `NOCLICK`, `DECOR`, `carnivalgame_part` (on child entities), `NOCLICK`, `DECOR` (on hands)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inactive` | boolean | `false` | Initial inactive state of the `activatable` component. |
| `_game_playing` | net_bool | `false` | Networked flag indicating if the minigame is playing. |
| `_hand_inner_state.end_angle` | net_float | `0` | Networked target rotation angle for the inner hand. |
| `_hand_outer_state.end_angle` | net_float | `0` | Networked target rotation angle for the outer hand. |
| `minigame_endtime` | number | `nil` | Estimated end time of the minigame (set during slowdown). |
| `_minigame_score` | number | `0` | Score accumulated during spins (used for reward count). |

## Main functions
### `calc_score(angle)`
*   **Description:** Calculates the prize index from the wheel’s final angle. Uses a fixed `prizes` array and modular arithmetic to determine which prize segment the angle falls into.
*   **Parameters:** `angle` (number) — normalized rotation angle in the range `[0, 1)`.
*   **Returns:** number — the prize value (e.g., `1`, `2`, `4`, `6`, or `14`).
*   **Error states:** Returns `1` if the computed cell index exceeds the `prizes` array length.

### `StartSlowdown(inst)`
*   **Description:** Initiates the deceleration phase of the spin. Sets up delayed tasks for inner and outer hands to rotate to random angles over `SLOWDOWN_TIME` seconds, updating `_minigame_score` upon completion.
*   **Parameters:** `inst` (entity) — the station instance.
*   **Returns:** Nothing.
*   **Error states:** No effect if `_inactive_timeout` is `nil` (i.e., game not active).

### `SpawnRewards(inst)`
*   **Description:** Spawns tickets over time proportional to `_minigame_score`. Plays reward animations and looping sounds.
*   **Parameters:** `inst` (entity) — the station instance.
*   **Returns:** number — total duration (in seconds) of the reward sequence.
*   **Error states:** Does not handle `_minigame_score <= 0` explicitly; may spawn zero rewards with animation overhead.

### `client_update_hand(inst, hand, end_angle)`
*   **Description:** Client-side handler that starts animation easing for a hand during slowdown. Uses `easing.outQuad` to interpolate animation time over `SLOWDOWN_TIME`.
*   **Parameters:**  
    *   `inst` (entity) — station instance (used for task and event context).  
    *   `hand` (entity) — the inner/outer hand prefab instance.  
    *   `end_angle` (net_float wrapper) — networked target angle.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `end_angle:value()` is `<= 0`.

## Events & listeners
- **Listens to:**  
  - `onbuilt` — triggers `OnBuilt` to play build animation and sound.  
  - `_hand_inner_state_end_angle` — triggers `client_update_hand` for inner hand.  
  - `_hand_outer_state_end_angle` — triggers `client_update_hand` for outer hand.  
  - `carnivalgame_wheelspin_game_playing` — triggers `client_game_playing_changed` to pause/resume hands.  
  - `onremove` (on hand entities) — removes hand from `highlightchildren`.  
- **Pushes:**  
  - `activate` — handled by `station_OnPress` (starts slowdown if game is playing).  
  - `on_loot_dropped` — fired by `lootdropper:SpawnLootPrefab` for each ticket.  
  - `loot_prefab_spawned` — fired by `lootdropper` after spawn.