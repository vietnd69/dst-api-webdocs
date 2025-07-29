---
id: game-configuration-overview
title: Game Configuration Overview
description: Overview of game configuration infrastructure including modes, settings, and statistics in DST API
sidebar_position: 0

last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: infrastructure-system
system_scope: comprehensive game configuration management
---

# Game Configuration Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Game Configuration category provides the comprehensive infrastructure for managing all aspects of game configuration in Don't Starve Together. This system encompasses game mode management, platform-specific settings, global constants, balance parameters, content filtering, and statistics collection. It forms the foundational layer that enables consistent game behavior, cross-platform compatibility, and data-driven decision making throughout the entire game ecosystem.

### Key Responsibilities
- Manage different game modes and their specific rules and configurations
- Provide platform-aware configuration management with automatic override systems
- Define and maintain global constants, balance parameters, and tuning values
- Handle statistics collection, metrics tracking, and analytics data transmission
- Support testing and debugging through comprehensive override mechanisms
- Enable content filtering and display management for clean user experiences

### System Scope
This category includes all configuration infrastructure but excludes runtime game mechanics (handled by Game Mechanics) and character-specific systems (handled by Character Systems). It provides the foundational configuration layer that all other systems depend on.

## Architecture Overview

### System Components
Game Configuration systems are implemented as the fundamental infrastructure layer that provides configuration, constants, and data collection services to all other game systems. The architecture supports layered overrides, platform-specific customization, and comprehensive analytics.

### Data Flow
```
Game Startup → Configuration Loading → Platform Detection → Override Application → System Initialization
     ↓                ↓                     ↓                    ↓                    ↓
Mode Selection → Settings Application → Constants Definition → Statistics Setup → Game Ready
     ↓                ↓                     ↓                    ↓                    ↓
User Actions → Event Tracking → Data Collection → Analytics Transmission → Insights
```

### Integration Points
- **All Game Systems**: Every system depends on configuration values, constants, and mode settings
- **Platform Layer**: Platform-specific configurations ensure optimal behavior across deployment targets
- **Development Workflow**: Override systems and statistics enable efficient development and testing
- **Analytics Pipeline**: Statistics and metrics provide insights for game balance and player behavior
- **User Experience**: Configuration systems directly impact performance, UI behavior, and content visibility

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Modes](./modes/index.md) | stable | Game mode configuration and event handling systems |
| 676042 | 2025-06-21 | [Settings](./settings/index.md) | stable | Core configuration and platform-specific settings |
| 676042 | 2025-06-21 | [Statistics](./stats/index.md) | stable | Statistics collection and metrics tracking systems |

## Core Infrastructure Modules

### [Game Configuration Modes](./modes/index.md)
Infrastructure for game mode management, core game logic, and event handling systems.

| System | Status | Description | Key Features |
|-----|-----|----|-----|
| [Game Logic](./modes/gamelogic.md) | stable | Central game lifecycle orchestration | World loading, asset management, session tracking |
| [Game Modes](./modes/gamemodes.md) | stable | Game mode configuration and rules | Mode properties, spawn behavior, resource settings |
| [Event System](./modes/events.md) | stable | Core event handling infrastructure | Event processors, handlers, inter-component communication |

### [Game Configuration Settings](./settings/index.md)
Core configuration systems, global constants, and platform-specific settings management.

| System | Status | Description | Key Features |
|-----|-----|----|-----|
| [Config](./settings/config.md) | stable | Platform configuration management | Platform detection, override application, settings persistence |
| [Constants](./settings/constants.md) | stable | Global constants and enumerations | Mathematical constants, input mappings, character data |
| [Tuning](./settings/tuning.md) | stable | Game balance and parameter system | Numeric balance values, modifier functions, multiplayer adjustments |
| [Console Settings](./settings/consolescreensettings.md) | stable | Console history and preferences | Command history, UI state, automatic save/load |
| [Fire Level](./settings/firelevel.md) | stable | Fire intensity configuration | Fire progression, visual effects, heat distribution |
| [Global Variable Overrides](./settings/globalvariableoverrides.md) | stable | Environment-specific configuration | Testing overrides, mod settings, event configurations |

### [Statistics and Metrics](./stats/index.md)
Comprehensive statistics collection, metrics tracking, and content filtering systems.

