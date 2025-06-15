---
id: case-wormhole
title: Case Study - Wormhole Marks
sidebar_position: 12
---

# Case Study: Wormhole Marks Mod

This case study examines the "Wormhole Marks" mod for Don't Starve Together, which helps players track wormhole connections by adding visual markers. We'll analyze its implementation and extract valuable modding techniques.
- [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=362175979)

## Mod Overview

The Wormhole Marks mod solves a common gameplay challenge: remembering which wormhole pairs connect to each other. The mod:

- Assigns matching symbols to connected wormhole pairs
- Displays these symbols on the minimap for easy navigation
- Persists markings between game sessions
- Optionally allows marks to be visible through fog of war

## Technical Implementation

### Core Techniques Used

1. **Custom Components**
2. **Minimap Integration**
3. **Configuration Options**
4. **Data Persistence**
5. **Server-Client Synchronization**

Let's examine each of these techniques in detail.

## 1. Custom Components

The mod implements two custom components to manage wormhole marking functionality:

- `wormhole_marks`: Applied to each wormhole to track and display its mark
- `wormhole_counter`: Applied to the world to track the global pair count

### Key Code Elements

```lua
-- In modmain.lua: Adding components to prefabs
function WormholePrefabPostInit(inst)
    if not inst.components.wormhole_marks then
        inst:AddComponent("wormhole_marks")
    end
    inst:ListenForEvent("starttravelsound", Mark)
end

AddPrefabPostInit("wormhole", WormholePrefabPostInit)

function WorldPrefabPostInit(inst)
    if inst:HasTag("forest") then
        inst:AddComponent("wormhole_counter")
    end
end

if GLOBAL.TheNet:GetIsServer() or GLOBAL.TheNet:IsDedicated() then
    AddPrefabPostInit("world", WorldPrefabPostInit)
end

-- The Mark function, triggered when a wormhole is used
local function Mark(inst)
    if not inst.components.wormhole_marks:CheckMark() then
        inst.components.wormhole_marks:MarkEntrance()
    end
    
    local other = inst.components.teleporter.targetTeleporter    
    if not other.components.wormhole_marks:CheckMark() then
        other.components.wormhole_marks:MarkExit()
    end
end
```

### The wormhole_marks Component

```lua
-- In scripts/components/wormhole_marks.lua
local Wormhole_Marks = Class(function(self, inst)
    self.inst = inst
    self.marked = false
    self.wormhole_number = nil
end)

function Wormhole_Marks:MarkEntrance()
    self:GetNumber()
    if self.wormhole_number <= 22 then 
        self.marked = true
        if fow_setting == "enabled" then
            self.inst.MiniMapEntity:SetDrawOverFogOfWar(true)
        end
        self.inst.MiniMapEntity:SetIcon("mark_"..self.wormhole_number..".tex")
    end
end

function Wormhole_Marks:MarkExit()
    self:GetNumber()
    if self.wormhole_number <= 22 then 
        self.marked = true
        if fow_setting == "enabled" then
            self.inst.MiniMapEntity:SetDrawOverFogOfWar(true)
        end
        self.inst.MiniMapEntity:SetIcon("mark_"..self.wormhole_number..".tex")
        TheWorld.components.wormhole_counter:Set()
    end
end

-- Save/load functionality for persistence
function Wormhole_Marks:OnSave()
    local data = {}
    data.marked = self.marked
    data.wormhole_number = self.wormhole_number
    return data
end

function Wormhole_Marks:OnLoad(data)
    if data then
        self.marked = data.marked
        self.wormhole_number = data.wormhole_number
        if self.marked and self.wormhole_number then
            self.inst.entity:AddMiniMapEntity()
            self.inst.MiniMapEntity:SetIcon("mark_"..self.wormhole_number..".tex")
            if fow_setting == "enabled" then
                self.inst.MiniMapEntity:SetDrawOverFogOfWar(true)
            end
        end
    else
        self.marked = false
        self.wormhole_number = 0
    end
end
```

### The wormhole_counter Component

```lua
-- In scripts/components/wormhole_counter.lua
return Class(function(self, inst)
    assert(TheWorld.ismastersim, "Wormhole_Counter should not exist on client")

    self.inst = inst
    self.wormhole_count = 1

    function self:Set()
        self.wormhole_count = self.wormhole_count + 1
    end

    function self:Get()
        return self.wormhole_count
    end

    function self:OnSave()
        local data = {}
        data.wormhole_count = self.wormhole_count
        return data
    end

    function self:OnLoad(data)
        if data then
            self.wormhole_count = data.wormhole_count
        else
            self.wormhole_count = 1
        end
    end
end)
```

### Implementation Analysis

The custom components demonstrate:

1. **Component Architecture**: Following Don't Starve Together's component-based design pattern
2. **Event System Integration**: Using `ListenForEvent` to trigger functionality when wormholes are used
3. **Component Interaction**: Coordinating between wormhole and world components
4. **Prefab Modification**: Using `AddPrefabPostInit` to modify existing prefabs
5. **Server-Side Validation**: Ensuring world components only exist on the server

