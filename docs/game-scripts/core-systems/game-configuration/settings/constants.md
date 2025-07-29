---
id: constants
title: Constants System
description: Comprehensive documentation of Don't Starve Together global constants and configuration values
sidebar_position: 2

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Constants System

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

## Core Categories

The constants system consists of several categories of global values:

- **Mathematical & Physical Constants**: Basic mathematical values and game physics
- **Input & Control Constants**: Player input mappings and control schemes
- **Character & Game Data**: Player characters, items, and game entities
- **UI & Rendering Constants**: Interface scaling, layers, and visual elements
- **Technical Constants**: Engine-level values and system configurations

## Mathematical Constants

### Core Mathematical Values

```lua
PI = math.pi                    -- 3.14159...
PI2 = PI * 2                   -- 2π (6.28...)
TWOPI = PI2                    -- Alias for PI2
SQRT2 = math.sqrt(2)           -- √2 (1.414...)
GOLDENANGLE = PI * (3 - math.sqrt(5))  -- Golden angle in radians
DEGREES = PI / 180             -- Degree to radian conversion
RADIANS = 180 / PI             -- Radian to degree conversion
```

### Game Timing Constants

```lua
FRAMES = 1/30                  -- Time per frame (30 FPS)
TILE_SCALE = 4                 -- World tile scale factor
MAXUINT = 4294967295          -- Maximum unsigned integer
```

### Screen and Camera Constants

```lua
RESOLUTION_X = 1280           -- Default screen width
RESOLUTION_Y = 720            -- Default screen height

-- Player vision and camera
PLAYER_REVEAL_RADIUS = 30.0
PLAYER_REVEAL_RADIUS_SQ = PLAYER_REVEAL_RADIUS * PLAYER_REVEAL_RADIUS
PLAYER_CAMERA_SEE_DISTANCE = 40.0
PLAYER_CAMERA_SHOULD_SNAP_DISTANCE = 20.0

-- UI scaling limits
MAX_FE_SCALE = 3              -- Maximum frontend scale
MAX_HUD_SCALE = 1.25          -- Maximum HUD scale
```

## Direction and Positioning Constants

### Facing Directions

Entities can face eight cardinal and ordinal directions plus a neutral state:

```lua
FACING_RIGHT = 0
FACING_UP = 1
FACING_LEFT = 2
FACING_DOWN = 3
FACING_UPRIGHT = 4
FACING_UPLEFT = 5
FACING_DOWNRIGHT = 6
FACING_DOWNLEFT = 7
FACING_NONE = 8
```

### Movement Directions

```lua
MOVE_UP = 1
MOVE_DOWN = 2
MOVE_LEFT = 3
MOVE_RIGHT = 4
```

### Anchor Points

```lua
ANCHOR_MIDDLE = 0
ANCHOR_LEFT = 1
ANCHOR_RIGHT = 2
ANCHOR_TOP = 1
ANCHOR_BOTTOM = 2
```

## Rendering and Visual Constants

### Rendering Layers

Z-order layers for rendering different elements:

```lua
LAYER_BACKDROP = 0
LAYER_BELOW_OCEAN = 1
LAYER_BELOW_GROUND = 2
LAYER_GROUND = 3
LAYER_BACKGROUND = 4
LAYER_WORLD_BACKGROUND = 5
LAYER_WORLD = 6
LAYER_WORLD_DEBUG = 7          -- Client-only layers start here
LAYER_FRONTEND = 8
LAYER_FRONTEND_DEBUG = 9
```

### Scale Modes

```lua
SCALEMODE_NONE = 0
SCALEMODE_FILLSCREEN = 1       -- Stretch to fit/fill window
SCALEMODE_PROPORTIONAL = 2     -- Preserve aspect ratio
SCALEMODE_FIXEDPROPORTIONAL = 3 -- Fixed proportional with safe area
SCALEMODE_FIXEDSCREEN_NONDYNAMIC = 4 -- Scale with window scaling
```

### Animation Orientations

```lua
ANIM_ORIENTATION = {
    BillBoard = 0,             -- Always face camera
    OnGround = 1,              -- Lie flat on ground
    OnGroundFixed = 2,         -- Fixed ground orientation
}
```

## Input and Control Constants

### Primary Actions

Core player actions mapped to input controls:

```lua
-- Primary actions
CONTROL_PRIMARY = 0            -- Primary button (left click/A button)
CONTROL_SECONDARY = 1          -- Secondary button (right click/B button)
CONTROL_ATTACK = 2             -- Force attack
CONTROL_INSPECT = 3            -- Examine/inspect
CONTROL_ACTION = 4             -- Context action

-- Movement controls
CONTROL_MOVE_UP = 5           -- Move up/north
CONTROL_MOVE_DOWN = 6         -- Move down/south
CONTROL_MOVE_LEFT = 7         -- Move left/west
CONTROL_MOVE_RIGHT = 8        -- Move right/east

-- Camera controls
CONTROL_ZOOM_IN = 9           -- Zoom camera in
CONTROL_ZOOM_OUT = 10         -- Zoom camera out
CONTROL_ROTATE_LEFT = 11      -- Rotate camera left
CONTROL_ROTATE_RIGHT = 12     -- Rotate camera right
```

### Interface Controls

```lua
CONTROL_PAUSE = 13            -- Pause/main menu
CONTROL_MAP = 14              -- World map
CONTROL_OPEN_INVENTORY = 45   -- Inventory screen
CONTROL_OPEN_CRAFTING = 46    -- Crafting menu

-- Inventory slot controls (CONTROL_INV_1 through CONTROL_INV_15)
CONTROL_INV_1 = 15
CONTROL_INV_2 = 16
-- ... continues to CONTROL_INV_15 = 81
```

### Advanced Controls

```lua
-- Force actions
CONTROL_FORCE_INSPECT = 38
CONTROL_FORCE_ATTACK = 39
CONTROL_FORCE_TRADE = 40
CONTROL_FORCE_STACK = 41

-- Communication
CONTROL_TOGGLE_SAY = 63       -- Chat
CONTROL_TOGGLE_WHISPER = 64   -- Whisper
CONTROL_SHOW_PLAYER_STATUS = 67

-- Special functions
CONTROL_OPEN_DEBUG_CONSOLE = 42
CONTROL_TOGGLE_LOG = 43
CONTROL_TOGGLE_DEBUGRENDER = 44
```

### Keyboard Key Constants

All keyboard keys are mapped to constants:

```lua
-- Special keys
KEY_TAB = 9
KEY_ENTER = 13
KEY_ESCAPE = 27
KEY_SPACE = 32
KEY_BACKSPACE = 8

-- Letter keys (KEY_A = 97 through KEY_Z = 122)
KEY_A = 97
KEY_B = 98
-- ... continues through alphabet

-- Number keys (KEY_0 = 48 through KEY_9 = 57)
KEY_0 = 48
KEY_1 = 49
-- ... continues through numbers

-- Function keys (KEY_F1 = 282 through KEY_F12 = 293)
KEY_F1 = 282
KEY_F2 = 283
-- ... continues through function keys

-- Arrow keys
KEY_UP = 273
KEY_DOWN = 274
KEY_RIGHT = 275
KEY_LEFT = 276
```

### Mouse Button Constants

```lua
MOUSEBUTTON_LEFT = 1000
MOUSEBUTTON_RIGHT = 1001
MOUSEBUTTON_MIDDLE = 1002
MOUSEBUTTON_SCROLLUP = 1003
MOUSEBUTTON_SCROLLDOWN = 1004
```

## Character System Constants

### Playable Characters

Main list of playable characters in DST:

```lua
DST_CHARACTERLIST = {
    "wilson",      -- The Scientist
    "willow",      -- The Firestarter
    "wolfgang",    -- The Strongman
    "wendy",       -- The Bereaved
    "wx78",        -- The Soulless Automaton
    "wickerbottom", -- The Librarian
    "woodie",      -- The Lumberjack
    "wes",         -- The Silent
    "waxwell",     -- The Puppet Master
    "wathgrithr",  -- The Valkyrie
    "webber",      -- The Indigestible
    "winona",      -- The Handywoman
    "warly",       -- The Chef
    "wortox",      -- The Soul Starved
    "wormwood",    -- The Lonesome
    "wurt",        -- The Curious
    "walter",      -- The Fearless
    "wanda",       -- The Timekeeper
    "wonkey",      -- Hidden internal character
}
```

### Character Genders

Characters categorized by gender for pronoun and dialogue systems:

