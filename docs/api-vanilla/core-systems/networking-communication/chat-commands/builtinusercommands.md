---
title: Built-in User Commands System
description: Documentation of the Don't Starve Together built-in user commands for player interaction and server administration
sidebar_position: 3
slug: /api-vanilla/core-systems/builtinusercommands
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Built-in User Commands System

The Built-in User Commands system in Don't Starve Together provides a comprehensive set of predefined commands for player interaction, server administration, and game management. This system leverages the UserCommands framework to deliver essential functionality including chat commands, moderation tools, and voting mechanisms.

## Version History

| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 675312 | 2025-06-21 | stable | Updated documentation to match current implementation |

## Overview

The built-in user commands system serves multiple purposes:
- **Player Tools**: Essential commands for player communication and interaction
- **Server Administration**: Commands for server management and moderation
- **Voting System**: Democratic decision-making tools for community servers
- **Help System**: Built-in documentation and command discovery

The system is built on the UserCommands framework and includes permission-based access control, voting mechanisms, and extensive customization options.

## System Limitations

:::warning Current Limitations
Based on the source code comments, be aware of these limitations:

1. **Shard Support**: Shards are not fully supported yet. Only local commands or commands affecting master-server components work correctly across shards.
2. **Moderator Permissions**: `COMMAND_PERMISSION.MODERATOR` doesn't have full functionality yet.

These limitations are planned to be resolved in future updates.
:::

## Permission System

### Permission Levels

| Permission | Description | Access Level |
|------------|-------------|--------------|
| `COMMAND_PERMISSION.USER` | Basic player commands | All players |
| `COMMAND_PERMISSION.MODERATOR` | Moderation commands | Moderators and above |
| `COMMAND_PERMISSION.ADMIN` | Administrative commands | Administrators only |

### Command Properties

Each command can have these properties:

| Property | Type | Description |
|----------|------|-------------|
| `prettyname` | String | Display name for the command |
| `desc` | String | Description of command functionality |
| `permission` | Permission | Required permission level |
| `aliases` | Array | Alternative names for the command |
| `slash` | Boolean | Whether command uses slash prefix |
| `usermenu` | Boolean | Available in user context menu |
| `servermenu` | Boolean | Available in server menu |
| `params` | Array | Required parameters |
| `paramsoptional` | Array | Optional parameter flags |
| `vote` | Boolean | Whether command supports voting |
| `confirm` | Boolean | Requires confirmation before execution |

## Built-in Commands

### Player Commands

#### help Command

Provides command documentation and discovery:

```lua
AddUserCommand("help", {
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    params = {"commandname"},
    paramsoptional = {true},
    vote = false,
    localfn = function(params, caller)
        -- Display help information
    end,
})
```

**Usage**: 
- `/help` - Lists all available commands
- `/help <commandname>` - Shows detailed help for specific command

**Features**:
- Lists available commands with permissions
- Shows command syntax and parameters
- Provides command descriptions
- Handles unknown commands gracefully

#### emote Command

Enables player emotes and expressions:

```lua
AddUserCommand("emote", {
    aliases = { "e", "me" },
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    params = {"emotename"},
    paramsoptional = {false},
    vote = false,
    localfn = function(params, caller)
        -- Handle emote execution
    end,
})
```

**Usage**:
- `/emote <expression>` or `/e <expression>`
- `/me <action>`

**Features**:
- Supports predefined emote commands
- Allows freeform emote text
- Integrates with chat system
- Respects chat length limits

#### bug Command

Opens bug reporting interface:

```lua
AddUserCommand("bug", {
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    params = {},
    vote = false,
    localfn = function(params, caller)
        VisitURL("https://forums.kleientertainment.com/klei-bug-tracker/dont-starve-together/")
    end,
})
```

**Usage**: `/bug`

**Features**:
- Opens official bug tracker
- No parameters required
- Available to all players

#### rescue Command

Unsticks players from problematic positions:

```lua
AddUserCommand("rescue", {
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    usermenu = false,
    servermenu = true,
    menusort = 1,
    params = {},
    vote = false,
    serverfn = function(params, caller)
        if caller.PutBackOnGround ~= nil then
            caller:PutBackOnGround()
        end
    end,
})
```

