---
id: ui-system
title: UI System
sidebar_position: 15
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# UI System

The UI system in Don't Starve Together controls the creation and management of user interface elements.

## Overview

Don't Starve Together uses a widget-based UI system built on top of IMGUI (Immediate Mode GUI). This document covers the core concepts of the UI system, widget hierarchies, and common usage patterns.

## Widget Hierarchy

UI elements in DST are organized in a hierarchical structure:

```
TheFrontEnd
    └── Screen
        └── Widget
            ├── Text
            ├── Image
            ├── Button
            └── Container
                └── ...
```

Each widget can have child widgets, forming a tree structure. The root of this tree is typically a Screen object, which is managed by TheFrontEnd.

## Basic Widget Types

### Widget

Base class for all UI elements:

```lua
local Widget = require "widgets/widget"
local MyWidget = Class(Widget, function(self)
    Widget._ctor(self, "MyWidget")
    -- Initialize your widget
end)
```

### Text

For displaying text:

```lua
local Text = require "widgets/text"
self.label = self:AddChild(Text(BODYTEXTFONT, 30))
self.label:SetString("Hello World!")
self.label:SetColour(UICOLOURS.GOLD)
```

### Image

For displaying images:

```lua
local Image = require "widgets/image"
self.icon = self:AddChild(Image("images/ui.xml", "icon.tex"))
self.icon:SetScale(1.2)
self.icon:SetTint(1, 1, 1, 0.8)
```

### Button

For interactive buttons:

```lua
local Button = require "widgets/button"
self.button = self:AddChild(Button())
self.button:SetText("Click Me")
self.button:SetOnClick(function()
    print("Button clicked!")
end)
```

### ImageButton

For buttons with images:

```lua
local ImageButton = require "widgets/imagebutton"
self.imagebutton = self:AddChild(ImageButton("images/ui.xml", "button_normal.tex", "button_hover.tex", "button_disabled.tex"))
self.imagebutton:SetOnClick(function()
    print("Image button clicked!")
end)
```

## Creating Custom Widgets

Custom widgets are created by extending the Widget class:

```lua
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local Text = require "widgets/text"

local HealthBar = Class(Widget, function(self, owner)
    Widget._ctor(self, "HealthBar")
    self.owner = owner
    
    self.bg = self:AddChild(Image("images/ui.xml", "health_bar_bg.tex"))
    self.bar = self:AddChild(Image("images/ui.xml", "health_bar_fg.tex"))
    self.text = self:AddChild(Text(BODYTEXTFONT, 20))
    
    self.bar:SetScale(1, 1)
    self.text:SetPosition(0, -30)
    
    self:StartUpdating()
end)

function HealthBar:OnUpdate(dt)
    if self.owner and self.owner.components.health then
        local health_percent = self.owner.components.health:GetPercent()
        self.bar:SetScale(health_percent, 1)
        self.text:SetString(string.format("Health: %d/%d", 
            self.owner.components.health.currenthealth,
            self.owner.components.health.maxhealth))
    end
end

return HealthBar
```

## Screens

Screens are top-level widgets managed by TheFrontEnd:

```lua
local Screen = require "widgets/screen"
local Widget = require "widgets/widget"
local Text = require "widgets/text"

local MyScreen = Class(Screen, function(self)
    Screen._ctor(self, "MyScreen")
    
    self.root = self:AddChild(Widget("ROOT"))
    self.root:SetVAnchor(ANCHOR_MIDDLE)
    self.root:SetHAnchor(ANCHOR_MIDDLE)
    self.root:SetScaleMode(SCALEMODE_PROPORTIONAL)
    
    self.title = self.root:AddChild(Text(TITLEFONT, 50))
    self.title:SetString("My Custom Screen")
    self.title:SetPosition(0, 100)
    
    -- Add more UI elements here
end)

function MyScreen:OnControl(control, down)
    if Screen.OnControl(self, control, down) then return true end
    
    if control == CONTROL_CANCEL and not down then
        TheFrontEnd:PopScreen()
        return true
    end
    
    return false
end

return MyScreen
```

## Positioning and Anchoring

Widgets can be positioned and anchored in several ways:

```lua
-- Absolute positioning
widget:SetPosition(100, 50)

-- Relative positioning
widget:SetPosition(parent_x + 10, parent_y - 5)

-- Scaling
widget:SetScale(1.5)
widget:SetScale(1.5, 1.0) -- Different X and Y scales

-- Anchoring
widget:SetVAnchor(ANCHOR_MIDDLE) -- Vertical anchoring (TOP, MIDDLE, BOTTOM)
widget:SetHAnchor(ANCHOR_LEFT)   -- Horizontal anchoring (LEFT, MIDDLE, RIGHT)

-- Scale modes
widget:SetScaleMode(SCALEMODE_PROPORTIONAL)
```

