---
id: widget
title: Widget
sidebar_position: 7
---

# Widget

Widgets are UI elements that can be used to create user interfaces in Don't Starve Together. They handle rendering, input, and other UI-related functionality.

## Overview

Widgets are the building blocks of the game's user interface. They can be combined hierarchically to create complex UI layouts. Each widget handles its own rendering, input events, and animations.

## Common Widget Structure

```lua
local MyWidget = Class(Widget, function(self, name)
    Widget._ctor(self, name or "MyWidget")
    
    -- Initialize widget properties
    self.bg = self:AddChild(Image("images/ui.xml", "panel.tex"))
    self.bg:SetScale(2, 2)
    
    self.text = self:AddChild(Text(BODYTEXTFONT, 20))
    self.text:SetString("Hello World")
    self.text:SetPosition(0, 0)
    
    -- Set up callbacks
    self:SetOnClick(function() print("Widget clicked!") end)
end)

function MyWidget:OnGainFocus()
    self.bg:SetTint(1, 1, 0, 1)
    return true
end

function MyWidget:OnLoseFocus()
    self.bg:SetTint(1, 1, 1, 1)
    return true
end

return MyWidget
```

## Widget Hierarchy

Widgets can be organized in a parent-child hierarchy:

```lua
local parent = Widget("ParentWidget")
local child = parent:AddChild(Widget("ChildWidget"))
```

Children inherit properties like visibility and focus from their parents.

## Key Methods

- `AddChild(widget)`: Adds a child widget
- `RemoveChild(widget)`: Removes a child widget
- `SetPosition(x, y, z)`: Sets the widget's position
- `SetScale(x, y, z)`: Sets the widget's scale
- `SetRotation(angle)`: Sets the widget's rotation
- `SetTint(r, g, b, a)`: Sets the widget's color tint
- `SetOnClick(fn)`: Sets a click handler function
- `SetFocus()`: Gives focus to this widget
- `ClearFocus()`: Removes focus from this widget
- `Show()`: Makes the widget visible
- `Hide()`: Makes the widget invisible
- `ScaleTo(from, to, time, fn)`: Animates the widget's scale
- `MoveTo(from, to, time, fn)`: Animates the widget's position

## Common Event Handlers

- `OnControl(control, down)`: Called when a control is pressed/released
- `OnMouseButton(button, down, x, y)`: Called on mouse events
- `OnRawKey(key, down)`: Called on keyboard events
- `OnTextInput(text)`: Called when text is entered
- `OnGainFocus()`: Called when the widget gains focus
- `OnLoseFocus()`: Called when the widget loses focus

## Common Widget Types

- `Text`: Displays text
- `Image`: Displays an image
- `Button`: Clickable button
- `TextButton`: Button with text
- `ImageButton`: Button with an image
- `Menu`: Group of options
- `ScrollableList`: Scrollable list of items
- `TextEdit`: Editable text field

## Related Systems

- UI Screen system
- Animation system 