```lua
CHARACTER_GENDERS = {
    FEMALE = {
        "willow", "wendy", "wickerbottom", "wathgrithr",
        "winona", "wurt", "wanda",
    },
    MALE = {
        "wilson", "woodie", "waxwell", "wolfgang", "wes",
        "webber", "warly", "wortox", "wormwood", "walter",
    },
    ROBOT = {
        "wx78", "pyro",
    },
    NEUTRAL = {},  -- For modders to add to
    PLURAL = {},   -- For modders to add to
}
```

### Special Character Lists

```lua
-- Characters for seamless swapping (internal use)
SEAMLESSSWAP_CHARACTERLIST = {
    "wonkey",
}

-- Legacy character lists (not used in DST)
MAIN_CHARACTERLIST = { /* Original DS characters */ }
ROG_CHARACTERLIST = { /* Reign of Giants characters */ }
```

## Item and Equipment Constants

### Equipment Slots

```lua
EQUIPSLOTS = {
    HANDS = "hands",   -- Tools and weapons
    HEAD = "head",     -- Hats and helmets
    BODY = "body",     -- Armor and clothing
    BEARD = "beard",   -- WX-78 facial equipment
}
```

### Item Tags

```lua
ITEMTAG = {
    FOOD = "food",
    MEAT = "meat",
    WEAPON = "weapon",
    TOOL = "tool",
    TREASURE = "treasure",
    FUEL = "fuel",
    FIRE = "fire",
    STACKABLE = "stackable",
    FX = "FX",
}
```

### Maximum Item Slots

```lua
MAXITEMSLOTS = 15  -- Maximum inventory slots
```

## World and Environment Constants

### Ground Types (Legacy)

⚠️ **Deprecated**: The GROUND table is deprecated and should not be used. Nothing should add to or reference this table.

```lua
GROUND = {
    INVALID = 65535,
    IMPASSABLE = 1,
    ROAD = 2,
    ROCKY = 3,
    DIRT = 4,
    SAVANNA = 5,
    GRASS = 6,
    FOREST = 7,
    -- ... many more ground types (deprecated)
```

### Ocean Depth

```lua
OCEAN_DEPTH = {
    SHALLOW = 1,
    NORMAL = 2,
    DEEP = 3,
    VERY_DEEP = 4,
}
```

### Seasons

```lua
SEASONS = {
    AUTUMN = "autumn",
    WINTER = "winter",
    SPRING = "spring",
    SUMMER = "summer",
    CAVES = "caves",
}
```

## Technology and Crafting Constants

### Technology Requirements

The TECH system defines crafting station requirements:

```lua
TECH = {
    NONE = TechTree.Create(),
    
    -- Science levels
    SCIENCE_ONE = { SCIENCE = 1 },
    SCIENCE_TWO = { SCIENCE = 2 },
    SCIENCE_THREE = { SCIENCE = 3 },
    
    -- Magic levels (starts at 2)
    MAGIC_TWO = { MAGIC = 2 },
    MAGIC_THREE = { MAGIC = 3 },
    
    -- Ancient technology
    ANCIENT_TWO = { ANCIENT = 2 },
    ANCIENT_THREE = { ANCIENT = 3 },
    ANCIENT_FOUR = { ANCIENT = 4 },
    
    -- Celestial technology
    CELESTIAL_ONE = { CELESTIAL = 1 },
    CELESTIAL_THREE = { CELESTIAL = 3 },
    
    -- Other tech trees
    SHADOW_TWO = { SHADOW = 3 },
    SEAFARING_ONE = { SEAFARING = 1 },
    SEAFARING_TWO = { SEAFARING = 2 },
    -- ... many more technology types
}
```

### Recipe Tabs

Crafting menu organization:

```lua
RECIPETABS = {
    TOOLS =     { str = "TOOLS",     sort = 0, icon = "tab_tool.tex" },
    LIGHT =     { str = "LIGHT",     sort = 1, icon = "tab_light.tex" },
    SURVIVAL =  { str = "SURVIVAL",  sort = 2, icon = "tab_trap.tex" },
    FARM =      { str = "FARM",      sort = 3, icon = "tab_farm.tex" },
    SCIENCE =   { str = "SCIENCE",   sort = 4, icon = "tab_science.tex" },
    WAR =       { str = "WAR",       sort = 5, icon = "tab_fight.tex" },
    TOWN =      { str = "TOWN",      sort = 6, icon = "tab_build.tex" },
    SEAFARING = { str = "SEAFARING", sort = 7, icon = "tab_seafaring.tex" },
    REFINE =    { str = "REFINE",    sort = 8, icon = "tab_refine.tex" },
    MAGIC =     { str = "MAGIC",     sort = 9, icon = "tab_arcane.tex" },
    DRESS =     { str = "DRESS",     sort = 10, icon = "tab_dress.tex" },
}
```

