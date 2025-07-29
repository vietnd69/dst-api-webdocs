---
id: chat-commands-overview
title: Chat Commands Overview
description: Overview of chat and command systems for player communication and server administration
sidebar_position: 0
slug: game-scripts/core-systems/networking-communication/chat-commands
last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: communication-system
system_scope: chat messaging and slash commands
---

# Chat Commands Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Chat Commands category provides comprehensive communication and command execution systems for Don't Starve Together. These systems enable player-to-player communication, server administration, voting mechanisms, and content moderation through integrated chat and slash command interfaces.

### Key Responsibilities
- Process and display chat messages with history management
- Execute slash commands with permission validation
- Provide voting systems for democratic server decisions
- Filter inappropriate content through word filtering
- Support built-in and mod-added command functionality

### System Scope
This category includes all chat messaging, command execution, and related communication features but excludes low-level networking protocols (handled by Networking) and UI rendering (handled by User Interface).

## Architecture Overview

### System Components
Chat command systems are built on a message-driven architecture where chat messages and commands flow through validation, processing, and distribution layers.

### Data Flow
```
User Input → Command Parser → Permission Check → Vote System → Execution
     ↓              ↓              ↓              ↓           ↓
Chat Message → Word Filter → History Storage → Network Sync → UI Display
```

### Integration Points
- **Networking**: Message synchronization and command distribution
- **User Interface**: Chat display widgets and command menus
- **World Systems**: Command execution affects world state
- **Data Management**: Chat history persistence and configuration

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Chat History](./chathistory.md) | stable | Current messaging system |
| 676042 | 2025-06-21 | [User Commands](./usercommands.md) | stable | Command execution framework |
| 676042 | 2025-06-21 | [Built-in Commands](./builtinusercommands.md) | stable | Standard server commands |
| 676042 | 2025-06-21 | [Vote Utilities](./voteutil.md) | stable | Voting system support |
| 676042 | 2025-06-21 | [Word Filter](./wordfilter.md) | stable | Content filtering system |

## Core Chat Command Modules

### [Chat History](./chathistory.md)
Message storage, synchronization, and filtering system.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| Chat History Manager | stable | Message storage and sync | Circular buffer, network sync, filtering |
| Message Types | stable | Chat message categorization | Player messages, emotes, announcements |
| Listener System | stable | Message notification callbacks | UI updates, event handling |

### [User Commands](./usercommands.md)
Core command execution framework with permission management.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| Command Registration | stable | Add/remove command definitions | Parameter validation, permission levels |
| Command Execution | stable | Parse and execute commands | Rate limiting, error handling |
| Permission System | stable | Access control and validation | User/moderator/admin levels |
| User Resolution | stable | Player identification utilities | Name/ID/index conversion |

### [Built-in User Commands](./builtinusercommands.md)
Predefined commands for server administration and player interaction.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| Player Commands | stable | User-accessible commands | Help, emote, rescue, dice roll |
| Moderation Commands | stable | Moderator tools | Kick with voting support |
| Administrative Commands | stable | Admin-only commands | Ban, rollback, regenerate |
| Menu Integration | stable | Context menu commands | User targeting, server actions |

### [Vote Utilities](./voteutil.md)
Voting system implementation and validation functions.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| Vote Result Functions | stable | Vote tallying algorithms | Unanimous, majority, yes/no variants |
| Vote Validation | stable | Vote start permission checking | Custom validation functions |
| Result Processing | stable | Vote outcome determination | Tie handling, minimum requirements |

### [Word Filter](./wordfilter.md)
Content filtering system for inappropriate language detection.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| Exact Match Filter | stable | Hash-based content blocking | Pre-computed hash lookup |
| Loose Match Filter | stable | Pattern-based filtering | Encoded pattern matching |
| Content Validation | stable | Message screening system | Real-time filtering |

## Common Chat Command Patterns

### Basic Command Registration
```lua
-- Register a simple user command
AddUserCommand("hello", {
    params = {},
    aliases = {"hi", "greet"},
    permission = COMMAND_PERMISSION.USER,
    description = "Say hello to everyone",
    localfn = function(params, caller)
        ChatHistory:SendCommandResponse("Hello from " .. caller.name .. "!")
    end
})
```

### Chat Message Processing
```lua
-- Add chat listener for message processing
local function ProcessChatMessage(chatMessage)
    if chatMessage.type == ChatTypes.Message then
        print(string.format("%s says: %s", chatMessage.sender, chatMessage.message))
    elseif chatMessage.type == ChatTypes.Announcement then
        print("Server announcement:", chatMessage.message)
    end
end

ChatHistory:AddChatHistoryListener(ProcessChatMessage)
```

### Voting Command Implementation
```lua
-- Command with voting system
AddUserCommand("restart", {
    params = {},
    permission = COMMAND_PERMISSION.ADMIN,
    vote = true,
    votetimeout = 30,
    voteminpasscount = 3,
    voteresultfn = VoteUtil.YesNoMajorityVote,
    description = "Vote to restart the server",
    serverfn = function(params, caller)
        TheNet:SendWorldResetRequestToServer()
    end
})
```

## Chat Command System Dependencies

### Required Systems
- [Networking](../networking/index.md): Message synchronization and command distribution
- [System Core](../../system-core/index.md): Engine integration for console and network access
- [Fundamentals](../../fundamentals/index.md): Basic entity and action systems

