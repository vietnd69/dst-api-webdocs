---
id: ui-system
title: UI System
sidebar_position: 8
---

# UI System

Don't Starve Together uses a hierarchical widget-based UI system to create and manage user interfaces. This system allows for creating complex UIs with nested elements, event handling, animations, and interactions.

## Widget Hierarchy

The UI system in DST is built on a parent-child hierarchy of widgets:

- Every UI element inherits from the base `Widget` class
- Widgets can contain other widgets as children
- Events and rendering flow through the hierarchy
- Focus and input handling are managed through this hierarchy

```lua
-- Basic widget hierarchy example
local root = Widget("root")
local panel = root:AddChild(Widget("panel"))
local button = panel:AddChild(ImageButton("images/ui.xml", "button.tex", "button_focus.tex"))
```

## Base Widget Class

The `Widget` class is the foundation of all UI elements:

```lua
local Widget = require "widgets/widget"

-- Creating a basic widget
local my_widget = Widget("my_widget")
```

### Key Widget Properties

| Property | Description |
|----------|-------------|
| `children` | Table of child widgets |
| `parent` | Reference to parent widget |
| `focus` | Whether widget has input focus |
| `enabled` | Whether widget is enabled |
| `shown` | Whether widget is visible |

### Key Widget Methods

```lua
-- Positioning and scaling
widget:SetPosition(x, y, z)       -- Set position relative to parent
widget:SetScale(scale)            -- Set scale (1 is normal size)
widget:SetRotation(angle)         -- Set rotation in degrees

-- Visibility
widget:Show()                     -- Make widget visible
widget:Hide()                     -- Make widget invisible

-- Hierarchy
widget:AddChild(child_widget)     -- Add a child widget
widget:RemoveChild(child_widget)  -- Remove a child widget
widget:KillAllChildren()          -- Remove all children

-- Focus
widget:SetFocus()                 -- Give this widget focus
widget:ClearFocus()               -- Remove focus from this widget

-- Lifecycle
widget:Kill()                     -- Destroy the widget and all children
widget:StartUpdating()            -- Make widget receive update calls
widget:StopUpdating()             -- Stop widget from receiving updates
```

## Common Widget Types

DST provides many specialized widget types for different UI needs:

### Text

Displays text with various formatting options:

```lua
local Text = require "widgets/text"

local my_text = Text(NEWFONT, 30, "Hello World")
my_text:SetColour(1, 1, 1, 1)  -- RGBA (white)
my_text:SetString("New text")  -- Change text content
```

### Image

Displays images from texture atlases:

```lua
local Image = require "widgets/image"

local my_image = Image("images/ui.xml", "panel.tex")
my_image:SetSize(100, 100)
my_image:SetTint(1, 0.8, 0.8, 1)  -- Apply a reddish tint
```

### Button

Base class for interactive buttons:

```lua
local Button = require "widgets/button"

local my_button = Button()
my_button:SetText("Click Me")
my_button:SetOnClick(function() print("Button clicked!") end)
```

### ImageButton

Buttons with different images for different states:

```lua
local ImageButton = require "widgets/imagebutton"

local my_button = ImageButton(
    "images/ui.xml",      -- Atlas
    "button.tex",         -- Normal state
    "button_focus.tex",   -- Focus state
    "button_disabled.tex" -- Disabled state
)

my_button:SetOnClick(function() print("Image button clicked!") end)
my_button:SetScale(1.2)
```

### UIAnim

Displays animated UI elements:

```lua
local UIAnim = require "widgets/uianim"

local my_anim = UIAnim()
my_anim:GetAnimState():SetBank("portal_scene")
my_anim:GetAnimState():SetBuild("portal_scene2")
my_anim:GetAnimState():PlayAnimation("portal_idle", true)
```

### NineSlice

Creates expandable panels with fixed corners:

