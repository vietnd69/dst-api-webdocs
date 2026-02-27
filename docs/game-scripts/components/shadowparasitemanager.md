---
id: shadowparasitemanager
title: Shadowparasitemanager
description: Manages shadow parasite wave spawning logic, host creature spawning, and player-targeted parasitic events in the DST world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 4555e2b1
---

# Shadowparasitemanager

## Overview
This component coordinates shadow parasite events in the world, including spawning host creatures with parasite masks, managing floating parasites, triggering parasite waves based on rift activity and player proximity, and handling player join/leave states during wave preparation. It operates exclusively on the master simulation and coordinates with the rift spawner and player systems to execute timed, event-driven parasitic invasions.

## Dependencies & Tags
- Relies on `TheWorld.components.riftspawner` (via `GetShadowRift`).
- Uses `TheWorld.ismastersim` assertion.
- No explicit component additions or tag mutations on its host entity (`inst`).
- Internally tracks parasite instances and listens for their `onremove` events.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (none) | The host entity (typically `TheWorld`), set during construction. |
| `_activeplayers` | `table` | `{}` | Map of currently active players (`player = true`). |
| `_targetplayers` | `table` | `{}` | Map of players who triggered a pending parasite wave (`player = true`). |
| `_targetuserids` | `table` | `{}` | User IDs of players who left while a wave target; used to retroactively spawn waves upon rejoin. |
| `_parasites` | `table` | `{}` | Map of tracked parasite entities (`inst = true`). |
| `_floaters` | `table` | `{}` | Map of currently active floating parasite entities. |
| `num_waves` | `number` | `0` | Count of remaining/ready parasite waves. |
| `_WEIGHTED_HOSTS_TABLE` | `table` | modifiable | Mapping of host creature prefabs to spawn weights (e.g., `bunnyman = 0.4`). Populated from constants and modified at runtime based on world settings. |
| `_HOST_CAN_SPAWN_TEST` | `table` | modifiable | Map of host prefabs to predicate functions checking if they can spawn in the current world (e.g., via `TUNING` flags). |

## Main Functions

### `ApplyWorldSettings()`
* **Description:** Adjusts `_WEIGHTED_HOSTS_TABLE` by removing entries whose corresponding `HOST_CAN_SPAWN_TEST` function returns false (i.e., disabled via world tuning).
* **Parameters:** None.

### `OnPlayerJoined(player)`
* **Description:** Registers a player as active. If the player was marked as a pending target (e.g., left mid-wave), immediately spawns a parasite wave for them.
* **Parameters:** `player` (`Entity`) — The joining player entity.

### `OnPlayerLeft(player)`
* **Description:** Removes player from active list. If they were a pending target, records their `userid` in `_targetuserids` so waves can be replayed on rejoin.
* **Parameters:** `player` (`Entity`) — The leaving player entity.

### `AddParasiteToHost(host)`
* **Description:** Spawns a `shadow_thrall_parasitehat` item and gives/equips it to the provided host entity.
* **Parameters:** `host` (`Entity`) — The host creature to infect.
* **Returns:** `host`, `mask` — The host entity and the spawned mask item (for modding).

### `ChoseHostCreature()`
* **Description:** Selects a host creature prefab using the current weighted probability table.
* **Parameters:** None.
* **Returns:** `prefab` (`string?`) — Prefab name of the chosen host, or `nil` if no valid options.

### `SpawnHostCreature()`
* **Description:** Spawns a host creature at default location, equips it with a parasite mask, and triggers fade-in if available.
* **Parameters:** None.
* **Returns:** `host` (`Entity?`) — Spawned host entity, or `nil` on failure.

### `SpawnParasiteWaveForPlayer(player, joining)`
* **Description:** Spawns a randomized number (5–7) of host creatures near a player. If `joining` is true, adds a delayed combat target suggestion for the host.
* **Parameters:**
  - `player` (`Entity`) — Target player to spawn the wave near.
  - `joining` (`boolean`) — Whether this wave is triggered by a player rejoining; affects combat targeting logic.
