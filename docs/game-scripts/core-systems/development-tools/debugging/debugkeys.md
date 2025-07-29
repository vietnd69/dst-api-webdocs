---
id: debugkeys
title: Debug Keys
description: Debug key binding system for developer tools, game manipulation, and testing functionality in Don't Starve Together
sidebar_position: 4

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Debug Keys

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current stable implementation |

## Overview

The `debugkeys` module provides a comprehensive debug key binding system for Don't Starve Together, enabling developers to access game manipulation tools, testing functionality, and debug panels through keyboard and mouse shortcuts. This system includes global key bindings, programmer-specific shortcuts, debug window controls, and mouse handling for debug operations.

:::warning Development Only
Debug keys are intended for development and testing purposes only. They are automatically disabled on Steam Deck and require appropriate debug flags to be enabled.
:::

## Usage Example

```lua
-- Register a global debug key
AddGlobalDebugKey(KEY_F1, function()
    print("Global debug key pressed")
    return true
end)

-- Register a game-specific debug key
AddGameDebugKey(KEY_G, function()
    if TheInput:IsKeyDown(KEY_CTRL) then
        c_godmode()
        return true
    end
end)

-- Handle debug key events
DoDebugKey(KEY_G, true) -- Process key down event
```

## Functions

### DoDebugKey(key, down) {#do-debug-key}

**Status:** `stable`

**Description:**
Processes debug key events by calling registered handlers for the specified key.

**Parameters:**
- `key` (number): The key code being processed
- `down` (boolean): Whether the key is being pressed (true) or released (false)

**Returns:**
- (boolean): true if any handler consumed the key event, false otherwise

**Example:**
```lua
-- Process a key down event
local consumed = DoDebugKey(KEY_G, true)
if consumed then
    print("Key was handled by debug system")
end
```

**Version History:**
- Current implementation since build 676042

### AddGameDebugKey(key, fn, down) {#add-game-debug-key}

**Status:** `stable`

**Description:**
Registers a debug key handler that only functions when in active gameplay.

**Parameters:**
- `key` (number): The key code to bind
- `fn` (function): Handler function to call when key is pressed
- `down` (boolean, optional): Whether to trigger on key down (true) or up (false). Default: true

**Example:**
```lua
-- Add a debug key that only works in-game
AddGameDebugKey(KEY_F2, function()
    if c_sel() == TheWorld then
        c_select(TheWorld.net)
    else
        c_select(TheWorld)
    end
    return true
end)
```

**Version History:**
- Current implementation since build 676042

### AddGlobalDebugKey(key, fn, down) {#add-global-debug-key}

**Status:** `stable`

**Description:**
Registers a debug key handler that functions globally, regardless of game state.

**Parameters:**
- `key` (number): The key code to bind
- `fn` (function): Handler function to call when key is pressed
- `down` (boolean, optional): Whether to trigger on key down (true) or up (false). Default: true

**Example:**
```lua
-- Add a global debug key
AddGlobalDebugKey(KEY_HOME, function()
    if not TheSim:IsDebugPaused() then
        TheSim:ToggleDebugPause()
    else
        TheSim:Step()
    end
    return true
end)
```

**Version History:**
- Current implementation since build 676042

### SimBreakPoint() {#sim-break-point}

**Status:** `stable`

**Description:**
Sets a simulation breakpoint by pausing the game if not already paused.

**Example:**
```lua
-- Set a breakpoint in code
SimBreakPoint()
-- Game will pause at this point for debugging
```

**Version History:**
- Current implementation since build 676042

### DoReload() {#do-reload}

**Status:** `stable`

**Description:**
Performs a hot reload of the game scripts by clearing the reload module cache and re-requiring it.

**Example:**
```lua
-- Trigger a hot reload
DoReload()
-- Scripts will be reloaded without restarting the game
```

**Version History:**
- Current implementation since build 676042

### DoDebugMouse(button, down, x, y) {#do-debug-mouse}

**Status:** `stable`

**Description:**
Handles debug mouse events for entity manipulation and debugging.

**Parameters:**
- `button` (number): Mouse button pressed (MOUSEBUTTON_LEFT, MOUSEBUTTON_RIGHT)
- `down` (boolean): Whether button is pressed down
- `x, y` (numbers): Screen coordinates of mouse click

**Mouse Actions:**
- **Right Click + Ctrl + Shift**: Spawn selected prefab at cursor
- **Right Click + Ctrl**: Remove entity under mouse or kill nearby entities
- **Right Click + Alt**: Print distance and angle information
- **Right Click + Shift**: Set entity under mouse as debug target
- **Left Click** (when paused): Set entity under mouse as debug target

