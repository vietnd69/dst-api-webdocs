---
id: perfutil
title: Performance Utilities
description: Performance monitoring, profiling, and debugging utilities for Don't Starve Together
sidebar_position: 10
slug: game-scripts/core-systems/perfutil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Performance Utilities

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `perfutil` module provides a comprehensive set of performance monitoring and profiling utilities for Don't Starve Together. These functions are essential for debugging performance issues, monitoring game state, and collecting diagnostic information about entities, players, mods, and server performance. The module is primarily used for development, debugging, and server administration purposes.

## Usage Example

```lua
-- Count all entities and display statistics
CountEntities()
-- Output: Detailed breakdown of all entities by prefab type

-- Get comprehensive profiler metadata
local profile_data = GetProfilerMetaData()
print("Server mode: " .. profile_data.ClientMode)
print("Number of players: " .. (profile_data.numplayers or 0))
print("Active mods: " .. (profile_data.mods or "none"))

-- Example output analysis
if profile_data.numplayers and profile_data.numplayers > 10 then
    print("High player count - monitor performance")
end
```

## Entity Monitoring Functions

### CountEntities() {#count-entities}

**Status:** `stable`

**Description:**
Performs a comprehensive count and analysis of all entities in the game world. Provides detailed statistics including total entities, awake entities, invalid entities, and a breakdown by prefab type sorted by frequency.

**Parameters:**
None

**Returns:**
None (prints results to console)

**Output Format:**
```
Total entities: 1234 (awake 567)
No prefab: 2
Invalid entities: 0
     tree_01 -   150
     grass   -   120
     rock    -    85
     ...
```

**Example:**
```lua
-- Monitor entity count before and after operations
print("=== Before Spawning ===")
CountEntities()

-- Spawn many entities for testing
for i = 1, 100 do
    SpawnPrefab("tree_01").Transform:SetPosition(math.random(-50, 50), 0, math.random(-50, 50))
end

print("=== After Spawning ===")
CountEntities()

-- Use for memory leak detection
local function MonitorEntityGrowth()
    local start_time = GetTime()
    CountEntities()
    
    -- Check again after 5 minutes
    Scheduler:DoTaskInTime(300, function()
        print("=== Entity Check After 5 Minutes ===")
        CountEntities()
        print("Monitor for unusual entity growth patterns")
    end)
end
```

**Performance Analysis:**
- **Memory Leaks**: Increasing invalid entity count indicates memory leaks
- **Entity Bloat**: Excessive entities of specific types may indicate spawning issues
- **Sleep State**: High awake entity count may impact performance

## Save Data Functions

### GetProfilerSave(results) {#get-profiler-save}

**Status:** `stable`

**Description:**
Retrieves world save data and stores it in the results table for profiling purposes. Handles both dedicated server and client configurations with appropriate file path resolution.

**Parameters:**
- `results` (table): Table to store the retrieved save data

**Returns:**
None (modifies results table)

**Result Fields:**
- `results.levelstring` (string): World configuration data in string format

**Example:**
```lua
-- Collect save data for analysis
local save_results = {}
GetProfilerSave(save_results)

-- Process save data when available
local function AnalyzeSaveData()
    if save_results.levelstring then
        print("Save data collected successfully")
        
        -- Analyze world configuration
        if save_results.levelstring:find("caves") then
            print("World includes caves")
        end
        
        if save_results.levelstring:find("forest") then
            print("World includes forest")
        end
        
        -- Check save data size
        local data_size = string.len(save_results.levelstring)
        print("Save data size: " .. data_size .. " bytes")
        
        if data_size > 1000000 then  -- 1MB
            print("WARNING: Large save file detected")
        end
    else
        print("Save data not yet available")
    end
end

-- Check periodically until data is loaded
local check_task = Scheduler:AddTask(1, AnalyzeSaveData)
```

## Player Monitoring Functions

### GetProfilerPlayers(results) {#get-profiler-players}

**Status:** `stable`

**Description:**
Collects player connection information including player count and ping statistics for network performance analysis.

**Parameters:**
- `results` (table): Table to store player information

**Returns:**
None (modifies results table)

**Result Fields:**
- `results.numplayers` (number): Total number of connected players
- `results.pings` (string): Space-separated ping values or "host" for server