## 2. Minimap Integration

The mod uses the game's MiniMapEntity system to display custom icons for marked wormholes.

### Key Code Elements

```lua
-- In modmain.lua: Adding minimap assets
Assets = {
    Asset("ATLAS", "images/mark_1.xml"),
    Asset("ATLAS", "images/mark_2.xml"),
    -- [Additional assets omitted for brevity]
    Asset("ATLAS", "images/mark_22.xml"),
}

-- Registering assets with the minimap system
AddMinimapAtlas("images/mark_1.xml")
AddMinimapAtlas("images/mark_2.xml")
-- [Additional registrations omitted for brevity]
AddMinimapAtlas("images/mark_22.xml")

-- In wormhole_marks component: Setting the minimap icon
self.inst.MiniMapEntity:SetIcon("mark_"..self.wormhole_number..".tex")

-- Optional fog of war visibility
if fow_setting == "enabled" then
    self.inst.MiniMapEntity:SetDrawOverFogOfWar(true)
end
```

### Implementation Analysis

The minimap integration demonstrates:

1. **Custom Icons**: Using game-styled icons for wormhole pairs (22 different symbols)
2. **Asset Registration**: Properly registering assets for use with the minimap system
3. **Dynamic Icon Assignment**: Assigning icons based on wormhole pair IDs
4. **Fog of War Integration**: Optional visibility through unexplored areas
5. **User Experience Focus**: Making connected wormholes visually distinct

## 3. Configuration Options

The mod includes a configuration option to control whether wormhole marks should be visible through fog of war.

```lua
-- In modinfo.lua
configuration_options =
{    
    {
        name = "Draw over FoW",
        options =
        {
            {description = "Disabled", data = "disabled"},
            {description = "Enabled", data = "enabled"},
        },
        default = "disabled",
    },    
}

-- In wormhole_marks.lua: Accessing the configuration option
local modname = KnownModIndex:GetModActualName("Wormhole Marks")
local fow_setting = GetModConfigData("Draw over FoW", modname)

-- Using the setting in component functions
if fow_setting == "enabled" then
    self.inst.MiniMapEntity:SetDrawOverFogOfWar(true)
end
```

### Implementation Analysis

The configuration system demonstrates:

1. **User Customization**: Providing options to tailor the experience
2. **Mod Configuration API**: Using the game's built-in configuration system
3. **Dynamic Behavior Adjustment**: Adapting functionality based on user preferences
4. **Default Value Selection**: Choosing appropriate default behavior

## 4. Data Persistence

The mod saves wormhole pairing information between game sessions using the component save/load system.

```lua
-- In wormhole_marks.lua: Save function
function Wormhole_Marks:OnSave()
    local data = {}
    data.marked = self.marked
    data.wormhole_number = self.wormhole_number
    return data
end

-- In wormhole_marks.lua: Load function
function Wormhole_Marks:OnLoad(data)
    if data then
        self.marked = data.marked
        self.wormhole_number = data.wormhole_number
        if self.marked and self.wormhole_number then
            self.inst.entity:AddMiniMapEntity()
            self.inst.MiniMapEntity:SetIcon("mark_"..self.wormhole_number..".tex")
            if fow_setting == "enabled" then
                self.inst.MiniMapEntity:SetDrawOverFogOfWar(true)
            end
        end
    else
        self.marked = false
        self.wormhole_number = 0
    end
end

-- In wormhole_counter.lua: Save/load for the global counter
function self:OnSave()
    local data = {}
    data.wormhole_count = self.wormhole_count
    return data
end

function self:OnLoad(data)
    if data then
        self.wormhole_count = data.wormhole_count
    else
        self.wormhole_count = 1
    end
end
```

### Implementation Analysis

The data persistence system demonstrates:

1. **Component Save/Load Hooks**: Using the standard DST persistence mechanism
2. **Data Validation**: Checking loaded data before applying
3. **State Restoration**: Rebuilding visual state from saved data
4. **Minimal Data Storage**: Saving only what's necessary (marked status and ID number)
5. **Default Values**: Providing fallbacks when data is not available

## 5. Server-Client Synchronization

The mod uses the world component's server authority to manage wormhole marking, ensuring all clients see consistent information.

```lua
-- In modmain.lua: Server-side validation
if GLOBAL.TheNet:GetIsServer() or GLOBAL.TheNet:IsDedicated() then
    AddPrefabPostInit("world", WorldPrefabPostInit)
end

-- In wormhole_counter.lua: Server-side assertion
assert(TheWorld.ismastersim, "Wormhole_Counter should not exist on client")
```

The mod leverages the game's built-in entity replication system, which automatically synchronizes MiniMapEntity changes to clients.

### Implementation Analysis

The network synchronization demonstrates:

1. **Server Authority**: Ensuring the wormhole counter only exists on the server
2. **Automatic Replication**: Using the game's built-in entity replication for minimaps
3. **Minimized Network Traffic**: Only sending necessary information (mark assignments)
4. **Connection-Time Synchronization**: New clients automatically receive the correct state
5. **Validation**: Ensuring components only run in appropriate environments

## Lessons Learned

From analyzing the Wormhole Marks mod, we can extract several valuable lessons for mod development:

### 1. Component-Based Architecture

The mod demonstrates excellent use of the component pattern:
- Creating focused components with single responsibilities
- Using world components for global state
- Leveraging the built-in save/load hooks for persistence
- Separating presentation (marks) from data management (counter)

### 2. Visual Enhancement Without Gameplay Changes

The mod enhances the game experience by:
- Adding visual information without changing core mechanics
- Respecting the game's existing systems and interfaces
- Integrating cleanly with the minimap system
- Using clear visual language (distinct symbols for pairs)

### 3. Efficient Implementation

The mod shows good practices for:
- Minimal processing (only marking when wormholes are used)
- Efficient asset management (22 distinct symbols, reused when needed)
- Strategic event listening rather than continuous checking
- Using built-in systems rather than reinventing functionality

### 4. User Experience Focus

The mod prioritizes user experience through:
- Solving a specific gameplay pain point
- Providing configuration options for player preference
- Maintaining visual consistency with the game
- Working consistently in multiplayer environments

## Implementing Similar Features

If you want to create a mod with similar entity-relationship visualization features, follow these steps:

### Step 1: Create Custom Components

```lua
-- Define your custom component
local MyComponent = Class(function(self, inst)
    self.inst = inst
    
    -- Initialize component state
    self.marked = false
    self.identifier = nil
end)

-- Add save/load functionality
function MyComponent:OnSave()
    return {
        marked = self.marked,
        identifier = self.identifier
    }
end

function MyComponent:OnLoad(data)
    if data then
        self.marked = data.marked
        self.identifier = data.identifier
        
        -- Restore visual state if needed
        if self.marked and self.identifier then
            self:ApplyVisualState()
        end
    end
end

return MyComponent
```

### Step 2: Hook Into Appropriate Events

```lua
-- In modmain.lua
local function OnEntityInteraction(inst)
    if inst.components.my_component then
        inst.components.my_component:MarkEntity()
        
        -- Find related entities and mark them too
        local related = FindRelatedEntity(inst)
        if related and related.components.my_component then
            related.components.my_component:MarkEntity()
        end
    end
end

-- Add component to entities and listen for events
function EntityPostInit(inst)
    inst:AddComponent("my_component")
    inst:ListenForEvent("relevant_event", OnEntityInteraction)
end

AddPrefabPostInit("target_prefab", EntityPostInit)
```

### Step 3: Add Minimap Integration

```lua
-- In modmain.lua: Register assets
Assets = {
    Asset("ATLAS", "images/custom_icon_1.xml"),
    Asset("ATLAS", "images/custom_icon_2.xml"),
    -- Add more as needed
}

AddMinimapAtlas("images/custom_icon_1.xml")
AddMinimapAtlas("images/custom_icon_2.xml")

-- In your component: Apply minimap icons
function MyComponent:ApplyVisualState()
    -- Ensure entity has a minimap entity
    if not self.inst.MiniMapEntity then
        self.inst.entity:AddMiniMapEntity()
    end
    
    -- Set the appropriate icon
    self.inst.MiniMapEntity:SetIcon("custom_icon_" .. self.identifier .. ".tex")
end
```

### Step 4: Handle Multiplayer Considerations

```lua
-- Ensure server authority for global components
if TheNet:GetIsServer() or TheNet:IsDedicated() then
    -- Add world component for tracking global state
    AddPrefabPostInit("world", function(inst)
        inst:AddComponent("my_global_component")
    end)
end

-- In your global component
local MyGlobalComponent = Class(function(self, inst)
    self.inst = inst
    assert(TheWorld.ismastersim, "MyGlobalComponent should not exist on client")
    
    -- Initialize global state
    self.entity_count = 0
end)
```

## Conclusion

The Wormhole Marks mod exemplifies excellent mod design through:

1. **Focused Problem-Solving**: Addressing a specific player pain point
2. **Clean Integration**: Working with existing game systems
3. **Technical Excellence**: Using components and events appropriately
4. **Multiplayer Support**: Ensuring consistent experience across all players

By studying this mod, we can learn how to create effective quality-of-life improvements that enhance the game while respecting its design and systems.

## See also

- [Entity System](../core/entity-system.md) - For understanding entity management
- [Component System](../core/component-system.md) - For component-based architecture
- [Event System](../core/event-system.md) - For event handling and communication
- [WorldState](../core/worldstate.md) - For world state persistence
- [Prefab System](../node-types/prefab.md) - For understanding prefab initialization
- [Network System](../core/network-system.md) - For multiplayer synchronization
- [Case Study - Combined Status](case-status.md) - Another UI enhancement mod example
- [Case Study - Geometric Placement](case-geometric.md) - Another QoL improvement mod 