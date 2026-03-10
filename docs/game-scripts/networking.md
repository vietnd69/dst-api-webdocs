---
id: networking
title: Networking
description: Manages network communication, player synchronization, server operations, and system messaging for Don't Starve Together.
tags: [network, player, server, ui]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 3c972a12
system_scope: network
---

# Networking

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `networking` module provides server- and client-side utilities for managing networked game events, including chat, player authentication, mod synchronization, world resets, and party/lobby interactions. It serves as the central hub for inter-client communication, server command processing, and UI feedback during network operations. It does not define a traditional ECS component but instead exposes global functions used across network layers.

## Usage example
```lua
-- Example: Announce a player joining the game
Networking_JoinAnnouncement("PlayerName", {1, 0, 0, 1})

-- Example: Send a message through a character's talker component (server-only)
Networking_Say("entity_guid", 12345, "Player Name", "waxwell", "Hello world!", nil, false, false)

-- Example: Validate and spawn a new player on the server
local prefab, skin, body, hand, legs, feet = ValidateSpawnPrefabRequest(userid, "waxwell", "waxwell_none", "", "", "", "", "", true)
```

## Dependencies & tags
**Components used:** `skinner`, `talker`, `playerspawner`, `skilltreeupdater`, `seamlessplayerswapper`, `worldcharacterselectlobby`, `autosaver`, `talker`, `skilltreeupdater`.  
**Tags:** No tags are added/removed by this module; it only reads or checks tags on components (e.g., `mime`, `cursed`) via external component calls.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `FirstStartupForNetworking` | boolean | `false` | Global flag to ensure `SpawnSecondInstance()` only triggers once. |

## Main functions
### `Networking_SlashCmd(guid, userid, cmd)`
* **Description:** Processes remote slash command requests on the server. Invokes `UserCommands.RunTextUserCommand` with the parsed command string.
* **Parameters:**  
  `guid` (string?) — entity GUID of the caller, if applicable.  
  `userid` (string) — unique user identifier.  
  `cmd` (string) — the slash command string (e.g., `/kick`).  
* **Returns:** Nothing.

### `Networking_Say(guid, userid, name, prefab, message, colour, whisper, isemote, user_vanity)`
* **Description:** Handles chat message delivery. Outputs the message via `talker:Say` (if not an emote) and records it in `ChatHistory`.
* **Parameters:**  
  `guid` (string) — entity GUID.  
  `userid` (string) — user ID.  
  `name`, `prefab`, `message`, `colour`, `whisper`, `isemote`, `user_vanity` — chat metadata (see `ChatHistory:OnSay`).  
* **Returns:** `nil` if message exceeds `MAX_CHAT_INPUT_LENGTH`.

### `Networking_Announcement(message, colour, announce_type)`
* **Description:** Broadcasts a system or user-generated announcement to all players via `ChatHistory:OnAnnouncement`.
* **Parameters:**  
  `message` (string?) — announcement text.  
  `colour` (table?) — RGB(A) colour table. Defaults to `{1,1,1,1}`.  
  `announce_type` (string?) — category (e.g., `"death"`, `"join_game"`, `"mod"`). Defaults to `"default"`.

### `Networking_JoinAnnouncement(name, colour)`, `Networking_LeaveAnnouncement(name, colour)`, etc.
* **Description:** Formats and broadcasts standard player lifecycle events (join, leave, kick, ban, vote, roll) using localized strings and `Networking_Announcement`.

### `ValidateSpawnPrefabRequest(...)`
* **Description:** Validates a player’s requested character, skin, and clothing against ownership, compatibility, and server rules.
* **Parameters:**  
  `user_id`, `prefab_name`, `skin_base`, `clothing_body`, `clothing_hand`, `clothing_legs`, `clothing_feet`, `allow_seamlessswap_characters` (boolean).  
* **Returns:** Up to six validated values: `prefab`, `skin_base`, `clothing_body`, `clothing_hand`, `clothing_legs`, `clothing_feet`. Invalid values may be replaced with defaults.

### `SpawnNewPlayerOnServerFromSim(...)`
* **Description:** Spawns a new player on the server after setting skin and clothing via `skinner`, applying item skins via `OnNewSpawn`, updating skill selection, and calling `playerspawner:SpawnAtNextLocation`.
* **Parameters:**  
  `player_guid`, `skin_base`, `clothing_body`, `clothing_hand`, `clothing_legs`, `clothing_feet`, `starting_item_skins`, `skillselection`.

### `SpawnSeamlessPlayerReplacementFromSim(...)`
* **Description:** Performs a seamless character swap on the server. Replaces the old player entity with the new one, applies clothing/skin, triggers `seamlessplayerswapper:OnSeamlessCharacterSwap`, and fires `ms_seamlesscharacterspawned`.
* **Parameters:**  
  `player_guid`, `old_player_guid`, `skin_base`, `clothing_body`, `clothing_hand`, `clothing_legs`, `clothing_feet`.

### `VerifySpawnNewPlayerOnServerRequest(user_id)`
* **Description:** Checks whether a player may spawn, e.g., if lobby state permits it. Kicks the user if spawning is blocked.
* **Returns:** `true` if spawning is allowed; `false` otherwise.

### `DownloadMods(server_listing)`
* **Description:** Manages mod synchronization when joining a modded server. Temporarily disables/enables mods, downloads missing ones from Workshop, and configures mod state before connecting.

### `WorldResetFromSim()`, `WorldRollbackFromSim(count)`
* **Description:** Handles server-initiated world resets and rollbacks. Deletes world data, truncates snapshots, and resets to a previous save via `DoReset`.

### `StartDedicatedServer()`
* **Description:** Initializes and starts a dedicated server. Generates server metadata, saves configuration, and launches the game instance.

### `JoinServer(server_listing, optional_password_override)`
* **Description:** Orchestrates joining a remote server, handling mod warnings, password prompts, and client-server mod compatibility checks before calling `TheNet:JoinServerResponse`.

### `MigrateToServer(serverIp, serverPort, serverPassword, serverNetId)`
* **Description:** Initiates a seamless transition to a new server session, optionally saving the current player state first.

### `GetAvailablePlayerColours()`
* **Description:** Returns a deterministic ordered list of available player colours and a fallback default.
* **Returns:** `{colours: table, default: colour}`.

## Events & listeners
- **Listens to:**  
  None directly — events are handled in other components (e.g., `ms_requestedlobbycharacter` is listened to elsewhere).  
- **Pushes:**  
  `twitchmessage` — `username`, `message`, `colour`.  
  `twitchloginresult` — `success`, `result`.  
  `twitchstatusupdate` — `status`.  
  `ms_requestedlobbycharacter` — `userid`, `prefab_name`, `skin_base`, `clothing_*`.  
  `ms_seamlesscharacterspawned` — `player` entity.  
  `ms_worldreset` — no payload.  
  `ms_clientauthenticationcomplete` — `userid`.  
  `ms_clientdisconnected` — `userid`.  
  `ms_playerreroll` and `ms_playerseamlessswaped` — via `seamlessplayerswapper`.