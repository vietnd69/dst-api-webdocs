---
id: writeables
title: Writeables
description: User interface system for text input on signs, beefalo naming, and gravestone epitaphs
sidebar_position: 156
slug: api-vanilla/core-systems/writeables
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Writeables

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `writeables` module provides a user interface system for text input on interactive objects in Don't Starve Together. It manages different types of writeable interfaces including signs, beefalo naming, and gravestone epitaphs, each with customizable layouts, prompts, and button configurations.

## Usage Example

```lua
-- Access the writeables system
local writeables = require("writeables")

-- Create a writeable interface for a sign
local screen = writeables.makescreen(sign_inst, player)

-- Add a custom writeable layout
writeables.AddLayout("custom_sign", {
    prompt = "Enter custom text:",
    animbank = "ui_board_5x3",
    animbuild = "ui_board_5x3",
    menuoffset = Vector3(6, -70, 0),
    cancelbtn = { text = "Cancel", cb = nil, control = CONTROL_CANCEL },
    acceptbtn = { text = "Accept", cb = nil, control = CONTROL_ACCEPT }
})

-- Get an existing layout
local layout = writeables.GetLayout("homesign")
```

## Functions

### makescreen(inst, doer) {#makescreen}

**Status:** `stable`

**Description:**
Creates and displays a writeable interface screen for the specified entity and player. The interface type is determined by the entity's prefab name.

**Parameters:**
- `inst` (Entity): The writeable entity (sign, beefalo, gravestone, etc.)
- `doer` (Entity): The player entity that will interact with the interface

**Returns:**
- (Widget): The writeable widget interface if successful
- (nil): If the player doesn't have a HUD or the prefab is not supported

**Example:**
```lua
-- Display sign writing interface
local function OnSignActivated(inst, doer)
    local writeables = require("writeables")
    local screen = writeables.makescreen(inst, doer)
    if screen then
        print("Sign interface opened successfully")
    else
        print("Failed to open sign interface")
    end
end

-- Usage in sign prefab
inst.components.activatable.OnActivate = OnSignActivated
```

**Implementation Details:**
```lua
writeables.makescreen = function(inst, doer)
    local data = kinds[inst.prefab]

    if doer and doer.HUD then
        return doer.HUD:ShowWriteableWidget(inst, data)
    end
end
```

**Version History:**
- Current implementation in build 676042

### AddLayout(name, layout) {#addlayout}

**Status:** `stable`

**Description:**
Registers a new writeable layout configuration for a specific prefab type. Prevents duplicate layouts and provides error logging for debugging.

**Parameters:**
- `name` (string): The prefab name to associate with this layout
- `layout` (table): Layout configuration table containing interface properties

**Returns:**
- None

**Example:**
```lua
-- Add a custom notice board layout
writeables.AddLayout("notice_board", {
    prompt = "Write a notice:",
    animbank = "ui_board_5x3",
    animbuild = "ui_board_5x3", 
    menuoffset = Vector3(6, -70, 0),
    maxcharacters = 100,
    
    cancelbtn = { 
        text = "Cancel", 
        cb = nil, 
        control = CONTROL_CANCEL 
    },
    middlebtn = { 
        text = "Clear", 
        cb = function(inst, doer, widget)
            widget:OverrideText("")
        end, 
        control = CONTROL_MENU_MISC_2 
    },
    acceptbtn = { 
        text = "Post Notice", 
        cb = nil, 
        control = CONTROL_ACCEPT 
    }
})
```

**Layout Configuration Properties:**
- `prompt` (string): Text prompt displayed to the user
- `animbank` (string): Animation bank for the interface
- `animbuild` (string): Animation build for the interface
- `menuoffset` (Vector3): Position offset for the interface
- `maxcharacters` (number, optional): Maximum text length limit
- `defaulttext` (function, optional): Function to generate default text
- `cancelbtn` (table): Cancel button configuration
- `middlebtn` (table, optional): Middle action button configuration
- `acceptbtn` (table): Accept button configuration

