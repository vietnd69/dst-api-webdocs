---
id: frontend
title: Frontend
description: Core frontend system managing UI screens, input handling, and visual effects
sidebar_position: 50
slug: api-vanilla/core-systems/frontend
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Frontend

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `Frontend` system is the core UI management layer for Don't Starve Together. It handles screen navigation, input processing, visual effects (fades, overlays), console display, help text, and debug panels. The frontend acts as the bridge between user interactions and the game's UI components.

## Usage Example

```lua
-- Access the global frontend instance
local frontend = TheFrontEnd

-- Push a new screen
frontend:PushScreen(SomeScreenInstance())

-- Apply a fade effect
frontend:Fade(FADE_OUT, 1.0, function()
    print("Fade completed")
end)

-- Show help text
frontend:ShowTitle("Game Title", "Subtitle")
```

## Core Properties

### Screen Management

- **screenstack**: Array of currently active screens
- **screenroot**: Root widget containing all screens
- **overlayroot**: Root widget for overlay elements

### Visual Effects

- **blackoverlay**: Black fade overlay
- **whiteoverlay**: White fade overlay  
- **swipeoverlay**: Swipe transition overlay
- **vigoverlay**: Vignette effect overlay

### UI Elements

- **consoletext**: Console log display widget
- **helptext**: Context-sensitive help text
- **title**: Main title display
- **subtitle**: Subtitle display
- **saving_indicator**: Save operation indicator

## Functions

### PushScreen(screen) {#push-screen}

**Status:** `stable`

**Description:**
Adds a new screen to the top of the screen stack and makes it active.

**Parameters:**
- `screen` (Screen): The screen instance to push

**Example:**
```lua
local my_screen = require("screens/myscreen")()
TheFrontEnd:PushScreen(my_screen)
```

### PopScreen(screen) {#pop-screen}

**Status:** `stable`

**Description:**
Removes a screen from the stack. If no screen is specified, removes the topmost screen.

**Parameters:**
- `screen` (Screen, optional): Specific screen to remove. If nil, removes top screen

**Example:**
```lua
-- Remove top screen
TheFrontEnd:PopScreen()

-- Remove specific screen
TheFrontEnd:PopScreen(my_screen)
```

### Fade(in_or_out, time_to_take, cb, fade_delay_time, delayovercb, fadeType) {#fade}

**Status:** `stable`

**Description:**
Applies a screen fade effect with customizable timing and callback functions.

**Parameters:**
- `in_or_out` (number): FADE_IN or FADE_OUT constant
- `time_to_take` (number): Duration of fade in seconds
- `cb` (function, optional): Callback when fade completes
- `fade_delay_time` (number, optional): Delay before starting fade
- `delayovercb` (function, optional): Callback when delay completes
- `fadeType` (string, optional): "black", "white", "alpha", or "swipe"

**Example:**
```lua
-- Simple black fade out
TheFrontEnd:Fade(FADE_OUT, 1.0)

-- White fade with callback
TheFrontEnd:Fade(FADE_IN, 0.5, function()
    print("Fade in complete")
end, nil, nil, "white")
```

### FadeToScreen(existing_screen, new_screen_fn, fade_complete_cb, fade_type) {#fade-to-screen}

**Status:** `stable`

**Description:**
Fades out current screen, creates and pushes a new screen, then fades back in.

**Parameters:**
- `existing_screen` (Screen): Current screen to fade from
- `new_screen_fn` (function): Function that returns new screen instance
- `fade_complete_cb` (function, optional): Callback when transition completes
- `fade_type` (string, optional): Type of fade effect

**Example:**
```lua
TheFrontEnd:FadeToScreen(current_screen, function()
    return require("screens/mainmenu")()
end, function(new_screen)
    print("Transition to main menu complete")
end, "swipe")
```

### ShowTitle(text, subtext) {#show-title}

**Status:** `stable`

**Description:**
Displays title and subtitle text with fade-in animation.

**Parameters:**
- `text` (string): Main title text
- `subtext` (string): Subtitle text

**Example:**
```lua
TheFrontEnd:ShowTitle("Don't Starve Together", "Wilson's World")
```

### HideTitle() {#hide-title}

**Status:** `stable`

**Description:**
Immediately hides the title and subtitle display.

**Example:**
```lua
TheFrontEnd:HideTitle()
```

### ShowConsoleLog() {#show-console-log}

**Status:** `stable`

**Description:**
Makes the console log output visible on screen.

**Example:**
```lua
TheFrontEnd:ShowConsoleLog()
```

### HideConsoleLog() {#hide-console-log}

**Status:** `stable`

**Description:**
Hides the console log display.

**Example:**
```lua
TheFrontEnd:HideConsoleLog()
```

### GetActiveScreen() {#get-active-screen}

**Status:** `stable`

**Description:**
Returns the currently active (topmost) screen from the stack.

**Returns:**
- (Screen or nil): The active screen, or nil if no screens are active

**Example:**
```lua
local current_screen = TheFrontEnd:GetActiveScreen()
if current_screen then
    print("Current screen:", current_screen.name)
end
```

