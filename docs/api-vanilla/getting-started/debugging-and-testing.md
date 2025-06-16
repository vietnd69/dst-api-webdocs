---
id: debugging-and-testing
title: Debugging and Testing
sidebar_position: 4
last_updated: 2023-07-06
slug: /api/debugging-and-testing
---
*Last Update: 2023-07-06*
# Debugging and Testing Mods

Developing mods for Don't Starve Together often involves troubleshooting issues and ensuring your mod works correctly. This guide covers the tools and techniques available for debugging and testing your mods.

## Debugging Techniques

### Console Logging

The most basic debugging technique is using `print()` statements to output information to the console:

```lua
-- Basic print statement
print("Player health:", player.components.health.currenthealth)

-- Format a table for better readability
print("Inventory:", dumptable(player.components.inventory.itemslots))
```

To view these logs:
1. Enable the console by pressing the tilde key (`~`)
2. Look for your print statements in the console output
3. Use `CTRL+L` to clear the console if it gets too cluttered

### Debug Commands

Don't Starve Together includes several built-in debug commands that can be entered in the console:

```
c_give("prefab_name")        -- Spawn an item
c_spawn("prefab_name")       -- Spawn an entity
c_godmode()                  -- Toggle god mode
c_select()                   -- Select an entity under the cursor
c_reveal()                   -- Reveal the map
c_supergodmode()             -- Enable super god mode (unlimited resources)
c_freecrafting()             -- Enable free crafting
```

### Debug Rendering

You can enable various debug visualizations:

```lua
-- Enable debug rendering
TheSim:SetDebugRenderEnabled(true)

-- Show physics collision shapes
TheSim:SetDebugPhysicsRender(true)

-- Custom debug drawing
TheWorld.debugrender = true

-- In your entity's OnUpdate function:
if TheWorld.debugrender then
    local x, y, z = self.inst.Transform:GetWorldPosition()
    TheWorld.DebugRender:Line(x, y, z, x, y + 2, z, 255, 0, 0, 255)
    TheWorld.DebugRender:String(x, y + 2, z, "Debug Text", 255, 255, 255, 255)
end
```

### Mod Configuration

Create a configuration variable in your modmain.lua to enable/disable debug features:

```lua
-- In modmain.lua
GLOBAL.DEBUG_ENABLED = GetModConfigData("debug_mode") or false

-- Later in your code
if GLOBAL.DEBUG_ENABLED then
    print("Debug info:", some_variable)
end
```

## Debugging Common Issues

### Network Synchronization Issues

When dealing with multiplayer synchronization problems:

```lua
-- Check if code is running on server or client
if TheNet:GetIsServer() then
    print("Running on server")
else
    print("Running on client")
end

-- Debug network variables
local net_var = net_float("mymod.myvar", "myvar_dirty")
net_var:set_local(5)
print("Local value:", net_var:value())
print("Is dirty:", net_var:is_dirty())
```

### Component Debugging

Add a `GetDebugString()` method to your components for better diagnostics:

```lua
function MyComponent:GetDebugString()
    return string.format("Value: %d, State: %s", 
        self.value, 
        self.active and "active" or "inactive")
end

-- View the debug string in-game with c_select() and looking at the console
```

### State Graph Debugging

For debugging state graphs:

```lua
-- Print current state
print("Current state:", self.inst.sg:HasStateTag("idle") and "idle" or "not idle")

-- Log state transitions
local old_gotostate = self.inst.sg.GoToState
self.inst.sg.GoToState = function(sg, statename, ...)
    print("State transition:", sg.currentstate.name, "->", statename)
    return old_gotostate(sg, statename, ...)
end
```

## Testing Strategies

### Local Testing

Before sharing your mod, test it thoroughly in various scenarios:

1. **Solo Testing**: Test in a single-player game first
2. **Host Testing**: Host a server and test with multiple clients
3. **Dedicated Server Testing**: Test on a dedicated server if possible

### Test Cases

Create a checklist of test cases covering:

- Mod initialization and loading
- All features and functionality
- Interaction with other game systems
- Edge cases and error conditions
- Performance under various conditions

Example test script:

```lua
local function RunTests()
    if not GLOBAL.DEBUG_ENABLED then return end
    
    print("=== RUNNING MOD TESTS ===")
    
    -- Test item creation
    local item = SpawnPrefab("my_custom_item")
    assert(item, "Failed to spawn custom item")
    
    -- Test component functionality
    assert(item.components.mycomponent, "Missing component")
    assert(item.components.mycomponent:TestFunction() == expected_result, 
           "Component function returned unexpected result")
           
    print("All tests passed!")
end

-- Run tests when the world is ready
AddPrefabPostInit("world", function(world)
    world:DoTaskInTime(1, RunTests)
end)
```

### Automated Testing

For complex mods, consider creating an automated test system:

```lua
local tests = {}

function AddTest(name, fn)
    table.insert(tests, {name = name, fn = fn})
end

function RunAllTests()
    local passed = 0
    local failed = 0
    
    for _, test in ipairs(tests) do
        print("Running test:", test.name)
        local success, error_msg = pcall(test.fn)
        
        if success then
            print("  PASSED")
            passed = passed + 1
        else
            print("  FAILED:", error_msg)
            failed = failed + 1
        end
    end
    
    print(string.format("Test results: %d passed, %d failed", passed, failed))
end

-- Define tests
AddTest("Item Creation", function()
    local item = SpawnPrefab("my_custom_item")
    assert(item, "Failed to spawn item")
end)

-- Run tests with console command
GLOBAL.c_runtests = RunAllTests
```

## Common Errors and Solutions

### Script Errors

| Error | Possible Cause | Solution |
|-------|----------------|----------|
| `attempt to index a nil value` | Trying to access a property of a nil object | Check if the object exists before accessing properties |
| `attempt to call a nil value` | Calling a function that doesn't exist | Verify function names and that required modules are loaded |
| `bad argument #1 to function` | Passing incorrect parameter type | Check parameter types and documentation |
| `stack overflow` | Infinite recursion | Look for circular function calls |

### Mod Loading Errors

| Error | Possible Cause | Solution |
|-------|----------------|----------|
| Mod doesn't appear in list | Incorrect folder structure | Verify modinfo.lua and folder naming |
| Mod crashes on load | Error in modmain.lua | Check console for error messages |
| Assets not loading | Incorrect path or format | Verify asset paths and formats |

### Multiplayer Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Desync | Inconsistent state between server/client | Use proper network variables and RPC calls |
| Lag | Inefficient code or too many entities | Optimize performance-critical code |
| Client-only effects | Not using proper network code | Separate client and server logic appropriately |

## Debug Tools and Mods

Several mods can help with debugging:

1. **Debug Menu**: Provides in-game access to many debug commands
2. **Craft Pot**: Allows spawning any item for testing
3. **World Control**: Manipulate time, weather, and other world settings
4. **Gesture Wheel Debugger**: Shows information about controller gestures

## Best Practices

1. **Isolate Issues**: Test one feature at a time
2. **Version Control**: Use Git to track changes and revert if needed
3. **Incremental Testing**: Test frequently as you develop
4. **Error Handling**: Add pcall() around risky code to prevent crashes
5. **Logging Strategy**: Use structured logging with severity levels
6. **Clean Up Debug Code**: Remove or disable debug code before releasing

## Advanced Debugging

### Memory Profiling

For complex mods with potential memory issues:

```lua
local function CountInstances()
    local counts = {}
    for k, v in pairs(Ents) do
        local prefab = v.prefab
        counts[prefab] = (counts[prefab] or 0) + 1
    end
    
    for prefab, count in pairs(counts) do
        if count > 10 then
            print(prefab, count)
        end
    end
end

-- Call periodically to check for entity leaks
TheWorld:DoPeriodicTask(60, CountInstances)
```

### Performance Monitoring

```lua
local function MeasureTime(fn, ...)
    local start_time = os.clock()
    local result = fn(...)
    local end_time = os.clock()
    print("Function took", (end_time - start_time) * 1000, "ms")
    return result
end

-- Usage
MeasureTime(MyExpensiveFunction, arg1, arg2)
```

## Conclusion

Effective debugging and testing are essential skills for mod development. By using these techniques and tools, you can identify and fix issues more quickly, resulting in more stable and enjoyable mods for players.

Remember that the most valuable debugging tool is a systematic approach: understand the problem, isolate the cause, fix the issue, and verify the solution works in all scenarios. 
