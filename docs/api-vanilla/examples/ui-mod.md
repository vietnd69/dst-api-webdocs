---
id: ui-mod
title: UI Customization
sidebar_position: 7
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Creating Custom UI Elements

This tutorial walks through the process of creating custom UI elements in Don't Starve Together. We'll build a mod that adds a custom status display showing additional player information.

## Project Overview

We'll create a mod that adds a "Player Stats HUD" with:
- Custom UI widget that displays extended player statistics
- Interactive elements that respond to mouse input
- Animation effects for UI transitions
- Configuration options for customization

## Step 1: Set Up the Mod Structure

Create these folders and files:

```
playerstats_mod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   └── widgets/
│       └── playerstatsui.lua
├── images/
│   └── playerstats_assets.tex
├── images/
│   └── playerstats_assets.xml
└── anim/
    └── playerstats_meter.zip
```

## Step 2: Create the modinfo.lua File

```lua
name = "Player Stats HUD"
description = "Displays detailed player statistics in a custom UI panel"
author = "Your Name"
version = "1.0.0"

-- Compatible with Don't Starve Together
dst_compatible = true

-- Not compatible with Don't Starve
dont_starve_compatible = false
reign_of_giants_compatible = false

-- This mod can be client-only
client_only_mod = true

-- Icon displayed in the server list
icon_atlas = "modicon.xml"
icon = "modicon.tex"

-- Tags that describe your mod
server_filter_tags = {
    "interface",
    "hud"
}

-- Configuration options
configuration_options = {
    {
        name = "display_position",
        label = "Display Position",
        options = {
            {description = "Top Left", data = "topleft"},
            {description = "Top Right", data = "topright"},
            {description = "Bottom Left", data = "bottomleft"},
            {description = "Bottom Right", data = "bottomright"}
        },
        default = "topright"
    },
    {
        name = "show_advanced_stats",
        label = "Show Advanced Stats",
        options = {
            {description = "Yes", data = true},
            {description = "No", data = false}
        },
        default = true
    },
    {
        name = "update_frequency",
        label = "Update Frequency",
        options = {
            {description = "Low (1s)", data = 1},
            {description = "Medium (0.5s)", data = 0.5},
            {description = "High (0.1s)", data = 0.1}
        },
        default = 0.5
    }
}
```

## Step 3: Create the Custom Widget

Create `scripts/widgets/playerstatsui.lua`:

