---
id: carnivalgame_feedchicks
title: Carnivalgame Feedchicks
description: Manages the feedchicks carnival minigame station, including nest activation, food item spawning, and scoring logic.
tags: [minigame, event, npc, scoring]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1f1ac098
system_scope: minigame
---

# Carnivalgame Feedchicks

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`carnivalgame_feedchicks` is a minigame station prefab implementation for the "Feed Chicks" carnival event. It manages multiple nest entities that become temporarily active for players to feed, tracks player score based on successful feeds, spawns food items and rewards (tickets), and coordinates state transitions between idle, playing, and reward phases. It interacts closely with the `minigame`, `objectspawner`, `lootdropper`, `placer`, and `carnivalgamefeedable` components to orchestrate gameplay flow and visual feedback.

## Usage example
```lua
-- The component is embedded within the "carnivalgame_feedchicks_station" prefab.
-- To deploy the minigame station in the world:
local station = SpawnPrefab("carnivalgame_feedchicks_station")
station.Transform:SetPosition(x, y, z)
station:PushEvent("onbuilt", { rot = angle_degrees })

-- Game phases are triggered via exposed methods:
station:ActivateMinigame() -- starts playing
station:StopPlaying()      -- ends playing and spawns rewards
```

## Dependencies & tags
**Components used:** `minigame`, `objectspawner`, `lootdropper`, `placer`, `carnivalgamefeedable`, `inspectable`, `equippable`, `inventoryitem`, `carnivalgameitem`, `burnable`, `heavyobstaclephysics`, `soundemitter`, `transform`, `animstate`, `network`, `physics`, `minimapentity`.

**Tags:** Adds `CLASSIFIED`, `NOCLICK`, `DECOR`, `birdblocker`, `placer`, `carnivalgame_part`, `nopunch`, `irreplaceable`, `nonpotatable`, `inventoryitem`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_avaiablenests` | table (map) | `{}` | Tracks nests currently available for feeding during gameplay. |
| `_num_avaiablenests` | number | `0` | Count of available nests. |
| `fooditems` | table | `{}` | List of active food item entities. |
| `_minigame_score` | number | `0` | Player's current score for this minigame run. |
| `OnActivateGame` | function | `nil` | Hook called when the minigame starts. |
| `OnStartPlaying` | function | `nil` | Hook called to begin active gameplay loop. |
| `OnUpdateGame` | function | `nil` | Hook called periodically to spawn new activity. |
| `OnStopPlaying` | function | `nil` | Hook called when gameplay ends (returns reward delay). |
| `SpawnRewards` | function | `nil` | Spawns reward tickets based on final score. |
| `OnDeactivateGame` | function | `nil` | Hook called to reset station UI and nest states. |
| `RemoveGameItems` | function | `nil` | Cleans up all food items. |
| `OnRemoveGame` | function | `nil` | Cleans up all nest entities. |

## Main functions
### `OnActivateGame(inst)`
* **Description:** Initializes the game state: sets station animation to "turn_on", spawns food items, and marks all nests as available for feeding.
* **Parameters:** `inst` (entity) — The station entity instance.
* **Returns:** Nothing.
* **Error states:** None.

### `OnStartPlaying(inst)`
* **Description:** Starts the gameplay loop by scheduling initial nest activations.
* **Parameters:** `inst` (entity) — The station entity instance.
* **Returns:** Nothing.
* **Error states:** None.

### `DoActivateRandomNest(inst, delay)`
* **Description:** Schedules a random available nest to become "hungry" after `delay` seconds.
* **Parameters:** 
  * `inst` (entity) — The station entity.
  * `delay` (number) — Time in seconds before nest activation.
* **Returns:** Nothing.
* **Error states:** Does nothing if no nests are available (`_avaiablenests` is empty).

### `OnStopPlaying(inst)`
* **Description:** Ends gameplay: sets station animation to reward spawn, plays sounds, deactivates nests, and returns a delay before rewards are spawned.
* **Parameters:** `inst` (entity) — The station entity instance.
* **Returns:** `0.5` (number) — Delay in seconds before calling `SpawnRewards`.
* **Error states:** None.

### `SpawnRewards(inst)`
* **Description:** Spawns reward tickets equal to the player's final score ( `_minigame_score` ), with staggered timing.
* **Parameters:** `inst` (entity) — The station entity instance.
* **Returns:** `0.25 * inst._minigame_score` (number) — Total delay in seconds for all reward spawns.
* **Error states:** None.

### `OnDeactivateGame(inst)`
* **Description:** Resets station and nests to idle-off state: updates animations, restores inspectable component to nests, sets all nests to `idle_off` state.
* **Parameters:** `inst` (entity) — The station entity instance.
* **Returns:** Nothing.
* **Error states:** None.

### `NewObject(inst, obj)`
* **Description:** Event listener registration for new nest/food objects. Listens for feed and availability events on nested objects.
* **Parameters:** 
  * `inst` (entity) — Station entity.
  * `obj` (entity) — The newly spawned object (nest or food).
* **Returns:** Nothing.
* **Error states:** None.

### `RemoveGameItems(inst)`
* **Description:** Removes all food items, spawning dirt puff FX if they are still in the world.
* **Parameters:** `inst` (entity) — The station entity instance.
* **Returns:** Nothing.
* **Error states:** Skips removal if `fooditems` is `nil` or item is already removed.

### `OnRemoveGame(inst)`
* **Description:** Removes all nest entities spawned by the station.
* **Parameters:** `inst` (entity) — The station entity instance.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Listens to:** 
  * `carnivalgame_feedchicks_feed` — fired when a player successfully feeds a nest; triggers scoring (`ScorePoints`).
  * `carnivalgame_feedchicks_available` — fired when a nest becomes available again; re-adds nest to `_avaiablenests`.
  * `onbuilt` — triggers initial setup (`OnBuilt`).
- **Pushes:** 
  * `carnivalgame_feedchicks_hungry` — sent to a nest to make it active for feeding.
  * `carnivalgame_turnon` / `carnivalgame_turnoff` — sent to nests to update visual state.
  * `equipskinneditem` / `unequipskinneditem` — sent to owner when food is equipped/unequipped.
