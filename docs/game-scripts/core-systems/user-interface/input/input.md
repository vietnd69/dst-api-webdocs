---
id: input
title: Input System
description: Comprehensive input handling for keyboard, mouse, controllers, and virtual controls
sidebar_position: 1
slug: game-scripts/core-systems/input
last_updated: 2025-06-25
build_version: 676312
change_status: modified
---

# Input System

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676312 | 2025-06-25 | modified | Enhanced player validation in ResolveVirtualControls and added validation line numbers |
| 676042 | 2025-06-21 | stable | Previous version |

## Overview

The `input.lua` script provides the core input management system for Don't Starve Together, handling keyboard, mouse, and controller inputs across multiple platforms. It manages event processing, control mapping, virtual controls, and input device coordination to create a unified input experience across different hardware configurations.

## Usage Example

```lua
-- Access the global input system
local input = TheInput

-- Add input handlers
input:AddKeyDownHandler(KEY_SPACE, function() print("Space pressed") end)
input:AddControlHandler(CONTROL_PRIMARY, function(control, down) 
    if down then print("Primary action") end 
end)

-- Check input states
if input:IsKeyDown(KEY_W) then
    -- Handle movement
end
```

## Core Input Class

### Input Class Constructor

```lua
Input = Class(function(self)
    self.onkey = EventProcessor()         -- All key events
    self.onkeyup = EventProcessor()       -- Key release events
    self.onkeydown = EventProcessor()     -- Key press events
    self.onmousebutton = EventProcessor() -- Mouse button events
    self.position = EventProcessor()      -- Mouse position events
    self.oncontrol = EventProcessor()     -- Control events
    self.ontextinput = EventProcessor()   -- Text input events
    self.ongesture = EventProcessor()     -- Gesture events
end)
```

**Properties:**
- `hoverinst`: Currently hovered entity
- `mouse_enabled`: Whether mouse input is active
- `controllerid_cached`: Cached active controller ID
- `entitiesundermouse`: List of entities under mouse cursor

## Input Device Management

### Controller Management

#### TheInput:DisableAllControllers()

**Status:** `stable`

**Description:**
Disables all connected controllers except the primary input device.

**Example:**
```lua
TheInput:DisableAllControllers()
```

#### TheInput:EnableAllControllers()

**Status:** `stable`

**Description:**
Enables all connected controllers that are physically connected.

#### TheInput:ControllerAttached()

**Status:** `stable`

**Description:**
Checks if a controller is currently attached and active.

**Returns:**
- (boolean): True if controller is active, false otherwise

#### TheInput:GetInputDevices()

**Status:** `stable`

**Description:**
Returns a list of all connected input devices with their identifiers.

**Returns:**
- (table): Array of device info tables with `text` and `data` fields

**Example:**
```lua
local devices = TheInput:GetInputDevices()
for i, device in ipairs(devices) do
    print("Device:", device.text, "ID:", device.data)
end
```

### Mouse Control

#### TheInput:EnableMouse(enable)

**Status:** `stable`

**Description:**
Enables or disables mouse input functionality.

**Parameters:**
- `enable` (boolean): Whether to enable mouse input

**Example:**
```lua
TheInput:EnableMouse(true)  -- Enable mouse
TheInput:EnableMouse(false) -- Disable mouse
```

## Event Handler Registration

### Keyboard Events

#### TheInput:AddKeyDownHandler(key, fn)

**Status:** `stable`

**Description:**
Registers a function to be called when a specific key is pressed down.

**Parameters:**
- `key` (number): Key constant (e.g., KEY_SPACE, KEY_W)
- `fn` (function): Callback function to execute

**Returns:**
- (object): Event handler reference for removal

#### TheInput:AddKeyUpHandler(key, fn)

**Status:** `stable`

**Description:**
Registers a function to be called when a specific key is released.

### Mouse Events

#### TheInput:AddMouseButtonHandler(fn)

