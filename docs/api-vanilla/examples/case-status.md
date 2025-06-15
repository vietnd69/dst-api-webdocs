---
id: case-status
title: Case Study - Combined Status
sidebar_position: 13
---

# Case Study: Combined Status Mod

This case study examines the "Combined Status" mod for Don't Starve Together, which enhances the player status display with additional information. We'll analyze its implementation and extract valuable modding techniques for UI enhancement.
- [Github](https://github.com/rezecib/Combined-Status)
- [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=376333686)

## Mod Overview

The Combined Status mod addresses a common player need: having more information readily visible on the screen. The mod is compatible with all versions of Don't Starve and Don't Starve Together, enhancing the HUD with various player and world information. The mod:

- Shows numerical values for health, hunger, and sanity
- Displays player and world temperature with customizable units (Game units, Celsius, Fahrenheit)
- Shows season information through a clock or compact display with days remaining
- Displays moon phases with advanced features like waxing/waning distinction
- Shows equipped item durability percentages 
- Adds custom meters like naughtiness (in singleplayer) and beaver meter for Woodie
- Features high customizability through numerous configuration options
- Maintains the game's visual style while adding functionality

## Technical Implementation

### Core Techniques Used

1. **Custom Widget Creation and Integration**
2. **Game Component Data Access**
3. **Cross-Platform Compatibility**
4. **Responsive UI Configuration**
5. **Event-Based UI Updates**
6. **Performance Optimization**
7. **Integration with Other Mods**

Let's examine each of these techniques in detail.

## 1. Custom Widget Creation and Integration

The mod creates custom UI elements and integrates them with the game's existing UI by using class post-construction (modifying existing classes) and creating custom widget classes.

### Custom Widget Classes

```lua
-- MiniBadge widget for compact status displays
local Minibadge = Class(Widget, function(self, name, owner)
    Widget._ctor(self, "Minibadge")
    self.owner = owner
	
    self.name = name

    self:SetScale(.9, .9, .9)
	
    self.bg = self:AddChild(Image("images/status_bgs.xml", "status_bgs.tex"))
    self.bg:SetScale(.4,.43,1)
    self.bg:SetPosition(-.5, -40)
	
    self.num = self:AddChild(Text(NUMBERFONT, 28))
    self.num:SetHAlign(ANCHOR_MIDDLE)
    self.num:SetPosition(3.5, -40.5)
    self.num:SetScale(1,.78,1)
end)

-- Custom season clock widget
local SeasonClock = Class(Widget, function(self, owner, isdst, season_transition_fn, show_clock_text)
    Widget._ctor(self, "SeasonClock")
    
    -- Configure based on game version and environment
    self._dst = isdst
    self._season_transition_fn = season_transition_fn
    local world = self._dst and TheWorld or GetWorld()
    self._cave = (self._dst and world ~= nil and world:HasTag("cave"))
        or (not self._dst and world:IsCave())
        
    -- Create clock visuals
    self._face = self:AddChild(Image("images/hud.xml", "clock_NIGHT.tex"))
    self._face:SetClickable(false)
    
    -- Create clock segments
    local segscale = .4
    for i = NUM_SEGS, 1, -1 do
        local seg = self:AddChild(Image("images/hud.xml", "clock_wedge.tex"))
        seg:SetScale((i == 1 and 0.5 or 1)*segscale, segscale, segscale)
        seg:SetHRegPoint(ANCHOR_LEFT)
        seg:SetVRegPoint(ANCHOR_BOTTOM)
        seg:SetRotation((i - (i == 1 and 1 or 2)) * (360 / NUM_SEGS))
        seg:SetClickable(false)
        self._segs[i] = seg
    end
end)
```

### Integration with Existing UI

The mod uses class post-construction to modify existing game UI components:

```lua
-- Modify the Badge class to add numerical display
local function BadgePostConstruct(self)
    if self.active == nil then
        self.active = true
    end
    
    self:SetScale(.9,.9,.9)
    
    -- Add background for numerical display
    self.bg = self:AddChild(Image("images/status_bgs.xml", "status_bgs.tex"))
    self.bg:SetScale(SHOWDETAILEDSTATNUMBERS and 0.55 or .4,.43,0)
    self.bg:SetPosition(-.5, -40, 0)
    
    -- Configure numerical display
    self.num:SetFont(GLOBAL.NUMBERFONT)
    self.num:SetSize(SHOWDETAILEDSTATNUMBERS and 20 or 28)
    self.num:SetPosition(2, -40.5, 0)
    self.num:SetScale(1,.78,1)

    self.num:MoveToFront()
    if self.active then
        self.num:Show()
    end
    
    -- Add max value display when hovering
    self.maxnum = self:AddChild(Text(GLOBAL.NUMBERFONT, SHOWMAXONNUMBERS and 25 or 33))
    self.maxnum:SetPosition(6, 0, 0)
    self.maxnum:MoveToFront()
    self.maxnum:Hide()
    
    -- Override focus methods to show/hide max numbers
    local OldOnGainFocus = self.OnGainFocus
    function self:OnGainFocus()
        OldOnGainFocus(self)
        if self.active then
            self.maxnum:Show()
        end
    end
end
AddClassPostConstruct("widgets/badge", BadgePostConstruct)
```

### Implementation Analysis

The UI integration system demonstrates:

1. **Custom Widgets**: Creating specialized widgets like `Minibadge` and `SeasonClock` for enhanced functionality
2. **Class Extension**: Using post-construction to modify existing game widgets
3. **Hierarchy Management**: Building complex nested widget structures
4. **Visual Consistency**: Maintaining the game's art style with matching assets
5. **Responsive Layout**: Adapting widget positioning and scaling based on configurations

## 2. Game Component Data Access

The mod accesses various game systems and components to collect data for display, handling differences between game versions.

### Player Status Data

```lua
local function GetPlayerStatus(player)
    if not player then return {} end
    
    local status = {}
    
    -- Get health data with safety checks
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
    
    -- Get temperature with unit conversion
    if player.components.temperature then
        local temp = player.components.temperature:GetCurrent()
        status.temperature = math.floor(temp + 0.5)
        status.is_freezing = player.components.temperature:IsFreezing()
        status.is_overheating = player.components.temperature:IsOverheating()
    end
    
    -- Get naughtiness (only available in single-player)
    if not DST and player.components.kramped then
        status.naughtiness = {
            current = player.components.kramped.actions,
            max = player.components.kramped.threshold,
            percent = player.components.kramped.actions / player.components.kramped.threshold
        }
    end
    
    -- Get beaver meter for Woodie
    if player.components.beaverness then
        status.beaverness = {
            current = player.components.beaverness:GetPercent(),
            max = 1,
            percent = player.components.beaverness:GetPercent(),
        }
    end
    
    return status
end
```

### World Status Data

```lua
local function GetWorldStatus()
    -- Handle differences between DST and DS
    local world = DST and TheWorld or GetSeasonManager()
    if not world then return {} end
    
    local status = {}
    
    -- Get season info
    if DST then
        status.season = TheWorld.state.season
        status.days_left = TheWorld.state.remainingdaysinseason
        status.days_elapsed = TheWorld.state[status.season .. "length"] - status.days_left
    else
        status.season = world:GetSeason()
        status.days_left = (1 - world.percent_season) * world:GetSeasonLength()
        status.days_elapsed = world:GetSeasonLength() - status.days_left
    end
    
    -- Get time of day
    local clock = DST and TheWorld or GetClock()
    if clock then
        status.time = clock:GetTimeString()
        status.day = (DST and TheWorld.state.cycles or clock:GetNumCycles()) + 1
        status.phase = DST and TheWorld.state.phase or clock:GetPhase()
    end
    
    -- Get moon phase
    if DST then
        status.moon_phase = TheWorld.state.moonphase
        status.moon_visible = TheWorld.state.moonvisible 
    else
        status.moon_phase = GetClock():GetMoonPhase()
        status.moon_visible = GetClock():GetMoonPhase() ~= "new"
    end
    
    -- Get world temperature
    if world.GetCurrentTemperature then
        status.world_temperature = math.floor(world:GetCurrentTemperature() + 0.5)
    end
    
    return status
end
```

### Implementation Analysis

The data collection system demonstrates:

1. **Component Safety**: Using safety checks before accessing components
2. **Cross-Version Abstraction**: Handling differences between DS and DST
3. **Complex Calculations**: Computing derived values like days remaining
4. **Data Normalization**: Formatting data for consistent display
5. **Feature Detection**: Checking for optional components before accessing them

## 3. Cross-Platform Compatibility

The mod includes extensive handling to work across different game versions: vanilla Don't Starve, Reign of Giants, Shipwrecked, Hamlet, and Don't Starve Together.

```lua
-- Detect game version and DLCs
local DST = GLOBAL.TheSim.GetGameID ~= nil and GLOBAL.TheSim:GetGameID() == "DST"
local ROG = DST or CheckDlcEnabled("REIGN_OF_GIANTS")
local CSW = CheckDlcEnabled("CAPY_DLC")
local HML = CheckDlcEnabled("PORKLAND_DLC")

-- Handle different season systems
local function FindSeasonTransitions()
    if DST then
        local seasons_trans = {"autumn", "winter", "spring", "summer"}
        --IsShipwreckedWorld and IsPorkWorld are defined in Island Adventures
        if HAS_MOD.ISLAND_ADVENTURES then
            return GLOBAL.IsShipwreckedWorld() and {"mild", "wet", "green", "dry"}
                or GLOBAL.IsPorkWorld() and {"temperate", "humid", "lush"}
                or seasons_trans
        end
        return seasons_trans
    end
    
    -- For singleplayer, scrape the SeasonManager's data
    local season_trans = {}
    local season_orders = {
        "autumn", "winter", "spring", "summer",
        "mild", "wet", "green", "dry",
        "temperate", "humid", "lush",
    }
    for i, season in ipairs(season_orders) do
        if GLOBAL.GetSeasonManager()[season .. "enabled"] then
            table.insert(season_trans, season)
        end
    end
    -- Vanilla DS fallback
    if #season_trans == 0 then
        season_trans = {"summer", "winter"}
    end
    return season_trans
end
```

### Implementation Analysis

The cross-platform compatibility demonstrates:

1. **Feature Detection**: Checking for available functions and components
2. **DLC Detection**: Identifying which DLC content is enabled
3. **Version-Specific Logic**: Applying different code paths based on game version
4. **Graceful Fallbacks**: Providing reasonable defaults when features are unavailable
5. **Dynamic Content**: Adjusting UI for different game environments

## 4. Responsive UI Configuration

The mod provides extensive configuration options to users and dynamically adjusts the UI layout based on those settings.

### Configuration Options

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
        name = "SHOWTEMPERATURE",
        label = "Temperature",
        hover = "Show the temperature of the player.",
        options =    {
                        {description = "Show", data = true},
                        {description = "Hide", data = false},
                    },
        default = true,
    },
    {
        name = "UNIT",
        label = "Temperature Unit",
        hover = "Do the right thing, and leave this on Game.",
        options =    {
                        {description = "Game Units", data = "T"},
                        {description = "Celsius", data = "C"},
                        {description = "Fahrenheit", data = "F"},
                    },
        default = "T",
    },
    {
        name = "SEASONOPTIONS",
        label = "Season Clock",
        hover = "Adds a clock that shows the seasons, and rearranges the status badges to fit better.",
        options =    {
                        {description = "Micro", data = "Micro"},
                        {description = "Compact", data = "Compact"},
                        {description = "Clock", data = "Clock"},
                        {description = "No", data = ""},
                    },
        default = "Clock",
    },
    {
        name = "HUDSCALEFACTOR",
        label = "HUD Scale",
        hover = "Lets you adjust the size of the badges and clocks independently of the rest of the game HUD scale.",
        options = hud_scale_options,
        default = 100,
    },
}
```

### Dynamic Layout Adjustment

```lua
-- Apply configuration in modmain.lua
local function ApplyConfiguration()
    -- Read configuration values
    CONFIG = {
        POSITION = GetModConfigData("POSITION"),
        SHOW_NUMERICAL = GetModConfigData("SHOWSTATNUMBERS"),
        SHOW_DURABILITY = GetModConfigData("SHOWDURABILITY"),
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
    
    -- Scale UI based on configuration
    CONFIG.SCALE = HUDSCALEFACTOR
    
    -- Adjust status elements based on which features are enabled
    CONFIG.TEMP_Y_OFFSET = SHOWTEMPERATURE and 30 or 0
    CONFIG.WORLD_TEMP_Y_OFFSET = SHOWWORLDTEMP and 30 or 0
    CONFIG.NAUGHTINESS_Y_OFFSET = SHOWNAUGHTINESS and 30 or 0
}
```

### Implementation Analysis

The responsive configuration system demonstrates:

1. **Rich Configuration Options**: Providing users with detailed control
2. **Hover Tooltips**: Explaining options with hover text
3. **Layout Algorithm**: Dynamic positioning based on user preferences
4. **Feature Dependencies**: Enabling/disabling features based on other settings
5. **Scale Management**: Handling different screen sizes and resolutions

## 5. Event-Based UI Updates

The mod uses the game's event system to efficiently update UI elements when relevant data changes.

```lua
-- Listen for events to update the season display
if DST then
    local function listen_for_event_delayed(event, fn)
        self.inst:ListenForEvent(event, function(inst, data)
            TheWorld:DoTaskInTime(0, function()
                fn(self, data)
            end)
        end, TheWorld)
    end
    listen_for_event_delayed("seasontick", self.OnCyclesChanged)
    listen_for_event_delayed("seasonlengthschanged", self.OnSeasonLengthsChanged)
    listen_for_event_delayed("phasechanged", self.OnPhaseChanged)
