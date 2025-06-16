---
id: widgets
title: Common Widgets
sidebar_position: 14
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Common Widgets

Don't Starve Together provides a rich collection of pre-built widgets that can be used to create complex UI elements. This document covers the most commonly used widgets and how to implement them in your mods.

## Basic UI Components

### Text

The `Text` widget displays text with various formatting options:

```lua
local Text = require "widgets/text"

-- Parameters: font, size, text, color
local my_text = Text(NEWFONT, 30, "Hello World")
my_text:SetColour(1, 1, 1, 1)  -- RGBA (white)

-- Common methods
my_text:SetString("New text")  -- Change text content
my_text:SetSize(40)            -- Change font size
my_text:SetRegionSize(200, 50) -- Set text box dimensions
my_text:EnableWordWrap(true)   -- Enable word wrapping
```

Available fonts:
- `BODYTEXTFONT` - Standard body text
- `BUTTONFONT` - Used for buttons
- `CHATFONT` - Used for chat messages
- `HEADERFONT` - Used for headers
- `NEWFONT` - Standard UI font
- `TITLEFONT` - Used for titles
- `UIFONT` - Alternative UI font

### Image

The `Image` widget displays images from texture atlases:

```lua
local Image = require "widgets/image"

-- Parameters: atlas, texture
local my_image = Image("images/ui.xml", "panel.tex")

-- Common methods
my_image:SetSize(100, 100)     -- Set dimensions
my_image:SetTint(1, 0.8, 0.8, 1)  -- Apply a reddish tint
my_image:SetScale(1.5)         -- Scale the image
my_image:SetRotation(45)       -- Rotate 45 degrees
```

### Button

The `Button` widget is the base class for interactive buttons:

```lua
local Button = require "widgets/button"

local my_button = Button()
my_button:SetText("Click Me")
my_button:SetOnClick(function() print("Button clicked!") end)

-- Button states
my_button:Enable()     -- Make the button interactive
my_button:Disable()    -- Make the button non-interactive
my_button:SetSelected(true)  -- Set the button as selected
```

### ImageButton

The `ImageButton` widget creates buttons with different images for different states:

```lua
local ImageButton = require "widgets/imagebutton"

-- Parameters: atlas, normal, focus, disabled, down, selected, scale, offset
local my_button = ImageButton(
    "images/ui.xml",      -- Atlas
    "button.tex",         -- Normal state
    "button_focus.tex",   -- Focus state
    "button_disabled.tex" -- Disabled state
)

-- Set click handler
my_button:SetOnClick(function() print("Image button clicked!") end)

-- Styling
my_button:SetScale(1.2)
my_button:SetText("My Button")  -- Add text to the button
my_button:SetTextSize(20)
```

### AnimButton

The `AnimButton` widget creates buttons using animations:

```lua
local AnimButton = require "widgets/animbutton"

-- Parameters: atlas, normal, focus, disabled, down, selected, scale, offset
local my_anim_button = AnimButton("anim.zip", "idle", "focus")
my_anim_button:SetOnClick(function() print("Animated button clicked!") end)
```

## Layout Components

### NineSlice

The `NineSlice` widget creates expandable panels with fixed corners:

```lua
local NineSlice = require "widgets/nineslice"

-- Parameters: atlas, texture, margin
local panel = NineSlice(
    "images/ui.xml",        -- Atlas
    "panel_nine_slice.tex", -- Texture
    24                      -- Margin size
)
panel:SetSize(200, 150)
```

### ThreeSlice

Similar to `NineSlice` but for horizontal or vertical slicing only:

```lua
local ThreeSlice = require "widgets/threeslice"

-- Parameters: atlas, texture, vertical, margin
local bar = ThreeSlice(
    "images/ui.xml",        -- Atlas
    "bar_three_slice.tex",  -- Texture
    true,                   -- Vertical orientation
    16                      -- Margin size
)
bar:SetSize(30, 200)
```

## Container Widgets

### ScrollableList

The `ScrollableList` widget creates scrollable lists of items:

```lua
local ScrollableList = require "widgets/scrollablelist"

-- Parameters: items, item_width, item_height, num_visible_items, items_per_row, horizontal
local items = {
    { text = "Item 1", data = 1 },
    { text = "Item 2", data = 2 },
    { text = "Item 3", data = 3 },
    -- More items...
}

local function BuildItem(item, index)
    local widget = Widget("list-item")
    local text = widget:AddChild(Text(NEWFONT, 20, item.text))
    
    widget.OnGainFocus = function()
        text:SetColour(1, 1, 0, 1)  -- Yellow on focus
    end
    
    widget.OnLoseFocus = function()
        text:SetColour(1, 1, 1, 1)  -- White when not focused
    end
    
    widget.OnSelect = function()
        print("Selected item: " .. item.text)
    end
    
    return widget
end

local list = ScrollableList(
    items,      -- Items array
    350,        -- Item width
    40,         -- Item height
    5,          -- Number of visible items
    1,          -- Items per row
    false       -- Not horizontal
)

list:SetItemsData(items)
list:SetUpdateFn(BuildItem)
```

### Menu

The `Menu` widget creates a menu with multiple items:

```lua
local Menu = require "widgets/menu"

-- Parameters: direction, spacing, width, height
local menu = Menu(nil, 0, true)

-- Add menu items
menu:AddItem("Play", function() print("Play selected") end)
menu:AddItem("Options", function() print("Options selected") end)
menu:AddItem("Quit", function() print("Quit selected") end)

-- Focus the first item
menu:SetFocus()
```

## Interactive Components

### TextEdit

The `TextEdit` widget creates editable text fields:

```lua
local TextEdit = require "widgets/textedit"

-- Parameters: font, size, text, color, max_length
local text_edit = TextEdit(NEWFONT, 30, "Edit me", {1,1,1,1}, 100)

-- Set callbacks
text_edit:SetOnTextInputted(function(text)
    print("Text changed to: " .. text)
end)

text_edit:SetOnEnter(function(text)
    print("Enter pressed with text: " .. text)
end)

-- Methods
text_edit:SetEditing(true)  -- Focus and start editing
text_edit:SetString("New text")  -- Set the text content
```

### Spinner

The `Spinner` widget creates a value selector with increment/decrement buttons:

```lua
local Spinner = require "widgets/spinner"

-- Parameters: values, width, height, textinfo, callback, initial_index, atlas, textures
local values = {"Low", "Medium", "High"}
local spinner = Spinner(
    values,             -- Values to cycle through
    200,                -- Width
    60,                 -- Height
    {font=NEWFONT, size=25},  -- Text formatting
    function(selected)  -- Callback when value changes
        print("Selected: " .. selected)
    end,
    2                   -- Initial index (Medium)
)

-- Methods
spinner:SetSelected("High")  -- Set the current value
local current = spinner:GetSelected()  -- Get the current value
```

## Special Effects

### UIAnim

The `UIAnim` widget displays animated UI elements:

```lua
local UIAnim = require "widgets/uianim"

local my_anim = UIAnim()
my_anim:GetAnimState():SetBank("portal_scene")
my_anim:GetAnimState():SetBuild("portal_scene2")
my_anim:GetAnimState():PlayAnimation("portal_idle", true)
```

### RingMeter

The `RingMeter` widget creates circular progress indicators:

```lua
local RingMeter = require "widgets/ringmeter"

-- Parameters: atlas, texture_bg, texture_fg, anticlockwise
local meter = RingMeter(
    "images/ui.xml",    -- Atlas
    "ring_meter_bg.tex",  -- Background texture
    "ring_meter_fg.tex",  -- Foreground texture
    false                 -- Clockwise direction
)

-- Set the value (0 to 1)
meter:SetValue(0.75)  -- 75% full
```

## Templates

DST provides many pre-built templates for common UI elements:

```lua
local TEMPLATES = require "widgets/templates"

-- Create common UI elements
local background = TEMPLATES.BackgroundTint(0.75)
local panel = TEMPLATES.RectangleWindow(400, 300)
local button = TEMPLATES.StandardButton(function() print("Clicked") end, "Click Me")
local checkbox = TEMPLATES.Checkbox("Option", true, function(checked) print("Checked: " .. tostring(checked)) end)
```

Common templates include:
- `TEMPLATES.BackgroundTint(alpha, rgb)` - Creates a tinted background
- `TEMPLATES.RectangleWindow(width, height)` - Creates a standard window
- `TEMPLATES.StandardButton(callback, text)` - Creates a standard button
- `TEMPLATES.IconButton(atlas, texture, callback)` - Creates an icon button
- `TEMPLATES.Checkbox(text, initial_value, callback)` - Creates a checkbox
- `TEMPLATES.LabelSpinner(text, options, callback)` - Creates a labeled spinner