**Button Configuration Format:**
```lua
button = {
    text = "Button Text",           -- Display text
    cb = function(inst, doer, widget) end,  -- Callback function (optional)
    control = CONTROL_CONSTANT      -- Input control mapping
}
```

**Error Handling:**
```lua
-- Implementation with duplicate prevention
writeables.AddLayout = function(name, layout)
    if name ~= nil and kinds[name] == nil then
        kinds[name] = layout
    elseif layout ~= nil then
        print("[Writeables Error] adding a duplicate layout "..tostring(name))
    end
end
```

**Version History:**
- Current implementation in build 676042

### GetLayout(name) {#getlayout}

**Status:** `stable`

**Description:**
Retrieves the layout configuration for a specific prefab type.

**Parameters:**
- `name` (string): The prefab name to get the layout for

**Returns:**
- (table): Layout configuration table if found
- (nil): If no layout exists for the given name

**Example:**
```lua
-- Check if a prefab has a writeable layout
local function CanWrite(inst)
    local writeables = require("writeables")
    local layout = writeables.GetLayout(inst.prefab)
    return layout ~= nil
end

-- Get layout properties
local layout = writeables.GetLayout("homesign")
if layout then
    print("Prompt:", layout.prompt)
    print("Has middle button:", layout.middlebtn ~= nil)
end
```

**Version History:**
- Current implementation in build 676042

## Layout Types

### Home Sign Layout {#homesign-layout}

**Status:** `stable`

**Prefabs:** `"homesign"`, `"arrowsign_post"`, `"arrowsign_panel"`

**Description:**
Standard sign layout with random text generation support using SignGenerator.

**Configuration:**
```lua
kinds["homesign"] = {
    prompt = STRINGS.SIGNS.MENU.PROMPT,
    animbank = "ui_board_5x3",
    animbuild = "ui_board_5x3",
    menuoffset = Vector3(6, -70, 0),

    cancelbtn = { 
        text = STRINGS.SIGNS.MENU.CANCEL, 
        cb = nil, 
        control = CONTROL_CANCEL 
    },
    middlebtn = { 
        text = STRINGS.SIGNS.MENU.RANDOM, 
        cb = function(inst, doer, widget)
            widget:OverrideText( SignGenerator(inst, doer) )
        end, 
        control = CONTROL_MENU_MISC_2 
    },
    acceptbtn = { 
        text = STRINGS.SIGNS.MENU.ACCEPT, 
        cb = nil, 
        control = CONTROL_ACCEPT 
    }
}
```

**Features:**
- **Random Generation**: Middle button generates random sign text
- **Shared Layout**: Used by multiple sign prefab types
- **Standard Interface**: Uses common UI board graphics

### Beefalo Naming Layout {#beefalo-layout}

**Status:** `stable`

**Prefabs:** `"beefalo"`

**Description:**
Specialized layout for naming beefalo with character limits and default naming patterns.

**Configuration:**
```lua
kinds["beefalo"] = {
    prompt = STRINGS.SIGNS.MENU.PROMPT_BEEFALO,
    animbank = "ui_board_5x3",
    animbuild = "ui_board_5x3",
    menuoffset = Vector3(6, -70, 0),
    maxcharacters = TUNING.BEEFALO_NAMING_MAX_LENGTH,

    defaulttext = function(inst, doer)
        return subfmt(STRINGS.NAMES.BEEFALO_BUDDY_NAME, { buddy = doer.name })
    end,

    cancelbtn = {
        text = STRINGS.BEEFALONAMING.MENU.CANCEL,
        cb = nil,
        control = CONTROL_CANCEL
    },
    middlebtn = {
        text = STRINGS.BEEFALONAMING.MENU.RANDOM,
        cb = function(inst, doer, widget)
            local name_index = math.random(#STRINGS.BEEFALONAMING.BEEFNAMES)
            widget:OverrideText( STRINGS.BEEFALONAMING.BEEFNAMES[name_index] )
        end,
        control = CONTROL_MENU_MISC_2
    },
    acceptbtn = {
        text = STRINGS.BEEFALONAMING.MENU.ACCEPT,
        cb = nil,
        control = CONTROL_ACCEPT
    }
}
```

