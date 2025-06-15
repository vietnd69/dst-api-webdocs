---
id: testing-environment
title: Setting Up a Testing Environment
sidebar_position: 5
last_updated: 2023-07-06
slug: /api/testing-environment
---

# Setting Up a Testing Environment

A proper testing environment is crucial for developing reliable Don't Starve Together mods. This guide will help you set up different testing environments to ensure your mods work correctly in various scenarios.

## Basic Testing Environment Setup

### Local Development Environment

Setting up a local development environment allows you to quickly test changes without needing to restart the game:

1. **Enable Mod Development Mode**:

```lua
-- In your modinfo.lua
configuration_options = {
    {
        name = "dev_mode",
        label = "Development Mode",
        options = {
            {description = "Off", data = false},
            {description = "On", data = true}
        },
        default = false
    }
}
```

2. **Create a Development Configuration**:

```lua
-- In your modmain.lua
local DEV_MODE = GetModConfigData("dev_mode")

if DEV_MODE then
    -- Enable console by default
    GLOBAL.TheSim:SetSetting("misc", "console_enabled", true)
    
    -- Add developer shortcuts
    GLOBAL.TheInput:AddKeyDownHandler(GLOBAL.KEY_F5, function()
        print("Reloading mod scripts...")
        -- Your reload logic here
    end)
    
    -- Add debug visualization
    GLOBAL.TheInput:AddKeyDownHandler(GLOBAL.KEY_F6, function()
        GLOBAL.DEBUGMODE = not GLOBAL.DEBUGMODE
        print("Debug visualization:", GLOBAL.DEBUGMODE and "ON" or "OFF")
    end)
end
```

### Setting Up Different Game Instances

To test your mod in different scenarios, you'll need to set up multiple game instances:

#### Solo Testing Instance

1. Create a dedicated world slot for testing:
   - Launch DST
   - Create a new world with these settings:
     - World: Standard
     - Seasons: Normal
     - Day Length: Normal
     - Resources: Plenty
     - World Generation: Default
   - Name it "Mod Testing"

2. Configure your mod for solo testing:
   - Enable your mod
   - Set mod options for testing
   - Disable other mods that might interfere

#### Local Multiplayer Testing Instance

1. Create a dedicated server for testing:
   - Launch DST
   - Host Game
   - Select "Mod Testing" world or create a new one
   - Set visibility to "Friends Only" or "Local Network Only"
   - Enable your mod

2. Connect with a second client:
   - Launch a second instance of DST (on the same machine or another computer)
   - Join the hosted game
   - This setup tests client-server interactions

#### Dedicated Server Testing Instance

For more realistic multiplayer testing:

1. Set up a dedicated server:
   ```bash
   # On Windows
   dontstarve_dedicated_server_nullrenderer.exe -console -cluster MyCluster -shard Master
   
   # On Linux
   ./dontstarve_dedicated_server_nullrenderer -console -cluster MyCluster -shard Master
   ```

2. Configure server settings:
   - Edit `cluster.ini` in your cluster folder
   - Set up mod configuration in `modoverrides.lua`

3. Connect multiple clients to test more complex scenarios

## Creating Test Worlds

### Controlled Test World

Create a world with specific settings for testing:

```lua
-- In your modmain.lua, add a console command to set up a test world
local function SetupTestWorld(player)
    -- Clear area around player
    local x, y, z = player.Transform:GetWorldPosition()
    local ents = GLOBAL.TheSim:FindEntities(x, y, z, 20)
    for _, ent in ipairs(ents) do
        if ent ~= player and ent.prefab ~= "global" then
            ent:Remove()
        end
    end
    
    -- Set up controlled conditions
    GLOBAL.TheWorld.state.isday = true
    GLOBAL.TheWorld.state.cycles = 1
    GLOBAL.TheWorld.state.temperature = 20
    
    -- Create test structures
    GLOBAL.SpawnPrefab("firepit").Transform:SetPosition(x + 5, 0, z)
    GLOBAL.SpawnPrefab("researchlab").Transform:SetPosition(x - 5, 0, z)
    
    -- Give player testing resources
    player.components.inventory:GiveItem(GLOBAL.SpawnPrefab("axe"))
    player.components.inventory:GiveItem(GLOBAL.SpawnPrefab("pickaxe"))
    
    -- Set player stats
    player.components.health:SetPercent(1)
    player.components.sanity:SetPercent(1)
    player.components.hunger:SetPercent(1)
    
    print("Test world setup complete!")
end

-- Register console command
if DEV_MODE then
    GLOBAL.c_setuptest = function()
        SetupTestWorld(GLOBAL.ThePlayer)
    end
end
```

