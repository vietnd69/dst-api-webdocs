---
id: migration-guides
title: Migration Guides
sidebar_position: 10
---

# Migration Guides

These guides help mod developers update their mods to work with major changes in the Don't Starve Together API. Each section covers a significant API update and provides step-by-step instructions for migrating your code.

## Migrating to Return of Them Update (2019)

The "Return of Them" update introduced significant changes to the game, including the boat system, ocean content, and various API changes.

### Key Changes

1. **Ocean and Boat Systems**: New water-based mechanics
2. **New Components**: `walkableplatform`, `flotation`, `waterproofer`, etc.
3. **Updated Physics**: Changes to collision and movement
4. **Shards System**: Enhanced multi-server functionality

### Migration Steps

#### 1. Update Player Movement Handling

The player movement system was updated to handle boats and water:

```lua
-- Old code
local function OnPlayerMove(inst)
    local x, y, z = inst.Transform:GetWorldPosition()
    -- Direct ground-based logic
end

-- New code
local function OnPlayerMove(inst)
    local x, y, z = inst.Transform:GetWorldPosition()
    
    -- Check if on a boat
    local platform = inst:GetCurrentPlatform()
    if platform ~= nil then
        -- Handle boat-based movement
    else
        -- Handle ground-based movement
    end
end
```

#### 2. Update Placement Logic

Placement logic needs to account for water and boats:

```lua
-- Old code
local function CanPlaceHere(inst, pt)
    return TheWorld.Map:IsPassableAtPoint(pt.x, pt.y, pt.z)
end

-- New code
local function CanPlaceHere(inst, pt)
    -- Check ground placement
    if not TheWorld.Map:IsPassableAtPoint(pt.x, pt.y, pt.z) then
        return false
    end
    
    -- Check water placement
    local on_water = TheWorld.Map:IsOceanAtPoint(pt.x, pt.y, pt.z)
    if on_water and not inst.components.deployable.allowwater then
        return false
    end
    
    -- Check boat placement
    local platform = TheWorld.Map:GetPlatformAtPoint(pt.x, pt.z)
    if platform ~= nil and not inst.components.deployable.allowboat then
        return false
    end
    
    return true
end
```

#### 3. Update Map Functions

Map functions were updated to handle water:

```lua
-- Old code
local is_valid = TheWorld.Map:IsPassableAtPoint(x, y, z)

-- New code
local is_land = TheWorld.Map:IsPassableAtPoint(x, y, z) and not TheWorld.Map:IsOceanAtPoint(x, y, z)
local is_water = TheWorld.Map:IsOceanAtPoint(x, y, z)
local is_valid = is_land or (is_water and can_be_on_water)
```

#### 4. Add Water Compatibility to Items

Items need to handle water interactions:

```lua
-- Add to your item prefabs
local function MakeWaterCompatible(inst)
    if inst.components.inventoryitem ~= nil then
        inst.components.inventoryitem:SetSinks(false) -- Prevent sinking
    end
    
    -- Add floater component for items that float
    if TUNING.FLOATING_ITEMS_ENABLED and inst.components.floater == nil then
        inst:AddComponent("floater")
    end
end
```

## Migrating to A New Reign Update (2017)

The "A New Reign" update introduced several API changes, particularly around networking and world state.

### Key Changes

1. **State System**: Replaced the clock system with a state system
2. **Network Optimizations**: Changes to network variable handling
3. **New Event System**: Updated event handling
4. **Character Specific Features**: New character-specific APIs

### Migration Steps

#### 1. Update Clock References

The clock system was replaced with the state system:

```lua
-- Old code
local is_day = GetClock():IsDay()
local current_time = GetClock():GetTotalTime()
local phase = GetClock():GetPhase()

-- New code
local is_day = TheWorld.state.isday
local current_time = TheWorld.state.time
local phase = TheWorld.state.phase
```

#### 2. Update Network Variables

Network variables changed to use getter/setter methods:

```lua
-- Old code
local net_var = net_string(inst.GUID, "myvar", "myvar_dirty")
net_var.value = "hello"
local value = net_var.value

-- New code
local net_var = net_string(inst.GUID, "myvar", "myvar_dirty")
net_var:Set("hello")
local value = net_var:Get()
```

#### 3. Update Event Handling

Some events were renamed or changed:

```lua
-- Old code
inst:ListenForEvent("daycomplete", OnDayComplete)
inst:ListenForEvent("nighttime", OnNightTime)

-- New code
inst:ListenForEvent("cycleschanged", OnDayComplete)
inst:ListenForEvent("phasechanged", function(world, data)
    if data.newphase == "night" then
        OnNightTime(world, data)
    end
end)
```

#### 4. Update Player References

Player references were updated for multiplayer support:

```lua
-- Old code
local player = GetPlayer()

-- New code
local player = ThePlayer -- Client-side only
-- or
for i, v in ipairs(AllPlayers) do
    -- Do something with each player
end
```