```lua
local NineSlice = require "widgets/nineslice"

local panel = NineSlice(
    "images/ui.xml",        -- Atlas
    "panel_nine_slice.tex", -- Texture
    24                      -- Margin size
)
panel:SetSize(200, 150)
```

### Screen

Base class for full screens in the game:

```lua
local Screen = require "widgets/screen"

MyScreen = Class(Screen, function(self)
    Screen._ctor(self, "MyScreen")
    
    -- Create UI elements
    self.bg = self:AddChild(Image("images/bg.xml", "bg.tex"))
    self.title = self:AddChild(Text(TITLEFONT, 50, "My Screen"))
    
    -- Set default focus
    self.default_focus = self.title
end)
```

## Input Handling

Widgets can handle various input events:

```lua
-- Mouse events
function MyWidget:OnMouseButton(button, down, x, y)
    if button == MOUSEBUTTON_LEFT and down then
        print("Left mouse button pressed")
        return true -- Consume the event
    end
    return false -- Pass event to other widgets
end

-- Keyboard events
function MyWidget:OnRawKey(key, down)
    if key == KEY_SPACE and down then
        print("Space key pressed")
        return true
    end
    return false
end

-- Controller events
function MyWidget:OnControl(control, down)
    if control == CONTROL_ACCEPT and down then
        print("Accept button pressed")
        return true
    end
    return false
end
```

## Focus Management

The focus system determines which widget receives input:

```lua
-- Set focus direction for controller/keyboard navigation
widget:SetFocusChangeDir(MOVE_UP, other_widget)
widget:SetFocusChangeDir(MOVE_DOWN, another_widget)
widget:SetFocusChangeDir(MOVE_LEFT, left_widget)
widget:SetFocusChangeDir(MOVE_RIGHT, right_widget)

-- Set and clear focus
widget:SetFocus()
widget:ClearFocus()

-- Focus callbacks
function MyWidget:OnGainFocus()
    self:SetScale(1.1) -- Grow when focused
end

function MyWidget:OnLoseFocus()
    self:SetScale(1.0) -- Normal size when not focused
end
```

## Animations and Transitions

Widgets support various animations:

```lua
-- Move animation
widget:MoveTo(
    Vector3(0, 0, 0),   -- Start position
    Vector3(100, 0, 0), -- End position
    0.5,                -- Duration in seconds
    function()          -- Callback when complete
        print("Move animation finished")
    end
)

-- Scale animation
widget:ScaleTo(
    Vector3(1, 1, 1),   -- Start scale
    Vector3(1.5, 1.5, 1.5), -- End scale
    0.3,                -- Duration
    function()          -- Callback
        print("Scale animation finished")
    end
)

-- Rotate animation
widget:RotateTo(
    0,      -- Start angle
    360,    -- End angle
    1.0,    -- Duration
    nil,    -- Callback
    false   -- Don't loop
)

-- Color tint animation
widget:TintTo(
    {1, 1, 1, 1},   -- Start color (RGBA)
    {1, 0, 0, 1},   -- End color (red)
    0.5             -- Duration
)
```

## Creating Custom Widgets

You can create custom widgets by extending existing ones:

```lua
local MyCustomWidget = Class(Widget, function(self)
    Widget._ctor(self, "MyCustomWidget")
    
    -- Add components
    self.bg = self:AddChild(Image("images/ui.xml", "panel.tex"))
    self.text = self:AddChild(Text(NEWFONT, 30, "Custom Widget"))
    
    -- Set layout
    self.bg:SetSize(200, 100)
    self.text:SetPosition(0, 10)
end)

-- Add custom methods
function MyCustomWidget:SetContent(content)
    self.text:SetString(content)
end

-- Use the custom widget
local my_widget = MyCustomWidget()
my_widget:SetContent("Hello World")
root:AddChild(my_widget)
```

## Templates and Common Patterns

DST provides many templates for common UI elements:

```lua
local TEMPLATES = require "widgets/templates"

-- Create common UI elements
local background = TEMPLATES.BackgroundTint(0.75)
local panel = TEMPLATES.RectangleWindow(400, 300)
local button = TEMPLATES.StandardButton(function() print("Clicked") end, "Click Me")
```

## Best Practices

1. **Cleanup**: Always call `widget:Kill()` when removing widgets to prevent memory leaks
2. **Focus Management**: Set up proper focus navigation for controller support
3. **Scaling**: Use `SetScaleMode` appropriately for different screen resolutions
4. **Performance**: Minimize the number of widgets and avoid creating them frequently
5. **Event Handling**: Return `true` from event handlers to prevent event propagation when appropriate

## Example: Complete UI Screen

Here's an example of a complete UI screen:

```lua
local Screen = require "widgets/screen"
local Widget = require "widgets/widget"
local Text = require "widgets/text"
local Image = require "widgets/image"
local ImageButton = require "widgets/imagebutton"
local TEMPLATES = require "widgets/templates"

MyCustomScreen = Class(Screen, function(self)
    Screen._ctor(self, "MyCustomScreen")
    
    -- Create root panel
    self.root = self:AddChild(Widget("root"))
    self.root:SetVAnchor(ANCHOR_MIDDLE)
    self.root:SetHAnchor(ANCHOR_MIDDLE)
    self.root:SetScaleMode(SCALEMODE_PROPORTIONAL)
    
    -- Add background
    self.bg = self.root:AddChild(TEMPLATES.BackgroundTint())
    
    -- Add panel
    self.panel = self.root:AddChild(Image("images/ui.xml", "panel.tex"))
    self.panel:SetSize(500, 400)
    
    -- Add title
    self.title = self.panel:AddChild(Text(TITLEFONT, 40, "My Custom Screen"))
    self.title:SetPosition(0, 150)
    
    -- Add content
    self.content = self.panel:AddChild(Text(BODYFONT, 25, "This is a custom screen example."))
    self.content:SetPosition(0, 50)
    
    -- Add buttons
    self.ok_button = self.panel:AddChild(ImageButton(
        "images/ui.xml", 
        "button.tex", 
        "button_focus.tex", 
        "button_disabled.tex"
    ))
    self.ok_button:SetPosition(0, -120)
    self.ok_button:SetText("OK")
    self.ok_button:SetOnClick(function() TheFrontEnd:PopScreen() end)
    
    -- Set default focus
    self.default_focus = self.ok_button
end)

-- Show the screen
TheFrontEnd:PushScreen(MyCustomScreen())
```

## UI Debugging

To debug UI layouts:

1. Use `widget:GetLocalPosition()` and `widget:GetWorldPosition()` to check positions
2. The game includes debug rendering that can be enabled with console commands
3. Add temporary colored backgrounds to visualize widget boundaries
4. Use `print` statements to track focus and event propagation

## Advanced Topics

### Widget Lifecycle

1. **Creation**: Widget is instantiated with `Widget()` or a derived class
2. **Addition to Hierarchy**: Widget is added to a parent with `parent:AddChild()`
3. **Updates**: If enabled with `widget:StartUpdating()`, widget receives update calls
4. **Destruction**: Widget is destroyed with `widget:Kill()`

### Screen Management

The `TheFrontEnd` object manages screen navigation:

```lua
-- Push a new screen onto the stack
TheFrontEnd:PushScreen(MyScreen())

-- Pop the top screen
TheFrontEnd:PopScreen()

-- Replace all screens with a new one
TheFrontEnd:SetScreen(MyScreen())
```

### Custom Input Handling

For complex input handling:

```lua
-- Add a global input handler
self.input_handler = TheInput:AddGeneralHandler(function(key, down)
    if key == KEY_ESCAPE and not down then
        TheFrontEnd:PopScreen()
        return true
    end
    return false
end)

-- Remove the handler when done
TheInput:RemoveHandler(self.input_handler)
``` 