---
id: ui-events
title: UI Events
sidebar_position: 16
last_updated: 2023-07-06
---

# UI Events

Don't Starve Together's UI system provides a comprehensive event handling system that allows widgets to respond to user input. This document covers how to handle various input events in your UI elements.

## Event Propagation

Events in DST's UI system follow a hierarchical propagation model:

1. Events start at the root widget (typically a screen)
2. They are passed down to child widgets that have focus
3. If a widget handles the event, it returns `true` to stop propagation
4. If no widget handles the event, it bubbles back up to parent widgets

```lua
function MyWidget:OnControl(control, down)
    if MyWidget._base.OnControl(self, control, down) then 
        return true  -- Child already handled this event
    end
    
    if control == CONTROL_ACCEPT and not down then
        -- Handle the event
        print("Widget activated!")
        return true  -- Stop propagation
    end
    
    return false  -- Let parent widgets handle it
end
```

## Focus System

The focus system determines which widget receives input events:

- Only one widget can have focus at a time
- Focus flows down the widget hierarchy
- Parent widgets know which of their children has focus
- Focus can be moved between widgets with navigation controls

```lua
-- Set focus to this widget
widget:SetFocus()

-- Clear focus from this widget
widget:ClearFocus()

-- Check if widget has focus
if widget.focus then
    -- Widget has focus
end

-- Set focus direction for controller/keyboard navigation
widget:SetFocusChangeDir(MOVE_UP, other_widget)
widget:SetFocusChangeDir(MOVE_DOWN, another_widget)
widget:SetFocusChangeDir(MOVE_LEFT, left_widget)
widget:SetFocusChangeDir(MOVE_RIGHT, right_widget)
```

## Common Input Events

### Mouse Events

```lua
function MyWidget:OnMouseButton(button, down, x, y)
    if MyWidget._base.OnMouseButton(self, button, down, x, y) then 
        return true 
    end
    
    if button == MOUSEBUTTON_LEFT and down then
        print("Left mouse button pressed at", x, y)
        return true
    elseif button == MOUSEBUTTON_RIGHT and down then
        print("Right mouse button pressed at", x, y)
        return true
    end
    
    return false
end
```

Mouse button constants:
- `MOUSEBUTTON_LEFT` - Left mouse button
- `MOUSEBUTTON_RIGHT` - Right mouse button
- `MOUSEBUTTON_MIDDLE` - Middle mouse button (scroll wheel)
- `MOUSEBUTTON_SCROLLUP` - Scroll wheel up
- `MOUSEBUTTON_SCROLLDOWN` - Scroll wheel down

### Keyboard Events

```lua
function MyWidget:OnRawKey(key, down)
    if MyWidget._base.OnRawKey(self, key, down) then 
        return true 
    end
    
    if key == KEY_SPACE and down then
        print("Space key pressed")
        return true
    elseif key == KEY_ESCAPE and not down then
        print("Escape key released")
        return true
    end
    
    return false
end
```

Common key constants:
- `KEY_A` through `KEY_Z` - Letter keys
- `KEY_0` through `KEY_9` - Number keys
- `KEY_F1` through `KEY_F12` - Function keys
- `KEY_SPACE` - Space bar
- `KEY_ENTER` - Enter key
- `KEY_ESCAPE` - Escape key
- `KEY_BACKSPACE` - Backspace key
- `KEY_TAB` - Tab key
- `KEY_SHIFT` - Shift key
- `KEY_CTRL` - Control key
- `KEY_ALT` - Alt key
- `KEY_UP`, `KEY_DOWN`, `KEY_LEFT`, `KEY_RIGHT` - Arrow keys

### Text Input

```lua
function MyWidget:OnTextInput(text)
    if MyWidget._base.OnTextInput(self, text) then 
        return true 
    end
    
    print("Text input:", text)
    return true
end
```

### Controller Events

```lua
function MyWidget:OnControl(control, down)
    if MyWidget._base.OnControl(self, control, down) then 
        return true 
    end
    
    if control == CONTROL_ACCEPT and not down then
        print("Accept button pressed (A/Cross)")
        return true
    elseif control == CONTROL_CANCEL and not down then
        print("Cancel button pressed (B/Circle)")
        return true
    end
    
    return false
end
```

