---
id: case-wormhole
title: Case Study - Wormhole Marks
sidebar_position: 12
---

# Case Study: Wormhole Marks Mod

This case study examines the "Wormhole Marks" mod for Don't Starve Together, which helps players track wormhole connections by adding visual markers. We'll analyze its implementation and extract valuable modding techniques.

## Mod Overview

The Wormhole Marks mod solves a common gameplay challenge: remembering which wormholes connect to each other. The mod:

- Assigns matching symbols to connected wormhole pairs
- Displays these symbols above wormholes in the world
- Shows the symbols on the map for easy navigation
- Persists markings between game sessions

## Technical Implementation

### Core Techniques Used

1. **Entity Identification and Pairing**
2. **Custom Visual Indicators**
3. **Minimap Integration**
4. **Data Persistence**
5. **Network Synchronization**

Let's examine each of these techniques in detail.

## 1. Entity Identification and Pairing

The mod needs to identify all wormholes in the world and determine which ones are connected to each other.

### Key Code Elements

```lua
-- Find and track all wormholes in the world
local function InitializeWormholes()
    -- Clear existing data
    WORMHOLE_PAIRS = {}
    
    -- Find all wormholes in the world
    local wormholes = {}
    for _, v in pairs(Ents) do
        if v.prefab == "wormhole" then
            table.insert(wormholes, v)
        end
    end
    
    -- Create pairs based on wormhole connections
    local assigned = {}
    for i, wormhole in ipairs(wormholes) do
        if not assigned[wormhole] then
            -- Find this wormhole's target
            local target = wormhole.components.teleporter.targetTeleporter
            if target and not assigned[target] then
                -- Create a new pair
                local pair_id = #WORMHOLE_PAIRS + 1
                WORMHOLE_PAIRS[pair_id] = {wormhole, target}
                
                -- Mark both as assigned
                assigned[wormhole] = true
                assigned[target] = true
                
                -- Assign a symbol to this pair
                AssignSymbolToPair(pair_id)
            end
        end
    end
end
```

### Implementation Analysis

The pairing system demonstrates:

1. **Entity Filtering**: Finding specific entities by prefab name
2. **Component Access**: Using the teleporter component to find connections
3. **Relationship Tracking**: Creating pairs based on in-game relationships
4. **Duplicate Prevention**: Using a lookup table to prevent double-assignment

## 2. Custom Visual Indicators

The mod creates visual indicators that appear above each wormhole in the world.

### Key Code Elements

```lua
-- Create a visual marker for a wormhole
local function CreateWormholeMarker(wormhole, symbol)
    -- Remove any existing marker
    if wormhole._wormhole_marker then
        wormhole._wormhole_marker:Remove()
    end
    
    -- Create a new marker entity
    local marker = SpawnPrefab("wormholemarker")
    
    -- Position it above the wormhole
    local x, y, z = wormhole.Transform:GetWorldPosition()
    marker.Transform:SetPosition(x, y + 2.5, z)
    
    -- Set the symbol
    marker.symbol = symbol
    marker.AnimState:OverrideSymbol("symbol", "wormhole_symbols", symbol)
    
    -- Link it to the wormhole
    wormhole._wormhole_marker = marker
    marker.entity:SetParent(wormhole.entity)
    
    return marker
end

-- Assign a symbol to a wormhole pair
function AssignSymbolToPair(pair_id)
    local pair = WORMHOLE_PAIRS[pair_id]
    if not pair then return end
    
    -- Choose a symbol from our set
    local symbol = "symbol_" .. ((pair_id - 1) % NUM_SYMBOLS + 1)
    
    -- Create markers for both wormholes in the pair
    CreateWormholeMarker(pair[1], symbol)
    CreateWormholeMarker(pair[2], symbol)
    
    -- Store the symbol for this pair
    WORMHOLE_SYMBOLS[pair_id] = symbol
end
```

### Implementation Analysis

The visual indicator system demonstrates:

1. **Custom Entity Creation**: Spawning specialized marker entities
2. **Visual Customization**: Using OverrideSymbol for custom appearances
3. **Entity Positioning**: Placing markers relative to their parent objects
4. **Parent-Child Relationships**: Using SetParent to attach markers to wormholes
5. **Resource Management**: Removing old markers before creating new ones

## 3. Minimap Integration

The mod adds custom icons to the minimap to show wormhole locations and their symbols.

### Key Code Elements

```lua
-- Add minimap icons for wormholes
local function AddMinimapIcons()
    -- For each wormhole pair
    for pair_id, pair in pairs(WORMHOLE_PAIRS) do
        local symbol = WORMHOLE_SYMBOLS[pair_id]
        if symbol then
            -- Add minimap icon for each wormhole in the pair
            for _, wormhole in ipairs(pair) do
                if wormhole and wormhole:IsValid() then
                    -- Create or update minimap icon
                    if not wormhole._minimap_icon then
                        wormhole._minimap_icon = SpawnPrefab("wormholemapicon")
                        wormhole._minimap_icon.MiniMapEntity:SetPriority(10)
                    end
                    
                    -- Set the icon's position and symbol
                    local x, y, z = wormhole.Transform:GetWorldPosition()
                    wormhole._minimap_icon.Transform:SetPosition(x, 0, z)
                    
                    -- Set the icon's appearance
                    wormhole._minimap_icon.MiniMapEntity:SetIcon(symbol)
                    
                    -- Make the icon follow the wormhole
                    wormhole:ListenForEvent("onremove", function()
                        if wormhole._minimap_icon then
                            wormhole._minimap_icon:Remove()
                        end
                    end)
                end
            end
        end
    end
end
```

