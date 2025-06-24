---
id: worldsettings_overrides
title: World Settings Overrides
description: Comprehensive world configuration override system for customizing Don't Starve Together gameplay settings
sidebar_position: 3
slug: api-vanilla/core-systems/worldsettings_overrides
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# World Settings Overrides

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `worldsettings_overrides` module provides a comprehensive system for customizing Don't Starve Together gameplay through world generation settings. It offers hundreds of configurable parameters that control monster spawning, resource abundance, seasonal mechanics, environmental hazards, and survival difficulty across all aspects of the game.

## Usage Example

```lua
-- The world settings system is typically used during world generation
local worldsettings_overrides = require("worldsettings_overrides")

-- Apply pre-generation overrides
worldsettings_overrides.Pre.deerclops("often")
worldsettings_overrides.Pre.regrowth("fast")

-- Apply post-generation overrides (after TheWorld exists)
worldsettings_overrides.Post.hounds("always")
worldsettings_overrides.Post.weather("rare")
```

## Core Functions

### OverrideTuningVariables(tuning) {#override-tuning-variables}

**Status:** `stable`

**Description:**
Applies tuning variable overrides to the global TUNING table, preserving original values in ORIGINAL_TUNING for potential restoration. Includes development build validation to prevent typos in tuning keys.

**Parameters:**
- `tuning` (table): Key-value pairs of tuning variables to override

**Returns:**
- None (modifies global TUNING table)

**Example:**
```lua
-- Override multiple tuning variables
OverrideTuningVariables({
    DEERCLOPS_ATTACKS_PER_SEASON = 8,
    BEEHIVE_BEES = 10,
    REGROWTH_TIME_MULTIPLIER = 3
})
```

**Implementation Details:**
```lua
-- Actual implementation from source code
function OverrideTuningVariables(tuning)
    if tuning ~= nil then
        for k, v in pairs(tuning) do
            if BRANCH == "dev" then
                assert(TUNING[k] ~= nil, string.format("%s does not exist in TUNING, either fix the spelling, or add the value to TUNING.", k))
            end
            ORIGINAL_TUNING[k] = TUNING[k]
            TUNING[k] = v
        end
    end
end
```

**Validation Features:**
- **Development Validation**: Asserts that tuning keys exist in TUNING table  
- **Backup System**: Preserves original values in ORIGINAL_TUNING
- **Error Messages**: Provides helpful feedback for missing tuning variables
- **Nil Safety**: Handles nil tuning parameter gracefully

## Pre-Generation Overrides

### Giants Category

Giants are major boss creatures that appear seasonally or under specific conditions.

#### deerclops(difficulty) {#deerclops-override}

**Status:** `stable`

**Description:**
Configures Deerclops spawn frequency and seasonal behavior through tuning variable overrides.

**Implementation:**
```lua
deerclops = function(difficulty)
    local tuning_vars = {
        never = {
            SPAWN_DEERCLOPS = false,
        },
        rare = {
            DEERCLOPS_ATTACKS_PER_SEASON = 2,
            DEERCLOPS_ATTACKS_OFF_SEASON = false,
        },
        often = {
            DEERCLOPS_ATTACKS_PER_SEASON = 8,
            DEERCLOPS_ATTACKS_OFF_SEASON = false,
        },
        always = {
            DEERCLOPS_ATTACKS_PER_SEASON = 10,
            DEERCLOPS_ATTACKS_OFF_SEASON = true,
        },
    }
    OverrideTuningVariables(tuning_vars[difficulty])
end
```

**Difficulty Levels:**
- `"never"`: Disables Deerclops spawning completely (`SPAWN_DEERCLOPS = false`)
- `"rare"`: 2 attacks per season, no off-season attacks
- `"default"`: 4 attacks per season, no off-season attacks (commented default)
- `"often"`: 8 attacks per season, no off-season attacks  
- `"always"`: 10 attacks per season with off-season attacks enabled

**Example:**
```lua
-- Set Deerclops to attack frequently
local worldsettings_overrides = require("worldsettings_overrides")
worldsettings_overrides.Pre.deerclops("often")

-- Result: TUNING.DEERCLOPS_ATTACKS_PER_SEASON = 8
--         TUNING.DEERCLOPS_ATTACKS_OFF_SEASON = false
```

#### bearger(difficulty) {#bearger-override}

**Status:** `stable`

**Description:**
Controls Bearger spawn probability during autumn.

**Difficulty Levels:**
- `"never"`: Disables Bearger spawning
- `"rare"`: 50% spawn chance
- `"often"`: Multiple spawn opportunities
- `"always"`: Guaranteed spawns