### Test Cases World

Create a world with specific test cases for your mod:

```lua
function SetupTestCases(player)
    local x, y, z = player.Transform:GetWorldPosition()
    local spacing = 10
    local test_cases = {
        {
            name = "Basic Functionality",
            setup = function(pos_x, pos_z)
                -- Set up test case 1
                local sign = GLOBAL.SpawnPrefab("sign")
                sign.Transform:SetPosition(pos_x, 0, pos_z)
                sign.components.writeable:SetText("Test Case 1: Basic Functionality")
                
                -- Add specific test elements
                local item = GLOBAL.SpawnPrefab("your_mod_item")
                item.Transform:SetPosition(pos_x, 0, pos_z + 1)
            end
        },
        {
            name = "Edge Case Testing",
            setup = function(pos_x, pos_z)
                -- Set up test case 2
                local sign = GLOBAL.SpawnPrefab("sign")
                sign.Transform:SetPosition(pos_x, 0, pos_z)
                sign.components.writeable:SetText("Test Case 2: Edge Case Testing")
                
                -- Add specific test elements
                -- ...
            end
        },
        -- Add more test cases as needed
    }
    
    -- Create all test cases
    for i, test_case in ipairs(test_cases) do
        local pos_x = x + (i-1) * spacing
        test_case.setup(pos_x, z + spacing)
        print("Created test case: " .. test_case.name)
    end
end

-- Register console command
if DEV_MODE then
    GLOBAL.c_setuptestcases = function()
        SetupTestCases(GLOBAL.ThePlayer)
    end
end
```

## Testing Multiplayer Features

When developing mods with multiplayer functionality, thorough testing is essential to ensure a smooth experience for all players. Here's a systematic approach to testing multiplayer features:

### Setting Up a Multiplayer Test Environment

1. **Local Two-Client Testing**:
   - Run two instances of DST on the same machine
   - Host a server with the first instance
   - Join the server with the second instance
   - This setup is ideal for quick iteration and basic multiplayer testing

2. **Dedicated Server with Multiple Clients**:
   - Set up a dedicated server as described in the "Dedicated Server Testing Instance" section
   - Connect multiple clients from different machines
   - This provides a more realistic testing environment

3. **Cross-Platform Testing**:
   - If possible, test with clients on different operating systems
   - This helps identify platform-specific issues early

### Testing Network Synchronization

1. **State Synchronization Tests**:
   ```lua
   -- Test that entity state is properly synchronized
   function TestEntitySync()
       -- On the host, create and modify an entity
       local entity = SpawnPrefab("your_mod_entity")
       entity.components.your_component:SetValue(42)
       
       -- Wait for network transmission (in a real test, use proper waiting mechanism)
       TheWorld:DoTaskInTime(1, function()
           -- On the client, verify the entity exists with correct state
           local entities = TheSim:FindEntities(entity:GetPosition().x, 0, entity:GetPosition().z, 1)
           for _, e in ipairs(entities) do
               if e.prefab == "your_mod_entity" and e.replica.your_component:GetValue() == 42 then
                   print("Entity sync test passed!")
                   return
               end
           end
           print("Entity sync test failed!")
       end)
   end
   ```

2. **RPC Testing**:
   ```lua
   -- Test Remote Procedure Calls between server and clients
   -- Server-side code
   AddModRPCHandler("YourMod", "TestRPC", function(player, value)
       print("RPC received from client with value: " .. tostring(value))
       -- Send response back to client
       SendModRPCToClient(GetClientModRPC("YourMod", "TestRPCResponse"), player.userid, value * 2)
   end)
   
   -- Client-side code
   AddModRPCHandler("YourMod", "TestRPCResponse", function(doubled_value)
       print("RPC response received from server: " .. tostring(doubled_value))
       if doubled_value == 84 then -- Assuming original value was 42
           print("RPC test passed!")
       else
           print("RPC test failed!")
       end
   end)
   
   -- Initiate the test from client
   SendModRPCToServer(GetServerModRPC("YourMod", "TestRPC"), 42)
   ```

### Testing Multiplayer-Specific Scenarios