* **Returns:** None.

### `OnRiftAddedToPool()`
* **Description:** Increments `num_waves` when a new rift is added, unless during world loading (`POPULATING`).
* **Parameters:** None.

### `GetShadowRift()`
* **Description:** Retrieves the first active rift with shadow affinity.
* **Parameters:** None.
* **Returns:** `rift` (`Entity?`) — The shadow rift entity, or `nil` if none exist.

### `DoParasiteGroupTalk()`
* **Description:** Plays a random chant sound for all active parasites with slight delays.
* **Parameters:** None.

### `StartTalkTask()`
* **Description:** Starts or restarts the periodic task for group chants, running every `TALK_PERIOD` seconds.
* **Parameters:** None.

### `StartTrackingParasite(parasite)`
* **Description:** Adds a parasite to the tracked list and sets up `onremove` cleanup. Starts the chant task if not already active.
* **Parameters:** `parasite` (`Entity`) — The parasite entity to track.

### `StopTrackingParasite(parasite)`
* **Description:** Removes parasite from tracking and cancels chant task if no parasites remain.
* **Parameters:** `parasite` (`Entity`) — The parasite entity to stop tracking.

### `OnFloaterRemoved(floater)`
* **Description:** Removes floater from tracking; triggers immediate wave spawn for all pending targets if no floaters remain.
* **Parameters:** `floater` (`Entity`) — The removed floater entity.

### `SpawnFloater(pos)`
* **Description:** Spawns a floating parasite near a position, plays sound, and sets up `onremove` listener.
* **Parameters:** `pos` (`Vector3`) — Position to spawn near.
* **Returns:** `floater` (`Entity?`) — Spawned floater, or `nil` if no valid spawn offset.

### `SpawnParasiteWaveForAllTargetPlayers()`
* **Description:** Spawns a wave for each player in `_targetplayers` and clears the list.
* **Parameters:** None.

### `BeginParasiteWave()`
* **Description:** Initiates a wave at the shadow rift’s position: spawns floaters if players are nearby, otherwise triggers direct spawning for target players.
* **Parameters:** None.

### `OverrideBlobSpawn(player)`
* **Description:** Conditionally replaces a blob spawn with parasite wave preparation for the player, if rift exists, hosts available, and luck roll succeeds.
* **Parameters:** `player` (`Entity`) — The player attempting blob spawn.
* **Returns:** `boolean` — `true` if parasite wave was triggered.

### `SpawnHostedPlayer(inst)`
* **Description:** Spawns a `player_hosted` entity, clones player skin and settings, and equips parasite mask.
* **Parameters:** `inst` (`Entity`) — Original player entity to copy from.
* **Returns:** `hosted` (`Entity?`) — The new hosted entity, or `nil`.

### `ReviveHosted(inst)`
* **Description:** Cleans up state for a parasite-hosted player (e.g., stops follower, drops combat target) and spawns a visual FX.
* **Parameters:** `inst` (`Entity`) — The parasite-hosted player entity.

### `OnSave()`
* **Description:** Serializes wave count and pending target user IDs for persistence.
* **Parameters:** None.
* **Returns:** `data` (`table?`) — Table with optional `num_waves` and `targetuserids`, or `nil` if empty.

### `OnLoad(data)`
* **Description:** Loads persisted wave count and target user IDs.
* **Parameters:** `data` (`table?`) — Saved data from `OnSave`.

### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners and cancels the chant task.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string summarizing current state: wave count, parasite counts, and targets.
* **Parameters:** None.
* **Returns:** `debug_str` (`string`) — Human-readable debug information.

## Events & Listeners
- Listens for:
  - `ms_playerjoined` → `OnPlayerJoined`
  - `ms_playerleft` → `OnPlayerLeft`
  - `ms_riftaddedtopool` → `OnRiftAddedToPool`
  - `onremove` (on tracked parasite and floater entities) → internal cleanup handlers
- Triggers no direct events itself; delegates to external callbacks (e.g., `SpawnFloater`, `DoParasiteGroupTalk`) for side effects.