---
id: profiling-debugging
title: Profiling and Debugging Performance Issues
sidebar_position: 13
last_updated: 2023-07-06
---

# Profiling and Debugging Performance Issues

This guide covers techniques for identifying, analyzing, and resolving performance issues in Don't Starve Together mods.

## Understanding Performance Profiling

Performance profiling is the process of measuring various aspects of your mod's execution to identify bottlenecks and inefficiencies. Effective profiling helps you:

- Identify which parts of your code consume the most resources
- Measure the impact of your optimizations
- Discover unexpected performance issues
- Make data-driven optimization decisions

## Built-in Profiling Tools

### 1. Frame Time Logging

Monitoring frame times is one of the simplest ways to detect performance issues:

```lua
-- Add this to your modmain.lua to log frame times
local last_time = GetTime()
local frame_count = 0

local function LogFrameTimes()
    frame_count = frame_count + 1
    
    -- Log every second
    if frame_count >= 30 then
        local current_time = GetTime()
        local elapsed = current_time - last_time
        local fps = frame_count / elapsed
        local avg_frame_time = 1000 * elapsed / frame_count
        
        print(string.format("FPS: %.1f, Avg frame time: %.2fms", fps, avg_frame_time))
        
        last_time = current_time
        frame_count = 0
    end
end

-- Hook into the game's update loop
AddGamePostInit(function()
    TheWorld:DoPeriodicTask(0, LogFrameTimes)
end)
```

### 2. Function Execution Time

Measure how long specific functions take to execute:

```lua
-- Simple function timer
function TimeFunction(fn, ...)
    local start_time = os.clock()
    local result = fn(...)
    local end_time = os.clock()
    
    print(string.format("Function took %.6f seconds", end_time - start_time))
    return result
end

-- Usage example
local result = TimeFunction(MyExpensiveFunction, arg1, arg2)
```

### 3. Memory Usage Tracking

Monitor memory consumption to detect leaks and excessive allocations:

```lua
-- Track memory usage
function GetMemoryUsage()
    collectgarbage("collect")
    return collectgarbage("count")
end

-- Monitor memory changes
local initial_memory = GetMemoryUsage()
print("Initial memory usage: " .. initial_memory .. " KB")

-- Check memory after operations
local function CheckMemoryDelta(label)
    local current_memory = GetMemoryUsage()
    local delta = current_memory - initial_memory
    print(label .. " memory change: " .. delta .. " KB (Total: " .. current_memory .. " KB)")
end

-- Usage example
MyFunction()
CheckMemoryDelta("After MyFunction")
```

## Advanced Profiling Techniques

### 1. Custom Profiler Implementation

Create a more comprehensive profiling system:

```lua
local Profiler = {
    active_timers = {},
    results = {},
    enabled = true
}

function Profiler:Start(label)
    if not self.enabled then return end
    
    self.active_timers[label] = os.clock()
end

function Profiler:Stop(label)
    if not self.enabled or not self.active_timers[label] then return end
    
    local elapsed = os.clock() - self.active_timers[label]
    self.active_timers[label] = nil
    
    self.results[label] = self.results[label] or {count = 0, total_time = 0, min_time = math.huge, max_time = 0}
    local data = self.results[label]
    
    data.count = data.count + 1
    data.total_time = data.total_time + elapsed
    data.min_time = math.min(data.min_time, elapsed)
    data.max_time = math.max(data.max_time, elapsed)
end

function Profiler:GetResults()
    local sorted_results = {}
    
    for label, data in pairs(self.results) do
        data.avg_time = data.total_time / data.count
        table.insert(sorted_results, {label = label, data = data})
    end
    
    table.sort(sorted_results, function(a, b)
        return a.data.total_time > b.data.total_time
    end)
    
    return sorted_results
end

function Profiler:PrintResults()
    print("======== PROFILING RESULTS ========")
    print(string.format("%-30s %10s %10s %10s %10s %10s", 
        "Label", "Calls", "Total(s)", "Avg(ms)", "Min(ms)", "Max(ms)"))
    
    local results = self:GetResults()
    for _, item in ipairs(results) do
        local label = item.label
        local data = item.data
        
        print(string.format("%-30s %10d %10.3f %10.3f %10.3f %10.3f",
            label, data.count, data.total_time,
            data.avg_time * 1000, data.min_time * 1000, data.max_time * 1000))
    end
    
    print("===================================")
end

function Profiler:Reset()
    self.results = {}
    self.active_timers = {}
end

-- Usage example
function SomeFunction()
    Profiler:Start("SomeFunction")
    
    -- Function body
    Profiler:Start("SomeFunction.SubTask")
    -- Subtask code
    Profiler:Stop("SomeFunction.SubTask")
    
    Profiler:Stop("SomeFunction")
end

-- Print results after some time
TheWorld:DoTaskInTime(60, function()
    Profiler:PrintResults()
    Profiler:Reset()
end)
```