```lua
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local Text = require "widgets/text"
local UIAnim = require "widgets/uianim"

-- Define our custom widget by inheriting from the base Widget class
local PlayerStatsUI = Class(Widget, function(self, owner)
    -- Call the parent constructor
    Widget._ctor(self, "PlayerStatsUI")
    
    -- Store reference to the player
    self.owner = owner
    
    -- Get configuration options
    self.show_advanced_stats = GetModConfigData("show_advanced_stats")
    self.update_frequency = GetModConfigData("update_frequency")
    
    -- Initialize widget state
    self.expanded = false
    self.stats = {}
    
    -- Set up the root widget
    self:SetUpdateFn(function() self:UpdateStats() end)
    self:StartUpdating()
    
    -- Create the background panel
    self.bg = self:AddChild(Image("images/playerstats_assets.xml", "stats_panel.tex"))
    self.bg:SetSize(200, 120)
    
    -- Add header with title
    self.title = self:AddChild(Text(TITLEFONT, 20))
    self.title:SetPosition(0, 50, 0)
    self.title:SetString("Player Statistics")
    self.title:SetColour(1, 1, 1, 1)
    
    -- Add toggle button for expanding/collapsing
    self.toggle_btn = self:AddChild(Image("images/playerstats_assets.xml", "toggle_btn.tex"))
    self.toggle_btn:SetPosition(85, 50, 0)
    self.toggle_btn:SetSize(20, 20)
    self.toggle_btn:SetOnClick(function() self:ToggleExpanded() end)
    
    -- Create stat text elements
    self:CreateStatDisplays()
    
    -- Add animated meter for health
    self.health_meter = self:AddChild(UIAnim())
    self.health_meter:GetAnimState():SetBank("playerstats_meter")
    self.health_meter:GetAnimState():SetBuild("playerstats_meter")
    self.health_meter:GetAnimState():PlayAnimation("idle", true)
    self.health_meter:SetPosition(-70, 20, 0)
    self.health_meter:SetScale(0.5, 0.5, 0.5)
    
    -- Position the widget based on config
    self:PositionWidget(GetModConfigData("display_position"))
    
    -- Initial update
    self:UpdateStats()
end)

-- Create the stat text displays
function PlayerStatsUI:CreateStatDisplays()
    -- Basic stats (always shown)
    self.stats.health = self:AddChild(Text(NUMBERFONT, 18))
    self.stats.health:SetPosition(-50, 20, 0)
    self.stats.health:SetColour(0.9, 0.3, 0.3, 1)
    
    self.stats.hunger = self:AddChild(Text(NUMBERFONT, 18))
    self.stats.hunger:SetPosition(0, 20, 0)
    self.stats.hunger:SetColour(0.8, 0.6, 0.3, 1)
    
    self.stats.sanity = self:AddChild(Text(NUMBERFONT, 18))
    self.stats.sanity:SetPosition(50, 20, 0)
    self.stats.sanity:SetColour(0.5, 0.8, 0.8, 1)
    
    -- Advanced stats (shown when expanded)
    if self.show_advanced_stats then
        self.stats.temperature = self:AddChild(Text(NUMBERFONT, 16))
        self.stats.temperature:SetPosition(-70, -10, 0)
        self.stats.temperature:SetColour(1, 0.4, 0.4, 1)
        
        self.stats.moisture = self:AddChild(Text(NUMBERFONT, 16))
        self.stats.moisture:SetPosition(0, -10, 0)
        self.stats.moisture:SetColour(0.4, 0.6, 1, 1)
        
        self.stats.defense = self:AddChild(Text(NUMBERFONT, 16))
        self.stats.defense:SetPosition(70, -10, 0)
        self.stats.defense:SetColour(0.7, 0.7, 0.7, 1)
        
        self.stats.damage = self:AddChild(Text(NUMBERFONT, 16))
        self.stats.damage:SetPosition(-70, -30, 0)
        self.stats.damage:SetColour(1, 0.5, 0.2, 1)
        
        self.stats.speed = self:AddChild(Text(NUMBERFONT, 16))
        self.stats.speed:SetPosition(0, -30, 0)
        self.stats.speed:SetColour(0.4, 1, 0.4, 1)
        
        self.stats.drops = self:AddChild(Text(NUMBERFONT, 16))
        self.stats.drops:SetPosition(70, -30, 0)
        self.stats.drops:SetColour(1, 0.8, 0.2, 1)
        
        -- Hide advanced stats initially if not expanded
        if not self.expanded then
            self:HideAdvancedStats()
        end
    end
end

-- Position the widget based on configuration
function PlayerStatsUI:PositionWidget(position)
    local w, h = TheSim:GetScreenSize()
    
    if position == "topleft" then
        self:SetPosition(120, h - 70, 0)
    elseif position == "topright" then
        self:SetPosition(w - 120, h - 70, 0)
    elseif position == "bottomleft" then
        self:SetPosition(120, 100, 0)
    elseif position == "bottomright" then
        self:SetPosition(w - 120, 100, 0)
    end
end

-- Toggle between expanded and collapsed states
function PlayerStatsUI:ToggleExpanded()
    self.expanded = not self.expanded
    
    if self.expanded then
        -- Expand the panel
        self.bg:ScaleTo(1, 1.5, 0.2)
        self.toggle_btn:RotateTo(0, 180, 0.2)
        
        -- Show advanced stats
        if self.show_advanced_stats then
            self:ShowAdvancedStats()
        end
    else
        -- Collapse the panel
        self.bg:ScaleTo(1, 1, 0.2)
        self.toggle_btn:RotateTo(180, 0, 0.2)
        
        -- Hide advanced stats
        if self.show_advanced_stats then
            self:HideAdvancedStats()
        end
    end
end

-- Show the advanced stat displays
function PlayerStatsUI:ShowAdvancedStats()
    if not self.show_advanced_stats then return end
    
    self.stats.temperature:Show()
    self.stats.moisture:Show()
    self.stats.defense:Show()
    self.stats.damage:Show()
    self.stats.speed:Show()
    self.stats.drops:Show()
end

-- Hide the advanced stat displays
function PlayerStatsUI:HideAdvancedStats()
    if not self.show_advanced_stats then return end
    
    self.stats.temperature:Hide()
    self.stats.moisture:Hide()
    self.stats.defense:Hide()
    self.stats.damage:Hide()
    self.stats.speed:Hide()
    self.stats.drops:Hide()
end

-- Update all stat displays
function PlayerStatsUI:UpdateStats()
    if not self.owner then return end
    
    -- Update basic stats
    if self.owner.components.health then
        local health = math.floor(self.owner.components.health.currenthealth)
        local max_health = math.floor(self.owner.components.health.maxhealth)
        self.stats.health:SetString(string.format("%d/%d", health, max_health))
        
        -- Update health meter animation
        local health_percent = health / max_health
        self.health_meter:GetAnimState():SetPercent("meter", 1 - health_percent)
    end
    
    if self.owner.components.hunger then
        local hunger = math.floor(self.owner.components.hunger.current)
        local max_hunger = math.floor(self.owner.components.hunger.max)
        self.stats.hunger:SetString(string.format("%d/%d", hunger, max_hunger))
    end
    
    if self.owner.components.sanity then
        local sanity = math.floor(self.owner.components.sanity.current)
        local max_sanity = math.floor(self.owner.components.sanity.max)
        self.stats.sanity:SetString(string.format("%d/%d", sanity, max_sanity))
    end
    
    -- Update advanced stats if they're shown
    if self.show_advanced_stats and self.expanded then
        -- Temperature
        if self.owner.components.temperature then
            local temp = math.floor(self.owner.components.temperature.current)
            self.stats.temperature:SetString(string.format("Temp: %d°", temp))
        end
        
        -- Moisture
        if self.owner.components.moisture then
            local moisture = math.floor(self.owner.components.moisture:GetMoisture())
            self.stats.moisture:SetString(string.format("Wet: %d%%", moisture))
        end
        
        -- Defense
        local defense = 0
        if self.owner.components.health then
            defense = math.floor((1 - self.owner.components.health.absorb) * 100)
        end
        self.stats.defense:SetString(string.format("Def: %d%%", defense))
        
        -- Damage
        local damage = 1
        if self.owner.components.combat then
            damage = math.floor(self.owner.components.combat.defaultdamage)
        end
        self.stats.damage:SetString(string.format("Dmg: %d", damage))
        
        -- Speed
        local speed = 1
        if self.owner.components.locomotor then
            speed = math.floor(self.owner.components.locomotor:GetSpeedMultiplier() * 100)
        end
        self.stats.speed:SetString(string.format("Spd: %d%%", speed))
        
        -- Drop rate
        local drops = 0
        if self.owner.components.looting then
            drops = math.floor(self.owner.components.looting:GetLootingMultiplier() * 100)
        else
            drops = 100
        end
        self.stats.drops:SetString(string.format("Loot: %d%%", drops))
    end
end

-- Handle screen size changes
function PlayerStatsUI:OnScreenResize()
    self:PositionWidget(GetModConfigData("display_position"))
end

-- Clean up when the widget is removed
function PlayerStatsUI:OnRemoveFromScene()
    self:StopUpdating()
end

return PlayerStatsUI
```

