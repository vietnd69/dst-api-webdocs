---
id: mod-updating-guide
title: Updating Mods for API Changes
sidebar_position: 7
last_updated: 2023-07-06
---

# Updating Mods for API Changes

This guide provides strategies and best practices for updating your mods when the Don't Starve Together API changes. Keeping your mods compatible with the latest game version ensures they continue to function correctly and provide a good experience for users.

## Understanding API Changes

API changes in Don't Starve Together generally fall into these categories:

1. **Additions**: New components, functions, or properties that expand functionality
2. **Modifications**: Changes to existing components or functions that may alter behavior
3. **Deprecations**: Features that still work but are planned for removal
4. **Removals**: Features that have been completely removed

## Monitoring for Changes

Stay informed about API changes through these channels:

- **Official Klei Forums**: Check the [Game Updates](https://forums.kleientertainment.com/game-updates/dst/) section
- **API Changelog**: Review our [API Changelog](api-changelog.md) document
- **Steam Beta Branch**: Opt into beta branches to test your mods before updates go live
- **Community Discord**: Join modding communities where changes are often discussed

## Defensive Coding Practices

### Check for Feature Existence

Always verify that functions and components exist before using them:

```lua
-- Check if a function exists
if TheWorld.net.components.weather ~= nil and TheWorld.net.components.weather.GetMoisture ~= nil then
    local moisture = TheWorld.net.components.weather:GetMoisture()
else
    -- Fallback behavior
end

-- Check if a component exists
if inst.components.new_component ~= nil then
    inst.components.new_component:DoSomething()
else
    -- Alternative approach
end
```

### Version Detection

Adapt behavior based on the game version:

```lua
local function GetGameVersion()
    if TheSim and TheSim.GetGameVersion then
        return TheSim:GetGameVersion()
    end
    return "0.0.0" -- Default for very old versions
end

local version = GetGameVersion()
if version >= "500000" then -- Version format may vary
    -- Use newer API
else
    -- Use older API
end
```

### Feature Detection

When possible, check for specific features rather than version numbers:

```lua
-- Better than version checking in many cases
if TheWorld.ismastershard ~= nil then
    -- This is a newer version with shard support
else
    -- This is an older version
end
```

### Graceful Degradation

Design your mod to work (perhaps with reduced functionality) even when preferred APIs are unavailable:

```lua
local function TryUseNewFeature()
    if SomeNewFunction ~= nil then
        return SomeNewFunction()
    else
        -- Fallback implementation that works on older versions
        return LegacyImplementation()
    end
end
```

## Handling Common API Changes

### Component Changes

When components change:

```lua
-- Handle renamed component
local health_component = inst.components.health or inst.components.old_health_name

-- Handle moved functionality
local function GetHealth(inst)
    if inst.components.health ~= nil then
        return inst.components.health.currenthealth
    elseif inst.replica.health ~= nil then
        return inst.replica.health:GetCurrent()
    end
    return 0
end
```

### Function Signature Changes

When function parameters change:

```lua
-- Handle added parameters
local function SafeCall(inst, fn_name, ...)
    local fn = inst[fn_name]
    if fn ~= nil then
        -- Try new signature first
        local success, result = pcall(function() return fn(inst, ...) end)
        if success then
            return result
        end
        
        -- Try old signature as fallback
        return fn(inst)
    end
    return nil
end
```

### Network Synchronization Changes

When networking changes:

```lua
-- Handle changes in network variable synchronization
local function SetupNetworking(inst)
    if TheWorld.ismastersim then
        -- Server-side
        if inst.components.health ~= nil then
            -- New API
            if inst.components.health.SetNetworkID ~= nil then
                inst.components.health:SetNetworkID("health_" .. tostring(inst.GUID))
            end
            -- Old API fallback otherwise
        end
    end
end
```

## Testing Your Updated Mod

After updating your mod for API changes:

1. **Test in Single Player**: Verify basic functionality works
2. **Test in Multiplayer**: Check for synchronization issues
3. **Test with Other Mods**: Ensure compatibility with popular mods
4. **Test Edge Cases**: Try unusual scenarios that might trigger bugs
5. **Test Performance**: Check that your mod doesn't cause lag or crashes

## Communicating Changes to Users

When updating your mod for API changes:

1. **Update the Mod Description**: Note compatibility with game versions
2. **Maintain a Changelog**: Document what changed and why
3. **Respond to Issues**: Address user-reported problems promptly
4. **Consider Version Branches**: Maintain separate versions for major game updates if needed

## Backward Compatibility Techniques

### Wrapper Functions

Create wrapper functions that work across versions:

```lua
local function GetWorldTemperature()
    if TheWorld.state ~= nil and TheWorld.state.temperature ~= nil then
        -- New API
        return TheWorld.state.temperature
    elseif TheWorld.components.temperature ~= nil then
        -- Old API
        return TheWorld.components.temperature:GetCurrent()
    else
        -- Fallback
        return 20 -- Default temperature
    end
end
```

### Feature Toggles

Use configuration options to enable/disable features based on compatibility:

```lua
local CONFIG = {
    use_new_network_api = true,
    use_legacy_combat = false,
}

-- Later in code
if CONFIG.use_new_network_api and TheNet.GetClientTable ~= nil then
    clients = TheNet:GetClientTable()
else
    -- Legacy method to get clients
end
```

### Compatibility Layers

Create abstraction layers that normalize API differences:

```lua
local PlayerManager = {}

function PlayerManager.GetPlayerByUserId(userid)
    -- New method
    if TheNet.GetClientTableForUser ~= nil then
        local client = TheNet:GetClientTableForUser(userid)
        if client ~= nil then
            return client.player
        end
    end
    
    -- Old method
    for i, v in ipairs(AllPlayers) do
        if v.userid == userid then
            return v
        end
    end
    
    return nil
end
```

## Example: Updating a Mod for Major API Changes

Here's an example of updating a simple mod that was built for an older version:

### Original Mod (Pre-Update)

```lua
-- Old mod code
local function OnInit()
    -- Old API usage
    local player = GetPlayer()
    if player ~= nil then
        player.old_component:DoSomething()
    end
end

AddPrefabPostInit("world", function(inst)
    inst:DoTaskInTime(0, OnInit)
end)
```

### Updated Mod (Post-Update)

```lua
-- New mod code with compatibility
local function OnInit()
    -- Check for ThePlayer (new) or GetPlayer() (old)
    local player = ThePlayer or (GetPlayer ~= nil and GetPlayer())
    
    if player ~= nil then
        -- Try new component first, fall back to old
        local component = player.new_component or player.old_component
        if component ~= nil then
            -- Check if the method exists
            if component.DoSomething ~= nil then
                component:DoSomething()
            elseif component.DoSomethingNew ~= nil then
                -- Method was renamed
                component:DoSomethingNew()
            end
        end
    end
end

-- Works in both single and multi-player
AddPrefabPostInit("world", function(inst)
    inst:DoTaskInTime(0, OnInit)
end)
```

## Conclusion

Updating mods for API changes requires vigilance, testing, and good coding practices. By following the strategies in this guide, you can maintain compatibility with new game versions while still supporting older versions when possible.

Remember that the Don't Starve Together modding community is collaborative - if you're struggling with API changes, don't hesitate to ask for help on the forums or Discord channels. 
