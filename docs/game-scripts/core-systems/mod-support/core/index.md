---
id: mod-support-core-overview
title: Mod Support Core Overview
description: Overview of core mod system functionality in DST API
sidebar_position: 0

last_updated: 2025-01-22
build_version: 676042
change_status: stable
category_type: mod-core-system
system_scope: core mod loading and management
---

# Mod Support Core Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-01-22**

## System Purpose

The Mod Support Core category provides the fundamental infrastructure for mod loading, management, and integration within Don't Starve Together. These systems form the foundation that enables all mod functionality, from discovery and loading to configuration management and compatibility handling.

### Key Responsibilities
- Mod discovery, registration, and loading management
- Mod environment creation and sandboxing
- Configuration management and persistence
- Version compatibility and upgrade handling
- Error handling and crash recovery for mod operations

### System Scope
This category includes core mod infrastructure components but excludes DLC-specific functionality (handled by DLC Support) and higher-level mod utilities.

## Architecture Overview

### System Components
The core mod system is built on a layered architecture where the base mod loading system provides the foundation for configuration management, environment creation, and compatibility handling.

### Data Flow
```
Mod Discovery → Registration → Configuration → Environment Setup → Loading
      ↓              ↓              ↓               ↓              ↓
   File Scan → Mod Index → Config Load → Sandbox Create → Code Execute
```

### Integration Points
- **Asset Loading**: Mod-specific assets and resources
- **Networking**: Server-client mod synchronization
- **Save System**: Mod state and configuration persistence
- **Error System**: Crash detection and recovery mechanisms

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-01-22 | [Mods System](./mods.md) | stable | Current mod loading system |
| 676042 | 2025-01-22 | [Mod Index](./modindex.md) | stable | Current mod registry system |
| 676042 | 2025-01-22 | [Mod Utilities](./modutil.md) | stable | Current utility functions |
| 676042 | 2025-01-22 | [Mod Compatibility](./modcompatability.md) | stable | Current compatibility system |

## Core Mod Modules

### [Mods System](./mods.md)
Foundation system for mod loading and environment management.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Mods](./mods.md) | stable | Core mod loading and management | Discovery, loading, environment creation |

**Key Functions:**
- `AreAnyModsEnabled()`: Check if mods are active
- `GetEnabledModNamesDetailed()`: Get detailed mod information
- `GetModVersion()`: Retrieve mod version information
- `CurrentRelease.GreaterOrEqualTo()`: Version compatibility checking

### [Mod Index](./modindex.md)
Registry and information management for all installed mods.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Mod Index](./modindex.md) | stable | Mod registry and state management | Registration, configuration, state tracking |

**Key Functions:**
- `KnownModIndex:IsModEnabled()`: Check mod status
- `KnownModIndex:GetModInfo()`: Retrieve mod information
- `KnownModIndex:LoadModConfigurationOptions()`: Load mod settings
- `KnownModIndex:EnableMod()` / `DisableMod()`: State management

### [Mod Utilities](./modutil.md)
Essential utility functions and environment setup for mod development.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Mod Utilities](./modutil.md) | stable | Development utilities and helpers | Error handling, environment setup, character management |

**Key Functions:**
- `moderror()` / `modassert()` / `modprint()`: Error handling and debugging
- `GetModConfigData()`: Configuration access
- `AddModCharacter()`: Character registration
- Environment setup functions for various game systems

### [Mod Compatibility](./modcompatability.md)
Version upgrade and compatibility handling system.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Mod Compatibility](./modcompatability.md) | stable | Version compatibility and upgrades | Data structure migration, compatibility validation |

**Key Functions:**
- `UpgradeModLevelFromV1toV2()`: Level data format upgrades
- Version validation and migration utilities

## Common Mod Core Patterns

### Mod Status Checking
```lua
-- Check if any mods are enabled
if AreAnyModsEnabled() then
    print("Mods are active in this session")
end

-- Check specific mod status
if KnownModIndex:IsModEnabled("workshop-12345") then
    -- Mod-specific functionality
end
```

### Mod Information Retrieval
```lua
-- Get detailed mod information
local modinfo = KnownModIndex:GetModInfo("mymod")
if modinfo then
    print("Mod:", modinfo.name)
    print("Version:", modinfo.version)
    print("API Version:", modinfo.api_version)
end

-- Get all enabled mods
local enabled_mods = GetEnabledModNamesDetailed()
for i, mod_details in ipairs(enabled_mods) do
    print("Enabled mod:", mod_details)
end
```

### Configuration Management
```lua
-- Load mod configuration (within mod environment)
local config_value = GetModConfigData("option_name")

-- Load configuration manually
local config = KnownModIndex:LoadModConfigurationOptions("mymod", false)
```

### Error Handling in Mods
```lua
-- Proper mod error handling
modassert(condition, "This condition must be true")
moderror("Something went wrong in mod operation")
modprint("Debug information") -- Only prints if debug enabled
```

## System Dependencies

### Required Systems
- [System Core](../../system-core/index.md): Engine integration and file system access
- [Data Management](../../data-management/index.md): Configuration persistence and save data
- [Fundamentals](../../fundamentals/index.md): Basic entity and component systems

