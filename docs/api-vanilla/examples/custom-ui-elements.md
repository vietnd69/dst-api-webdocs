---
id: custom-ui-elements
title: Custom UI Elements
sidebar_position: 10
---

# Custom UI Elements

This guide demonstrates how to create custom UI elements for Don't Starve Together mods. You'll learn how to build reusable widgets, create custom screens, and implement interactive UI components.

## Creating Basic Custom Widgets

Custom widgets allow you to create reusable UI components for your mods. They are built by extending existing widget classes.

### Custom Button Example

```lua
-- Define a custom styled button with hover effects
local Widget = require "widgets/widget"
local ImageButton = require "widgets/imagebutton"
local Text = require "widgets/text"

local CustomButton = Class(ImageButton, function(self, text, onclick, scale)
    ImageButton._ctor(self, "images/ui.xml", "button.tex", "button_focus.tex")
    
    self.text = self:AddChild(Text(BUTTONFONT, 25, text))
    self.text:SetPosition(0, 2)
    
    self:SetScale(scale or 1)
    self:SetOnClick(onclick)
    
    -- Add pulsing animation when hovered
    self.pulse = false
    self:StartUpdating()
end)

function CustomButton:OnUpdate(dt)
    local pos = TheInput:GetScreenPosition()
    local wx, wy = self:GetWorldPosition():Get()
    local w, h = self:GetSize()
    
    local hover = math.abs(pos.x - wx) < w/2 and math.abs(pos.y - wy) < h/2
    
    if hover and not self.pulse then
        self.pulse = true
        self:ScaleTo(self:GetScale(), self:GetScale() * 1.1, 0.2)
        self.text:SetColour(1, 0.8, 0, 1)  -- Gold text on hover
    elseif not hover and self.pulse then
        self.pulse = false
        self:ScaleTo(self:GetScale(), self:GetScale() / 1.1, 0.2)
        self.text:SetColour(1, 1, 1, 1)  -- White text normally
    end
end

-- Usage
local my_button = CustomButton("Click Me", function() print("Button clicked!") end, 0.8)
```

### Custom Panel Example

```lua
-- Define a custom styled panel with title and content area
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local Text = require "widgets/text"

local CustomPanel = Class(Widget, function(self, title, width, height)
    Widget._ctor(self, "CustomPanel")
    
    self.bg = self:AddChild(Image("images/ui.xml", "panel.tex"))
    self.bg:SetSize(width, height)
    
    self.title = self:AddChild(Text(TITLEFONT, 30, title))
    self.title:SetPosition(0, height/2 - 30)
    
    -- Create a content container for easy positioning
    self.content = self:AddChild(Widget("content"))
    self.content:SetPosition(0, 0)
end)

-- Add method to add content to the panel
function CustomPanel:AddContent(widget)
    return self.content:AddChild(widget)
end

-- Usage
local panel = CustomPanel("My Panel", 300, 200)
local text = panel:AddContent(Text(BODYFONT, 20, "This is a custom panel!"))
text:SetPosition(0, 0)
```

## Interactive UI Components

### Custom Slider Widget