## Step 4: Create the modmain.lua File

```lua
-- Import globals into the environment
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add asset files
Assets = {
    -- UI assets
    Asset("IMAGE", "images/playerstats_assets.tex"),
    Asset("ATLAS", "images/playerstats_assets.xml"),
    
    -- Animations
    Asset("ANIM", "anim/playerstats_meter.zip"),
}

-- Require our custom widget
local PlayerStatsUI = require "widgets/playerstatsui"

-- Add the UI when the player is created
local function AddPlayerStatsUI(inst)
    -- Only add UI for the local player
    if inst ~= GLOBAL.ThePlayer then
        return
    end
    
    -- Wait a moment for all components to initialize
    inst:DoTaskInTime(1, function()
        -- Create our UI widget
        local playerstats_ui = PlayerStatsUI(inst)
        
        -- Add it to the player's HUD
        if inst.HUD then
            inst.HUD.controls.topright:AddChild(playerstats_ui)
            
            -- Store reference to the widget
            inst.HUD.playerstats_ui = playerstats_ui
            
            -- Handle screen resizes
            inst:ListenForEvent("screenresize", function()
                playerstats_ui:OnScreenResize()
            end, GLOBAL.TheWorld)
        end
    end)
end

-- Add our UI when the player entity is spawned
AddPlayerPostInit(AddPlayerStatsUI)

-- Handle screen resize events
local function OnScreenResize()
    if GLOBAL.ThePlayer and GLOBAL.ThePlayer.HUD and GLOBAL.ThePlayer.HUD.playerstats_ui then
        GLOBAL.ThePlayer.HUD.playerstats_ui:OnScreenResize()
    end
end

-- Register for screen resize events
GLOBAL.TheInput:AddResizeHandler(OnScreenResize)
```