**Status:** `stable`

**Description:**
Registers a function to be called for mouse button events.

**Parameters:**
- `fn` (function): Callback function receiving (button, down, x, y) parameters

#### TheInput:AddMoveHandler(fn)

**Status:** `stable`

**Description:**
Registers a function to be called when the mouse moves.

**Parameters:**
- `fn` (function): Callback function receiving (x, y) parameters

### Control Events

#### TheInput:AddControlHandler(control, fn)

**Status:** `stable`

**Description:**
Registers a function to be called when a specific control is activated.

**Parameters:**
- `control` (number): Control constant (e.g., CONTROL_PRIMARY, CONTROL_MOVE_UP)
- `fn` (function): Callback function receiving (control, digitalvalue, analogvalue) parameters

**Example:**
```lua
TheInput:AddControlHandler(CONTROL_PRIMARY, function(control, down, analog)
    if down then
        print("Primary action pressed with analog value:", analog)
    end
end)
```

#### TheInput:AddGeneralControlHandler(fn)

**Status:** `stable`

**Description:**
Registers a function to be called for all control events.

**Parameters:**
- `fn` (function): Callback function receiving (control, digitalvalue, analogvalue) parameters

## Input State Queries

### Keyboard State

#### TheInput:IsKeyDown(key)

**Status:** `stable`

**Description:**
Checks if a specific key is currently pressed.

**Parameters:**
- `key` (number): Key constant to check

**Returns:**
- (boolean): True if key is currently pressed

### Mouse State

#### TheInput:IsMouseDown(button)

**Status:** `stable`

**Description:**
Checks if a specific mouse button is currently pressed.

**Parameters:**
- `button` (number): Mouse button constant

**Returns:**
- (boolean): True if mouse button is currently pressed

### Control State

#### TheInput:IsControlPressed(control)

**Status:** `stable`

**Description:**
Checks if a control is currently pressed, including virtual control resolution.

**Parameters:**
- `control` (number): Control constant or virtual control ID

**Returns:**
- (boolean): True if control is currently active

#### TheInput:GetAnalogControlValue(control)

**Status:** `stable`

**Description:**
Gets the analog value for a control (useful for analog sticks, triggers).

**Parameters:**
- `control` (number): Control constant

**Returns:**
- (number): Analog value between 0.0 and 1.0

## Virtual Controls System

### Virtual Control Resolution

#### TheInput:ResolveVirtualControls(control)

**Status:** `modified in build 676312`

**Description:**
Resolves virtual controls to actual control inputs based on current control scheme and game state. Enhanced with improved player validation for better stability.

**Parameters:**
- `control` (number): Virtual control ID or regular control ID

**Returns:**
- (number|nil): Resolved control ID or nil if control should be ignored

**Player Validation Enhancement (Build 676312):**
Improved null-checking for player entities to prevent potential crashes when HUD components are not available.

```lua
-- Previous validation (could access HUD on nil player)
if not (player and player.HUD and player.HUD:IsCraftingOpen()) then

-- Enhanced validation (ensures player exists before HUD access)
if player and not (player.HUD and player.HUD:IsCraftingOpen()) then
```

**Virtual Control Categories:**
- **Camera Controls**: VIRTUAL_CONTROL_CAMERA_ZOOM_IN to VIRTUAL_CONTROL_CAMERA_ROTATE_RIGHT
- **Aiming Controls**: VIRTUAL_CONTROL_AIM_UP to VIRTUAL_CONTROL_AIM_RIGHT  
- **Inventory Navigation**: VIRTUAL_CONTROL_INV_UP to VIRTUAL_CONTROL_INV_RIGHT
- **Inventory Actions**: VIRTUAL_CONTROL_INV_ACTION_UP to VIRTUAL_CONTROL_INV_ACTION_RIGHT
- **Strafe Controls**: VIRTUAL_CONTROL_STRAFE_UP to VIRTUAL_CONTROL_STRAFE_RIGHT

