---
id: input
title: Input System
sidebar_position: 10
---

# Input System

The input system in Don't Starve Together allows mods to interact with keyboard, mouse, gamepad, and touch inputs. At the core of this system is the global `TheInput` object, which provides methods for registering event handlers, checking input states, and managing input configurations.

## TheInput Overview

`TheInput` is a global singleton that manages all input handling in the game. It provides methods for:
- Registering handlers for keyboard, mouse, and controller inputs
- Getting the current state of keys and buttons
- Converting between screen and world coordinates
- Managing focus for UI elements
- Enabling or disabling specific input features

## Key Input Handlers

There are several methods for registering input handlers, each with a different scope:

```lua
-- Handle specific key presses
local key_handler = TheInput:AddKeyHandler(function(key, down)
    if key == KEY_F and down then
        print("F key pressed down!")
        return true -- Return true to consume the input
    end
    return false -- Return false to allow other handlers to process this input
end)

-- Handle key presses only when key is released
local key_up_handler = TheInput:AddKeyUpHandler(KEY_G, function()
    print("G key released!")
end)

-- Handle key presses only when key is pressed
local key_down_handler = TheInput:AddKeyDownHandler(KEY_H, function()
    print("H key pressed!")
end)

-- Handle all input events (keys, controller buttons, etc.)
local general_handler = TheInput:AddGeneralHandler(function(key, down)
    if key == KEY_ESCAPE and not down then
        print("Escape key released!")
        return true
    end
    return false
end)

-- Clean up handlers when not needed
TheInput:RemoveHandler(key_handler)
TheInput:RemoveHandler(key_up_handler)
TheInput:RemoveHandler(key_down_handler)
TheInput:RemoveHandler(general_handler)
```

### Handler Processing Order

Input handlers are processed in a specific order:
1. Focused UI widgets and their children
2. Global input handlers (registered with TheInput methods)
3. Default game controls

This means UI elements with focus will get first chance to handle input events.

## Mouse Input Handling

`TheInput` provides methods for handling mouse input:

```lua
-- Handle mouse movement
local mouse_move_handler = TheInput:AddMouseMoveHandler(function(x, y)
    -- x, y are screen coordinates
    print("Mouse moved to:", x, y)
end)

-- Get current mouse position in screen coordinates
local screen_pos = TheInput:GetScreenPosition()
print("Mouse screen position:", screen_pos.x, screen_pos.y)

-- Convert screen position to world position
local world_pos = TheInput:GetWorldPosition()
print("Mouse world position:", world_pos.x, world_pos.y, world_pos.z)

-- Check if mouse is over a world entity
local entity = TheInput:GetWorldEntityUnderMouse()
if entity then
    print("Mouse is over:", entity.prefab)
end
```

## Controller Support

`TheInput` also handles controller input:

```lua
-- Check if a controller is connected
if TheInput:ControllerAttached() then
    print("Controller is connected")
end

-- Check controller button state (for direct polling)
if TheInput:IsControlPressed(CONTROL_MOVE_UP) then
    print("Moving up with controller")
end
```

## Key and Control Constants

Don't Starve Together provides constants for all keys and controls:

```lua
-- Keyboard key constants
local KEY_CONSTANTS = {
    KEY_A = 65,     -- ASCII value for 'A'
    KEY_SPACE = 32, -- ASCII value for space
    KEY_F1 = 282,   -- Function key F1
    KEY_ESCAPE = 27,
    -- Many more defined in the game
}

-- Control constants (abstract controls that can be mapped to keys or controller buttons)
local CONTROL_CONSTANTS = {
    CONTROL_MOVE_UP = 0,
    CONTROL_MOVE_DOWN = 1,
    CONTROL_MOVE_LEFT = 2,
    CONTROL_MOVE_RIGHT = 3,
    CONTROL_ATTACK = 4,
    CONTROL_ACTION = 5,
    -- Many more defined in the game
}
```

## Screen Resize Handling

`TheInput` can notify your mod when the screen is resized:

```lua
-- Register a handler for screen resize events
local resize_handler = TheInput:AddResizeHandler(function(new_width, new_height)
    print("Screen resized to:", new_width, "x", new_height)
    -- Reposition UI elements based on new dimensions
end)

-- Clean up when no longer needed
TheInput:RemoveHandler(resize_handler)
```

## Input Debugging

`TheInput` includes some debugging utilities:

```lua
-- Enable debug toggle (F8 key)
TheInput:EnableDebugToggle(true)

-- Enable input debugging to print input events
TheInput:EnableInputDebugging()

-- Get all current key/controller bindings
local bindings = TheInput:GetAllBindings()
for control_id, key in pairs(bindings) do
    print(control_id, "is bound to", key)
end
```

## Practical Examples

### Toggle Mod Feature With Hotkey

```lua
-- Toggle a mod feature with the F key
local MOD_ENABLED = false

AddPrefabPostInit("world", function()
    TheInput:AddKeyUpHandler(KEY_F, function()
        MOD_ENABLED = not MOD_ENABLED
        print("Mod is now:", MOD_ENABLED and "ENABLED" or "DISABLED")
    end)
end)
```

### Custom Action Menu

```lua
-- Show a custom action menu when the player holds Shift and right-clicks
local function OnRawKey(key, down)
    if key == KEY_SHIFT and down and TheInput:IsKeyDown(KEY_MOUSE_RIGHT) then
        -- Get world position of mouse
        local pos = TheInput:GetWorldPosition()
        
        -- Get entity under mouse
        local ent = TheInput:GetWorldEntityUnderMouse()
        
        -- Show custom action menu for this entity at this position
        ShowCustomActionMenu(ent, pos)
        return true -- Consume the input
    end
    return false
end

local raw_key_handler = TheInput:AddKeyHandler(OnRawKey)
```

### Draggable UI Element

```lua
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
```

## Best Practices

1. **Always Clean Up Handlers**: Use `TheInput:RemoveHandler()` when your mod is disabled or unloaded
2. **Return true When Handled**: Return `true` from handlers when you've consumed the input
3. **Support Both Control Methods**: Design your mod to work with both keyboard/mouse and controllers
4. **Use Input Buffering**: For actions that require timing, consider implementing input buffering
5. **Don't Block Critical Controls**: Be careful not to interfere with essential game controls
6. **Check Context**: Make sure the input handling is appropriate for the current game state
7. **Throttle Input Processing**: For continuous input (like mouse movement), consider throttling updates
8. **Provide Visual Feedback**: Always give visual feedback when processing input
9. **Handle Multiple Input Methods**: Support both direct key checks and abstract controls
10. **Error Handling**: Wrap callbacks in pcall to prevent crashes from user input

## Related Documentation

- [UI Events](/docs/api-vanilla/core/ui-events) - Event handling for UI widgets
- [UI System](/docs/api-vanilla/core/ui-system) - Overview of the UI system
- [Geometric Placement Case Study](/docs/api-vanilla/examples/case-geometric) - Real-world example of input handling in mods
- [Custom UI Elements](/docs/api-vanilla/examples/custom-ui-elements) - Examples of creating UI elements that respond to input 