### Optional Systems
- [User Interface](../../user-interface/index.md): Mod management screens and configuration UI
- [Networking](../../networking-communication/index.md): Server-client mod synchronization
- [Development Tools](../../development-tools/index.md): Enhanced debugging and profiling for mods

## Performance Considerations

### Memory Usage
- Mod environments use isolated memory spaces to prevent conflicts
- Configuration data is cached to reduce file system access
- Mod registry maintains efficient lookup structures for enabled mods

### Performance Optimizations
- Lazy loading of mod configuration data
- Efficient mod discovery using cached directory scans
- Optimized mod loading order based on dependency analysis

### Scaling Considerations
- System supports dozens of concurrent mods without performance degradation
- Memory usage scales linearly with number of enabled mods
- Configuration system handles complex mod settings efficiently

## Development Guidelines

### Best Practices
- Always use mod utility functions for error handling and debugging
- Validate mod configuration data before use
- Use proper dependency declaration in modinfo.lua
- Follow the established patterns for environment setup

### Common Pitfalls
- Not using modassert/moderror for proper error context
- Accessing configuration data outside the mod environment
- Bypassing the mod loading system for custom initialization
- Not handling mod compatibility across different API versions

### Testing Strategies
- Test mod loading with various combinations of other mods
- Verify configuration persistence across save/load cycles
- Test compatibility with different game versions
- Validate error handling with corrupted mod data

## System Integration Patterns

### With Asset Loading
Mod core systems coordinate with asset loading to:
- Register mod-specific assets during loading phase
- Handle asset conflicts between multiple mods
- Provide fallback mechanisms for missing assets
- Enable hot-reloading of mod assets during development

### With Save System
Core mod systems integrate with save data to:
- Persist mod configuration across game sessions
- Handle save compatibility when mods are added/removed
- Maintain mod state information in save files
- Provide migration paths for changed mod configurations

### With Networking
Mod core systems work with networking to:
- Synchronize server mod lists with connecting clients
- Validate client-server mod compatibility
- Handle mod configuration synchronization
- Manage mod-specific network messages and RPCs

## Troubleshooting Mod Core Issues

### Common Mod Core Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Mod not loading | Mod missing from enabled list | Check mod directory structure and modinfo.lua |
| Configuration not saving | Settings reset on restart | Verify configuration file permissions |
| Version conflicts | Mod incompatibility errors | Check API version requirements |
| Memory leaks | Performance degradation | Review mod environment cleanup |

### Debugging Mod Core Systems
- Use `modprint()` for debug output during development
- Check mod loading sequence with detailed mod names
- Verify mod registry state with `KnownModIndex` functions
- Review error logs for mod loading failures

### Performance Monitoring
- Monitor mod loading times during startup
- Track memory usage of mod environments
- Check configuration file access patterns
- Analyze dependency resolution performance

## Advanced Mod Core Features

### Mod Loading Sequence
1. **Discovery Phase**: Scan directories for valid mods
2. **Registration Phase**: Register mods with KnownModIndex
3. **Configuration Phase**: Load mod settings and options
4. **Environment Phase**: Create isolated execution environments
5. **Loading Phase**: Execute mod code in dependency order
6. **Integration Phase**: Register mod content with game systems

### Error Recovery Mechanisms
- Automatic detection of mod crashes during loading
- Safe fallback modes when problematic mods are detected
- Mod isolation to prevent cascading failures
- Recovery procedures for corrupted mod configurations

### Compatibility Management
- API version validation for mod requirements
- Release ID checking for feature availability
- Automatic upgrade of legacy mod data formats
- Deprecation warnings for outdated mod patterns

## Future Development

### Extensibility Design
- Mod core systems designed for easy extension with new features
- Plugin architecture allows additional mod utilities
- Configuration system supports dynamic option types
- Environment system accommodates new game API additions

### Integration Planning
- New core features should leverage existing mod infrastructure
- Consider backward compatibility for existing mod ecosystem
- Plan for enhanced debugging and profiling capabilities
- Design for improved mod development workflow support

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [DLC Support](../dlc/index.md) | Extension | DLC-specific mod functionality |
| [Development Tools](../../development-tools/index.md) | Enhancement | Enhanced debugging for mods |
| [User Interface](../../user-interface/index.md) | Integration | Mod management screens |
| [Networking](../../networking-communication/index.md) | Integration | Mod synchronization protocols |

## Contributing to Mod Core

### Adding New Core Features
- Follow established patterns for environment setup
- Maintain backward compatibility with existing mods
- Document all new API functions thoroughly
- Test integration with various mod combinations

### Modifying Existing Core Systems
- Consider impact on existing mod ecosystem
- Provide migration paths for changed functionality
- Update related documentation and examples
- Coordinate with mod development community

## Quality Assurance

### Testing Coverage
- Unit tests for all core mod functions
- Integration tests with various mod combinations
- Performance tests with large numbers of mods
- Compatibility tests across game versions

### Code Review Standards
- Security review for mod environment isolation
- Performance review for loading and execution paths
- API design review for consistency and usability
- Documentation review for completeness and accuracy
