---
id: networking-overview
title: Networking Overview
description: Overview of core networking systems for server management, client communication, and cluster coordination
sidebar_position: 0
slug: game-scripts/core-systems/networking-communication/networking
last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: networking-system
system_scope: network communication infrastructure and cluster management
---

# Networking Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Networking category provides the foundational network communication infrastructure for Don't Starve Together. These systems enable server-client communication, inter-shard coordination, data synchronization, and cluster management essential for multiplayer gameplay across distributed game worlds.

## Key Responsibilities

- **Server Management**: Host configuration, client connections, and session handling
- **RPC Communication**: Remote procedure calls between clients and server
- **Data Synchronization**: Network variables for real-time state sharing
- **Cluster Coordination**: Inter-shard communication and portal connectivity
- **Persistence Management**: Save data and world generation configuration storage

## Architecture Overview

### Network Communication Flow

```
[Client] ←→ [Server/Master Shard] ←→ [Secondary Shards]
    ↓               ↓                       ↓
[User Input] → [RPC Validation] → [State Sync]
    ↓               ↓                       ↓
[UI Updates] ← [NetVars Update] ← [World Events]
```

### Data Synchronization Layers

1. **Application Layer**: User commands, inventory actions, movement
2. **RPC Layer**: Validated remote procedure calls and responses
3. **NetVars Layer**: Automatic state synchronization between instances
4. **Cluster Layer**: Inter-shard communication and data sharing
5. **Persistence Layer**: Save data management and world configuration

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Networking](./networking.md) | stable | Server management and client connection system |
| 676042 | 2025-06-21 | [Network Client RPC](./networkclientrpc.md) | stable | Remote procedure call validation and processing |
| 676042 | 2025-06-21 | [Network Variables](./netvars.md) | stable | Network variable types and synchronization utilities |
| 676042 | 2025-06-21 | [Shard Index](./shardindex.md) | stable | Cluster shard data persistence and configuration |
| 676042 | 2025-06-21 | [Shard Networking](./shardnetworking.md) | stable | Inter-shard communication and portal connectivity |

## Common Integration Patterns

### Client-Server Communication
```lua
-- Send action from client to server
SendRPCToServer(RPC.LeftClick, action_code, x, z, target)

-- Synchronize health value across all clients
local health_netvar = net_float(inst.GUID, "health", "healthdirty")
health_netvar:set(current_health)
```

### Cross-Shard Coordination
```lua
-- Check if other worlds are available
if Shard_IsWorldAvailable("Caves") then
    -- Enable portal connections
    portal.components.worldmigrator:SetEnabled(true)
end

-- Sync boss defeats across shards
Shard_SyncBossDefeated("dragonfly", "Caves")
```

### Server Configuration
```lua
-- Configure dedicated server
local server_data = GetDefaultServerData()
server_data.name = "My DST Server"
server_data.max_players = 6

-- Save shard configuration
local shard_index = ShardIndex()
shard_index:SetServerShardData(world_options, server_data)
```

## Core Modules

| Module | Status | Purpose |
|-----|----|-----|
| [Networking](./networking.md) | stable | Core server management, client connections, and multiplayer features |
| [Network Client RPC](./networkclientrpc.md) | stable | Remote procedure call system for client-server communication |
| [Network Variables](./netvars.md) | stable | Network variable types and utilities for synchronized client-server communication |
| [Shard Networking](./shardnetworking.md) | stable | Inter-shard communication and synchronization system for cluster management |
| [Shard Index](./shardindex.md) | stable | Cluster shard management system for server data persistence and configuration |

## System Interactions

### Client Request Processing
1. **Input Capture**: Client captures user input (mouse clicks, keyboard)
2. **RPC Generation**: Client generates appropriate RPC with validation
3. **Server Processing**: Server validates and processes RPC request
4. **State Update**: Server updates game state and triggers NetVar changes
5. **Client Sync**: NetVars automatically sync updated state to all clients

### Cross-Shard Synchronization
1. **Event Detection**: Shard detects important game events (boss defeats, portal use)
2. **RPC Transmission**: Shard sends event data to master shard via SHARD_RPC
3. **Master Processing**: Master shard validates and broadcasts to relevant shards
4. **State Application**: Each shard applies synchronized state changes
5. **Confirmation**: Acknowledgment ensures consistency across cluster

### Data Persistence Flow
1. **Configuration Setup**: ShardIndex manages world generation and server settings
2. **Session Management**: Active session data tracked with unique identifiers
3. **Periodic Saves**: World state serialized and stored persistently
4. **Migration Support**: Save data enables seamless shard switching
5. **Recovery System**: Rollback capabilities for save corruption handling

## Network Variable Efficiency

### Type Selection Guidelines
- **net_bool**: Single-bit flags and boolean states
- **net_byte/net_shortint**: Small counters and enumerated values
- **net_float**: Health percentages and continuous values
- **net_string**: Player names and dynamic text
- **net_entity**: Object references and relationships

### Performance Considerations
- Use smallest appropriate netvar type to minimize bandwidth
- Avoid frequent updates to expensive array netvars
- Leverage `set_local()` for client-side predictions
- Group related state changes to reduce network traffic

## Security and Validation

### RPC Protection
- Parameter type validation using check* functions
- Position validation prevents teleportation exploits
- Rate limiting blocks RPC flooding attacks
- Server authority maintains game state integrity

### Data Integrity
- Session identifiers prevent save data corruption
- Version management handles save format upgrades
- Checksum validation ensures data consistency
- Rollback systems recover from corruption events

## Best Practices

### Network Design
1. **Minimize Bandwidth**: Choose optimal netvar types and avoid unnecessary updates
2. **Validate Everything**: Use provided validation functions for all RPC parameters
3. **Handle Failures**: Implement proper error handling for network operations
4. **Maintain Authority**: Server always has final authority over game state
5. **Plan for Scale**: Design systems to handle maximum player capacity

### Cluster Management
1. **Graceful Degradation**: Handle shard disconnections without breaking gameplay
2. **Consistent State**: Ensure critical data synchronized across all shards
3. **Performance Monitoring**: Track network performance and connection quality
4. **Recovery Procedures**: Implement automatic recovery from network failures
5. **Resource Management**: Monitor and limit resource usage across cluster

## Troubleshooting Guidelines

### Common Network Issues
- **RPC Validation Failures**: Check parameter types and value ranges
- **NetVar Synchronization**: Ensure identical declarations on server and clients
- **Shard Communication**: Verify portal bindings and world availability
- **Save Corruption**: Use rollback system and verify session identifiers
- **Performance Degradation**: Monitor bandwidth usage and optimize netvar updates

### Debugging Tools
- RPC logging for validation failure analysis
- NetVar dirty event tracking for sync issues
- Shard connection monitoring for cluster health
- Save data integrity verification utilities
- Network performance profiling capabilities

## Related Systems

- [Chat Commands](../chat-commands/): Player communication and admin command systems
- [Multiplayer](../multiplayer/): Multiplayer-specific UI and content delivery systems
- [Components](../../fundamentals/): Game object components with network integration
- [World Systems](../../world-systems/): World generation and entity management with cluster support
