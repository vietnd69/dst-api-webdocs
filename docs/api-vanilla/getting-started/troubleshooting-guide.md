---
id: troubleshooting-guide
title: Troubleshooting Guide
sidebar_position: 5
slug: /api/troubleshooting-guide
---

# Troubleshooting Guide

This guide provides solutions for common errors and issues you might encounter when developing mods for Don't Starve Together.

## Common Errors and Solutions

### Lua Script Errors

| Error | Description | Solution |
|-------|-------------|----------|
| `attempt to index a nil value` | Trying to access a property of an object that doesn't exist | Check if the object exists before accessing its properties: `if obj and obj.property then` |
| `attempt to call a nil value` | Trying to call a function that doesn't exist | Verify function names and that required modules are loaded |
| `bad argument #X to function` | Passing incorrect parameter type | Check parameter types and function documentation |
| `stack overflow` | Infinite recursion in your code | Look for circular function calls or unbounded recursive functions |
| `attempt to perform arithmetic on X` | Using math operations on non-number values | Ensure variables are numbers before arithmetic operations |
| `attempt to concatenate X` | Using string concatenation on incompatible types | Convert values to strings before concatenation: `tostring(value)` |
| `unexpected symbol near X` | Syntax error in your code | Check for missing brackets, commas, or other syntax issues |

### Mod Loading Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Mod doesn't appear in mod list | Incorrect folder structure or missing modinfo.lua | Verify your folder structure follows `ModName/modinfo.lua` and `ModName/modmain.lua` |
| Mod crashes on load | Error in modmain.lua or required files | Check console for error messages and fix the identified issues |
| Assets not loading | Incorrect path or format | Verify asset paths and formats in your modmain.lua |
| "Error loading mod" message | Various issues with mod structure or code | Check the log file for detailed error messages |
| Mod loads but doesn't work | Initialization issues or errors in event handlers | Add debug prints to trace execution flow and identify where it fails |

### Component-Related Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `entity.components.X is nil` | Component doesn't exist on the entity | Check if the entity has the component before accessing it: `if entity.components.health then` |
| Component functions not working | Using server-side components on client | Remember that most components only exist on the server side |
| Component state not saving | Missing OnSave/OnLoad implementation | Implement proper serialization with OnSave and OnLoad functions |
| Component conflicts | Multiple mods modifying the same component | Use component postinits instead of replacing components |

### Network Synchronization Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Desync between clients | Inconsistent state between server and clients | Use proper network variables and RPC calls for synchronization |
| Client-side changes not visible to others | Not using network variables | Use net_* variables for data that needs to be synchronized |
| Server-only features not working | Accessing server components on client | Check `TheNet:GetIsServer()` before accessing server-only features |
| "Cannot call RPC from client" error | Trying to send an RPC from the wrong side | Ensure RPCs are called from the correct context (client or server) |
| Lag when performing actions | Inefficient network code | Batch network updates and optimize RPC calls |

## Debugging Techniques

### Reading and Understanding Error Messages

DST error messages typically follow this format:
```
[00:00:00]: LUA ERROR script/file_name.lua(line_number) some error message
```

To debug effectively:
1. Identify the file and line number where the error occurred
2. Look at the error message to understand what went wrong
3. Check the surrounding code for issues

### Using Log Files

The game generates log files that contain valuable debugging information:

- **Windows**: `%USERPROFILE%\Documents\Klei\DoNotStarveTogether\client_log.txt`
- **Mac**: `~/Documents/Klei/DoNotStarveTogether/client_log.txt`
- **Linux**: `~/.klei/DoNotStarveTogether/client_log.txt`

For dedicated servers, check:
- `YourDSTServerFolder/Cluster_X/Master/server_log.txt`
- `YourDSTServerFolder/Cluster_X/Caves/server_log.txt`

### Comprehensive Guide to Reading Logs and Error Messages

#### Understanding DST Log Structure

DST log files contain a wealth of information for debugging. Here's how to effectively read and analyze them:

##### Log File Anatomy

A typical DST log file contains several sections:

1. **System Information**: Details about the game version, OS, and hardware
2. **Mod Loading**: Information about mods being loaded and initialized
3. **Game Startup**: World generation and game initialization
4. **Runtime Events**: Game events, user actions, and errors
5. **Shutdown Information**: Clean-up and exit processes

##### Log Entry Format

```
[HH:MM:SS]: [Category] Message content
```

For example:
```
[12:34:56]: [Workshop] Successfully downloaded mod: 123456789
[12:35:01]: [Network] Client connected from: 192.168.1.100
[12:35:10]: LUA ERROR scripts/mymod/modmain.lua(25) attempt to index a nil value
```

#### Common Error Types and How to Interpret Them

##### 1. Nil Value Errors

```
LUA ERROR scripts/mymod/modmain.lua(25) attempt to index a nil value
```

**What it means**: You're trying to access a property of an object that doesn't exist.

**How to debug**:
1. Check line 25 in modmain.lua
2. Look for expressions like `something.property` where `something` might be nil
3. Add a check before accessing properties: `if something then something.property end`

