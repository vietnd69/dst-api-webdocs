---
id: debugmenu
title: Debug Menu
description: Framework for creating text-based debug menu systems with navigation and interaction capabilities
sidebar_position: 5
slug: game-scripts/core-systems/debugmenu
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Debug Menu

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `debugmenu` module provides a framework for creating text-based interactive menus for debugging purposes. It includes menu option classes and a text menu system that supports navigation, option selection, and nested submenus.

## Usage Example

```lua
local debugmenu = require("debugmenu")
local menu = debugmenu.TextMenu("Debug Menu")

-- Create menu options
local options = {
    debugmenu.DoAction("Test Action", function() print("Action executed") end),
    debugmenu.CheckBox("Toggle Feature", 
        function() return feature_enabled end,
        function(val) feature_enabled = val end),
    debugmenu.NumericToggle("Adjust Value", 0, 100, 
        function() return current_value end,
        function(val) current_value = val end),
}

menu:PushOptions(options)
```

## Classes

### MenuOption

**Status:** `stable`

**Description:**
Base class for all menu options. Provides the foundation for menu interaction.

**Constructor:**
```lua
MenuOption(str)
```

**Parameters:**
- `str` (string|function): Display text or function that returns display text

#### Methods

##### MenuOption:Left(menu) {#menuoption-left}

**Status:** `stable`

**Description:**
Called when the left arrow key is pressed on this option.

**Parameters:**
- `menu` (TextMenu): The menu instance containing this option

##### MenuOption:Right(menu) {#menuoption-right}

**Status:** `stable`

**Description:**
Called when the right arrow key is pressed on this option.

**Parameters:**
- `menu` (TextMenu): The menu instance containing this option

##### MenuOption:Accept(menu) {#menuoption-accept}

**Status:** `stable`

**Description:**
Called when the enter/select key is pressed on this option.

**Parameters:**
- `menu` (TextMenu): The menu instance containing this option

##### MenuOption:Cancel(menu) {#menuoption-cancel}

**Status:** `stable`

**Description:**
Called when the cancel/back key is pressed on this option.

**Parameters:**
- `menu` (TextMenu): The menu instance containing this option

**Returns:**
- (boolean): Result of menu:Pop() operation

### DoAction

**Status:** `stable`

**Description:**
Menu option that executes a function when selected.

**Constructor:**
```lua
DoAction(str, fn)
```

**Parameters:**
- `str` (string|function): Display text
- `fn` (function): Function to execute when option is accepted

**Example:**
```lua
local quit_option = DoAction("Quit Game", function(menu) 
    game_running = false 
end)
```

### Submenu

**Status:** `stable`

**Description:**
Menu option that opens a nested submenu when selected.

**Constructor:**
```lua
Submenu(str, options, name)
```

**Parameters:**
- `str` (string): Display text for the submenu option
- `options` (table): Array of menu options for the submenu
- `name` (string): Title for the submenu

**Example:**
```lua
local sub_options = {
    DoAction("Sub Action", function() print("Sub action") end)
}
local submenu = Submenu("Settings", sub_options, "Settings Menu")
```

### NumericToggle

**Status:** `stable`

**Description:**
Menu option for adjusting numeric values with left/right arrow keys.

**Constructor:**
```lua
NumericToggle(str, min, max, getfn, setfn, step)
```

**Parameters:**
- `str` (string): Display text prefix
- `min` (number): Minimum allowed value
- `max` (number): Maximum allowed value  
- `getfn` (function): Function that returns current value
- `setfn` (function): Function that sets new value
- `step` (number): Step size for value changes (default: 1)

**Example:**
```lua
local volume_toggle = NumericToggle("Volume", 0, 100,
    function() return current_volume end,
    function(val) current_volume = val end,
    5)
```

### CheckBox

**Status:** `stable`

**Description:**
Menu option for toggling boolean values.

**Constructor:**
```lua
CheckBox(str, getfn, setfn)
```

**Parameters:**
- `str` (string): Display text prefix
- `getfn` (function): Function that returns current boolean value
- `setfn` (function): Function that sets new boolean value

**Example:**
```lua
local debug_checkbox = CheckBox("Debug Mode",
    function() return debug_enabled end,
    function(val) debug_enabled = val end)
```

### TextMenu

**Status:** `stable`

**Description:**
Main menu system that manages menu state, navigation, and option display.

**Constructor:**
```lua
TextMenu(name)
```

**Parameters:**
- `name` (string): Title for the menu (default: "MENU")

#### Methods

##### TextMenu:PushOptions(options, name) {#textmenu-pushoptions}

**Status:** `stable`

**Description:**
Pushes a new set of options onto the menu stack, creating a new menu level.

**Parameters:**
- `options` (table): Array of MenuOption instances
- `name` (string): Optional title for this menu level

##### TextMenu:Pop() {#textmenu-pop}

**Status:** `stable`

**Description:**
Removes the current menu level and returns to the previous level.

**Returns:**
- (boolean): true if pop was successful, false if at root level

##### TextMenu:Up() {#textmenu-up}

**Status:** `stable`

**Description:**
Moves cursor to the previous menu option (wraps to bottom).

##### TextMenu:Down() {#textmenu-down}

**Status:** `stable`

**Description:**
Moves cursor to the next menu option (wraps to top).

##### TextMenu:Left() {#textmenu-left}

**Status:** `stable`

**Description:**
Calls Left() on the currently selected menu option.

##### TextMenu:Right() {#textmenu-right}

**Status:** `stable`

**Description:**
Calls Right() on the currently selected menu option.

##### TextMenu:Accept() {#textmenu-accept}

**Status:** `stable`

**Description:**
Calls Accept() on the currently selected menu option.

##### TextMenu:Cancel() {#textmenu-cancel}

**Status:** `stable`

**Description:**
Calls Cancel() on the currently selected menu option.

##### TextMenu:GetOption() {#textmenu-getoption}

**Status:** `stable`

**Description:**
Gets the currently selected menu option.

**Returns:**
- (MenuOption): The currently selected option, or nil if no options

##### TextMenu:AtRoot() {#textmenu-atroot}

**Status:** `stable`

**Description:**
Checks if the menu is at the root level.

**Returns:**
- (boolean): true if at root level (one or fewer option sets)

## Complete Example

```lua
local debugmenu = require("debugmenu")

-- Create menu system
local menu = debugmenu.TextMenu("Game Debug Menu")

-- Game state variables
local god_mode = false
local spawn_count = 5

-- Create submenu options
local spawn_options = {
    debugmenu.DoAction("Spawn Tree", function() 
        SpawnPrefab("evergreen")
    end),
    debugmenu.DoAction("Spawn Rock", function() 
        SpawnPrefab("rock1")
    end),
}

-- Create main menu options
local main_options = {
    debugmenu.CheckBox("God Mode", 
        function() return god_mode end,
        function(val) god_mode = val end),
    debugmenu.NumericToggle("Spawn Count", 1, 50,
        function() return spawn_count end,
        function(val) spawn_count = val end),
    debugmenu.Submenu("Spawn Items", spawn_options, "Spawn Menu"),
    debugmenu.DoAction("Quit", function(menu) 
        menu_active = false
    end),
}

menu:PushOptions(main_options)

-- Menu display (would be called in update loop)
print(tostring(menu))
```

## Related Modules

- [Debug Commands](./debugcommands.md): Command-line debugging interface
- [Debug Tools](./debugtools.md): General debugging utilities
- [Console Commands](./consolecommands.md): Console command system
