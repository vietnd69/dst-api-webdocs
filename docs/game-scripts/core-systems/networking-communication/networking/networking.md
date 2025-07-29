---
id: networking
title: Networking
description: Core networking functions for server management, client connections, and multiplayer features
sidebar_position: 1
slug: game-scripts/core-systems/networking
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Networking

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `networking` module provides core networking functionality for Don't Starve Together, including server management, client connections, user sessions, mod downloading, and multiplayer communication features. It handles the fundamental networking operations that enable multiplayer gameplay.

## Usage Example

```lua
-- Start a dedicated server
StartDedicatedServer()

-- Join a server
JoinServer(server_listing, password)

-- Serialize player session
SerializeUserSession(player, is_new_spawn)

-- Announce messages to all players
Networking_Announcement("Server maintenance in 5 minutes", {1, 1, 0, 1}, "warning")
```

## Server Management

### StartDedicatedServer() {#start-dedicated-server}

**Status:** `stable`

**Description:**
Starts a dedicated server with default configuration. Handles server initialization, slot management, and world loading.

**Example:**
```lua
StartDedicatedServer()
-- Server will start and load the world slot
```

**Process:**
1. Starts the server in online or offline mode based on cluster configuration
2. Sets up server data with default values
3. Initializes world slot if empty
4. Updates server tags and starts the world

### GetDefaultServerData() {#get-default-server-data}

**Status:** `stable`

**Description:**
Returns the default server configuration data structure.

**Returns:**
- (table): Server configuration with default values

**Example:**
```lua
local server_data = GetDefaultServerData()
-- Returns table with pvp, game_mode, max_players, etc.
```

**Data Structure:**
```lua
{
    pvp = false,
    game_mode = "survival",
    playstyle = "social",
    online_mode = true,
    max_players = 6,
    name = "Server Name",
    password = "",
    description = "Server Description",
    server_language = "en",
    privacy_type = PRIVACY_TYPE.PUBLIC,
    clan = {
        id = "",
        only = false,
        admin = false,
    }
}
```

### UpdateServerTagsString() {#update-server-tags-string}

**Status:** `stable`

**Description:**
Updates the server's tag string for server browser display. Includes game mode, PVP status, privacy settings, and world location.

**Example:**
```lua
UpdateServerTagsString()
-- Updates tags like "Survival", "PVP", "Friends Only", etc.
```

### UpdateServerWorldGenDataString() {#update-server-worldgen-data-string}

**Status:** `stable`

**Description:**
Updates the server's world generation data string for client display. Includes world options and overrides for all shards.

**Example:**
```lua
UpdateServerWorldGenDataString()
-- Compresses and encodes world generation data
```

## Client Connection and Authentication

### JoinServer(server_listing, optional_password_override) {#join-server}

**Status:** `stable`

**Description:**
Initiates the process to join a server. Handles mod warnings, password prompts, and connection setup.

**Parameters:**
- `server_listing` (table): Server information from server browser
- `optional_password_override` (string): Pre-provided password (optional)

**Example:**
```lua
local server = {
    guid = "server_guid",
    has_password = true,
    mods_enabled = false,
    dedicated = true
}
JoinServer(server, "mypassword")
```

**Process:**
1. Shows mod warnings if applicable
2. Prompts for password if required
3. Downloads required mods
4. Initiates connection

### DownloadMods(server_listing) {#download-mods}

**Status:** `stable`

**Description:**
Downloads and enables mods required by the target server. Handles mod verification and version checking.

**Parameters:**
- `server_listing` (table): Server information including mod requirements

**Example:**
```lua
local server = {
    mods_enabled = true,
    mods_description = {
        {mod_name = "workshop-123456", version = "1.0", all_clients_require_mod = true}
    },
    mods_config_data = "config_string"
}
DownloadMods(server)
```

### MigrateToServer(serverIp, serverPort, serverPassword, serverNetId) {#migrate-to-server}

