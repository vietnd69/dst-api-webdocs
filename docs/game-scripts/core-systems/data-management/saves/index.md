---
id: saves-overview
title: Saves Overview
description: Overview of save data management and persistence infrastructure in DST API
sidebar_position: 0

last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: infrastructure-system
system_scope: save data persistence, migration, and cluster management
---

# Saves Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Saves infrastructure category provides comprehensive save data management, persistence, and migration capabilities for Don't Starve Together. These systems handle the critical low-level operations that enable reliable game state preservation, backward compatibility through data migration, multi-shard cluster coordination, and player progress tracking across game sessions.

### Key Responsibilities
- Save game slot management and session coordination across single and multi-shard configurations
- Automated save data migration and upgrade systems for maintaining compatibility across game versions
- Player discovery and progress tracking with efficient data synchronization and backend integration
- Cluster-aware save operations supporting Master/Caves shard coordination and data consistency
- Legacy save format conversion and error recovery for seamless user experience

### System Scope
This infrastructure category includes all save data persistence, migration, and coordination systems but excludes high-level game logic and user interface components.

## Architecture Overview

### System Components
Saves infrastructure is built around a layered persistence architecture with version-aware data migration, multi-shard coordination, and efficient progress tracking forming the technical foundation for reliable game state management.

### Data Flow
```
Game State → Save Operations → Data Validation → Persistence Layer
     ↓              ↓               ↓                ↓
Migration Check → Version Upgrade → Cluster Sync → Storage Backend
     ↓              ↓               ↓                ↓
Discovery Track → Progress Update → Backend Sync → User Profile
```

### Integration Points
- **Data Management Core**: Base file operations and serialization systems
- **System Core**: Engine-level persistence and memory management
- **Networking**: Multi-shard communication and cluster coordination
- **User Interface**: Save slot selection and progress display

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Save Index](./saveindex.md) | stable | Current save slot management system |
| 676042 | 2025-06-21 | [Shard Save Index](./shardsaveindex.md) | stable | Multi-shard save coordination |
| 676042 | 2025-06-21 | [Save File Upgrades](./savefileupgrades.md) | stable | Data migration system |
| 676042 | 2025-06-21 | [Scrapbook Partitions](./scrapbookpartitions.md) | stable | Discovery tracking system |

## Core Save Modules

### [Save Slot Management](./saveindex.md)
Legacy save game management system for slot-based save data and session handling.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [SaveIndex](./saveindex.md) | stable | Save slot management system | Session tracking, world options, mod configuration |

**Technical Capabilities:**
- Numbered save slot organization with session identifier linking
- World generation option persistence and server configuration management
- Mod integration tracking with configuration state preservation
- Multi-level support for Master/Caves shard coordination

### [Multi-Shard Coordination](./shardsaveindex.md)
Advanced cluster save slot management system for multi-shard environments.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Shard Save Index](./shardsaveindex.md) | stable | Cluster-aware save management | Multi-shard coordination, cache optimization |

**Technical Capabilities:**
- Comprehensive multi-shard save slot organization with performance caching
- Character and world data retrieval across cluster configurations
- Server modification management with cross-shard synchronization
- Automatic migration from legacy save formats with error recovery

### [Data Migration Infrastructure](./savefileupgrades.md)
Save data migration and upgrade system for maintaining compatibility across game versions.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Save File Upgrades](./savefileupgrades.md) | stable | Version compatibility system | Sequential upgrades, retrofitting, preservation |

**Technical Capabilities:**
- Version-based sequential upgrade application with dependency tracking
- Selective upgrade application preventing redundant operations
- Retrofitting system for adding new content to existing worlds
- Game state preservation during migration with rollback capabilities

### [Discovery Tracking](./scrapbookpartitions.md)
Player progress and discovery tracking system with efficient data synchronization.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Scrapbook Partitions](./scrapbookpartitions.md) | stable | Discovery progress tracking | Bit-field encoding, backend sync |