### 2. Call Frequency Analysis

Track how often functions are called:

```lua
local CallCounter = {
    counts = {},
    enabled = true
}

function CallCounter:Count(label)
    if not self.enabled then return end
    
    self.counts[label] = (self.counts[label] or 0) + 1
end

function CallCounter:PrintResults()
    print("======== CALL FREQUENCY RESULTS ========")
    
    local sorted_results = {}
    for label, count in pairs(self.counts) do
        table.insert(sorted_results, {label = label, count = count})
    end
    
    table.sort(sorted_results, function(a, b)
        return a.count > b.count
    end)
    
    for _, item in ipairs(sorted_results) do
        print(string.format("%-30s %10d", item.label, item.count))
    end
    
    print("=======================================")
end

function CallCounter:Reset()
    self.counts = {}
end

-- Usage example
local original_fn = SomeFrequentlyCalledFunction
SomeFrequentlyCalledFunction = function(...)
    CallCounter:Count("SomeFrequentlyCalledFunction")
    return original_fn(...)
end
```

### 3. Entity Count Monitoring

Track entity counts to detect entity bloat:

```lua
function MonitorEntityCounts()
    local counts = {}
    local total = 0
    
    -- Count entities by prefab
    for k, v in pairs(Ents) do
        if v.prefab then
            counts[v.prefab] = (counts[v.prefab] or 0) + 1
            total = total + 1
        end
    end
    
    -- Sort and print results
    local sorted = {}
    for prefab, count in pairs(counts) do
        table.insert(sorted, {prefab = prefab, count = count})
    end
    
    table.sort(sorted, function(a, b) return a.count > b.count end)
    
    print("======== ENTITY COUNT ========")
    print("Total entities: " .. total)
    print("Top 20 prefabs:")
    
    for i = 1, math.min(20, #sorted) do
        local item = sorted[i]
        print(string.format("%-20s %5d", item.prefab, item.count))
    end
    
    print("=============================")
end

-- Run periodically
TheWorld:DoPeriodicTask(30, MonitorEntityCounts)
```

## Debugging Performance Issues

### 1. Isolating Problem Areas

When you encounter performance issues, use a systematic approach to isolate them:

```lua
-- Temporarily disable systems to isolate issues
local debug_flags = {
    enable_system_a = true,
    enable_system_b = true,
    enable_system_c = true
}

-- In your update functions
function UpdateSystemA()
    if not debug_flags.enable_system_a then return end
    -- System A code
end

-- Console command to toggle systems
function c_toggle_system(system_name)
    if debug_flags["enable_" .. system_name] ~= nil then
        debug_flags["enable_" .. system_name] = not debug_flags["enable_" .. system_name]
        print("System " .. system_name .. " is now " .. 
              (debug_flags["enable_" .. system_name] and "ENABLED" or "DISABLED"))
    else
        print("Unknown system: " .. system_name)
    end
end
```

### 2. Performance Logging Levels

Implement different levels of performance logging:

```lua
local PerformanceLogger = {
    level = 1, -- 0=off, 1=critical, 2=warnings, 3=info, 4=verbose
    log_file = "mod_performance.log"
}

function PerformanceLogger:Log(level, message)
    if self.level >= level then
        print("[PERF] " .. message)
        
        -- Optionally write to file
        if self.log_file then
            TheSim:GetPersistentString(self.log_file, function(success, current_log)
                if success then
                    local timestamp = os.date("%Y-%m-%d %H:%M:%S")
                    local new_log = current_log .. timestamp .. " [PERF] " .. message .. "\n"
                    TheSim:SetPersistentString(self.log_file, new_log, false)
                end
            end)
        end
    end
end

-- Usage
PerformanceLogger:Log(1, "Critical performance issue: Frame time spike detected")
PerformanceLogger:Log(3, "Info: Entity count within normal range")
```

