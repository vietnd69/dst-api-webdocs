---
id: case-status
title: Case Study - Combined Status
sidebar_position: 13
---

# Case Study: Combined Status Mod

This case study examines the "Combined Status" mod for Don't Starve Together, which enhances the player status display with additional information. We'll analyze its implementation and extract valuable modding techniques for UI enhancement.

## Mod Overview

The Combined Status mod addresses a common player need: having more information readily visible on the screen. The mod:

- Combines temperature, season, and world day information into a compact display
- Shows numerical values for health, hunger, and sanity
- Displays exact durability percentages for equipped items
- Adds moon phase indicators and clock
- Maintains the game's visual style while adding functionality

## Technical Implementation

### Core Techniques Used

1. **UI Widget Creation and Positioning**
2. **Status Data Collection**
3. **Dynamic UI Updates**
4. **Configuration System**
5. **Performance Optimization**

Let's examine each of these techniques in detail.

## 1. UI Widget Creation and Positioning

The mod creates custom UI elements that match the game's visual style while providing additional information.

### Key Code Elements

```lua
-- Create the main status display widget
local function CreateStatusDisplay(owner)
    -- Create the root widget
    local root = owner.HUD.controls.top_root:AddChild(Widget("CombinedStatus"))
    root:SetVAnchor(ANCHOR_TOP)
    root:SetHAnchor(ANCHOR_LEFT)
    root:SetPosition(CONFIG.POSITION_X, CONFIG.POSITION_Y, 0)
    
    -- Create the background
    local background = root:AddChild(Image("images/status_bg.xml", "status_bg.tex"))
    background:SetScale(0.7, 0.7, 0.7)
    
    -- Add temperature display
    local temp = root:AddChild(Widget("temperature"))
    temp:SetPosition(25, -25, 0)
    
    local temp_icon = temp:AddChild(Image("images/temperature.xml", "temperature.tex"))
    temp_icon:SetScale(0.5, 0.5, 0.5)
    
    local temp_text = temp:AddChild(Text(NUMBERFONT, 28))
    temp_text:SetPosition(25, 0, 0)
    temp_text:SetString("0°C")
    
    -- Add more UI elements...
    
    -- Store references to update later
    root.temp_text = temp_text
    
    return root
end
```

### Implementation Analysis

The UI creation system demonstrates:

1. **Widget Hierarchy**: Creating a structured UI with parent-child relationships
2. **Anchoring**: Using anchors to position UI elements relative to screen edges
3. **Visual Styling**: Matching the game's art style with appropriate assets
4. **Component Organization**: Grouping related elements into sub-widgets
5. **Reference Management**: Storing references to elements that need updating

## 2. Status Data Collection

The mod needs to gather various types of data from different game systems to display in the UI.

### Key Code Elements

```lua
-- Collect player status data
local function GetPlayerStatus(player)
    if not player then return {} end
    
    local status = {}
    
    -- Get health data
    if player.components.health then
        status.health = {
            current = math.floor(player.components.health.currenthealth),
            max = math.floor(player.components.health.maxhealth),
            percent = player.components.health:GetPercent()
        }
    end
    
    -- Get hunger data
    if player.components.hunger then
        status.hunger = {
            current = math.floor(player.components.hunger.current),
            max = math.floor(player.components.hunger.max),
            percent = player.components.hunger:GetPercent()
        }
    end
    
    -- Get sanity data
    if player.components.sanity then
        status.sanity = {
            current = math.floor(player.components.sanity.current),
            max = math.floor(player.components.sanity.max),
            percent = player.components.sanity:GetPercent()
        }
    end
    
    -- Get temperature
    if player.components.temperature then
        status.temperature = math.floor(player.components.temperature:GetCurrent())
        status.is_freezing = player.components.temperature:IsFreezing()
        status.is_overheating = player.components.temperature:IsOverheating()
    end
    
    -- Get equipped items
    status.equipped = {}
    if player.components.inventory then
        for k, v in pairs(EQUIPSLOTS) do
            local item = player.components.inventory:GetEquippedItem(v)
            if item then
                local data = {
                    prefab = item.prefab,
                    name = item:GetDisplayName()
                }
                
                -- Get durability if available
                if item.components.finiteuses then
                    data.durability = item.components.finiteuses:GetPercent()
                elseif item.components.armor then
                    data.durability = item.components.armor:GetPercent()
                elseif item.components.fueled then
                    data.durability = item.components.fueled:GetPercent()
                end
                
                status.equipped[v] = data
            end
        end
    end
    
    return status
end

-- Collect world status data
local function GetWorldStatus()
    if not TheWorld then return {} end
    
    local status = {}
    
    -- Get season info
    if TheWorld.components.seasons then
        status.season = TheWorld.components.seasons:GetSeason()
        status.days_left = TheWorld.components.seasons:GetDaysLeftInSeason()
        status.days_elapsed = TheWorld.components.seasons:GetSeasonLength() - status.days_left
    end
    
    -- Get time of day
    if TheWorld.components.clock then
        status.time = TheWorld.components.clock:GetTimeString()
        status.day = TheWorld.components.clock:GetNumCycles() + 1
        status.phase = TheWorld.components.clock:GetPhase()
        status.remaining_daylight = TheWorld.components.clock:GetTimeUntilPhase("dusk")
    end
    
    -- Get moon phase
    if TheWorld.components.worldstate then
        status.moon_phase = TheWorld.components.worldstate:GetMoonPhase()
    end
    
    return status
end
```