## Color Constants

### Standard UI Colors

```lua
BGCOLOURS = {
    RED =    RGB(255, 89,  46),
    PURPLE = RGB(184, 87,  198),
    YELLOW = RGB(255, 196, 45),
    GREY =   RGB(75,  75,  75),
    HALF =   RGB(128, 128, 128),
    FULL =   RGB(255, 255, 255),
}
```

### Web Colors

Standard HTML color palette:

```lua
WEBCOLOURS = {
    -- Reds
    SALMON =    RGB(250, 128, 114),
    CRIMSON =   RGB(220, 20, 60),
    FIREBRICK = RGB(178, 34, 34),
    RED =       RGB(255, 0, 0),
    
    -- Blues
    LIGHTSKYBLUE =   RGB(135, 206, 250),
    CORNFLOWERBLUE = RGB(100, 149, 237),
    BLUE =           RGB(0, 0, 255),
    
    -- Greens
    GREEN =       RGB(0, 128, 0),
    SPRINGGREEN = RGB(0, 255, 127),
    
    -- ... many more web colors
}
```

### Player Colors

Game-appropriate color palette for players:

```lua
PLAYERCOLOURS = {
    BLUE =        RGB(149, 191, 242),
    YELLOW =      RGB(222, 222, 99),
    GREEN =       RGB(59,  222, 99),
    CORAL =       RGB(216, 60,  84),
    TEAL =        RGB(150, 206, 169),
    LAVENDER =    RGB(206, 145, 192),
    -- ... more player colors
}
```

## Event and Special Content Constants

### Special Events

```lua
SPECIAL_EVENTS = {
    NONE = "none",
    HALLOWED_NIGHTS = "hallowed_nights",
    WINTERS_FEAST = "winters_feast",
    CARNIVAL = "crow_carnival",
    YOTG = "year_of_the_gobbler",
    YOTV = "year_of_the_varg",
    YOTP = "year_of_the_pig",
    YOTC = "year_of_the_carrat",
    YOTB = "year_of_the_beefalo",
    YOT_CATCOON = "year_of_the_catcoon",
    YOTR = "year_of_the_bunnyman",
    YOTD = "year_of_the_dragonfly",
    YOTS = "year_of_the_snake",
}
```

### Festival Events

```lua
FESTIVAL_EVENTS = {
    NONE = "none",
    LAVAARENA = "lavaarena",  -- The Forge
    QUAGMIRE = "quagmire",    -- The Gorge
}
```

## Physics and Collision Constants

### Collision Groups

```lua
COLLISION = {
    GROUND =           32,
    BOAT_LIMITS =      64,
    LAND_OCEAN_LIMITS = 128,
    LIMITS =           128 + 64,     -- Combined boat and land/ocean limits
    WORLD =            128 + 64 + 32, -- All world collision
    ITEMS =            256,
    OBSTACLES =        512,
    CHARACTERS =       1024,
    FLYERS =           2048,
    SANITY =           4096,
    SMALLOBSTACLES =   8192,         -- Collide with characters but not giants
    GIANTS =           16384,        -- Collide with obstacles but not small obstacles
}
```

### Physics Constants

```lua
MAX_PHYSICS_RADIUS = 4  -- Maximum physics radius (boats are largest)
```

## Network and Multiplayer Constants

### User Flags

Bit flags for multiplayer player states:

```lua
USERFLAGS = {
    IS_GHOST =         1,
    IS_AFK =           2,
    CHARACTER_STATE_1 = 4,
    CHARACTER_STATE_2 = 8,
    IS_LOADING =       16,
    CHARACTER_STATE_3 = 32,
}
```

### Privacy Types

```lua
PRIVACY_TYPE = {
    PUBLIC = 0,
    FRIENDS = 1,
    LOCAL = 2,
    CLAN = 3,
}
```

## Usage Examples

### Reading Constants