### 3. Visual Performance Indicators

Add visual indicators for performance metrics:

```lua
-- Add a simple FPS counter to the HUD
local function AddFPSCounter()
    local fps_root = CreateEntity()
    fps_root.entity:AddTransform()
    
    local text = fps_root.entity:AddLabel()
    text:SetFont(NUMBERFONT)
    text:SetFontSize(20)
    text:SetColour(1, 1, 1, 1)
    text:SetText("FPS: --")
    text:SetWorldOffset(0, 0, 0)
    text:SetUIOffset(0, 0, 0)
    
    fps_root:AddTag("FX")
    fps_root:AddTag("NOCLICK")
    fps_root.persists = false
    
    fps_root:DoPeriodicTask(0.5, function()
        local fps = TheSim:GetFPS()
        local color = fps > 30 and {0, 1, 0, 1} or (fps > 15 and {1, 1, 0, 1} or {1, 0, 0, 1})
        
        text:SetText(string.format("FPS: %d", fps))
        text:SetColour(unpack(color))
    end)
    
    return fps_root
end

-- Add to game
AddGamePostInit(function()
    if not TheWorld.ismastersim then
        AddFPSCounter()
    end
end)
```

## Common Performance Issues and Solutions

### 1. Update Function Overload

**Problem**: Too many entities updating every frame

**Detection**:
```lua
function DetectUpdateOverload()
    local start_time = os.clock()
    
    -- Run update code
    for _, entity in pairs(my_entities) do
        entity:OnUpdate()
    end
    
    local elapsed = os.clock() - start_time
    if elapsed > 0.016 then -- 16ms = 1 frame at 60fps
        print("WARNING: Update taking too long: " .. elapsed .. "s with " .. 
              #my_entities .. " entities")
    end
end
```

**Solution**:
```lua
-- Stagger updates across multiple frames
function StaggeredUpdate()
    local entities_per_frame = 10
    local current_index = 1
    
    TheWorld:DoPeriodicTask(0, function()
        local count = 0
        while count < entities_per_frame and current_index <= #my_entities do
            my_entities[current_index]:OnUpdate()
            current_index = current_index + 1
            count = count + 1
        end
        
        if current_index > #my_entities then
            current_index = 1
        end
    end)
end
```

### 2. Memory Leaks

**Problem**: Memory usage continuously increases

**Detection**:
```lua
function DetectMemoryLeaks()
    local baseline = nil
    local check_count = 0
    
    TheWorld:DoPeriodicTask(60, function()
        collectgarbage("collect")
        local current = collectgarbage("count")
        
        if not baseline then
            baseline = current
        else
            local delta = current - baseline
            check_count = check_count + 1
            
            print(string.format("Memory after %d minutes: %.1f KB (%.1f KB increase)",
                check_count, current, delta))
            
            if delta > 5000 and check_count > 5 then
                print("WARNING: Possible memory leak detected!")
                -- Log potential leak sources
                LogPotentialLeaks()
            end
        end
    end)
end

function LogPotentialLeaks()
    -- Log table sizes of common leak sources
    print("Entity count: " .. table.count(Ents))
    print("My tracked entities: " .. #my_entities)
    print("Event callbacks: " .. CountEventCallbacks())
    print("Task count: " .. CountScheduledTasks())
end
```

**Solution**:
```lua
-- Implement proper cleanup
function CleanupEntity(entity)
    -- Cancel all tasks
    if entity.tasks then
        for _, task in pairs(entity.tasks) do
            if task:IsValid() then
                task:Cancel()
            end
        end
        entity.tasks = {}
    end
    
    -- Remove event listeners
    if entity.event_listeners then
        for target, events in pairs(entity.event_listeners) do
            for event, fn in pairs(events) do
                if target and target:IsValid() then
                    target:RemoveEventCallback(event, fn)
                end
            end
        end
        entity.event_listeners = {}
    end
    
    -- Clear references
    entity.references = nil
end
```