### Control Schemes

#### TheInput:GetActiveControlScheme(schemeId)

**Status:** `stable`

**Description:**
Gets the currently active control scheme for a specific scheme category.

**Parameters:**
- `schemeId` (number): Scheme category ID (e.g., CONTROL_SCHEME_CAM_AND_INV)

**Returns:**
- (number): Active scheme number (1-8)

**Control Scheme Types:**
1. **Scheme 1**: Classic style with direct remappable controls
2. **Schemes 2-3**: R-Stick navigation with optional modifier
3. **Schemes 4-7**: D-Pad navigation with advanced twin-stick support
4. **Even Schemes**: Require modifier button for camera controls
5. **Schemes 4-7**: Support free aiming and camera movement

#### TheInput:SupportsControllerFreeAiming()

**Status:** `stable`

**Description:**
Checks if the current control scheme supports free aiming with analog sticks.

**Returns:**
- (boolean): True if free aiming is supported (schemes 4-7)

#### TheInput:SupportsControllerFreeCamera()

**Status:** `stable`

**Description:**
Checks if the current control scheme supports free camera movement.

**Returns:**
- (boolean): True if free camera is supported (schemes 2-7)

## Position and Entity Detection

### World Position

#### TheInput:GetWorldPosition()

**Status:** `stable`

**Description:**
Gets the world position corresponding to the current mouse cursor position.

**Returns:**
- (Vector3|nil): World position vector or nil if invalid

#### TheInput:GetWorldXZWithHeight(height)

**Status:** `stable`

**Description:**
Projects screen position to world XZ coordinates at a specific height.

**Parameters:**
- `height` (number): Y-axis height for projection

**Returns:**
- (number, number): World X and Z coordinates

### Entity Detection

#### TheInput:GetWorldEntityUnderMouse()

**Status:** `stable`

**Description:**
Gets the world entity currently under the mouse cursor.

**Returns:**
- (Entity|nil): World entity under mouse or nil

#### TheInput:GetHUDEntityUnderMouse()

**Status:** `stable`

**Description:**
Gets the HUD/UI entity currently under the mouse cursor.

**Returns:**
- (Entity|nil): HUD entity under mouse or nil

#### TheInput:GetAllEntitiesUnderMouse()

**Status:** `stable`

**Description:**
Gets all entities under the mouse cursor, ordered by depth.

**Returns:**
- (table): Array of entities under mouse cursor

## Text Input and Virtual Keyboard

### Virtual Keyboard Management

#### TheInput:OpenVirtualKeyboard(text_widget)

**Status:** `stable`

**Description:**
Opens the platform virtual keyboard for text input (Steam Deck, console).

**Parameters:**
- `text_widget` (Widget): Text widget requesting keyboard input

**Returns:**
- (boolean): True if virtual keyboard was opened successfully

#### TheInput:AbortVirtualKeyboard(for_text_widget)

**Status:** `stable`

**Description:**
Closes the virtual keyboard for a specific text widget.

**Parameters:**
- `for_text_widget` (Widget): Text widget to close keyboard for

#### TheInput:PlatformUsesVirtualKeyboard()

**Status:** `stable`

**Description:**
Checks if the current platform uses virtual keyboards for text input.

**Returns:**
- (boolean): True if platform uses virtual keyboards

### Text Input Events

#### TheInput:AddTextInputHandler(fn)

**Status:** `stable`

**Description:**
Registers a handler for text input events.

**Parameters:**
- `fn` (function): Callback function receiving text parameter

## Control Mapping and Localization

### Control Mapping

#### TheInput:GetLocalizedControl(deviceId, controlId, use_default_mapping, use_control_mapper)

**Status:** `stable`

**Description:**
Gets the localized display name for a control mapping on a specific device.

