---
id: networking-communication-overview
title: Networking & Communication Overview
description: Overview of network infrastructure, multiplayer systems, and communication frameworks for DST
sidebar_position: 0
slug: game-scripts/core-systems/networking-communication
last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: networking-system
system_scope: network communication infrastructure and multiplayer features
---

# Networking & Communication Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Networking & Communication category provides the foundational infrastructure for multiplayer gameplay in Don't Starve Together. This comprehensive system encompasses network communication protocols, chat and command systems, and multiplayer-specific features that enable seamless collaborative gameplay across distributed clients and server clusters.

### Key Responsibilities
- Establish and maintain client-server network connections
- Synchronize game state across all connected players
- Provide chat messaging and command execution systems
- Enable inter-shard communication for cluster management
- Deliver multiplayer-specific content and UI synchronization
- Manage server preferences and content filtering

### System Scope
This category includes all network communication protocols, client-server synchronization, chat systems, command frameworks, and multiplayer UI management but excludes game-specific logic (handled by Game Mechanics) and core engine functionality (handled by System Core).

## Architecture Overview

### System Components
The networking and communication infrastructure is built on a multi-layered architecture that separates transport protocols, data synchronization, user interaction, and multiplayer features.

### Communication Flow
```
Client Input → RPC Validation → Network Transport → Server Processing
     ↓              ↓               ↓                    ↓
Chat Commands → Command Parser → Permission Check → Vote System
     ↓              ↓               ↓                    ↓
UI Events → Popup Manager → Content Delivery → State Sync
     ↓              ↓               ↓                    ↓
User Output ← NetVar Updates ← Response Messages ← Action Results
```

### Data Synchronization Architecture
```
[Game State] → [NetVars] → [Network Layer] → [All Clients]
      ↓            ↓            ↓               ↓
[World Events] → [RPC Calls] → [Validation] → [State Updates]
      ↓            ↓            ↓               ↓
[Shard Sync] → [Cluster Mgmt] → [Portal System] → [Cross-Shard Travel]
```

### Integration Points
- **System Core**: Engine networking services and platform integration
- **World Systems**: Entity synchronization and world state management
- **User Interface**: Screen management and popup synchronization
- **Game Mechanics**: Action validation and command execution

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Networking](./networking/index.md) | stable | Core network infrastructure |
| 676042 | 2025-06-21 | [Chat Commands](./chat-commands/index.md) | stable | Chat and command systems |
| 676042 | 2025-06-21 | [Multiplayer](./multiplayer/index.md) | stable | Multiplayer-specific features |

## Core System Categories

### [Networking](./networking/index.md)
Core network communication infrastructure for client-server and cluster coordination.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Core Networking](./networking/networking.md) | stable | Server management and connections | Client handling, session management, RPC routing |
| [Network Client RPC](./networking/networkclientrpc.md) | stable | Remote procedure calls | Action validation, movement, inventory sync |
| [Network Variables](./networking/netvars.md) | stable | State synchronization | NetVar types, automatic sync, event handling |
| [Shard Networking](./networking/shardnetworking.md) | stable | Inter-shard communication | Cluster coordination, portal travel, boss sync |
| [Shard Index](./networking/shardindex.md) | stable | Cluster data management | Save persistence, world configuration |

### [Chat Commands](./chat-commands/index.md)
Communication and command execution systems for player interaction and server administration.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Chat History](./chat-commands/chathistory.md) | stable | Message storage and sync | Circular buffer, filtering, listener system |
| [User Commands](./chat-commands/usercommands.md) | stable | Command execution framework | Permission system, voting, rate limiting |
| [Built-in Commands](./chat-commands/builtinusercommands.md) | stable | Standard server commands | Admin tools, player commands, voting integration |
| [Vote Utilities](./chat-commands/voteutil.md) | stable | Voting system implementation | Vote tallying, validation, result processing |
| [Word Filter](./chat-commands/wordfilter.md) | stable | Content filtering system | Hash-based filtering, pattern matching |

### [Multiplayer](./multiplayer/index.md)
Multiplayer-specific systems for content delivery, UI synchronization, and player experience.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [MOTD Manager](./multiplayer/motdmanager.md) | stable | Content delivery system | Announcements, patch notes, image caching |
| [Popup Manager](./multiplayer/popupmanager.md) | stable | UI popup synchronization | RPC communication, screen management |
| [Server Preferences](./multiplayer/serverpreferences.md) | stable | Client preference management | Server filtering, profanity detection |

