---
id: usercommands
title: User Commands System
description: Slash command execution, permission management, and voting system for player commands
sidebar_position: 2
slug: api-vanilla/core-systems/usercommands
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# User Commands System

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **User Commands System** manages slash commands in Don't Starve Together, handling command registration, execution, permission checking, voting mechanisms, and rate limiting. It supports both built-in and mod-added commands with sophisticated permission levels and user targeting functionality.

## Usage Example

```lua
-- Register a simple command
AddUserCommand("hello", {
    params = {},
    aliases = {"hi", "greet"},
    description = "Say hello to everyone",
    localfn = function(params, caller)
        ChatHistory:SendCommandResponse("Hello from " .. caller.name .. "!")
    end
})

-- Register a user-targeting command with voting
AddUserCommand("kick", {
    params = {"user"},
    usermenu = true,
    vote = true,
    permission = COMMAND_PERMISSION.MODERATOR,
    cantargetadmin = true,
    voteminpasscount = 2,
    description = "Vote to kick a player",
    serverfn = function(params, caller)
        TheNet:Kick(UserToClientID(params.user))
    end
})
```

## Command Registration

### AddUserCommand(name, data) {#add-user-command}

**Status:** `stable`

**Description:**
Registers a new user command that can be executed via slash commands or UI menus.

**Parameters:**
- `name` (string): Command name (used in /commandname)
- `data` (table): Command configuration table

**Command Data Structure:**
```lua
{
    params = {"user", "reason"},           -- Parameter names in order
    paramsoptional = {false, true},        -- Which params are optional
    aliases = {"alias1", "alias2"},        -- Alternative command names
    permission = COMMAND_PERMISSION.ADMIN, -- Required permission level
    usermenu = true,                       -- Show in player context menu
    servermenu = true,                     -- Show in server commands menu
    vote = true,                          -- Allow voting if no permission
    confirm = true,                       -- Require confirmation dialog
    cantargetself = false,                -- Can target own user
    cantargetadmin = true,                -- Cannot target admin users
    voteminpasscount = 2,                 -- Minimum votes to pass
    voteminstartage = 300,                -- Min age to start vote (seconds)
    localfn = function(params, caller) end,  -- Client-side function
    serverfn = function(params, caller) end, -- Server-side function
    hasaccessfn = function(cmd, caller, target) end, -- Custom access check
    canstartfn = function(cmd, caller, target) end,  -- Custom start check
    votecanstartfn = function(cmd, caller, target) end, -- Custom vote check
    voteresultfn = function(params, results) end,    -- Vote result handler
}
```

**Example:**
```lua
AddUserCommand("teleport", {
    params = {"user"},
    permission = COMMAND_PERMISSION.ADMIN,
    usermenu = true,
    cantargetself = false,
    description = "Teleport to a player",
    localfn = function(params, caller)
        local target = UserToPlayer(params.user)
        if target and caller then
            caller.Transform:SetPosition(target.Transform:GetWorldPosition())
        end
    end
})
```

### RemoveUserCommand(name) {#remove-user-command}

**Status:** `stable`

**Description:**
Removes a previously registered user command and all its aliases.

**Parameters:**
- `name` (string): Command name to remove

**Example:**
```lua
RemoveUserCommand("teleport")
```

### AddModUserCommand(mod, name, data) {#add-mod-user-command}

**Status:** `stable`

**Description:**
Registers a user command from a mod. Commands are automatically cleaned up when the mod is unloaded.

**Parameters:**
- `mod` (string): Mod identifier
- `name` (string): Command name
- `data` (table): Command configuration (same as AddUserCommand)

**Example:**
```lua
-- In mod code
AddModUserCommand("mymod", "customcmd", {
    params = {},
    description = "My custom command",
    localfn = function(params, caller)
        print("Custom mod command executed!")
    end
})
```

## Command Execution

### RunUserCommand(commandname, params, caller, onserver) {#run-user-command}

**Status:** `stable`

**Description:**
Executes a user command with specified parameters. Handles permission checking and execution routing.