## Input Handling

Widgets can handle input events:

```lua
function MyWidget:OnControl(control, down)
    if Widget.OnControl(self, control, down) then return true end
    
    if control == CONTROL_ACCEPT and not down then
        -- Handle the accept button release
        return true
    end
    
    return false
end

function MyWidget:OnMouseButton(button, down, x, y)
    if Widget.OnMouseButton(self, button, down, x, y) then return true end
    
    if button == MOUSEBUTTON_LEFT and not down then
        -- Handle left mouse button release
        return true
    end
    
    return false
end
```

## Common UI Elements

### Containers

```lua
local UIAnim = require "widgets/uianim"
local container = self:AddChild(UIAnim())
container:GetAnimState():SetBank("container_bank")
container:GetAnimState():SetBuild("container_build")
container:GetAnimState():PlayAnimation("idle")
```

### Sliders

```lua
local Slider = require "widgets/slider"
local slider = self:AddChild(Slider(0, 100, 200, 30))
slider:SetPosition(0, -50)
slider:SetValue(50)

slider.OnChanged = function(val)
    print("Slider value changed:", val)
end
```

### Spinners

```lua
local Spinner = require "widgets/spinner"
local options = {"Option 1", "Option 2", "Option 3"}
local spinner = self:AddChild(Spinner(options, 200, 30))
spinner:SetPosition(0, -100)
spinner:SetSelectedIndex(1)

spinner.OnChanged = function(selected)
    print("Selected option:", selected)
end
```

## Managing Screens

The screen stack is managed by TheFrontEnd:

```lua
-- Push a new screen
TheFrontEnd:PushScreen(MyScreen())

-- Pop the top screen
TheFrontEnd:PopScreen()

-- Get the current screen
local current_screen = TheFrontEnd:GetActiveScreen()

-- Clear all screens (be careful!)
TheFrontEnd:ClearScreens()
```

## HUD Customization

The player's HUD can be customized:

```lua
local function ModifyHUD(hud)
    -- Add a custom widget to the HUD
    hud.my_widget = hud.root:AddChild(MyWidget())
    hud.my_widget:SetPosition(100, 100)
end

AddPrefabPostInit("player_classified", function(inst)
    if inst.HUD then
        ModifyHUD(inst.HUD)
    else
        inst:ListenForEvent("hudsetup", function(inst, data)
            ModifyHUD(data.hud)
        end)
    end
end)
```

## Animation in UI

UI elements can be animated:

```lua
-- Simple position animation
widget:MoveTo(current_pos, target_pos, duration, callback)

-- Simple scale animation
widget:ScaleTo(current_scale, target_scale, duration, callback)

-- Custom animation
local start_time = GetTime()
local duration = 1.0
local start_pos = Vector3(widget:GetPosition())
local end_pos = Vector3(100, 100, 0)

widget:StartUpdating()
function widget:OnUpdate(dt)
    local t = math.min((GetTime() - start_time) / duration, 1)
    local pos = start_pos + (end_pos - start_pos) * t
    widget:SetPosition(pos:Get())
    
    if t >= 1 then
        widget:StopUpdating()
    end
end
```

## Best Practices

1. **Clean up resources**: Remove event listeners and stop updating when widgets are removed
2. **Use widget hierarchy**: Organize related widgets in a hierarchical structure
3. **Optimize rendering**: Use SetClickable(false) for non-interactive elements
4. **Scale appropriately**: Design UI to work across different screen resolutions
5. **Handle input properly**: Return true from input handlers when consuming events
6. **Test with different screen sizes**: Ensure your UI works on various resolutions

## See Also

- [Widgets](widgets.md) - Detailed documentation of available widgets
- [UI Events](ui-events.md) - Event handling in UI
- [Creating Screens](creating-screens.md) - Detailed guide on screen creation
- [Custom UI Elements Example](../examples/custom-ui-elements.md) - Example of creating custom UI
- [Global Position CompleteSync Case Study](../examples/case-global-position.md) - Real-world example of complex UI implementation with map pings and indicators
- [Re-Gorge-itated Case Study](../examples/case-regorgeitaled.md) - Example of extensive UI customization for a game mode conversion mod 