**Common causes**:
- Accessing components that don't exist on an entity
- Using global variables before they're initialized
- Typos in variable or function names

##### 2. Function Call Errors

```
LUA ERROR scripts/mymod/modmain.lua(42) attempt to call a nil value
```

**What it means**: You're trying to call a function that doesn't exist.

**How to debug**:
1. Check line 42 in modmain.lua
2. Look for function calls like `something:Function()` or `Function()`
3. Verify the function exists and is spelled correctly

**Common causes**:
- Calling methods on nil objects
- Typos in function names
- Using functions from modules that weren't required

##### 3. Type Errors

```
LUA ERROR scripts/mymod/modmain.lua(67) attempt to perform arithmetic on a string value
```

**What it means**: You're trying to perform an operation on a value of the wrong type.

**How to debug**:
1. Check line 67 in modmain.lua
2. Look for operations like `value + 10` where `value` might not be a number
3. Add type conversion: `tonumber(value) + 10`

**Common causes**:
- Not converting string inputs to numbers
- Mixing incompatible types in operations
- Using API functions that return unexpected types

##### 4. Stack Overflow Errors

```
LUA ERROR stack overflow
```

**What it means**: You have infinite recursion in your code.

**How to debug**:
1. Look for functions that call themselves directly or indirectly
2. Check for missing base cases in recursive functions
3. Look for circular references in event handlers

**Common causes**:
- Recursive functions without proper termination conditions
- Event handlers that trigger themselves
- Circular dependencies between functions

##### 5. Network Errors

```
LUA ERROR scripts/mymod/modmain.lua(120) Cannot send RPC from client
```

**What it means**: You're trying to perform a server-side operation from the client.

**How to debug**:
1. Check line 120 in modmain.lua
2. Look for RPC calls or server-side operations
3. Add a check for server context: `if TheNet:GetIsServer() then ... end`

**Common causes**:
- Attempting to modify server-only data from client
- Calling server-only functions from client code
- Not properly separating client and server logic

#### Advanced Log Analysis Techniques

##### Extracting Relevant Information

When dealing with large log files, use these techniques to find relevant information:

**On Windows**:
```
findstr "ERROR" client_log.txt
findstr "MyModName" client_log.txt
```

**On Mac/Linux**:
```
grep "ERROR" client_log.txt
grep "MyModName" client_log.txt
```

##### Creating Timestamped Logs

Add timestamps to your debug prints to track sequence of events:

```lua
function DebugLog(message)
    print(string.format("[%s] %s", os.date("%H:%M:%S"), message))
end

-- Usage
DebugLog("Player entered cave")
```

##### Tracking Error Frequency

Track how often specific errors occur:

```lua
local error_counts = {}

function TrackError(error_type)
    error_counts[error_type] = (error_counts[error_type] or 0) + 1
    print(error_type .. " error occurred " .. error_counts[error_type] .. " times")
end

-- Usage
TrackError("nil_component")
```

#### Analyzing Server Logs

Server logs contain additional information useful for debugging multiplayer issues:

##### Connection Issues

Look for entries like:
```
[14:23:45]: [Shard] Lost connection to master shard
[14:23:50]: [Shard] Reconnected to master shard
```

These indicate network connectivity problems between server shards.

##### Performance Issues

Look for entries like:
```
[15:34:12]: [Warning] Server tick took 245ms (warning threshold: 200ms)
```

These indicate server performance problems that might cause lag.

##### Client Disconnections

Look for entries like:
```
[16:45:23]: [Network] Client 'PlayerName' disconnected: Connection timed out
```

These help diagnose player connection issues.

#### Creating Custom Logging Systems

For complex mods, create a dedicated logging system:

```lua
-- In a separate file like logger.lua
local Logger = {}

Logger.LEVELS = {
    DEBUG = 1,
    INFO = 2,
    WARNING = 3,
    ERROR = 4
}

local current_level = Logger.LEVELS.INFO
local log_file = "mod_log.txt"

function Logger.SetLevel(level)
    current_level = level
end

function Logger.Log(level, message, ...)
    if level < current_level then return end
    
    local formatted_message = string.format(message, ...)
    local level_str = "INFO"
    
    if level == Logger.LEVELS.DEBUG then level_str = "DEBUG"
    elseif level == Logger.LEVELS.WARNING then level_str = "WARNING"
    elseif level == Logger.LEVELS.ERROR then level_str = "ERROR"
    end
    
    local log_entry = string.format("[%s][%s] %s", 
        os.date("%Y-%m-%d %H:%M:%S"),
        level_str,
        formatted_message
    )
    
    print(log_entry)
    
    -- Optionally write to a file
    -- (Note: File I/O is limited in DST mods)
end

function Logger.Debug(message, ...) Logger.Log(Logger.LEVELS.DEBUG, message, ...) end
function Logger.Info(message, ...) Logger.Log(Logger.LEVELS.INFO, message, ...) end
function Logger.Warning(message, ...) Logger.Log(Logger.LEVELS.WARNING, message, ...) end
function Logger.Error(message, ...) Logger.Log(Logger.LEVELS.ERROR, message, ...) end

return Logger

-- Usage in your mod:
-- local Logger = require "logger"
-- Logger.SetLevel(Logger.LEVELS.DEBUG)
-- Logger.Debug("Player position: %d, %d", x, y)
```