**Parameters:**
- `commandname` (string): Name of command to execute
- `params` (table): Parameter values keyed by parameter names
- `caller` (entity): Player entity executing the command
- `onserver` (boolean): Whether executing on server or client

**Example:**
```lua
-- Execute a kick command
local params = {user = "PlayerName", reason = "Griefing"}
RunUserCommand("kick", params, ThePlayer, false)
```

### RunTextUserCommand(input, caller, onserver) {#run-text-user-command}

**Status:** `stable`

**Description:**
Parses and executes a text command string (like from chat input).

**Parameters:**
- `input` (string): Full command string (e.g., "/kick PlayerName griefing")
- `caller` (entity): Player entity executing the command
- `onserver` (boolean): Whether executing on server or client

**Example:**
```lua
-- Parse and execute chat command
RunTextUserCommand("/kick BadPlayer being mean", ThePlayer, false)
```

## Permission System

### Permission Levels

| Level | Constant | Description | User Level |
|-------|----------|-------------|------------|
| 0 | N/A | No voting rights | Squelched users |
| 1 | N/A | Can vote | Regular users |
| 2 | `COMMAND_PERMISSION.MODERATOR` | Can moderate | Moderators |
| 3 | `COMMAND_PERMISSION.ADMIN` | Full access | Administrators |

### Permission Checking Functions

#### UserRunCommandResult(commandname, player, targetid) {#user-run-command-result}

**Status:** `stable`

**Description:**
Determines what execution result a user would get for a command.

**Parameters:**
- `commandname` (string): Command to check
- `player` (entity): Player attempting command
- `targetid` (string): Target user ID (for user-targeting commands)

**Returns:**
- (COMMAND_RESULT): Execution result type

**Result Types:**
```lua
COMMAND_RESULT.ALLOW     -- Can execute directly
COMMAND_RESULT.VOTE      -- Must use voting
COMMAND_RESULT.DENY      -- Temporarily blocked (squelched, vote active)
COMMAND_RESULT.DISABLED  -- Command disabled by custom logic
COMMAND_RESULT.INVALID   -- No access to command
```

#### CanUserAccessCommand(commandname, player, targetid) {#can-user-access-command}

**Status:** `stable`

**Description:**
Simple check if user has any access to a command (excludes INVALID results).

**Parameters:**
- `commandname` (string): Command to check
- `player` (entity): Player to check
- `targetid` (string): Target user ID

**Returns:**
- (boolean): True if user has access

#### CanUserStartCommand(commandname, player, targetid) {#can-user-start-command}

**Status:** `stable`

**Description:**
Checks if user can start a command (custom canstartfn validation).

**Parameters:**
- `commandname` (string): Command to check  
- `player` (entity): Player to check
- `targetid` (string): Target user ID

**Returns:**
- (boolean): True if can start
- (string): Error reason if cannot start

## User Resolution Functions

### UserToClient(input) {#user-to-client}

**Status:** `stable`

**Description:**
Converts various input formats to a client table. Supports player index, user ID, or player name matching.

**Parameters:**
- `input` (string|number): User identifier (index, ID, or name)

**Returns:**
- (table): Client table or nil if not found

**Matching Priority:**
1. Player listing index (1, 2, 3...)
2. Exact user ID match
3. Case-sensitive name match
4. Case-insensitive name match

**Example:**
```lua
-- Find by index
local client = UserToClient("1")  -- First player

-- Find by name
local client = UserToClient("PlayerName")

-- Find by user ID
local client = UserToClient("KU_AbCdEf12")
```

### UserToName(input) {#user-to-name}

**Status:** `stable`

**Description:**
Converts user input to player name string.

**Parameters:**
- `input` (string|number): User identifier

**Returns:**
- (string): Player name or nil

### UserToClientID(input) {#user-to-client-id}

**Status:** `stable`

**Description:**
Converts user input to client user ID.

**Parameters:**
- `input` (string|number): User identifier

**Returns:**
- (string): User ID or nil

