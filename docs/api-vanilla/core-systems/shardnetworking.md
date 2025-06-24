---
id: shardnetworking
title: Shard Networking
description: Inter-shard communication and synchronization system for cluster management and portal connectivity
sidebar_position: 87
slug: /api-vanilla/core-systems/shardnetworking
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Shard Networking

## Version History
| Build Version | Change Date | Change Type | Description |
|---------------|-------------|-------------|-------------|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `ShardNetworking` module provides inter-shard communication and synchronization capabilities for cluster-based multiplayer environments. This system manages portal connections, world state synchronization, boss defeat tracking, voting systems, and various cross-shard data sharing mechanisms essential for maintaining consistency across multiple game worlds.

## Global Data Structures

### ShardPortals

**Status:** `stable`

**Description:**
Global table tracking all portal entities that can connect between shards.

**Structure:**
```lua
-- ShardPortals table format
ShardPortals = {
    [portal_id] = portal_entity,  -- Portal instances indexed by ID
    -- Additional portals...
}
```

### ShardList

**Status:** `stable`

**Description:**
Global table tracking all known available shards in the cluster.

**Structure:**
```lua
-- ShardList table format
ShardList = {
    [world_id] = true,  -- Boolean flag indicating shard availability
    -- Additional shards...
}
```

### ShardConnected

**Status:** `stable`

**Description:**
Private table tracking detailed connection information for each shard.

**Structure:**
```lua
-- ShardConnected table format (internal)
ShardConnected = {
    [world_id] = {
        ready = true,           -- Connection status
        tags = {"caves", "secondary"},  -- Shard tags
        world = world_data      -- World-specific data
    }
}
```

## Core Shard Management Functions

### Shard_IsMaster() {#shard-is-master}

**Status:** `stable`

**Description:**
Determines if the current shard is the master shard in the cluster configuration.

**Parameters:**
None

**Returns:**
- (boolean): `true` if current shard is master, `false` otherwise

**Example:**
```lua
-- Check if current shard is master
if Shard_IsMaster() then
    print("This is the master shard")
    -- Perform master-only operations
    Shard_SyncWorldSettings("Caves")
else
    print("This is a secondary shard")
    -- Request settings from master
    SendRPCToShard(SHARD_RPC.ResyncWorldSettings, SHARDID.MASTER)
end
```

### Shard_IsWorldAvailable(world_id) {#shard-is-world-available}

**Status:** `stable`

**Description:**
Checks if a specific world/shard is currently available for connection or migration.

**Parameters:**
- `world_id` (string): World identifier to check

**Returns:**
- (boolean): `true` if world is available, `false` otherwise

**Example:**
```lua
-- Check if caves are available before migration
if Shard_IsWorldAvailable("Caves") then
    print("Caves shard is available")
    -- Enable cave portal
    EnablePortalToCaves()
else
    print("Caves shard is not available")
    -- Disable cave portal
    DisablePortalToCaves()
end

-- Check current shard availability
local current_shard = TheShard:GetShardId()
print("Current shard available:", Shard_IsWorldAvailable(current_shard))
```

### Shard_IsWorldFull(world_id) {#shard-is-world-full}

**Status:** `stable`

**Description:**
Checks if a specific world has reached its player capacity limit.

**Parameters:**
- `world_id` (string): World identifier to check

**Returns:**
- (boolean): `true` if world is full, `false` otherwise

**Example:**
```lua
-- Check if target world can accept more players
if not Shard_IsWorldFull("Caves") then
    print("Caves shard has space for more players")
    -- Allow migration
    AllowMigrationToCaves()
else
    print("Caves shard is full")
    -- Block migration
    BlockMigrationToCaves()
end
```

**Technical Notes:**
Currently marked as TODO in the source code implementation.

## World Settings Synchronization

### Shard_SyncWorldSettings(world_id, is_resync) {#shard-sync-world-settings}

**Status:** `stable`

**Description:**
Synchronizes world generation settings from master shard to secondary shards, ensuring consistent world parameters across the cluster.