| System | Status | Description | Key Features |
|-----|-----|----|-----|
| [Stats](./stats/stats.md) | stable | Core statistics and metrics system | Event tracking, performance metrics, analytics transmission |
| [Item Blacklist](./stats/item_blacklist.md) | stable | Content filtering and display management | UI content filtering, variant hiding, clean presentation |

## Common Infrastructure Patterns

### Game Mode Configuration
```lua
-- Access current game mode properties
local ghost_enabled = GetGhostEnabled()
local spawn_mode = GetSpawnMode()
local has_renewal = GetHasResourceRenewal()

-- Validate recipes for current mode
local is_valid = IsRecipeValidInGameMode("survival", "resurrectionstatue")

-- Check mode-specific features
if GetIsSpawnModeFixed() then
    -- Use fixed spawn points
    SetupFixedSpawnSystem()
end
```

### Platform-Specific Configuration
```lua
-- Apply platform optimizations
if TheConfig:IsEnabled("hide_vignette") then
    -- Mobile optimization: remove performance-heavy effects
    HideVignetteEffects()
end

if TheConfig:IsEnabled("force_netbookmode") then
    -- Compact UI for smaller screens
    SetCompactUIMode()
end

-- Runtime configuration changes
TheConfig:Enable("debug_mode")
TheConfig:SetOptions({
    performance_mode = true,
    experimental_features = false
})
```

### Global Constants and Tuning
```lua
-- Use global constants for consistency
if entity.Transform:GetFacing() == FACING_RIGHT then
    -- Entity is facing right
end

-- Access game balance values
local player_health = TUNING.WILSON_HEALTH  -- 150
local spear_damage = TUNING.SPEAR_DAMAGE    -- 34
local day_length = TUNING.TOTAL_DAY_TIME    -- 480 seconds

-- Apply tuning modifiers
AddTuningModifier("SPEAR_DAMAGE", function(damage)
    return damage * GetDifficultyMultiplier()
end, TUNING.SPEAR_DAMAGE)
```

### Event System Integration
```lua
-- Create and configure event processor
local event_processor = EventProcessor()

-- Add event handlers
local handler = event_processor:AddEventHandler("player_died", function(player, cause)
    -- Update statistics
    ProfileStatsAdd("deaths", 1)
    ProfileStatsAddToField("death_causes." .. cause, 1)
    
    -- Handle game logic
    HandlePlayerDeath(player, cause)
end)

-- Trigger events with context
event_processor:HandleEvent("player_died", ThePlayer, "starvation")
```

### Statistics and Analytics
```lua
-- Track gameplay events
ProfileStatsAdd("monsters_killed", 1)
ProfileStatsAdd("items_crafted", 5)
ProfileStatsAddToField("survival.food.berries", 10)

-- Send structured analytics events
PushMetricsEvent("boss_defeated", ThePlayer, {
    boss_type = "deerclops",
    day = TheWorld.state.cycles,
    location = "forest"
})

-- Content filtering
local function ShouldDisplayItem(item_key)
    return not ITEM_DISPLAY_BLACKLIST[item_key]
end
```

### Override Systems for Testing
```lua
-- Apply testing overrides
local overrides = require("tuning_override")
HoundAttackManager.StartAttack = overrides.hounds  -- Disable hound attacks
EarthquakeManager.StartQuake = overrides.earthquakes  -- Disable earthquakes

-- Environment-specific configuration
-- Use globalvariableoverrides_monkey.lua for mod testing
-- Use globalvariableoverrides_pax_server.lua for events
```

## Infrastructure Dependencies

### Required Systems
- [System Core](../system-core/index.md): Engine integration and platform detection services
- [Data Management](../data-management/index.md): Configuration persistence and analytics data storage
- [Fundamentals](../fundamentals/index.md): Basic class frameworks and entity systems

### Optional Systems
- [Development Tools](../development-tools/index.md): Debug configuration and override testing tools
- [User Interface](../user-interface/index.md): Configuration UI and settings display screens
- [Networking Communication](../networking-communication/index.md): Multiplayer statistics and configuration synchronization

## Performance Considerations