#### Interpreting Common DST-Specific Log Messages

##### Asset Loading Errors

```
[12:34:56]: [Warning] Asset not found: anim/missing_file.zip
```

**What it means**: The game can't find a required asset file.

**How to debug**:
1. Check if the file exists in your mod's files
2. Verify the path is correct
3. Make sure the file is properly formatted

##### Component-Related Errors

```
[12:34:56]: LUA ERROR attempt to index field 'components' (a nil value)
```

**What it means**: You're trying to access components on an entity that doesn't exist.

**How to debug**:
1. Check if the entity exists before accessing components
2. Verify the entity has been properly initialized
3. Use safer access patterns: `inst and inst.components and inst.components.health`

##### Event-Related Errors

```
[12:34:56]: LUA ERROR attempt to call method 'PushEvent' (a nil value)
```

**What it means**: You're trying to trigger an event on an invalid object.

**How to debug**:
1. Check if the object exists before pushing events
2. Verify event names are correct
3. Make sure you're using the correct object (inst vs. TheWorld)

#### Practical Log Analysis Examples

##### Example 1: Diagnosing a Nil Component Error

```
[12:34:56]: LUA ERROR scripts/mymod/modmain.lua(42) attempt to index field 'hunger' of a nil value
```

**Analysis**:
1. Line 42 is trying to access `something.hunger`
2. `something` is nil at this point
3. Check what `something` should be and why it might be nil

**Potential fix**:
```lua
-- Before
local hunger_value = player.components.hunger.current

-- After
if player and player.components and player.components.hunger then
    local hunger_value = player.components.hunger.current
else
    print("Warning: Could not access hunger component")
end
```

##### Example 2: Diagnosing a Network Error

```
[12:34:56]: LUA ERROR scripts/mymod/modmain.lua(87) Cannot send RPC from client
```

**Analysis**:
1. Line 87 is trying to send an RPC from the client side
2. RPCs that modify game state must be sent from the server

**Potential fix**:
```lua
-- Before
SendModRPCToServer(MOD_RPC.MyMod.DoSomething, target_player)

-- After
if TheNet:GetIsServer() then
    -- Direct server-side call
    DoSomethingServerSide(target_player)
else
    -- RPC call from client
    SendModRPCToServer(MOD_RPC.MyMod.DoSomething, target_player)
end
```

##### Example 3: Diagnosing a Performance Issue

```
[12:34:56]: [Warning] Server tick took 245ms (warning threshold: 200ms)
```

**Analysis**:
1. The server is taking too long to process a game tick
2. This will cause lag for all players
3. Look for expensive operations in your mod

**Potential fix**:
```lua
-- Before
-- Checking all entities every frame
AddComponentPostInit("health", function(self)
    local old_DoDelta = self.DoDelta
    self.DoDelta = function(self, amount, ...)
        -- Expensive operation
        local entities = TheSim:FindEntities(x, y, z, 100)
        for _, ent in ipairs(entities) do
            -- Do something with each entity
        end
        return old_DoDelta(self, amount, ...)
    end
end)

-- After
-- Use a timer to reduce frequency
local EXPENSIVE_CHECK_INTERVAL = 1 -- Once per second
local last_check_time = 0

AddComponentPostInit("health", function(self)
    local old_DoDelta = self.DoDelta
    self.DoDelta = function(self, amount, ...)
        local current_time = GetTime()
        if current_time - last_check_time > EXPENSIVE_CHECK_INTERVAL then
            last_check_time = current_time
            -- Expensive operation, but less frequent
            local entities = TheSim:FindEntities(x, y, z, 100)
            for _, ent in ipairs(entities) do
                -- Do something with each entity
            end
        end
        return old_DoDelta(self, amount, ...)
    end
end)
```

#### Console Commands for Log Analysis

Use these console commands to help with log analysis:

```lua
-- Enable verbose logging
c_verboseerrors()

-- Print all entities in the world
c_listallentities()

-- Print all prefabs in the game
c_listprefabs()

-- Print all components on the selected entity
c_select(); c_listcomponents()

-- Print all event listeners on the selected entity
c_select(); c_listlisteners()
```

#### Troubleshooting Workflow Using Logs

1. **Identify the error**: Find the specific error message in the log
2. **Locate the source**: Note the file and line number
3. **Understand the context**: Check what happened before the error
4. **Reproduce the issue**: Try to consistently trigger the error
5. **Add debug prints**: Add strategic print statements around the error location
6. **Test incrementally**: Make small changes and check logs after each change
7. **Verify the fix**: Ensure the error no longer appears in logs

### Console Commands for Debugging

Use these console commands to help with log analysis:

```lua
-- Enable verbose logging
c_verboseerrors()

-- Print all entities in the world
c_listallentities()

-- Print all prefabs in the game
c_listprefabs()

-- Print all components on the selected entity
c_select(); c_listcomponents()

-- Print all event listeners on the selected entity
c_select(); c_listlisteners()
```

## Compatibility Issues Between Mods

### Identifying Mod Conflicts

Signs of mod conflicts include:
- Game crashes when specific combinations of mods are enabled
- Features from one mod stop working when another is enabled
- Errors mentioning functions or prefabs from other mods

### Resolving Mod Conflicts

1. **Load Order**: Adjust mod load order in the mod configuration screen
2. **Shared Prefabs**: Use `AddPrefabPostInit` instead of replacing prefabs
3. **Component Conflicts**: Use component postinits and check if components were already modified
4. **Global Variable Conflicts**: Use namespaces for your global variables
5. **Asset Conflicts**: Use unique names for your assets

Example of safer component modification:
```lua
-- Instead of replacing a component function entirely
local function SafeComponentModification(inst)
    if inst.components.health then
        local old_DoDelta = inst.components.health.DoDelta
        inst.components.health.DoDelta = function(self, amount, ...)
            print("Health changed by: " .. amount)
            return old_DoDelta(self, amount, ...)
        end
    end
end
```

### Advanced Compatibility Strategies

#### Mod Detection and Adaptation

Detect and adapt to other mods being present:

```lua
-- Check if another mod is enabled
local function IsModEnabled(modname)
    for _, mod in pairs(ModManager.mods) do
        if mod.modname == modname and mod.enabled then
            return true
        end
    end
    return false
end

-- Adapt your mod based on other mods
if IsModEnabled("workshop-123456789") then
    -- Compatibility code for this specific mod
    print("Detected mod XYZ, enabling compatibility mode")
    -- Adjust your mod's behavior accordingly
end
```

#### Shared API System

Create an API system that other mods can hook into:

```lua
-- In your modmain.lua
GLOBAL.YOUR_MOD_API = GLOBAL.YOUR_MOD_API or {}

-- Add functions to your API
GLOBAL.YOUR_MOD_API.Version = "1.0"
GLOBAL.YOUR_MOD_API.RegisterItem = function(item_data)
    -- Process and register items from other mods
end

-- Document your API for other modders
```

#### Conflict Resolution Techniques

##### 1. Function Hooking with Priority

```lua
-- Create a hook system with priority levels
local hooks = {}

function AddHook(event_name, fn, priority)
    priority = priority or 0
    hooks[event_name] = hooks[event_name] or {}
    
    table.insert(hooks[event_name], {
        fn = fn,
        priority = priority
    })
    
    -- Sort hooks by priority (higher numbers run first)
    table.sort(hooks[event_name], function(a, b)
        return a.priority > b.priority
    end)
end

function RunHooks(event_name, ...)
    if not hooks[event_name] then return end
    
    local results = {}
    for _, hook in ipairs(hooks[event_name]) do
        local result = hook.fn(...)
        if result ~= nil then
            table.insert(results, result)
        end
    end
    
    return results
end

-- Usage
AddHook("player_health_change", function(player, amount)
    print("Hook executed with priority 10")
    -- Return true to override default behavior
end, 10)
```

##### 2. Safe Component Overriding

```lua
-- Safe way to override component methods
function SafeOverrideComponentMethod(component_name, method_name, override_fn)
    -- Store original component constructor
    local original_component_fn = require("components/" .. component_name)
    
    -- Create a new constructor that adds our override
    local function new_component_fn(...)
        local component = original_component_fn(...)
        
        -- Store the original method
        local original_method = component[method_name]
        
        -- Replace with our override that calls the original
        component[method_name] = function(self, ...)
            return override_fn(original_method, self, ...)
        end
        
        return component
    end
    
    -- Replace the component constructor
    package.loaded["components/" .. component_name] = new_component_fn
end

-- Example usage
SafeOverrideComponentMethod("health", "DoDelta", function(original_fn, self, amount, ...)
    print("Health delta:", amount)
    
    -- You can modify the amount or add conditions
    if amount < 0 then
        amount = amount * 0.9 -- 10% damage reduction
    end
    
    return original_fn(self, amount, ...)
end)
```

##### 3. Prefab Compatibility Layer

```lua
-- Create a system to safely modify prefabs even if other mods change them
local prefab_patches = {}

function RegisterPrefabPatch(prefab_name, patch_fn, priority)
    prefab_patches[prefab_name] = prefab_patches[prefab_name] or {}
    
    table.insert(prefab_patches[prefab_name], {
        fn = patch_fn,
        priority = priority or 0
    })
    
    -- Sort patches by priority
    table.sort(prefab_patches[prefab_name], function(a, b)
        return a.priority > b.priority
    end)
end

-- Apply all registered patches to a prefab
function ApplyPrefabPatches(inst)
    local prefab_name = inst.prefab
    if not prefab_patches[prefab_name] then return end
    
    for _, patch in ipairs(prefab_patches[prefab_name]) do
        patch.fn(inst)
    end
end

-- Register patches for prefabs
RegisterPrefabPatch("wilson", function(inst)
    print("Patching Wilson prefab")
    -- Your modifications here
end, 10)

-- Apply patches using AddPrefabPostInit
for prefab_name, _ in pairs(prefab_patches) do
    AddPrefabPostInit(prefab_name, ApplyPrefabPatches)
end
```

