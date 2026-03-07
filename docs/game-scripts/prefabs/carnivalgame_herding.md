---
id: carnivalgame_herding
title: Carnivalgame Herding
description: Manages the herding minigame station, including chick spawning, game state transitions, reward generation, and static floor decoration setup.
tags: [minigame, npc, reward, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9f83d1af
system_scope: world
---

# Carnivalgame Herding

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This component implements the herding minigame station for DST's summer event. It handles the lifecycle of the minigame—activation, gameplay (spawning and managing chicks), and deactivation (reward spawning and cleanup). It works in conjunction with the `minigame`, `lootdropper`, `placer`, `knownlocations`, and `locomotor` components. Two prefabs are defined: `carnivalgame_herding_station` (the interactive game station) and `carnivalgame_herding_chick` (the controllable chick entities). Floor and station decorations are generated procedurally using `CreateFloorPart` and linked via the `placer` component.

## Usage example
```lua
-- Deploy the herding minigame kit
local kit = SpawnPrefab("carnivalgame_herding_kit")
kit.Transform:SetPosition(Vector3(x, y, z))

-- Game is activated and played via the Minigame component automatically
-- Rewards are spawned automatically on game stop via `SpawnRewards`

-- Access the minigame score
local score = inst.components.minigame.score
```

## Dependencies & tags
**Components used:** `minigame`, `lootdropper`, `placer`, `knownlocations`, `locomotor`, `inspectable`, `soundemitter`, `animstate`, `dynamicshadow`, `transform`, `network`, `hauntable`, `physics` (via `MakeProjectilePhysics`)  
**Tags:** Adds `CLASSIFIED`, `NOCLICK`, `DECOR`, `carnivalgame_part`, `carnivalgame_herding_station` (to the station prefab)  
**Children:** Spawns `carnivalgame_herding_chick` (adds `locomotor`, `knownlocations`, `hauntable`, `inspectable`, `soundemitter`, `animstate`, `dynamicshadow`, `transform`, `network`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_minigame_score` | number | `0` | Total score points accumulated during the game round. |
| `_round_delay` | Task or `nil` | `nil` | Delay task reference used during cleanup. |
| `chicks` | table | `{}` | Map of active chick entities spawned this round (`{[chick]=true}`). |
| `lightdelay_turnon` | number | `5 * FRAMES` | Delay (in frames) before lighting activates during game start. |
| `lightdelay_turnoff` | number | `6 * FRAMES` | Delay (in frames) before lighting deactivates after game end. |
| `spawn_rewards_delay` | number | `1` | Delay (in seconds) used to queue reward spawning. |

## Main functions
### `CreateFloorPart(parent, bank, anim, deploy_anim, offset, rot)`
*   **Description:** Creates a non-networked, static decoration entity for the minigame floor (e.g., rings or base). Links it to the parent via `placer:LinkEntity`, sets orientation/position, and schedules animation transitions on build.
*   **Parameters:** `parent` (entity) – owner entity to link to; `bank` (string) – animation bank name; `anim` (string) – default animation; `deploy_anim` (string) – animation played on build event; `offset` (Vector3 or `nil`) – local offset from parent; `rot` (number or `nil`) – rotation in degrees.
*   **Returns:** `inst` (entity) – the created decoration entity.
*   **Error states:** None documented; fails silently if `offset` or `rot` are malformed.

### `SpawnNewChick(inst, launch_angle)`
*   **Description:** Spawns and launches a new chick into the game arena. Registers event handlers for chick arrival and removal. Prevents spawning during the `outro` game state.
*   **Parameters:** `inst` (entity) – the station instance; `launch_angle` (number) – initial launch angle in degrees.
*   **Returns:** Nothing.
*   **Error states:** Exits early if `minigame:GetIsOutro()` is true; if `SpawnPrefab` fails, `chick` is `nil` and no further logic runs.

### `OnActivateGame(inst)`
*   **Description:** Activates the game station visually and audibly (play turn-on animation, start LP sound).
*   **Parameters:** `inst` (entity) – the station instance.
*   **Returns:** Nothing.

### `OnStartPlaying(inst)`
*   **Description:** Starts spawning chicks in a staggered loop at the start of gameplay. Uses `NUM_CHICKS` (12) and distributes spawns over ~1 second.
*   **Parameters:** `inst` (entity) – the station instance.
*   **Returns:** Nothing.

### `OnStopPlaying(inst)`
*   **Description:** Handles transition out of active gameplay. Plays reward animation, starts reward loop sound, and schedules turning off chicks.
*   **Parameters:** `inst` (entity) – the station instance.
*   **Returns:** `2` (seconds) – duration before next game phase begins.

### `SpawnRewards(inst)`
*   **Description:** Spawns reward tickets (one per point in `_minigame_score`) using `lootdropper:SpawnLootPrefab`. Activates a random cannon after each ticket spawn.
*   **Parameters:** `inst` (entity) – the station instance.
*   **Returns:** `0.25 * inst._minigame_score` (number) – total time (in seconds) taken to spawn all rewards.

### `OnDeactivateGame(inst)`
*   **Description:** Cleans up the game after rewards are spawned. Turns off chicks, stops sounds, plays end-bell, and clears the chick table.
*   **Parameters:** `inst` (entity) – the station instance.
*   **Returns:** Nothing.

### `RemoveGameItems(inst)`
*   **Description:** Cancels any pending `_round_delay` task to prevent leftover timers after removal.
*   **Parameters:** `inst` (entity) – the station instance.
*   **Returns:** Nothing.

### `update_chick(inst)`
*   **Description:** Periodic task for chick entities; triggers the `carnivalgame_herding_arivedhome` event when the chick is within 2 units of its remembered home location.
*   **Parameters:** `inst` (entity) – the chick instance.
*   **Returns:** Nothing.

### `OnLaunchLanded(inst)`
*   **Description:** Callback executed when a chick projectile lands. Updates physics (swaps projectile physics for character physics), sets position, adds/initializes `locomotor` component with tuned speeds, and sinks the chick if ground is invalid.
*   **Parameters:** `inst` (entity) – the chick instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onbuilt"` (station) → `OnBuilt`  
  - `"carnivalgame_herding_gothome"` (chick) → `chick_ongothome` (scorepoints, respawn timer)  
  - `"onremove"` (chick) → `chick_onremoved` (clean up chick reference from `chicks` table)
- **Pushes:**  
  - `"carnivalgame_herding_arivedhome"` (chick) – indicates chick reached home.  
  - `"carnivalgame_turnoff"` (chick) – signals chick to shut down animation/sound.  
  - `"loot_prefab_spawned"` (via `lootdropper`) – fired after spawning each reward ticket.