**Example:**
```lua
-- Handle mouse events in debug context
DoDebugMouse(MOUSEBUTTON_RIGHT, true, mouseX, mouseY)
```

**Version History:**
- Current implementation since build 676042

### DebugKeyPlayer() {#debug-key-player}

**Status:** `stable`

**Description:**
Gets the player entity for debug operations, only returning a player on master simulation.

**Returns:**
- (Entity|nil): Player entity if on master sim, nil otherwise

**Example:**
```lua
local player = DebugKeyPlayer()
if player then
    player.components.health:DoDelta(25)
end
```

**Version History:**
- Current implementation since build 676042

### d_addemotekeys() {#d-add-emote-keys}

**Status:** `stable`

**Description:**
Registers numpad keys for quick emote access during debugging.

**Emote Key Bindings:**
- **Numpad 0**: Sit emote
- **Numpad 1**: Happy emote
- **Numpad 2**: Joy emote
- **Numpad 3**: Slow clap emote
- **Numpad 4**: No emote
- **Numpad 5**: Angry emote
- **Numpad 6**: Face palm emote
- **Numpad 7**: Impatient emote
- **Numpad 8**: Shrug emote
- **Numpad 9**: Wave emote
- **Numpad Period**: Fist shake emote

**Example:**
```lua
-- Enable emote debug keys
d_addemotekeys()
-- Now numpad keys will trigger emotes
```

**Version History:**
- Current implementation since build 676042

### d_gettiles() {#d-get-tiles}

**Status:** `stable`

**Description:**
Scans a 11x11 area around the player for farming soil tiles and dumps their coordinates.

**Example:**
```lua
-- Find farming soil tiles around player
d_gettiles()
-- Outputs table of tile coordinates to console
```

**Version History:**
- Current implementation since build 676042

## Key Binding Categories

### Global Key Bindings

These key bindings work regardless of game state:

| Key Combination | Function | Description |
|-----|-----|-----|
| **Home** | Pause/Step Game | Pauses game or steps one frame if paused |
| **Ctrl + Home** | Toggle Pause | Toggles pause state |
| **G** | God Mode | Enables/disables god mode |
| **Shift + G** | Super God Mode | God mode + restore health/hunger/sanity |
| **Ctrl + A** | Unlock Recipes | Enables free crafting |
| **F1** | Select Entity | Selects entity under mouse cursor |
| **Ctrl + W** | Toggle IMGUI | Opens/closes debug interface |
| **Shift + F10** | Next Nightmare Phase | Advances nightmare cycle |
| **F10** | Next Day Phase | Advances day/night cycle |

### Programmer Key Bindings

Advanced debugging tools for developers:

| Key Combination | Function | Description |
|-----|-----|-----|
| **Alt + F1** | Select World | Selects world entity for debugging |
| **Ctrl + F1** | Toggle Perf Graph | Shows/hides performance graphs |

### Window Key Bindings

Debug panel shortcuts (requires CAN_USE_DBUI):

| Key Combination | Panel | Description |
|-----|-----|-----|
| **Shift + P** | Prefabs Panel | Opens prefab debugging interface |
| **Shift + A** | Audio Panel | Opens audio debugging tools |
| **Shift + E** | Entity Panel | Opens entity inspection panel |
| **Shift + C** | Console Panel | Opens debug console |
| **Shift + F** | Watch Panel | Opens variable watch panel |
| **Shift + Alt + S** | Skins Panel | Opens skin debugging tools |

### Game Debug Keys

In-game manipulation shortcuts:

| Key Combination | Function | Description |
|-----|-----|-----|
| **F2** | Toggle World Selection | Switches between world and world.net |
| **F3** | Advance Season | Skips to next season |
| **F4** | Spawn Base | Creates a complete base setup |
| **F5** | Weather Control | Lightning/meteor spawning |
| **F7** | Topology Info | Shows world topology information |
| **F8** | Spawn Items in Rings | Creates item rings around player |
| **F9** | Fast Forward | Advances time by 6 hours |
| **T** | Teleport | Teleports to cursor or map position |
| **M** | Map Debug | Toggles fog of war and reveals areas |
| **Ctrl + S** | Save Game | Forces game save |

### Entity Manipulation Keys

| Key Combination | Function | Description |
|-----|-----|-----|
| **X** | Select Entity | Selects entity under mouse |
| **Ctrl + X** | Select Equipped Item | Selects item in player's hands |
| **Ctrl + K** | Remove Entity | Removes entity under mouse |
| **Ctrl + G** | Grow/Manipulate | Grows plants or manipulates entity |

### Player Status Keys