#### Handling Specific Compatibility Issues

##### Conflicting Key Bindings

```lua
-- Check if a key is already bound by another mod
local function IsKeyAlreadyBound(key)
    for _, mod_key in pairs(GLOBAL.TheInput:GetAllBindings()) do
        if mod_key.key == key then
            return true, mod_key.name
        end
    end
    return false
end

-- Find an alternative key if there's a conflict
local function FindAlternativeKey(preferred_key)
    if not IsKeyAlreadyBound(preferred_key) then
        return preferred_key
    end
    
    -- List of alternative keys to try
    local alternatives = {"KEY_P", "KEY_O", "KEY_I", "KEY_U"}
    
    for _, alt_key in ipairs(alternatives) do
        if not IsKeyAlreadyBound(alt_key) then
            print("Using alternative key binding:", alt_key)
            return alt_key
        end
    end
    
    -- If all alternatives are taken, use the original but warn the user
    print("Warning: Could not find free key binding, using", preferred_key)
    return preferred_key
end

-- Use the result to configure your key binding
local my_key = FindAlternativeKey("KEY_H")
```

##### Conflicting Prefab Names

```lua
-- Generate a unique prefab name to avoid conflicts
local function GetUniquePrefabName(base_name)
    local modname = modname:gsub("workshop%-", "")
    return base_name .. "_" .. modname
end

-- Use the unique name when registering your prefab
local my_unique_prefab = GetUniquePrefabName("magicstaff")
```

##### Conflicting Recipe Names

```lua
-- Check if a recipe already exists
local function RecipeExists(name)
    for _, recipe in ipairs(AllRecipes) do
        if recipe.name == name then
            return true
        end
    end
    return false
end

-- Add a recipe with a fallback name if needed
local function AddSafeRecipe(recipe_data)
    if RecipeExists(recipe_data.name) then
        local original_name = recipe_data.name
        recipe_data.name = GetUniquePrefabName(recipe_data.name)
        print("Recipe name conflict: renamed", original_name, "to", recipe_data.name)
    end
    
    AddRecipe(recipe_data)
end
```

#### Testing for Compatibility

Create a systematic approach to test mod compatibility:

1. **Identify popular mods** in the same category as yours
2. **Create a test matrix** of mod combinations to test
3. **Document known conflicts** and solutions
4. **Provide configuration options** to handle specific mod conflicts

Example test protocol:

```lua
-- In a development testing file
local mods_to_test = {
    "workshop-123456789", -- Character Framework
    "workshop-987654321", -- Item Expansion
    -- Add more mods to test
}

local function TestModCompatibility()
    print("=== MOD COMPATIBILITY TEST ===")
    
    -- Test each mod individually
    for _, mod_id in ipairs(mods_to_test) do
        print("Testing with mod:", mod_id)
        -- Enable just this mod and your mod
        -- Run through test scenarios
        -- Document any issues
    end
    
    -- Test common combinations
    print("Testing mod combinations...")
    -- Enable specific combinations
    -- Run through test scenarios
    
    print("=== TEST COMPLETE ===")
end
```

#### Creating Compatibility Patches

For known conflicts, create specific compatibility patches:

```lua
-- Compatibility patch for a specific mod
local function PatchForPopularMod()
    if not IsModEnabled("workshop-123456789") then return end
    
    print("Applying compatibility patch for Popular Mod")
    
    -- Override conflicting functions
    local old_fn = GLOBAL.SomeModFunction
    GLOBAL.SomeModFunction = function(...)
        -- Modified version that works with your mod
        return old_fn(...)
    end
    
    -- Adjust your mod's behavior
    YOUR_MOD_CONFIG.use_alternative_method = true
end

-- Apply patches during initialization
AddSimPostInit(function()
    PatchForPopularMod()
    -- Other compatibility patches
end)
```

## Step-by-Step Debugging Process

When encountering issues with your mod, follow this systematic approach:

1. **Identify the problem**: What exactly isn't working? Under what conditions?
2. **Check error logs**: Look for error messages in the console and log files
3. **Isolate the issue**: Disable other mods to see if it's a compatibility problem
4. **Add debugging code**: Insert print statements to trace execution flow
5. **Test incrementally**: Make small changes and test after each change
6. **Verify assumptions**: Check that variables contain what you expect them to
7. **Simplify**: Create a minimal test case that reproduces the issue

## Step-by-Step Bug Testing Workflow

A systematic approach to testing and fixing bugs in DST mods can save time and frustration. Follow this workflow to efficiently identify, isolate, and resolve issues in your mods.

