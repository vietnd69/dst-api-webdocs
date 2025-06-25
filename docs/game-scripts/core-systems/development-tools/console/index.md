---
id: console-tools-overview
title: Console Tools Overview
description: Interactive command-line interface and hot-reload capabilities for DST development
sidebar_position: 0
slug: gams-scripts/core-systems/development-tools/console
last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: development-system
system_scope: console commands and live reloading
---

# Console Tools Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Console Tools category provides interactive command-line interface capabilities and live code reloading functionality for Don't Starve Together development. These tools enable rapid development iteration, debugging, and server administration through powerful console commands and hot-swapping capabilities.

### Key Responsibilities
- Provide comprehensive console command interface for debugging and administration
- Enable hot-swapping and live code reloading during development
- Support remote command execution for server management
- Facilitate rapid development iteration without game restarts
- Offer administrative tools for server operators

### System Scope
This category includes console command execution, live reloading systems, and development workflow tools, but excludes general debugging utilities and profiling tools which are covered in other development tool categories.

## Architecture Overview

### System Components
Console tools are designed as development-time utilities that provide direct access to game systems through command-line interfaces and live code modification capabilities.

### Data Flow
```
Developer Input → Console Interface → Command Processing → System Execution
       ↓                ↓                    ↓                  ↓
  Key Binding → Hot Reload Detection → Module Reload → Live Update
```

### Integration Points
- **All Game Systems**: Console commands can inspect and modify any game system
- **File System**: Hot reload monitors file changes and modification times
- **Networking**: Remote command execution for server administration
- **Class System**: Live reloading maintains inheritance relationships

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Console Commands](./consolecommands.md) | stable | Current command system |
| 676042 | 2025-06-21 | [Reload System](./reload.md) | stable | Current hot-reload system |

## Core Console Modules

### [Console Commands](./consolecommands.md)
Comprehensive command system for debugging, administration, and development tasks.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Console Commands](./consolecommands.md) | stable | Full command suite for development | 100+ commands, server admin, debugging |

**Key Command Categories:**
- **World Management**: Save, reset, regenerate world functions
- **Server Administration**: Player management, announcements, voting
- **Player Management**: Health, stats, godmode, teleportation
- **Entity Operations**: Spawn, give, find, remove entities
- **Debugging Tools**: State inspection, profiling, diagnostics

### [Reload System](./reload.md)
Hot-swapping and live reloading system for rapid development iteration.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Reload System](./reload.md) | stable | Live code reloading without restart | Hot-swap, class patching, file monitoring |

**Key Reload Features:**
- **Hot-Swapping**: Live module replacement preserving game state
- **Class Management**: Inheritance chain maintenance during reload
- **File Monitoring**: Automatic change detection and reload triggering
- **Error Recovery**: Safe rollback on failed reload attempts

## Common Console Patterns

### Basic Command Usage
```lua
-- Server administration
c_save()                          -- Save current world state
c_announce("Server restarting")   -- Send server announcement
c_listplayers()                   -- List connected players

-- Development debugging
c_godmode()                       -- Toggle invincibility
c_spawn("wilson")                 -- Spawn entity at cursor
c_teleport(100, 0, 200)          -- Teleport to coordinates
```

### Hot Reload Workflow
```lua
-- Manual module hot-swap
local success, err = hotswap("components/health")
if not success then
    print("Reload failed:", err)
end

-- Automatic reload on file change
ProbeReload(TheInput:IsKeyDown(KEY_F5))

-- Complete system reload
DoReload()  -- Checks all modified files and reloads
```

### Remote Command Execution
```lua
-- Execute commands on remote server
c_remote("c_spawn('deerclops')")
c_remote("c_announce('Welcome!')")
c_remote("TheWorld:PushEvent('ms_save')")
```

## Console System Dependencies

### Required Systems
- [System Core](../system-core/index.md): Engine integration and console access
- [Fundamentals](../../fundamentals/index.md): Entity system for command targets
- [Class System](../../fundamentals/core/index.md): Class registry for hot-reload inheritance

### Optional Systems
- [Networking](../../networking-communication/index.md): Remote command execution
- [User Interface](../../user-interface/index.md): Console UI integration
- [File System](../../data-management/index.md): File monitoring for hot-reload

## Performance Considerations

### Console Command Impact
- Commands execute efficiently without blocking game updates
- Remote commands use network optimization for server execution
- Entity operations respect game performance guidelines
- Administrative commands handle large player counts gracefully