else
    self.inst:ListenForEvent("daycomplete", function(inst, data)
        self.inst:DoTaskInTime(0, function()
            self:OnCyclesChanged()
            if self._have_focus then
                self:OnGainFocus()
            else
                self:OnLoseFocus()
            end
        end)
    end, GetWorld())
    self.inst:ListenForEvent("seasonChange", function()
        self:OnSeasonLengthsChanged()
        if self._have_focus then
            self:OnGainFocus()
        else
            self:OnLoseFocus()
        end
    end, GetWorld())
end
```

### Implementation Analysis

The event-based update system demonstrates:

1. **Efficient Updates**: Only updating when relevant data changes
2. **Event Delay**: Using DoTaskInTime(0) to prevent event processing conflicts
3. **Event Filtering**: Selecting specific events to respond to
4. **State Preservation**: Maintaining focus state during updates
5. **Version-Specific Events**: Handling different event systems in DS and DST

## 6. Performance Optimization

The mod includes several optimizations to ensure it doesn't impact game performance.

```lua
-- Optimized update function with change detection
local function InitializeStatusUpdates(widget)
    -- Store last values to avoid unnecessary updates
    local last_player_status = {}
    local last_world_status = {}
    
    -- Create periodic update task
    return player:DoPeriodicTask(CONFIG.UPDATE_INTERVAL, function()
        -- Skip processing if widget is hidden
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
            if old_data[k] == nil or HasChanges(v, old_data[k]) then
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

1. **Conditional Updates**: Only updating when data actually changes
2. **Deep Comparison**: Efficiently comparing nested data structures
3. **Visibility Checks**: Skipping updates when UI is not visible
4. **Update Frequency Control**: Allowing users to adjust update frequency
5. **Memory Management**: Properly copying and storing previous state data

## 7. Integration with Other Mods

The mod detects and integrates with other popular mods to enhance compatibility and features.

```lua
local CHECK_MODS = {
    ["workshop-1402200186"] = "TROPICAL",
    ["workshop-874857181"] = "CHINESE",
    ["workshop-2189004162"] = "INSIGHT",
}
local HAS_MOD = {}
-- Check for already loaded mods
for mod_name, key in pairs(CHECK_MODS) do
    HAS_MOD[key] = HAS_MOD[key] or (GLOBAL.KnownModIndex:IsModEnabled(mod_name) and mod_name)
end
-- Check for mods that will load later
for k,v in pairs(GLOBAL.KnownModIndex:GetModsToLoad()) do
    local mod_type = CHECK_MODS[v]
    if mod_type then
        HAS_MOD[mod_type] = v
    end
    
    local modinfo = GLOBAL.KnownModIndex:GetModInfo(v)
    -- Special case for RPG HUD which has many variants
    if string.match(modinfo.name or "", "RPG HUD") then
        HAS_MOD.RPGHUD = true
    elseif modinfo.ia_core then -- For Shipwrecked and Hamlet port mods
        HAS_MOD.ISLAND_ADVENTURES = true
    end
end

-- Adjust UI based on other mods
if HAS_MOD.RPGHUD then
    -- Adjust position to avoid conflicts with RPG HUD elements
    nudge = 75 -- Increased offset when RPG HUD is present
else
    nudge = 12.5
end

-- Use naughtiness from Insight mod if available in DST
if DST and HAS_MOD.INSIGHT and SHOWNAUGHTINESS then
    self.inst:ListenForEvent("naughtiness_delta", function(player, data)
        if self.naughtiness and data then
            self.naughtiness.num:SetString(data.naughtiness.."/"..data.max_naughtiness)
        end
    end, self.owner)
end
```

### Implementation Analysis

The mod integration system demonstrates:

1. **Mod Detection**: Identifying installed mods through KnownModIndex
2. **Conditional Features**: Enabling features based on mod availability
3. **Layout Adjustment**: Modifying layouts to avoid conflicts with other mods
4. **Feature Enhancement**: Using features from other mods when available
5. **Universal Compatibility**: Fallbacks for when integration is not possible

## Lessons Learned

From analyzing the Combined Status mod, we can extract several valuable lessons for UI mod development:

### 1. User-Centered Design

The mod demonstrates how to:
- Provide extensive configuration options to suit different player preferences
- Display information that is most relevant to player decision-making
- Create clear visual hierarchy and readable information displays
- Balance information density with visual clarity

### 2. Cross-Platform Development

The mod shows good practices for:
- Handling differences between game versions with graceful fallbacks
- Detecting available features before attempting to use them
- Adapting to different DLC content and environments
- Maintaining consistent look and feel across platforms

### 3. Performance-Conscious Development

Despite adding UI elements and collecting data, the mod maintains good performance by:
- Only updating when necessary through change detection
- Allowing users to control update frequency
- Using efficient data structures and comparison methods
- Skipping updates when elements are not visible

### 4. Integration and Compatibility

The mod prioritizes working well with:
- The base game's existing UI elements and style
- Other popular mods through detection and adaptation
- Different screen resolutions through scale management
- Various in-game contexts like caves, seasons, and character types

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
    
    local is_dst = TheSim:GetGameID() == "DST"
    
    -- Update health
    if widget.elements.health and player.components.health then
        local current = math.floor(player.components.health.currenthealth)
        local max = math.floor(player.components.health.maxhealth)
        widget.elements.health.text:SetString(string.format("%d / %d", current, max))
        
        -- Color based on value
        local percent = player.components.health:GetPercent()
        if percent < 0.25 then
            widget.elements.health.text:SetColour(1, 0, 0)
        else
            widget.elements.health.text:SetColour(1, 1, 1)
        end
    end
    
    -- Update temperature with unit conversion
    if widget.elements.temperature and player.components.temperature then
        local temp = player.components.temperature:GetCurrent()
        local temp_str = ""
        
        -- Convert based on units
        if CONFIG.UNIT == "C" then
            temp_str = string.format("%d°C", math.floor(temp/2 + 0.5))
        elseif CONFIG.UNIT == "F" then
            temp_str = string.format("%d°F", math.floor(0.9*temp + 32.5))
        else -- Game units
            temp_str = string.format("%d°", math.floor(temp + 0.5))
        end
        
        widget.elements.temperature.text:SetString(temp_str)
        
        -- Set color based on temperature state
        if player.components.temperature:IsFreezing() then
            widget.elements.temperature.text:SetColour(0.5, 0.5, 1)
        elseif player.components.temperature:IsOverheating() then
            widget.elements.temperature.text:SetColour(1, 0.4, 0.4)
        else
            widget.elements.temperature.text:SetColour(1, 1, 1)
        end
    end
    
    -- Update world information using the appropriate functions for the game version
    local world = is_dst and TheWorld or GetWorld()
    local seasons = is_dst and TheWorld or GetSeasonManager()
    local clock = is_dst and TheWorld or GetClock()
    
    if world and seasons and clock then
        -- Update season
        if widget.elements.season then
            local season = is_dst and world.state.season or seasons:GetSeason()
            local season_name = is_dst
                and STRINGS.UI.SERVERLISTINGSCREEN.SEASONS[season:upper()]
                or STRINGS.UI.SANDBOXMENU[season:upper()]
            widget.elements.season.text:SetString(season_name)
        end
        
        -- Update day
        if widget.elements.day then
            local day = (is_dst and world.state.cycles or clock:GetNumCycles()) + 1
            widget.elements.day.text:SetString(string.format(STRINGS.UI.HUD.DAY, day))
        end
    end
end
```

### Step 4: Set Up Periodic Updates with Optimization

```lua
-- Initialize periodic updates with change detection
function InitializeStatusUpdates(player, widget)
    local last_health = 0
    local last_hunger = 0
    local last_temp = 0
    local last_day = 0
    local last_season = ""
    
    -- Create update task
    return player:DoPeriodicTask(0.5, function()
        if not player or not widget or not widget.shown then
            return -- Skip processing if not needed
        end
        
        -- Check for changes in key values
        local health_changed = player.components.health 
            and math.floor(player.components.health.currenthealth) ~= last_health
        local hunger_changed = player.components.hunger
            and math.floor(player.components.hunger.current) ~= last_hunger
        local temp_changed = player.components.temperature
            and math.floor(player.components.temperature:GetCurrent()) ~= last_temp
            
        local is_dst = TheSim:GetGameID() == "DST"
        local world = is_dst and TheWorld or GetWorld()
        local seasons = is_dst and TheWorld or GetSeasonManager()
        local clock = is_dst and TheWorld or GetClock()
        
        local day_changed = is_dst and world.state.cycles ~= last_day
            or not is_dst and clock:GetNumCycles() ~= last_day
        local season_changed = is_dst and world.state.season ~= last_season
            or not is_dst and seasons:GetSeason() ~= last_season
            
        -- Only update if something changed
        if health_changed or hunger_changed or temp_changed or day_changed or season_changed then
            UpdateStatusDisplay(widget, player)
            
            -- Store current values for next comparison
            if player.components.health then
                last_health = math.floor(player.components.health.currenthealth)
            end
            if player.components.hunger then
                last_hunger = math.floor(player.components.hunger.current)
            end
            if player.components.temperature then
                last_temp = math.floor(player.components.temperature:GetCurrent())
            end
            if is_dst then
                last_day = world.state.cycles
                last_season = world.state.season
            else
                last_day = clock:GetNumCycles()
                last_season = seasons:GetSeason()
            end
        end
    end)
end
```

## Conclusion

The Combined Status mod exemplifies professional UI mod development through:

1. **Information Enhancement**: Providing useful information without overwhelming the player
2. **Cross-Platform Support**: Working across all game versions with consistent functionality
3. **Visual Integration**: Maintaining the game's art style and UI conventions
4. **User Customization**: Providing extensive options to tailor the experience
5. **Performance Optimization**: Ensuring the mod doesn't impact game performance
6. **Mod Compatibility**: Working alongside other popular mods

By studying this mod, we can learn how to create UI enhancements that add value to the game experience while respecting its visual design, performance requirements, and ecosystem. These principles apply to any mod that aims to improve the game's interface.

## See also

- [Widget System](../core/widgets.md) - For UI widget creation and management
- [Health Component](../components/health.md) - For accessing player health data
- [Temperature Component](../components/temperature.md) - For accessing temperature data
- [Hunger Component](../components/hunger.md) - For accessing hunger data
- [Sanity Component](../components/sanity.md) - For accessing sanity data
- [UI System](../core/ui-system.md) - For understanding the game's UI architecture 