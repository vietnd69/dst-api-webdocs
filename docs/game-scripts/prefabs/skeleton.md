---
id: skeleton
title: Skeleton
description: Manages the creation, behavior, and decay of skeleton entities, distinguishing between generic environmental skeletons and player skeletons with avatar data and save/load persistence.
tags: [entity, decay, loot, player]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4ff8348f
system_scope: entity
---

# Skeleton

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `skeleton` prefab defines behavior for skeletal remains in the world, handling both generic creature skeletons and player skeletons (including those of players killed in PK situations). It integrates with multiple components: `inspectable` for UI description display, `lootdropper` for loot generation, and `workable` for the hammering interaction. Player skeletons support avatar data persistence, time-based decay, and save/load serialization via custom callbacks. The prefab implements two distinct spawns: `skeleton` (generic), `skeleton_player` (player-specific), and associated creature variants.

## Usage example
```lua
-- Spawn a generic skeleton
local skel = SpawnPrefab("skeleton")
skel.Transform:SetPosition(x, y, z)

-- Spawn a player skeleton and populate its data
local player_skel = SpawnPrefab("skeleton_player")
player_skel.SetSkeletonDescription(player_skel, "winston", "Winston", "died", nil, "12345")
player_skel.SetSkeletonAvatarData(player_skel, {
    name = "Winston",
    equip = { body = "winston_body" },
})
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `playeravatardata`, `workable`, `transform`, `animstate`, `network`, `soundemitter`, `smallobstaclephysics`  
**Tags added:** `skeleton`, `playerskeleton` (only for `skeleton_player`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animnum` | number | `math.random(1, 6)` for regular, `7–8` for creature | Selected idle animation index (e.g., `1`→"idle1"). |
| `scrapbook_anim` | string | `"idle<animnum>"` | Animation name used in scrapbook UI. |
| `char`, `playername`, `userid`, `pkname`, `cause` | string / nil | `nil` | Player identity and death metadata for player skeletons. |
| `skeletonspawntime` | number | `GetTime()` (on creation) | Timestamp when the skeleton spawned; used for decay. |
| `scrapbook_proxy` | string | `"skeleton"` or `"skeleton_notplayer"` | Prefab name used for scrapbook grouping. |

## Main functions
### `Player_Decay(inst)`
* **Description:** Removes the skeleton and spawns ash and a small collapse effect at its location. Used for player skeleton expiration.
* **Parameters:** `inst` (entity) — the skeleton entity.
* **Returns:** Nothing.
* **Error states:** None; always performs cleanup.

### `Player_SetSkeletonDescription(inst, char, playername, cause, pkname, userid)`
* **Description:** Stores player death metadata and sets a special description function for inspection.
* **Parameters:**  
  `char` (string) — character name (e.g., "wilton").  
  `playername` (string) — display name of the player.  
  `cause` (string) — cause of death (e.g., "killed by a spider").  
  `pkname` (string or nil) — if non-nil, indicates a PK death and suppresses cause storage.  
  `userid` (string) — unique player ID.  
* **Returns:** Nothing.
* **Error states:** `cause` is set to `nil` if `pkname` is present.

### `Player_SetSkeletonAvatarData(inst, client_obj)`
* **Description:** Delegates to `playeravatardata:SetData()` to populate UI display strings for the skeleton (e.g., name, skin, equipment).
* **Parameters:** `inst` (entity), `client_obj` (table) — client-side avatar data.
* **Returns:** Nothing.

### `OnHammered(inst)`
* **Description:** Triggered when a player finishes hammering the skeleton. Drops loot, spawns a collapse FX, and removes the entity.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Stores the selected animation number (`animnum`) into the save table.
* **Parameters:** `inst` (entity), `data` (table).
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores the animation if present; if player skeletons are disabled world-wide, immediately removes the skeleton and spawns a shallow grave.
* **Parameters:** `inst` (entity), `data` (table or nil).
* **Returns:** Nothing.

### `Player_OnSave(inst, data)`
* **Description:** Extends `OnSave` to persist player-specific metadata and skeleton age.
* **Parameters:** `inst` (entity), `data` (table).
* **Returns:** Nothing.

### `Player_OnLoad(inst, data)`
* **Description:** Restores player skeleton metadata and avatar data; sets decay start time from `data.age` if provided.
* **Parameters:** `inst` (entity), `data` (table or nil).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly via `inst:ListenForEvent`.  
- **Pushes:**  
  `"ms_skeletonspawn"` — fired once during `skeleton_player` creation on the master (server) simulation to notify the world of a new player skeleton.