### Hot-Reload Performance
- File monitoring uses efficient modification time checking
- Hot-swapping preserves object references to minimize memory impact
- Class patching operates in-place to avoid object recreation
- Garbage collection is triggered after reload operations

### Development vs Production
```lua
-- Console tools are development-only
if DEVELOPMENT_MODE or IsConsole() then
    -- Enable console commands and hot-reload
    ProbeReload(TheInput:IsKeyDown(RELOAD_KEY))
else
    -- Console tools disabled in production builds
end
```

## Development Guidelines

### Best Practices
- Use descriptive names for custom console commands
- Include help text and usage examples for new commands
- Test commands with various parameter combinations
- Clean up any persistent state when disabling development tools
- Guard console functionality with development mode checks

### Common Pitfalls
- Leaving development console enabled in production builds
- Creating commands that can destabilize multiplayer gameplay
- Not handling command errors gracefully
- Bypassing normal game systems without proper validation

### Testing Strategies
- Test console commands in both single-player and multiplayer
- Verify remote command execution works correctly
- Test hot-reload with complex inheritance hierarchies
- Validate command parameter handling with edge cases

## Console Integration Workflows

### Development Workflow
1. **Rapid Iteration**: Use hot-reload for immediate code changes
2. **State Manipulation**: Use console commands to set up test scenarios
3. **Debugging**: Apply commands to inspect and modify game state
4. **Testing**: Validate changes with console-driven test cases

### Administration Workflow
1. **Server Management**: Use save, restart, and maintenance commands
2. **Player Support**: Apply player management and assistance commands
3. **Content Management**: Spawn items or entities for events
4. **Monitoring**: Use diagnostic commands to check server health

### Debugging Workflow
1. **State Inspection**: Use entity and world inspection commands
2. **Problem Reproduction**: Set up problematic scenarios with console
3. **Live Testing**: Apply fixes via hot-reload and test immediately
4. **Validation**: Confirm fixes with console diagnostics

## Console Security Considerations

### Access Control
- Console commands require appropriate development privileges
- Administrative commands are restricted to authorized users
- File system access for hot-reload is limited to scripts directory
- Remote execution validates command safety

### Safe Usage Guidelines
- Never expose player data through console commands
- Validate all command inputs before execution
- Limit file system access to development-only paths
- Ensure console commands cannot be exploited in multiplayer

## Advanced Console Features

### Custom Command Development
```lua
-- Register custom console command
RegisterConsoleCommand("mycommand", function(param1, param2)
    print("Custom command with:", param1, param2)
    -- Command implementation
end, "Description of custom command")
```

### Automated Hot-Reload
```lua
-- Set up automatic reload monitoring
function CheckFileChanges()
    for filepath, lastmodtime in pairs(RequiredFilesForReload) do
        local currenttime = TheSim:GetFileModificationTime(filepath)
        if currenttime ~= lastmodtime then
            DoReload()
            break
        end
    end
end
```

### Console Integration Points
- **Input System**: Keyboard shortcuts for common commands
- **Networking**: Remote console for server administration
- **UI System**: Console interface and output display
- **File System**: Integration with development file monitoring

## Troubleshooting Console Issues

### Common Console Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Commands not executing | No response to console input | Check development mode enabled |
| Hot-reload failures | Modules not updating | Verify file paths and syntax |
| Remote commands failing | Network execution errors | Check server connection |
| Memory issues | Performance degradation | Clear console state, restart |

### Console Debugging Process
- Verify console initialization and development mode
- Check command syntax and parameter validation
- Test hot-reload with simple modules first
- Review error messages for specific failure reasons

## Console Tool Maintenance

### Regular Maintenance Tasks
- Update command help text when functionality changes
- Review and optimize frequently used command performance
- Clean up deprecated commands and update documentation
- Test console functionality with new game builds

### Console Evolution
- Add new commands based on development needs
- Improve hot-reload capabilities for complex scenarios
- Enhance remote execution security and reliability
- Better integration with external development tools

## Related Development Tools

- [Debugging Tools](../debugging/index.md): Complementary debugging utilities
- [Profiling Tools](../profiling/index.md): Performance analysis tools
- [Development Utilities](../utilities/index.md): Additional development helpers
- [System Core](../system-core/index.md): Core engine integration

## Console Success Metrics

- **Command Response Time**: Sub-100ms execution for common commands
- **Hot-Reload Speed**: Module updates complete within 1-2 seconds
- **Error Recovery**: Failed operations recover gracefully without crashes
- **Development Efficiency**: Significant reduction in restart-based iteration cycles

---

*Console tools provide the foundation for efficient DST development workflows through powerful command interfaces and live code modification capabilities.*
