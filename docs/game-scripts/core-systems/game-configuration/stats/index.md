---
id: game-configuration-stats-overview
title: Statistics and Metrics Overview
description: Overview of statistics collection, metrics tracking, and data management systems in DST API
sidebar_position: 0
slug: game-scripts/core-systems/game-configuration/stats
last_updated: 2025-01-21
build_version: 676042
change_status: stable
category_type: configuration-system
system_scope: statistics and metrics collection
---

# Statistics and Metrics Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-01-21**

## System Purpose

The Statistics and Metrics systems provide comprehensive data collection, tracking, and analytics capabilities for Don't Starve Together. These systems enable the collection of gameplay metrics, performance data, user behavior statistics, and content filtering mechanisms that support both development insights and player experience optimization.

### Key Responsibilities
- Collect and aggregate gameplay statistics and player behavior data
- Track performance metrics and system usage patterns  
- Manage content visibility and filtering through blacklist systems
- Provide analytics data for development and balancing decisions
- Support privacy-compliant data collection and transmission

### System Scope
This system category includes all statistics collection, metrics tracking, and data filtering mechanisms but excludes general configuration management (handled by Settings) and game mode configurations (handled by Modes).

## Architecture Overview

### System Components
The statistics system is built on a layered architecture where core data collection provides the foundation for specialized metrics tracking and content filtering.

### Data Flow
```
Game Events → Statistics Collection → Data Aggregation → Metrics Transmission
     ↓               ↓                      ↓                    ↓
User Actions → Profile Stats → Analytics Engine → Server Analytics
     ↓               ↓                      ↓                    ↓
Content Display → Blacklist Filter → UI Filtering → Clean Display
```

### Integration Points
- **Game Mechanics**: Statistics track gameplay events and player actions
- **User Interface**: Blacklist systems filter content for clean UI presentation
- **Data Management**: Metrics data is persisted and transmitted for analytics
- **Development Tools**: Debug statistics help with performance monitoring

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-01-21 | [Stats](./stats.md) | stable | Current statistics collection system |
| 676042 | 2025-01-21 | [Item Blacklist](./item_blacklist.md) | stable | Content filtering and display management |

## Core Statistics Modules

### [Statistics Collection](./stats.md)
Comprehensive system for collecting, organizing, and transmitting game statistics and metrics data.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Stats](./stats.md) | stable | Core statistics and metrics system | Event tracking, performance metrics, analytics |

### [Content Filtering](./item_blacklist.md)
Systems for controlling content visibility and managing display blacklists.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Item Blacklist](./item_blacklist.md) | stable | Item display filtering system | UI content filtering, variant hiding |

## Common Statistics Patterns

### Basic Event Tracking
```lua
-- Track simple gameplay events
ProfileStatsAdd("monsters_killed")
ProfileStatsAdd("items_crafted", 5)
ProfileStatsAdd("days_survived", 1)
```

### Hierarchical Statistics
```lua
-- Create nested statistics for detailed tracking
ProfileStatsAddToField("combat.weapons.spear", 1)
ProfileStatsAddToField("survival.food.berries", 10)
ProfileStatsAddToField("crafting.tools.axe", 2)
```

### Content Filtering
```lua
-- Filter items using blacklist system
local function ShouldDisplayItem(item_key)
    return not ITEM_DISPLAY_BLACKLIST[item_key]
end

-- Filter UI content lists
local filtered_items = {}
for _, item in ipairs(all_items) do
    if not ITEM_DISPLAY_BLACKLIST[item.prefab] then
        table.insert(filtered_items, item)
    end
end
```

### Custom Metrics Events
```lua
-- Send structured analytics events
PushMetricsEvent("player_death", ThePlayer, {
    cause = "starving",
    day = TheWorld.state.cycles,
    location = "forest"
})
```

## Statistics System Dependencies

### Required Systems
- [Data Management](../../data-management/index.md): Statistics data persistence and loading
- [Fundamentals](../../fundamentals/index.md): Core entity and event systems
- [System Core](../../system-core/index.md): Engine integration for metrics transmission

### Optional Systems
- [Networking Communication](../../networking-communication/index.md): Multiplayer statistics synchronization
- [User Interface](../../user-interface/index.md): Statistics display and content filtering
- [Development Tools](../../development-tools/index.md): Debug statistics and performance monitoring

## Performance Considerations

### Memory Usage
- Statistics are accumulated in memory and transmitted in batches
- Blacklist systems use efficient lookup tables for fast filtering
- Profile statistics cache frequently accessed data locally

### Performance Optimizations
- Event tracking uses minimal overhead data structures
- Content filtering performs O(1) lookups for blacklisted items
- Metrics transmission is batched to reduce network overhead

### Scaling Considerations
- Statistics system supports multiple concurrent players efficiently
- Blacklist filtering scales to large content catalogs
- Analytics data collection adapts to varying gameplay intensities

## Development Guidelines