### System Performance
- Configuration values are resolved at startup for optimal runtime performance
- Event system uses optimized handler management for minimal callback overhead
- Statistics collection employs batching and caching to reduce per-event processing
- Platform detection and override application occur only during initialization

### Resource Usage
- Configuration data is cached in memory for O(1) access patterns
- Constants and tuning values use immutable storage requiring minimal memory overhead
- Statistics accumulate in structured format optimized for transmission batching
- Override systems share common dummy functions to minimize memory duplication

### Scaling Characteristics
- Configuration systems support unlimited custom values through extensible design
- Event processors scale efficiently with increasing handler count and event frequency
- Statistics collection adapts to varying gameplay intensity without performance degradation
- Content filtering performs efficient O(1) lookups regardless of catalog size

## Development Guidelines

### Best Practices
- Always use established constants instead of hard-coding values throughout the codebase
- Apply platform-specific configuration through the centralized Config system
- Use the event system for loose coupling between components and systems
- Leverage tuning values for all gameplay balance parameters and mechanical settings
- Test configuration changes across all supported platforms and game modes
- Respect user privacy settings when collecting analytics and statistics data

### Common Pitfalls
- Hard-coding values instead of using constants, tuning parameters, or configuration systems
- Not considering platform differences when implementing cross-platform features
- Bypassing the event system for direct component communication
- Modifying configuration values without understanding their system-wide impact and dependencies
- Not testing override systems and configuration changes in multiplayer environments
- Collecting excessive granular statistics that could impact game performance

### Testing Strategies
- Use clean override configurations to establish reliable baseline testing environments
- Test platform-specific configurations on actual target platforms and devices
- Verify tuning value changes maintain intended game balance across difficulty modes
- Validate event system performance under high-frequency event generation scenarios
- Test statistics collection accuracy with automated test scenarios and edge cases
- Ensure configuration persistence works correctly across save/load cycles

## System Integration Patterns

### With Core Game Systems
Game Configuration provides the foundational infrastructure for all game functionality:
- Constants and tuning values control the behavior and balance of all game mechanics
- Game modes establish the rules and constraints that all systems must follow
- Event system enables communication and coordination between all game components
- Statistics collection provides insights into the performance and usage of all systems

### With Development Workflow
Configuration infrastructure supports efficient development and testing processes:
- Override systems allow selective feature disabling for focused component testing
- Platform configuration enables seamless cross-platform development and deployment
- Tuning system supports rapid balance iteration and experimental gameplay mechanics
- Statistics and analytics provide data-driven insights for development decisions

### With User Experience
Configuration systems directly impact every aspect of player experience:
- Platform-specific optimizations ensure optimal performance and usability on each target device
- Game modes provide varied gameplay experiences with different rules and mechanics
- Tuning values create consistent, balanced, and engaging gameplay across all content
- Content filtering ensures clean, appropriate UI presentation for all user contexts

### With Analytics and Insights
Statistics and metrics systems provide comprehensive data collection:
- Player behavior analytics inform game balance and content development decisions
- Performance metrics guide optimization efforts and technical improvements
- Usage statistics help prioritize feature development and user experience enhancements
- Content filtering data provides insights into UI effectiveness and user interaction patterns

## Performance Monitoring

### Key Metrics
- Configuration lookup time and frequency across all game systems
- Event system handler registration and execution performance under varying loads
- Statistics collection overhead per gameplay event and session duration
- Platform detection and override application duration during game startup
- Memory usage patterns for configuration data, event handlers, and accumulated statistics

### Optimization Strategies
- Cache frequently accessed configuration values to minimize repeated lookup operations
- Optimize event handler execution order and callback efficiency for performance-critical events
- Implement efficient data structures for configuration storage and statistics accumulation
- Use batched transmission for analytics data to minimize network overhead and improve performance
- Monitor and limit memory usage growth from configuration data and statistics collection

## Troubleshooting Infrastructure Issues

### Common Configuration Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Platform overrides not applying | Features behave incorrectly on specific platforms | Check platform detection logic and override application |
| Game mode properties not taking effect | Gameplay rules don't match expected mode behavior | Verify mode loading and property inheritance |
| Constants not available | Compilation errors or undefined values | Check constants loading order and system dependencies |
| Event handlers not triggering | Components not responding to expected events | Verify handler registration and event dispatch |
| Statistics not recording | Analytics data missing or incomplete | Check STATS_ENABLE flag and collection permissions |
| Tuning values not applying | Game balance feels incorrect or inconsistent | Verify tuning system loading and modifier application |