**Usage**: `/rescue`

**Features**:
- Teleports player to safe ground
- Available in server menu
- No voting required
- Server-side execution

#### roll Command

Provides dice rolling functionality:

```lua
AddUserCommand("roll", {
    aliases = { "dice", "random", "diceroll" },
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    servermenu = true,
    menusort = 2,
    params = { "dice" },
    paramsoptional = { true },
    vote = false,
    canstartfn = function(command, caller, targetid)
        if GetTime() <= (caller._dicerollcooldown or 0) then
            return false, "COOLDOWN"
        end
        return true
    end,
    localfn = function(params, caller)
        -- Handle dice rolling logic
    end,
})
```

**Usage**:
- `/roll` - Rolls 1d100
- `/roll <sides>` - Rolls 1d<sides>
- `/roll <dice>d<sides>` - Rolls multiple dice

**Features**:
- Supports various dice formats
- Cooldown system prevents spam
- Public results visible to all players
- Multiple aliases available

### Moderation Commands

#### kick Command

Removes players from the server:

```lua
AddUserCommand("kick", {
    aliases = {"boot"},
    permission = COMMAND_PERMISSION.MODERATOR,
    confirm = true,
    slash = true,
    usermenu = true,
    params = {"user"},
    vote = true,
    votetimeout = 30,
    voteminstartage = 20,
    voteminpasscount = 3,
    votecountvisible = true,
    voteallownotvoted = true,
    localfn = function(params, caller)
        if params.user ~= nil then
            TheNet:Kick(UserToClientID(params.user) or params.user, 
                       caller == nil and TUNING.VOTE_KICK_TIME or nil)
        end
    end,
})
```

**Usage**: `/kick <username>`

**Features**:
- Supports voting mechanism
- Requires confirmation
- Available in user context menu
- Temporary kick duration for vote kicks

**Voting Parameters**:
- Timeout: 30 seconds
- Minimum start age: 20 seconds
- Minimum pass count: 3 votes
- Vote counts visible
- Allows non-voters

### Administrative Commands

#### ban Command

Permanently or temporarily bans players:

```lua
AddUserCommand("ban", {
    permission = COMMAND_PERMISSION.ADMIN,
    confirm = true,
    slash = true,
    usermenu = true,
    params = {"user", "seconds"},
    paramsoptional = {false, true},
    vote = false,
    localfn = function(params, caller)
        if params.user ~= nil then
            local clientid = UserToClientID(params.user) or params.user
            if params.seconds ~= nil then
                local seconds = tonumber(params.seconds)
                TheNet:BanForTime(clientid, seconds)
            else
                TheNet:Ban(clientid)
            end
        end
    end,
})
```

**Usage**:
- `/ban <username>` - Permanent ban
- `/ban <username> <seconds>` - Temporary ban

**Features**:
- Supports permanent and temporary bans
- Requires admin permissions
- Confirmation required
- Console-specific description

#### stopvote Command

Cancels active votes:

```lua
AddUserCommand("stopvote", {
    aliases = {"veto"},
    permission = COMMAND_PERMISSION.ADMIN,
    confirm = false,
    slash = true,
    params = {},
    vote = false,
    localfn = function(params, caller)
        TheNet:StopVote()
    end,
})
```

**Usage**: `/stopvote` or `/veto`

**Features**:
- Immediately cancels any active vote
- Admin-only command
- No confirmation required
- Multiple aliases

#### rollback Command

Reverts server to previous save:

```lua
AddUserCommand("rollback", {
    permission = COMMAND_PERMISSION.ADMIN,
    confirm = true,
    slash = true,
    servermenu = true,
    params = {"numsaves"},
    paramsoptional = {true},
    vote = true,
    votetimeout = 30,
    voteminstartage = 20,
    voteminpasscount = 3,
    serverfn = function(params, caller)
        TheWorld:DoTaskInTime(5, function(world)
            if world.ismastersim then
                TheNet:SendWorldRollbackRequestToServer(
                    params.numsaves ~= nil and tonumber(params.numsaves) or nil
                )
            end
        end)
    end,
})
```

**Usage**:
- `/rollback` - Rollback one save
- `/rollback <number>` - Rollback specified number of saves