**Technical Capabilities:**
- Sophisticated data partitioning with hash-based distribution across storage buckets
- Character-specific inspection tracking using efficient bit-field encoding
- Backend synchronization with configurable delays and conflict resolution
- Compact 32-bit storage format supporting 24 character slots and state flags

## Common Infrastructure Patterns

### Save Slot Operations
```lua
-- Initialize save index system
local saveIndex = SaveIndex()
saveIndex:Load(function()
    -- Check slot availability
    if saveIndex:IsSlotEmpty(1) then
        -- Create new save
        local serverConfig = {
            game_mode = "survival",
            max_players = 6
        }
        saveIndex:StartSurvivalMode(1, nil, serverConfig, function()
            print("New save created in slot 1")
        end)
    end
end)
```

### Multi-Shard Management
```lua
-- Cluster save operations
local shardIndex = ShardSaveIndex()
shardIndex:Load(function(success)
    if success then
        -- Access master and caves shards
        local master = shardIndex:GetShardIndex(1, "Master")
        local caves = shardIndex:GetShardIndex(1, "Caves", true)
        
        -- Configure multi-level world
        if shardIndex:IsSlotMultiLevel(1) then
            print("Multi-level world configured")
        end
    end
end)
```

### Data Migration
```lua
-- Automatic upgrade during load
saveIndex:Load(function()
    -- System automatically applies upgrades based on save version
    local currentVersion = savedata.version or 1
    if currentVersion < savefileupgrades.VERSION then
        print("Applying save file upgrades...")
        -- Sequential upgrades applied automatically
    end
end)
```

### Discovery Progress
```lua
-- Track player discovery
if TheScrapbookPartitions:WasSeenInGame("deerclops") then
    print("Deerclops has been encountered")
end

-- Record character inspection
TheScrapbookPartitions:SetInspectedByCharacter("beefalo", "wilson")

-- Get discovery level
local level = TheScrapbookPartitions:GetLevelFor("chester")
-- 0=unknown, 1=seen, 2=inspected
```

## Infrastructure Dependencies

### Required Systems
- [System Core](../../system-core/index.md): Engine persistence and file I/O operations
- [Data Management Core](../index.md): Base serialization and file system access

### Optional Systems  
- [Networking](../../networking-communication/index.md): Multi-shard communication and cluster coordination
- [User Interface](../../user-interface/index.md): Save slot selection and progress display
- [Game Mechanics](../../game-mechanics/index.md): Achievement and progress data integration

## Performance Considerations

### System Performance
- Save operations use asynchronous I/O with callback-based completion handling
- Multi-shard coordination employs caching strategies to minimize file system access
- Data migration applies sequential upgrades efficiently with minimal memory allocation
- Discovery tracking uses hash-based partitioning to distribute load across storage buckets

### Resource Usage
- Save slot caching reduces redundant file operations during session management
- Migration system operates in-place when possible to minimize memory overhead
- Scrapbook data uses compact bit-field encoding for memory-efficient progress tracking
- Cluster operations batch related shard updates to optimize I/O performance

### Scaling Characteristics
- Save system supports unlimited save slots with efficient slot management algorithms
- Multi-shard architecture scales to additional shard types beyond Master/Caves configuration
- Migration system handles arbitrarily complex upgrade sequences without performance degradation
- Discovery tracking supports extensible character sets and discovery categories

## Development Guidelines

### Best Practices
- Always use asynchronous save operations with proper callback handling for UI responsiveness
- Implement comprehensive error handling for all file operations and data validation scenarios
- Use migration system for any save data format changes to maintain backward compatibility
- Follow cluster-aware patterns when implementing multi-shard functionality

### Common Pitfalls
- Performing synchronous save operations that block the main thread during gameplay
- Modifying save data format without implementing corresponding migration upgrades
- Bypassing shard index caching mechanisms causing excessive file system access
- Not handling save slot conflicts in multi-user or network storage environments

