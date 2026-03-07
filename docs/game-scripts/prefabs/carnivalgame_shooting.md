---
id: carnivalgame_shooting
title: Carnivalgame Shooting
description: Implements the shooting minigame station for the Carnival event, managing game state, aiming mechanics, target spawning, and reward distribution for players.
tags: [minigame, event, combat, spawn, network]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 789cd498
system_scope: world
---

# Carnivalgame Shooting

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`carnivalgame_shooting` is a prefab collection that implements the Carnival shooting minigame station and its interactive components (target, button, projectile, and deployable kit). It uses the `minigame`, `carnivalgameshooter`, `activatable`, `objectspawner`, and `complexprojectile` components to manage gameplay flow, aiming, shooting, and scoring. The system distinguishes between server (master) and client responsibilities, syncing aiming state via `net_tinybyte` and `updateLooper` components.

## Usage example
```lua
-- Typical usage is via the deployable kit prefab
local station = SpawnPrefab("carnivalgame_shooting_station")
station.Transform:SetPosition(x, y, z)

-- Internally, this registers:
-- - 7 targets spawned via objectspawner
-- - 1 activatable button
-- - 1 targeting arrow visible only on client
-- - Networked state via _arrow_state and minigame hooks
```

## Dependencies & tags
**Components used:** `activatable`, `carnivalgameshooter`, `complexprojectile`, `groundshadowhandler`, `inspectable`, `lootdropper`, `minigame`, `objectspawner`, `placer`, `updatelooper`

**Tags added by station:** `CLASSIFIED`, `NOCLICK`, `DECOR`, `carnivalgame_part` (on internal decor entities), `carnivalgame_target` (on targets)

**Tags added by button/target:** `birdblocker`, `scarytoprey`, `carnivalgame_part`, `carnivalgame_target`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `button` | `GGameEntity` or `nil` | `nil` | Reference to the shoot button entity (server-side only) |
| `targeting_arrow` | `GGameEntity` or `nil` | `nil` | Client-side arrow visual for aiming meter |
| `add_friendly_target` | boolean | `false` | Whether a friendly (non-target) target is added starting round 3 |
| `_round_num` | number | `0` | Current round number (incremented on round start) |
| `_picked_enemies` | table | `{}` | Set of enemy targets active in current round |
| `_picked_friendlies` | table | `{}` | Set of friendly targets active in current round |
| `_round_delay` | `Task` or `nil` | `nil` | Task handle for round delay timer |
| `_arrow_state` | `net_tinybyte` | `0` | Networked state: `0`=off, `1`=on-at-center, `2`=moving up, `3`=moving down |

## Main functions
### `OnActivateGame(inst)`
*   **Description:** Activates the station: plays turn-on animation, starts looped background sound, enables all targets, initializes shooter, and sets targeting arrow to center position.
*   **Parameters:** `inst` (GGameEntity) — the station instance.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if already active; safe to call only once per activation cycle.

### `DoNextRound(inst)`
*   **Description:** Starts a new round by randomizing target activation: first 2 rounds select random enemies; round 3+ may include one friendly target. Marks targets as active.
*   **Parameters:** `inst` (GGameEntity) — the station instance.
*   **Returns:** Nothing.

### `DoEndOfRound(inst, success)`
*   **Description:** Ends the current round. If `success` is `false`, plays caw sounds and hit_wrong_target animation. Otherwise triggers next round. Clears round’s target sets.
*   **Parameters:** `inst` (GGameEntity), `success` (boolean) — `true` if all enemies hit, `false` if a friendly target was hit.
*   **Returns:** Nothing.

### `Server_OnUpdateAiming(inst, dt)`
*   **Description:** Server-side aiming update loop: advances aiming angle within min/max bounds and updates the `_arrow_state` network variable. Also updates client-side arrow rotation.
*   **Parameters:** `inst` (GGameEntity), `dt` (number) — delta time in seconds.
*   **Returns:** `angle` (number), `meterdirection` (number, ±1) — current angle in degrees and direction.

### `OnStartPlaying(inst)`
*   **Description:** Called when the minigame enters the `playing` state. Initializes round state, starts first round, and registers the aiming update loop.
*   **Parameters:** `inst` (GGameEntity).
*   **Returns:** Nothing.

### `OnStopPlaying(inst)`
*   **Description:** Called when the minigame ends. Clears round state, resets aiming, turns off all targets, and schedules reward spawning. Returns delay before rewards spawn.
*   **Parameters:** `inst` (GGameEntity).
*   **Returns:** number — delay (in seconds) before rewards should spawn.

### `SpawnRewards(inst)`
*   **Description:** Spawns a `carnival_prizeticket` for each point in `_minigame_score`, with 0.25s delay between each spawn.
*   **Parameters:** `inst` (GGameEntity).
*   **Returns:** number — total time taken to spawn all rewards (`0.25 * score` seconds).

### `OnShotHit(inst, projectile)`
*   **Description:** Event handler for `onshothit`. Detects if the projectile hit any target in the current round’s enemy or friendly sets, and notifies the target entity.
*   **Parameters:** `inst` (GGameEntity), `projectile` (GGameEntity).
*   **Returns:** Nothing.

### `station_NewObject(inst, obj)`
*   **Description:** Called when a new target or button is spawned via `objectspawner`. Registers a listener for the `carnivalgame_shooting_target_hit` event to score points or end the round on failure.
*   **Parameters:** `inst` (GGameEntity, station), `obj` (GGameEntity, target or button).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — initializes the round layout, sets rotation, spawns targets.
- **Listens to:** `carnivalgame_shooting_shoot` (on button) — fires projectile when pressed during active round.
- **Listens to:** `onshothit` (on station) — triggers `carnivalgame_shooting_target_hit` on targets within hit radius.
- **Listens to:** `carnivalgame_shooting_target_hit` (on station) — via `station_NewObject`, processes hit results per target.
- **Listens to:** `carnivalgame_endofround` (on projectiles) — ensures projectile cleanup if round ends early.
- **Listens to:** `_arrow_state_dirty` (client only) — synchronizes aiming arrow visual to networked state.

- **Pushes:** `carnivalgame_shooting_shoot` (on button) — triggers shoot action.
- **Pushes:** `carnivalgame_shooting_target_hit` (on targets) — notifies target it was hit.
- **Pushes:** `carnivalgame_endofround` (on station) — signals round completion.