1. **Player Join/Leave Testing**:
   - Test mod behavior when players join mid-game
   - Test mod behavior when players leave unexpectedly
   - Verify that late-joining players receive the correct game state

2. **Authority Testing**:
   - Test server authority for critical game mechanics
   - Verify that clients can't perform unauthorized actions
   - Check that privileged commands work only for appropriate users

3. **Latency Simulation**:
   ```lua
   -- Add artificial latency for testing network resilience
   -- In modmain.lua
   if GetModConfigData("simulate_latency") then
       local old_send = SendModRPCToServer
       GLOBAL.SendModRPCToServer = function(...)
           local args = {...}
           GLOBAL.TheWorld:DoTaskInTime(0.2, function() -- 200ms artificial delay
               old_send(unpack(args))
           end)
       end
   end
   ```

4. **Desync Detection**:
   ```lua
   -- Add a periodic check to detect desync between server and clients
   local function CheckSync(reference_value, entity_id)
       if TheWorld.ismastersim then
           -- Server stores reference value
           TheWorld.net.components.your_sync_component:SetValue(reference_value)
           TheWorld.net.components.your_sync_component:SetEntity(entity_id)
       else
           -- Client compares local value with server value
           local server_value = TheWorld.net.components.your_sync_component:GetValue()
           local server_entity = TheWorld.net.components.your_sync_component:GetEntity()
           local local_entity = Ents[server_entity]
           
           if local_entity and local_entity.components.your_component:GetValue() ~= server_value then
               print("DESYNC DETECTED: Server has " .. server_value .. 
                     " but client has " .. local_entity.components.your_component:GetValue())
           end
       end
   end
   ```

### Multiplayer Testing Checklist

1. **Basic Connectivity**:
   - [ ] Clients can connect to server with mod enabled
   - [ ] All clients load the mod correctly
   - [ ] Mod version compatibility is checked

2. **Data Synchronization**:
   - [ ] Entity states sync properly between server and clients
   - [ ] Custom components replicate correctly
   - [ ] Networked variables update on all clients

3. **User Interaction**:
   - [ ] Actions performed by one player are visible to others
   - [ ] UI elements update correctly for all players
   - [ ] Player-specific features remain isolated appropriately

4. **Edge Cases**:
   - [ ] Test with maximum supported players
   - [ ] Test with players joining mid-game
   - [ ] Test with players disconnecting unexpectedly
   - [ ] Test with intermittent network connectivity

5. **Performance**:
   - [ ] Measure bandwidth usage
   - [ ] Check for performance degradation with multiple players
   - [ ] Monitor server CPU and memory usage

By thoroughly testing these aspects of your multiplayer mod, you can ensure a smooth and consistent experience for all players in a multiplayer setting.

## Automated Testing Framework

For complex mods, setting up an automated testing framework can help catch bugs early and ensure your mod remains stable across updates. Here's how to implement a comprehensive testing system:

```lua
-- In a separate file like modtest.lua
local ModTest = {}
ModTest.tests = {}
ModTest.results = {passed = 0, failed = 0}

-- Add a test
function ModTest.AddTest(name, test_fn)
    table.insert(ModTest.tests, {name = name, fn = test_fn})
end

-- Run all tests
function ModTest.RunAll()
    print("=== RUNNING MOD TESTS ===")
    ModTest.results.passed = 0
    ModTest.results.failed = 0
    
    for i, test in ipairs(ModTest.tests) do
        print(string.format("Test %d/%d: %s", i, #ModTest.tests, test.name))
        
        local success, error_msg = pcall(test.fn)
        
        if success then
            print("  ✓ PASSED")
            ModTest.results.passed = ModTest.results.passed + 1
        else
            print("  ✗ FAILED: " .. tostring(error_msg))
            ModTest.results.failed = ModTest.results.failed + 1
        end
    end
    
    print("=== TEST RESULTS ===")
    print(string.format("Passed: %d", ModTest.results.passed))
    print(string.format("Failed: %d", ModTest.results.failed))
    print(string.format("Total: %d", #ModTest.tests))
end

-- Assert functions
function ModTest.AssertEqual(actual, expected, message)
    if actual ~= expected then
        error(string.format("%s - Expected: %s, Got: %s", 
            message or "Values not equal", 
            tostring(expected), 
            tostring(actual)))
    end
end

function ModTest.AssertTrue(value, message)
    if value ~= true then
        error(message or "Expected true, got " .. tostring(value))
    end
end

function ModTest.AssertFalse(value, message)
    if value ~= false then
        error(message or "Expected false, got " .. tostring(value))
    end
end

return ModTest
```