**Parameters:**
- `world_id` (string): Target world identifier for synchronization
- `is_resync` (boolean): Whether this is a resynchronization operation

**Returns:**
None

**Example:**
```lua
-- Initial sync to all secondary shards
Shard_SyncWorldSettings("Caves", false)

-- Resync after settings change
Shard_SyncWorldSettings("Caves", true)

-- Master shard syncing settings on startup
if Shard_IsMaster() then
    for world_id in pairs(ShardList) do
        if world_id ~= TheShard:GetShardId() then
            Shard_SyncWorldSettings(world_id, false)
        end
    end
end
```

**Technical Implementation:**
```lua
-- Settings synchronization process
local sync_options = Customize.GetSyncOptions()
local worldoptions = ShardGameIndex:GetGenOptions()

local sync_settings = {}
for option, value in pairs(worldoptions.overrides) do
    if sync_options[option] then
        sync_settings[option] = value
    end
end

if not IsTableEmpty(sync_settings) then
    SendRPCToShard(SHARD_RPC.SyncWorldSettings, world_id, DataDumper(sync_settings))
end
```

## Shard Connection Management

### Shard_OnShardConnected(world_id, tags, world_data) {#shard-on-shard-connected}

**Status:** `stable`

**Description:**
Handles the connection event when a shard becomes available, performing necessary initialization and synchronization.

**Parameters:**
- `world_id` (string): Connected world identifier
- `tags` (table): Array of shard tags
- `world_data` (table): World-specific configuration data

**Returns:**
None

**Example:**
```lua
-- This function is typically called internally by the networking system
-- Example of manual invocation for testing:
local world_tags = {"caves", "secondary"}
local world_config = {
    preset = "SURVIVAL_TOGETHER_CAVE",
    difficulty = "normal"
}

Shard_OnShardConnected("Caves", world_tags, world_config)
```

### Shard_UpdateWorldState(world_id, state, tags, world_data) {#shard-update-world-state}

**Status:** `stable`

**Description:**
Updates the connection state of a shard and manages portal connections accordingly.

**Parameters:**
- `world_id` (string): World identifier
- `state` (number): Connection state (REMOTESHARDSTATE enum)
- `tags` (table): Array of shard tags
- `world_data` (string): Encoded world configuration data

**Returns:**
None

**Example:**
```lua
-- Connect a caves shard
Shard_UpdateWorldState("Caves", REMOTESHARDSTATE.READY, {"caves"}, encoded_world_data)

-- Disconnect a shard
Shard_UpdateWorldState("Caves", REMOTESHARDSTATE.DISCONNECTED, nil, nil)

-- Check results
local connected_shards = Shard_GetConnectedShards()
for world_id, shard_info in pairs(connected_shards) do
    print("Shard:", world_id, "Ready:", shard_info.ready)
end
```

**Technical Implementation:**
- Decodes and validates world data
- Updates internal connection tracking
- Manages portal bindings automatically
- Updates server tags and world generation data

### Shard_UpdatePortalState(inst) {#shard-update-portal-state}

**Status:** `stable`

**Description:**
Updates portal connection state and automatically links unbound portals to available shards.

**Parameters:**
- `inst` (Entity): Portal entity instance

**Returns:**
None

**Example:**
```lua
-- Called automatically when portals are spawned
local portal = SpawnPrefab("cave_entrance")
Shard_UpdatePortalState(portal)

-- Manual portal state update
for portal_id, portal in pairs(ShardPortals) do
    Shard_UpdatePortalState(portal)
end
```

### Shard_GetConnectedShards() {#shard-get-connected-shards}

**Status:** `stable`

**Description:**
Returns a deep copy of all currently connected shards information for debugging and monitoring purposes.

**Parameters:**
None

**Returns:**
- (table): Deep copy of connected shards data

**Example:**
```lua
-- Get connected shards for debugging
local shards = Shard_GetConnectedShards()
for world_id, shard_info in pairs(shards) do
    print("World:", world_id)
    print("Ready:", shard_info.ready)
    print("Tags:", table.concat(shard_info.tags, ", "))
    
    if shard_info.world and shard_info.world.preset then
        print("Preset:", shard_info.world.preset)
    end
end
```

