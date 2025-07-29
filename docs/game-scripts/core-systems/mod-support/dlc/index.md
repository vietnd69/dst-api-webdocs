---
id: mod-support-dlc-overview
title: DLC Support Overview
description: Overview of DLC management and support systems in DST API
sidebar_position: 0

last_updated: 2025-01-22
build_version: 676042
change_status: stable
category_type: dlc-infrastructure-system
system_scope: downloadable content management and integration
---

# DLC Support Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-01-22**

## System Purpose

The DLC Support category provides comprehensive infrastructure for managing downloadable content in Don't Starve Together. These systems handle DLC discovery, registration, enablement, content integration, and specialized support for world generation and string handling within DLC contexts.

### Key Responsibilities
- DLC discovery, registration, and state management
- Character list management for DLC-specific characters
- String and localization support for DLC content
- World generation integration with DLC parameters
- Demo version management and purchase flow
- Content prefab loading and asset integration

### System Scope
This category includes DLC infrastructure and management but excludes core mod functionality (handled by Core Mod Support) and general game content systems.

## Architecture Overview

### System Components
The DLC support system is built on a layered architecture where core DLC management provides the foundation for specialized systems like world generation support, string handling, and demo management.

### Data Flow
```
DLC Discovery → Registration → Enablement → Content Loading → Integration
      ↓              ↓             ↓              ↓              ↓
  File Scan → DLC Index → State Set → Prefab Load → Game Systems
```

### Integration Points
- **Character Systems**: DLC-specific character registration and management
- **World Generation**: DLC parameter integration and content selection
- **Asset Loading**: DLC-specific prefabs, assets, and resources
- **Localization**: DLC string management and translation support
- **Purchase System**: Demo version limitations and full version unlocking

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-01-22 | [DLC Support](./dlcsupport.md) | stable | Current DLC management system |
| 676042 | 2025-01-22 | [DLC Support Strings](./dlcsupport_strings.md) | stable | Current string handling system |
| 676042 | 2025-01-22 | [DLC Support Worldgen](./dlcsupport_worldgen.md) | stable | Current world generation support |
| 676042 | 2025-01-22 | [Upsell System](./upsell.md) | stable | Current demo management system |

## Core DLC Infrastructure Modules

### [DLC Support](./dlcsupport.md)
Foundation system for DLC discovery, registration, and management.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [DLC Support](./dlcsupport.md) | stable | Core DLC management infrastructure | Discovery, registration, character lists, prefab loading |

**Key Functions:**
- `RegisterAllDLC()` / `RegisterDLC()`: DLC registration management
- `EnableDLC()` / `DisableDLC()`: DLC state control
- `IsDLCEnabled()` / `IsDLCInstalled()`: DLC status checking
- `GetActiveCharacterList()`: Character management for DLC content

**Key Constants:**
- `REIGN_OF_GIANTS`: Reign of Giants DLC identifier (1)
- `MOD_API_VERSION`: Current mod API version (10)
- `ALL_DLC_TABLE` / `NO_DLC_TABLE`: DLC configuration presets

### [DLC Support Strings](./dlcsupport_strings.md)
Specialized string handling system for DLC content with prefix/suffix management.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [DLC Support Strings](./dlcsupport_strings.md) | stable | String and localization support for DLC | Adjective placement, prefix/suffix management, language support |

**Key Functions:**
- `ConstructAdjectivedName()`: Intelligent adjective placement in item names
- `SetUsesPrefix()`: Configure prefix vs suffix formatting for specific items
- `MakeAllPrefixes()` / `MakeAllSuffixes()`: Mass formatting configuration

**Key Features:**
- Automatic adjective placement based on language rules
- Function-based dynamic naming logic
- Integration with localization system

### [DLC Support Worldgen](./dlcsupport_worldgen.md)
Specialized DLC support for world generation contexts with parameter-based configuration.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [DLC Support Worldgen](./dlcsupport_worldgen.md) | stable | World generation DLC integration | Parameter-driven DLC state, JSON integration, lightweight checking |