```lua
-- Define a custom slider for numeric values
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local Text = require "widgets/text"

local CustomSlider = Class(Widget, function(self, min_value, max_value, default_value, on_change)
    Widget._ctor(self, "CustomSlider")
    
    self.min_value = min_value or 0
    self.max_value = max_value or 100
    self.value = default_value or min_value
    self.on_change = on_change
    
    -- Create the track
    self.track = self:AddChild(Image("images/ui.xml", "line.tex"))
    self.track:SetSize(200, 5)
    
    -- Create the handle
    self.handle = self:AddChild(Image("images/ui.xml", "circle.tex"))
    self.handle:SetSize(20, 20)
    
    -- Create the value text
    self.text = self:AddChild(Text(NUMBERFONT, 20, tostring(self.value)))
    self.text:SetPosition(0, -25)
    
    -- Set initial handle position
    self:UpdateHandlePosition()
    
    -- Make the handle draggable
    self.dragging = false
    self:SetClickable(true)
end)

function CustomSlider:UpdateHandlePosition()
    local percent = (self.value - self.min_value) / (self.max_value - self.min_value)
    local x_pos = (percent * 200) - 100  -- Track width is 200, centered at 0
    self.handle:SetPosition(x_pos, 0)
    self.text:SetString(tostring(math.floor(self.value)))
end

function CustomSlider:SetValue(value)
    value = math.max(self.min_value, math.min(self.max_value, value))
    if value ~= self.value then
        self.value = value
        self:UpdateHandlePosition()
        if self.on_change then
            self.on_change(self.value)
        end
    end
end

function CustomSlider:OnMouseButton(button, down, x, y)
    if button == MOUSEBUTTON_LEFT then
        if down then
            -- Start dragging
            self.dragging = true
            self:OnMouseMove(x, y)
            self:StartUpdating()
            return true
        else
            -- Stop dragging
            self.dragging = false
            self:StopUpdating()
            return true
        end
    end
    return false
end

function CustomSlider:OnUpdate(dt)
    if self.dragging then
        local pos = TheInput:GetScreenPosition()
        self:OnMouseMove(pos.x, pos.y)
    end
end

function CustomSlider:OnMouseMove(x, y)
    if self.dragging then
        local wx, wy = self:GetWorldPosition():Get()
        local track_width = 200
        local local_x = x - wx
        
        -- Convert position to value
        local percent = (local_x + track_width/2) / track_width
        percent = math.max(0, math.min(1, percent))
        local value = self.min_value + percent * (self.max_value - self.min_value)
        
        self:SetValue(value)
    end
end

-- Usage
local slider = CustomSlider(0, 100, 50, function(value)
    print("Slider value changed to: " .. value)
end)
```

### Custom Checkbox Widget

```lua
-- Define a custom checkbox with label
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local Text = require "widgets/text"

local CustomCheckbox = Class(Widget, function(self, text, initial_value, on_change)
    Widget._ctor(self, "CustomCheckbox")
    
    self.checked = initial_value or false
    self.on_change = on_change
    
    -- Create the box
    self.box = self:AddChild(Image("images/ui.xml", "checkbox.tex"))
    self.box:SetSize(30, 30)
    self.box:SetPosition(-100, 0)
    
    -- Create the check mark
    self.check = self:AddChild(Image("images/ui.xml", "checkmark.tex"))
    self.check:SetSize(20, 20)
    self.check:SetPosition(-100, 0)
    
    -- Create the label
    self.label = self:AddChild(Text(BODYFONT, 25, text))
    self.label:SetPosition(0, 0)
    
    -- Update visual state
    self:UpdateCheck()
    
    -- Make clickable
    self:SetClickable(true)
end)

function CustomCheckbox:UpdateCheck()
    if self.checked then
        self.check:Show()
    else
        self.check:Hide()
    end
end

function CustomCheckbox:SetChecked(checked)
    if checked ~= self.checked then
        self.checked = checked
        self:UpdateCheck()
        if self.on_change then
            self.on_change(self.checked)
        end
    end
end

function CustomCheckbox:OnControl(control, down)
    if Widget.OnControl(self, control, down) then return true end
    
    if control == CONTROL_ACCEPT and not down then
        self:SetChecked(not self.checked)
        return true
    end
    
    return false
end

function CustomCheckbox:OnMouseButton(button, down, x, y)
    if button == MOUSEBUTTON_LEFT and not down then
        self:SetChecked(not self.checked)
        return true
    end
    return false
end

-- Usage
local checkbox = CustomCheckbox("Enable Feature", true, function(checked)
    print("Checkbox changed to: " .. tostring(checked))
end)
```

## Custom Inventory UI

### Custom Inventory Slot