## Session and State Management

### Shard_UpdateMasterSessionId(session_id) {#shard-update-master-session-id}

**Status:** `stable`

**Description:**
Updates the master shard session identifier and notifies the world of the change.

**Parameters:**
- `session_id` (string): New master session identifier

**Returns:**
None

**Example:**
```lua
-- Update master session ID
local new_session = GenerateNewSessionId()
Shard_UpdateMasterSessionId(new_session)

-- Listen for session changes
TheWorld:ListenForEvent("ms_newmastersessionid", function(world, session_id)
    print("Master session updated to:", session_id)
end)
```

### Shard_WorldSave() {#shard-world-save}

**Status:** `stable`

**Description:**
Triggers a world save event on the master shard.

**Parameters:**
None

**Returns:**
None

**Example:**
```lua
-- Trigger world save
Shard_WorldSave()

-- Listen for save events
if TheWorld and TheWorld.ismastershard then
    TheWorld:ListenForEvent("ms_save", function()
        print("World save triggered")
        -- Perform save operations
    end)
end
```

## Voting System Functions

### Shard_StartVote(command_id, starter_id, target_id) {#shard-start-vote}

**Status:** `stable`

**Description:**
Initiates a voting process on the master shard with specified parameters.

**Parameters:**
- `command_id` (number): Command hash identifier for the vote
- `starter_id` (string): User ID of the vote initiator
- `target_id` (string): User ID of the vote target (if applicable)

**Returns:**
None

**Example:**
```lua
-- Start a kick vote
local command_hash = GetCommandHash("kick")
local initiator = "player1_userid"
local target = "player2_userid"

Shard_StartVote(command_hash, initiator, target)

-- Listen for vote start events on master
if TheWorld and TheWorld.ismastershard then
    TheWorld:ListenForEvent("ms_startvote", function(world, data)
        print("Vote started by:", data.starteruserid)
        print("Target:", data.targetuserid)
    end)
end
```

### Shard_StopVote() {#shard-stop-vote}

**Status:** `stable`

**Description:**
Stops the current voting process on the master shard.

**Parameters:**
None

**Returns:**
None

**Example:**
```lua
-- Stop current vote
Shard_StopVote()

-- Listen for vote stop events
if TheWorld and TheWorld.ismastershard then
    TheWorld:ListenForEvent("ms_stopvote", function()
        print("Voting stopped")
    end)
end
```

### Shard_ReceiveVote(selection, user_id) {#shard-receive-vote}

**Status:** `stable`

**Description:**
Processes a vote selection from a player on the master shard.

**Parameters:**
- `selection` (boolean): Vote choice (true for yes, false for no)
- `user_id` (string): User ID of the voter

**Returns:**
None

**Example:**
```lua
-- Submit a vote
Shard_ReceiveVote(true, "player1_userid")  -- Vote yes
Shard_ReceiveVote(false, "player2_userid") -- Vote no

-- Listen for vote submissions on master
if TheWorld and TheWorld.ismastershard then
    TheWorld:ListenForEvent("ms_receivevote", function(world, data)
        print("Vote received from:", data.userid)
        print("Selection:", data.selection and "Yes" or "No")
    end)
end
```

## Dice Roll System

### Shard_OnDiceRollRequest(user_id) {#shard-on-dice-roll-request}

**Status:** `stable`

**Description:**
Handles dice roll requests with cooldown management to prevent spam.

**Parameters:**
- `user_id` (string): User ID requesting the dice roll

**Returns:**
- (boolean): `true` if request is allowed, `false` if on cooldown

**Example:**
```lua
-- Process dice roll request
local user = "player1_userid"
local allowed = Shard_OnDiceRollRequest(user)

if allowed then
    print("Dice roll allowed for user:", user)
    -- Perform dice roll
    local result = math.random(1, 6)
    NotifyDiceRoll(user, result)
else
    print("Dice roll on cooldown for user:", user)
    -- Notify user of cooldown
    NotifyDiceRollCooldown(user)
end
```