### UserToPlayer(input) {#user-to-player}

**Status:** `stable`

**Description:**
Converts user input to player entity.

**Parameters:**
- `input` (string|number): User identifier

**Returns:**
- (entity): Player entity or nil

## Voting System

### Vote Command Requirements

For commands to support voting, they must specify:

```lua
{
    vote = true,                    -- Enable voting
    voteminpasscount = 2,          -- Minimum votes to pass
    voteresultfn = function(params, results)
        -- Return winning selection and vote count
        return "yes", results.yes
    end
}
```

### Vote Validation Functions

#### CanUserStartVote(commandname, player, targetid) {#can-user-start-vote}

**Status:** `stable`

**Description:**
Checks if user can start a vote for a command.

**Parameters:**
- `commandname` (string|number): Command name or hash
- `player` (entity): Player attempting to start vote
- `targetid` (string): Target user ID

**Returns:**
- (boolean): True if can start vote
- (string): Error reason if cannot start

### FinishVote(commandname, params, voteresults) {#finish-vote}

**Status:** `stable`

**Description:**
Processes completed vote results and executes command if passed.

**Parameters:**
- `commandname` (string): Command that was voted on
- `params` (table): Command parameters
- `voteresults` (table): Vote result data

**Returns:**
- (boolean): True if vote passed and command executed

## Rate Limiting

### Command Queue System

Commands are rate-limited to prevent spam:

```lua
SLASH_CMDS_PER_TICK_LIMIT = 10  -- Max commands per user per tick
```

### HandleUserCmdQueue() {#handle-user-cmd-queue}

**Status:** `stable`

**Description:**
Processes queued commands during update loop. Called automatically by the update system.

**Rate Limiting Behavior:**
- Tracks commands per user per tick
- Logs warning for users exceeding limit
- Drops excess commands to prevent lag

## Menu Integration

### GetUserActions(caller, targetid) {#get-user-actions}

**Status:** `stable`

**Description:**
Gets available user-targeting commands for context menus.

**Parameters:**
- `caller` (entity): Player viewing menu
- `targetid` (string): Target player ID

**Returns:**
- (table): Array of command info tables

**Command Info Structure:**
```lua
{
    commandname = "kick",
    prettyname = "Vote Kick",
    desc = "Vote to kick this player",
    exectype = COMMAND_RESULT.VOTE,
    menusort = 50,
    mod = "MyMod"  -- Optional, for mod commands
}
```

### GetServerActions(caller) {#get-server-actions}

**Status:** `stable`

**Description:**
Gets available server commands for admin/moderator menus.

**Parameters:**
- `caller` (entity): Player viewing menu

**Returns:**
- (table): Array of command info tables

## Command Properties

### String Properties

Commands can define localized strings:

```lua
-- In command definition
prettyname = "Vote Kick Player",
desc = "Start a vote to kick the target player",

-- Or use function for dynamic strings
prettyname = function(command) 
    return STRINGS.UI.COMMANDS[command.name:upper()]
end
```

### ResolveCommandStringProperty(command, property, default) {#resolve-command-string-property}

**Status:** `stable`

**Description:**
Resolves string properties from command definition, function, or localization strings.

**Parameters:**
- `command` (table): Command object
- `property` (string): Property name to resolve
- `default` (string): Default value if not found

**Returns:**
- (string): Resolved string value

## Emotes Integration

### GetEmotesWordPredictionDictionary() {#get-emotes-word-prediction-dictionary}

**Status:** `stable`

**Description:**
Creates word prediction dictionary for emote commands (used in chat autocomplete).

**Returns:**
- (table): Dictionary with words, delimiter, and display function

**Example:**
```lua
local emotes_dict = GetEmotesWordPredictionDictionary()
-- Returns: {
--     words = {"wave", "dance", "cheer", ...},
--     delim = "/",
--     GetDisplayString = function(word) return "/" .. word end
-- }
```

## Common Usage Patterns

### Basic Command Registration