### Creating Structured Test Suites

Organize your tests into logical suites based on functionality:

```lua
-- In your mod's test file (e.g., test_suite.lua)
local ModTest = require("modtest")

-- Component tests
local function RunComponentTests()
    -- Test component initialization
    ModTest.AddTest("Component Initialization", function()
        local entity = GLOBAL.CreateEntity()
        entity:AddComponent("your_component")
        
        local component = entity.components.your_component
        ModTest.AssertTrue(component ~= nil, "Component should exist")
        ModTest.AssertEqual(component.default_value, 10, "Default value should be 10")
    end)
    
    -- Test component methods
    ModTest.AddTest("Component Method", function()
        local entity = GLOBAL.CreateEntity()
        entity:AddComponent("your_component")
        
        local component = entity.components.your_component
        local result = component:YourMethod(5)
        ModTest.AssertEqual(result, 15, "Method should add to default value")
    end)
end

-- Item tests
local function RunItemTests()
    ModTest.AddTest("Item Creation", function()
        local item = GLOBAL.SpawnPrefab("your_mod_item")
        ModTest.AssertTrue(item ~= nil, "Item should spawn")
        ModTest.AssertTrue(item.components.inventoryitem ~= nil, "Item should have inventory component")
    end)
    
    ModTest.AddTest("Item Properties", function()
        local item = GLOBAL.SpawnPrefab("your_mod_item")
        ModTest.AssertEqual(item.components.stackable.maxsize, 20, "Stack size should be 20")
    end)
end

-- Run all test suites
local function RunAllTests()
    RunComponentTests()
    RunItemTests()
    ModTest.RunAll()
end

-- Register console command to run tests
GLOBAL.c_runtests = RunAllTests
```

### Testing Specific Mod Aspects

#### Testing Prefabs

```lua
ModTest.AddTest("Prefab Registration", function()
    -- Test that your prefab is properly registered
    local prefab = GLOBAL.SpawnPrefab("your_mod_prefab")
    ModTest.AssertTrue(prefab ~= nil, "Prefab should be registered")
    
    -- Test prefab components
    ModTest.AssertTrue(prefab.components.health ~= nil, "Prefab should have health component")
    ModTest.AssertEqual(prefab.components.health.maxhealth, 150, "Max health should be 150")
    
    -- Test prefab tags
    ModTest.AssertTrue(prefab:HasTag("your_tag"), "Prefab should have the correct tag")
end)
```

#### Testing Recipes

```lua
ModTest.AddTest("Recipe Registration", function()
    -- Test that your recipe exists
    local recipe = GLOBAL.GetValidRecipe("your_mod_recipe")
    ModTest.AssertTrue(recipe ~= nil, "Recipe should exist")
    
    -- Test recipe ingredients
    local has_correct_ingredients = false
    for _, ingredient in ipairs(recipe.ingredients) do
        if ingredient.type == "log" and ingredient.amount == 2 then
            has_correct_ingredients = true
            break
        end
    end
    ModTest.AssertTrue(has_correct_ingredients, "Recipe should require 2 logs")
    
    -- Test tech level
    ModTest.AssertEqual(recipe.level.SCIENCE, 1, "Recipe should require Science level 1")
end)
```

#### Testing Event Handlers

```lua
ModTest.AddTest("Event Handling", function()
    local entity = GLOBAL.CreateEntity()
    entity:AddComponent("your_component")
    
    -- Set up a flag to check if event was handled
    local event_handled = false
    entity.components.your_component.on_event = function()
        event_handled = true
    end
    
    -- Trigger the event
    entity:PushEvent("testevent")
    
    -- Check if handler was called
    ModTest.AssertTrue(event_handled, "Event handler should be called")
end)
```

### Integration Testing

Test how your mod components work together:

```lua
ModTest.AddTest("Component Integration", function()
    -- Create test entities
    local player = GLOBAL.CreateEntity()
    player:AddComponent("inventory")
    player:AddComponent("health")
    
    local item = GLOBAL.SpawnPrefab("your_healing_item")
    
    -- Test interaction between components
    player.components.inventory:GiveItem(item)
    player.components.health:SetPercent(0.5) -- Set to 50% health
    
    -- Simulate using the item
    if player.components.inventory:Has("your_healing_item", 1) then
        local healing_item = player.components.inventory:FindItem(function(item)
            return item.prefab == "your_healing_item"
        end)
        
        if healing_item.components.healer then
            healing_item.components.healer:Heal(player)
        end
    end
    
    -- Verify the result
    local expected_health = 0.5 + 0.2 -- Assuming item heals 20%
    local actual_health = player.components.health:GetPercent()
    
    ModTest.AssertEqual(math.floor(actual_health * 100), math.floor(expected_health * 100), 
        "Health should increase by healing amount")
end)
```

### Automated Test Execution

Set up your mod to run tests automatically during development:

```lua
-- In your modmain.lua
local DEV_MODE = GetModConfigData("dev_mode")

if DEV_MODE then
    -- Other dev mode setup...
    
    -- Auto-run tests on mod load if enabled
    local AUTO_TEST = GetModConfigData("auto_test")
    if AUTO_TEST then
        AddSimPostInit(function()
            -- Wait a bit for the world to initialize
            GLOBAL.TheWorld:DoTaskInTime(1, function()
                print("Auto-running mod tests...")
                if GLOBAL.c_runtests then
                    GLOBAL.c_runtests()
                end
            end)
        end)
    end
end
```

Add the corresponding config option:

```lua
-- In your modinfo.lua
configuration_options = {
    {
        name = "dev_mode",
        label = "Development Mode",
        options = {
            {description = "Off", data = false},
            {description = "On", data = true}
        },
        default = false
    },
    {
        name = "auto_test",
        label = "Auto-Run Tests",
        options = {
            {description = "Off", data = false},
            {description = "On", data = true}
        },
        default = false
    }
}
```

### Best Practices for Automated Testing

1. **Isolate Tests**: Each test should be independent and not rely on the state from other tests
2. **Mock External Systems**: When testing components that interact with complex game systems, create simplified mock versions
3. **Test Edge Cases**: Include tests for boundary conditions and unusual inputs
4. **Keep Tests Fast**: Tests should run quickly to encourage frequent testing during development
5. **Descriptive Test Names**: Use clear names that describe what's being tested
6. **Test Failures First**: Write tests that initially fail, then implement the feature until they pass
7. **Regular Testing**: Run tests after every significant change to catch regressions early

By implementing a comprehensive automated testing framework, you can catch bugs early, ensure your mod remains stable across game updates, and make it easier to add new features without breaking existing functionality.

## Testing Different Game Scenarios

### Seasonal Testing

Test your mod across different seasons:

```lua
-- Console commands for quick season testing
GLOBAL.c_season = function(season, percent)
    season = season or "autumn"
    percent = percent or 0.5
    
    GLOBAL.TheWorld:PushEvent("ms_setseason", season)
    GLOBAL.TheWorld:PushEvent("ms_setseasonlength", {
        autumn = 20,
        winter = 20,
        spring = 20,
        summer = 20
    })
    GLOBAL.TheWorld:PushEvent("ms_setseasonclocksegs", {
        autumn = 16,
        winter = 16,
        spring = 16,
        summer = 16
    })
    GLOBAL.TheWorld.components.seasonmanager:SetSeasonPercent(percent)
    
    print("Set season to " .. season .. " at " .. percent*100 .. "%")
end
```

### Weather Testing

Test your mod in different weather conditions:

```lua
-- Console commands for weather testing
GLOBAL.c_rain = function(percent)
    percent = percent or 1
    GLOBAL.TheWorld.components.weathermanager:ForceStormLevel(percent)
    print("Set rain level to " .. percent*100 .. "%")
end

GLOBAL.c_lightning = function()
    GLOBAL.TheWorld.components.weathermanager:OnLightningStrike(GLOBAL.ThePlayer:GetPosition())
    print("Lightning strike at player position")
end
```

### Time of Day Testing

Test your mod during different times of day:

```lua
-- Console commands for time testing
GLOBAL.c_time = function(phase)
    if phase == "day" then
        GLOBAL.TheWorld:PushEvent("ms_setclocksegs", {day=16, dusk=0, night=0})
        GLOBAL.TheWorld.components.clockmanager:SetClock(0.5, 0, 0)
    elseif phase == "dusk" then
        GLOBAL.TheWorld:PushEvent("ms_setclocksegs", {day=0, dusk=16, night=0})
        GLOBAL.TheWorld.components.clockmanager:SetClock(0, 0.5, 0)
    elseif phase == "night" then
        GLOBAL.TheWorld:PushEvent("ms_setclocksegs", {day=0, dusk=0, night=16})
        GLOBAL.TheWorld.components.clockmanager:SetClock(0, 0, 0.5)
    end
    
    print("Set time to " .. phase)
end
```