**Key Functions:**
- `IsDLCEnabled()`: Lightweight DLC checking for world generation
- `SetDLCEnabled()`: Parameter-based DLC configuration
- JSON parameter integration for world generation

**Key Features:**
- Simplified state management for performance
- JSON parameter parsing and integration
- World generation specific DLC logic

### [Upsell System](./upsell.md)
Demo version management and purchase flow system.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Upsell System](./upsell.md) | stable | Demo version and purchase management | Trial time limits, purchase screens, demo restrictions |

**Key Functions:**
- `IsGamePurchased()`: Purchase state checking
- `ShowUpsellScreen()`: Purchase screen display
- `CheckDemoTimeout()`: Trial time management
- `UpdateGamePurchasedState()`: Purchase state updates

**Key Features:**
- Demo time limitation enforcement
- Purchase completion tracking
- Automatic timeout handling

## Common DLC Infrastructure Patterns

### DLC State Management
```lua
-- Register and enable DLC
RegisterAllDLC()
EnableDLC(REIGN_OF_GIANTS)

-- Check DLC status
if IsDLCEnabled(REIGN_OF_GIANTS) then
    print("Reign of Giants content available")
end

-- Get DLC-aware character list
local characters = GetActiveCharacterList()
```

### String Handling with DLC Content
```lua
-- Configure adjective placement for DLC items
SetUsesPrefix("wetfood", true)

-- Construct localized names
local item_name = ConstructAdjectivedName(inst, "meat", "wet")
-- Result: "wet meat" (prefix) or "meat wet" (suffix) based on configuration
```

### World Generation DLC Integration
```lua
-- Set DLC state for world generation
SetDLCEnabled({[REIGN_OF_GIANTS] = true})

-- Check DLC during world generation
if IsDLCEnabled(REIGN_OF_GIANTS) then
    -- Add DLC-specific biomes and features
    AddDesertBiome()
    AddSeasonalGiants()
end
```

### Demo Version Management
```lua
-- Check purchase state
if IsGamePurchased() then
    EnableFullGameContent()
else
    -- Apply demo restrictions
    RestrictGameFeatures()
    
    -- Check demo time
    CheckDemoTimeout()
end
```

## System Dependencies

### Required Systems
- [System Core](../../system-core/index.md): Engine integration and file system access
- [Data Management](../../data-management/index.md): DLC data persistence and configuration
- [Fundamentals](../../fundamentals/index.md): Basic entity and prefab systems

### Optional Systems
- [Character Systems](../../character-systems/index.md): DLC character integration
- [User Interface](../../user-interface/index.md): DLC management and purchase screens
- [World Systems](../../world-systems/index.md): DLC world generation integration
- [Localization](../../localization-content/index.md): DLC string localization

## Performance Considerations

### System Performance
- DLC state checking optimized for frequent calls during world generation
- Lazy loading of DLC content to minimize memory usage
- Efficient character list caching with DLC-aware updates
- String construction with minimal overhead for adjective placement

### Resource Usage
- DLC metadata stored in efficient lookup tables
- Prefab loading deferred until DLC is actually enabled
- String configuration uses hash-based lookups for performance
- Demo state tracking with minimal memory footprint

### Scaling Characteristics
- System supports multiple concurrent DLC packages
- Character list scales efficiently with DLC count
- String handling performance independent of DLC content volume
- World generation integration maintains constant-time DLC checks

## Development Guidelines

### Best Practices
- Always check DLC enablement before accessing DLC-specific content
- Use appropriate string construction functions for localized content
- Configure DLC state early in world generation process
- Handle demo limitations gracefully without breaking core gameplay

### Common Pitfalls
- Accessing DLC content without checking enablement status
- Bypassing string construction system for DLC item names
- Not handling purchase state transitions properly
- Assuming DLC installation equals enablement

### Testing Strategies
- Test all DLC combinations (enabled/disabled states)
- Verify string construction with different language configurations
- Test world generation with various DLC parameter combinations
- Validate demo timeout and purchase flow scenarios

## DLC Integration Patterns