### Implementation Analysis

The minimap integration demonstrates:

1. **Custom Map Icons**: Creating specialized entities for the map
2. **Map Priority**: Setting the display priority for map icons
3. **Icon Customization**: Setting custom icons based on wormhole pairs
4. **Position Tracking**: Keeping map icons synchronized with world entities
5. **Cleanup Management**: Removing map icons when their wormholes are removed

## 4. Data Persistence

The mod saves wormhole pairing information between game sessions.

### Key Code Elements

```lua
-- Save wormhole data
local function SaveWormholeData()
    -- Prepare data structure
    local data = {
        pairs = {},
        symbols = {}
    }
    
    -- Save pair information using entity references
    for pair_id, pair in pairs(WORMHOLE_PAIRS) do
        data.pairs[pair_id] = {
            pair[1].GUID,
            pair[2].GUID
        }
    end
    
    -- Save symbol assignments
    for pair_id, symbol in pairs(WORMHOLE_SYMBOLS) do
        data.symbols[pair_id] = symbol
    end
    
    -- Save to world storage
    if TheWorld.components.worldstate then
        TheWorld.components.worldstate:SetValue("wormhole_data", data)
    end
end

-- Load wormhole data
local function LoadWormholeData()
    -- Get data from world storage
    local data = nil
    if TheWorld.components.worldstate then
        data = TheWorld.components.worldstate:GetValue("wormhole_data")
    end
    
    if not data then return false end
    
    -- Clear existing data
    WORMHOLE_PAIRS = {}
    WORMHOLE_SYMBOLS = {}
    
    -- Restore pair information from entity references
    for pair_id, guid_pair in pairs(data.pairs) do
        local wormhole1 = Ents[guid_pair[1]]
        local wormhole2 = Ents[guid_pair[2]]
        
        if wormhole1 and wormhole2 and 
           wormhole1:IsValid() and wormhole2:IsValid() then
            WORMHOLE_PAIRS[pair_id] = {wormhole1, wormhole2}
        end
    end
    
    -- Restore symbol assignments
    for pair_id, symbol in pairs(data.symbols) do
        WORMHOLE_SYMBOLS[pair_id] = symbol
        
        -- Recreate visual markers
        local pair = WORMHOLE_PAIRS[pair_id]
        if pair then
            CreateWormholeMarker(pair[1], symbol)
            CreateWormholeMarker(pair[2], symbol)
        end
    end
    
    return true
end
```

### Implementation Analysis

The data persistence system demonstrates:

1. **Data Serialization**: Converting runtime objects to serializable data
2. **Entity References**: Using GUIDs to reference entities between sessions
3. **World State Storage**: Using the worldstate component for persistence
4. **State Restoration**: Rebuilding runtime state from saved data
5. **Validation**: Checking that entities still exist when restoring data

## 5. Network Synchronization

The mod ensures that all players see the same wormhole markings in multiplayer games.

### Key Code Elements

```lua
-- Sync wormhole data to clients
local function SyncWormholeData()
    if not TheWorld.ismastersim then return end
    
    -- Prepare data for network transmission
    local data = {
        pairs = {},
        symbols = {}
    }
    
    -- Convert entity references to GUIDs
    for pair_id, pair in pairs(WORMHOLE_PAIRS) do
        data.pairs[pair_id] = {
            pair[1].GUID,
            pair[2].GUID
        }
    end
    
    -- Include symbol assignments
    for pair_id, symbol in pairs(WORMHOLE_SYMBOLS) do
        data.symbols[pair_id] = symbol
    end
    
    -- Serialize the data
    local data_string = json.encode(data)
    
    -- Send to all clients
    for i, player in ipairs(AllPlayers) do
        if player.userid then
            SendModRPCToClient(GetClientModRPC("WormholeMarks", "ReceiveWormholeData"), player.userid, data_string)
        end
    end
end

-- RPC handler for clients to receive data
AddClientModRPCHandler("WormholeMarks", "ReceiveWormholeData", function(data_string)
    -- Deserialize the data
    local success, data = pcall(json.decode, data_string)
    if not success or not data then return end
    
    -- Apply the data
    ApplyWormholeData(data)
end)

-- Apply received wormhole data
function ApplyWormholeData(data)
    -- Clear existing data
    WORMHOLE_PAIRS = {}
    WORMHOLE_SYMBOLS = {}
    
    -- Process pair information
    for pair_id, guid_pair in pairs(data.pairs) do
        local wormhole1 = Ents[guid_pair[1]]
        local wormhole2 = Ents[guid_pair[2]]
        
        if wormhole1 and wormhole2 and 
           wormhole1:IsValid() and wormhole2:IsValid() then
            WORMHOLE_PAIRS[pair_id] = {wormhole1, wormhole2}
        end
    end
    
    -- Apply symbol assignments
    for pair_id, symbol in pairs(data.symbols) do
        WORMHOLE_SYMBOLS[pair_id] = symbol
        
        -- Recreate visual markers
        local pair = WORMHOLE_PAIRS[pair_id]
        if pair then
            CreateWormholeMarker(pair[1], symbol)
            CreateWormholeMarker(pair[2], symbol)
        end
    end
    
    -- Update minimap icons
    AddMinimapIcons()
end
```