**Features**:
- Supports voting system
- 5-second delay before execution
- Optional save count parameter
- Announcement system integration

#### regenerate Command

Resets the world to a new seed:

```lua
AddUserCommand("regenerate", {
    permission = COMMAND_PERMISSION.ADMIN,
    confirm = true,
    slash = true,
    servermenu = true,
    params = {},
    vote = true,
    votetimeout = 30,
    voteminstartage = 20,
    voteminpasscount = 3,
    serverfn = function(params, caller)
        TheWorld:DoTaskInTime(5, function(world)
            if world.ismastersim then
                TheNet:SendWorldResetRequestToServer()
            end
        end)
    end,
})
```

**Usage**: `/regenerate`

**Features**:
- Complete world reset
- Supports voting system
- 5-second delay before execution
- Admin confirmation required

## Voting System Integration

### Voting Properties

Commands that support voting use these properties:

| Property | Type | Description |
|----------|------|-------------|
| `vote` | Boolean | Enable voting for this command |
| `votetimeout` | Number | Vote duration in seconds |
| `voteminstartage` | Number | Minimum player age to start vote |
| `voteminpasscount` | Number | Minimum votes needed to pass |
| `votecountvisible` | Boolean | Show vote counts during voting |
| `voteallownotvoted` | Boolean | Allow non-voters in final tally |
| `voteoptions` | Array | Custom voting options |
| `votetitlefmt` | String | Vote title format string |
| `votenamefmt` | String | Vote name format string |
| `votepassedfmt` | String | Vote passed message format |

### Voting Functions

| Function | Description |
|----------|-------------|
| `votecanstartfn` | Determines if vote can be started |
| `voteresultfn` | Processes vote results |

### Common Voting Configuration

Most voting commands use these default settings:
- **Timeout**: 30 seconds
- **Minimum Start Age**: 20 seconds in-game
- **Minimum Pass Count**: 3 votes
- **Vote Counts Visible**: Yes
- **Allow Non-Voters**: Yes
- **Result Function**: Yes/No majority vote

## Implementation Examples

### Custom Command Creation

```lua
-- Example: Adding a custom command
AddUserCommand("mycommand", {
    prettyname = "My Custom Command",
    desc = "Does something custom",
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    usermenu = false,
    servermenu = false,
    params = {"parameter"},
    paramsoptional = {false},
    vote = false,
    localfn = function(params, caller)
        print("Custom command executed by", caller, "with param:", params.parameter)
    end,
})
```

### Command with Voting

```lua
-- Example: Command that supports voting
AddUserCommand("customvote", {
    prettyname = "Custom Vote Command",
    desc = "A command that requires voting",
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    params = {},
    vote = true,
    votetimeout = 45,
    voteminstartage = 30,
    voteminpasscount = 2,
    votecanstartfn = VoteUtil.DefaultCanStartVote,
    voteresultfn = VoteUtil.YesNoMajorityVote,
    serverfn = function(params, caller)
        print("Vote passed! Executing custom action...")
        -- Custom logic here
    end,
})
```

### Command with Access Control

```lua
-- Example: Command with custom access control
AddUserCommand("restrictedcmd", {
    prettyname = "Restricted Command",
    desc = "Only available under certain conditions",
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    params = {},
    hasaccessfn = function(command, caller)
        -- Custom access logic
        return caller ~= nil and caller:HasTag("special_access")
    end,
    localfn = function(params, caller)
        -- Command logic
    end,
})
```

### Command with Cooldown

```lua
-- Example: Command with cooldown system
AddUserCommand("cooldowncmd", {
    prettyname = "Cooldown Command",
    desc = "Has a cooldown period",
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    params = {},
    canstartfn = function(command, caller, targetid)
        local cooldown_key = "_mycooldown"
        if GetTime() <= (caller[cooldown_key] or 0) then
            return false, "COOLDOWN"
        end
        return true
    end,
    localfn = function(params, caller)
        -- Set cooldown
        caller._mycooldown = GetTime() + 60 -- 60 second cooldown
        
        -- Command logic here
        print("Command executed with cooldown")
    end,
})
```

## Error Handling and Validation

### Parameter Validation