```lua
-- Define a custom inventory slot that can hold items
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local Text = require "widgets/text"

local InventorySlot = Class(Widget, function(self, atlas, bgim, item, on_item_change)
    Widget._ctor(self, "InventorySlot")
    
    self.item = item
    self.on_item_change = on_item_change
    
    -- Create background
    self.bg = self:AddChild(Image(atlas or "images/ui.xml", bgim or "inv_slot.tex"))
    self.bg:SetSize(60, 60)
    
    -- Create item image (if item exists)
    self.item_image = nil
    self:UpdateItem()
    
    -- Make slot interactive
    self:SetClickable(true)
end)

function InventorySlot:UpdateItem()
    if self.item_image then
        self.item_image:Kill()
        self.item_image = nil
    end
    
    if self.count_text then
        self.count_text:Kill()
        self.count_text = nil
    end
    
    if self.item then
        -- Create item image
        self.item_image = self:AddChild(Image(self.item.atlas, self.item.image))
        self.item_image:SetSize(50, 50)
        
        -- Add count text if stackable
        if self.item.count and self.item.count > 1 then
            self.count_text = self:AddChild(Text(NUMBERFONT, 20, tostring(self.item.count)))
            self.count_text:SetPosition(15, -15)
        end
    end
end

function InventorySlot:SetItem(item)
    if item ~= self.item then
        self.item = item
        self:UpdateItem()
        
        if self.on_item_change then
            self.on_item_change(self.item)
        end
    end
end

function InventorySlot:OnControl(control, down)
    if Widget.OnControl(self, control, down) then return true end
    
    if control == CONTROL_ACCEPT and not down then
        if self.onclick then
            self.onclick(self)
        end
        return true
    end
    
    return false
end

-- Usage
local slot = InventorySlot(nil, nil, {
    atlas = "images/inventoryimages.xml",
    image = "log.tex",
    count = 5
}, function(item)
    if item then
        print("Slot now contains: " .. item.image)
    else
        print("Slot is now empty")
    end
end)

slot.onclick = function(slot)
    print("Slot was clicked")
end
```

## Custom Popups and Dialogs

### Custom Confirmation Dialog

