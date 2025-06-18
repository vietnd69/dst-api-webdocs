---
id: widget
title: Widget
sidebar_position: 7
last_updated: 2023-07-06
version: 624447
---
*Last Update: 2023-07-06*
# Widget

*API Version: 624447*

Widgets are UI elements that can be used to create user interfaces in Don't Starve Together. They handle rendering, input, and other UI-related functionality.

## Widget properties and methods

Widget provides the following key properties and methods:

- **Properties**
  - `parent` - Parent widget that contains this widget
  - `children` - List of child widgets
  - `position` - Position in screen coordinates
  - `scale` - Scale of the widget
  - `rotation` - Rotation of the widget
  - `visible` - Whether the widget is visible

- **Methods**
  - `AddChild()` - Adds a child widget
  - `RemoveChild()` - Removes a child widget
  - `SetPosition()` - Sets the widget's position
  - `SetScale()` - Sets the widget's scale
  - `Show()` - Makes the widget visible
  - `Hide()` - Makes the widget invisible

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

## Methods

### AddChild(widget: `Widget`): `Widget`

Adds a child widget to this widget.

```lua
-- Add a child widget
local child = self:AddChild(Widget("ChildWidget"))

-- Add a text widget with styling
local text = self:AddChild(Text(BODYTEXTFONT, 20))
text:SetString("Hello World")
text:SetPosition(0, 10)
```

---

### RemoveChild(widget: `Widget`): `void`

Removes a child widget from this widget.

```lua
-- Remove a specific child
self:RemoveChild(self.child)

-- Remove all children
for i = #self.children, 1, -1 do
    self:RemoveChild(self.children[i])
end
```

---

### SetPosition(x: `number`, y: `number`, z: `number`): `void`

Sets the position of this widget in screen coordinates.

```lua
-- Set position with x and y coordinates
self:SetPosition(100, 50)

-- Set position with x, y, and z coordinates
self:SetPosition(100, 50, 0)
```

---

### SetScale(x: `number`, y: `number`, z: `number`): `void`

Sets the scale of this widget.

```lua
-- Set uniform scale
self:SetScale(2)

-- Set different x and y scale
self:SetScale(2, 1)

-- Set x, y, and z scale
self:SetScale(2, 1, 1)
```

---

### SetRotation(angle: `number`): `void`

Sets the rotation of this widget in degrees.

```lua
-- Rotate widget 45 degrees
self:SetRotation(45)
```

---

### SetTint(r: `number`, g: `number`, b: `number`, a: `number`): `void`

Sets the color tint of this widget.

```lua
-- Red tint
self:SetTint(1, 0, 0, 1)

-- Half-transparent blue tint
self:SetTint(0, 0, 1, 0.5)
```

---

### SetOnClick(fn: `Function`): `void`

Sets a function to call when the widget is clicked.

```lua
-- Set click handler
self:SetOnClick(function()
    print("Widget clicked!")
end)

-- Set click handler with access to self
self:SetOnClick(function()
    self.clicked = true
    self:DoSomething()
end)
```

---

### SetFocus(): `boolean`

Gives focus to this widget.

```lua
-- Give focus to this widget
self:SetFocus()
```

---

### ClearFocus(): `void`

Removes focus from this widget.

```lua
-- Clear focus from this widget
self:ClearFocus()
```

---

### Show(): `void`

Makes the widget visible.

```lua
-- Show this widget
self:Show()
```

---

### Hide(): `void`

Makes the widget invisible.

```lua
-- Hide this widget
self:Hide()
```

---

### ScaleTo(from: `number`, to: `number`, time: `number`, fn: `Function`): `void`

Animates the widget's scale over time.

```lua
-- Scale from 1 to 2 over 0.5 seconds
self:ScaleTo(1, 2, 0.5, function() print("Scaling complete") end)
```

---

### MoveTo(from: `Vector3`, to: `Vector3`, time: `number`, fn: `Function`): `void`

Animates the widget's position over time.

```lua
-- Move widget over 0.5 seconds
self:MoveTo(Vector3(0, 0, 0), Vector3(100, 50, 0), 0.5, function() print("Movement complete") end)
```

---

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

## See also

- [Screen](mdc:dst-api-webdocs/docs/api-vanilla/ui/screen.md) - Screens that contain widgets
- [Text](mdc:dst-api-webdocs/docs/api-vanilla/ui/text.md) - Text display widget
- [Image](mdc:dst-api-webdocs/docs/api-vanilla/ui/image.md) - Image display widget 