## Step 5: Create the UI Assets

For a complete mod, you'll need to create these asset files:

1. **UI Textures**: `images/playerstats_assets.tex` and `playerstats_assets.xml`
   - Contains textures for the panel background, buttons, and icons
   - Should include "stats_panel.tex" and "toggle_btn.tex" as referenced in the code

2. **Animated Meter**: `anim/playerstats_meter.zip`
   - Contains animations for the health meter
   - Should include "idle" animation and "meter" percent animation

## Step 6: Testing Your UI Mod

1. Launch Don't Starve Together
2. Enable your mod in the Mods menu
3. Start a new game
4. Observe your custom UI element in the position specified in the config
5. Test the UI by:
   - Clicking the toggle button to expand/collapse
   - Watching stats update as your character's state changes
   - Resizing the window to ensure proper positioning

## Understanding the UI System

Don't Starve Together's UI system is built on a hierarchy of widgets:

### Widget Hierarchy

- **Widget**: Base class for all UI elements
- **Image**: Displays static images from atlases
- **Text**: Displays text with specified font and size
- **UIAnim**: Displays animated elements
- **Button**: Handles click interactions
- **Container**: Groups multiple widgets together

### Widget Positioning

Widgets use a relative positioning system:

- **SetPosition(x, y, z)**: Position relative to parent
- **SetScale(x, y, z)**: Scale the widget
- **SetRotation(angle)**: Rotate the widget
- **SetSize(width, height)**: Set the dimensions

### Widget Events

Widgets can respond to various events:

- **SetOnClick(fn)**: Called when clicked
- **SetOnGainFocus(fn)**: Called when gaining focus
- **SetOnLoseFocus(fn)**: Called when losing focus
- **StartUpdating()**: Begin calling the update function
- **StopUpdating()**: Stop calling the update function

### Animation Control

UIAnim widgets provide animation control:

- **GetAnimState()**: Get the animation state controller
- **PlayAnimation(name, loop)**: Play a specific animation
- **SetPercent(anim, percent)**: Set animation progress percentage

## Customization Options

Here are some ways to enhance your UI mod:

### Add Keyboard Shortcuts

```lua
-- In modmain.lua, add keyboard shortcuts
local KEY_P = 112 -- P key to toggle UI visibility

-- Add key handler
TheInput:AddKeyDownHandler(KEY_P, function()
    if ThePlayer and ThePlayer.HUD and ThePlayer.HUD.playerstats_ui then
        if ThePlayer.HUD.playerstats_ui:IsVisible() then
            ThePlayer.HUD.playerstats_ui:Hide()
        else
            ThePlayer.HUD.playerstats_ui:Show()
        end
    end
end)
```

### Add Draggable Functionality

```lua
-- In your widget class, add dragging support
function PlayerStatsUI:MakeDraggable()
    self.dragging = false
    self.drag_offset_x = 0
    self.drag_offset_y = 0
    
    -- Handle mouse events
    self.bg:SetOnMouseButton(function(widget, button, down, x, y)
        if button == MOUSEBUTTON_LEFT then
            if down then
                -- Start dragging
                self.dragging = true
                local pos_x, pos_y = self:GetPosition():Get()
                self.drag_offset_x = pos_x - x
                self.drag_offset_y = pos_y - y
            else
                -- Stop dragging
                self.dragging = false
            end
        end
        return true
    end)
    
    -- Update position while dragging
    self:SetOnUpdate(function()
        if self.dragging then
            local x, y = TheInput:GetScreenPosition():Get()
            self:SetPosition(x + self.drag_offset_x, y + self.drag_offset_y, 0)
        end
    end)
end

-- Call this in your constructor
self:MakeDraggable()
```

### Add Custom Themes