### Testing Strategies
- Test save/load cycles with various world configurations and mod combinations
- Verify migration system with saves from previous game versions and edge cases
- Validate multi-shard coordination under network latency and failure conditions
- Test discovery tracking with concurrent user operations and backend synchronization

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [Data Management](../index.md) | Parent Category | File operations, serialization, data validation |
| [System Core](../../system-core/index.md) | Engine Integration | Low-level persistence, memory management |
| [Networking](../../networking-communication/index.md) | Cluster Support | Multi-shard communication, session coordination |
| [Game Mechanics](../../game-mechanics/index.md) | Data Consumer | Achievement data, progression tracking |
| [User Interface](../../user-interface/index.md) | Display Integration | Save slot UI, progress indicators |

## Troubleshooting

### Common Infrastructure Issues
| Issue | Symptoms | Solution |
|----|----|----|
| Save corruption | Load failures, missing data | Check file permissions, validate data integrity |
| Migration failures | Version mismatch errors | Verify upgrade sequence, check data format |
| Shard desynchronization | Inconsistent cluster state | Restart cluster, verify network connectivity |
| Discovery tracking errors | Missing progress data | Clear discovery cache, resync with backend |
| Slot conflicts | Overwritten saves | Check concurrent access, validate slot locking |

### Debugging Infrastructure
- Use save system debug commands to inspect slot states and session data
- Monitor migration log output to trace upgrade application and failure points
- Check shard index cache consistency across cluster nodes during coordination
- Validate discovery tracking bit fields and partition distribution for data integrity

## Data Format Versioning

### Version Management
The save system uses hierarchical versioning:

- **SaveIndex Version**: Currently 4, handles slot format changes
- **ShardSaveIndex Version**: Currently 1, manages multi-shard coordination
- **Save File Upgrades Version**: Currently 5.156, tracks content migration

### Upgrade Sequence
```lua
-- Version upgrade flow
if savedata.version < savefileupgrades.VERSION then
    -- Apply sequential upgrades
    for _, upgrade in ipairs(savefileupgrades.upgrades) do
        if savedata.version < upgrade.version then
            upgrade.fn(savedata)
        end
    end
end
```

## Cluster Architecture

### Shard Types
- **Master**: Primary world shard containing surface world
- **Caves**: Underground world shard with separate generation
- **Custom**: Extensible architecture for additional shard types

### Coordination Patterns
```lua
-- Cross-shard data access
local function GetClusterWorldData(slot)
    local master_data = shardIndex:GetShardIndex(slot, "Master")
    local caves_data = shardIndex:GetShardIndex(slot, "Caves")
    
    return {
        master = master_data:GetWorldData(),
        caves = caves_data and caves_data:GetWorldData()
    }
end
```

## Security and Integrity

### Data Validation
- Comprehensive save data integrity checking with corruption detection
- Version compatibility verification preventing invalid upgrade attempts
- Character data validation ensuring consistent progress tracking
- Cluster state synchronization with conflict resolution mechanisms

### Backup and Recovery
- Automatic backup creation before major migration operations
- Recovery procedures for corrupted save files with data reconstruction
- Cluster state recovery mechanisms for network failure scenarios
- Discovery data backup and restore capabilities for user profile protection

## Performance Monitoring

### Key Metrics
- Save operation completion time and throughput under various load conditions
- Migration upgrade application time for different save file sizes and complexity
- Shard coordination latency and cache hit ratios during cluster operations
- Discovery tracking synchronization frequency and backend communication efficiency

### Optimization Strategies
- Implement incremental save operations for large world states to reduce I/O overhead
- Use lazy loading for shard data to minimize memory usage during slot management
- Batch discovery tracking updates to reduce backend communication frequency
- Optimize migration system with parallel upgrade application where dependencies allow

## Future Development

### Extensibility Design
- Save system supports additional save slot types beyond current local/cloud distinction
- Migration framework accommodates complex upgrade dependencies and conditional application
- Multi-shard architecture extends to arbitrary shard configurations and custom world types
- Discovery tracking system scales to additional progress categories and character types

### Integration Planning
- New save features should leverage existing version management and migration infrastructure
- Cluster coordination should maintain compatibility with existing shard communication protocols
- Progress tracking should integrate with existing discovery systems and backend synchronization
- Data persistence should follow established patterns for consistency and reliability
