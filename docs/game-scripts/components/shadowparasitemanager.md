---
id: shadowparasitemanager
title: Shadowparasitemanager
description: Manages shadow parasite waves and host spawning for the Shadow Thrall mechanic during rift events.
tags: [combat, boss, rift, wave, world]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4555e2b1
system_scope: world
---
# Shadowparasitemanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ShadowParasitemanager` orchestrates the Shadow Thrall boss encounter in DST. It tracks active players, manages parasite wave spawning (via hosted creatures like Rocky, Bunnyman, or spiders), coordinates floating parasitefx spawns during rift events, and handles player rejoining/leaving logic. It is instantiated only on the master simulation and interacts closely with the `riftspawner`, `combat`, `inventory`, `spawnfader`, `skinner`, and `follower` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shadowparasitemanager")

-- When rifts spawn, this component is triggered automatically via "ms_riftaddedtopool".
-- It responds to player joins/leaves and spawns waves as needed.
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `herdmember`, `inventory`, `riftspawner`, `skinner`, `spawnfader`  
**Tags:** Checks `shadowthrall_parasite_mask`; adds `NOCLICK` to floaters.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_activeplayers` | table | `{}` | Map of active player entities → `true` |
| `_targetplayers` | table | `{}` | Map of players → `true` who should trigger waves |
| `_targetuserids` | table | `{}` | Map of userids → `true` for players who left while targeted |
| `_parasites` | table | `{}` | Map of parasite entities → `true` currently tracked |
| `_floaters` | table | `{}` | Map of floating parasitefx entities → `true` |
| `num_waves` | number | `0` | Count of pending parasite waves |
| `_WEIGHTED_HOSTS_TABLE` | table | `WEIGHTED_HOSTS_TABLE` | Mod-accessible map of host prefabs to spawn weights |
| `_HOST_CAN_SPAWN_TEST` | table | `HOST_CAN_SPAWN_TEST` | Mod-accessible map of host prefabs to condition functions |

## Main functions
### `ApplyWorldSettings()`
* **Description:** Removes disabled host creatures from `_WEIGHTED_HOSTS_TABLE` based on world settings (e.g., `TUNING.ROCKYHERD_SPAWNER_DENSITY`).  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** None.

### `OnPlayerJoined(player)`
* **Description:** Registers a new player and immediately spawns a parasite wave for them if they were previously targeted.  
* **Parameters:** `player` (entity) – the joining player entity.  
* **Returns:** Nothing.  
* **Error states:** Returns early if player is already tracked.

### `OnPlayerLeft(player)`
* **Description:** Removes a player from `_activeplayers` and marks them as a target (or stores their userid) if a wave was pending.  
* **Parameters:** `player` (entity) – the leaving player entity.  
* **Returns:** Nothing.  
* **Error states:** Returns early if player is not tracked.

### `AddParasiteToHost(host)`
* **Description:** Equips a `shadow_thrall_parasitehat` item on the given host entity.  
* **Parameters:** `host` (entity) – the host creature to infect.  
* **Returns:** `host`, `mask` (both entities) – mask returned for modder use.  
* **Error states:** None.

### `SpawnParasiteWaveForPlayer(player, joining)`
* **Description:** Spawns 5–7 parasite-host creatures near the player, assigns them combat target.  
* **Parameters:**  
  - `player` (entity) – the target player.  
  - `joining` (boolean) – if true, delays target suggestion by `JOIN_TARGET_DELAY`.  
* **Returns:** Nothing.  
* **Error states:** Returns early if no shadow rift exists.

### `GetShadowRift()`
* **Description:** Returns the first shadow-affinity rift from `riftspawner`.  
* **Parameters:** None.  
* **Returns:** entity or `nil` – the rift entity, or `nil` if none exist or ` riftspawner` is absent.  
* **Error states:** Returns `nil` if rift spawner is missing or no shadow rifts exist.

### `BeginParasiteWave()`
* **Description:** Decrements `num_waves` and either spawns floating parasites (if players are nearby) or triggers wave spawning for all targeted players.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** Returns early if no rift exists.

### `OverrideBlobSpawn(player)`
* **Description:** Probabilistically overrides a normal blob spawn with a Shadow Thrall encounter if a wave is pending. Marks the player as targeted and initiates a wave if no floaters are active.  
* **Parameters:** `player` (entity) – the player who may spawn a blob.  
* **Returns:** `true` if parasite wave is queued; `false` otherwise.  
* **Error states:** Returns `false` if no rift exists, no hosts available, or luck roll fails.

### `SpawnHostedPlayer(inst)`
* **Description:** Spawns a `player_hosted` entity and copies skins, userid, and other metadata from the original player `inst`.  
* **Parameters:** `inst` (entity) – the original player instance to replicate.  
* **Returns:** hosted entity or `nil`.  
* **Error states:** Returns `nil` if `SpawnPrefab("player_hosted")` fails.

### `ReviveHosted(inst)`
* **Description:** Handles reviving a hosted player entity: resets death flag, stops following/targeting, and spawns a fx entity.  
* **Parameters:** `inst` (entity) – the hosted parasite entity.  
* **Returns:** Nothing.  
* **Error states:** None.

### `OnSave()`
* **Description:** Serializes state (`num_waves`, target player userids) for saving.  
* **Parameters:** None.  
* **Returns:** table or `nil` – save data if non-empty.  

### `OnLoad(data)`
* **Description:** Restores state from save data.  
* **Parameters:** `data` (table or `nil`) – saved data.  
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable status string for debug display.  
* **Parameters:** None.  
* **Returns:** string – formatted wave/parasite/target counts.

## Events & listeners
- **Listens to:**  
  - `ms_playerjoined` – calls `OnPlayerJoined`  
  - `ms_playerleft` – calls `OnPlayerLeft`  
  - `ms_riftaddedtopool` – calls `OnRiftAddedToPool`  
  - `onremove` on parasite/floater entities – triggers tracking cleanup  
- **Pushes:** None (no `PushEvent` calls found).
