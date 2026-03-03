---
id: birdspawner
title: Birdspawner
description: Manages the spawning and behavior of birds in the game world, including timed spawning for players, lunar hail event responses, and dynamic environmental adjustments.
tags: [environment, spawning, weather, ai]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 98229fed
system_scope: environment
---

# Birdspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Birdspawner` orchestrates the spawning of birds and bird corpses across the world based on player presence, tile type, weather, and game state. It supports dynamic spawn timing, environmental modifiers (e.g., rain, post-hail), and special lunar hail events that suspend normal bird spawns in favor of corpse drops and mutations. The component is **server-only** (`ismastersim` required) and integrates with player-specific scheduling, sound managers, and time-scale modifiers.

Key interactions include:
- Listening to world state changes (`islunarhailing`, `israining`, `isnight`)
- Coordinating lunar hail event timers and announcements
- Adjusting spawn behavior via bird attractors and modifiers
- Supporting corpse fade/gestalt timers and mutation logic

## Usage example
```lua
-- Typically added automatically to `TheWorld` instance
-- Manual usage in a mod world generator:
inst:AddComponent("birdspawner")
inst.components.birdspawner:ToggleUpdate() -- Force re-evaluation of spawn state

-- For modders: customize bird types per tile
inst.components.birdspawner:SetBirdTypesForTile(WORLD_TILES.GRASS, {"robin", "canary"})
inst.components.birdspawner:SetTimeScaleModifier(0.5, "customfactor")
```

## Dependencies & tags
**Components used:** `lunarhailbirdsoundmanager`, `moonstorms`, `eater`, `inventoryitem`, `floater`, `trap`, `bait`, `timer`, `talker`  
**Tags:** Checks `birdcorpse`, `bird`, `scarecrow`, `scarytoprey`, `birdblocker`, `INLIMBO`, `outofreach`, `carnivaldecor`, `carnivaldecor_ranker`, `bird`  
**Tags added:** None (only reads)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The owning entity instance (`TheWorld`). Public for convenience. |
| `_activeplayers` | array of `Entity` | `{}` | List of active players to schedule spawns for. Private. |
| `_scheduledtasks` | table | `{}` | Tracks pending task handles keyed by player. Private. |
| `_birds` | table | `{}` | Tracks tracked birds (keys = entity references). Private. |
| `_maxbirds` | number | `TUNING.BIRD_SPAWN_MAX` | Max birds allowed per player range. |
| `_minspawndelay`, `_maxspawndelay` | number | `TUNING.BIRD_SPAWN_DELAY` | Base spawn delay range (seconds). |
| `_ishailing` | boolean | `false` | Whether a lunar hail is active. |
| `_timescale_modifiers` | `SourceModifierList` | — | Aggregates modifiers affecting spawn rate scaling. |

## Main functions
### `GetSpawnPoint(pt, is_corpse)`
* **Description:** Finds a valid spawn position near `pt` using a fan search, respecting passability, creeps, moonstorms, and bird blockers. Used by `SpawnBird` and `SpawnCorpse`.
* **Parameters:**  
  - `pt` (`Vector3`) — Base position (typically a player’s location).  
  - `is_corpse` (`boolean`) — If `true`, ignores moonstorms and creep (corpses are not subject to these restrictions).
* **Returns:** `Vector3` or `nil` — Valid spawn position or `nil` if none found.
* **Error states:** Returns `nil` if no valid point found within search radius or if `TheWorld.Map:IsPointInWagPunkArenaAndBarrierIsUp` is true.

### `SpawnBird(spawnpoint, ignorebait)`
* **Description:** Spawns a randomly selected bird prefab at `spawnpoint`, considering bait/trap proximity and danger avoidance. Returns the spawned entity.
* **Parameters:**  
  - `spawnpoint` (`Vector3`) — Spawn coordinates.  
  - `ignorebait` (`boolean`) — If `true`, ignores bait and trap interactions.