**Status:** `stable`

**Description:**
Migrates the client to a different server (shard switching). Saves current session and connects to new server.

**Parameters:**
- `serverIp` (string): Target server IP address
- `serverPort` (number): Target server port
- `serverPassword` (string): Server password
- `serverNetId` (string): Network ID (optional)

**Example:**
```lua
MigrateToServer("192.168.1.100", 10999, "password", "netid123")
```

## User Session Management

### SerializeUserSession(player, isnewspawn) {#serialize-user-session}

**Status:** `stable`

**Description:**
Serializes and saves a player's session data. Called when player data needs to be persisted.

**Parameters:**
- `player` (entity): Player entity to serialize
- `isnewspawn` (boolean): Whether this is a new player spawn

**Example:**
```lua
-- Save existing player
SerializeUserSession(player, false)

-- Save new player spawn
SerializeUserSession(player, true)
```

### DeleteUserSession(player) {#delete-user-session}

**Status:** `stable`

**Description:**
Deletes a player's saved session data.

**Parameters:**
- `player` (entity): Player entity whose session to delete

**Example:**
```lua
DeleteUserSession(player)
```

### SerializeWorldSession(data, session_identifier, callback, metadataStr) {#serialize-world-session}

**Status:** `stable`

**Description:**
Serializes world session data for saving.

**Parameters:**
- `data` (string): Serialized world data
- `session_identifier` (string): Session identifier
- `callback` (function): Completion callback
- `metadataStr` (string): Metadata string (optional)

## Player Spawning and Character Management

### SpawnNewPlayerOnServerFromSim(player_guid, skin_base, clothing_body, clothing_hand, clothing_legs, clothing_feet, starting_item_skins, skillselection) {#spawn-new-player}

**Status:** `stable`

**Description:**
Spawns a new player on the server with specified appearance and skill selection.

**Parameters:**
- `player_guid` (number): Player entity GUID
- `skin_base` (string): Base character skin
- `clothing_body` (string): Body clothing item
- `clothing_hand` (string): Hand clothing item
- `clothing_legs` (string): Leg clothing item
- `clothing_feet` (string): Feet clothing item
- `starting_item_skins` (table): Starting item skin mappings
- `skillselection` (table): Selected skills for character

### ValidateSpawnPrefabRequest(user_id, prefab_name, skin_base, clothing_body, clothing_hand, clothing_legs, clothing_feet, allow_seamlessswap_characters) {#validate-spawn-prefab}

**Status:** `stable`

**Description:**
Validates a player spawn request, ensuring the player owns the requested character and skins.

**Parameters:**
- `user_id` (string): Player's user ID
- `prefab_name` (string): Character prefab name
- `skin_base` (string): Base skin name
- `clothing_body` (string): Body clothing
- `clothing_hand` (string): Hand clothing
- `clothing_legs` (string): Leg clothing
- `clothing_feet` (string): Feet clothing
- `allow_seamlessswap_characters` (boolean): Allow seamless swap characters

**Returns:**
- (string, string, string, string, string, string): Validated prefab and clothing items

### SpawnSeamlessPlayerReplacementFromSim(player_guid, old_player_guid, skin_base, clothing_body, clothing_hand, clothing_legs, clothing_feet) {#spawn-seamless-replacement}

**Status:** `stable`

**Description:**
Spawns a seamless character replacement (character switching).

**Parameters:**
- `player_guid` (number): New player entity GUID
- `old_player_guid` (number): Old player entity GUID
- `skin_base` (string): Base character skin
- `clothing_body` (string): Body clothing
- `clothing_hand` (string): Hand clothing
- `clothing_legs` (string): Leg clothing
- `clothing_feet` (string): Feet clothing

## Communication and Announcements

### Networking_Announcement(message, colour, announce_type) {#networking-announcement}

**Status:** `stable`

**Description:**
Sends an announcement message to all connected players.