Common control constants:
- `CONTROL_ACCEPT` - A button (Xbox) / Cross button (PlayStation)
- `CONTROL_CANCEL` - B button (Xbox) / Circle button (PlayStation)
- `CONTROL_MENU_MISC_1` - X button (Xbox) / Square button (PlayStation)
- `CONTROL_MENU_MISC_2` - Y button (Xbox) / Triangle button (PlayStation)
- `CONTROL_MOVE_UP`, `CONTROL_MOVE_DOWN`, `CONTROL_MOVE_LEFT`, `CONTROL_MOVE_RIGHT` - D-pad or left stick
- `CONTROL_PAUSE` - Start button
- `CONTROL_MAP` - Select/Back button
- `CONTROL_SCROLLBACK`, `CONTROL_SCROLLFWD` - Shoulder buttons

## Focus Callbacks

Widgets can implement callbacks for focus events:

```lua
function MyWidget:OnGainFocus()
    MyWidget._base.OnGainFocus(self)
    self:SetScale(1.1)  -- Grow when focused
    self.text:SetColour(1, 1, 0, 1)  -- Yellow text when focused
end

function MyWidget:OnLoseFocus()
    MyWidget._base.OnLoseFocus(self)
    self:SetScale(1.0)  -- Normal size when not focused
    self.text:SetColour(1, 1, 1, 1)  -- White text when not focused
end
```

You can also set callback functions:

```lua
widget:SetOnGainFocus(function()
    print("Widget gained focus")
end)

widget:SetOnLoseFocus(function()
    print("Widget lost focus")
end)
```

## Custom Event Handlers

You can create custom event handlers for specific widgets:

```lua
-- Create a button that responds to hover
local MyHoverButton = Class(ImageButton, function(self, atlas, normal, focus)
    ImageButton._ctor(self, atlas, normal, focus)
    
    self.hover = false
    self.last_hover_time = 0
end)

function MyHoverButton:OnUpdate(dt)
    local pos = TheInput:GetScreenPosition()
    local wx, wy = self:GetWorldPosition():Get()
    local w, h = self.image:GetSize()
    
    local hover = math.abs(pos.x - wx) < w/2 and math.abs(pos.y - wy) < h/2
    
    if hover ~= self.hover then
        self.hover = hover
        if hover then
            self:OnHoverStart()
        else
            self:OnHoverEnd()
        end
    end
    
    if self.hover then
        self.last_hover_time = self.last_hover_time + dt
        self:OnHover(self.last_hover_time)
    else
        self.last_hover_time = 0
    end
end

function MyHoverButton:OnHoverStart()
    self.image:SetScale(1.1)
end

function MyHoverButton:OnHoverEnd()
    self.image:SetScale(1.0)
end

function MyHoverButton:OnHover(time)
    -- Do something while hovering
    if time > 2.0 and not self.tooltip_shown then
        self.tooltip_shown = true
        print("Show tooltip after 2 seconds of hover")
    end
end
```

## Global Input Handlers

For handling input at a global level (not tied to a specific widget):

```lua
-- Add a global handler for keyboard input
local keyboard_handler = TheInput:AddKeyHandler(function(key, down)
    if key == KEY_F1 and down then
        print("F1 pressed - show help")
        return true
    end
    return false
end)

-- Add a global handler for mouse movement
local mouse_move_handler = TheInput:AddMouseMoveHandler(function(x, y)
    -- Track mouse position
    print("Mouse moved to", x, y)
end)

-- Add a global handler for all input types
local general_handler = TheInput:AddGeneralHandler(function(key, down)
    if key == KEY_ESCAPE and not down then
        print("Escape key released globally")
        return true
    end
    return false
end)

-- Remove handlers when no longer needed
TheInput:RemoveHandler(keyboard_handler)
TheInput:RemoveHandler(mouse_move_handler)
TheInput:RemoveHandler(general_handler)
```

For a practical example of input handling in mods, see the [Geometric Placement case study](/docs/api-vanilla/examples/case-geometric), which demonstrates how to implement hotkeys for toggling grid geometries and controlling placement behavior.

For detailed information on the input system and TheInput object, see the [Input System documentation](/docs/api-vanilla/global-objects/input).

## Event Priorities

Events are processed in a specific order:

1. Focused widget and its children
2. Global input handlers
3. Game default controls

This means that UI elements with focus will always get first chance to handle input.

## Common Event Patterns

### Click Handler

```lua
-- Simple click handler for a widget
function MyWidget:SetOnClick(fn)
    self.onclick = fn
    self:SetClickable(true)
end

function MyWidget:OnControl(control, down)
    if MyWidget._base.OnControl(self, control, down) then return true end
    
    if self.enabled and control == CONTROL_ACCEPT then
        if down then
            self.down = true
            return true
        elseif self.down then
            self.down = false
            if self.onclick then
                self.onclick()
            end
            return true
        end
    end
    
    return false
end
```

### Drag and Drop

```lua
-- Make a widget draggable
function MakeDraggable(widget)
    widget.dragging = false
    widget.drag_offset = Vector3(0, 0, 0)
    
    widget:SetClickable(true)
    
    function widget:OnMouseButton(button, down, x, y)
        if button == MOUSEBUTTON_LEFT then
            if down then
                -- Start dragging
                local wx, wy = self:GetWorldPosition():Get()
                self.drag_offset = Vector3(wx - x, wy - y, 0)
                self.dragging = true
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
    
    function widget:OnUpdate(dt)
        if self.dragging then
            local pos = TheInput:GetScreenPosition()
            local new_pos = pos + self.drag_offset
            self:SetPosition(new_pos)
        end
    end
    
    return widget
end

-- Usage
local my_draggable = MakeDraggable(Image("images/ui.xml", "panel.tex"))
```

### Hover Effects

```lua
-- Add hover effects to a widget
function AddHoverEffects(widget, scale_factor, tint_colour)
    scale_factor = scale_factor or 1.1
    tint_colour = tint_colour or {1, 0.8, 0.2, 1}
    
    local orig_scale = widget:GetScale()
    local orig_colour = {1, 1, 1, 1}
    if widget.image then
        orig_colour = widget.image:GetTint()
    end
    
    widget.hover = false
    
    function widget:OnMouseButton(button, down, x, y)
        if widget._base.OnMouseButton then
            if widget._base.OnMouseButton(self, button, down, x, y) then 
                return true 
            end
        end
        
        return false
    end
    
    function widget:OnUpdate(dt)
        local pos = TheInput:GetScreenPosition()
        local wx, wy = self:GetWorldPosition():Get()
        local w, h = 100, 100
        if self.image then
            w, h = self.image:GetSize()
        end
        
        local new_hover = math.abs(pos.x - wx) < w/2 and math.abs(pos.y - wy) < h/2
        
        if new_hover ~= self.hover then
            self.hover = new_hover
            if new_hover then
                self:ScaleTo(orig_scale, orig_scale * scale_factor, 0.1)
                if self.image then
                    self.image:SetTint(tint_colour[1], tint_colour[2], tint_colour[3], tint_colour[4])
                end
            else
                self:ScaleTo(self:GetScale(), orig_scale, 0.1)
                if self.image then
                    self.image:SetTint(orig_colour[1], orig_colour[2], orig_colour[3], orig_colour[4])
                end
            end
        end
    end
    
    widget:StartUpdating()
    
    return widget
end

-- Usage
local hover_button = AddHoverEffects(ImageButton("images/ui.xml", "button.tex", "button_focus.tex"))
```

## Best Practices

1. **Always Call Base Methods**: Call the parent class's event handlers first and check their return value
2. **Return True When Handled**: Return `true` from event handlers when you've handled the event to prevent further propagation
3. **Consistent Focus Handling**: Implement both `OnGainFocus` and `OnLoseFocus` for widgets that change appearance when focused
4. **Clean Up Handlers**: Remove global input handlers when they're no longer needed
5. **Avoid Polling**: Use event handlers instead of checking input state every frame when possible
6. **Support Multiple Input Methods**: Make sure your UI works with both mouse/keyboard and controller
7. **Visual Feedback**: Provide clear visual feedback for hover, focus, and click states
8. **Performance**: Avoid creating new functions or tables in event handlers that run frequently
9. **Error Handling**: Wrap callbacks in pcall to prevent crashes from user input
10. **Accessibility**: Ensure all interactive elements can be navigated with a controller 
