---
id: case-geometric
title: Case Study - Geometric Placement
sidebar_position: 11
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Case Study: Geometric Placement Mod

This case study examines the popular "Geometric Placement" mod for Don't Starve Together, which enhances the building system by adding grid-based placement options. We'll analyze its implementation and learn valuable modding techniques.
- [Github](https://github.com/rezecib/Geometric-Placement)
- [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=351325790)

## Mod Overview

The Geometric Placement mod allows players to:
- Place structures on a customizable grid with multiple geometry options
- Align objects precisely with each other
- Create perfectly symmetrical bases
- Toggle between different placement modes using hotkeys
- Customize colors, grid sizes, and visual feedback


## Technical Implementation

### Core Techniques Used

1. **Placement Prediction Modification**
2. **Multiple Geometry Systems**
3. **Visual Feedback System**
4. **Configuration Management**
5. **Performance Optimization**

Let's examine each of these techniques in detail.

## 1. Placement Prediction Modification

The mod works by intercepting and modifying the game's placement prediction system. When a player is about to place an object, the mod calculates a grid-aligned position and updates the placement visualization.

### Key Code Elements

```lua
-- Hook into the placement system with more sophisticated geometry handling
function Placer:GetPreciseGridPoint(geometry, spacing, offset_type, pt)
    local ROW_OFFSET, COL_OFFSET = geometry.row_offset, geometry.col_offset
    local ORIGIN_OFFSET = ORIGIN_OFFSETS[offset_type]
    
    -- Calculate the offset from origin in grid space
    local offx, offz = 0, 0
    if geometry == GEOMETRIES.SQUARE then
        offx = math.floor((pt.x - ORIGIN_OFFSET.x) / spacing + 0.5)
        offz = math.floor((pt.z - ORIGIN_OFFSET.z) / spacing + 0.5)
    else
        -- Handle more complex geometries
        offx, offz = GetGridOffsetForPoint(geometry, pt, spacing)
    end
    
    -- Transform the grid coordinate back to world space
    return COL_OFFSET * spacing * offx + ROW_OFFSET * spacing * offz + ORIGIN_OFFSET
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

## 2. Multiple Geometry Systems

One of the mod's most powerful features is its support for multiple grid geometries, including:
- Square (standard grid)
- Diamond (rotated square)
- X-Hexagon (hexagons aligned with x-axis)
- Z-Hexagon (hexagons aligned with z-axis)
- Flat Hexagon (flat-topped hexagons)
- Pointy Hexagon (pointy-topped hexagons)

### Key Code Elements

```lua
-- Implementation of different geometry systems
local sqrt2_over_2 = math.sqrt(2)*0.5
local sqrt3_over_2 = math.sqrt(3)*0.5
local GEOMETRIES = {
    SQUARE = {
        GetRowRange = function(grid_size)
            return -grid_size, grid_size
        end,
        GetColRangeForRow = function(row, grid_size)
            return -grid_size, grid_size
        end,
        HasOverlap = function(dx, dz, grid_size)
            return not(math.abs(dx) > grid_size*2 or math.abs(dz) > grid_size*2)
        end,
        col_offset = Vector3(1, 0, 0),
        row_offset = Vector3(0, 0, 1),
        gridplacer_rotation = 0,
    },
    X_HEXAGON = {
        GetRowRange = function(grid_size)
            return -grid_size, grid_size
        end,
        GetColRangeForRow = function(row, grid_size)
            local is_odd = math.abs(row % 2) > 0
            local row_start = -grid_size
            if is_odd then row_start = row_start - 0.5 end
            return row_start, grid_size + (is_odd and 0.5 or 0)
        end,
        HasOverlap = function(dx, dz, grid_size)
            -- Hexagonal overlap check
            return not(math.abs(dx) > grid_size*2 or math.abs(dz) > grid_size*2)
        end,
        col_offset = Vector3(1, 0, 0),
        row_offset = Vector3(0.5, 0, sqrt3_over_2),
        gridplacer_rotation = 0,
    },
    -- Additional geometries defined similarly
}
```

### Implementation Analysis

The geometry system demonstrates:

1. **Mathematical precision**: Applying geometric transformations to create different grid patterns
2. **Abstracted coordinate systems**: Converting between lattice space and world space
3. **Modular design**: Each geometry is defined with its own transformation functions
4. **Visual differentiation**: Different grid patterns provide unique building aesthetics

## 3. Visual Feedback System

To help users understand the grid system, the mod provides visual feedback by:
- Displaying grid points when placing objects
- Highlighting valid/invalid placement positions with configurable colors
- Creating visual distinctions between placement types (buildings, walls, farm tiles)

### Key Code Elements

```lua
function Placer:BuildGridPoint(bgx, bgz, bgpt, bgp)
    if bgp == nil then
        bgp = SpawnPrefab(self.placertype)
        bgp.Transform:SetRotation(self.geometry.gridplacer_rotation)
    end
    self.build_grid[bgx][bgz] = bgp
    self.build_grid_positions[bgx][bgz] = bgpt
    bgp.Transform:SetPosition(bgpt:Get())
    table.insert(self.refresh_queue, {bgx, bgz})
end

function Placer:RefreshGridPoint(bgx, bgz)
    local row = self.build_grid[bgx]
    if row == nil then return end
    local bgp = row[bgz]
    if bgp == nil then return end
    local bgpt = self.build_grid_positions[bgx][bgz]
    local can_build = self:TestPoint(bgp, bgpt)
    local color = can_build and COLORS.GOOD or COLORS.BAD
    if self.snap_to_tile then
        color = can_build and COLORS.GOODTILE or COLORS.BADTILE
        bgp.AnimState:SetSortOrder(can_build and 1 or 0)
    end
    if color == "hidden" then
        bgp:Hide()
    else
        bgp:Show()
        if color == "on" or color == "off" then
            bgp.AnimState:PlayAnimation(color, true)
            bgp.AnimState:SetAddColour(0, 0, 0, 0)
        else
            bgp.AnimState:PlayAnimation("anim", true)
            bgp.AnimState:SetAddColour(color.x, color.y, color.z, 1)
        end
    end
end
```

### Implementation Analysis

The visual feedback system demonstrates:

1. **Dynamic entity creation**: Spawning visual markers as needed
2. **Efficient recycling**: Reusing existing entities for better performance
3. **Visual styling**: Setting colors and transparency for UI elements
4. **Cleanup management**: Properly removing elements when no longer needed

## 4. Configuration Management

The mod provides extensive customization options through both a configuration menu and in-game toggles.

### Key Code Elements

```lua
-- Excerpt from modinfo.lua showing configuration options
configuration_options = {
    {
        name = "CTRL",
        label = "CTRL Turns Mod",
        options = {
            {description = "On", data = true},
            {description = "Off", data = false},
        },
        default = false,
        hover = "Whether holding CTRL enables or disables the mod.",
    },
    {
        name = "KEYBOARDTOGGLEKEY",
        label = "Options Button",
        options = keyslist, -- List of keyboard keys
        default = "B",
        hover = "A key to open the mod's options. On controllers, open\nthe scoreboard and then use Menu Misc 3 (left stick click). When set to None, controller is also unbound.",
    },    
    {
        name = "GEOMETRY",
        label = "Grid Geometry",
        options = {
            {description = "Square", data = "SQUARE"},
            {description = "Diamond", data = "DIAMOND"},
            {description = "X Hexagon", data = "X_HEXAGON"},
            {description = "Z Hexagon", data = "Z_HEXAGON"},
            {description = "Flat Hexagon", data = "FLAT_HEXAGON"},
            {description = "Pointy Hexagon", data = "POINTY_HEXAGON"},
        },
        default = "SQUARE",    
        hover = "What build grid geometry to use.",
    },
    -- Many more options for grid sizes, colors, etc.
}

-- Loading and applying configuration
local CTRL = GetConfig("CTRL", false, "boolean")
local GEOMETRY_NAME = GetConfig("GEOMETRY", "SQUARE", function(g) return GEOMETRIES[g] ~= nil end)
local SMALLGRIDSIZE = GetConfig("SMALLGRIDSIZE", 10, "number")
```

### Implementation Analysis

The configuration system shows:

1. **User-friendly options**: Descriptive labels and helpful hover text
2. **Sensible defaults**: Pre-configured for immediate usability
3. **Type validation**: Ensuring configuration values have the correct data type
4. **Runtime configuration**: Both startup and in-game configuration options

## 5. Performance Optimization

The mod implements several optimizations to ensure it doesn't impact game performance.

### Key Code Elements

```lua
function Placer:RefreshBuildGrid(time_remaining) --if not time_remaining, then config was set to no limit
    if time_remaining then
        if time_remaining < 0 then return end --we were over time already (common on generation updates)
        -- we only have 1ms accuracy, so subtract off a ms
        time_remaining = time_remaining - 0.001
    end
    local refresh_start = os.clock()
    local refresh_queue_size = #self.refresh_queue
    for i = 1, refresh_queue_size do
        if time_remaining and i%20 == 0 then
            if os.clock() - refresh_start > time_remaining then
                return
            end
        end
        self:RefreshGridPoint(unpack(table.remove(self.refresh_queue)))
    end
end
```

### Implementation Analysis

The performance optimizations demonstrate:

1. **Time budget system**: Limiting processing time to prevent frame rate drops
2. **Incremental updates**: Processing grid points in batches
3. **Prioritized visual feedback**: Updating the most relevant grid points first
4. **Efficient calculations**: Using optimized math operations
5. **Memory recycling**: Reusing existing entities when possible

## Lessons Learned

From analyzing the Geometric Placement mod, we can extract several valuable lessons for mod development:

### 1. Non-Invasive Modification

The mod demonstrates how to modify game behavior without replacing entire systems. By hooking into specific functions, it maintains compatibility with other mods and future game updates.

### 2. User Experience Focus

The mod prioritizes user experience through:
- Clear visual feedback with customizable colors
- Multiple grid geometries for different building styles
- Intuitive controls with configurable key bindings
- Helpful status indicators and toggle options

### 3. Performance Consciousness

Despite adding visual elements and calculations, the mod maintains good performance by:
- Using a time budget system to prevent frame drops
- Processing updates incrementally
- Recycling grid point entities
- Limiting visual updates to what's necessary

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
    local indicator = SpawnPrefab("buildgridplacer")
    
    indicator.Transform:SetPosition(pos.x, pos.y, pos.z)
    if type(color) == "table" then
        indicator.AnimState:SetAddColour(color.x, color.y, color.z, 1)
    end
    
    -- Ensure proper cleanup
    indicator:DoTaskInTime(30, function() 
        if indicator:IsValid() then
            indicator:Remove() 
        end
    end)
    
    return indicator
end
```

### Step 4: Implement User Controls

```lua
-- Set up user controls
function SetupControls()
    -- Define toggle function
    local function TogglePlacementMode()
        GEOMETRY_INDEX = (GEOMETRY_INDEX % #GEOMETRY_OPTIONS) + 1
        local new_geometry = GEOMETRY_OPTIONS[GEOMETRY_INDEX]
        SetGeometry(new_geometry)
        
        -- Update UI
        if ANNOUNCE_CHANGES then
            Announcement("Grid Geometry: " .. new_geometry)
        end
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

## Cross-References and Related Documentation

- Learn more about the [components system](/docs/api-vanilla/components) that this mod interacts with
- Explore [stategraphs](/docs/api-vanilla/stategraphs) for understanding game state handling
- Check out [prefab creation](/docs/api-vanilla/prefabs) to learn how the grid visuals are implemented
- See [world manipulation](/docs/api-vanilla/world) documentation for understanding grid placement mechanics
- Review [UI events and input handling](/docs/api-vanilla/core/ui-events) to learn how to capture and process key presses

## Conclusion

The Geometric Placement mod exemplifies excellent mod design through:

1. **Thoughtful integration** with the game's existing systems
2. **Intuitive user interface** that enhances rather than complicates
3. **Performance-conscious implementation** that minimizes impact
4. **Flexible configuration** that adapts to user preferences

By studying this mod, we can learn how to create mods that enhance the game experience while maintaining compatibility and performance. These principles apply not just to placement mods, but to any mod that modifies core game systems. 