**Parameters:**
- `message` (string): Announcement text
- `colour` (table): RGB color values [r, g, b, a] (optional)
- `announce_type` (string): Type of announcement (optional)

**Example:**
```lua
-- Basic announcement
Networking_Announcement("Welcome to the server!")

-- Colored announcement
Networking_Announcement("Warning: Night is coming!", {1, 0.5, 0, 1}, "warning")

-- Death announcement
Networking_Announcement("Wilson was killed by a Hound", {1, 0, 0, 1}, "death")
```

### Networking_Say(guid, userid, name, prefab, message, colour, whisper, isemote, user_vanity) {#networking-say}

**Status:** `stable`

**Description:**
Handles chat messages from players, including speech bubbles and chat history.

**Parameters:**
- `guid` (number): Entity GUID
- `userid` (string): User ID
- `name` (string): Player display name
- `prefab` (string): Character prefab
- `message` (string): Chat message
- `colour` (table): Message color
- `whisper` (boolean): Whether this is a whisper
- `isemote` (boolean): Whether this is an emote
- `user_vanity` (table): Vanity items data

### Networking_JoinAnnouncement(name, colour) {#networking-join-announcement}

**Status:** `stable`

**Description:**
Announces when a player joins the server.

**Parameters:**
- `name` (string): Player name
- `colour` (table): Name color

### Networking_LeaveAnnouncement(name, colour) {#networking-leave-announcement}

**Status:** `stable`

**Description:**
Announces when a player leaves the server.

**Parameters:**
- `name` (string): Player name
- `colour` (table): Name color

## Server Browser and Quick Join

### CalcQuickJoinServerScore(server) {#calc-quickjoin-server-score}

**Status:** `stable`

**Description:**
Calculates a score for server selection in Quick Join. Higher scores indicate better matches.

**Parameters:**
- `server` (table): Server information

**Returns:**
- (number): Server score (-1 to reject server)

**Scoring Criteria:**
- Must be survival, dedicated, non-PVP, non-modded, non-passworded
- Bonus points for: friends playing, existing character, active players, clans
- Penalty for: empty servers

**Example:**
```lua
local score = CalcQuickJoinServerScore(server_data)
if score > 0 then
    -- Server is eligible for quick join
end
```

### JoinServerFilter() {#join-server-filter}

**Status:** `stable`

**Description:**
Determines if a server should be shown in the server browser. Always returns true by default but can be overridden by mods.

**Returns:**
- (boolean): Whether to show the server

## Player Color Management

### GetAvailablePlayerColours() {#get-available-player-colours}

**Status:** `stable`

**Description:**
Returns the available player colors and default color for assignment.

**Returns:**
- (table, table): Available colors list and default color

**Example:**
```lua
local colours, default = GetAvailablePlayerColours()
-- Returns predefined color scheme matching world tones
```

**Available Colors:**
- TOMATO, TAN, PLUM, BURLYWOOD, RED, PERU, etc.
- Colors are assigned in order as players join
- Players retain their previous color if available

## World Management

### WorldResetFromSim() {#world-reset-from-sim}

**Status:** `stable`

**Description:**
Handles world reset requests from the simulation. Deletes save data and restarts with preserved world generation options.

**Example:**
```lua
WorldResetFromSim()
-- Triggers world reset process
```

### WorldRollbackFromSim(count) {#world-rollback-from-sim}

**Status:** `stable`

**Description:**
Handles world rollback requests, reverting to a previous save state.

**Parameters:**
- `count` (number): Number of saves to roll back

**Example:**
```lua
WorldRollbackFromSim(3)
-- Rolls back 3 save states
```

## Utility Functions

### LookupPlayerInstByUserID(userid) {#lookup-player-inst-by-userid}

**Status:** `stable`

**Description:**
Finds a player entity by their user ID.

**Parameters:**
- `userid` (string): User ID to search for

**Returns:**
- (entity): Player entity or nil if not found

