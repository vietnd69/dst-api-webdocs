---
id: vaultroommanager
title: Vaultroommanager
description: Manages the vault’s room layout, teleporter setup, player tracking, and dynamic room transitions during gameplay.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 6f35ae33
---

# Vaultroommanager

## Overview
The `VaultRoomManager` is a world-scoped component responsible for managing the structure and state of the Vault—a procedurally shuffled network of interconnected rooms. It handles layout generation (V1 and V2), teleporter creation and state (broken/repaired), room loading/unloading, player entry/exit tracking, and seasonal reset logic. It operates exclusively on the master simulation and coordinates with vault markers, teleporters, and lobby/exit entities to enable seamless transitions.

## Dependencies & Tags
- The component is attached to an entity that has world-scoped `TheWorld` access (`TheWorld` must be the master).
- Asserts presence on the server: `assert(_world.ismastersim, ...)`.
- Registers for vault-related events (`ms_register_vault_marker`, `ms_vault_teleporter_channel_start`, etc.) via `inst:ListenForEvent`.
- Uses the `obj_layout` module for static layout placement.
- Relies on the following components on other entities:
  - `vaultroom` (on center markers)
  - `vault_teleporter` (on teleporter prefabs)
  - `vaultcollision` (spawned for lobby/vault zones)
  - `drownable`, `leader`, `inventory`, `inventoryitem`, `follower` (used during teleportation)

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rooms` | `table` | `{}` | Map of room data by ID or index. Each room stores `roomid`, `roomindex`, `links`, and optionally `vaultroomdata`. |
| `roomindex` | `number` | `0` | Current room index the player(s) are in. |
| `maxroomindex` | `number` | `0` | Highest assigned room index (used for deterministic layout generation). |
| `markers` | `table` | `{}` | Map of vault marker prefabs (e.g., `"vaultmarker_vault_center"`) to their entity instances. |
| `teleporters` | `table` | `{}` | Map of directions (1–4 or `"lobby"`) to instantiated `vault_teleporter` entities. |
| `repairedlinks` | `table` | `{}` | Tracks which links in each room have been repaired (keyed by `roomid` → `{direction = true}`). |
| `players` | `table` | `{}` | Set of players currently inside the vault. |
| `playersinvault` | `number` | `0` | Count of players currently in the vault. |
| `UPDATE_TICK_TIME` | `number` | `1` | Minimum seconds between updates in `OnUpdate`. |
| `UPDATE_ROTATE_ROOMS_COOLDOWN_TICKS_COUNT` | `number` | `10` | Duration (in ticks) before attempting room rotation when no players are in vault. |
| `updaterotatecooldownticks` | `number` | `10` | Remaining ticks before next room rotation attempt (when vault is empty). |
| `archivemanager` | `?` | `nil` | Reference to archive power state (controlled via `arhivepoweron/off` events). |
| `lobbyexit` | `?` | `nil` | Lobby exit entity (`vaultlobbyexit`), if present. |
| `lobbyexittarget` | `?` | `nil` | Lobby exit target entity (e.g., Archive Portal), if present. |
| `seed` | `number` | Hashed session ID | Random seed for deterministic PRNG-based layout shuffling. |
| `PRNG` | `PRNG_Uniform` | Instance | Pseudo-random number generator used to shuffle room directions. |
| `version` | `number` | `2` | Layout version currently in use (V1 or V2). |
| `resetting` | `?` | `nil` | Flag indicating a vault reset is in progress. |
| `_needsreloaded` | `?` | `nil` | Flag indicating the current room should be reloaded when empty. |
| `_pendingtp` | `?` | `nil` | Table of players waiting to teleport (used during coordinated multi-player teleport sequences). |

## Main Functions

### `DeclareRoom(roomid, roomindex)`
* **Description:** Registers a new room with a unique ID and sequential index. Stores metadata for layout/teleportation. Requires unique, increasing `roomindex` for deterministic layout generation.
* **Parameters:**
  - `roomid` (`string`): Unique identifier for the room (e.g., `"mask1"`, `"teleport1"`).
  - `roomindex` (`number`): Sequential, unique integer identifier.

### `LinkRooms(roomid, direction, linkedroom, linkeddirection)`
* **Description:** Creates a bidirectional link between two rooms. Ensures that linking to `"lobby"` is only allowed from the south direction. Marks the link as rigid if linked to lobby.
* **Parameters:**
  - `roomid` (`string`): Source room ID.
  - `direction` (`number`): Direction index (1=N, 2=E, 3=S, 4=W) from `roomid`.
  - `linkedroom` (`string`): Target room ID (e.g., `"lobby"`, `"teleport1"`).
  - `linkeddirection` (`number` or `nil`): Reverse direction index into `linkedroom`. Required except for `"lobby"`.

### `LinkRoomsBroken(roomid, direction, linkedroom, linkeddirection)`
* **Description:** Creates a broken link between rooms. The teleporter will not function until repaired.
* **Parameters:** Same as `LinkRooms`.

### `MakeLinkRigid(roomid, direction)`
* **Description:** Marks a link as rigid—meaning its direction cannot be shuffled by the PRNG during layout randomization.
* **Parameters:**
  - `roomid` (`string`)
  - `direction` (`number`)

### `MakeLinkUnderConstruction(roomid, direction)`
* **Description:** Marks a link as under construction (teleporter will be marked accordingly).
* **Parameters:**
  - `roomid` (`string`)
  - `direction` (`number`)

### `CreateLayoutV1()`, `CreateLayoutV2()`
* **Description:** Builds static room layouts (V1 and V2) by declaring rooms and linking them. V2 introduces `"puzzle2"` and modifies connections compared to V1.
* **Parameters:** None.

### `CreateLayout(version)`
* **Description:** Clears current layout and builds the requested version (1 or 2).
* **Parameters:**
  - `version` (`number`): Layout version to generate.

### `SetRoom(roomindexorid)`
* **Description:** Transitions the vault to a new room. Unloads the current room (if any), then loads and configures the new room, including setting up teleporter exits.
* **Parameters:**
  - `roomindexorid` (`number` or `string`): Room index or ID to switch to. `nil` clears the room.

### `TeleportEntities(entities, targetteleportmarkername)`
* **Description:** Teleports a list of entities to a specific vault marker. Calculates a spread position around the marker to avoid stacking.
* **Parameters:**
  - `entities` (`table`): List of entities to teleport.
  - `targetteleportmarkername` (`string`): Marker prefab name (e.g., `"vaultmarker_vault_north"`).

### `GetToOrFromVaultTeleportTargetsFor(doer)`
* **Description:** Collects all entities to teleport alongside a primary actor, including followers (e.g., followers of the player or carried leaders), while respecting `noleashing` and inventory constraints.
* **Parameters:**
  - `doer` (`Entity`): The primary teleporting entity.

### `TryToSpawnStaticLayouts()`
* **Description:** Spawns static layouts for the vault lobby and vault interior if the lobby exit target (Archive Portal) exists.
* **Parameters:** None.

### `OnRegisterVaultMarker(ent)`, `OnUnregisterVaultMarker(ent)`
* **Description:** Registers or unregisters vault markers and triggers validation of required markers.
* **Parameters:**
  - `ent` (`Entity`): The marker entity.

### `OnVaultTeleporterChannelStart(teleporter, doer)`
* **Description:** Handles player-initiated teleport attempts. If all players are ready and the link is not broken, triggers coordinated teleportation. Handles special case for lobby teleporter.
* **Parameters:**
  - `teleporter` (`Entity`)
  - `doer` (`Entity`, usually player)

### `OnVaultTeleporterChannelStop(teleporter, doer)`
* **Description:** Removes the channeling counter for the player when teleport channel is cancelled or completes.
* **Parameters:**
  - `teleporter` (`Entity`)
  - `doer` (`Entity`)

### `OnVaultTeleporterRepaired(teleporter, doer)`, `OnVaultTeleporterBroken(teleporter, doer)`
* **Description:** Marks a link as repaired or broken (adds/removes from `repairedlinks` map).
* **Parameters:**
  - `teleporter` (`Entity`)
  - `doer` (`Entity`)

### `OnUpdate(dt)`
* **Description:** Core loop handling:
  - Player position tracking (vault vs. outside).
  - Auto-room rotation when empty (cooled down).
  - Room reload or reset logic.
  - Teleport pt synchronization for drowning.
* **Parameters:**
  - `dt` (`number`): Delta time since last frame.

### `OnSave()`, `OnLoad(data)`
* **Description:** Save/load logic for persistent state: room data, repaired links, seed, layout version, and resetting state.
* **Parameters (for `OnLoad`):**
  - `data` (`table`): Saved data table.

### `GetDebugString()`
* **Description:** Returns a short debug string identifying the current room (e.g., `"Room:mask1/1"`).
* **Parameters:** None.

## Events & Listeners
- Listens to:
  - `"ms_register_vault_marker"` → `self:OnRegisterVaultMarker`
  - `"ms_unregister_vault_marker"` → `self:OnUnregisterVaultMarker`
  - `"ms_vault_teleporter_channel_start"` → `self:OnVaultTeleporterChannelStart`
  - `"ms_vault_teleporter_channel_stop"` → `self:OnVaultTeleporterChannelStop`
  - `"ms_vault_teleporter_repair"` → `self:OnVaultTeleporterRepaired`
  - `"ms_vault_teleporter_break"` → `self:OnVaultTeleporterBroken`
  - `"ms_register_vault_lobby_exit"` → `self:OnVaultLobbyExitCreated`
  - `"ms_register_vault_lobby_exit_target"` → `self:OnVaultLobbyExitTargetCreated`
  - `"arhivepoweron"` → `self:OnArchivesPowered(true)`
  - `"arhivepoweroff"` → `self:OnArchivesPowered(false)`
  - `"resetruins"` → `self:ResetVault()`
  - `"ms_playerjoined"` → `self.OnPlayerJoined`
- Pushes:
  - `"vault_teleporter_does_nothing"` (on broken/unlinked teleporter attempts)
  - `"vault_teleport"` (on teleportation requests)
  - `"ms_vaultroom_vault_playerentered"` (on player entry)
  - `"ms_vaultroom_vault_playerleft"` (on player exit)
  - `"vault_teleport_does_nothing"` (for invalid state)