### With Character Systems
DLC support integrates with character systems to:
- Provide DLC-specific character lists for selection screens
- Handle character availability based on DLC enablement
- Manage character-specific assets and prefabs
- Support character unlocking through DLC ownership

### With World Generation
DLC systems coordinate with world generation to:
- Configure world features based on enabled DLC
- Provide parameter-driven DLC state management
- Enable DLC-specific biomes, creatures, and resources
- Support multiple world generation contexts

### With Asset Loading
DLC infrastructure works with asset systems to:
- Load DLC-specific prefabs and assets on demand
- Handle asset conflicts between DLC packages
- Provide fallback mechanisms for missing DLC content
- Optimize asset loading based on DLC enablement state

### With Localization
DLC support enhances localization through:
- Intelligent adjective placement based on language rules
- DLC-specific string handling and formatting
- Function-based dynamic naming for complex localization needs
- Integration with translation system for DLC content

## Troubleshooting DLC Issues

### Common DLC Problems
| Issue | Symptoms | Solution |
|----|----|----|
| DLC content not appearing | Missing characters/features | Check DLC enablement with `IsDLCEnabled()` |
| String formatting incorrect | Wrong adjective placement | Review `USE_PREFIX` configuration |
| World generation missing DLC | Base game features only | Verify `GEN_PARAMETERS` DLC configuration |
| Demo restrictions not working | Unlimited play time | Check purchase state with `IsGamePurchased()` |

### Debugging DLC Systems
- Use `IsDLCEnabled()` to verify DLC state during debugging
- Check `RegisteredDLC` table for DLC registration status
- Review string construction with debug prints
- Monitor demo timeout values and purchase state transitions

### Performance Monitoring
- Track DLC state checking frequency during world generation
- Monitor character list construction performance
- Analyze string construction overhead in localization
- Measure demo state tracking impact on gameplay

## Advanced DLC Features

### Dynamic DLC Management
- Runtime DLC enablement and disablement
- Hot-swapping of DLC configurations
- Conditional DLC loading based on player preferences
- DLC dependency resolution and conflict handling

### Localization Integration
- Language-aware string construction algorithms
- Cultural sensitivity in adjective placement
- Support for right-to-left and complex script languages
- Dynamic string formatting based on context

### Purchase Flow Management
- Seamless transition from demo to full version
- Purchase state persistence across sessions
- Integration with platform-specific purchase systems
- Graceful handling of purchase failures and timeouts

## Future Development

### Extensibility Design
- DLC infrastructure designed for easy addition of new DLC packages
- String system supports new adjective types and placement rules
- World generation system accommodates complex DLC interactions
- Purchase system adaptable to different monetization models

### Integration Planning
- New DLC features should leverage existing infrastructure
- Consider backward compatibility with existing DLC content
- Plan for enhanced DLC management tools and interfaces
- Design for cross-platform DLC synchronization

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [Core Mod Support](../core/index.md) | Foundation | Shared infrastructure patterns |
| [Character Systems](../../character-systems/index.md) | Integration | DLC character management |
| [World Systems](../../world-systems/index.md) | Integration | DLC world generation |
| [User Interface](../../user-interface/index.md) | Integration | DLC management screens |
| [Localization](../../localization-content/index.md) | Integration | DLC string handling |

## Contributing to DLC Support

### Adding New DLC Features
- Follow established patterns for DLC registration and management
- Maintain compatibility with existing DLC infrastructure
- Document DLC-specific requirements and dependencies
- Test integration with all existing DLC combinations

### Modifying DLC Infrastructure
- Consider impact on existing DLC packages and content
- Provide migration paths for changed DLC formats
- Update related documentation and integration guides
- Coordinate with localization team for string system changes

## Quality Assurance

### Testing Coverage
- Comprehensive testing of all DLC combination states
- Localization testing with multiple languages and scripts
- World generation testing with various DLC parameter configurations
- Purchase flow testing across different platforms and scenarios

### Code Review Standards
- Security review for purchase state management and demo limitations
- Performance review for DLC state checking and string construction
- API design review for consistency with core systems
- Compatibility review for cross-DLC interactions and dependencies