### 3. Network Traffic Spikes

**Problem**: Excessive network traffic causing lag spikes

**Detection**:
```lua
function MonitorNetworkTraffic()
    local baseline_in = 0
    local baseline_out = 0
    local last_check = GetTime()
    
    TheWorld:DoPeriodicTask(1, function()
        local current_time = GetTime()
        local elapsed = current_time - last_check
        
        local bandwidth_in = TheSim:GetBandwidthIn()
        local bandwidth_out = TheSim:GetBandwidthOut()
        
        local delta_in = bandwidth_in - baseline_in
        local delta_out = bandwidth_out - baseline_out
        
        if delta_in > 100 or delta_out > 100 then
            print(string.format("Network spike detected! In: %.1f KB/s, Out: %.1f KB/s",
                delta_in / elapsed, delta_out / elapsed))
        end
        
        baseline_in = bandwidth_in
        baseline_out = bandwidth_out
        last_check = current_time
    end)
end
```

**Solution**:
```lua
-- Implement network throttling
local NetworkThrottler = {
    last_send_time = {},
    min_interval = 0.1 -- Minimum time between sends
}

function NetworkThrottler:CanSend(message_type)
    local current_time = GetTime()
    local last_time = self.last_send_time[message_type] or 0
    
    if current_time - last_time < self.min_interval then
        return false
    end
    
    self.last_send_time[message_type] = current_time
    return true
end

-- Usage
if NetworkThrottler:CanSend("position_update") then
    SendPositionUpdate(entity)
end
```

## Advanced Debugging Techniques

### 1. Conditional Breakpoints

Use conditional code execution to debug specific scenarios:

```lua
-- Debug specific conditions
function ConditionalDebug(entity)
    -- Only debug when specific conditions are met
    if entity.components.health:GetPercent() < 0.1 and entity:HasTag("player") then
        print("DEBUG: Low health player detected")
        DumpEntityState(entity)
    end
end

function DumpEntityState(entity)
    print("======== ENTITY STATE ========")
    print("Prefab: " .. entity.prefab)
    print("Position: " .. tostring(entity:GetPosition()))
    
    for k, v in pairs(entity.components) do
        print("Component: " .. k)
    end
    
    print("============================")
end
```

### 2. Logging to File

Save debug information to a file for later analysis:

```lua
function LogToFile(message, filename)
    filename = filename or "mod_debug.log"
    
    TheSim:GetPersistentString(filename, function(success, current_log)
        local log_content = success and current_log or ""
        local timestamp = os.date("%Y-%m-%d %H:%M:%S")
        local new_log = log_content .. timestamp .. ": " .. message .. "\n"
        
        TheSim:SetPersistentString(filename, new_log, false)
    end)
end

-- Usage
LogToFile("Performance issue detected: " .. error_details)
```

### 3. Remote Debugging

Send debug information to a remote server for monitoring:

```lua
-- This is a simplified example - in practice you'd need a server to receive the data
function SendRemoteDebugData(data)
    -- Convert data to string
    local json_data = json.encode(data)
    
    -- Use TheSim:QueryServer to send data to a remote endpoint
    TheSim:QueryServer(
        "https://your-debug-server.com/log",
        function(result, isSuccessful, resultCode)
            if isSuccessful then
                print("Debug data sent successfully")
            else
                print("Failed to send debug data: " .. resultCode)
            end
        end,
        "POST",
        json_data
    )
end

-- Usage
SendRemoteDebugData({
    type = "performance_issue",
    fps = TheSim:GetFPS(),
    memory = collectgarbage("count"),
    entity_count = table.count(Ents),
    timestamp = os.time()
})
```

## Performance Optimization Workflow

Follow this systematic workflow to address performance issues:

1. **Measure**: Establish baseline performance metrics
2. **Profile**: Identify the most resource-intensive operations
3. **Analyze**: Determine why these operations are expensive
4. **Optimize**: Implement targeted improvements
5. **Validate**: Measure again to confirm improvements
6. **Iterate**: Repeat the process for the next bottleneck

### Example Workflow