**Features:**
- **Character Limit**: Enforces maximum name length via `TUNING.BEEFALO_NAMING_MAX_LENGTH`
- **Default Names**: Generates default name using player's name
- **Random Names**: Selects from predefined beefalo name list
- **Specialized Strings**: Uses beefalo-specific UI strings

### Gravestone Layout {#gravestone-layout}

**Status:** `stable`

**Prefabs:** `"wendy_recipe_gravestone"`

**Description:**
Wendy's gravestone epitaph interface with random epitaph generation.

**Configuration:**
```lua
kinds["wendy_recipe_gravestone"] = {
    prompt = STRINGS.SIGNS.MENU.PROMPT_GRAVESTONE,
    animbank = "ui_board_5x3",
    animbuild = "ui_board_5x3",
    menuoffset = Vector3(6, -70, 0),

    defaulttext = function(inst, doer)
        return STRINGS.WENDY_EPITAPHS[math.random(#STRINGS.WENDY_EPITAPHS)]
    end,

    cancelbtn = { 
        text = STRINGS.SIGNS.MENU.CANCEL, 
        cb = nil, 
        control = CONTROL_CANCEL 
    },
    middlebtn = { 
        text = STRINGS.SIGNS.MENU.RANDOM, 
        cb = function(inst, doer, widget)
            local epitaph_index = math.random(#STRINGS.WENDY_EPITAPHS)
            widget:OverrideText( STRINGS.WENDY_EPITAPHS[epitaph_index] )
        end, 
        control = CONTROL_MENU_MISC_2 
    },
    acceptbtn = { 
        text = STRINGS.SIGNS.MENU.ACCEPT, 
        cb = nil, 
        control = CONTROL_ACCEPT 
    }
}
```

**Features:**
- **Character-Specific**: Designed for Wendy's gravestone crafting
- **Random Epitaphs**: Generates random epitaphs from predefined list
- **Default Generation**: Automatically provides random epitaph on open

## Integration Points

### HUD System Integration

The writeables system integrates with the player's HUD to display interfaces:

```lua
-- Integration with HUD system
if doer and doer.HUD then
    return doer.HUD:ShowWriteableWidget(inst, data)
end
```

**Required Components:**
- **Player HUD**: Must have HUD component for interface display
- **Writeable Widget**: HUD must support `ShowWriteableWidget` method

### String System Integration

Uses game's localization system for interface text:

```lua
-- String references used
STRINGS.SIGNS.MENU.PROMPT         -- Sign prompts
STRINGS.SIGNS.MENU.CANCEL         -- Cancel button text
STRINGS.SIGNS.MENU.ACCEPT         -- Accept button text
STRINGS.SIGNS.MENU.RANDOM         -- Random button text

STRINGS.BEEFALONAMING.MENU.*      -- Beefalo naming interface
STRINGS.BEEFALONAMING.BEEFNAMES   -- Random beefalo names
STRINGS.NAMES.BEEFALO_BUDDY_NAME  -- Default name template

STRINGS.WENDY_EPITAPHS            -- Gravestone epitaphs
```

### Control System Integration

Maps interface actions to game controls:

```lua
-- Control mappings
CONTROL_CANCEL       -- Cancel/close interface
CONTROL_ACCEPT       -- Accept/confirm text
CONTROL_MENU_MISC_2  -- Middle button action (random, clear, etc.)
```

## Data Structures

### Layout Configuration Table

**Type:** `table`

**Status:** `stable`

