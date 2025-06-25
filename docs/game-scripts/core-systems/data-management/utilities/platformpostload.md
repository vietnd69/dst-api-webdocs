---
id: platformpostload
title: Platform Post Load
description: Platform-specific configuration and tweaks applied after game initialization for different gaming platforms
sidebar_position: 2
slug: game-scripts/core-systems/platformpostload
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Platform Post Load

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `platformpostload.lua` module provides platform-specific tweaks and configurations that are applied after the main game initialization. It avoids polluting the core game code with inline platform branching by centralizing platform-specific modifications in a dedicated module.

## Purpose

This module serves as a post-initialization hook for applying platform-specific modifications including:
- Custom voting mechanics for specific platforms
- Localized command injection for regional markets
- Platform-specific command modifications
- Regional compliance adjustments

## Platform Support

### WIN32_RAIL Platform

**Status:** `stable`

**Description:**
Special configuration for the Chinese WeGame/Rail platform that includes enhanced voting mechanics and Chinese language command support.

## Voting System Modifications

### YesNoTwoThirdsVote(params, voteresults) {#yes-no-two-thirds-vote}

**Status:** `stable`

**Platform:** `WIN32_RAIL`

**Description:**
Custom vote result function that requires a two-thirds majority for kick votes to pass, providing enhanced player protection against vote abuse.

**Parameters:**
- `params` (table): Vote parameters
- `voteresults` (table): Vote results containing option counts

**Returns:**
- (number): Vote result option (1 for yes, nil for no/insufficient)
- (number): Vote count for the winning option

**Logic:**
```lua
if voteresults.options[1] >= 2 * voteresults.options[2] then
    return 1, voteresults.options[1]
end
```

**Example:**
```lua
-- Applied automatically to kick command on WIN32_RAIL platform
local kick_command = UserCommands.GetCommandFromName("kick")
kick_command.voteresultfn = YesNoTwoThirdsVote

-- Example vote scenario:
-- Yes votes: 6, No votes: 2
-- 6 >= 2 * 2 (4) = true, kick passes
-- Yes votes: 5, No votes: 3  
-- 5 >= 2 * 3 (6) = false, kick fails
```

## Command Localization

### RailUserCommandInject Function Calls

**Status:** `stable`

**Platform:** `WIN32_RAIL`

**Description:**
Injects Chinese language equivalents for standard user commands to improve accessibility for Chinese players.

### User Commands

The following user commands are injected with Chinese translations:

| English Command | Chinese Command | Chinese Aliases | Parameters |
|----------------|-----------------|-----------------|------------|
| `help` | `帮助` | `指令` | - |
| `emote` | `表情` | - | `表情姓名` |
| `rescue` | `救命` | - | - |
| `kick` | `踢出` | - | `用户` |
| `ban` | `封禁` | - | `用户`, `秒` |
| `stopvote` | `停止投票` | - | - |
| `roll` | `摇骰子` | - | `骰子` |
| `rollback` | `回滚` | - | `保存次数` |
| `regenerate` | `重新生成` | - | - |

**Example:**
```lua
-- These commands become available on WIN32_RAIL platform:
RailUserCommandInject("help", "帮助", {"指令"})
RailUserCommandInject("kick", "踢出", {"用户"})
RailUserCommandInject("ban", "封禁", {"用户", "秒"})

-- Players can now use:
-- /help or /帮助 or /指令
-- /kick player or /踢出 player
-- /ban player 60 or /封禁 player 60
```

### Emote Commands

The following emote commands are injected with Chinese translations:

| English Emote | Chinese Emote | Alternative |
|---------------|---------------|-------------|
| `wave` | `挥手` | `再见` |
| `rude` | `挑事` | - |
| `happy` | `快乐` | - |
| `angry` | `愤怒` | - |
| `cry` | `哭` | - |
| `no` | `不` | - |
| `joy` | `喜悦` | - |
| `dance` | `舞蹈` | - |
| `sit` | `坐下` | - |
| `squat` | `蹲坐` | - |
| `bonesaw` | `锯` | - |
| `facepalm` | `叹` | - |
| `kiss` | `吻` | - |
| `pose` | `姿势` | - |
| `toast` | `干杯` | - |

**Example:**
```lua
-- These emote commands become available:
RailUserCommandInject("wave", "挥手", nil, "再见")
RailUserCommandInject("happy", "快乐")
RailUserCommandInject("dance", "舞蹈")

-- Players can now use:
-- /wave or /挥手 or /再见
-- /happy or /快乐
-- /dance or /舞蹈
```

## Command Removal

### RailUserCommandRemove Function Calls

**Status:** `stable`

**Platform:** `WIN32_RAIL`

**Description:**
Removes specific commands that may not be appropriate or necessary for the target platform.

**Removed Commands:**
- `bug`: Bug reporting command removed (likely replaced with platform-specific reporting)

**Example:**
```lua
RailUserCommandRemove("bug")
-- The /bug command is no longer available on WIN32_RAIL platform
```

## Platform Detection