```lua
-- Use mathematical constants
local circle_area = PI * radius * radius
local angle_in_radians = 45 * DEGREES

-- Check facing direction
if entity.Transform:GetFacing() == FACING_RIGHT then
    -- Entity is facing right
end

-- Get screen dimensions
local screen_width = RESOLUTION_X
local screen_height = RESOLUTION_Y

-- Use frames for timing
local update_frequency = FRAMES -- 1/30 second
```

### Using Control Constants

```lua
-- Check for specific input
if TheInput:IsControlPressed(CONTROL_ATTACK) then
    -- Player is trying to attack
end

-- Map custom controls
local MY_CUSTOM_CONTROL = 999
TheInput:AddControlMapping(MY_CUSTOM_CONTROL, KEY_F)
```

### Working with Character Lists

```lua
-- Check if character is playable
local function IsPlayableCharacter(prefab)
    for _, character in ipairs(DST_CHARACTERLIST) do
        if character == prefab then
            return true
        end
    end
    return false
end

-- Get character gender
local function GetCharacterGender(prefab)
    for gender, characters in pairs(CHARACTER_GENDERS) do
        for _, character in ipairs(characters) do
            if character == prefab then
                return gender
            end
        end
    end
    return "NEUTRAL"
end
```

### Working with Special Events

```lua
-- Check if a special event is active
if IsSpecialEventActive(SPECIAL_EVENTS.WINTERS_FEAST) then
    -- Winter's Feast is currently active
    print("Ho ho ho!")
end

-- Check if any special event is active
if IsAnySpecialEventActive() then
    local active_event = GetFirstActiveSpecialEvent()
    print("Active event:", active_event)
end

-- Check if it's a Year of the X event
if IsAny_YearOfThe_EventActive() then
    -- Some year-of-the-creature event is active
end
```

### Using Tech Requirements

```lua
-- Check if player can craft item
local function CanCraft(recipe, player)
    local tech_level = player.components.builder:GetTechLevel()
    return TechTree.DoesUserKnowRecipe(tech_level, recipe.tech)
end

-- Add recipe with tech requirement
AddRecipe("my_item", {
    Ingredient("log", 2),
    Ingredient("rope", 1)
}, RECIPETABS.TOOLS, TECH.SCIENCE_ONE)
```

## Best Practices

### For Mod Development

1. **Use existing constants** instead of hard-coding values:
   ```lua
   -- Good
   if facing == FACING_RIGHT then
   
   -- Bad
   if facing == 0 then
   ```

2. **Add custom constants** with unique prefixes:
   ```lua
   -- Good
   MYMOD_SPECIAL_VALUE = 42
   
   -- Bad (might conflict)
   SPECIAL_VALUE = 42
   ```

3. **Reference character lists** instead of maintaining your own:
   ```lua
   -- Good
   for _, character in ipairs(DST_CHARACTERLIST) do
   
   -- Bad
   local my_character_list = {"wilson", "willow", ...}
   ```

### For System Integration

1. **Use layer constants** for proper rendering order
2. **Follow control constants** for consistent input handling
3. **Respect collision groups** for physics interactions
4. **Use color constants** for consistent UI appearance

## Related Systems

The constants system integrates with:

- **[Actions System](./actions)**: Uses control constants for input mapping
- **[Entity System](./entity)**: Uses facing and layer constants
- **[Components System](../components/)**: References various constants for behavior
- **[Tuning System](./tuning)**: Provides game balance values
- **[Networking System](./networking)**: Uses user flags and privacy constants

## Implementation Notes

### Loading and Initialization

- Constants are loaded early in game initialization via `require "util"` and `TechTree`
- Most constants should not be modified after game start
- Some constants are used by the C++ engine and cannot be changed
- Event constants are automatically updated based on active events

### Engine Integration

- Rendering layers must match `game\render\RenderLayer.h`
- Control constants must match `DontStarveInputHandler.h`
- Sort order constants match `scenegraphnode.h`
- Physics constants sync with C++ collision system

### Special Considerations

- **GROUND table**: Deprecated - do not add to or reference
- **Character lists**: Must stay synchronized with `scrapbookpartitions.lua`
- **Technology constants**: Work with TechTree system for crafting requirements
- **Special events**: Controlled by server configuration and season timing

### Beta and Branch Differences

- `IS_BETA` flag affects certain constant values
- Branch-specific constants may differ between `dev`, `staging`, and `release`
- Event constants change based on active special events
