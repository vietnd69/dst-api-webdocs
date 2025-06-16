---
id: thenet
title: TheNet
sidebar_position: 4
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# TheNet

TheNet is the global object that manages networking functions and connections in Don't Starve Together. It provides interfaces for client-server communications, player information, server settings, and more.

## Basic Network Information

```lua
-- Check if the game is running on a dedicated server
local is_dedicated = TheNet:IsDedicated()

-- Check if the game is running as a server
local is_server = TheNet:GetIsServer()

-- Check if the server is client-hosted (non-dedicated)
local is_client_hosted = TheNet:GetServerIsClientHosted()

-- Check if the current instance is the master simulation
local is_master_sim = TheNet:GetIsMasterSimulation()

-- Check if the current instance is a client
local is_client = TheNet:GetIsClient()

-- Check if the server is paused
local is_paused = TheNet:IsServerPaused()

-- Get the current game mode
local game_mode = TheNet:GetServerGameMode() -- Returns "survival", "wilderness", "endless", or "lavaarena", "quagmire" for event servers
```

## Player Information

```lua
-- Get the local player's user ID
local user_id = TheNet:GetUserID()

-- Get the client table (information about all connected clients)
local clients = TheNet:GetClientTable()

-- Get information about a specific client
local client_info = TheNet:GetClientTableForUser(userid)

-- Check if a player is an administrator
local is_admin = TheNet:GetIsServerAdmin()

-- Check if PVP is enabled
local pvp_enabled = TheNet:GetPVPEnabled()

-- Get the default maximum number of players allowed
local max_players = TheNet:GetDefaultMaxPlayers()
```

## Messages and Announcements

```lua
-- Send a system message (only visible to the local client)
TheNet:SystemMessage("This is a system message")

-- Send an announcement (visible to all players)
TheNet:Announce("Important announcement!", nil, nil, "default")
-- Categories: "join_game", "leave_game", "death", "resurrect", "vote", "vote_passed", "vote_failed", "default"
```

## Server Management

```lua
-- Start a server
TheNet:StartServer()

-- Start a client connection
TheNet:StartClient(ip, port, password)

-- Download server mods
TheNet:DownloadServerMods()

-- Begin server mod setup
TheNet:BeginServerModSetup()

-- Set up a specific mod
TheNet:ServerModSetup(mod_id)

-- Set up a collection of mods
TheNet:ServerModCollectionSetup(collection_id)

-- Start a vote
TheNet:StartVote(vote_id, initiator_userid)

-- Stop a current vote
TheNet:StopVote()

-- Announce vote result
TheNet:AnnounceVoteResult(vote_id, initiator_name, passed)
```

## Remote Procedure Calls (RPCs)

```lua
-- Send an RPC to the server
TheNet:SendRPCToServer(rpc_code, ...)

-- Send an RPC to a client
TheNet:SendRPCToClient(rpc_code, client_id, ...)

-- Send an RPC to a shard
TheNet:SendRPCToShard(rpc_code, ...)

-- Send a mod RPC to the server
TheNet:SendModRPCToServer(namespace, rpc_id, ...)

-- Send a mod RPC to a client
TheNet:SendModRPCToClient(namespace, rpc_id, client_id, ...)

-- Send a mod RPC to a shard
TheNet:SendModRPCToShard(namespace, rpc_id, ...)

-- Send a slash command to the server
TheNet:SendSlashCmdToServer(command)
```

## World Management

```lua
-- Send a world rollback request
TheNet:SendWorldRollbackRequestToServer(days)

-- Send a world reset request
TheNet:SendWorldResetRequestToServer()

-- Get the session identifier
local session_id = TheNet:GetSessionIdentifier()

-- Get a world session file
local file = TheNet:GetWorldSessionFile(session_id)

-- Get a world session file in a cluster slot
local file = TheNet:GetWorldSessionFileInClusterSlot(slot_num, shard_name, session_id)
```

## Online Features

```lua
-- Check if the game is in online mode
local is_online = TheNet:IsOnlineMode()

-- Get network statistics
local stats = TheNet:GetNetworkStatistics()
```

## Mod Management

```lua
-- Get the list of server mod names
local mods = TheNet:GetServerModNames()
```

## Important Considerations

1. **Server vs. Client Context**: Many TheNet functions behave differently depending on whether they're called on a server or client
2. **Dedicated vs. Client-Hosted**: Some functions specifically check for dedicated servers versus client-hosted servers
3. **Master Simulation**: Some operations should only be performed in the master simulation
4. **Permissions**: Operations like server administration require appropriate permissions
5. **Network Performance**: Avoid sending unnecessary network messages that could impact performance

## Common Use Cases

- **Server Administration**: Managing server settings, votes, and mod configurations
- **Player Information**: Getting information about connected players
- **Network Communication**: Sending data between clients and servers
- **World Management**: Managing world state and session information
- **Announcements**: Displaying messages to players 