```lua
-- In your widget constructor, add theme support
self.themes = {
    light = {
        bg_image = "stats_panel_light.tex",
        text_color = {0.1, 0.1, 0.1, 1},
        title_color = {0.2, 0.2, 0.8, 1}
    },
    dark = {
        bg_image = "stats_panel_dark.tex",
        text_color = {0.9, 0.9, 0.9, 1},
        title_color = {0.4, 0.8, 1, 1}
    },
    forest = {
        bg_image = "stats_panel_forest.tex",
        text_color = {0.9, 0.9, 0.8, 1},
        title_color = {0.5, 0.8, 0.3, 1}
    }
}

-- Add function to apply themes
function PlayerStatsUI:ApplyTheme(theme_name)
    local theme = self.themes[theme_name] or self.themes.dark
    
    -- Apply theme settings
    self.bg:SetTexture("images/playerstats_assets.xml", theme.bg_image)
    self.title:SetColour(unpack(theme.title_color))
    
    -- Update all text colors
    for _, text in pairs(self.stats) do
        if text.original_color == nil then
            -- Store original colors first time
            local r, g, b, a = text:GetColour()
            text.original_color = {r, g, b, a}
        end
        
        -- Apply theme color with a hint of the original color
        local orig = text.original_color
        text:SetColour(
            (orig[1] + theme.text_color[1]) * 0.5,
            (orig[2] + theme.text_color[2]) * 0.5,
            (orig[3] + theme.text_color[3]) * 0.5,
            theme.text_color[4]
        )
    end
end

-- Add theme selection button
self.theme_btn = self:AddChild(Image("images/playerstats_assets.xml", "theme_btn.tex"))
self.theme_btn:SetPosition(85, 30, 0)
self.theme_btn:SetSize(20, 20)

local current_theme = 1
local theme_names = {"light", "dark", "forest"}

self.theme_btn:SetOnClick(function()
    current_theme = current_theme % #theme_names + 1
    self:ApplyTheme(theme_names[current_theme])
end)

-- Apply default theme
self:ApplyTheme("dark")
```

### Add Tooltips

```lua
-- In your widget class, add tooltip support
function PlayerStatsUI:AddTooltip(widget, text)
    widget:SetHoverText(text, {
        font = NUMBERFONT,
        offset_x = 0,
        offset_y = 30,
        color = {1, 1, 1, 1},
        bg_color = {0.1, 0.1, 0.1, 0.8}
    })
end

-- Add tooltips to your stats
self:AddTooltip(self.stats.health, "Current health points")
self:AddTooltip(self.stats.hunger, "Current hunger level")
self:AddTooltip(self.stats.sanity, "Current sanity level")
self:AddTooltip(self.stats.temperature, "Body temperature")
self:AddTooltip(self.stats.moisture, "Wetness percentage")
self:AddTooltip(self.stats.defense, "Damage absorption")
self:AddTooltip(self.stats.damage, "Base attack damage")
self:AddTooltip(self.stats.speed, "Movement speed")
self:AddTooltip(self.stats.drops, "Loot drop chance")
```

## Common Issues and Solutions

### Problem: UI not appearing
**Solution**: Check that you're adding the widget to the correct HUD container and that you're only adding it for the local player (ThePlayer)

### Problem: UI elements misaligned
**Solution**: Verify your positioning code and ensure you're handling screen resizes properly

### Problem: Updates not happening
**Solution**: Make sure you've called StartUpdating() and have an update function set

### Problem: Animations not playing
**Solution**: Verify animation names match exactly what's in your animation files

### Problem: Memory leaks
**Solution**: Ensure you clean up event listeners and stop updating when the widget is removed:

```lua
function PlayerStatsUI:OnRemoveFromScene()
    self:StopUpdating()
    
    -- Remove any event listeners
    if self.owner then
        self.owner:RemoveEventCallback("screenresize", self.onresize, TheWorld)
    end
    
    -- Call parent method
    Widget.OnRemoveFromScene(self)
end
```

## Next Steps

Now that you've created a custom UI widget, you can:

1. **Add More Features**: Create additional UI elements like buff icons or timers
2. **Improve Visuals**: Add animations, transitions, and visual effects
3. **Enhance Interactivity**: Add more interactive elements like sliders or dropdown menus
4. **Integrate with Game Systems**: Connect your UI to more game systems like crafting or inventory

For more advanced UI customization, check out the [UI System](../core/ui-system.md) documentation to learn about the full capabilities of the UI framework. 