* **Returns:** `Entity` (the spawned bird prefab) or `nil`.
* **Behavior:**  
  - Calls `PickBird` to select a prefab based on tile, event, and mutation chance.  
  - Attempts to relocate spawn to nearby bait (if eatable and safe) or traps (if set and eligible).  
  - Teleports bird to final position (sets `y` to `15` if `bird` tag present).

### `SpawnCorpseForPlayer(player)`
* **Description:** Attempts to spawn a bird corpse for a given player, respecting max corpse limit and spawn point validity. Used internally and exposed for tools/mods.
* **Parameters:**  
  - `player` (`Entity`) — Player who may be affected by the event.
* **Returns:** `Entity` (corpse) or `nil`.
* **Behavior:**  
  - Checks for existing nearby corpses (within `64` range, tag `birdcorpse`) vs `_maxcorpses`.  
  - If below limit, spawns corpse via `SpawnBirdCorpse`, then applies fade or mutation timers.

### `ToggleUpdate(force)`
* **Description:** Enables or disables bird spawning based on current conditions (`isnight`, `_maxbirds > 0`, lunar hail state). Forces rescheduling if `force = true`.
* **Parameters:** `force` (`boolean`) — Whether to cancel and reschedule all pending tasks.
* **Returns:** Nothing.

### `SetBirdTypesForTile(tile_id, bird_list)`
* **Description:** **Mod API** — Overrides the default list of birds for a given tile type.
* **Parameters:**  
  - `tile_id` (`number`) — Tile constant (e.g., `WORLD_TILES.GRASS`).  
  - `bird_list` (`table` of strings) — List of prefab names (e.g., `{"robin", "canary"}`).
* **Returns:** Nothing.

### `SetTimeScaleModifier(factor, key)`
* **Description:** **Mod API** — Adds a time-scale modifier (e.g., for world settings) using multiplicative factor. Modifiers accumulate via `_timescale_modifiers`.
* **Parameters:**  
  - `factor` (`number`) — Multiplier applied to spawn delays.  
  - `key` (`string`) — Unique identifier for the modifier.
* **Returns:** Nothing.

### `RemoveTimeScaleModifier(key)`
* **Description:** **Mod API** — Removes a previously added time-scale modifier.
* **Parameters:** `key` (`string`) — The modifier identifier.
* **Returns:** Nothing.

### `StartTracking(target)`
* **Description:** Begins tracking a bird entity (e.g., to auto-remove if asleep). Stores whether the entity should persist before temporarily disabling persistence.
* **Parameters:** `target` (`Entity`) — Bird entity to track.
* **Returns:** Nothing.

### `StopTracking(target)`
* **Description:** Reverses `StartTracking`, restoring the entity’s persistence state.
* **Parameters:** `target` (`Entity`) — Bird entity to untrack.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted debug string with bird count, time-scale multiplier, and post-hail easing multiplier.
* **Returns:** `string` — Example: `"birds:3/10, time scale modifier:1.20, post hail easing mult: 0.250"`

## Events & listeners
- **Listens to:**  
  - `ms_playerjoined` — Adds new player to active list and schedules initial spawn.  
  - `ms_playerleft` — Cancels scheduled tasks for leaving player.  
  - `"timerdone"` (via `TheWorld`) — Handles lunar hail event phases (`SOUNDS`, `CORPSES`, `RETURN_BIRD_AMBIENCE`).  
  - `"entitysleep"` — Removes sleeping tracked birds.
- **Pushes:** None (does not fire custom events).
- **World state watchers:**  
  - `islunarhailing` — Triggers lunar hail event timers, updates spawn state.  
  - `israining` — Applies rain spawn penalty.  
  - `isnight` — Toggles update behavior (no spawns at night).

### Key timers used (via `inst.components.timer`)
- `prelunarhailbird`: Plays caws/sounds before event (`0.75 * event_time`)
- `lunarhailbird`: Drops corpses at `event_time`
- `posthailbird`: Post-event recovery phase (`_posthail_time`)
- `returnbirdambience`: Restores ambient bird sounds after recovery (`5/6 * _posthail_time`)