### Optional Systems
- [User Interface](../../user-interface/index.md): Chat display widgets and command menus
- [Data Management](../../data-management/index.md): Chat history persistence
- [Mod Support](../../mod-support/index.md): Custom command registration

## Performance Considerations

### Message Processing
- Chat history uses circular buffer to limit memory usage (100 messages max)
- Word filtering employs hash-based exact matching for O(1) lookup performance
- Command execution includes rate limiting to prevent spam (10 commands per tick limit)

### Network Optimization
- Chat history synchronization uses compressed data transfer
- Command responses are batched to reduce network overhead
- Vote state updates minimize bandwidth usage during active votes

### Memory Management
- Automatic cleanup of mod commands when mods are unloaded
- Chat listener management prevents memory leaks
- Command queue processing clears each update tick

## Development Guidelines

### Best Practices
- Always validate user input before command execution
- Use appropriate permission levels for command access control
- Implement proper error handling and user feedback
- Test commands in both single-player and multiplayer environments
- Follow established patterns for vote command implementation

### Common Pitfalls
- Not validating required parameters before execution
- Bypassing permission checks during development
- Creating commands that don't handle network latency properly
- Implementing voting without considering edge cases
- Not cleaning up command listeners and callbacks

### Testing Strategies
- Test all command parameter combinations and edge cases
- Verify permission enforcement at all access levels
- Test chat message filtering with various content types
- Validate voting mechanisms with different player counts
- Check command behavior during network interruptions

## Chat Command Integration Patterns

### With User Interface
Chat command systems drive UI presentations:
- Chat panels display message history with formatting
- Command menus provide point-and-click access to slash commands
- Vote dialogs show active voting progress and options
- Confirmation dialogs validate administrative actions

### With Networking
Commands integrate with network systems:
- Client-server command execution routing
- Vote state synchronization across all clients
- Chat message broadcasting with user targeting
- Permission validation using network player data

### With World Systems
Commands affect world state through:
- Administrative commands modifying world parameters
- Player management commands affecting entity states
- Voting commands triggering world events
- Chat emotes integrating with character animation systems

## Security and Moderation

### Permission Enforcement
- Multi-level permission system (User/Moderator/Admin)
- Command-specific access control with custom validation
- Vote requirements for sensitive operations
- Rate limiting to prevent command abuse

### Content Filtering
- Real-time word filtering for chat messages
- Hash-based exact matching for known problematic content
- Pattern-based loose matching for variations and obfuscation
- Context-aware filtering based on message type

### Anti-Abuse Measures
- Command cooldowns prevent rapid execution
- Vote age requirements prevent new player manipulation
- Target validation prevents invalid user selection
- Confirmation dialogs for irreversible actions

## Troubleshooting Chat Command Issues

### Common Chat Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Commands not executing | No response to slash commands | Check command registration and permissions |
| Chat history not syncing | Missing messages between clients | Verify network connectivity and chat sync |
| Voting not working | Votes fail to start or complete | Check player count and vote requirements |
| Word filter blocking valid content | Legitimate messages filtered | Review filter patterns and context |

### Debugging Chat Systems
- Use chat debug commands to inspect message flow
- Check command registration with help system
- Verify vote state with voting debug tools
- Review network logs for synchronization issues

### Performance Debugging
- Monitor chat history buffer usage and turnover
- Check command execution rate limiting effectiveness
- Analyze word filter performance impact
- Review vote system network traffic patterns

## Extension and Customization

### Adding Custom Commands
- Use AddUserCommand for standard command registration
- Use AddModUserCommand for mod-specific commands
- Implement custom permission validation functions
- Create specialized vote result functions for unique requirements

### Chat System Customization
- Register custom chat message listeners
- Implement specialized message formatting
- Add custom content filtering rules
- Create command aliases for user convenience

### Voting System Extensions
- Develop custom vote validation functions
- Implement specialized vote result algorithms
- Create vote timeout and requirement configurations
- Add custom vote announcement systems

## Future Development Considerations

### Extensibility Design
- Command system supports unlimited custom commands
- Chat message types can be extended for new functionality
- Vote utilities accommodate diverse voting patterns
- Word filter supports dynamic pattern updates

### Integration Planning
- New chat features should leverage existing message infrastructure
- Command additions should follow established permission patterns
- Vote systems should consider multiplayer scalability
- Content filtering should adapt to evolving moderation needs

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [Networking](../networking/index.md) | Message transport | RPC calls, state sync, broadcast |
| [User Interface](../../user-interface/index.md) | Display layer | Chat panels, command menus, dialogs |
| [World Systems](../../world-systems/index.md) | Command effects | World state modification, entity targeting |
| [Mod Support](../../mod-support/index.md) | Extensibility | Custom command registration, cleanup |

## Contributing Guidelines

### Adding New Commands
1. Choose appropriate permission level for command function
2. Implement proper parameter validation and error handling
3. Add comprehensive help text and usage examples
4. Test with various user permission levels and scenarios
5. Consider voting requirements for community-affecting commands

### Chat System Modifications
1. Maintain backward compatibility with existing message types
2. Follow established patterns for message listener implementation
3. Consider performance impact of message processing changes
4. Test synchronization behavior in multiplayer environments
5. Document any new message types or processing behaviors

### Quality Standards
- All commands must include descriptive help text
- Vote commands must handle edge cases gracefully
- Chat processing must maintain acceptable performance
- Content filtering changes require thorough testing
- Integration points must be documented and validated