**Technical Notes:**
- Uses `TUNING.DICE_ROLL_COOLDOWN` for cooldown duration
- Only functions on master shard
- Automatically cleans up expired cooldown entries

## Boss and Event Synchronization

### Shard_SyncBossDefeated(bossprefab, shardid) {#shard-sync-boss-defeated}

**Status:** `stable`

**Description:**
Synchronizes boss defeat events across shards to maintain consistent world state.

**Parameters:**
- `bossprefab` (string): Prefab name of the defeated boss
- `shardid` (string): Optional shard identifier where boss was defeated

**Returns:**
None

**Example:**
```lua
-- Sync boss defeat from caves
Shard_SyncBossDefeated("dragonfly", "Caves")

-- Sync boss defeat from current shard
Shard_SyncBossDefeated("bearger")

-- Listen for boss defeats on master
if TheWorld and TheWorld.ismastershard then
    TheWorld:ListenForEvent("master_shardbossdefeated", function(world, data)
        print("Boss defeated:", data.bossprefab)
        print("On shard:", data.shardid)
        -- Update world progression
    end)
end
```

## Merm King Synchronization Functions

### Shard_SyncMermKingExists(exists, shardid) {#shard-sync-merm-king-exists}

**Status:** `stable`

**Description:**
Synchronizes Merm King existence status across shards for quest progression tracking.

**Parameters:**
- `exists` (boolean): Whether Merm King exists
- `shardid` (string): Optional shard identifier

**Returns:**
None

**Example:**
```lua
-- Notify that Merm King spawned
Shard_SyncMermKingExists(true, "Forest")

-- Notify that Merm King was defeated
Shard_SyncMermKingExists(false, "Forest")

-- Listen for Merm King status changes
if TheWorld and TheWorld.ismastershard then
    TheWorld:ListenForEvent("master_shardmermkingexists", function(world, data)
        print("Merm King exists:", data.exists)
        print("On shard:", data.shardid)
    end)
end
```

### Shard_SyncMermKingTrident(exists, shardid) {#shard-sync-merm-king-trident}

**Status:** `stable`

**Description:**
Synchronizes Merm King Trident pickup status across shards for buff management.

**Parameters:**
- `exists` (boolean): Whether trident was picked up
- `shardid` (string): Optional shard identifier

**Returns:**
None

**Example:**
```lua
-- Sync trident pickup
Shard_SyncMermKingTrident(true, "Caves")

-- Listen for trident status updates
if TheWorld and TheWorld.ismastershard then
    TheWorld:ListenForEvent("master_shardmermkingtrident", function(world, data)
        print("Merm King Trident picked up:", data.pickedup)
        print("On shard:", data.shardid)
        -- Apply global buff
    end)
end
```

### Shard_SyncMermKingCrown(exists, shardid) {#shard-sync-merm-king-crown}

**Status:** `stable`

**Description:**
Synchronizes Merm King Crown pickup status across shards for buff management.

**Parameters:**
- `exists` (boolean): Whether crown was picked up
- `shardid` (string): Optional shard identifier

**Returns:**
None

**Example:**
```lua
-- Sync crown pickup
Shard_SyncMermKingCrown(true)

-- Listen for crown status updates
if TheWorld and TheWorld.ismastershard then
    TheWorld:ListenForEvent("master_shardmermkingcrown", function(world, data)
        print("Merm King Crown picked up:", data.pickedup)
        -- Apply global buff
    end)
end
```

### Shard_SyncMermKingPauldron(exists, shardid) {#shard-sync-merm-king-pauldron}

**Status:** `stable`

**Description:**
Synchronizes Merm King Pauldron pickup status across shards for buff management.

**Parameters:**
- `exists` (boolean): Whether pauldron was picked up
- `shardid` (string): Optional shard identifier

**Returns:**
None