**Example:**
```lua
-- Monitor player connection quality
local function MonitorPlayerConnections()
    local player_data = {}
    GetProfilerPlayers(player_data)
    
    if player_data.numplayers then
        print("Connected players: " .. player_data.numplayers)
        
        if player_data.pings then
            local ping_values = {}
            for ping in player_data.pings:gmatch("%S+") do
                if ping ~= "host" then
                    table.insert(ping_values, tonumber(ping))
                end
            end
            
            -- Calculate average ping
            if #ping_values > 0 then
                local total_ping = 0
                local high_ping_count = 0
                
                for _, ping in ipairs(ping_values) do
                    total_ping = total_ping + ping
                    if ping > 200 then
                        high_ping_count = high_ping_count + 1
                    end
                end
                
                local avg_ping = total_ping / #ping_values
                print("Average ping: " .. math.floor(avg_ping) .. "ms")
                
                if high_ping_count > 0 then
                    print("WARNING: " .. high_ping_count .. " players with high ping (>200ms)")
                end
            end
        end
    else
        print("No player data available")
    end
end

-- Regular connection monitoring
Scheduler:AddPeriodicTask(30, MonitorPlayerConnections)
```

## Server Information Functions

### GetProfilerServerStats(results) {#get-profiler-server-stats}

**Status:** `stable`

**Description:**
Determines and records the server's operational mode (Dedicated Server, Server, or Client).

**Parameters:**
- `results` (table): Table to store server statistics

**Returns:**
None (modifies results table)

**Result Fields:**
- `results.ClientMode` (string): One of "Dedicated Server", "Server", or "Client"

**Example:**
```lua
-- Adapt behavior based on server type
local function ConfigureByServerType()
    local server_info = {}
    GetProfilerServerStats(server_info)
    
    print("Running in mode: " .. server_info.ClientMode)
    
    if server_info.ClientMode == "Dedicated Server" then
        print("Dedicated server detected - enabling server optimizations")
        -- Enable server-specific optimizations
        -- Reduce visual effects, increase tick rate, etc.
        
    elseif server_info.ClientMode == "Server" then
        print("Host server detected - balancing client/server load")
        -- Balance between hosting and client performance
        
    elseif server_info.ClientMode == "Client" then
        print("Client mode detected - focusing on local performance")
        -- Client-specific optimizations
        -- Reduce network polling, optimize rendering, etc.
    end
end

-- Configuration on startup
ConfigureByServerType()
```

## Mod Information Functions

### GetProfilerModInfo(results) {#get-profiler-mod-info}

**Status:** `stable`

**Description:**
Collects information about active server mods including count and names for compatibility and performance analysis.

**Parameters:**
- `results` (table): Table to store mod information

**Returns:**
None (modifies results table)

**Result Fields:**
- `results.mods` (string): Format "count:[mod1][mod2][mod3]..."

**Example:**
```lua
-- Analyze mod compatibility and performance impact
local function AnalyzeModConfiguration()
    local mod_info = {}
    GetProfilerModInfo(mod_info)
    
    if mod_info.mods then
        local count_str, mod_list = mod_info.mods:match("(%d+):(.*)")
        local mod_count = tonumber(count_str) or 0
        
        print("Active mods: " .. mod_count)
        
        if mod_count == 0 then
            print("Vanilla game - optimal performance expected")
        elseif mod_count <= 5 then
            print("Light mod usage - minimal performance impact")
        elseif mod_count <= 15 then
            print("Moderate mod usage - monitor performance")
        else
            print("Heavy mod usage - expect performance impact")
        end
        
        -- Extract individual mod names
        if mod_list then
            local mods = {}
            for mod in mod_list:gmatch("%[([^%]]+)%]") do
                table.insert(mods, mod)
            end
            
            print("Loaded mods:")
            for i, mod in ipairs(mods) do
                print("  " .. i .. ". " .. mod)
            end
            
            -- Check for known problematic mods
            local problematic_mods = {"heavy_graphics_mod", "entity_spawner"}
            for _, problem_mod in ipairs(problematic_mods) do
                for _, loaded_mod in ipairs(mods) do
                    if loaded_mod:find(problem_mod) then
                        print("WARNING: Potentially problematic mod detected: " .. loaded_mod)
                    end
                end
            end
        end
    else
        print("No mod information available")
    end
end
```

## Comprehensive Profiling Functions

### GetProfilerMetaData() {#get-profiler-metadata}

**Status:** `stable`

**Description:**
Collects comprehensive profiling information by combining data from all other profiler functions. Returns a complete snapshot of the current game state for performance analysis.

**Parameters:**
None

**Returns:**
- (table): Complete profiler data including server stats, save data, player info, and mod information