## Testing with Different Characters

Test your mod with different characters to ensure it works with all character-specific mechanics:

```lua
-- Console command to change character
GLOBAL.c_character = function(character)
    if not GLOBAL.ThePlayer then
        print("No player found")
        return
    end
    
    -- Save position and inventory
    local x, y, z = GLOBAL.ThePlayer.Transform:GetWorldPosition()
    local inventory = {}
    local current_player = GLOBAL.ThePlayer
    
    -- Gather inventory items
    if current_player.components.inventory then
        for k, v in pairs(current_player.components.inventory.itemslots) do
            if v.prefab then
                table.insert(inventory, v.prefab)
            end
        end
    end
    
    -- Remove the current player
    current_player:Remove()
    
    -- Spawn new character
    local new_player = GLOBAL.SpawnPrefab(character)
    new_player.Transform:SetPosition(x, y, z)
    
    -- Restore inventory
    for _, item in ipairs(inventory) do
        new_player.components.inventory:GiveItem(GLOBAL.SpawnPrefab(item))
    end
    
    -- Set as new player
    GLOBAL.SetWorldPlayerIndex(0)
    GLOBAL.TheWorld.components.playerspawner:SetPlayerCharacter(0, character)
    GLOBAL.ThePlayer = new_player
    
    print("Changed character to " .. character)
end
```

## Performance Testing

Set up performance testing to ensure your mod doesn't cause lag:

```lua
-- Performance monitoring function
function MeasurePerformance(fn, iterations)
    iterations = iterations or 1000
    
    local start_time = GLOBAL.GetTimeReal()
    local memory_before = collectgarbage("count")
    
    for i = 1, iterations do
        fn(i)
    end
    
    local end_time = GLOBAL.GetTimeReal()
    local memory_after = collectgarbage("count")
    
    local time_taken = end_time - start_time
    local memory_used = memory_after - memory_before
    
    print("=== PERFORMANCE RESULTS ===")
    print(string.format("Time taken: %.4f seconds", time_taken))
    print(string.format("Average per iteration: %.6f seconds", time_taken / iterations))
    print(string.format("Memory change: %.2f KB", memory_used))
    
    return time_taken, memory_used
end

-- Example usage:
-- MeasurePerformance(function(i)
--     local item = GLOBAL.SpawnPrefab("my_mod_item")
--     item:Remove()
-- end, 100)
```

## Pre-Release Verification Checklist

Before releasing your mod to the public, it's crucial to perform a comprehensive verification process. This checklist will help ensure your mod is stable, user-friendly, and ready for distribution.

### Functionality Verification

- [ ] **Core Features**: Verify all advertised features work as intended
- [ ] **Edge Cases**: Test uncommon scenarios and edge cases
- [ ] **Error Handling**: Ensure the mod gracefully handles errors without crashing
- [ ] **Performance**: Check that the mod doesn't cause significant performance issues
- [ ] **Compatibility**: Test compatibility with other popular mods
- [ ] **Vanilla Compatibility**: Ensure the mod doesn't break vanilla game mechanics

### Technical Verification

- [ ] **Code Quality**:
  - [ ] Remove debug print statements and commented-out code
  - [ ] Ensure proper error handling throughout the codebase
  - [ ] Check for memory leaks (especially with event listeners)
  - [ ] Verify network code is optimized and secure

- [ ] **Mod Structure**:
  - [ ] Confirm all required files are included
  - [ ] Verify file paths are correct for all platforms
  - [ ] Check that assets are properly referenced
  - [ ] Ensure modinfo.lua is complete and accurate

- [ ] **Configuration**:
  - [ ] Verify all mod options work correctly
  - [ ] Test default settings are appropriate
  - [ ] Ensure configuration changes apply properly
  - [ ] Check that configuration persists between game sessions

### User Experience

- [ ] **Documentation**:
  - [ ] Include clear installation instructions
  - [ ] Document all features and configuration options
  - [ ] Provide troubleshooting information
  - [ ] Add version history and planned features

- [ ] **User Interface**:
  - [ ] Verify UI elements are properly positioned and scaled
  - [ ] Test UI with different resolutions
  - [ ] Ensure controller support if applicable
  - [ ] Check accessibility (text readability, color contrast)