### Implementation Analysis

The data collection system demonstrates:

1. **Component Access**: Safely accessing various game components
2. **Defensive Programming**: Checking for component existence before accessing
3. **Data Transformation**: Converting raw values to display-friendly formats
4. **Comprehensive Coverage**: Gathering data from both player and world sources
5. **Structured Organization**: Organizing related data into logical groups

## 3. Dynamic UI Updates

The mod updates the UI elements in response to changes in the game state.

### Key Code Elements

```lua
-- Update the status display
local function UpdateStatusDisplay(widget, player_status, world_status)
    -- Update temperature
    if widget.temp_text and player_status.temperature then
        local temp = player_status.temperature
        local color = NORMAL_COLOR
        
        -- Set color based on temperature state
        if player_status.is_freezing then
            color = COLD_COLOR
        elseif player_status.is_overheating then
            color = HOT_COLOR
        end
        
        widget.temp_text:SetString(string.format("%d°C", temp))
        widget.temp_text:SetColor(color)
    end
    
    -- Update health display
    if widget.health_text and player_status.health then
        local health = player_status.health
        widget.health_text:SetString(string.format("%d / %d", health.current, health.max))
        
        -- Update health bar
        if widget.health_bar then
            widget.health_bar:SetPercent(health.percent)
        end
    end
    
    -- Update hunger display
    if widget.hunger_text and player_status.hunger then
        local hunger = player_status.hunger
        widget.hunger_text:SetString(string.format("%d / %d", hunger.current, hunger.max))
        
        -- Update hunger bar
        if widget.hunger_bar then
            widget.hunger_bar:SetPercent(hunger.percent)
        end
    end
    
    -- Update sanity display
    if widget.sanity_text and player_status.sanity then
        local sanity = player_status.sanity
        widget.sanity_text:SetString(string.format("%d / %d", sanity.current, sanity.max))
        
        -- Update sanity bar
        if widget.sanity_bar then
            widget.sanity_bar:SetPercent(sanity.percent)
        end
    end
    
    -- Update season and day display
    if widget.season_text and world_status.season then
        local season_name = STRINGS.UI.SERVERLISTINGSCREEN.SEASONS[string.upper(world_status.season)]
        widget.season_text:SetString(season_name)
        
        -- Update season icon
        if widget.season_icon then
            widget.season_icon:SetTexture("images/seasons.xml", world_status.season .. ".tex")
        end
    end
    
    if widget.day_text and world_status.day then
        widget.day_text:SetString(string.format(STRINGS.UI.HUD.DAY, world_status.day))
    end
    
    -- Update clock
    if widget.clock_text and world_status.time then
        widget.clock_text:SetString(world_status.time)
    end
    
    -- Update moon phase
    if widget.moon_icon and world_status.moon_phase then
        widget.moon_icon:SetTexture("images/moon_phases.xml", "moon_phase_" .. world_status.moon_phase .. ".tex")
    end
    
    -- Update equipped items
    if widget.equipped and player_status.equipped then
        for slot, item_widget in pairs(widget.equipped) do
            local item = player_status.equipped[slot]
            
            if item and item_widget.durability and item.durability then
                -- Show durability percentage
                item_widget.durability:SetString(string.format("%d%%", math.floor(item.durability * 100)))
                
                -- Set color based on durability
                local color = NORMAL_COLOR
                if item.durability < 0.1 then
                    color = DANGER_COLOR
                elseif item.durability < 0.3 then
                    color = WARNING_COLOR
                end
                item_widget.durability:SetColor(color)
            else
                -- Hide durability text if no item or no durability
                if item_widget.durability then
                    item_widget.durability:SetString("")
                end
            end
        end
    end
end
```