```lua
-- Example: Command with parameter validation
AddUserCommand("validatedcmd", {
    prettyname = "Validated Command",
    desc = "Validates parameters before execution",
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    params = {"number", "text"},
    paramsoptional = {false, true},
    localfn = function(params, caller)
        -- Validate number parameter
        local num = tonumber(params.number)
        if not num or num < 1 or num > 100 then
            ChatHistory:SendCommandResponse({
                "Error: Number must be between 1 and 100"
            })
            return
        end
        
        -- Validate text parameter if provided
        if params.text and params.text:len() > 50 then
            ChatHistory:SendCommandResponse({
                "Error: Text must be 50 characters or less"
            })
            return
        end
        
        -- Execute command logic
        print("Valid parameters:", num, params.text or "none")
    end,
})
```

### Safe Execution

```lua
-- Example: Safe command execution with error handling
AddUserCommand("safecmd", {
    prettyname = "Safe Command",
    desc = "Handles errors gracefully",
    permission = COMMAND_PERMISSION.USER,
    slash = true,
    params = {},
    localfn = function(params, caller)
        local success, error_msg = pcall(function()
            -- Potentially unsafe operation
            if not caller or not caller:IsValid() then
                error("Invalid caller")
            end
            
            -- Command logic here
            print("Safe operation completed")
        end)
        
        if not success then
            print("Command error:", error_msg)
            ChatHistory:SendCommandResponse({
                "Command failed: " .. tostring(error_msg)
            })
        end
    end,
})
```

## Integration with Game Systems

### Chat System Integration

```lua
-- Commands automatically integrate with chat
-- Use ChatHistory:SendCommandResponse for feedback
local function SendHelp(caller, messages)
    if caller and caller.HUD then
        ChatHistory:SendCommandResponse(messages)
    end
end
```

### Network Integration

```lua
-- Server-side commands use TheNet for network operations
TheNet:Kick(clientid, duration)          -- Kick player
TheNet:Ban(clientid)                     -- Ban player
TheNet:BanForTime(clientid, seconds)     -- Temporary ban
TheNet:StopVote()                        -- Stop active vote
TheNet:DiceRoll(sides, count)            -- Dice roll
TheNet:AnnounceVoteResult(hash, result, passed) -- Vote announcement
```

### World Management Integration

```lua
-- World operations with proper timing
TheWorld:DoTaskInTime(5, function(world)
    if world.ismastersim then
        TheNet:SendWorldRollbackRequestToServer(save_count)
        -- or
        TheNet:SendWorldResetRequestToServer()
    end
end)
```

## Security Considerations

### Permission Validation

- Always validate permissions before command execution
- Use `hasaccessfn` for custom access control
- Respect admin/moderator hierarchies
- Validate user input thoroughly

### Anti-Spam Measures

- Implement cooldowns for frequently used commands
- Use rate limiting for resource-intensive operations
- Validate parameter ranges and formats
- Prevent command flooding

### Network Security

- Validate client IDs before network operations
- Use appropriate timeouts for network calls
- Handle network errors gracefully
- Log administrative actions for audit trails

## Best Practices

### Command Design

- **Clear Naming**: Use descriptive command names and aliases
- **Helpful Documentation**: Provide clear descriptions and usage examples
- **Parameter Validation**: Always validate user input
- **Error Handling**: Provide meaningful error messages
- **Appropriate Permissions**: Use correct permission levels

### Voting Implementation

- Set reasonable timeouts for votes
- Require minimum participation for validity
- Provide clear vote descriptions
- Handle vote cancellation gracefully
- Announce results appropriately

### Performance Considerations

- Use cooldowns to prevent spam
- Validate parameters before expensive operations
- Handle errors gracefully to prevent crashes
- Clean up resources after command execution
- Consider network latency in timing

## Related Systems

- [User Commands](../usercommands/index.md) - Core command system framework
- [Vote Utilities](../voteutil/index.md) - Voting system implementation
- [Chat System](../chat/index.md) - Chat integration and messaging
- [Network System](../networking/index.md) - Network operations and communication

## Status: 🟢 Stable

The Built-in User Commands system is stable and provides essential functionality for DST servers. The API is mature with ongoing improvements focusing on voting system enhancements and permission system refinements.