```lua
-- Step 1: Measure baseline performance
local baseline_fps = TheSim:GetFPS()
local baseline_memory = collectgarbage("count")
print("Baseline FPS: " .. baseline_fps)
print("Baseline Memory: " .. baseline_memory .. " KB")

-- Step 2: Profile systems to find bottlenecks
local systems_to_profile = {
    "EntityUpdates",
    "PathFinding",
    "AI",
    "Physics",
    "Rendering"
}

for _, system in ipairs(systems_to_profile) do
    Profiler:Reset()
    
    -- Run the system with profiling
    RunSystemWithProfiling(system)
    
    -- Check results
    local results = Profiler:GetResults()
    print("Profiling results for " .. system .. ":")
    Profiler:PrintResults()
end

-- Step 3: Analyze the most expensive operations
-- (This would be manual analysis based on profiling results)

-- Step 4: Implement optimizations for the identified bottleneck
OptimizeSystem("PathFinding")

-- Step 5: Validate improvements
local new_fps = TheSim:GetFPS()
local new_memory = collectgarbage("count")
print("New FPS: " .. new_fps .. " (Change: " .. (new_fps - baseline_fps) .. ")")
print("New Memory: " .. new_memory .. " KB (Change: " .. (new_memory - baseline_memory) .. " KB)")

-- Step 6: Iterate to the next bottleneck
```

## Console Commands for Debugging

Add helpful console commands to aid in debugging:

```lua
-- Register console commands for debugging
function AddDebugConsoleCommands()
    -- Print performance statistics
    GLOBAL.c_perfstats = function()
        print("FPS: " .. TheSim:GetFPS())
        print("Memory: " .. collectgarbage("count") .. " KB")
        print("Entity Count: " .. table.count(Ents))
        print("Network In: " .. TheSim:GetBandwidthIn() .. " KB")
        print("Network Out: " .. TheSim:GetBandwidthOut() .. " KB")
    end
    
    -- Toggle profiling
    GLOBAL.c_toggleprofiling = function()
        Profiler.enabled = not Profiler.enabled
        print("Profiling is now " .. (Profiler.enabled and "ENABLED" or "DISABLED"))
        
        if not Profiler.enabled then
            Profiler:PrintResults()
            Profiler:Reset()
        end
    end
    
    -- Dump entity information
    GLOBAL.c_dumpentity = function(radius)
        radius = radius or 5
        local x, y, z = ConsoleWorldPosition():Get()
        local entities = TheSim:FindEntities(x, y, z, radius)
        
        print("Found " .. #entities .. " entities within " .. radius .. " units:")
        for i, entity in ipairs(entities) do
            print(i .. ". " .. (entity.prefab or "unknown") .. 
                  " (" .. entity.GUID .. ")")
        end
    end
    
    -- Memory leak check
    GLOBAL.c_checkleaks = function()
        collectgarbage("collect")
        local before = collectgarbage("count")
        
        -- Force a full garbage collection cycle
        for i = 1, 5 do
            collectgarbage("collect")
        end
        
        local after = collectgarbage("count")
        print("Memory before: " .. before .. " KB")
        print("Memory after: " .. after .. " KB")
        print("Difference: " .. (before - after) .. " KB")
        
        if before - after > 1000 then
            print("Significant memory recovered - possible leak sources exist")
        end
    end
end

AddGamePostInit(AddDebugConsoleCommands)
```

## Conclusion

Effective profiling and debugging are essential skills for creating high-performance mods. By systematically measuring, analyzing, and optimizing your code, you can ensure your mods run smoothly even in complex scenarios.

Remember these key principles:
- Always measure before and after optimizing
- Focus on the biggest bottlenecks first
- Use appropriate tools for different types of performance issues
- Implement proper cleanup to prevent memory leaks
- Test on various hardware configurations

## See also

- [Performance Optimization](optimization.md) - General performance optimization techniques
- [Reducing Resource Usage](resource-usage.md) - Strategies for minimizing resource consumption
- [Network Optimization](network-optimization.md) - Techniques for optimizing multiplayer performance
- [Entity System](../core/entity-system.md) - Understanding the entity framework
- [Event System](../core/event-system.md) - Working with the event system efficiently 