### Platform Identification

**Constant:** `PLATFORM`

**Description:**
The module uses the global `PLATFORM` constant to determine the current gaming platform and apply appropriate modifications.

**Supported Platforms:**
- `WIN32_RAIL`: Chinese WeGame/Rail platform with enhanced localization

**Example:**
```lua
if PLATFORM == "WIN32_RAIL" then
    -- Apply Chinese platform-specific modifications
    -- Enhanced voting mechanics
    -- Chinese command localization
    -- Regional compliance features
end
```

## Integration Examples

### Custom Platform Addition

```lua
-- Example of adding support for a new platform
if PLATFORM == "NEW_PLATFORM" then
    -- Apply platform-specific modifications
    local custom_vote_fn = function(params, voteresults)
        -- Custom voting logic for new platform
        return 1, voteresults.options[1]
    end
    
    local kick_command = UserCommands.GetCommandFromName("kick")
    kick_command.voteresultfn = custom_vote_fn
    
    -- Inject localized commands
    CustomPlatformCommandInject("help", "aide")
    CustomPlatformCommandInject("kick", "expulser", {"utilisateur"})
end
```

### Voting System Integration

```lua
-- The modified voting system integrates with the existing vote infrastructure
local function HandleKickVote(voter, target)
    -- Vote is initiated normally
    local vote_data = {
        command = "kick",
        target = target,
        initiator = voter
    }
    
    -- On WIN32_RAIL, YesNoTwoThirdsVote will be called automatically
    -- Requires 2/3 majority instead of simple majority
    TheWorld.components.voter:StartVote(vote_data)
end
```

### Command Usage Example

```lua
-- Example of how localized commands work in practice
local function ProcessUserInput(player, command_text)
    -- Both English and Chinese commands are recognized
    if command_text == "/help" or command_text == "/帮助" or command_text == "/指令" then
        ShowHelpDialog(player)
    elseif command_text:match("^/kick") or command_text:match("^/踢出") then
        ProcessKickCommand(player, command_text)
    elseif command_text:match("^/wave") or command_text:match("^/挥手") or command_text:match("^/再见") then
        player.components.playeractionpicker:DoAction(ACTIONS.WAVE)
    end
end
```

## Debug Information

### Loading Notification

**Debug Output:**
```lua
Print(VERBOSITY.DEBUG, "[Loading platformpostload]")
```

**Description:**
Debug message printed during module loading to confirm platform-specific modifications are being applied.

**Usage:**
```lua
-- Enable debug verbosity to see platform loading
c_setverbosity(VERBOSITY.DEBUG)
-- Output: [Loading platformpostload]
```

## Dependencies

### Required Modules

- `usercommands`: Provides access to user command system for modifications
- Global `PLATFORM`: Platform identification constant
- `RailUserCommandInject`: Platform-specific command injection function
- `RailUserCommandRemove`: Platform-specific command removal function

### Integration Points

- **User Command System**: Modifies existing commands and adds localized variants
- **Voting System**: Enhances voting mechanics for specific platforms
- **Emote System**: Adds localized emote commands
- **Debug System**: Integrates with game's debug output system

## Regional Compliance

### Chinese Market Adaptations

**Platform:** `WIN32_RAIL`

**Features:**
- **Enhanced Vote Protection**: Two-thirds majority requirement prevents vote abuse
- **Native Language Support**: Full Chinese command localization
- **Cultural Adaptation**: Emote commands with culturally appropriate translations
- **Regional Command Set**: Platform-appropriate command availability

## Best Practices

### Platform-Specific Development

1. **Centralized Configuration**: Keep platform modifications in dedicated modules
2. **Conditional Loading**: Use platform detection to avoid unnecessary code execution
3. **Localization Support**: Provide native language alternatives for user-facing commands
4. **Regional Compliance**: Adapt game mechanics to meet regional requirements
5. **Debug Visibility**: Include loading notifications for troubleshooting

### Command Localization Guidelines

```lua
-- Good: Provide meaningful translations
RailUserCommandInject("rescue", "救命")  -- "rescue" -> "help/save me"

-- Good: Include cultural alternatives
RailUserCommandInject("wave", "挥手", nil, "再见")  -- "wave" -> "wave hand" or "goodbye"

// Good: Maintain consistent parameter naming
RailUserCommandInject("kick", "踢出", {"用户"})  // "user" parameter in Chinese
```

## Security Considerations

### Vote Protection

**Enhanced Security:** The two-thirds voting requirement on WIN32_RAIL platform provides additional protection against coordinated vote abuse, requiring broader consensus for player kicks.

**Impact:** Reduces false positive kicks while maintaining legitimate moderation capabilities.

## Related Modules

- [User Commands](./builtinusercommands.md): Base user command system that gets modified
- [Console Commands](./consolecommands.md): Alternative command interface
- [Player Actions](./actions.md): Action system used by emote commands
- [Voting System](./voting.md): Core voting mechanics enhanced by platform modifications
- [Debug System](./debugprint.md): Debug output system used for loading notifications