## Common Network Patterns

### Client-Server Communication
```lua
-- Send action from client to server
SendRPCToServer(RPC.LeftClick, action_code, x, z, target)

-- Synchronize health across all clients
local health_netvar = net_float(inst.GUID, "health", "healthdirty")
health_netvar:set(current_health)

-- Handle RPC on server (automatic validation)
-- RPC_HANDLERS[RPC.LeftClick] processes the request
```

### Chat and Command Integration
```lua
-- Register a command with voting
AddUserCommand("restart", {
    params = {},
    permission = COMMAND_PERMISSION.ADMIN,
    vote = true,
    votetimeout = 30,
    voteresultfn = VoteUtil.YesNoMajorityVote,
    serverfn = function(params, caller)
        TheNet:SendWorldResetRequestToServer()
    end
})

-- Send command response
ChatHistory:SendCommandResponse("Server restart initiated")
```

### Multiplayer Content Management
```lua
-- Access MOTD content
if TheMotdManager:IsEnabled() then
    local motd_info, sorted_keys = TheMotdManager:GetMotd()
    for i, key in ipairs(sorted_keys) do
        local content = motd_info[key]
        if content.data.category == "patchnotes" then
            DisplayPatchNotes(content)
        end
    end
end

-- Manage popup synchronization
POPUPS.COOKBOOK.fn(ThePlayer, true)  -- Open cookbook with RPC sync
```

### Cross-Shard Coordination
```lua
-- Check shard availability
if Shard_IsWorldAvailable("Caves") then
    portal.components.worldmigrator:SetEnabled(true)
end

-- Synchronize events across shards
Shard_SyncBossDefeated("dragonfly", "Forest")
```

## Network System Dependencies

### Required Systems
- [System Core](../system-core/index.md): Engine networking services and platform integration
- [Fundamentals](../fundamentals/index.md): Entity management and action systems
- [Data Management](../data-management/index.md): Save persistence and configuration storage

### Optional Systems
- [User Interface](../user-interface/index.md): Screen management and chat display
- [World Systems](../world-systems/index.md): Entity synchronization and world events
- [Mod Support](../mod-support/index.md): Custom RPC and command registration

## Performance Considerations

### Network Optimization
- NetVar types optimized for bandwidth efficiency (1-bit bools to 32-bit floats)
- RPC rate limiting prevents client flooding (20 RPCs per tick base limit)
- Chat history uses circular buffer to limit memory usage (100 messages max)
- Content delivery employs progressive loading and caching strategies

### Synchronization Efficiency
- Dirty event system triggers updates only when values change
- Command queue processing batches operations for network efficiency
- Shard communication minimizes cross-shard traffic through selective synchronization
- Vote state updates reduce bandwidth usage during active voting periods

### Memory Management
- Automatic cleanup of mod commands when mods are unloaded
- NetVar listener management prevents memory leaks
- Content cache management with automatic expiration
- Command history and rate limiting counters cleared each update cycle

## Development Guidelines

### Best Practices
- Always validate RPC parameters using provided check* functions
- Use smallest appropriate NetVar type to minimize bandwidth usage
- Implement proper permission checking for command systems
- Handle network failures gracefully with retry mechanisms
- Test all networking features in multiplayer environments

### Common Pitfalls
- Not validating RPC parameters can cause synchronization issues
- Using expensive array NetVars for frequently changing data
- Bypassing permission systems during development
- Not handling network latency in client predictions
- Creating commands without proper rate limiting considerations

### Testing Strategies
- Test RPC validation with various parameter combinations
- Verify NetVar synchronization across multiple clients
- Test command execution with different permission levels
- Validate vote systems with varying player counts
- Check network behavior during connection interruptions

## Network Security Framework

### RPC Security
- All RPC parameters validated using type-safe validation functions
- Position validation prevents teleportation and movement exploits
- Rate limiting blocks RPC flooding attacks and prevents server overload
- Server authority maintained for all critical game state decisions

### Command Security
- Multi-level permission system (User/Moderator/Admin)
- Vote requirements for sensitive operations prevent unauthorized actions
- Command cooldowns and rate limiting prevent abuse
- Input sanitization protects against injection attacks

