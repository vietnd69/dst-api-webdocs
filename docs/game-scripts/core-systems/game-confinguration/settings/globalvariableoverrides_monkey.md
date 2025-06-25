---
id: globalvariableoverrides-monkey
title: Global Variable Overrides (Monkey)
description: Mod testing configuration with enabled warnings and mod support
sidebar_position: 7
slug: core-systems-globalvariableoverrides-monkey
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Global Variable Overrides (Monkey)

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `globalvariableoverrides_monkey.lua` file configures global variables specifically for mod testing environments. It enables mod functionality while disabling mod warnings, creating an optimal environment for mod development and testing.

## Configuration Variables

### DISABLE_MOD_WARNING

**Value:** `true`

**Status:** `stable`

**Description:** Disables warning messages that would normally appear when mods are loaded or active. This creates a cleaner testing environment by suppressing non-critical mod-related warnings.

**Purpose:**
- Reduces console noise during mod testing
- Allows focus on actual mod functionality rather than warnings
- Prevents warning spam in development environments
- Improves readability of debug output

### MODS_ENABLED

**Value:** `true`

**Status:** `stable`

**Description:** Explicitly enables mod support in the game environment. This ensures that the mod loading system is active and mods can be properly loaded and executed.

**Purpose:**
- Activates the mod loading framework
- Allows custom mod content to be loaded
- Enables mod API functionality
- Supports mod development workflow

## Usage Example

```lua
-- Content of globalvariableoverrides_monkey.lua
DISABLE_MOD_WARNING = true
MODS_ENABLED = true
```

## Implementation Details

### Mod Testing Environment
This configuration creates an environment optimized for:

#### Development Testing
- **Clean Output**: No warning noise cluttering debug messages
- **Full Mod Support**: Complete access to mod APIs and functionality
- **Rapid Iteration**: Quick testing cycles without warning interruptions
- **Debug Focus**: Clear visibility of actual mod issues vs system warnings

#### Mod Development Workflow
```lua
-- Example of how these settings affect mod loading
if MODS_ENABLED then
    -- Mod loading system is active
    -- Custom mod content can be loaded
    -- Mod APIs are available
end

if DISABLE_MOD_WARNING then
    -- Warning suppression is active
    -- Clean console output for debugging
    -- Focus on functional issues
end
```

### Variable Impact

| Variable | Effect | Development Benefit |
|----------|--------|-------------------|
| `DISABLE_MOD_WARNING` | Suppresses mod warnings | Cleaner debug output |
| `MODS_ENABLED` | Activates mod system | Full mod functionality access |

## Use Cases

### Primary Applications

1. **Mod Development**: Testing custom mods during development
2. **Integration Testing**: Verifying mod compatibility with game systems
3. **Performance Testing**: Measuring mod impact on game performance
4. **Quality Assurance**: Testing mod functionality before release

### Testing Scenarios

#### Single Mod Testing
```lua
-- Enable mod system for isolated mod testing
-- Disable warnings to focus on functionality
-- Ideal for: New mod development, bug fixing
```

#### Multi-Mod Compatibility
```lua
-- Test multiple mods together
-- Suppress warnings to identify real conflicts
-- Ideal for: Compatibility testing, integration verification
```

#### Performance Analysis
```lua
-- Measure mod performance impact
-- Clean output for accurate profiling
-- Ideal for: Optimization, resource usage analysis
```

## Configuration Management

### When to Use Monkey Overrides

1. **Active Mod Development**: Currently developing or testing mods
2. **Mod Compatibility Testing**: Verifying mods work together
3. **Pre-Release Testing**: Final testing before mod publication
4. **Debug Sessions**: Troubleshooting mod-related issues

### Environment Setup

#### Development Environment
```bash
# Copy monkey overrides for mod development
cp globalvariableoverrides_monkey.lua globalvariableoverrides.lua

# Verify configuration
grep -E "(DISABLE_MOD_WARNING|MODS_ENABLED)" globalvariableoverrides.lua
```

#### Testing Protocols
- **Baseline Test**: Test with clean overrides first
- **Mod Test**: Switch to monkey overrides for mod testing
- **Comparison**: Compare results between configurations
- **Documentation**: Record any behavior differences

## Best Practices

### Development Workflow

1. **Start Clean**: Begin testing with clean overrides
2. **Enable Mods**: Switch to monkey overrides for mod testing
3. **Monitor Output**: Watch for actual issues vs suppressed warnings
4. **Document Issues**: Note any problems found during testing
5. **Clean Deployment**: Remove test overrides for production

### Warning Management

#### Suppressed Warnings
With `DISABLE_MOD_WARNING = true`, these warnings are suppressed:
- Mod loading notifications
- Non-critical mod compatibility messages
- Development environment warnings
- Deprecated mod API usage notices

#### Still Visible Issues
Critical issues that still appear:
- Mod loading failures
- Syntax errors in mod code
- Critical compatibility problems
- Game-breaking mod conflicts

## Related Configuration Files

- [Base Overrides](./globalvariableoverrides.md): Template with no active overrides
- [Clean Overrides](./globalvariableoverrides_clean.md): Empty configuration file
- [PAX Server Overrides](./globalvariableoverrides_pax_server.md): Server event configuration

## Integration with Mod System

### Mod Loading Process
```lua
-- How monkey overrides affect mod loading
if MODS_ENABLED then
    -- 1. Mod directory scanning enabled
    -- 2. Mod metadata parsing active
    -- 3. Mod content loading allowed
    -- 4. Mod API registration enabled
    
    if DISABLE_MOD_WARNING then
        -- 5. Warning suppression active
        -- 6. Clean output for debugging
    end
end
```

### Development Tools Integration
- **Mod Manager**: Works with enabled mod system
- **Debug Console**: Cleaner output with suppressed warnings
- **Performance Profiler**: Accurate measurements without warning overhead
- **Automated Testing**: Consistent environment for mod testing