| Key Combination | Function | Description |
|-----|-----|-----|
| **Numpad +** | Restore Stats | Increases health/hunger/sanity |
| **Numpad -** | Drain Stats | Decreases health/hunger/sanity |
| **Ctrl + Numpad +** | Full Restore | Restores all stats to maximum |
| **[ ]** | Time Scale | Adjusts game speed |

## Key Binding System

### Handler Registration

The system uses a table-based approach to store multiple handlers per key:

```lua
handlers = {}

-- Internal handler storage structure
handlers[KEY_G] = {
    function(down) 
        if down and inGamePlay then 
            return godmode_handler() 
        end 
    end,
    function(down) 
        if down then 
            return other_handler() 
        end 
    end
}
```

### Modifier Key Support

The system supports complex key combinations with modifiers:

```lua
local binding = {
    key = KEY_F1,
    CTRL = true,    -- Requires Ctrl to be held
    SHIFT = false,  -- Requires Shift to NOT be held
    ALT = nil       -- Ignores Alt key state
}
```

### Platform Restrictions

```lua
-- Automatically disabled on Steam Deck
if IsSteamDeck() then
    return
end
```

## Debug Mouse Functions

### Right Click Actions

- **Ctrl + Shift + Right Click**: Spawn selected prefab at cursor location
- **Ctrl + Right Click**: Remove entity under mouse or kill nearby entities
- **Alt + Right Click**: Display distance and angle information
- **Shift + Right Click**: Set entity as debug target

### Left Click Actions

- **Left Click** (when game paused): Set entity under mouse as debug target

## Dependencies

### Required Systems
- **Input System**: Keyboard and mouse input handling
- **Debug UI System**: Debug panel management (when CAN_USE_DBUI is enabled)
- **Console System**: Command execution and entity selection
- **Entity Framework**: Entity manipulation and inspection

### Global Functions Used
- `TheInput`: Input state checking and world position
- `TheSim`: Simulation control and debug features
- `TheFrontEnd`: Debug panel management
- `ConsoleCommandPlayer()`: Player entity access
- `ConsoleRemote()`: Remote command execution

### Required Modules
- `consolecommands`: Console command functionality
- `usercommands`: User command system for emotes
- Various `dbui_no_package/*` modules for debug panels

## Configuration Variables

### Debug Flags
```lua
global("CHEATS_ENABLED")         -- Enables cheat functionality
global("CHEATS_KEEP_SAVE")       -- Preserves saves when cheating
global("CHEATS_ENABLE_DPRINT")   -- Enables debug printing
global("CAN_USE_DBUI")           -- Enables debug UI panels
```

### User-Specific Settings
```lua
local userName = TheSim:GetUsersName()
-- Custom debug settings based on username
if CHEATS_ENABLED and userName == "My Username" then
    DPRINT_USERNAME = "My Username"
    CHEATS_KEEP_SAVE = true
    CHEATS_ENABLE_DPRINT = true
end
```

## Usage Guidelines

### Development Best Practices

1. **Key Registration**: Register debug keys early in the loading process
2. **Return Values**: Always return true from handlers that consume the key event
3. **Modifier Checks**: Use modifier key checks for complex combinations
4. **Safety Checks**: Verify entity validity before manipulation

### Common Patterns

```lua
-- Standard debug key pattern
AddGameDebugKey(KEY_EXAMPLE, function()
    if TheInput:IsKeyDown(KEY_CTRL) then
        -- Control variant
        return do_control_action()
    elseif TheInput:IsKeyDown(KEY_SHIFT) then
        -- Shift variant
        return do_shift_action()
    else
        -- Default action
        return do_default_action()
    end
end)
```

### Security Considerations

- **Master Simulation**: Many functions only work on master simulation
- **Entity Validation**: Always check entity validity before manipulation
- **Error Handling**: Include safety checks for debug operations
- **Platform Restrictions**: Automatic disable on restricted platforms

## Related Modules

- [Debug Commands](./debugcommands.md): Command-line debug utilities
- [Debug Helpers](./debughelpers.md): Entity and component inspection tools
- [Console Commands](./consolecommands.md): Built-in console command system
- [Debug Print](./debugprint.md): Debug output utilities

## Notes

- **Platform Support**: Automatically disabled on Steam Deck
- **Debug UI**: Many features require CAN_USE_DBUI flag
- **Performance Impact**: Debug operations can affect game performance
- **Development Tool**: Intended for development and testing only
- **Key Conflicts**: Be aware of potential conflicts with game controls
- **Hot Reload**: Supports hot reloading of scripts for development
- **Network Sync**: Some operations automatically sync between client and server