```lua
-- Define a custom confirmation dialog
local Screen = require "widgets/screen"
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local Text = require "widgets/text"
local ImageButton = require "widgets/imagebutton"

local ConfirmationDialog = Class(Screen, function(self, title, message, on_confirm, on_cancel)
    Screen._ctor(self, "ConfirmationDialog")
    
    self.on_confirm = on_confirm
    self.on_cancel = on_cancel
    
    -- Create black background for dimming
    self.black = self:AddChild(Image("images/global.xml", "square.tex"))
    self.black:SetVRegPoint(ANCHOR_MIDDLE)
    self.black:SetHRegPoint(ANCHOR_MIDDLE)
    self.black:SetVAnchor(ANCHOR_MIDDLE)
    self.black:SetHAnchor(ANCHOR_MIDDLE)
    self.black:SetScaleMode(SCALEMODE_FILLSCREEN)
    self.black:SetTint(0, 0, 0, 0.7)
    
    -- Create root widget
    self.root = self:AddChild(Widget("root"))
    self.root:SetVAnchor(ANCHOR_MIDDLE)
    self.root:SetHAnchor(ANCHOR_MIDDLE)
    self.root:SetPosition(0, 0, 0)
    self.root:SetScaleMode(SCALEMODE_PROPORTIONAL)
    
    -- Create panel
    self.panel = self.root:AddChild(Image("images/ui.xml", "panel.tex"))
    self.panel:SetSize(400, 250)
    
    -- Create title
    self.title = self.panel:AddChild(Text(TITLEFONT, 40, title))
    self.title:SetPosition(0, 80)
    
    -- Create message
    self.message = self.panel:AddChild(Text(BODYFONT, 25, message))
    self.message:SetPosition(0, 10)
    self.message:SetRegionSize(350, 100)
    self.message:EnableWordWrap(true)
    
    -- Create buttons
    self.confirm_btn = self.panel:AddChild(ImageButton("images/ui.xml", "button.tex", "button_focus.tex"))
    self.confirm_btn:SetPosition(-80, -70)
    self.confirm_btn:SetText("Confirm")
    self.confirm_btn:SetOnClick(function()
        TheFrontEnd:PopScreen()
        if self.on_confirm then
            self.on_confirm()
        end
    end)
    
    self.cancel_btn = self.panel:AddChild(ImageButton("images/ui.xml", "button.tex", "button_focus.tex"))
    self.cancel_btn:SetPosition(80, -70)
    self.cancel_btn:SetText("Cancel")
    self.cancel_btn:SetOnClick(function()
        TheFrontEnd:PopScreen()
        if self.on_cancel then
            self.on_cancel()
        end
    end)
    
    -- Set up focus navigation
    self.confirm_btn:SetFocusChangeDir(MOVE_RIGHT, self.cancel_btn)
    self.cancel_btn:SetFocusChangeDir(MOVE_LEFT, self.confirm_btn)
    
    -- Set default focus
    self.default_focus = self.cancel_btn
end)

function ConfirmationDialog:OnControl(control, down)
    if Screen.OnControl(self, control, down) then return true end
    
    if not down and control == CONTROL_CANCEL then
        TheFrontEnd:PopScreen()
        if self.on_cancel then
            self.on_cancel()
        end
        return true
    end
    
    return false
end

-- Usage
local dialog = ConfirmationDialog(
    "Confirm Action",
    "Are you sure you want to perform this action? It cannot be undone.",
    function()
        print("User confirmed")
    end,
    function()
        print("User cancelled")
    end
)

TheFrontEnd:PushScreen(dialog)
```

## Custom HUD Elements

### Custom Status Badge

```lua
-- Define a custom status badge for the HUD
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local Text = require "widgets/text"

local CustomStatusBadge = Class(Widget, function(self, owner, icon, max_value)
    Widget._ctor(self, "CustomStatusBadge")
    
    self.owner = owner
    self.max_value = max_value or 100
    self.current_value = max_value
    
    -- Create background
    self.bg = self:AddChild(Image("images/ui.xml", "status_bg.tex"))
    self.bg:SetSize(60, 60)
    
    -- Create icon
    self.icon = self:AddChild(Image("images/ui.xml", icon or "health.tex"))
    self.icon:SetSize(40, 40)
    
    -- Create meter ring
    self.ring = self:AddChild(Image("images/ui.xml", "status_meter.tex"))
    self.ring:SetSize(65, 65)
    
    -- Create value text
    self.text = self:AddChild(Text(NUMBERFONT, 20, tostring(self.current_value)))
    self.text:SetPosition(0, -40)
    
    -- Start updating
    self:StartUpdating()
end)

function CustomStatusBadge:SetValue(value)
    value = math.max(0, math.min(self.max_value, value))
    if value ~= self.current_value then
        self.current_value = value
        
        -- Update visual representation
        local percent = value / self.max_value
        self.ring:SetTint(1, 1, 1, percent)
        self.text:SetString(tostring(math.floor(value)))
        
        -- Add visual feedback for low values
        if percent < 0.25 then
            self.icon:SetTint(1, 0.3, 0.3, 1)  -- Red tint when low
            if not self.pulsing then
                self.pulsing = true
            end
        else
            self.icon:SetTint(1, 1, 1, 1)
            self.pulsing = false
        end
    end
end

function CustomStatusBadge:OnUpdate(dt)
    -- Pulse animation when low
    if self.pulsing then
        local t = GetTime() % 1
        local scale = 0.9 + 0.2 * math.sin(t * 2 * math.pi)
        self.icon:SetScale(scale)
    else
        self.icon:SetScale(1)
    end
    
    -- Here you would typically read the actual value from the owner
    -- Example: self:SetValue(self.owner.components.health.currenthealth)
end

-- Usage
local badge = CustomStatusBadge(ThePlayer, "health.tex", 100)
badge:SetValue(75)
```