### Best Practices
- Always check `STATS_ENABLE` flag before collecting statistics data
- Use hierarchical field names for organizing related statistics
- Implement content filtering consistently across all UI displays
- Respect user privacy settings when collecting analytics data
- Test statistics collection with multiple concurrent players

### Common Pitfalls
- Collecting excessive granular data that impacts performance
- Bypassing blacklist filtering in custom UI components
- Not considering privacy implications when tracking user behavior
- Creating statistics that could uniquely identify players

### Testing Strategies
- Verify statistics accuracy with automated test scenarios
- Test content filtering with comprehensive item catalogs
- Validate analytics data transmission in various network conditions
- Test performance impact of statistics collection under load

## Statistics Integration Patterns

### With Game Mechanics
Statistics systems track all major gameplay interactions:
- Combat events generate damage and victory statistics
- Crafting actions update creation and resource usage metrics
- Survival events track player health, hunger, and sanity changes
- Achievement systems rely on statistics for progression tracking

### With User Interface
Content filtering ensures clean user experiences:
- Item catalogs filter out internal and variant items
- Recipe displays hide blacklisted construction variants
- Collection screens show only displayable content
- Customization menus filter inappropriate skin options

### With Data Management
Statistics integrate with persistence systems:
- Profile statistics are saved across game sessions
- Analytics data is queued for transmission when possible
- Content blacklists are loaded during game initialization
- Performance metrics help optimize save/load operations

## Data Privacy and Compliance

### Privacy Protection
- User identifiers are anonymized in production builds
- Local-only data flags prevent transmission of sensitive information
- Debug builds may include additional identification for development
- Statistics respect user privacy preferences and consent settings

### Data Collection Guidelines
- Only collect data necessary for game improvement and analytics
- Provide clear user control over statistics and metrics collection
- Implement data retention policies appropriate for the data type
- Ensure compliance with relevant privacy regulations and standards

## Troubleshooting Statistics Issues

### Common Statistics Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Statistics not recording | Events not tracked | Check STATS_ENABLE flag and permissions |
| Content still showing blacklisted items | UI displays filtered content | Verify blacklist lookup implementation |
| Performance degradation | Game stuttering during events | Review statistics collection frequency |
| Missing analytics data | Data not reaching servers | Check network connectivity and transmission queue |

### Debugging Statistics Systems
- Use console commands to inspect current statistics state
- Verify blacklist loading and lookup functionality
- Check network transmission logs for analytics data
- Review performance metrics for collection overhead
- Test privacy settings impact on data collection

## Performance Monitoring

### Key Metrics
- Statistics collection overhead per gameplay event
- Content filtering lookup time for UI operations
- Analytics data transmission success rate and timing
- Memory usage growth during extended gameplay sessions

### Optimization Strategies
- Batch statistics updates to reduce per-event overhead
- Cache blacklist lookups for frequently accessed content
- Optimize analytics data serialization and compression
- Monitor and limit memory usage growth from accumulated statistics

## Integration with Configuration Systems

### Settings Integration
- Statistics collection respects user privacy and performance settings
- Content filtering options can be configured through game settings
- Analytics transmission can be controlled via configuration options
- Debug statistics can be enabled/disabled for development builds

### Mode Integration  
- Different game modes may collect different statistics sets
- Statistics collection adapts to single-player vs multiplayer contexts
- Special event modes may have enhanced metrics collection
- Tutorial modes may disable certain analytics collection

## Future Development Considerations

### Extensibility Design
- Statistics framework supports easy addition of new metric types
- Blacklist system accommodates new content categories and filtering rules
- Analytics system handles diverse event types and data structures
- Privacy controls adapt to evolving compliance requirements

### Integration Planning
- New gameplay features should integrate statistics tracking from design phase
- UI systems should incorporate content filtering as standard practice
- Analytics events should follow established data structure patterns
- Privacy controls should be considered for all new data collection features

## Related Configuration Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [Settings](../settings/index.md) | Configuration Control | User preferences affect statistics collection |
| [Modes](../modes/index.md) | Context Provider | Game modes influence statistics categories |
| [Data Management](../../data-management/index.md) | Data Persistence | Statistics data storage and loading |
| [Development Tools](../../development-tools/index.md) | Monitoring Integration | Debug statistics and performance metrics |

## Contributing to Statistics Systems

### Adding New Statistics
1. Determine appropriate hierarchy and naming for new metrics
2. Consider privacy implications and user consent requirements
3. Implement efficient collection with minimal performance impact
4. Document statistics purpose and expected usage patterns

### Extending Content Filtering
1. Identify content categories that need filtering
2. Add appropriate entries to blacklist systems
3. Test filtering effectiveness across all UI contexts
4. Update documentation for new filtering categories

### Performance Optimization
1. Profile statistics collection overhead in various scenarios
2. Optimize data structures for frequently accessed statistics
3. Implement batching and caching where appropriate
4. Monitor and address memory usage growth patterns
