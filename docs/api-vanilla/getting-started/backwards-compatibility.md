---
id: backwards-compatibility
title: Backwards Compatibility
sidebar_position: 9
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Backwards Compatibility

This guide focuses on maintaining backwards compatibility in your Don't Starve Together mods, allowing them to work across multiple game versions. Creating mods that function correctly on both older and newer versions of the game improves user experience and reduces maintenance overhead.

## Why Backwards Compatibility Matters

Maintaining backwards compatibility is important for several reasons:

1. **User Base**: Not all players update to the latest version immediately
2. **Server Compatibility**: Servers may run older versions of the game
3. **Mod Collections**: Users may have collections of mods that work together
4. **Reduced Maintenance**: Fewer version-specific branches to maintain

## Compatibility Challenges

Several factors can affect backwards compatibility:

### API Changes

- **Added Features**: New components, functions, or properties
- **Modified Features**: Changes to existing functionality
- **Removed Features**: Functionality that no longer exists
- **Renamed Features**: Same functionality with different names

### Game Behavior Changes

- **Physics Changes**: Modifications to collision or movement
- **Balance Changes**: Adjustments to game mechanics
- **World Generation**: Changes to how worlds are created
- **Performance Optimizations**: Changes that affect timing or execution order

## Compatibility Strategies

### Version Detection

Detect the game version to adapt your mod's behavior:

```lua
local function GetGameVersion()
    if TheSim and TheSim.GetGameVersion then
        return TheSim:GetGameVersion()
    end
    return "0.0.0" -- Default for very old versions
end

local game_version = GetGameVersion()

-- Use version to determine behavior
local function IsVersionAtLeast(major, minor, revision)
    -- Implementation depends on version format
    -- This is a simplified example
    local current = game_version:match("(%d+)")
    return current ~= nil and tonumber(current) >= major
end

if IsVersionAtLeast(400000) then
    -- Use newer API
else
    -- Use older API
end
```

### Feature Detection

Instead of version checking, detect if specific features exist:

```lua
-- Check if a function exists
if TheWorld.state ~= nil then
    -- Use new state system
    local is_day = TheWorld.state.isday
else
    -- Use old clock system
    local is_day = GetClock() ~= nil and GetClock():IsDay()
end

-- Check if a component method exists
if inst.components.health ~= nil then
    if inst.components.health.SetMaxHealth ~= nil then
        -- Use new method
        inst.components.health:SetMaxHealth(100)
    else
        -- Use old property
        inst.components.health.maxhealth = 100
    end
end
```

### Abstraction Layers

Create wrapper functions that hide API differences:

```lua
-- Wrapper for getting the current player
local function GetCurrentPlayer()
    return ThePlayer or (GetPlayer ~= nil and GetPlayer()) or nil
end

-- Wrapper for getting the current phase
local function GetCurrentPhase()
    if TheWorld.state ~= nil then
        return TheWorld.state.phase
    elseif GetClock() ~= nil then
        if GetClock():IsDay() then
            return "day"
        elseif GetClock():IsDusk() then
            return "dusk"
        else
            return "night"
        end
    end
    return "day" -- Default fallback
end
```

### Fallback Implementations

Provide alternative implementations when features are missing:

```lua
-- Example: Implementing a missing function
if not TheWorld.HasTag then
    TheWorld.HasTag = function(self, tag)
        return self.Network ~= nil and 
               self.Network.components ~= nil and 
               self.Network.components.tags ~= nil and 
               self.Network.components.tags:HasTag(tag)
    end
end

-- Safe function calling with fallback
local function SafeCall(obj, fn_name, ...)
    if obj ~= nil and type(obj[fn_name]) == "function" then
        return obj[fn_name](obj, ...)
    end
    return nil
end
```

### Conditional Features

Enable or disable features based on compatibility:

```lua
local CONFIG = {
    -- Feature flags
    use_new_network_api = true,
    use_legacy_combat = false,
    enable_advanced_features = true
}

-- Check if advanced features can be used
local can_use_advanced = CONFIG.enable_advanced_features and 
                         TheWorld.state ~= nil and 
                         TheNet.GetClientTable ~= nil

if can_use_advanced then
    -- Implement advanced features
else
    -- Implement basic features only
end
```

## Common Compatibility Issues

### Global Objects

```lua
-- Safe access to global objects
local world = TheWorld or GetWorld()
local player = ThePlayer or (GetPlayer ~= nil and GetPlayer())
```

### Component Access

```lua
-- Safe component access
local function GetHealth(inst)
    if inst == nil then return 0 end
    
    -- Server-side with component
    if inst.components ~= nil and inst.components.health ~= nil then
        return inst.components.health.currenthealth
    end
    
    -- Client-side with replica
    if inst.replica ~= nil and inst.replica.health ~= nil then
        return inst.replica.health:GetCurrent()
    end
    
    return 0
end
```

### Network Synchronization

```lua
-- Compatible network variable setup
local function SetupNetworking(inst)
    -- Create network variable
    local net_var = net_string(inst.GUID, "net_var", "net_var_dirty")
    
    -- Set initial value safely
    if net_var.Set ~= nil then
        net_var:Set("initial_value")
    else
        net_var.value = "initial_value"
    end
    
    -- Get value safely
    local function GetNetValue()
        if net_var.Get ~= nil then
            return net_var:Get()
        else
            return net_var.value
        end
    end
    
    inst.GetNetValue = GetNetValue
end
```

### Event System

```lua
-- Compatible event handling
local function SetupEvents(inst)
    -- Handle renamed events
    inst:ListenForEvent("cycleschanged", function(world, data)
        -- New event in newer versions
        OnNewDay(world, data)
    end)
    
    if GetWorld ~= nil then
        -- Old event in older versions
        inst:ListenForEvent("daycomplete", function(world, data)
            OnNewDay(world, data)
        end)
    end
}
```

## Testing Across Versions

To ensure backwards compatibility:

1. **Maintain Test Environments**: Keep installations of different game versions
2. **Version Matrix**: Test your mod against a matrix of game versions
3. **Feature Tests**: Create tests for specific features that might change
4. **User Reports**: Pay attention to user reports about version-specific issues

## Versioning Your Mod

Consider using semantic versioning for your mod:

- **Major Version**: Incompatible API changes
- **Minor Version**: Added functionality in a backwards-compatible manner
- **Patch Version**: Backwards-compatible bug fixes

Example version scheme:
```
ModVersion = "2.3.1"
-- 2 = Major version (breaking changes)
-- 3 = Minor version (new features)
-- 1 = Patch version (bug fixes)
```

## Communicating Compatibility

Clearly communicate compatibility information to users:

1. **Version Requirements**: Specify minimum and maximum game versions
2. **Known Issues**: Document version-specific issues
3. **Changelog**: Maintain a detailed changelog noting compatibility changes
4. **Documentation**: Provide version-specific documentation when needed

Example mod info:
```lua
name = "My Compatible Mod"
description = "Works with DST versions 400000-517850. See notes for details."
```

## Conclusion

Maintaining backwards compatibility requires effort but pays off in user satisfaction and reduced maintenance burden. By using feature detection, abstraction layers, and careful testing, you can create mods that work across multiple game versions.

Remember that perfect backwards compatibility isn't always possible or practical. In some cases, it may be better to maintain separate versions of your mod for significantly different game versions. 