### Debugging Infrastructure
- Use configuration debug commands to inspect current settings and platform detection
- Monitor event system activity with debug overlays and handler registration tracking
- Check statistics collection state and transmission queue status for analytics data
- Validate tuning value resolution and modifier application during gameplay
- Review configuration loading order and dependency resolution for initialization issues

## Advanced Infrastructure Features

### Custom Configuration Development
- Comprehensive framework for creating custom configuration categories and systems
- Extension points for platform-specific configuration needs and requirements
- Integration patterns for configuration UI development and user preference management
- Best practices for configuration validation, error handling, and graceful degradation

### Event System Extensions
- Advanced event processor implementations for specialized communication needs
- Event filtering and transformation capabilities for complex workflows
- Performance optimization techniques for high-frequency event patterns
- Integration with external systems and network communication protocols

### Analytics and Insights Enhancement
- Custom metrics event development for specialized tracking requirements
- Advanced statistics aggregation and analysis capabilities
- Privacy-compliant data collection strategies and anonymization techniques
- Integration with external analytics platforms and data visualization tools

### Testing and Development Support
- Comprehensive override system capabilities for feature isolation and testing
- Configuration validation tools for development workflow integration
- Testing frameworks that leverage configuration flexibility for automated scenarios
- Performance measurement tools for assessing configuration impact on game systems

## Future Development Considerations

### Extensibility Design
- Configuration systems support unlimited custom categories and hierarchical organization
- Platform configuration framework easily accommodates new deployment targets and devices
- Event system designed for complex communication patterns and performance scaling
- Statistics collection framework supports diverse data types and analytics requirements

### Integration Planning
- New game features should leverage existing configuration infrastructure from design phase
- Consider platform implications and cross-compatibility for all configuration changes
- Design for backward compatibility with existing configuration data and user preferences
- Plan for configuration UI evolution and user experience improvements

### Evolution and Maintenance
- Configuration migration strategies for handling system upgrades and format changes
- Backward compatibility considerations for configuration data and user settings
- Performance optimization roadmap for configuration systems under increasing game complexity
- Analytics platform evolution and integration with external data analysis tools

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [Character Systems](../character-systems/index.md) | Depends on configuration | Character stats, progression rules, customization settings |
| [Game Mechanics](../game-mechanics/index.md) | Uses balance parameters | Recipe costs, damage values, timing parameters, achievement tracking |
| [World Systems](../world-systems/index.md) | Uses generation parameters | World creation settings, environmental configuration, ocean systems |
| [Development Tools](../development-tools/index.md) | Uses override systems | Testing configuration, debug settings, performance monitoring |
| [User Interface](../user-interface/index.md) | Displays configuration | Settings screens, configuration UI, content filtering display |
| [Networking Communication](../networking-communication/index.md) | Synchronizes configuration | Multiplayer settings, statistics sharing, configuration updates |

## Contributing to Infrastructure

### Adding New Configuration Categories
1. Follow established organizational patterns for configuration hierarchy and naming conventions
2. Implement comprehensive validation and error handling for all configuration values
3. Consider platform-specific requirements and provide appropriate override mechanisms
4. Document configuration impact, usage guidelines, and integration requirements

### Extending Game Mode Support
1. Understand current mode property system and inheritance patterns
2. Implement mode-specific behaviors through configuration rather than hard-coded logic
3. Test mode functionality across all supported game systems and features
4. Update related documentation and provide migration guidance for existing content

### Enhancing Statistics Collection
1. Determine appropriate statistics hierarchy and naming for new metrics categories
2. Consider privacy implications and user consent requirements for all data collection
3. Implement efficient collection mechanisms with minimal performance impact on gameplay
4. Document statistics purpose, expected usage patterns, and analytics integration requirements

### Platform Configuration Enhancement
1. Understand current platform detection mechanisms and override application patterns
2. Implement appropriate configuration overrides for new platforms and deployment targets
3. Test configuration behavior comprehensively across all supported platforms and devices
4. Update documentation with platform-specific considerations and optimization guidelines