**Parameters:**
- `deviceId` (number): Input device ID
- `controlId` (number): Control ID to get mapping for
- `use_default_mapping` (boolean): Whether to use default mapping
- `use_control_mapper` (boolean): Whether to use control mapper

**Returns:**
- (string): Localized control name/description

#### TheInput:IsControlMapped(deviceId, controlId)

**Status:** `stable`

**Description:**
Checks if a control is mapped on a specific device.

**Parameters:**
- `deviceId` (number): Input device ID
- `controlId` (number): Control ID to check

**Returns:**
- (boolean): True if control is mapped

### Special Key Detection

#### TheInput:IsPasteKey(key)

**Status:** `stable`

**Description:**
Checks if a key combination represents a paste operation across platforms.

**Parameters:**
- `key` (number): Key being checked

**Returns:**
- (boolean): True if key combination is paste (Ctrl+V, Cmd+V, Shift+Insert)

## Platform Integration

### Platform Detection

The input system automatically adapts to different platforms:
- **Console Platforms**: Optimized for controller input
- **PC Platforms**: Full keyboard/mouse support
- **Steam Deck**: Virtual keyboard integration
- **Cross-Platform**: Unified control mapping

### Performance Optimization

- **Event Caching**: Controller state caching for performance
- **Entity Filtering**: Mouse-through entity filtering
- **Frame-Based Updates**: Input state updates tied to frame rate
- **Memory Management**: Automatic cleanup of event handlers

## Global Functions

The input system provides global callback functions for C++ integration:

```lua
function OnPosition(x, y)           -- Mouse position updates
function OnControl(control, digital, analog)  -- Control events
function OnMouseButton(button, is_up, x, y)  -- Mouse button events
function OnInputKey(key, is_up)     -- Keyboard events
function OnInputText(text)          -- Text input events
function OnGesture(gesture)         -- Touch/gesture events
function OnControlMapped(deviceId, controlId, inputId, hasChanged)  -- Control mapping
```

**Development Enhancement (Build 676312):**
The OnControl function now includes validation line numbers (`ValidateLineNumber(162)` and `ValidateLineNumber(171)`) for debugging and development verification purposes. These checkpoints assist in ensuring code integrity during development phases.

## Common Usage Patterns

### Input Handler Setup

```lua
-- Register multiple input handlers
local input_handlers = {}

-- Keyboard handler
table.insert(input_handlers, TheInput:AddKeyDownHandler(KEY_TAB, function()
    -- Toggle inventory
end))

-- Control handler  
table.insert(input_handlers, TheInput:AddControlHandler(CONTROL_ACTION, function(control, down)
    if down then
        -- Perform action
    end
end))

-- Cleanup function
function CleanupInputHandlers()
    for _, handler in ipairs(input_handlers) do
        handler:Remove()
    end
    input_handlers = {}
end
```

### Virtual Control Integration

```lua
-- Check virtual controls with scheme awareness
local function CheckMovementInput()
    local scheme = TheInput:GetActiveControlScheme(CONTROL_SCHEME_CAM_AND_INV)
    
    if TheInput:SupportsControllerFreeAiming() then
        -- Use twin-stick controls
        local aim_x = TheInput:GetAnalogControlValue(VIRTUAL_CONTROL_AIM_RIGHT) - 
                     TheInput:GetAnalogControlValue(VIRTUAL_CONTROL_AIM_LEFT)
    else
        -- Use traditional controls
        local move_x = TheInput:IsControlPressed(CONTROL_MOVE_RIGHT) and 1 or 0
        move_x = move_x - (TheInput:IsControlPressed(CONTROL_MOVE_LEFT) and 1 or 0)
    end
end
```

## Related Modules

- [Haptics](./haptics.md): Haptic feedback triggered by input events
- [Events](./events.md): Event system used for input event processing
- [Constants](./constants.md): Input constants and control definitions
- [Profile System](mdc:dst-api-webdocs/path/to/profile.md): Control scheme preference storage