#### beequeen(difficulty) {#beequeen-override}

**Status:** `stable`

**Description:**
Manages Bee Queen spawning requirements and respawn timing.

**Tuning Variables:**
- `BEEQUEEN_RESPAWN_TIME`: Time between respawns
- `BEEQUEEN_SPAWN_WORK_THRESHOLD`: Minimum work required to trigger spawn

### Monsters Category

Hostile creatures and their spawning mechanics.

#### lureplants(difficulty) {#lureplants-override}

**Status:** `stable`

**Description:**
Controls Lureplant spawning frequency across the world.

**Difficulty Levels:**
- `"never"`: No Lureplant spawning
- `"rare"`: 10-day intervals with 2-day variance
- `"often"`: 3-day intervals with 1-day variance
- `"always"`: 2-day intervals with 0.5-day variance

#### spiders_setting(difficulty) {#spiders-setting-override}

**Status:** `stable`

**Description:**
Configures spider den population and behavior.

**Configuration Parameters:**
```lua
-- Example spider configuration for "many" difficulty
SPIDERDEN_SPIDERS = {4, 8, 12}        -- Spiders per den level
SPIDERDEN_WARRIORS = {0, 2, 6}        -- Warriors per den level
SPIDERDEN_EMERGENCY_WARRIORS = {0, 8, 16}  -- Emergency response
SPIDERDEN_REGEN_TIME = TUNING.SEG_TIME * 1.5  -- Regeneration time
```

### Animals Category

Wildlife and passive creature spawning.

#### bees_setting(difficulty) {#bees-setting-override}

**Status:** `stable`

**Description:**
Controls bee population in hives and bee boxes.

**Parameters:**
- `BEEHIVE_BEES`: Number of bees per wild hive
- `BEEHIVE_EMERGENCY_BEES`: Emergency response count
- `BEEHIVE_RELEASE_TIME`: Time between bee releases
- `BEEHIVE_REGEN_TIME`: Bee regeneration interval

#### hunt(difficulty) {#hunt-override}

**Status:** `stable`

**Description:**
Manages Koalefant hunt frequency and mechanics.

**Difficulty Scaling:**
```lua
-- Hunt frequency by difficulty
never:   HUNT_COOLDOWN = -1              -- Disabled
rare:    HUNT_COOLDOWN = 2.4 days        -- Infrequent
often:   HUNT_COOLDOWN = 0.6 days        -- Frequent  
always:  HUNT_COOLDOWN = 0.3 days        -- Very frequent
```

### Resources Category

Resource regeneration and abundance settings.

#### regrowth(difficulty) {#regrowth-override}

**Status:** `stable`

**Description:**
Universal resource regrowth time multiplier affecting all renewable resources.

**Multiplier Values:**
- `"never"`: 0 (no regrowth)
- `"veryslow"`: 0.15 (very slow regrowth)
- `"slow"`: 0.33 (slow regrowth)
- `"fast"`: 3 (fast regrowth)
- `"veryfast"`: 7 (very fast regrowth)

#### flowers_regrowth(difficulty) {#flowers-regrowth-override}

**Status:** `stable`

**Description:**
Specific regrowth multiplier for flower regeneration.

#### evergreen_regrowth(difficulty) {#evergreen-regrowth-override}

**Status:** `stable`

**Description:**
Controls evergreen tree regrowth timing.

## Post-Generation Overrides

These overrides are applied after world creation when TheWorld entity exists.

### Season Configuration

#### autumn(difficulty), winter(difficulty), spring(difficulty), summer(difficulty) {#season-overrides}

**Status:** `stable`

**Description:**
Sets the length of each season using predefined length categories.

**Season Lengths:**
```lua
-- Friendly seasons (autumn, spring)
SEASON_FRIENDLY_LENGTHS = {
    noseason = 0,
    veryshortseason = TUNING.SEASON_LENGTH_FRIENDLY_VERYSHORT,
    shortseason = TUNING.SEASON_LENGTH_FRIENDLY_SHORT,
    default = TUNING.SEASON_LENGTH_FRIENDLY_DEFAULT,
    longseason = TUNING.SEASON_LENGTH_FRIENDLY_LONG,
    verylongseason = TUNING.SEASON_LENGTH_FRIENDLY_VERYLONG
}

-- Harsh seasons (winter, summer)  
SEASON_HARSH_LENGTHS = {
    noseason = 0,
    veryshortseason = TUNING.SEASON_LENGTH_HARSH_VERYSHORT,
    -- ... similar structure
}
```