## Advanced UI Techniques

### Draggable Window

```lua
-- Define a draggable window widget
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local Text = require "widgets/text"
local ImageButton = require "widgets/imagebutton"

local DraggableWindow = Class(Widget, function(self, title, width, height)
    Widget._ctor(self, "DraggableWindow")
    
    self.width = width or 400
    self.height = height or 300
    
    -- Create panel
    self.bg = self:AddChild(Image("images/ui.xml", "panel.tex"))
    self.bg:SetSize(self.width, self.height)
    
    -- Create title bar
    self.title_bar = self:AddChild(Image("images/ui.xml", "title_bar.tex"))
    self.title_bar:SetSize(self.width, 40)
    self.title_bar:SetPosition(0, self.height/2 - 20)
    
    -- Create title
    self.title = self.title_bar:AddChild(Text(TITLEFONT, 25, title))
    self.title:SetPosition(0, 0)
    
    -- Create close button
    self.close_btn = self.title_bar:AddChild(ImageButton("images/ui.xml", "close.tex", "close_focus.tex"))
    self.close_btn:SetPosition(self.width/2 - 20, 0)
    self.close_btn:SetScale(0.7)
    self.close_btn:SetOnClick(function()
        self:Hide()
        if self.on_close then
            self.on_close()
        end
    end)
    
    -- Create content container
    self.content = self:AddChild(Widget("content"))
    self.content:SetPosition(0, -20)
    
    -- Make window draggable
    self.dragging = false
    self.drag_offset = Vector3(0, 0, 0)
    self.title_bar:SetClickable(true)
end)

function DraggableWindow:AddContent(widget)
    return self.content:AddChild(widget)
end

function DraggableWindow:OnMouseButton(button, down, x, y)
    if Widget.OnMouseButton(self, button, down, x, y) then 
        return true 
    end
    
    -- Handle dragging from title bar
    if self.title_bar:IsVisible() then
        local title_bar_pos = self.title_bar:GetWorldPosition()
        local w = self.width
        local h = 40
        
        if math.abs(x - title_bar_pos.x) < w/2 and math.abs(y - title_bar_pos.y) < h/2 then
            if button == MOUSEBUTTON_LEFT then
                if down then
                    -- Start dragging
                    self.dragging = true
                    local window_pos = self:GetWorldPosition()
                    self.drag_offset = Vector3(window_pos.x - x, window_pos.y - y, 0)
                    self:StartUpdating()
                    return true
                else
                    -- Stop dragging
                    self.dragging = false
                    self:StopUpdating()
                    return true
                end
            end
        end
    end
    
    return false
end

function DraggableWindow:OnUpdate(dt)
    if self.dragging then
        local pos = TheInput:GetScreenPosition()
        local new_pos = pos + self.drag_offset
        self:SetPosition(new_pos)
    end
end

-- Usage
local window = DraggableWindow("My Window", 300, 200)
local text = window:AddContent(Text(BODYFONT, 20, "This is a draggable window!\nDrag the title bar to move it."))
text:SetPosition(0, 0)

window.on_close = function()
    print("Window was closed")
end
```

### Tabbed Interface