**Example:**
```lua
-- Comprehensive performance analysis
local function PerformComprehensiveAnalysis()
    local metadata = GetProfilerMetaData()
    
    print("=== Comprehensive Performance Analysis ===")
    
    -- Server Analysis
    if metadata.ClientMode then
        print("Server Mode: " .. metadata.ClientMode)
    end
    
    -- Player Analysis
    if metadata.numplayers then
        print("Player Count: " .. metadata.numplayers)
        
        if metadata.pings then
            print("Player Pings: " .. metadata.pings)
        end
        
        -- Performance warnings based on player count
        if metadata.numplayers > 16 then
            print("WARNING: High player count may impact performance")
        end
    end
    
    -- Mod Analysis
    if metadata.mods then
        local mod_count = metadata.mods:match("(%d+):")
        print("Active Mods: " .. (mod_count or "0"))
        
        if tonumber(mod_count) > 20 then
            print("WARNING: High mod count may cause performance issues")
        end
    end
    
    -- Save Data Analysis
    if metadata.levelstring then
        local save_size = string.len(metadata.levelstring)
        print("Save Data Size: " .. save_size .. " bytes")
        
        if save_size > 500000 then  -- 500KB
            print("WARNING: Large save file - potential memory usage concern")
        end
    end
    
    return metadata
end

-- Periodic comprehensive analysis
local function StartPerformanceMonitoring()
    print("Starting performance monitoring...")
    
    -- Initial analysis
    PerformComprehensiveAnalysis()
    
    -- Schedule regular checks
    Scheduler:AddPeriodicTask(300, function()  -- Every 5 minutes
        print("\n=== Scheduled Performance Check ===")
        local data = PerformComprehensiveAnalysis()
        
        -- Log to file for historical analysis
        local timestamp = os.date("%Y-%m-%d %H:%M:%S")
        local log_entry = string.format(
            "[%s] Players: %s, Mods: %s, Mode: %s",
            timestamp,
            data.numplayers or "N/A",
            data.mods and data.mods:match("(%d+):") or "N/A",
            data.ClientMode or "N/A"
        )
        print("Log: " .. log_entry)
    end)
end
```

## Advanced Profiling Functions

### ExpandWorldFromProfile() {#expand-world-from-profile}

**Status:** `stable`

**Description:**
Extracts world configuration data from a stored performance profile and saves it as a separate world file. Used for debugging and world analysis from historical profile data.

**Parameters:**
None

**Returns:**
None (creates "profile_world" file if successful)

**Example:**
```lua
-- Extract world data from profile for analysis
local function ExtractAndAnalyzeWorldProfile()
    print("Extracting world data from profile...")
    
    ExpandWorldFromProfile()
    
    -- Check if extraction was successful
    Scheduler:DoTaskInTime(1, function()
        TheSim:GetPersistentString("profile_world", function(success, data)
            if success and data then
                print("World profile extracted successfully")
                print("Profile data size: " .. string.len(data) .. " bytes")
                
                -- Analyze extracted world data
                local function AnalyzeWorldProfile(world_data)
                    if world_data:find('"caves":true') then
                        print("Profile includes caves configuration")
                    end
                    
                    if world_data:find('"forest":true') then
                        print("Profile includes forest configuration")
                    end
                    
                    -- Look for world size indicators
                    if world_data:find('"size":"huge"') then
                        print("Large world detected - expect higher entity counts")
                    end
                    
                    -- Check for special world settings
                    if world_data:find('"difficulty":"hard"') then
                        print("Hard difficulty world")
                    end
                end
                
                AnalyzeWorldProfile(data)
            else
                print("Failed to extract world profile or no profile available")
            end
        end)
    end)
end

-- Use for post-mortem analysis
local function PostMortemAnalysis()
    print("Performing post-mortem performance analysis...")
    
    -- Get current state
    CountEntities()
    local current_metadata = GetProfilerMetaData()
    
    -- Extract historical data
    ExpandWorldFromProfile()
    
    print("Analysis complete - check logs for performance patterns")
end
```

## Performance Monitoring Workflows

### Complete Performance Assessment