### 1. Preparation Phase

#### Setup a Testing Environment

```lua
-- Create a function to reset the test environment
function SetupTestEnvironment()
    -- Clear the area
    local x, y, z = ThePlayer.Transform:GetWorldPosition()
    local ents = TheSim:FindEntities(x, y, z, 20)
    for _, ent in ipairs(ents) do
        if ent ~= ThePlayer and ent.prefab ~= "global" then
            ent:Remove()
        end
    end
    
    -- Set up ideal testing conditions
    c_setseasonclock("summer", 0.5)  -- Set season
    TheWorld.state.isday = true       -- Make it daytime
    c_speed(0)                        -- Reset game speed
    
    -- Give player necessary items
    c_give("log", 10)
    c_give("cutgrass", 10)
    c_give("twigs", 10)
    
    -- Reset player state
    ThePlayer.components.health:SetPercent(1)
    ThePlayer.components.sanity:SetPercent(1)
    ThePlayer.components.hunger:SetPercent(1)
    
    print("Test environment ready")
end
```

#### Create a Bug Report Template

Use a consistent format for documenting bugs:

```
BUG REPORT: [Short description]
VERSION: [Mod version]
ENVIRONMENT: [Game version, OS, single/multiplayer]
STEPS TO REPRODUCE:
1. [First step]
2. [Second step]
3. [Third step]
EXPECTED BEHAVIOR: [What should happen]
ACTUAL BEHAVIOR: [What actually happens]
ERROR MESSAGES: [Any errors from console/logs]
FREQUENCY: [Always/Sometimes/Rarely]
WORKAROUND: [If any]
```

### 2. Identification Phase

#### Reproduce the Bug Consistently

First, establish a reliable way to reproduce the issue:

1. **Start with a clean state**: Disable all other mods
2. **Document exact steps**: Note the precise sequence of actions
3. **Identify triggers**: Determine what specific conditions cause the bug
4. **Simplify**: Remove unnecessary steps until you have the minimal reproduction case

#### Gather Information

Collect all relevant information about the bug:

```lua
-- Add this to your mod to collect system information
function GatherSystemInfo()
    local info = {
        game_version = TUNING.GAME_VERSION,
        is_server = TheNet:GetIsServer(),
        is_dedicated = TheNet:IsDedicated(),
        is_master_sim = TheWorld.ismastersim,
        platform = PLATFORM,
        mod_version = "1.0.0", -- Your mod version
        mods_enabled = {}
    }
    
    -- Get list of enabled mods
    for _, mod in pairs(ModManager.mods) do
        if mod.enabled then
            table.insert(info.mods_enabled, {
                name = mod.name,
                version = mod.version or "unknown"
            })
        end
    end
    
    -- Print the information
    print("=== System Information ===")
    for k, v in pairs(info) do
        if type(v) ~= "table" then
            print(k .. ": " .. tostring(v))
        else
            print(k .. ":")
            for _, item in ipairs(v) do
                print("  - " .. item.name .. " (" .. item.version .. ")")
            end
        end
    end
    print("=========================")
    
    return info
end
```

### 3. Isolation Phase

#### Narrow Down the Cause

Systematically eliminate possibilities:

1. **Component by component**: Disable parts of your mod to identify the problematic component
2. **Function by function**: Add debug prints to track which functions are being called
3. **Line by line**: Use binary search (comment out half the code, then half of the remaining code) to find the exact line causing the issue

```lua
-- Example of isolating a specific component
function TestComponentInIsolation(component_name)
    print("Testing " .. component_name .. " in isolation")
    
    -- Temporarily disable other components
    local disabled_components = {}
    for name, _ in pairs(MYMOD.components) do
        if name ~= component_name then
            disabled_components[name] = true
            MYMOD.components[name].enabled = false
        end
    end
    
    -- Run your test
    print("Running test with only " .. component_name .. " enabled")
    -- Your test code here
    
    -- Re-enable components
    for name, _ in pairs(disabled_components) do
        MYMOD.components[name].enabled = true
    end
end
```

#### Check for External Factors

Sometimes the bug is caused by external factors:

1. **Mod conflicts**: Test with different combinations of mods
2. **Game version**: Check if the bug appears in different game versions
3. **World settings**: Test with different world generation settings
4. **Character-specific**: Test with different characters

### 4. Analysis Phase

#### Trace the Execution Flow

Add strategic print statements to trace the execution flow:

```lua
-- Add this to the start of important functions
function TraceFunction(name, ...)
    local args = {...}
    local args_str = ""
    for i, arg in ipairs(args) do
        args_str = args_str .. tostring(arg)
        if i < #args then args_str = args_str .. ", " end
    end
    
    print("TRACE: Entering " .. name .. "(" .. args_str .. ")")
    
    return function(result)
        print("TRACE: Exiting " .. name .. " -> " .. tostring(result))
        return result
    end
end

-- Usage
function MyFunction(a, b)
    local trace_exit = TraceFunction("MyFunction", a, b)
    
    -- Function body
    local result = a + b
    
    return trace_exit(result)
end
```