**Example:**
```lua
local player = LookupPlayerInstByUserID("KU_ABC123")
if player then
    print("Found player:", player.name)
end
```

### GetPlayerClientTable() {#get-player-client-table}

**Status:** `stable`

**Description:**
Returns the client table with only players, removing the dedicated host object if present.

**Returns:**
- (table): Array of client objects

**Example:**
```lua
local clients = GetPlayerClientTable()
for i, client in ipairs(clients) do
    print("Client:", client.name, client.userid)
end
```

## Event Handlers

### ClientAuthenticationComplete(userid) {#client-authentication-complete}

**Status:** `stable`

**Description:**
Called when a client completes authentication. Triggers the "ms_clientauthenticationcomplete" event.

**Parameters:**
- `userid` (string): Authenticated user ID

### ClientDisconnected(userid) {#client-disconnected}

**Status:** `stable`

**Description:**
Called when a client disconnects. Triggers the "ms_clientdisconnected" event.

**Parameters:**
- `userid` (string): Disconnected user ID

## Twitch Integration

### OnTwitchMessageReceived(username, message, colour) {#on-twitch-message-received}

**Status:** `stable`

**Description:**
Handles incoming Twitch chat messages.

**Parameters:**
- `username` (string): Twitch username
- `message` (string): Chat message
- `colour` (table): Message color

### OnTwitchLoginAttempt(success, result) {#on-twitch-login-attempt}

**Status:** `stable`

**Description:**
Handles Twitch login attempts and results.

**Parameters:**
- `success` (boolean): Whether login succeeded
- `result` (string): Login result message

### OnTwitchChatStatusUpdate(status) {#on-twitch-chat-status-update}

**Status:** `stable`

**Description:**
Handles Twitch chat status updates.

**Parameters:**
- `status` (string): Current chat status

## Friends and Party System

### RegisterFriendsManager(widget) {#register-friends-manager}

**Status:** `stable`

**Description:**
Registers a friends manager widget for handling party invites and chat.

**Parameters:**
- `widget` (widget): Friends manager widget

### Networking_PartyInvite(inviter, partyid) {#networking-party-invite}

**Status:** `stable`

**Description:**
Handles incoming party invitations.

**Parameters:**
- `inviter` (string): Name of player sending invite
- `partyid` (string): Party identifier

### Networking_PartyChat(chatline) {#networking-party-chat}

**Status:** `stable`

**Description:**
Handles party chat messages.

**Parameters:**
- `chatline` (string): Chat message from party member

## Admin and Metrics

### Networking_KickMetricsEvent(caller, target) {#networking-kick-metrics}

**Status:** `stable`

**Description:**
Records metrics for player kick events.

**Parameters:**
- `caller` (entity): Admin performing the kick
- `target` (entity): Player being kicked

### Networking_BanMetricsEvent(caller, target) {#networking-ban-metrics}

**Status:** `stable`

**Description:**
Records metrics for player ban events.

**Parameters:**
- `caller` (entity): Admin performing the ban
- `target` (entity): Player being banned

### Networking_VoteAnnouncement(commandid, targetname, passed) {#networking-vote-announcement}

**Status:** `stable`

**Description:**
Announces the results of player votes.

**Parameters:**
- `commandid` (number): Vote command hash
- `targetname` (string): Target of the vote
- `passed` (boolean): Whether vote passed

**Returns:**
- (string): Command name that was voted on

## Best Practices

1. **Server Management**: Use proper server configuration and validation
2. **Session Handling**: Regularly serialize important player data
3. **Mod Compatibility**: Handle mod downloads and validation properly
4. **Error Handling**: Implement proper error handling for network operations
5. **Security**: Validate all client requests and maintain server authority

## Related Modules

- [Network Client RPC](./networkclientrpc.md): RPC system for client-server communication
- [Network Variables](./netvars.md): Network variable synchronization
- [User Commands](./builtinusercommands.md): Admin commands and user management
- [Chat History](./chathistory.md): Chat message handling and storage
