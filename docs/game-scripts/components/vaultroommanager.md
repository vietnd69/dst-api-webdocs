---
id: vaultroommanager
title: Vaultroommanager
description: Manages the layout, state, and teleportation logic for the Vault dungeon, including room connections, marker registration, player tracking, and randomization.
tags: [vault, mapping, teleport, world]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 6f35ae33
system_scope: world
---
# Vaultroommanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Vaultroommanager` is a world-scoped component responsible for orchestrating the entire Vault dungeon system. It handles the dynamic layout generation (including directional shuffling), room loading/unloading, teleporter configuration and repair/break states, player entry/exit tracking, and synchronization of the Vault's visual state with the game world. It interacts closely with `vault_teleporter`, `vaultroom`, and `archivemanager` components to manage transitions and persistence.

## Usage example
```lua
-- Typically added to TheWorld in the world initialization script
TheWorld:AddComponent("vaultroommanager")

-- Example: Teleport to a specific room
TheWorld.components.vaultroommanager:SetRoom("teleport1")

-- Example: Get current room index
local currentRoomIndex = TheWorld.components.vaultroommanager.roomindex
```

## Dependencies & tags
**Components used:** `archivemanager`, `channelable`, `drownable`, `follower`, `inventory`, `inventoryitem`, `leader`, `vault_teleporter`, `vaultroom`  
**Tags:** Adds `vaultroommanager` to `TheWorld`; checks and removes no explicit tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rooms` | table | `{}` | A lookup table mapping both `roomid` (string) and `roomindex` (number) to room metadata. |
| `roomindex` | number | `0` | Current room index (integer) the Vault is set to. `0` indicates no room (e.g., lobby only). |
| `maxroomindex` | number | `0` | Highest declared room index in the current layout (used for deterministic shuffling). |
| `markers` | table | `{}` | Stores registered vault marker entities keyed by prefab name (e.g., `"vaultmarker_vault_center"`). |
| `teleporters` | table | `{}` | Stores active `vault_teleporter` prefabs keyed by direction (`"lobby"`, `1`–`4`). |
| `repairedlinks` | table | `{}` | Tracks which links in which rooms have been repaired (map of `{roomid = {direction = true}}`). |
| `players` | table | `{}` | Tracks players currently inside the Vault room (`{[player] = true}`). |
| `playersinvault` | number | `0` | Count of players currently inside the Vault room. |
| `version` | number | `2` | Layout version used (V1 or V2). |
| `seed` | number | `INITIAL_SEED` | Seed used for the PRNG that drives directional shuffling. |
| `archivespowered` | boolean? | `nil` | Whether the Archives are powered (controls lobby teleporter state). |

## Main functions
### `DeclareRoom(roomid, roomindex)`
*   **Description:** Registers a room with a unique `roomindex`. Required before linking rooms to maintain deterministic PRNG behavior.  
*   **Parameters:**  
    - `roomid` (string): Unique room identifier.  
    - `roomindex` (number): Unique sequential index (starting from 1). Must equal `maxroomindex + 1` at declaration time.  
*   **Returns:** Nothing.

### `LinkRooms(roomid, direction, linkedroom, linkeddirection)`
*   **Description:** Creates a bidirectional link between two rooms. Automatically marks links to `"lobby"` as rigid.  
*   **Parameters:**  
    - `roomid` (string): Source room ID.  
    - `direction` (number): Index into `DIRECTIONS_INDEX` (1=N, 2=E, 3=S, 4=W).  
    - `linkedroom` (string): Target room ID (e.g., `"lobby"`).  
    - `linkeddirection` (number? or `nil`): Target room's opposite direction (if any).  
*   **Returns:** `link` (table) — Metadata about the connection.  
*   **Error states:** Throws an assertion if `roomid` or `linkedroom` is not declared, or if linking to `"lobby"` in a direction other than South.

### `CreateLayout(version)`
*   **Description:** Initializes the Vault layout by calling `DeleteLayout()` and then generating either `CreateLayoutV1()` or `CreateLayoutV2()`.  
*   **Parameters:**  
    - `version` (number): `1` or `2`.  
*   **Returns:** Nothing.

### `HideRoom()`
*   **Description:** Unloads the current Vault room (preserving its data in memory) and clears all teleporter exits.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `ShowRoom()`
*   **Description:** Reloads the current Vault room (if saved data exists) and configures all teleporter exits. Teleports pending entities to the center marker.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `SetRoom(roomindexorid)`
*   **Description:** Transitions the Vault to a new room (by index or ID). Handles full hide → show sequence.  
*   **Parameters:**  
    - `roomindexorid` (string or number): Room ID or index. `nil` transitions to the default (lobby-only) state.  
*   **Returns:** Nothing.

### `OnRegisterVaultMarker(ent)`
*   **Description:** Registers a vault marker entity (e.g., `"vaultmarker_vault_center"`) and validates that all required markers are present to start/continue operation.  
*   **Parameters:**  
    - `ent` (Entity): The marker entity.  
*   **Returns:** Nothing.

### `OnUnregisterVaultMarker(ent)`
*   **Description:** Removes a vault marker and triggers re-validation.  
*   **Parameters:**  
    - `ent` (Entity): The marker entity being removed.  
*   **Returns:** Nothing.

### `TrackPlayer(player)`
*   **Description:** Adds a player to the set of players currently in the Vault, incrementing `playersinvault`.  
*   **Parameters:**  
    - `player` (Entity): Player entity.  
*   **Returns:** Nothing.

### `StopTrackingPlayer(player)`
*   **Description:** Removes a player from the Vault player set. If count reaches zero, marks the Vault for auto-rotation or reload.  
*   **Parameters:**  
    - `player` (Entity): Player entity.  
*   **Returns:** Nothing.

### `TeleportEntities(toteleportents, targetteleportmarkername)`
*   **Description:** Moves a list of entities to positions around the target marker (random circular distribution). Handles physics-based teleportation and updates drownable teleport points.  
*   **Parameters:**  
    - `toteleportents` (table): List of entities to teleport.  
    - `targetteleportmarkername` (string): Marker prefab name (e.g., `"vaultmarker_vault_north"`).  
*   **Returns:** Nothing.

### `OnVaultTeleporterChannelStart(teleporter, doer)`
*   **Description:** Handles the start of a channeling event at a teleporter. Manages player count accumulation and initiates the teleport sequence when all players are ready.  
*   **Parameters:**  
    - `teleporter` (Entity): The `vault_teleporter` entity.  
    - `doer` (Entity): The player/channeling actor.  
*   **Returns:** Nothing.

### `TryStartTeleportSequence(teleporter, roomid, targetteleportmarkername)`
*   **Description:** Begins the synchronized teleport sequence for all players. Establishes a pending state and triggers `vault_teleport` events.  
*   **Parameters:**  
    - `teleporter` (Entity): The teleporter involved.  
    - `roomid` (string): Target room ID.  
    - `targetteleportmarkername` (string): Target marker name.  
*   **Returns:** `true` if the sequence was started, `false` if another sequence is already pending.

### `GetLobbyToVaultTeleporter()`
*   **Description:** Returns (and lazily creates) the dedicated teleporter for lobby ↔ vault transitions.  
*   **Parameters:** None.  
*   **Returns:** `vault_teleporter` entity.

### `OnUpdate(dt)`
*   **Description:** Main logic loop (runs at 1-second intervals). Handles player tracking, auto-rotation of rooms when empty, resetting the Vault, and updating teleporter states.  
*   **Parameters:**  
    - `dt` (number): Delta time in seconds.  
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes the Vault’s state (layout, room data, repaired links, PRNG seed) for world saving.  
*   **Parameters:** None.  
*   **Returns:** `data` (table) — Serializable state object.

### `OnLoad(data)`
*   **Description:** Restores Vault state from world save. Handles layout version upgrades and PRNG state restoration.  
*   **Parameters:**  
    - `data` (table): Deserialized save data.  
*   **Returns:** Nothing.

### `OnPostInit()`
*   **Description:** Ensures static layouts (e.g., `Vault_Lobby`, `Vault_Vault`) are placed exactly once per world creation.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    - `"ms_register_vault_marker"` — Registers a vault marker entity.  
    - `"ms_unregister_vault_marker"` — Removes a vault marker entity.  
    - `"ms_vault_teleporter_channel_start"` — Begins teleporter channeling.  
    - `"ms_vault_teleporter_channel_stop"` — Stops teleporter channeling.  
    - `"ms_vault_teleporter_repair"` / `"ms_vault_teleporter_break"` — Updates link states.  
    - `"ms_register_vault_lobby_exit"` / `"ms_register_vault_lobby_exit_target"` — Sets up lobby exit portal linking.  
    - `"arhivepoweron"` / `"arhivepoweroff"` — Controls lobby teleporter power state.  
    - `"resetruins"` — Triggers full Vault reset.  
    - `"ms_playerjoined"` — Tracks new players entering the world.  

- **Pushes:**  
    - `"ms_vaultroom_vault_playerentered"` — Fired when a player enters the Vault.  
    - `"ms_vaultroom_vault_playerleft"` — Fired when a player leaves the Vault.  
    - `"newvaultteleporterroomid"` — Fired via `vault_teleporter` when its target room ID changes.