#### Check State Changes

Monitor important state changes:

```lua
-- Track changes to a specific value
function TrackValueChanges(obj, property_name)
    local original_value = obj[property_name]
    
    -- Create a proxy with getter and setter
    local proxy = {}
    local mt = {
        __index = function(t, k)
            if k == property_name then
                return original_value
            else
                return obj[k]
            end
        end,
        __newindex = function(t, k, v)
            if k == property_name then
                print("Value changed: " .. property_name .. " = " .. tostring(v) .. " (was " .. tostring(original_value) .. ")")
                print(debug.traceback("Stack trace:", 2))
                original_value = v
            else
                obj[k] = v
            end
        end
    }
    
    setmetatable(proxy, mt)
    return proxy
end

-- Usage
local tracked_player = TrackValueChanges(ThePlayer, "health")
```

### 5. Solution Phase

#### Implement a Fix

Once you've identified the cause, implement a fix:

1. **Keep it simple**: Make the minimal change needed to fix the issue
2. **Consider edge cases**: Make sure your fix handles all possible scenarios
3. **Maintain compatibility**: Ensure your fix doesn't break other functionality
4. **Add safeguards**: Add checks to prevent the issue from recurring

```lua
-- Example of a robust fix with safeguards
local old_function = SomeFunction
function SomeFunction(...)
    -- Add safeguards
    if not TheWorld or not TheWorld.ismastersim then
        return -- Prevent execution in invalid context
    end
    
    -- Add parameter validation
    local arg1, arg2 = ...
    if type(arg1) ~= "number" or arg1 <= 0 then
        print("Warning: SomeFunction received invalid arg1:", arg1)
        arg1 = 1 -- Use safe default
    end
    
    -- Call original with validated parameters
    return old_function(arg1, arg2)
end
```

#### Test the Fix

Thoroughly test your fix:

1. **Verify the fix**: Confirm the bug no longer occurs in the original reproduction case
2. **Test edge cases**: Try extreme values and unusual conditions
3. **Check for regressions**: Make sure other functionality still works
4. **Test performance**: Ensure the fix doesn't cause performance issues

### 6. Verification Phase

#### Create Automated Tests

For complex mods, create automated tests to prevent regression:

```lua
-- Simple test framework
local Tests = {}

function Tests.AddTest(name, test_fn)
    Tests[name] = test_fn
end

function Tests.RunAll()
    local passed = 0
    local failed = 0
    local failed_tests = {}
    
    print("Running " .. #Tests .. " tests...")
    
    for name, test_fn in pairs(Tests) do
        if type(test_fn) == "function" then
            local success, result = pcall(test_fn)
            if success and result == true then
                passed = passed + 1
                print("✓ " .. name .. " passed")
            else
                failed = failed + 1
                table.insert(failed_tests, name)
                print("✗ " .. name .. " failed: " .. tostring(result))
            end
        end
    end
    
    print("Tests complete: " .. passed .. " passed, " .. failed .. " failed")
    if failed > 0 then
        print("Failed tests:")
        for _, name in ipairs(failed_tests) do
            print("  - " .. name)
        end
    end
end

-- Example test
Tests.AddTest("InventoryFunctions", function()
    -- Setup
    local player = ThePlayer
    local had_item = player.components.inventory:Has("log", 1)
    
    -- Give item if needed
    if not had_item then
        player.components.inventory:GiveItem(SpawnPrefab("log"))
    end
    
    -- Test function
    local result = MyMod.CountPlayerItems(player, "log")
    
    -- Cleanup
    if not had_item then
        local item = player.components.inventory:FindItem(function(item) return item.prefab == "log" end)
        if item then
            item:Remove()
        end
    end
    
    -- Verify
    return result > 0
end)
```

#### Document the Bug and Solution

Create documentation for the bug and its solution:

1. **Update your bug tracker**: Mark the bug as fixed and document the solution
2. **Add comments**: Add explanatory comments to the fixed code
3. **Update release notes**: Include the fix in your mod's release notes
4. **Share knowledge**: If appropriate, share the solution with the modding community

### 7. Prevention Phase

#### Implement Error Prevention Measures

Add code to prevent similar bugs in the future:

```lua
-- Add validation to critical functions
function ValidateParameters(params, schema)
    for name, requirements in pairs(schema) do
        local value = params[name]
        
        -- Check required parameters
        if requirements.required and value == nil then
            return false, "Missing required parameter: " .. name
        end
        
        -- Skip validation for nil optional parameters
        if value == nil then
            goto continue
        end
        
        -- Check type
        if requirements.type and type(value) ~= requirements.type then
            return false, "Parameter " .. name .. " should be " .. requirements.type .. ", got " .. type(value)
        end
        
        -- Check range for numbers
        if requirements.min and value < requirements.min then
            return false, "Parameter " .. name .. " should be >= " .. requirements.min
        end
        if requirements.max and value > requirements.max then
            return false, "Parameter " .. name .. " should be <= " .. requirements.max
        end
        
        ::continue::
    end
    
    return true
end

-- Usage
function SpawnItems(params)
    local valid, error_msg = ValidateParameters(params, {
        prefab = {required = true, type = "string"},
        count = {required = true, type = "number", min = 1, max = 100},
        position = {required = false, type = "table"}
    })
    
    if not valid then
        print("Error in SpawnItems: " .. error_msg)
        return false
    end
    
    -- Function implementation
end
```