**Example:**
```lua
-- Set long autumn and short winter
worldsettings_overrides.Post.autumn("longseason")
worldsettings_overrides.Post.winter("shortseason")
```

### Weather and Environment

#### weather(difficulty) {#weather-override}

**Status:** `stable`

**Description:**
Controls precipitation frequency and intensity.

**Weather Modes:**
- `"never"`: No precipitation
- `"rare"`: Dynamic mode with 0.5x moisture scale
- `"often"`: Dynamic mode with 2x moisture scale
- `"always"`: Constant precipitation
- `"squall"`: Dynamic mode with 30x moisture scale (intense storms)

#### lightning(difficulty) {#lightning-override}

**Status:** `stable`

**Description:**
Configures lightning strike frequency and conditions.

**Lightning Modes:**
```lua
-- Lightning configuration examples
never:   { mode = "never", delay = {} }
rare:    { mode = "rain", delay = {min = 60, max = 90} }
often:   { mode = "any", delay = {min = 10, max = 20} }
always:  { mode = "always", delay = {min = 10, max = 30} }
```

### Gameplay Mechanics

#### spawnmode(difficulty) {#spawnmode-override}

**Status:** `stable`

**Description:**
Sets player respawn behavior and ghost mechanics.

#### basicresource_regrowth(difficulty) {#basicresource-regrowth-override}

**Status:** `stable`

**Description:**
Enables or disables basic resource renewal (sticks, grass, etc.).

#### resettime(difficulty) {#resettime-override}

**Status:** `stable`

**Description:**
Configures world reset timing for abandoned worlds.

**Reset Time Options:**
```lua
none:     nil                                -- No reset
slow:     { time = 240, loadingtime = 360 }  -- 4 minutes
default:  { time = 120, loadingtime = 180 }  -- 2 minutes  
fast:     { time = 60, loadingtime = 90 }    -- 1 minute
always:   { instant = true }                 -- Immediate
```

## Constants

### SEASON_FRIENDLY_LENGTHS

**Type:** `table`

**Status:** `stable`

**Description:** Lookup table for friendly season (autumn, spring) duration values.

### SEASON_HARSH_LENGTHS

**Type:** `table`

**Status:** `stable`

**Description:** Lookup table for harsh season (winter, summer) duration values.

### NEVER_TIME

**Value:** `TUNING.TOTAL_DAY_TIME * 9999999999`

**Status:** `stable`

**Description:** Effectively infinite time value used to disable time-based mechanics.

## Utility Functions

### areaambientdefault(prefab) {#area-ambient-default}

**Status:** `stable`

**Description:**
Sets default ambient sound overrides for different world types (surface vs cave).

**Parameters:**
- `prefab` (string): World type identifier ("cave" or surface world)

**Example:**
```lua
-- Set cave ambient sounds
worldsettings_overrides.areaambientdefault("cave")
```

## Integration Points

### World Generation Pipeline

The override system integrates with world generation at multiple stages:

1. **Pre-Generation**: Tuning variables are modified before world creation
2. **Post-Generation**: World events are triggered after entity instantiation
3. **Runtime**: Some settings can be modified during gameplay

### Event System Integration

```lua
-- Example event dispatching for season length
TheWorld:PushEvent("ms_setseasonlength", {
    season = "winter", 
    length = SEASON_HARSH_LENGTHS["shortseason"]
})

-- Weather system integration
TheWorld:PushEvent("ms_setprecipitationmode", "dynamic")
TheWorld:PushEvent("ms_setmoisturescale", 2.0)
```

## Configuration Categories

### Difficulty Scaling Patterns

Most overrides follow consistent difficulty scaling:

- **Never/None**: Feature completely disabled
- **Rare/Few**: Minimal frequency/intensity
- **Default**: Balanced baseline gameplay
- **Often/Many**: Increased frequency/intensity  
- **Always/Max**: Maximum frequency/intensity

### Temporal Scaling

Time-based settings typically scale in consistent ratios:

```lua
-- Common scaling pattern for spawn intervals
rare:    base_time * 2     -- Half frequency
default: base_time         -- Normal frequency  
often:   base_time * 0.5   -- Double frequency
always:  base_time * 0.25  -- Quadruple frequency
```

## Related Modules

- [World Settings Util](./worldsettingsutil.md): Utility functions for world settings timers
- [Tuning](./tuning.md): Base tuning values that can be overridden
- [Constants](./constants.md): Game constants used in override calculations
- [Season Manager](../core-systems/seasonmanager.md): Handles season length and transitions
- [Weather](../core-systems/weather.md): Weather system integration