## Status Displays

DST includes specialized widgets for displaying player status:

```lua
local StatusDisplays = require "widgets/statusdisplays"

-- Create status displays for health, hunger, sanity
local status = StatusDisplays(ThePlayer)

-- Individual badges can also be created
local HealthBadge = require "widgets/healthbadge"
local health_badge = HealthBadge(ThePlayer)
```

## Advanced Layout Techniques

### Positioning and Anchoring

```lua
-- Set position relative to parent
widget:SetPosition(100, 50, 0)  -- x, y, z

-- Set anchoring to screen edges
widget:SetVAnchor(ANCHOR_MIDDLE)  -- ANCHOR_TOP, ANCHOR_MIDDLE, ANCHOR_BOTTOM
widget:SetHAnchor(ANCHOR_LEFT)    -- ANCHOR_LEFT, ANCHOR_MIDDLE, ANCHOR_RIGHT

-- Set scale mode
widget:SetScaleMode(SCALEMODE_PROPORTIONAL)  -- SCALEMODE_NONE, SCALEMODE_FILLSCREEN, SCALEMODE_PROPORTIONAL
```

### Focus Management

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

## Example: Inventory Item Widget

Here's a complete example of creating a custom widget for displaying inventory items:

```lua
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local Text = require "widgets/text"

-- Create a custom inventory item widget
local InventoryItemWidget = Class(Widget, function(self, item_data)
    Widget._ctor(self, "InventoryItemWidget")
    
    -- Store item data
    self.item_data = item_data
    
    -- Create background
    self.bg = self:AddChild(Image("images/inventoryimages.xml", "inventory_slot.tex"))
    self.bg:SetSize(80, 80)
    
    -- Create item icon
    self.icon = self:AddChild(Image(item_data.atlas, item_data.image))
    self.icon:SetSize(60, 60)
    
    -- Create count text for stackable items
    if item_data.count and item_data.count > 1 then
        self.count = self:AddChild(Text(NEWFONT, 20, tostring(item_data.count)))
        self.count:SetPosition(25, -25)
    end
    
    -- Add hover text
    self:SetTooltip(item_data.name)
    
    -- Set up click handling
    self:SetOnClick(function()
        print("Clicked on " .. item_data.name)
    end)
end)

-- Add a method to update the count
function InventoryItemWidget:UpdateCount(count)
    if not self.count and count > 1 then
        self.count = self:AddChild(Text(NEWFONT, 20, tostring(count)))
        self.count:SetPosition(25, -25)
    elseif self.count then
        self.count:SetString(tostring(count))
    end
    
    self.item_data.count = count
end

-- Add a method to handle clicks
function InventoryItemWidget:SetOnClick(fn)
    self.onclick = fn
    self:SetClickable(true)
end

-- Override OnControl to handle clicks
function InventoryItemWidget:OnControl(control, down)
    if Widget.OnControl(self, control, down) then return true end
    
    if control == CONTROL_ACCEPT and not down and self.onclick then
        self.onclick()
        return true
    end
    
    return false
end

-- Usage example
local item = InventoryItemWidget({
    name = "Log",
    atlas = "images/inventoryimages.xml",
    image = "log.tex",
    count = 5
})
root:AddChild(item)
```

## Best Practices for Widget Development

1. **Memory Management**: Always call `widget:Kill()` when removing widgets to prevent memory leaks
2. **Focus Management**: Set up proper focus navigation for controller support
3. **Scaling**: Use `SetScaleMode` appropriately for different screen resolutions
4. **Performance**: Minimize the number of widgets and avoid creating them frequently
5. **Event Handling**: Return `true` from event handlers to prevent event propagation when appropriate
6. **Reusability**: Create custom widget classes for UI elements you use repeatedly
7. **Animation**: Use the animation system for smooth transitions instead of manual positioning
8. **Accessibility**: Ensure UI elements are properly sized and have adequate contrast
9. **Organization**: Group related widgets into logical hierarchies
10. **Testing**: Test your UI on different resolutions and with both mouse and controller input 