### Implementation Analysis

The network synchronization demonstrates:

1. **Server Authority**: Only the server generates the initial data
2. **Data Serialization**: Converting complex data structures to strings for transmission
3. **RPC System**: Using Remote Procedure Calls to communicate between server and clients
4. **Error Handling**: Using pcall to safely handle potentially corrupted data
5. **State Application**: Applying received data to recreate the visual state

## Lessons Learned

From analyzing the Wormhole Marks mod, we can extract several valuable lessons for mod development:

### 1. Entity Relationship Tracking

The mod demonstrates effective techniques for:
- Identifying related entities in the world
- Creating and maintaining relationships between entities
- Visualizing these relationships for players

### 2. Visual Enhancement Without Gameplay Changes

The mod enhances the game experience by:
- Adding visual information without changing core gameplay
- Using subtle but clear visual indicators
- Integrating with existing systems (minimap, wormholes)

### 3. Effective Data Management

The mod shows good practices for:
- Organizing complex data relationships
- Persisting data between game sessions
- Synchronizing data in multiplayer environments

### 4. User Experience Focus

The mod prioritizes user experience through:
- Solving a real player pain point
- Using intuitive visual language
- Minimizing configuration requirements

## Implementing Similar Features

If you want to create a mod with similar entity-tracking features, follow these steps:

### Step 1: Identify Target Entities

```lua
-- Find entities of interest
function FindTargetEntities()
    local targets = {}
    
    -- Search through all entities
    for _, v in pairs(Ents) do
        -- Filter by prefab or tag
        if v.prefab == "target_prefab" or v:HasTag("target_tag") then
            table.insert(targets, v)
        end
    end
    
    return targets
end
```

### Step 2: Establish Relationships

```lua
-- Create relationships between entities
function EstablishRelationships(entities)
    local relationships = {}
    
    -- Example: Pair entities by distance
    local assigned = {}
    for i, entity1 in ipairs(entities) do
        if not assigned[entity1] then
            -- Find closest unassigned entity
            local closest = nil
            local closest_dist = math.huge
            
            for j, entity2 in ipairs(entities) do
                if entity1 ~= entity2 and not assigned[entity2] then
                    local dist = entity1:GetDistanceSqToInst(entity2)
                    if dist < closest_dist then
                        closest = entity2
                        closest_dist = dist
                    end
                end
            end
            
            -- Create relationship if found
            if closest then
                table.insert(relationships, {entity1, closest})
                assigned[entity1] = true
                assigned[closest] = true
            end
        end
    end
    
    return relationships
end
```

### Step 3: Create Visual Indicators

```lua
-- Create a visual indicator for an entity
function CreateIndicator(entity, symbol)
    -- Create indicator entity
    local indicator = SpawnPrefab("indicator_prefab")
    
    -- Position above the entity
    local x, y, z = entity.Transform:GetWorldPosition()
    indicator.Transform:SetPosition(x, y + 1.5, z)
    
    -- Set appearance
    indicator.AnimState:OverrideSymbol("symbol", "indicator_symbols", symbol)
    
    -- Link to entity
    entity._indicator = indicator
    indicator.entity:SetParent(entity.entity)
    
    return indicator
end
```

### Step 4: Add Persistence

```lua
-- Save relationship data
function SaveRelationshipData()
    local data = {
        relationships = {},
        symbols = {}
    }
    
    -- Convert to serializable format
    for i, relationship in ipairs(RELATIONSHIPS) do
        data.relationships[i] = {
            relationship[1].GUID,
            relationship[2].GUID
        }
        data.symbols[i] = RELATIONSHIP_SYMBOLS[i]
    end
    
    -- Save to world state
    if TheWorld.components.worldstate then
        TheWorld.components.worldstate:SetValue("relationship_data", data)
    end
end
```

## Conclusion

The Wormhole Marks mod exemplifies excellent mod design through:

1. **Focused Problem-Solving**: Addressing a specific player pain point
2. **Non-Invasive Enhancement**: Adding information without changing gameplay
3. **Technical Excellence**: Implementing robust systems for tracking and visualization
4. **Multiplayer Awareness**: Ensuring consistent experiences across all players

By studying this mod, we can learn how to create mods that enhance the game's usability while respecting its core design. These principles apply to any mod that aims to visualize relationships between game elements. 