#### Create a Bug Testing Checklist

Develop a checklist for testing new features:

```
BUG TESTING CHECKLIST:

1. BASIC FUNCTIONALITY
   [ ] Feature works as expected in single player
   [ ] Feature works as expected in multiplayer (host)
   [ ] Feature works as expected in multiplayer (client)
   
2. EDGE CASES
   [ ] Tested with minimum values
   [ ] Tested with maximum values
   [ ] Tested with invalid inputs
   [ ] Tested with empty/nil values
   
3. PERFORMANCE
   [ ] No noticeable lag when using feature
   [ ] No memory leaks over extended use
   
4. COMPATIBILITY
   [ ] Works with all character mods
   [ ] Works with popular gameplay mods
   [ ] Works in all seasons/conditions
   
5. ROBUSTNESS
   [ ] Handles interruptions gracefully
   [ ] Recovers properly after game save/load
   [ ] Functions correctly after player death/respawn
   
6. USER EXPERIENCE
   [ ] Clear feedback when feature is used
   [ ] No visual glitches or artifacts
   [ ] Intuitive controls and interactions
```

### 8. Continuous Improvement

#### Implement Monitoring

For complex mods, add monitoring to catch issues early:

```lua
-- Add performance monitoring
function MonitorPerformance(name, fn)
    return function(...)
        local start_time = os.clock()
        local results = {fn(...)}
        local end_time = os.clock()
        local duration = end_time - start_time
        
        -- Track performance data
        MYMOD.performance = MYMOD.performance or {}
        MYMOD.performance[name] = MYMOD.performance[name] or {count = 0, total_time = 0, max_time = 0}
        MYMOD.performance[name].count = MYMOD.performance[name].count + 1
        MYMOD.performance[name].total_time = MYMOD.performance[name].total_time + duration
        MYMOD.performance[name].max_time = math.max(MYMOD.performance[name].max_time, duration)
        
        -- Alert on slow operations
        if duration > 0.05 then -- 50ms threshold
            print("Performance warning: " .. name .. " took " .. math.floor(duration * 1000) .. "ms")
        end
        
        return unpack(results)
    end
end

-- Usage
MyMod.ExpensiveFunction = MonitorPerformance("ExpensiveFunction", function(...)
    -- Original function body
end)

-- Print performance report
function PrintPerformanceReport()
    print("=== Performance Report ===")
    for name, data in pairs(MYMOD.performance) do
        local avg_time = data.total_time / data.count
        print(string.format("%s: %d calls, avg %.2fms, max %.2fms", 
            name, data.count, avg_time * 1000, data.max_time * 1000))
    end
end
```

#### Establish a Bug Triage Process

For ongoing mod maintenance, establish a bug triage process:

1. **Categorize bugs**: Sort by severity (critical, major, minor, cosmetic)
2. **Prioritize fixes**: Address critical bugs first
3. **Track progress**: Maintain a list of known issues and their status
4. **Communicate with users**: Keep users informed about known issues and fixes

By following this comprehensive bug testing workflow, you can efficiently identify, fix, and prevent bugs in your DST mods, resulting in a more stable and enjoyable experience for your users.

## Common Pitfalls and How to Avoid Them

### Server vs. Client Context

Remember that DST has separate server and client contexts:
- Most components only exist on the server
- Visual effects should be handled on the client
- Use `TheNet:GetIsServer()` and `TheNet:GetIsClient()` to check context

### Memory Leaks

Common causes of memory leaks:
- Not removing event listeners when entities are removed
- Creating tasks without storing references to cancel them
- Accumulating data in tables without clearing old entries

### Performance Issues

Common performance problems:
- Expensive operations in Update functions
- Creating many entities or effects
- Inefficient loops or table operations
- Too many network updates

### Save Data Corruption

To avoid save data issues:
- Properly implement OnSave and OnLoad functions
- Only save necessary data
- Handle missing or corrupt data gracefully
- Test save/load cycles thoroughly

## Getting Help

If you're still stuck after trying the solutions in this guide:

1. **Klei Forums**: Post in the [Mods and Tools section](https://forums.kleientertainment.com/forums/forum/79-dont-starve-together-mods-and-tools/)
2. **Discord**: Join the [Klei Discord](https://discord.gg/klei) and ask in the modding channels
3. **Steam Workshop**: Look for similar mods and study their code
4. **GitHub**: Many modders share their code on GitHub, which can be a valuable learning resource

When asking for help, always include:
- A clear description of the problem
- Relevant error messages
- The minimal code needed to reproduce the issue
- What you've already tried to fix it 
- What you've already tried to fix it 