### Implementation Analysis

The UI update system demonstrates:

1. **Conditional Updates**: Only updating elements when data is available
2. **Visual Feedback**: Using colors to indicate status conditions
3. **Formatting**: Formatting numerical values for readability
4. **Localization Support**: Using game strings for localized text
5. **Dynamic Visuals**: Changing textures based on game state

## 4. Configuration System

The mod provides options for users to customize the display according to their preferences.

### Key Code Elements

```lua
-- Configuration options in modinfo.lua
configuration_options = {
    {
        name = "POSITION",
        label = "Display Position",
        options = {
            {description = "Top Left", data = "topleft"},
            {description = "Top Right", data = "topright"},
            {description = "Bottom Left", data = "bottomleft"},
            {description = "Bottom Right", data = "bottomright"},
            {description = "Center Top", data = "centertop"},
            {description = "Center Bottom", data = "centerbottom"}
        },
        default = "topleft"
    },
    {
        name = "SHOW_NUMERICAL",
        label = "Show Numerical Values",
        options = {
            {description = "Yes", data = true},
            {description = "No", data = false}
        },
        default = true
    },
    {
        name = "SHOW_DURABILITY",
        label = "Show Item Durability",
        options = {
            {description = "Always", data = "always"},
            {description = "When Low", data = "low"},
            {description = "Never", data = "never"}
        },
        default = "always"
    },
    {
        name = "UPDATE_INTERVAL",
        label = "Update Frequency",
        options = {
            {description = "Very High (0.1s)", data = 0.1},
            {description = "High (0.25s)", data = 0.25},
            {description = "Normal (0.5s)", data = 0.5},
            {description = "Low (1s)", data = 1}
        },
        default = 0.5
    }
}

-- Apply configuration in modmain.lua
local function ApplyConfiguration()
    CONFIG = {
        POSITION = GetModConfigData("POSITION"),
        SHOW_NUMERICAL = GetModConfigData("SHOW_NUMERICAL"),
        SHOW_DURABILITY = GetModConfigData("SHOW_DURABILITY"),
        UPDATE_INTERVAL = GetModConfigData("UPDATE_INTERVAL")
    }
    
    -- Calculate position based on configuration
    if CONFIG.POSITION == "topleft" then
        CONFIG.POSITION_X = 10
        CONFIG.POSITION_Y = -10
    elseif CONFIG.POSITION == "topright" then
        CONFIG.POSITION_X = -10
        CONFIG.POSITION_Y = -10
        CONFIG.ALIGNMENT = "right"
    elseif CONFIG.POSITION == "bottomleft" then
        CONFIG.POSITION_X = 10
        CONFIG.POSITION_Y = 10
        CONFIG.ANCHOR_V = ANCHOR_BOTTOM
    elseif CONFIG.POSITION == "bottomright" then
        CONFIG.POSITION_X = -10
        CONFIG.POSITION_Y = 10
        CONFIG.ANCHOR_V = ANCHOR_BOTTOM
        CONFIG.ALIGNMENT = "right"
    elseif CONFIG.POSITION == "centertop" then
        CONFIG.POSITION_X = 0
        CONFIG.POSITION_Y = -10
        CONFIG.ANCHOR_H = ANCHOR_MIDDLE
        CONFIG.ALIGNMENT = "center"
    elseif CONFIG.POSITION == "centerbottom" then
        CONFIG.POSITION_X = 0
        CONFIG.POSITION_Y = 10
        CONFIG.ANCHOR_V = ANCHOR_BOTTOM
        CONFIG.ANCHOR_H = ANCHOR_MIDDLE
        CONFIG.ALIGNMENT = "center"
    end
end
```

### Implementation Analysis

The configuration system demonstrates:

1. **User-Friendly Options**: Providing clear descriptions for each option
2. **Appropriate Defaults**: Setting sensible default values
3. **Option Categories**: Organizing options by functionality
4. **Configuration Application**: Transforming user settings into usable values
5. **Derived Settings**: Calculating additional settings based on user choices

## 5. Performance Optimization

The mod includes optimizations to ensure it doesn't impact game performance.

### Key Code Elements

```lua
-- Optimized update function
local function InitializeStatusUpdates(widget)
    -- Store last values to avoid unnecessary updates
    local last_player_status = {}
    local last_world_status = {}
    
    -- Create periodic update task
    return player:DoPeriodicTask(CONFIG.UPDATE_INTERVAL, function()
        -- Only collect data if widget exists and is visible
        if not widget or not widget.shown then return end
        
        -- Collect current status data
        local player_status = GetPlayerStatus(player)
        local world_status = GetWorldStatus()
        
        -- Check if anything has changed
        local player_changed = HasChanges(player_status, last_player_status)
        local world_changed = HasChanges(world_status, last_world_status)
        
        -- Only update if something changed
        if player_changed or world_changed then
            UpdateStatusDisplay(widget, player_status, world_status)
            
            -- Store current values for next comparison
            last_player_status = DeepCopy(player_status)
            last_world_status = DeepCopy(world_status)
        end
    end)
end

-- Helper function to check if data has changed
local function HasChanges(new_data, old_data)
    -- Quick check for nil or different types
    if type(new_data) ~= type(old_data) then
        return true
    end
    
    -- Handle non-table types
    if type(new_data) ~= "table" then
        return new_data ~= old_data
    end
    
    -- Check if any keys in new_data are different from old_data
    for k, v in pairs(new_data) do
        if type(v) == "table" then
            if HasChanges(v, old_data[k]) then
                return true
            end
        elseif old_data[k] == nil or v ~= old_data[k] then
            return true
        end
    end
    
    -- Check if any keys in old_data are missing from new_data
    for k, v in pairs(old_data) do
        if new_data[k] == nil then
            return true
        end
    end
    
    return false
end
```

### Implementation Analysis

The performance optimization demonstrates:

1. **Conditional Updates**: Only updating the UI when data changes
2. **Update Frequency Control**: Allowing users to adjust update frequency
3. **Visibility Checks**: Skipping updates when UI is not visible
4. **Change Detection**: Efficiently detecting changes in complex data structures
5. **Memory Management**: Properly storing and comparing previous states

## Lessons Learned

From analyzing the Combined Status mod, we can extract several valuable lessons for UI mod development:

### 1. Non-Intrusive UI Design

The mod demonstrates how to:
- Add information without cluttering the screen
- Maintain the game's visual style
- Position UI elements to avoid interfering with gameplay

### 2. Efficient Data Collection

The mod shows good practices for:
- Safely accessing game components
- Organizing data collection in logical functions
- Transforming raw data into display-friendly formats

### 3. User-Centered Configuration

The mod prioritizes user experience through:
- Providing meaningful configuration options
- Setting sensible defaults
- Allowing users to customize according to their preferences

### 4. Performance Awareness

Despite adding UI elements and collecting data, the mod maintains good performance by:
- Only updating when necessary
- Allowing users to control update frequency
- Efficiently detecting changes

## Implementing Similar Features

If you want to create a mod with similar status display features, follow these steps:

### Step 1: Plan Your UI Layout

```lua
-- Define what information you want to display
local STATUS_ELEMENTS = {
    {id = "health", type = "stat", component = "health"},
    {id = "hunger", type = "stat", component = "hunger"},
    {id = "sanity", type = "stat", component = "sanity"},
    {id = "temperature", type = "value", component = "temperature"},
    {id = "season", type = "world", source = "seasons"},
    {id = "day", type = "world", source = "clock"},
    {id = "time", type = "world", source = "clock"}
}

-- Plan the visual layout
local LAYOUT = {
    rows = 3,
    columns = 2,
    spacing = {x = 100, y = 30},
    position = {x = 10, y = -10}
}
```

### Step 2: Create Basic UI Structure