## Migrating to Multiplayer Update (2016)

The multiplayer update was one of the most significant changes to the API, transforming the game from single-player to multiplayer.

### Key Changes

1. **Client/Server Architecture**: Split between server and client code
2. **Replica Components**: Introduction of client-side replicas
3. **Network Variables**: New network synchronization system
4. **Global References**: Changes to global object references

### Migration Steps

#### 1. Update Component Access

Components are now split between server and client:

```lua
-- Old code (works only on server now)
local health = inst.components.health
health:SetMaxHealth(100)

-- New code (works on both client and server)
local function GetHealth(inst)
    if TheWorld.ismastersim then
        -- Server-side
        return inst.components.health ~= nil and inst.components.health.currenthealth or 0
    else
        -- Client-side
        return inst.replica.health ~= nil and inst.replica.health:GetCurrent() or 0
    end
end
```

#### 2. Add Server/Client Checks

Code needs to check if it's running on server or client:

```lua
-- Check if code is running on server
if TheWorld.ismastersim then
    -- Server-only code
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(100)
else
    -- Client-only code
    -- Use replica components
end
```

#### 3. Update Network Synchronization

Add network synchronization for multiplayer:

```lua
local function MakePrefab()
    local inst = CreateEntity()
    
    -- Basic setup
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    
    -- Add network component for multiplayer
    inst.entity:AddNetwork()
    
    -- Set properties that need to be synced
    inst:AddTag("myentity")
    
    -- Finalize network setup
    inst.entity:SetPristine()
    
    -- Server-side components
    if TheWorld.ismastersim then
        inst:AddComponent("health")
        -- Other server components
    end
    
    return inst
end
```

#### 4. Update Action Handling

Actions now need to work in a networked environment:

```lua
-- Define action handler on server
local MyAction = Action({priority=1})
MyAction.id = "MYACTION"
MyAction.str = "My Action"
MyAction.fn = function(act)
    if act.target and act.target.components.mycomponent then
        act.target.components.mycomponent:DoSomething()
        return true
    end
    return false
end

-- Register action for client prediction
AddAction(MyAction)

-- Add action component to entity
if TheWorld.ismastersim then
    inst:AddComponent("myactionable")
    inst.components.myactionable:SetActionFn(MyAction)
end
```

## Migrating to Hamlet Update (Late 2018)

The Hamlet update added new systems and components, particularly for interiors and city structures.

### Key Changes

1. **Interior System**: New system for building interiors
2. **City Planning**: New grid-based building system
3. **Economy System**: Trading and currency systems
4. **New Components**: `tradable`, `shopkeeper`, etc.

### Migration Steps

#### 1. Update Building Placement

Building placement logic needed updates for city grid systems:

```lua
-- Old code
local function CanPlaceHere(inst, pt)
    return TheWorld.Map:IsPassableAtPoint(pt.x, pt.y, pt.z)
end

-- New code
local function CanPlaceHere(inst, pt)
    -- Basic passability check
    if not TheWorld.Map:IsPassableAtPoint(pt.x, pt.y, pt.z) then
        return false
    end
    
    -- Check if on a valid city tile
    if TheWorld.components.cityplanner ~= nil then
        local tile_type = TheWorld.components.cityplanner:GetTileTypeAtPoint(pt.x, pt.z)
        if tile_type ~= CITY_TILES.RESIDENTIAL and inst.building_type == "house" then
            return false
        end
    end
    
    return true
end
```

#### 2. Add Interior Compatibility

For mods that interact with buildings, interior support was needed:

```lua
-- Check if player is in an interior
local function IsInInterior(inst)
    return TheWorld:HasTag("interior")
end

-- Get the current interior ID
local function GetCurrentInteriorID()
    if TheWorld.components.interiormanager ~= nil then
        return TheWorld.components.interiormanager:GetCurrentInteriorID()
    end
    return nil
end

-- Handle interior transitions
local function OnEnterInterior(inst, data)
    -- Handle interior entry
    local interior_id = data.interior_id
    -- Adjust behavior for interior
end
```

#### 3. Add Trading Compatibility

For items that could be traded:

```lua
local function MakeTradable(inst)
    if inst.components.tradable == nil then
        inst:AddComponent("tradable")
    end
    
    inst.components.tradable.goldvalue = 5 -- Value in gold coins
    inst.components.tradable:SetOnTradeFn(function(inst, trader)
        -- Do something when traded
    end)
end
```

## Conclusion

When migrating to a new API version:

1. **Read Release Notes**: Check official release notes for API changes
2. **Test Incrementally**: Update and test one system at a time
3. **Use Compatibility Layers**: Create abstraction layers for major changes
4. **Check Community Resources**: The modding community often shares migration tips

Remember that some changes may require significant restructuring of your mod. In these cases, it might be easier to create a new version rather than trying to maintain backwards compatibility. 