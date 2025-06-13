---
id: case-geometric
title: Case Study - Geometric Placement
sidebar_position: 11
---

# Case Study: Geometric Placement Mod

This case study examines the popular "Geometric Placement" mod for Don't Starve Together, which enhances the building system by adding grid-based placement options. We'll analyze its implementation and learn valuable modding techniques.

## Mod Overview

The Geometric Placement mod allows players to:
- Place structures on a customizable grid
- Align objects precisely with each other
- Create perfectly symmetrical bases
- Toggle between different placement modes

![Geometric Placement Example](https://images.steamusercontent.com/ugc/278474310944194293/801E1F603CA5F5B800D81EC604A882B5C7A3E180/?imw=268&imh=268&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true)

## Technical Implementation

### Core Techniques Used

1. **Placement Prediction Modification**
2. **Custom Input Handling**
3. **Visual Feedback System**
4. **Configuration Management**
5. **Performance Optimization**

Let's examine each of these techniques in detail.

## 1. Placement Prediction Modification

The mod works by intercepting and modifying the game's placement prediction system. When a player is about to place an object, the mod calculates a grid-aligned position and updates the placement visualization.

### Key Code Elements

```lua
-- Hook into the placement system
local OldGetPlacementPosition = GetPlayer().components.placer.GetPlacementPosition
GetPlayer().components.placer.GetPlacementPosition = function(self)
    -- Get original position
    local pt = OldGetPlacementPosition(self)
    
    -- Skip grid alignment if disabled or in certain cases
    if not GEOMETRIC_PLACEMENT_ENABLED or SKIP_PLACEMENT_ADJUSTMENT then
        return pt
    end
    
    -- Calculate grid-aligned position
    local grid_size = GetGridSize()
    local aligned_x = math.floor((pt.x + grid_size/2) / grid_size) * grid_size
    local aligned_z = math.floor((pt.z + grid_size/2) / grid_size) * grid_size
    
    -- Return adjusted position
    return Vector3(aligned_x, pt.y, aligned_z)
end
```

### Implementation Analysis

The mod uses a technique called "function hooking" to modify the game's behavior without changing the original code. This is done by:

1. Storing a reference to the original function
2. Replacing it with a custom function that:
   - Calls the original function to get the base result
   - Applies custom logic to modify the result
   - Returns the modified result

This approach is powerful because it:
- Preserves compatibility with other mods
- Allows toggling the functionality on/off
- Maintains the original behavior when needed

## 2. Custom Input Handling

The mod implements custom key bindings to toggle different placement modes and grid sizes.

### Key Code Elements

```lua
-- Define key handlers
local function OnKeyUp(key)
    if key == KEY_G then
        -- Toggle geometric placement
        GEOMETRIC_PLACEMENT_ENABLED = not GEOMETRIC_PLACEMENT_ENABLED
        UpdatePlacementModeText()
    elseif key == KEY_F then
        -- Cycle through grid sizes
        CURRENT_GRID_SIZE_INDEX = (CURRENT_GRID_SIZE_INDEX % #GRID_SIZES) + 1
        UpdateGridSizeText()
    elseif key == KEY_V then
        -- Toggle snap to geometry
        SNAP_TO_GEOMETRY = not SNAP_TO_GEOMETRY
        UpdateSnapModeText()
    end
end

-- Register key handler
TheInput:AddKeyUpHandler(KEY_G, OnKeyUp)
TheInput:AddKeyUpHandler(KEY_F, OnKeyUp)
TheInput:AddKeyUpHandler(KEY_V, OnKeyUp)
```

### Implementation Analysis

The mod uses the game's input system to capture key presses and toggle different modes. This demonstrates:

1. **Effective use of the input system**: Registering handlers for specific keys
2. **State management**: Using global variables to track current modes
3. **User feedback**: Updating UI text to reflect current settings

## 3. Visual Feedback System

To help users understand the grid system, the mod provides visual feedback by:
- Displaying grid lines when placing objects
- Highlighting the current placement cell
- Showing alignment guides for nearby structures

### Key Code Elements

```lua
-- Create grid visualization
function CreateGridOverlay(placer)
    if GRID_OVERLAY then
        GRID_OVERLAY:Remove()
    end
    
    -- Create a new entity for the grid
    local grid = SpawnPrefab("gridoverlay")
    
    -- Set up the grid appearance
    local grid_size = GetGridSize()
    local grid_range = 10 -- How many cells to show
    
    -- Set up grid lines
    for x = -grid_range, grid_range do
        for z = -grid_range, grid_range do
            local line = SpawnPrefab("gridline")
            line.Transform:SetPosition(x * grid_size, 0, z * grid_size)
            line.AnimState:SetMultColour(0.3, 0.3, 0.3, 0.3)
            line:AddTag("gridline")
            grid:AddChild(line)
        end
    end
    
    -- Position the grid at the player
    local pt = placer:GetPosition()
    grid.Transform:SetPosition(pt.x, 0, pt.z)
    
    GRID_OVERLAY = grid
    return grid
end
```

### Implementation Analysis

The visual feedback system demonstrates:

1. **Dynamic entity creation**: Spawning visual elements as needed
2. **Parent-child relationships**: Using AddChild to manage related entities
3. **Visual styling**: Setting colors and transparency for UI elements
4. **Cleanup management**: Removing old elements when creating new ones

## 4. Configuration Management

The mod allows users to customize various aspects of the grid system through a configuration menu.

### Key Code Elements

```lua
-- Configuration options in modinfo.lua
configuration_options = {
    {
        name = "GRID_SIZE",
        label = "Grid Size",
        options = {
            {description = "Extra Small (0.5)", data = 0.5},
            {description = "Small (1)", data = 1},
            {description = "Medium (2)", data = 2},
            {description = "Large (4)", data = 4},
            {description = "Extra Large (8)", data = 8}
        },
        default = 2
    },
    {
        name = "CONTROLLER_MODE",
        label = "Controller Compatibility",
        options = {
            {description = "Enabled", data = true},
            {description = "Disabled", data = false}
        },
        default = true
    },
    -- More options...
}

-- Loading configuration in modmain.lua
local GRID_SIZE = GetModConfigData("GRID_SIZE")
local CONTROLLER_MODE = GetModConfigData("CONTROLLER_MODE")
```

### Implementation Analysis

The configuration system shows:

1. **User-friendly options**: Descriptive labels and sensible defaults
2. **Data typing**: Using appropriate data types for each option
3. **Runtime configuration**: Loading and applying settings when the mod starts

## 5. Performance Optimization

The mod implements several optimizations to ensure it doesn't impact game performance.

### Key Code Elements

```lua
-- Efficient grid calculation
function GetGridPoint(pt)
    -- Cache grid size to avoid repeated lookups
    local grid_size = GetGridSize()
    
    -- Use math.floor instead of rounding for better performance
    local x = math.floor((pt.x + grid_size/2) / grid_size) * grid_size
    local z = math.floor((pt.z + grid_size/2) / grid_size) * grid_size
    
    return Vector3(x, pt.y, z)
end

-- Throttle visual updates
local last_update_time = 0
function UpdateGridVisuals(placer)
    local current_time = GetTime()
    
    -- Only update visuals every 0.1 seconds
    if current_time - last_update_time < 0.1 then
        return
    end
    
    -- Update grid position
    if GRID_OVERLAY then
        local pt = placer:GetPosition()
        GRID_OVERLAY.Transform:SetPosition(pt.x, 0, pt.z)
    end
    
    last_update_time = current_time
end
```

### Implementation Analysis

The performance optimizations demonstrate:

1. **Throttling updates**: Limiting visual updates to reduce CPU usage
2. **Efficient calculations**: Using fast math operations
3. **Conditional processing**: Only performing work when necessary
4. **Memory management**: Creating visual elements only when needed

## Lessons Learned

From analyzing the Geometric Placement mod, we can extract several valuable lessons for mod development:

### 1. Non-Invasive Modification

The mod demonstrates how to modify game behavior without replacing entire systems. By hooking into specific functions, it maintains compatibility with other mods and future game updates.

### 2. User Experience Focus

The mod prioritizes user experience through:
- Clear visual feedback
- Intuitive controls
- Customizable options
- Helpful status indicators

### 3. Performance Consciousness

Despite adding visual elements and calculations, the mod maintains good performance by:
- Throttling updates
- Using efficient algorithms
- Managing memory carefully
- Avoiding unnecessary operations

### 4. Progressive Enhancement

The mod follows a progressive enhancement approach:
- Basic functionality works without configuration
- Advanced features are optional
- Users can customize the experience to their needs
- Default settings provide a good starting point

## Implementing Similar Features

If you want to create a mod with similar placement enhancement features, follow these steps:

### Step 1: Study the Placement System

```lua
-- Understand how the game's placement system works
function AnalyzePlacementSystem()
    -- Find the component responsible for placement
    local placer_component = GetPlayer().components.placer
    
    -- Log its methods and properties
    for k, v in pairs(placer_component) do
        print(k, type(v))
    end
    
    -- Monitor placement events
    GetPlayer():ListenForEvent("onbuildstructure", function(inst, data)
        print("Structure built:", data.item.prefab)
        print("Position:", data.pos.x, data.pos.y, data.pos.z)
    end)
end
```

### Step 2: Create a Basic Placement Hook

```lua
-- Create a simple hook to modify placement
function SetupPlacementHook()
    local player = GetPlayer()
    if not player or not player.components.placer then return end
    
    -- Store original function
    local original_fn = player.components.placer.GetPlacementPosition
    
    -- Replace with custom function
    player.components.placer.GetPlacementPosition = function(self)
        -- Get original position
        local pos = original_fn(self)
        
        -- Apply your modifications
        -- Example: Round to nearest whole number
        pos.x = math.floor(pos.x + 0.5)
        pos.z = math.floor(pos.z + 0.5)
        
        return pos
    end
end
```

### Step 3: Add Visual Feedback

```lua
-- Create visual indicators for placement
function CreatePlacementIndicator(pos, color)
    local indicator = SpawnPrefab("gridpoint")
    
    indicator.Transform:SetPosition(pos.x, pos.y, pos.z)
    indicator.AnimState:SetMultColour(color.r, color.g, color.b, color.a)
    
    -- Auto-remove after a short time
    indicator:DoTaskInTime(1, function() indicator:Remove() end)
    
    return indicator
end
```

### Step 4: Implement User Controls

```lua
-- Set up user controls
function SetupControls()
    -- Define toggle function
    local function TogglePlacementMode()
        PLACEMENT_MODE = (PLACEMENT_MODE % 3) + 1
        
        -- Update UI
        local mode_names = {"Grid", "Geometry", "Free"}
        Announcement("Placement Mode: " .. mode_names[PLACEMENT_MODE])
    end
    
    -- Register key handler
    TheInput:AddKeyHandler(function(key, down)
        if key == KEY_G and not down then
            TogglePlacementMode()
            return true -- Consume the input
        end
        return false
    end)
end
```

## Conclusion

The Geometric Placement mod exemplifies excellent mod design through:

1. **Thoughtful integration** with the game's existing systems
2. **Intuitive user interface** that enhances rather than complicates
3. **Performance-conscious implementation** that minimizes impact
4. **Flexible configuration** that adapts to user preferences

By studying this mod, we can learn how to create mods that enhance the game experience while maintaining compatibility and performance. These principles apply not just to placement mods, but to any mod that modifies core game systems. 