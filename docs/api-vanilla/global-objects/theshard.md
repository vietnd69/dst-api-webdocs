---
id: theshard
title: TheShard
sidebar_position: 7
last_updated: 2023-07-06
---

# TheShard

TheShard is the global object that manages communication between different server shards in Don't Starve Together. It provides interfaces for cross-shard messaging, player migration, and shared state management in multi-shard server clusters.

## Basic Shard Information

```lua
-- Check if the game is running in a shard cluster
local is_secondary = TheShard:IsSlave()
local is_primary = TheShard:IsMaster()

-- Get the current shard ID
local shard_id = TheShard:GetShardId()

-- Get list of connected shard IDs
local connected_shards = TheShard:GetConnectedShards()

-- Check if a specific shard is connected
local is_connected = TheShard:IsShardConnected(shard_id)

-- Get primary shard ID
local master_shard = TheShard:GetMasterShardId()
```

## Cross-Shard Communication

```lua
-- Send a message to another shard
TheShard:SendRemoteMessage(dest_shard_id, message_id, data)

-- Send a message to the primary shard
TheShard:SendToMaster(message_id, data)

-- Send a message to all secondary shards
TheShard:SendToSlaves(message_id, data)

-- Register a handler for remote messages
TheShard:AddRemoteMessageHandler(message_id, function(shard_id, data)
    print("Received message from shard " .. shard_id)
end)

-- Listen for specific events on another shard
TheShard:ListenForRemoteEvent(dest_shard_id, event_name, handler_fn)
```

## Player Migration

```lua
-- Check if player migrations are currently allowed
local migrations_allowed = TheShard:AllowMigration(true)

-- Start a player migration to another shard
TheShard:StartMigration(player, dest_shard_id, destination_x, destination_z)

-- Get migration data for a player (used during migration)
local migration_data = TheShard:GetMigrationData(userid)

-- Register a handler for when a player arrives from another shard
TheShard:SetOnPlayerMigrated(function(player, migration_data)
    -- Handle the newly arrived player
    print(player.userid .. " arrived from shard " .. migration_data.shard_id)
end)
```

## Shared State Management

```lua
-- Share world state with other shards
TheShard:ShareWorldState(key, value)

-- Get a shared world state value
local value = TheShard:GetSharedWorldState(key)

-- Set a migration reference point for seamless transitions
TheShard:SetShardPosition(position_x, position_z)

-- Get the position reference point of another shard
local x, z = TheShard:GetShardPosition(shard_id)

-- Get a value from cross-shard storage
local value = TheShard:GetValue(key)
```

## Synchronization

```lua
-- Synchronize time between shards
TheShard:SynchronizeWorldState()

-- Get the clock time of another shard
local day, time = TheShard:GetRemoteClockTime(shard_id)

-- Get weather information from another shard
local is_raining = TheShard:GetRemoteWeatherState(shard_id, "israining")

-- Synchronize day/night cycles
TheShard:SyncDayPhase()

-- Check if a shard is in a specific phase
local is_night = TheShard:IsShardInPhase(shard_id, "night")
```

## Important Considerations

1. **Server-Side Only**: TheShard functions only work on the server, not on clients
2. **Cluster Configuration**: Proper server cluster configuration is required for shard communication
3. **Performance Impact**: Cross-shard communication has latency and should be used judiciously
4. **Serialization Limitations**: Data sent between shards must be serializable
5. **Network Resilience**: Always handle connection failures between shards gracefully

## Integration with Other Global Objects

TheShard often works with other global objects:

- **[TheNet](/docs/api-vanilla/global-objects/thenet)**: For basic network functionality
- **[TheWorld](/docs/api-vanilla/global-objects/theworld)**: For accessing world state
- **[TheGlobalInstance](/docs/api-vanilla/global-objects/theglobalinstance)**: For data that persists across shards

## Common Use Cases

- **Multi-World Servers**: Managing connections between overworld and caves
- **Player Migration**: Moving players between worlds seamlessly
- **Synchronized Events**: Keeping world events synchronized across shards
- **Cross-Shard Entities**: Managing entities that can affect multiple shards
- **Shared Resources**: Maintaining shared resource pools across shards 