```lua
-- Create a basic status display
function CreateBasicStatusDisplay(player)
    -- Create root widget
    local root = player.HUD.controls:AddChild(Widget("StatusDisplay"))
    root:SetVAnchor(ANCHOR_TOP)
    root:SetHAnchor(ANCHOR_LEFT)
    root:SetPosition(LAYOUT.position.x, LAYOUT.position.y, 0)
    
    -- Create background
    local bg = root:AddChild(Image("images/ui_elements.xml", "status_bg.tex"))
    bg:SetScale(0.8, 0.8, 0.8)
    
    -- Create element containers
    root.elements = {}
    
    -- Create individual status elements
    for i, element in ipairs(STATUS_ELEMENTS) do
        local row = math.floor((i-1) / LAYOUT.columns)
        local col = (i-1) % LAYOUT.columns
        
        local pos_x = col * LAYOUT.spacing.x
        local pos_y = -row * LAYOUT.spacing.y
        
        local widget = CreateStatusElement(element.id, element.type)
        widget:SetPosition(pos_x, pos_y, 0)
        
        root:AddChild(widget)
        root.elements[element.id] = widget
    end
    
    return root
end

-- Create individual status element
function CreateStatusElement(id, type)
    local widget = Widget(id)
    
    -- Create icon
    local icon = widget:AddChild(Image("images/status_icons.xml", id .. ".tex"))
    icon:SetScale(0.5, 0.5, 0.5)
    icon:SetPosition(-30, 0, 0)
    
    -- Create text
    local text = widget:AddChild(Text(NUMBERFONT, 24))
    text:SetPosition(10, 0, 0)
    text:SetString("--")
    
    widget.icon = icon
    widget.text = text
    
    return widget
end
```

### Step 3: Collect and Display Data

```lua
-- Update status display with current data
function UpdateStatusDisplay(widget, player)
    if not widget or not player then return end
    
    -- Update health
    if widget.elements.health and player.components.health then
        local current = math.floor(player.components.health.currenthealth)
        local max = math.floor(player.components.health.maxhealth)
        widget.elements.health.text:SetString(string.format("%d / %d", current, max))
    end
    
    -- Update hunger
    if widget.elements.hunger and player.components.hunger then
        local current = math.floor(player.components.hunger.current)
        local max = math.floor(player.components.hunger.max)
        widget.elements.hunger.text:SetString(string.format("%d / %d", current, max))
    end
    
    -- Update sanity
    if widget.elements.sanity and player.components.sanity then
        local current = math.floor(player.components.sanity.current)
        local max = math.floor(player.components.sanity.max)
        widget.elements.sanity.text:SetString(string.format("%d / %d", current, max))
    end
    
    -- Update temperature
    if widget.elements.temperature and player.components.temperature then
        local temp = math.floor(player.components.temperature:GetCurrent())
        widget.elements.temperature.text:SetString(string.format("%d°C", temp))
    end
    
    -- Update world information
    if TheWorld then
        -- Update season
        if widget.elements.season and TheWorld.components.seasons then
            local season = TheWorld.components.seasons:GetSeason()
            local season_name = STRINGS.UI.SERVERLISTINGSCREEN.SEASONS[string.upper(season)]
            widget.elements.season.text:SetString(season_name)
        end
        
        -- Update day
        if widget.elements.day and TheWorld.components.clock then
            local day = TheWorld.components.clock:GetNumCycles() + 1
            widget.elements.day.text:SetString(string.format(STRINGS.UI.HUD.DAY, day))
        end
        
        -- Update time
        if widget.elements.time and TheWorld.components.clock then
            local time = TheWorld.components.clock:GetTimeString()
            widget.elements.time.text:SetString(time)
        end
    end
end
```

### Step 4: Set Up Periodic Updates

```lua
-- Initialize periodic updates
function InitializeStatusUpdates(player, widget)
    -- Create update task
    return player:DoPeriodicTask(0.5, function()
        if player and widget and widget.shown then
            UpdateStatusDisplay(widget, player)
        end
    end)
end
```

## Conclusion

The Combined Status mod exemplifies excellent UI mod design through:

1. **Information Enhancement**: Providing useful information without overwhelming the player
2. **Visual Integration**: Maintaining the game's art style and UI conventions
3. **User Customization**: Allowing players to adjust the display to their preferences
4. **Performance Consciousness**: Ensuring the mod doesn't negatively impact game performance

By studying this mod, we can learn how to create UI enhancements that add value to the game experience while respecting its visual design and performance requirements. These principles apply to any mod that aims to improve the game's interface. 