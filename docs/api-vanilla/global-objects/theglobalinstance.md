---
id: theglobalinstance
title: TheGlobalInstance
sidebar_position: 8
---

# TheGlobalInstance

TheGlobalInstance is the global object that manages global data that persists across server shards in Don't Starve Together. It provides a centralized storage mechanism for data that needs to be shared between different server instances within a cluster.

## Basic Usage

```lua
-- Set a global value that persists across all shards
TheGlobalInstance:SetValue("global_key", some_value)

-- Get a value from the global storage
local value = TheGlobalInstance:GetValue("global_key")

-- Check if a global value exists
local exists = TheGlobalInstance:HasValue("global_key")

-- Remove a global value
TheGlobalInstance:RemoveValue("global_key")
```

## Data Management

```lua
-- Set a complex data structure in global storage
TheGlobalInstance:SetValue("player_statistics", {
    players_joined = 50,
    boss_defeats = 10,
    days_survived = 100
})

-- Update a nested value in global storage
local stats = TheGlobalInstance:GetValue("player_statistics")
if stats then
    stats.players_joined = stats.players_joined + 1
    TheGlobalInstance:SetValue("player_statistics", stats)
end

-- Clear all global values
TheGlobalInstance:ClearAllValues()
```

## Persistence and Synchronization

```lua
-- Force save global instance data to disk
TheGlobalInstance:Save()

-- Request refresh of global data from primary shard
TheGlobalInstance:SynchronizeWithMaster()

-- Check if data is currently synchronized across shards
local is_synced = TheGlobalInstance:IsDataSynchronized()

-- Set synchronization interval (in seconds)
TheGlobalInstance:SetSyncInterval(30)
```

## Event Handlers

```lua
-- Register a handler to be called when a specific global value changes
TheGlobalInstance:AddValueChangeHandler("global_key", function(new_value, old_value)
    print("Value changed from " .. tostring(old_value) .. " to " .. tostring(new_value))
end)

-- Remove a value change handler
TheGlobalInstance:RemoveValueChangeHandler("global_key", handler_fn)

-- Set handler for synchronization completion
TheGlobalInstance:SetOnSyncCompleteFn(function()
    print("Synchronization with master shard completed")
end)
```

## Shard-Specific Operations

```lua
-- Check if value was set by current shard
local is_local = TheGlobalInstance:IsLocalValue("global_key")

-- Get the shard ID that last modified a value
local shard_id = TheGlobalInstance:GetValueOrigin("global_key")

-- Set value that's only visible to this shard
TheGlobalInstance:SetLocalValue("shard_specific_key", some_value)
```

## Important Considerations

1. **Data Serialization**: All global values must be serializable - avoid using entities, functions, or userdata
2. **Storage Limits**: There are practical limits to how much data can be stored globally - keep data structures compact
3. **Synchronization Latency**: Changes take time to propagate across shards - don't expect immediate consistency
4. **Server-Side Only**: TheGlobalInstance functions only work on servers, not on clients
5. **Persistence**: Data persists between server restarts but can be lost if files are corrupted or deleted

## Integration with Other Global Objects

TheGlobalInstance often works with other global objects:

- **[TheShard](/docs/api-vanilla/global-objects/theshard)**: For communication between shards
- **[TheNet](/docs/api-vanilla/global-objects/thenet)**: For network-related functionality
- **[TheWorld](/docs/api-vanilla/global-objects/theworld)**: For accessing world state

## Common Use Cases

- **Global Player Statistics**: Tracking player achievements across all worlds
- **Cross-Shard Events**: Managing events that span multiple shards
- **Persistent Game State**: Storing game state that should persist across all shards
- **Global Resource Management**: Tracking resources that are shared between worlds
- **Synchronized Settings**: Maintaining consistent settings across a server cluster 