```lua
-- Define a tabbed interface widget
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local Text = require "widgets/text"
local ImageButton = require "widgets/imagebutton"

local TabbedPanel = Class(Widget, function(self, width, height)
    Widget._ctor(self, "TabbedPanel")
    
    self.width = width or 400
    self.height = height or 300
    self.tabs = {}
    self.active_tab = nil
    
    -- Create panel
    self.bg = self:AddChild(Image("images/ui.xml", "panel.tex"))
    self.bg:SetSize(self.width, self.height)
    
    -- Create tab bar
    self.tab_bar = self:AddChild(Widget("tab_bar"))
    self.tab_bar:SetPosition(0, self.height/2 - 20)
    
    -- Create content area
    self.content = self:AddChild(Widget("content"))
    self.content:SetPosition(0, -10)
end)

function TabbedPanel:AddTab(title, content_fn)
    local tab_index = #self.tabs + 1
    local tab_width = 100
    
    -- Create tab button
    local tab_btn = self.tab_bar:AddChild(ImageButton(
        "images/ui.xml", 
        "tab.tex", 
        "tab_selected.tex"
    ))
    tab_btn:SetPosition((tab_index - 1) * tab_width - self.width/2 + tab_width/2, 0)
    tab_btn:SetText(title)
    tab_btn:SetTextSize(20)
    tab_btn:SetScale(0.8)
    
    -- Create tab content (initially hidden)
    local tab_content = self.content:AddChild(Widget("tab_" .. tab_index))
    content_fn(tab_content)
    tab_content:Hide()
    
    -- Store tab data
    local tab = {
        index = tab_index,
        title = title,
        button = tab_btn,
        content = tab_content
    }
    
    table.insert(self.tabs, tab)
    
    -- Set up button click
    tab_btn:SetOnClick(function()
        self:SelectTab(tab_index)
    end)
    
    -- Set up focus navigation
    if tab_index > 1 then
        tab_btn:SetFocusChangeDir(MOVE_LEFT, self.tabs[tab_index-1].button)
        self.tabs[tab_index-1].button:SetFocusChangeDir(MOVE_RIGHT, tab_btn)
    end
    
    -- If this is the first tab, select it
    if tab_index == 1 then
        self:SelectTab(1)
    end
    
    return tab
end

function TabbedPanel:SelectTab(index)
    -- Hide all tab contents and deselect all buttons
    for _, tab in ipairs(self.tabs) do
        tab.content:Hide()
        tab.button:SetTextures("images/ui.xml", "tab.tex", "tab_selected.tex")
    end
    
    -- Show selected tab content and select button
    if self.tabs[index] then
        self.tabs[index].content:Show()
        self.tabs[index].button:SetTextures("images/ui.xml", "tab_selected.tex", "tab_selected.tex")
        self.active_tab = index
    end
end

-- Usage
local tabbed_panel = TabbedPanel(400, 300)

tabbed_panel:AddTab("General", function(parent)
    local text = parent:AddChild(Text(BODYFONT, 20, "General settings tab content"))
    text:SetPosition(0, 0)
end)

tabbed_panel:AddTab("Audio", function(parent)
    local text = parent:AddChild(Text(BODYFONT, 20, "Audio settings tab content"))
    text:SetPosition(0, 0)
end)

tabbed_panel:AddTab("Video", function(parent)
    local text = parent:AddChild(Text(BODYFONT, 20, "Video settings tab content"))
    text:SetPosition(0, 0)
end)
```

## Best Practices

1. **Component Reusability**: Design widgets to be reusable across different screens and mods
2. **Focus Management**: Always set up proper focus navigation for controller support
3. **Cleanup**: Call `widget:Kill()` when removing widgets to prevent memory leaks
4. **Event Handling**: Return `true` from event handlers to prevent event propagation when appropriate
5. **Scaling**: Use `SetScaleMode` appropriately for different screen resolutions
6. **Performance**: Minimize the number of widgets and avoid creating them frequently
7. **Visual Feedback**: Provide clear visual feedback for hover, focus, and click states
8. **Accessibility**: Ensure all interactive elements can be navigated with a controller
9. **Consistency**: Follow DST's UI style for a consistent user experience
10. **Testing**: Test your UI on different resolutions and with both mouse and controller input

By following these examples and best practices, you can create rich, interactive UI elements for your Don't Starve Together mods that integrate seamlessly with the game's existing interface.
