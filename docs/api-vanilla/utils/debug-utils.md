---
id: debug-utils
title: Debug Utils
sidebar_position: 4
---

# Debug Utils

Don't Starve Together provides a variety of built-in utilities for debugging your mods. This page documents the available debug functions and tools that can help you troubleshoot issues and understand how your mod interacts with the game.

## Console Commands

These commands can be entered in the game console (accessed with the tilde key `~`):

### Entity Manipulation

```lua
c_select()                      -- Select entity under cursor
c_sel()                         -- Alias for c_select()
c_spawn("prefab_name", count)   -- Spawn entity
c_give("prefab_name", count)    -- Give item to player
c_remove()                      -- Remove selected entity
c_goto()                        -- Teleport to cursor position
```

### Player Manipulation

```lua
c_godmode()                     -- Toggle god mode
c_supergodmode()                -- Toggle super god mode (unlimited resources)
c_speedmult(multiplier)         -- Set player speed multiplier
c_sethealth(amount)             -- Set player health
c_sethunger(amount)             -- Set player hunger
c_setsanity(amount)             -- Set player sanity
```

### World Manipulation

```lua
c_season("season_name")         -- Change season (winter, summer, autumn, spring)
c_skip(days)                    -- Skip forward in time
c_settime(time)                 -- Set time of day (0-1)
c_setphase("day"|"dusk"|"night") -- Set time phase
c_setweather("rain"|"snow"|"none") -- Set weather
c_reveal()                      -- Reveal map
```

### Debugging

```lua
c_listallplayers()              -- List all players
c_listprefabs()                 -- List all prefabs
c_dumptags()                    -- Dump all entity tags
c_dumpentities()                -- Dump all entities
c_dumpcomponents(entity)        -- Dump components of an entity
```

## Debug Rendering

The game provides functions to visualize debug information:

```lua
-- Enable debug rendering
TheSim:SetDebugRenderEnabled(true)

-- Physics debug rendering
TheSim:SetDebugPhysicsRender(true)

-- Debug text rendering
TheSim:SetDebugTextRender(true)
```

### Custom Debug Rendering

You can add your own debug visualizations:

```lua
-- Draw a line
TheWorld.DebugRender:Line(x1, y1, z1, x2, y2, z2, r, g, b, a)

-- Draw a circle
TheWorld.DebugRender:Circle(x, y, z, radius, r, g, b, a)

-- Draw a string
TheWorld.DebugRender:String(x, y, z, text, r, g, b, a)

-- Draw a box
TheWorld.DebugRender:Box(x, y, z, w, h, d, r, g, b, a)
```

## Print Utilities

Enhanced printing functions for debugging:

```lua
-- Print a table with formatting
function dumptable(obj, indent)
    indent = indent or 0
    local indent_str = string.rep("  ", indent)
    
    if type(obj) ~= "table" then
        print(indent_str..tostring(obj))
        return
    end
    
    for k, v in pairs(obj) do
        if type(v) == "table" then
            print(indent_str..k..":")
            dumptable(v, indent + 1)
        else
            print(indent_str..k..": "..tostring(v))
        end
    end
end

-- Usage
dumptable(player.components)
```

## Debug Watches

You can set up watches to monitor values over time:

```lua
-- Create a debug watch
local function CreateWatch(name, fn)
    if not GLOBAL.DebugWatches then
        GLOBAL.DebugWatches = {}
    end
    
    GLOBAL.DebugWatches[name] = {
        fn = fn,
        history = {},
        max_history = 100
    }
end

-- Update watches
local function UpdateWatches()
    if not GLOBAL.DebugWatches then return end
    
    for name, watch in pairs(GLOBAL.DebugWatches) do
        local value = watch.fn()
        table.insert(watch.history, value)
        if #watch.history > watch.max_history then
            table.remove(watch.history, 1)
        end
    end
end

-- Print watch values
local function PrintWatch(name)
    if not GLOBAL.DebugWatches or not GLOBAL.DebugWatches[name] then
        print("Watch not found:", name)
        return
    end
    
    local watch = GLOBAL.DebugWatches[name]
    local current = watch.fn()
    
    print("Watch:", name)
    print("Current value:", current)
    print("History:", table.concat(watch.history, ", "))
end

-- Example usage
CreateWatch("player_health", function()
    if not ThePlayer or not ThePlayer.components.health then return 0 end
    return ThePlayer.components.health:GetPercent()
end)

-- Update watches periodically
TheWorld:DoPeriodicTask(1, UpdateWatches)

-- Add console command to print watch
GLOBAL.c_watch = function(name)
    PrintWatch(name)
end
```