**Example:**
```lua
-- Sync pauldron pickup
Shard_SyncMermKingPauldron(true)

-- Listen for pauldron status updates
if TheWorld and TheWorld.ismastershard then
    TheWorld:ListenForEvent("master_shardmermkingpauldron", function(world, data)
        print("Merm King Pauldron picked up:", data.pickedup)
        -- Apply global buff
    end)
end
```

## Usage Patterns

### Basic Shard Connection Management

```lua
-- Initialize shard networking
local function InitializeShardNetworking()
    -- Check if this is master shard
    if Shard_IsMaster() then
        print("Initializing master shard")
        
        -- Set up world settings sync
        TheWorld:ListenForEvent("shardconnected", function(world, data)
            Shard_SyncWorldSettings(data.world_id, false)
        end)
    else
        print("Initializing secondary shard")
        
        -- Request settings from master
        TheWorld:DoTaskInTime(1, function()
            SendRPCToShard(SHARD_RPC.ResyncWorldSettings, SHARDID.MASTER)
        end)
    end
end
```

### Portal Management Integration

```lua
-- Manage portal connections
local function ManagePortalConnections()
    -- Update all portal states when shard list changes
    for portal_id, portal in pairs(ShardPortals) do
        if portal:IsValid() then
            Shard_UpdatePortalState(portal)
        else
            -- Clean up invalid portals
            ShardPortals[portal_id] = nil
        end
    end
    
    -- Log current connections
    local connected = Shard_GetConnectedShards()
    for world_id, info in pairs(connected) do
        print("Portal target available:", world_id)
    end
end
```

### Event Synchronization System

```lua
-- Set up cross-shard event synchronization
local function SetupEventSync()
    -- Boss defeat tracking
    inst:ListenForEvent("entity_death", function(inst, data)
        if data.inst:HasTag("epic") then
            local boss_prefab = data.inst.prefab
            Shard_SyncBossDefeated(boss_prefab)
        end
    end, TheWorld)
    
    -- Merm King item tracking
    inst:ListenForEvent("ms_playerjoined", function(world, player)
        local inventory = player.components.inventory
        if inventory then
            -- Check for Merm King items
            if inventory:Has("mermking_trident", 1) then
                Shard_SyncMermKingTrident(true)
            end
        end
    end, TheWorld)
end
```

## Integration Points

### TheShard Integration

Shard identification and status:

```lua
-- Shard identification
local shard_id = TheShard:GetShardId()
local is_master = TheShard:IsMaster()
local is_secondary = TheShard:IsSecondary()
```

### TheNet Integration

Network communication and simulation:

```lua
-- Network simulation checks
local is_master_sim = TheNet:GetIsMasterSimulation()
local is_dedicated = TheNet:IsDedicated()
```

### RPC System Integration

Remote procedure calls between shards:

```lua
-- Send RPC to specific shard
SendRPCToShard(SHARD_RPC.SyncWorldSettings, target_shard, data)

-- Common RPC types
SHARD_RPC.SyncWorldSettings
SHARD_RPC.ResyncWorldSettings
SHARD_RPC.SyncBossDefeated
SHARD_RPC.SyncMermKingExists
```

### Customize System Integration

World settings synchronization:

```lua
-- Get synchronizable options
local sync_options = Customize.GetSyncOptions()
local world_options = ShardGameIndex:GetGenOptions()
```

## Constants and Configuration

### Shard States

- `REMOTESHARDSTATE.READY`: Shard is connected and ready
- `REMOTESHARDSTATE.DISCONNECTED`: Shard is disconnected

### Shard Identifiers

- `SHARDID.MASTER`: Master shard identifier
- Custom shard IDs for caves and other worlds

### Timing Constants

- `TUNING.DICE_ROLL_COOLDOWN`: Cooldown time for dice roll requests

## Related Modules

- [ShardIndex](./shardindex.md): Individual shard data management
- [ShardSaveIndex](./shardsaveindex.md): Multi-shard save slot management
- [TheNet](../core-systems/index.md#thenet): Network communication services
- [TheShard](../core-systems/index.md#theshard): Shard identification and state
- [Customize](../map/index.md#customize): World generation customization system