```lua
AddUserCommand("heal", {
    params = {},
    permission = COMMAND_PERMISSION.ADMIN,
    description = "Restore full health",
    localfn = function(params, caller)
        if caller and caller.components.health then
            caller.components.health:SetVal(
                caller.components.health.maxhealth
            )
        end
    end
})
```

### User-Targeting Command with Voting

```lua
AddUserCommand("mute", {
    params = {"user", "duration"},
    paramsoptional = {false, true},
    usermenu = true,
    vote = true,
    permission = COMMAND_PERMISSION.MODERATOR,
    cantargetadmin = true,
    voteminpasscount = 3,
    description = "Mute a player",
    voteresultfn = function(params, results)
        return results.yes > results.no and "yes" or nil, results.yes
    end,
    serverfn = function(params, caller)
        local duration = tonumber(params.duration) or 300
        local userid = UserToClientID(params.user)
        TheNet:MuteUser(userid, duration)
    end
})
```

### Mod Command with Custom Validation

```lua
AddModUserCommand("mymod", "special", {
    params = {"target"},
    hasaccessfn = function(command, caller, targetid)
        -- Custom access logic
        return caller:HasTag("special_permission")
    end,
    canstartfn = function(command, caller, targetid)
        local target = UserToPlayer(targetid)
        if target and target:HasTag("boss") then
            return false, "Cannot target boss entities"
        end
        return true
    end,
    serverfn = function(params, caller)
        -- Custom command logic
    end
})
```

### Command with Confirmation Dialog

```lua
AddUserCommand("restart", {
    params = {},
    permission = COMMAND_PERMISSION.ADMIN,
    confirm = true,
    description = "Restart the server",
    serverfn = function(params, caller)
        TheNet:StartVote("restart", nil)
    end
})
```

## Platform-Specific Features

### Rail Platform Commands

For Windows Rail platform, additional functions are available:

#### RailUserCommandInject(name, displayname, displayparams, extra_alias) {#rail-user-command-inject}

**Status:** `stable` (Platform: WIN32_RAIL only)

**Description:**
Injects localized display names and parameters for Rail platform.

#### RailUserCommandRemove(name) {#rail-user-command-remove}

**Status:** `stable` (Platform: WIN32_RAIL only)

**Description:**
Removes commands for Rail platform.

## Error Handling

### Common Error Scenarios

```lua
-- Unknown command
RunTextUserCommand("/unknown", player, false)
-- Result: "Tried running unknown user command: unknown"

-- Insufficient parameters
RunTextUserCommand("/kick", player, false)
-- Result: ChatHistory message about missing parameters

-- Bad target user
local params = {user = "NonexistentPlayer"}
RunUserCommand("kick", params, player, false)
-- Result: "Unknown target user" error

-- Permission denied
RunUserCommand("ban", params, regular_player, false)
-- Result: "You are not allowed to use this command"
```

### Input Validation

The system automatically validates:
- Required parameters presence
- User existence for user-targeting commands
- Permission levels
- Vote requirements and timing
- Rate limiting compliance

## Performance Considerations

### Command Lookup Optimization

- Commands stored in hash tables for O(1) lookup
- Alias resolution cached
- User resolution prioritized by lookup speed

### Rate Limiting

- Per-user command queuing prevents spam
- Automatic cleanup of rate limit counters
- Warning logging for excessive usage

### Memory Management

- Mod commands automatically cleaned up
- Command queue cleared each tick
- No persistent storage of command history

## Related Systems

- [**Chat History**](./chathistory.md): Displays command responses and feedback
- [**Networking**](./networking.md): Handles client-server command communication
- [**Stats**](./stats.md): Tracks command usage metrics
- [**Frontend**](./frontend.md): Provides confirmation dialogs and UI integration
- [**World Voter**](../components/worldvoter.md): Manages voting mechanics

## Security Considerations

- Permission levels enforced at multiple points
- User input sanitized and validated
- Rate limiting prevents command flooding
- Vote manipulation protection through age requirements
- Admin-only commands cannot target other admins
- Custom validation functions for specialized access control