- [ ] **Localization**:
  - [ ] Verify all user-facing text is properly localized
  - [ ] Check for hardcoded strings that should be localized
  - [ ] Test with different language settings if supporting multiple languages

### Platform-Specific Checks

- [ ] **Windows**:
  - [ ] Test on different Windows versions
  - [ ] Verify file paths use correct separators

- [ ] **Mac**:
  - [ ] Test on macOS if possible
  - [ ] Check for case-sensitivity issues in file references

- [ ] **Linux**:
  - [ ] Test on Linux if possible
  - [ ] Verify file permissions are set correctly

### Distribution Preparation

- [ ] **Metadata**:
  - [ ] Create compelling mod description
  - [ ] Prepare attractive screenshots/images
  - [ ] Write clear feature list
  - [ ] Include version number and compatibility information

- [ ] **Steam Workshop**:
  - [ ] Prepare workshop.json file
  - [ ] Set appropriate tags and categories
  - [ ] Create an eye-catching thumbnail
  - [ ] Write comprehensive workshop description

- [ ] **Version Control**:
  - [ ] Tag release version in your repository
  - [ ] Prepare changelog for the release
  - [ ] Archive development files not needed in the release

### Final Verification

- [ ] **Clean Installation Test**:
  - [ ] Test the mod on a fresh game installation
  - [ ] Verify the mod can be enabled/disabled without issues
  - [ ] Check that the mod works correctly when installed via intended distribution method

- [ ] **Multiplayer Final Check**:
  - [ ] Verify all multiplayer features with multiple clients
  - [ ] Test joining servers mid-game
  - [ ] Check host migration if applicable

- [ ] **Save Game Integrity**:
  - [ ] Verify the mod doesn't corrupt save files
  - [ ] Test that saves work correctly after mod updates
  - [ ] Check that disabling the mod doesn't break existing saves

By thoroughly completing this checklist, you can significantly reduce the likelihood of issues after release and provide a higher quality experience for your users.

## Guide on Collecting User Feedback

Effective user feedback collection is crucial for improving your mod and building a community. Here's how to set up systems to gather and utilize user feedback:

### Setting Up Feedback Channels

1. **Steam Workshop Comments**:
   - Regularly monitor comments on your mod's Workshop page
   - Create a pinned comment with guidelines for reporting issues
   - Consider adding a template for bug reports:
     ```
     Bug Report Template:
     - What happened:
     - What you expected to happen:
     - Steps to reproduce:
     - Mod version:
     - Other mods enabled:
     - Game version:
     ```

2. **Dedicated Discussion Platforms**:
   - Create a Discord server or channel for your mod
   - Set up a GitHub repository with issue templates
   - Use the Klei forums for longer discussions

3. **In-Game Feedback**:
   ```lua
   -- Add an in-game feedback system
   local function CreateFeedbackUI()
       local screen = GLOBAL.require "widgets/screen"
       local widget = GLOBAL.require "widgets/widget"
       local text = GLOBAL.require "widgets/text"
       local textbox = GLOBAL.require "widgets/textbox"
       local button = GLOBAL.require "widgets/button"
       
       local FeedbackScreen = Class(screen, function(self)
           screen._ctor(self, "FeedbackScreen")
           
           self.root = self:AddChild(widget("ROOT"))
           self.root:SetVAnchor(GLOBAL.ANCHOR_MIDDLE)
           self.root:SetHAnchor(GLOBAL.ANCHOR_MIDDLE)
           
           -- Create UI elements
           self.title = self.root:AddChild(text(GLOBAL.TITLEFONT, 50, "Send Feedback"))
           self.title:SetPosition(0, 200)
           
           self.feedback_box = self.root:AddChild(textbox(GLOBAL.BODYFONT, 30))
           self.feedback_box:SetPosition(0, 0)
           self.feedback_box:SetRegionSize(600, 300)
           
           self.submit_btn = self.root:AddChild(button())
           self.submit_btn:SetText("Submit")
           self.submit_btn:SetPosition(0, -200)
           self.submit_btn:SetOnClick(function()
               self:SubmitFeedback()
           end)
       end)
       
       function FeedbackScreen:SubmitFeedback()
           local feedback = self.feedback_box:GetString()
           -- Save feedback to a file
           GLOBAL.SavePersistentString("mod_feedback.txt", feedback, false, 
               function(success)
                   if success then
                       print("Feedback saved successfully")
                       GLOBAL.TheFrontEnd:PopScreen()
                   else
                       print("Failed to save feedback")
                   end
               end
           )
       end
       
       return FeedbackScreen
   end
   
   -- Add a key binding to open feedback screen
   GLOBAL.TheInput:AddKeyDownHandler(GLOBAL.KEY_F8, function()
       if GLOBAL.ThePlayer and GLOBAL.TheFrontEnd then
           GLOBAL.TheFrontEnd:PushScreen(CreateFeedbackUI())
       end
   end)
   ```