**Description:** Complete configuration for a writeable interface type.

**Structure:**
```lua
layout = {
    prompt = "string",              -- User prompt text
    animbank = "string",            -- Animation bank name
    animbuild = "string",           -- Animation build name
    menuoffset = Vector3,           -- Interface position offset
    maxcharacters = number,         -- Optional character limit
    defaulttext = function,         -- Optional default text generator
    
    cancelbtn = {                   -- Cancel button config
        text = "string",
        cb = function,              -- Optional callback
        control = CONTROL_CONSTANT
    },
    middlebtn = {                   -- Optional middle button config
        text = "string", 
        cb = function,
        control = CONTROL_CONSTANT
    },
    acceptbtn = {                   -- Accept button config
        text = "string",
        cb = function,              -- Optional callback
        control = CONTROL_CONSTANT
    }
}
```

### Internal Kinds Table

**Type:** `table`

**Status:** `stable`

**Description:** Internal storage for all registered layout configurations.

**Structure:**
```lua
local kinds = {
    ["homesign"] = layout_config,
    ["beefalo"] = layout_config,
    ["wendy_recipe_gravestone"] = layout_config,
    -- Additional custom layouts...
}
```

## Usage Patterns

### Adding Custom Writeables

```lua
-- Define a custom writeable for a new prefab
local function SetupCustomWriteable()
    local writeables = require("writeables")
    
    writeables.AddLayout("magic_scroll", {
        prompt = "Inscribe magical words:",
        animbank = "ui_board_5x3",
        animbuild = "ui_board_5x3",
        menuoffset = Vector3(6, -70, 0),
        maxcharacters = 50,
        
        defaulttext = function(inst, doer)
            return "Ancient words of power..."
        end,
        
        cancelbtn = {
            text = "Cancel",
            cb = nil,
            control = CONTROL_CANCEL
        },
        middlebtn = {
            text = "Mystic Words",
            cb = function(inst, doer, widget)
                local mystical_words = {
                    "Abracadabra", "Hocus Pocus", "Alakazam"
                }
                local index = math.random(#mystical_words)
                widget:OverrideText(mystical_words[index])
            end,
            control = CONTROL_MENU_MISC_2
        },
        acceptbtn = {
            text = "Inscribe",
            cb = nil,
            control = CONTROL_ACCEPT
        }
    })
end
```

### Prefab Integration

```lua
-- Integrate writeable system into a prefab
local function MakeWriteableSign()
    local inst = CreateEntity()
    -- ... basic prefab setup ...
    
    -- Add activatable component for interaction
    inst:AddComponent("activatable")
    inst.components.activatable.OnActivate = function(inst, doer)
        local writeables = require("writeables")
        writeables.makescreen(inst, doer)
    end
    
    return inst
end
```

### Conditional Writeable Access

```lua
-- Control access to writeable interfaces
local function CanPlayerWrite(inst, doer)
    -- Check if player has permission
    if not doer:HasTag("can_write") then
        return false
    end
    
    -- Check if writeable layout exists
    local writeables = require("writeables")
    local layout = writeables.GetLayout(inst.prefab)
    return layout ~= nil
end
```

## Performance Considerations

### Layout Caching

- **Static Registration**: Layouts are registered once during initialization
- **Fast Lookup**: O(1) access via prefab name keys
- **Memory Efficient**: Shared layouts between multiple prefab types

### Interface Management

- **HUD Integration**: Leverages existing HUD widget system
- **Event-Driven**: Only creates interfaces when requested
- **Cleanup**: Automatic cleanup through HUD widget management

## Related Modules

- [Sign Generator](./signgenerator.md): Generates random text for signs
- [Strings](./strings.md): Provides localized text for interfaces
- [HUD System](../widgets/hud.md): Manages interface display
- [Activatable Component](../components/activatable.md): Handles player interaction
- [Input System](./input.md): Maps controls to interface actions