### GetFocusWidget() {#get-focus-widget}

**Status:** `stable`

**Description:**
Returns the widget that currently has input focus.

**Returns:**
- (Widget or nil): The focused widget

**Example:**
```lua
local focused = TheFrontEnd:GetFocusWidget()
if focused then
    print("Focused widget:", focused.name)
end
```

### OnControl(control, down) {#on-control}

**Status:** `stable`

**Description:**
Handles control input events and routes them to appropriate handlers.

**Parameters:**
- `control` (number): Control constant (CONTROL_PRIMARY, CONTROL_ACCEPT, etc.)
- `down` (boolean): True if control pressed, false if released

**Returns:**
- (boolean): True if input was handled

**Example:**
```lua
-- Internal usage - called by input system
local handled = TheFrontEnd:OnControl(CONTROL_PRIMARY, true)
```

### SetFadeLevel(alpha, time, time_total) {#set-fade-level}

**Status:** `stable`

**Description:**
Directly sets the fade overlay opacity level.

**Parameters:**
- `alpha` (number): Opacity level (0-1)
- `time` (number, optional): Current time in fade
- `time_total` (number, optional): Total fade duration

**Example:**
```lua
-- Set half opacity
TheFrontEnd:SetFadeLevel(0.5)
```

### GetFadeLevel() {#get-fade-level}

**Status:** `stable`

**Description:**
Returns the current fade overlay opacity level.

**Returns:**
- (number): Current fade level (0-1)

**Example:**
```lua
local fade_level = TheFrontEnd:GetFadeLevel()
if fade_level > 0 then
    print("Screen is faded")
end
```

### ShowSavingIndicator() {#show-saving-indicator}

**Status:** `stable`

**Description:**
Displays the saving indicator animation on console platforms.

**Example:**
```lua
TheFrontEnd:ShowSavingIndicator()
```

### HideSavingIndicator() {#hide-saving-indicator}

**Status:** `stable`

**Description:**
Hides the saving indicator animation.

**Example:**
```lua
TheFrontEnd:HideSavingIndicator()
```

### StopTrackingMouse(autofocus) {#stop-tracking-mouse}

**Status:** `stable`

**Description:**
Disables mouse tracking for focus management and optionally sets default focus.

**Parameters:**
- `autofocus` (boolean, optional): If true, sets default focus on active screen

**Example:**
```lua
-- Stop mouse tracking and set default focus
TheFrontEnd:StopTrackingMouse(true)
```

## Debug Functions

### ToggleImgui(node) {#toggle-imgui}

**Status:** `stable`

**Description:**
Toggles the ImGui debug interface on/off.

**Parameters:**
- `node` (DebugNode, optional): Specific debug node to open

**Example:**
```lua
-- Toggle debug interface
TheFrontEnd:ToggleImgui()
```

### CreateDebugPanel(node) {#create-debug-panel}

**Status:** `stable`

**Description:**
Creates and opens a new debug panel for the specified node type.

**Parameters:**
- `node` (DebugNode): Debug node instance to create panel for

**Returns:**
- (DebugPanel): The created debug panel

**Example:**
```lua
local entity_panel = TheFrontEnd:CreateDebugPanel(DebugEntity())
```

### IsDebugPanelOpen(nodename) {#is-debug-panel-open}

**Status:** `stable`

**Description:**
Checks if a debug panel with the specified name is currently open.

**Parameters:**
- `nodename` (string): Name of the debug node

**Returns:**
- (boolean): True if panel is open

**Example:**
```lua
if TheFrontEnd:IsDebugPanelOpen("EntityDebugger") then
    print("Entity debugger is open")
end
```

## Constants

### FADE_IN / FADE_OUT

**Values:** `1` / `0`

**Status:** `stable`

**Description:** Constants for specifying fade direction.

### Screen Fade Times

**Values:** Various time constants

**Status:** `stable`

**Description:** Default timing values for screen transitions.

## Events

The Frontend system doesn't emit custom events but handles standard input and system events internally.

## Common Usage Patterns

### Screen Transitions

```lua
-- Simple screen change
TheFrontEnd:PopScreen()
TheFrontEnd:PushScreen(new_screen)

-- Smooth transition with fade
TheFrontEnd:FadeToScreen(current_screen, function()
    return new_screen
end, nil, "swipe")
```

### Fade Effects

```lua
-- Loading screen pattern
TheFrontEnd:Fade(FADE_OUT, 0.5, function()
    -- Load resources
    DoHeavyOperation()
    
    TheFrontEnd:Fade(FADE_IN, 0.5)
end)
```

### Debug Interface

```lua
-- Open entity debugger
if CHEATS_ENABLED then
    TheFrontEnd:ToggleImgui()
    TheFrontEnd:CreateDebugPanel(DebugEntity())
end
```

## Related Modules

- [Widget](./widget.md): Base widget system that Frontend manages
- [Screen Classes](../screens/): Various screen implementations
- [Input System](./input.md): Input handling and control mapping
- [Easing](./easing.md): Animation easing functions used for fades