## Entity Debugging

Functions to help debug entities:

```lua
-- Add a debug component to an entity
local function AddDebugComponent(inst)
    if inst.components.debuggable then return end
    
    inst:AddComponent("debuggable")
    inst.components.debuggable.ondebug = function(inst)
        print("=== DEBUG INFO FOR", inst.prefab, "===")
        print("Position:", inst:GetPosition())
        print("Tags:", table.concat(inst:GetDebugString(), ", "))
        
        print("Components:")
        for k, v in pairs(inst.components) do
            if type(v.GetDebugString) == "function" then
                print("  "..k..":", v:GetDebugString())
            else
                print("  "..k)
            end
        end
    end
end

-- Debug an entity with c_debug(entity)
GLOBAL.c_debug = function(inst)
    if not inst then
        inst = GLOBAL.c_select()
    end
    
    if not inst then
        print("No entity selected")
        return
    end
    
    if inst.components.debuggable then
        inst.components.debuggable:Debug()
    else
        AddDebugComponent(inst)
        inst.components.debuggable:Debug()
    end
end
```

## State Graph Debugging

Tools for debugging state graphs:

```lua
-- Monitor state transitions
local function MonitorStateGraph(sg)
    if sg._debug_hooked then return end
    
    local old_gotostate = sg.GoToState
    sg.GoToState = function(self, statename, ...)
        local from = self.currentstate and self.currentstate.name or "nil"
        print("State transition:", from, "->", statename)
        return old_gotostate(self, statename, ...)
    end
    
    sg._debug_hooked = true
end

-- Add console command to monitor state graph
GLOBAL.c_monitorsg = function(inst)
    if not inst then
        inst = GLOBAL.c_select()
    end
    
    if not inst or not inst.sg then
        print("No valid state graph found")
        return
    end
    
    MonitorStateGraph(inst.sg)
    print("Monitoring state graph for", inst.prefab)
end
```

## Network Debugging

Tools for debugging network synchronization:

```lua
-- Monitor dirty network variables
local function MonitorNetVars(inst)
    if inst._net_vars_monitored then return end
    
    local net_vars = {}
    
    -- Find all network variables
    for k, v in pairs(inst) do
        if type(v) == "table" and v.is_dirty ~= nil and type(v.is_dirty) == "function" then
            table.insert(net_vars, {name = k, var = v})
        end
    end
    
    if #net_vars == 0 then
        print("No network variables found on", inst.prefab)
        return
    end
    
    print("Found", #net_vars, "network variables on", inst.prefab)
    for _, net_var in ipairs(net_vars) do
        print("  "..net_var.name, "=", net_var.var:value())
    end
    
    -- Monitor changes
    inst:DoPeriodicTask(0.5, function()
        for _, net_var in ipairs(net_vars) do
            if net_var.var:is_dirty() then
                print("NetVar changed:", net_var.name, "=", net_var.var:value())
            end
        end
    end)
    
    inst._net_vars_monitored = true
end

-- Add console command to monitor network variables
GLOBAL.c_monitornet = function(inst)
    if not inst then
        inst = GLOBAL.c_select()
    end
    
    if not inst then
        print("No entity selected")
        return
    end
    
    MonitorNetVars(inst)
end
```

## Performance Profiling

Tools for profiling performance:

```lua
-- Simple function timer
function MeasureTime(fn, ...)
    local start_time = os.clock()
    local result = fn(...)
    local end_time = os.clock()
    print("Function took", (end_time - start_time) * 1000, "ms")
    return result
end

-- Function call counter
local function CreateCallCounter(fn, name)
    local counter = {
        calls = 0,
        total_time = 0,
        name = name or "function"
    }
    
    local wrapped = function(...)
        counter.calls = counter.calls + 1
        local start_time = os.clock()
        local result = fn(...)
        local end_time = os.clock()
        counter.total_time = counter.total_time + (end_time - start_time)
        return result
    end
    
    counter.report = function()
        print(counter.name, "called", counter.calls, "times")
        print("Total time:", counter.total_time * 1000, "ms")
        print("Average time:", (counter.total_time / counter.calls) * 1000, "ms")
    end
    
    return wrapped, counter
end

-- Usage
local original_fn = SomeFunction
local wrapped_fn, counter = CreateCallCounter(original_fn, "SomeFunction")
SomeFunction = wrapped_fn

-- Later, check the stats
counter.report()
```

## Memory Debugging

Tools for tracking memory usage:

```lua
-- Count entities by prefab
function CountEntities()
    local counts = {}
    local total = 0
    
    for k, v in pairs(Ents) do
        if v.prefab then
            counts[v.prefab] = (counts[v.prefab] or 0) + 1
            total = total + 1
        end
    end
    
    print("Total entities:", total)
    
    local sorted = {}
    for prefab, count in pairs(counts) do
        table.insert(sorted, {prefab = prefab, count = count})
    end
    
    table.sort(sorted, function(a, b) return a.count > b.count end)
    
    for i = 1, math.min(20, #sorted) do
        print(sorted[i].prefab, sorted[i].count)
    end
end

-- Add console command
GLOBAL.c_countentities = CountEntities
```

## Integration with Mod Configuration

To make debugging easier to toggle:

```lua
-- In modmain.lua
local DEBUG_MODE = GetModConfigData("debug_mode") or false

-- Create a debug logger
local function DebugLog(...)
    if not DEBUG_MODE then return end
    print("[DEBUG]", ...)
end

-- Example usage
DebugLog("Player position:", ThePlayer:GetPosition())
```

## Best Practices

1. **Use Conditional Debugging**: Wrap debug code in conditions to disable in production
2. **Clean Up Debug Output**: Remove or disable debug prints before releasing your mod
3. **Structured Logging**: Use consistent formats for debug messages
4. **Component Debug Strings**: Implement `GetDebugString()` for all custom components
5. **Separate Debug UI**: Create a separate UI for debugging that can be toggled
6. **Error Handling**: Use pcall() to catch and report errors gracefully

## Example: Complete Debug System

Here's an example of a more complete debug system for a mod:

```lua
-- Debug configuration
local DebugConfig = {
    enabled = GetModConfigData("debug_mode") or false,
    log_level = GetModConfigData("log_level") or "info", -- "debug", "info", "warning", "error"
    show_ui = GetModConfigData("debug_ui") or false,
    track_performance = GetModConfigData("track_performance") or false
}

-- Log levels
local LOG_LEVELS = {
    debug = 1,
    info = 2,
    warning = 3,
    error = 4
}

-- Debug module
local Debug = {
    watches = {},
    counters = {},
    timers = {}
}

-- Logging with levels
function Debug.Log(level, ...)
    if not DebugConfig.enabled then return end
    if LOG_LEVELS[level] < LOG_LEVELS[DebugConfig.log_level] then return end
    
    local args = {...}
    local msg = ""
    for i, v in ipairs(args) do
        if type(v) == "table" then
            msg = msg .. " " .. Debug.TableToString(v)
        else
            msg = msg .. " " .. tostring(v)
        end
    end
    
    print("[" .. string.upper(level) .. "]" .. msg)
end

-- Shorthand logging functions
function Debug.Debug(...) Debug.Log("debug", ...) end
function Debug.Info(...) Debug.Log("info", ...) end
function Debug.Warning(...) Debug.Log("warning", ...) end
function Debug.Error(...) Debug.Log("error", ...) end

-- Table to string conversion
function Debug.TableToString(t, indent)
    indent = indent or 0
    local result = ""
    local indent_str = string.rep("  ", indent)
    
    if type(t) ~= "table" then
        return tostring(t)
    end
    
    result = "{\n"
    for k, v in pairs(t) do
        result = result .. indent_str .. "  " .. tostring(k) .. " = "
        if type(v) == "table" then
            result = result .. Debug.TableToString(v, indent + 1)
        else
            result = result .. tostring(v)
        end
        result = result .. ",\n"
    end
    result = result .. indent_str .. "}"
    
    return result
end

-- Watch a value over time
function Debug.Watch(name, fn)
    if not DebugConfig.enabled then return end
    
    Debug.watches[name] = {
        fn = fn,
        history = {},
        max_history = 100
    }
end

-- Update all watches
function Debug.UpdateWatches()
    if not DebugConfig.enabled then return end
    
    for name, watch in pairs(Debug.watches) do
        local value = watch.fn()
        table.insert(watch.history, value)
        if #watch.history > watch.max_history then
            table.remove(watch.history, 1)
        end
    end
end

-- Performance tracking
function Debug.TimeFunction(fn, name)
    if not DebugConfig.enabled or not DebugConfig.track_performance then
        return fn
    end
    
    return function(...)
        local start_time = os.clock()
        local result = fn(...)
        local end_time = os.clock()
        local time_ms = (end_time - start_time) * 1000
        
        Debug.timers[name] = Debug.timers[name] or {
            total_time = 0,
            calls = 0,
            avg_time = 0,
            max_time = 0
        }
        
        local timer = Debug.timers[name]
        timer.total_time = timer.total_time + time_ms
        timer.calls = timer.calls + 1
        timer.avg_time = timer.total_time / timer.calls
        timer.max_time = math.max(timer.max_time, time_ms)
        
        return result
    end
end

-- Report performance stats
function Debug.ReportPerformance()
    if not DebugConfig.enabled or not DebugConfig.track_performance then return end
    
    Debug.Info("Performance Report:")
    for name, timer in pairs(Debug.timers) do
        Debug.Info(string.format("  %s: %d calls, %.2f ms total, %.2f ms avg, %.2f ms max",
            name, timer.calls, timer.total_time, timer.avg_time, timer.max_time))
    end
end

-- Initialize debug system
function Debug.Init()
    if not DebugConfig.enabled then return end
    
    Debug.Info("Debug mode enabled")
    
    -- Set up periodic tasks
    TheWorld:DoPeriodicTask(1, Debug.UpdateWatches)
    TheWorld:DoPeriodicTask(60, Debug.ReportPerformance)
    
    -- Add debug commands
    GLOBAL.c_debugreport = Debug.ReportPerformance
    
    -- Set up debug UI if enabled
    if DebugConfig.show_ui then
        Debug.InitUI()
    end
end

-- Initialize debug UI
function Debug.InitUI()
    -- Create a simple debug overlay
    local screen = TheFrontEnd:GetActiveScreen()
    if not screen then return end
    
    local root = screen.root
    if not root then return end
    
    local debug_root = root:AddChild(Widget("debug_root"))
    debug_root:SetVAnchor(ANCHOR_TOP)
    debug_root:SetHAnchor(ANCHOR_LEFT)
    debug_root:SetPosition(10, -10, 0)
    
    local debug_text = debug_root:AddChild(Text(NUMBERFONT, 16))
    debug_text:SetString("Debug Mode")
    debug_text:SetColour(1, 1, 0, 1)
    
    debug_root:SetOnUpdate(function()
        local text = "DEBUG MODE\n"
        text = text .. "FPS: " .. tostring(math.floor(1/TheSim:GetFrameTime())) .. "\n"
        
        if ThePlayer then
            local x, y, z = ThePlayer.Transform:GetWorldPosition()
            text = text .. string.format("Pos: %.1f, %.1f, %.1f\n", x, y, z)
            
            if ThePlayer.components.health then
                text = text .. "Health: " .. tostring(ThePlayer.components.health.currenthealth) .. "\n"
            end
        end
        
        debug_text:SetString(text)
    end)
end

-- Export the debug module
return Debug
```

## Conclusion

These debug utilities can significantly speed up your mod development process by helping you identify and fix issues more quickly. Remember to disable or remove debug code before releasing your mod to ensure optimal performance for players. 