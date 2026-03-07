---
id: malbatross
title: Malbatross
description: Manages the boss AI, combat behavior, and lifecycle events for the Malbatross boss entity in DST.
tags: [combat, ai, boss, flying]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2049ce5e
system_scope: entity
---

# Malbatross

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `malbatross` prefab defines a large, flying boss entity with complex behavior including aggro logic, dive/swoop/splash attacks, stolen-fish-triggered aggression, and periodic relocation. It integrates with multiple components: `combat` (for targeting and damage), `health` (hitpoints management), `sleeper` (entity sleep handling), `locomotor`, `lootdropper`, `timer`, `knownlocations`, and `entitytracker`. It also implements player-specific interaction logic—stealing fish and reacting to nearby fishing actions.

## Usage example
This is a server-side boss entity prefab; it is not typically added manually by modders. It is spawned via the world generation system, particularly in the Ocean, and its behavior is governed by its brain and internal stategraph. A minimal integration pattern in a mod might be:
```lua
local malbatross = SpawnPrefab("malbatross")
if malbatross ~= nil then
    malbatross.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `locomotor`, `health`, `combat`, `inventory`, `explosiveresist`, `sleeper`, `lootdropper`, `inspectable`, `timer`, `knownlocations`, `entitytracker`, `boatphysics` (via collision resolution), `workable`, `weapon`, `inventoryitem`, `locomotor`  
**Tags added:** `malbatross`, `epic`, `noepicmusic`, `animal`, `scarytoprey`, `largecreature`, `flying`, `ignorewalkableplatformdrowning`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_isengaged` | `net_bool` | `nil` | Networked boolean indicating whether the boss is currently engaged (attacking a player). |
| `_playingmusic` | `boolean` | `false` | Internal flag indicating if boss-related music is playing. |
| `_musictask` | `Task` | `nil` | Periodic task that triggers music logic every 1 second when engaged. |
| `recentlycharged` | `table` | `{}` | Stores recently collided entities to prevent repeated charge hits. |
| `feathers` | `number` | `0` | Total feather count spawned by this entity (saved/loaded). |
| `_stolen_fish_count` | `number` | `0` | Number of fish stolen from players. Triggers aggro above `MALBATROSS_STOLENFISH_AGGROCOUNT`. |
| `_activeplayers` | `array` | `{}` | List of players currently tracked for fishing interactions. |
| `_OnPlayerAction` | `function` | — | Bound handler for player fishing actions. |
| `readytoswoop` | `boolean` | `true` | Indicates if a swoop attack is available. |
| `readytosplash` | `boolean` | `true` | Indicates if a splash attack is available. |
| `willswoop` | `boolean` | `false` | Set to `true` when health drops to ≤33%. |
| `willdive` | `boolean` | `false` | Set to `true` when health drops to ≤66%. |
| `readytodive` | `boolean` | `false` | Internal state indicating dive readiness (triggered after `divetask`). |
| `divetask` | `Task` | `nil` | Task that resets when an attack occurs (used for dive timer reset). |
| `staredown` | `any` | `nil` | Temporary variable used for staring down a target. |

## Main functions
### `Relocate()`
*   **Description:** Resets the Malbatross: cancels combat engagement, restores health to full, resets stolen fish counter, and calls `TheWorld.components.malbatrossspawner:Relocate(inst)` if available. Used for boss respawns or post-death repositioning.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RetargetFn(inst)`
*   **Description:** Function passed to `combat:SetRetargetFunction`. Selects a new target within `TARGET_DIST` (16 units) that is valid for combat and either is targeting the Malbatross or is within proximity (`range + 8`).
*   **Parameters:** `inst` (Entity) — the Malbatross instance.
*   **Returns:** `Entity?` — the chosen target, or `nil`.

### `KeepTargetFn(inst, target)`
*   **Description:** Function passed to `combat:SetKeepTargetFunction`. Determines if the Malbatross should retain its current target. Returns `false` if the target is too far (> `TUNING.MALBATROSS_MAX_CHASEAWAY_DIST`) from the remembered "home" location.
*   **Parameters:**  
    *   `inst` (Entity) — the Malbatross instance.  
    *   `target` (Entity) — the current target.
*   **Returns:** `boolean` — whether to keep targeting the entity.

### `spawnwaves(...)`
*   **Description:** Spawns a group of attack waves (typically `wave_med`) centered on the Malbatross. Configurable via parameters like wave count, spread angle, speed, and starting offset.
*   **Parameters:**  
    *   `numWaves` (number) — number of waves to spawn.  
    *   `totalAngle` (number) — total angular spread in radians.  
    *   `waveSpeed` (number) — speed of each wave.  
    *   `wavePrefab` (string) — prefab name for the wave entity.  
    *   `initialOffset` (Vector3?) — optional offset from center.  
    *   `idleTime` (number) — seconds between wave spawns.  
    *   `instantActivate` (boolean?) — if `true`, activate immediately.  
    *   `random_angle` (boolean?) — if `true`, ignore Malbatross facing and use random angle.
*   **Returns:** Nothing.

### `spawnfeather(inst, time?)`
*   **Description:** Spawns a falling `malbatross_feather_fall` prefab at a randomized position around the Malbatross.
*   **Parameters:**  
    *   `inst` (Entity) — the Malbatross instance (used for position).  
    *   `time` (number?) — optional animation offset (multiplied by `79 * FRAMES`).
*   **Returns:** Nothing. Increments `inst.feathers` counter.

### `resetdivetask(inst)`
*   **Description:** Restarts the `"divetask"` timer (10 seconds). Sets `readytodive` to `true` when the timer fires. Called when the Malbatross is attacked.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `TryDisengage()`
*   **Description:** Starts a `"disengage"` timer (2 seconds). When the timer fires, if no combat target is active, sets engaged status to `false`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    *   `"attacked"` → `OnAttacked` — handles retaliation, home location memory, feather spawning, and dive reset.  
    *   `"healthdelta"` → `OnHealthChange` — sets `willdive` and `willswoop` flags based on health thresholds.  
    *   `"death"` → `OnDead` — cancels ongoing tasks, sets `isengaged` to `false`.  
    *   `"onremove"` → `OnRemove` — fires `"malbatrossremoved"` world event.  
    *   `"newcombattarget"` → `OnNewTarget` — adds `death` callback to new target, sets engaged status for players.  
    *   `"entitysleep"` → `OnEntitySleep` — starts `"sleeping_relocate"` timer.  
    *   `"entitywake"` → `OnEntityWake` — stops `"sleeping_relocate"` timer.  
    *   `"timerdone"` → `OnTimerDone` — handles `sleeping_relocate`, `divetask`, and `disengage`.  
    *   `"losttarget"` → `OnLostTarget` — clears `staredown`.  
    *   `"droppedtarget"` → `OnDroppedTarget` — removes death listener and calls `TryDisengage`.  
    *   `"performaction"` (on each player) → `_OnPlayerAction` (bound) — detects fishing actions to steal fish and trigger aggro.  
    *   `"ms_playerjoined"` / `"ms_playerleft"` — tracks active players.
- **Pushes:**  
    *   `"malbatrossremoved"` (via `OnRemove`)  
    *   `"isengageddirty"` (via `net_bool` updates to `_isengaged`)