### Content Security
- Word filtering system blocks inappropriate content
- Server preference system allows user-controlled content filtering
- Profanity detection with hash-based and pattern-based filtering
- Content validation ensures safe multiplayer environment

## System Integration Patterns

### With User Interface
Network systems drive UI presentations:
- Chat messages populate interface elements with formatting
- Command menus provide point-and-click access to slash commands
- Vote dialogs display real-time voting progress and options
- MOTD content appears in main menu announcement sections

### With World Systems
Network integration affects world state:
- Entity actions synchronized through RPC validation
- World events trigger NetVar updates across all clients
- Shard communication enables cross-world boss synchronization
- Portal travel coordinates cluster-wide player movement

### With Game Mechanics
Networking enables gameplay features:
- Inventory actions validated and synchronized through RPCs
- Crafting commands processed with server authority
- Player interactions coordinated across multiple clients
- Achievement and progression synchronized cluster-wide

## Troubleshooting Network Issues

### Common RPC Problems
| Issue | Symptoms | Solution |
|----|----|----|
| RPC validation failures | Actions not executing | Check parameter types and ranges |
| Rate limiting triggered | Commands being ignored | Reduce command frequency |
| Position validation errors | Movement/action failures | Verify player position validity |
| Mod RPC conflicts | Custom commands not working | Check namespace conflicts |

### Common NetVar Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Synchronization failures | Inconsistent client state | Ensure identical NetVar declarations |
| Performance degradation | Network lag | Use appropriate NetVar types |
| Memory leaks | Increasing memory usage | Properly manage NetVar listeners |
| Update frequency issues | Excessive network traffic | Avoid frequent array NetVar updates |

### Common Chat/Command Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Commands not executing | No response to slash commands | Check command registration and permissions |
| Chat not syncing | Missing messages | Verify network connectivity |
| Voting failures | Votes not completing | Check player count and requirements |
| Content filtering issues | Valid content blocked | Review filter patterns |

## Extension and Customization

### Adding Custom Network Features
- Use existing RPC patterns for new client-server communication
- Follow established NetVar conventions for state synchronization
- Leverage command framework for new administrative functionality
- Implement proper validation and security measures

### Network System Customization
- Register custom RPC handlers using mod RPC system
- Create specialized NetVar patterns for unique synchronization needs
- Extend command system with mod-specific commands
- Add custom content delivery through MOTD system extension

### Performance Optimization
- Profile network usage and optimize critical paths
- Implement efficient caching strategies for frequently accessed data
- Use compression techniques for large data transfers
- Monitor and tune rate limiting parameters for specific use cases

## Future Development Considerations

### Scalability Design
- Network architecture supports unlimited mod RPC registration
- Command system accommodates arbitrary custom commands
- Content delivery adapts to various platform requirements
- Vote utilities handle diverse voting patterns and requirements

### Integration Planning
- New network features should leverage existing validation patterns
- Communication systems should follow established RPC conventions
- UI synchronization should use popup manager for consistency
- Content delivery should integrate with established caching mechanisms

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [System Core](../system-core/index.md) | Platform layer | Engine services, platform networking |
| [User Interface](../user-interface/index.md) | Presentation layer | Screen management, chat display |
| [World Systems](../world-systems/index.md) | Game logic layer | Entity sync, world events |
| [Game Mechanics](../game-mechanics/index.md) | Gameplay layer | Action validation, command execution |

## Contributing Guidelines

### Adding Network Features
1. Follow established RPC patterns for client-server communication
2. Implement comprehensive parameter validation for security
3. Use appropriate NetVar types for optimal bandwidth usage
4. Consider cross-shard implications for cluster functionality
5. Test thoroughly in multiplayer environments with network variations

### Communication System Modifications
1. Maintain backward compatibility with existing command interfaces
2. Follow established patterns for permission and voting systems
3. Consider performance impact of message processing changes
4. Test synchronization behavior across multiple clients
5. Document any new command types or communication patterns

### Quality Standards
- All network communication must include proper validation
- RPC handlers must handle edge cases gracefully
- NetVar usage must be optimized for bandwidth efficiency
- Command systems must enforce appropriate security measures
- Integration points must be documented and validated