```lua
-- Comprehensive performance monitoring system
local PerformanceMonitor = {}

function PerformanceMonitor:Initialize()
    print("Initializing Performance Monitor...")
    self.baseline_data = {}
    self.alert_thresholds = {
        max_entities = 5000,
        max_players = 20,
        max_ping = 300,
        max_mods = 25
    }
    
    self:CollectBaseline()
    self:StartMonitoring()
end

function PerformanceMonitor:CollectBaseline()
    print("Collecting baseline performance data...")
    
    -- Entity baseline
    local entity_count = 0
    for _ in pairs(Ents) do
        entity_count = entity_count + 1
    end
    self.baseline_data.entities = entity_count
    
    -- Server baseline
    self.baseline_data.metadata = GetProfilerMetaData()
    
    print("Baseline established:")
    print("  Entities: " .. entity_count)
    print("  Players: " .. (self.baseline_data.metadata.numplayers or 0))
    print("  Mods: " .. (self.baseline_data.metadata.mods and self.baseline_data.metadata.mods:match("(%d+):") or "0"))
end

function PerformanceMonitor:CheckCurrentState()
    local current_data = {}
    
    -- Current entity count
    local entity_count = 0
    for _ in pairs(Ents) do
        entity_count = entity_count + 1
    end
    current_data.entities = entity_count
    
    -- Current metadata
    current_data.metadata = GetProfilerMetaData()
    
    -- Performance alerts
    self:CheckAlerts(current_data)
    
    return current_data
end

function PerformanceMonitor:CheckAlerts(current_data)
    local alerts = {}
    
    -- Entity count alert
    if current_data.entities > self.alert_thresholds.max_entities then
        table.insert(alerts, "HIGH ENTITY COUNT: " .. current_data.entities)
    end
    
    -- Player count alert
    local player_count = current_data.metadata.numplayers or 0
    if player_count > self.alert_thresholds.max_players then
        table.insert(alerts, "HIGH PLAYER COUNT: " .. player_count)
    end
    
    -- Mod count alert
    if current_data.metadata.mods then
        local mod_count = tonumber(current_data.metadata.mods:match("(%d+):")) or 0
        if mod_count > self.alert_thresholds.max_mods then
            table.insert(alerts, "HIGH MOD COUNT: " .. mod_count)
        end
    end
    
    -- Print alerts
    if #alerts > 0 then
        print("=== PERFORMANCE ALERTS ===")
        for _, alert in ipairs(alerts) do
            print("⚠️  " .. alert)
        end
        print("==========================")
    end
end

function PerformanceMonitor:StartMonitoring()
    print("Starting continuous performance monitoring...")
    
    -- Regular monitoring task
    Scheduler:AddPeriodicTask(60, function()  -- Every minute
        self:CheckCurrentState()
    end)
    
    -- Detailed analysis every 10 minutes
    Scheduler:AddPeriodicTask(600, function()
        print("\n=== Detailed Performance Analysis ===")
        CountEntities()
        self:CheckCurrentState()
        print("=====================================\n")
    end)
end

-- Initialize the monitor
-- PerformanceMonitor:Initialize()
```

## Debugging and Troubleshooting

### Common Use Cases

```lua
-- Memory leak detection
local function DetectMemoryLeaks()
    local initial_count = 0
    for _ in pairs(Ents) do
        initial_count = initial_count + 1
    end
    
    print("Initial entity count: " .. initial_count)
    
    -- Check again after some time
    Scheduler:DoTaskInTime(300, function()  -- 5 minutes
        local final_count = 0
        for _ in pairs(Ents) do
            final_count = final_count + 1
        end
        
        local growth = final_count - initial_count
        print("Entity growth after 5 minutes: " .. growth)
        
        if growth > 100 then
            print("WARNING: Potential memory leak detected!")
            CountEntities()  -- Detailed breakdown
        end
    end)
end

-- Network performance analysis
local function AnalyzeNetworkPerformance()
    local player_data = {}
    GetProfilerPlayers(player_data)
    
    if player_data.pings then
        local high_ping_players = 0
        local total_ping = 0
        local ping_count = 0
        
        for ping in player_data.pings:gmatch("%S+") do
            if ping ~= "host" then
                local ping_value = tonumber(ping)
                if ping_value then
                    total_ping = total_ping + ping_value
                    ping_count = ping_count + 1
                    
                    if ping_value > 200 then
                        high_ping_players = high_ping_players + 1
                    end
                end
            end
        end
        
        if ping_count > 0 then
            local avg_ping = total_ping / ping_count
            print("Network Analysis:")
            print("  Average ping: " .. math.floor(avg_ping) .. "ms")
            print("  High ping players: " .. high_ping_players)
            
            if avg_ping > 150 then
                print("  ⚠️  High average ping detected")
            end
        end
    end
end
```

## Related Modules

- [Scheduler](./scheduler.md): Task scheduling for periodic performance monitoring
- [Console Commands](./consolecommands.md): Debug commands that may use performance utilities
- [Debug Tools](./debugtools.md): Additional debugging and profiling tools
- [Mod Manager](./mods.md): Mod management system for mod information collection
- [Network](./networking.md): Network systems for player and ping data

## Performance Considerations

- **Entity Counting**: `CountEntities()` iterates through all entities - use sparingly in production
- **Save Data Retrieval**: `GetProfilerSave()` involves file I/O operations with async callbacks
- **Network Queries**: Player information collection may have slight network overhead
- **Memory Usage**: Metadata collection creates temporary data structures
- **Frequency**: Regular profiling should be balanced against performance impact

## Security Notes

- **File Access**: Some functions access persistent storage - ensure proper permissions
- **Data Exposure**: Profiler metadata may contain sensitive server information
- **Production Use**: These utilities are primarily for development and debugging environments
- **Client/Server**: Some functions behave differently on dedicated servers vs. clients