### Processing and Managing Feedback

1. **Categorize Feedback**:
   - Bug reports: Issues that need fixing
   - Feature requests: New functionality users want
   - Balance suggestions: Adjustments to existing features
   - General feedback: Overall impressions and experiences

2. **Prioritization System**:
   - Critical bugs: Game-breaking issues that need immediate attention
   - High priority: Significant issues affecting many users
   - Medium priority: Non-critical issues that should be addressed
   - Low priority: Minor issues or quality-of-life improvements
   - Feature requests: New functionality to consider for future updates

3. **Response Protocol**:
   - Acknowledge feedback promptly
   - Provide clear timelines for fixes when possible
   - Explain your reasoning when declining suggestions
   - Thank users for constructive feedback

### Implementing a Feedback Loop

1. **Transparent Development**:
   - Maintain a public roadmap or Trello board
   - Share development updates regularly
   - Explain major design decisions

2. **Beta Testing Program**:
   ```lua
   -- In modinfo.lua
   configuration_options = {
       {
           name = "beta_features",
           label = "Beta Features",
           options = {
               {description = "Disabled", data = false},
               {description = "Enabled", data = true}
           },
           default = false
       }
   }
   
   -- In modmain.lua
   local BETA_FEATURES = GetModConfigData("beta_features")
   
   if BETA_FEATURES then
       -- Enable experimental features
       -- Collect additional telemetry
       AddPrefabPostInit("player", function(inst)
           if TheWorld.ismastersim then
               inst:DoPeriodicTask(300, function() -- Every 5 minutes
                   -- Log usage statistics
                   print("Collecting beta feedback...")
               end)
           end
       end)
   end
   ```

3. **Version Iteration**:
   - Use semantic versioning (MAJOR.MINOR.PATCH)
   - Provide detailed changelogs
   - Reference feedback/issues that were addressed

### Analytics and Telemetry

1. **Basic Usage Statistics**:
   ```lua
   -- Anonymous usage tracking (with user consent)
   if GetModConfigData("allow_analytics") then
       AddPrefabPostInit("world", function(inst)
           inst:DoTaskInTime(5, function()
               -- Basic mod usage data
               local data = {
                   mod_version = "1.2.3",
                   game_version = GLOBAL.APP_VERSION,
                   config = {
                       -- Anonymized config settings
                   },
                   -- No personally identifiable information
               }
               
               -- Log locally for now
               print("Analytics: " .. json.encode(data))
               -- In a real mod, you would send this to your server
           end)
       end)
   end
   ```

2. **Feature Usage Tracking**:
   - Track which features are most used
   - Identify unused or problematic features
   - Monitor performance metrics

3. **User Satisfaction**:
   - Implement simple in-game rating system
   - Track changes in ratings over time
   - Correlate ratings with specific features or changes

### Ethical Considerations

1. **Transparency**:
   - Always be clear about what data you collect
   - Make analytics opt-in, not opt-out
   - Explain how feedback will be used

2. **Privacy**:
   - Never collect personally identifiable information
   - Anonymize all feedback and usage data
   - Provide options to delete submitted feedback

3. **Community Management**:
   - Establish clear community guidelines
   - Moderate feedback channels to maintain a positive environment
   - Recognize and appreciate constructive feedback

By implementing these feedback systems, you can create a continuous improvement cycle for your mod while building a supportive community around your work.

## Conclusion

A well-structured testing environment is essential for developing robust mods. By following this guide, you can create various testing scenarios to ensure your mod works correctly in all situations. Remember to test your mod thoroughly before releasing it to the public, as this will help provide a better experience for your users and reduce the number of bug reports.

For more advanced testing techniques, see the [Debugging and Testing](debugging-and-testing.md) guide and the [Troubleshooting Guide](troubleshooting-guide.md). 
