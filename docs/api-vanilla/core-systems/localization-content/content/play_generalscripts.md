---
id: play-generalscripts
title: Play General Scripts
description: Character-specific performance scripts for the stage play system
sidebar_position: 7
slug: api-vanilla/core-systems/play-generalscripts
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Play General Scripts

## Version History
| Build Version | Change Date | Change Type | Description |
|---|---|---|---|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `play_generalscripts` module contains character-specific monologue scripts for all playable characters in Don't Starve Together. Each character has their own unique performance script that showcases their personality through dialogue, animations, and special effects. The module also includes error handling scripts for invalid stage setups.

## Usage Example

```lua
local general_scripts = require("play_generalscripts")

-- Access Wilson's script
local wilson_script = general_scripts.WILSON1

-- Access error scripts
local bad_costumes_script = general_scripts.BAD_COSTUMES
```

## Character Scripts

### WILSON1 {#wilson1}

**Status:** `stable`

**Description:**
Wilson's monologue script featuring scientific observations and gentlemanly demeanor.

**Cast Requirements:**
- `wilson`: A player wearing Wilson's character

**Script Structure:**
```lua
{
    cast = { "wilson" },
    lines = {
        {actionfn = fn.actorsbow, duration = 2.5},
        {roles = {"wilson"}, duration = 3.0, line = STRINGS.STAGEACTOR.WILSON1[1]},
        -- ... additional lines
    }
}
```

### WALTER1 {#walter1}

**Status:** `stable`

**Description:**
Walter's performance featuring scouting stories and youthful enthusiasm, including a sitting animation sequence.

**Cast Requirements:**
- `walter`: A player wearing Walter's character

**Special Features:**
- Includes sitting animation sequence (`emote_pre_sit1`, `emote_loop_sit1`)

### WANDA1 {#wanda1}

**Status:** `stable`

**Description:**
Wanda's time-themed monologue reflecting her temporal abilities and mysterious nature.

**Cast Requirements:**
- `wanda`: A player wearing Wanda's character

### WARLY1 {#warly1}

**Status:** `stable`

**Description:**
Warly's culinary-focused performance discussing cooking and gastronomy.

**Cast Requirements:**
- `warly`: A player wearing Warly's character

### WATHGRITHR1 {#wathgrithr1}

**Status:** `stable`

**Description:**
Wigfrid's operatic performance featuring dramatic singing and theatrical gestures.

**Cast Requirements:**
- `wathgrithr`: A player wearing Wigfrid's character

**Special Features:**
- Includes curtsy and opera singing sequence
- Uses special sound effect: `stageplay_set/wigfrid_opera/solo`
- Complex animation sequence: `sing_loop_pre`, `sing_loop` (looped), `sing_loop_pst`

### WAXWELL1 {#waxwell1}

**Status:** `stable`

**Description:**
Maxwell's performance showcasing his shadow magic abilities with dancing shadow puppets.

**Cast Requirements:**
- `waxwell`: A player wearing Maxwell's character

**Special Features:**
- Spawns shadow dancers using `fn.waxwelldancer`
- Includes magical dance animation sequence
- Demonstrates Maxwell's puppet master abilities

### WEBBER_SPIDER {#webber-spider}

**Status:** `stable`

**Description:**
Webber's performance told from the spider's perspective, exploring his dual nature.

**Cast Requirements:**
- `webber`: A player wearing Webber's character

### WEBBER_BOY {#webber-boy}

**Status:** `stable`

**Description:**
Webber's alternative performance told from the boy's perspective.

**Cast Requirements:**
- `webber`: A player wearing Webber's character

### WENDY1 {#wendy1}

**Status:** `stable`

**Description:**
Wendy's melancholic monologue featuring themes of loss and sisterhood.

**Cast Requirements:**
- `wendy`: A player wearing Wendy's character

### WICKERBOTTOM1 {#wickerbottom1}

**Status:** `stable`

**Description:**
Wickerbottom's scholarly performance discussing books, knowledge, and learning.

**Cast Requirements:**
- `wickerbottom`: A player wearing Wickerbottom's character

### WILLOW1 {#willow1}

**Status:** `stable`

**Description:**
Willow's fiery performance with enthusiastic animations and pyromania themes.

**Cast Requirements:**
- `willow`: A player wearing Willow's character

**Special Features:**
- Includes happy cheer animation (`emote_happycheer`)

### WINONA1 {#winona1}

**Status:** `stable`

**Description:**
Winona's engineering-focused monologue about building and craftsmanship.

**Cast Requirements:**
- `winona`: A player wearing Winona's character

### WOLFGANG1 {#wolfgang1}

**Status:** `stable`

**Description:**
Wolfgang's performance emphasizing strength, courage, and determination.

**Cast Requirements:**
- `wolfgang`: A player wearing Wolfgang's character

### WOODIE1 {#woodie1}

**Status:** `stable`

**Description:**
Woodie's unique performance featuring dialogue between Woodie and his talking axe Lucy.

**Cast Requirements:**
- `woodie`: A player wearing Woodie's character and carrying Lucy

**Special Features:**
- Uses `fn.lucytalk` for Lucy's dialogue
- Most lines are spoken by Lucy rather than Woodie
- Requires Lucy to be in Woodie's inventory

### WORMWOOD1 {#wormwood1}

**Status:** `stable`

**Description:**
Wormwood's nature-themed performance with plant-focused dialogue.

**Cast Requirements:**
- `wormwood`: A player wearing Wormwood's character

### WORTOX1 {#wortox1}

**Status:** `stable`

**Description:**
Wortox's mischievous performance reflecting his imp-like nature and soul magic.

**Cast Requirements:**
- `wortox`: A player wearing Wortox's character

### WURT1 {#wurt1}

**Status:** `stable`

**Description:**
Wurt's aquatic-themed performance with mer-folk characteristics.

**Cast Requirements:**
- `wurt`: A player wearing Wurt's character

### WX1 {#wx1}

**Status:** `stable`

**Description:**
WX-78's robotic performance with the longest monologue (11 lines) featuring mechanical speech patterns.

**Cast Requirements:**
- `wx78`: A player wearing WX-78's character

### WES1 {#wes1}

**Status:** `stable`

**Description:**
Wes's silent mime performance using only animations and gestures.

**Cast Requirements:**
- `wes`: A player wearing Wes's character

**Special Features:**
- No dialogue lines (Wes is mute)
- Uses only mime animations
- Multiple random mime animations (`mime1`)
- Wes doesn't respect passed-in animations, performing random mimes instead

## Error Scripts

### BAD_COSTUMES {#bad-costumes}

**Status:** `stable`

**Description:**
Error script that plays when actors are wearing inappropriate or missing costumes.

**Cast Requirements:**
- Uses ERROR cast (special error state)

**Script Features:**
- Birds provide commentary about costume problems
- BIRD2 shows disappointment with costume choices
- Educational feedback for proper costume setup

### REPEAT_COSTUMES {#repeat-costumes}

**Status:** `stable`

**Description:**
Error script that plays when multiple actors wear the same costume.

**Cast Requirements:**
- Uses ERROR cast (special error state)

**Script Features:**
- Birds explain the costume duplication issue
- Guidance on character diversity requirements

### NO_SCRIPT {#no-script}

**Status:** `stable`

**Description:**
Error script that plays when no valid script can be found for the current cast configuration.

**Cast Requirements:**
- Uses ERROR cast (special error state)

**Script Features:**
- Birds express confusion about missing scripts
- Both birds show disappointment
- Humorous self-aware dialogue about the error state

## Script Structure

All character scripts follow a consistent structure:

```lua
SCRIPT_NAME = {
    cast = { "character_name" },  -- Required cast members
    lines = {
        -- Array of line objects
        {
            -- Action function (optional)
            actionfn = fn.function_name,
            duration = 2.5,
            
            -- OR dialogue line
            roles = {"character_name"},
            duration = 3.0,
            line = "Dialogue text",
            anim = "animation_name",  -- Optional animation
            sgparam = "state_param"   -- Optional state parameter
        }
    }
}
```

## Line Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `actionfn` | function | Function to execute (from play_commonfn) |
| `roles` | table | Array of character names to speak/act |
| `duration` | number | Time in seconds for this line |
| `line` | string | Dialogue text to display |
| `anim` | string/table | Animation(s) to play |
| `animtype` | string | Animation type ("loop", "hold") |
| `sgparam` | string | State graph parameter |
| `castsound` | table | Character-specific sounds |

## Character Requirements

Each character script requires:
1. A player wearing the appropriate character skin
2. The character must be positioned on or near the stage
3. Some characters have special requirements (e.g., Woodie needs Lucy)

## Integration Example

```lua
local fn = require("play_commonfn")
local general_scripts = require("play_generalscripts")

-- Get Wilson's script
local script = general_scripts.WILSON1

-- Execute the script
for _, line in ipairs(script.lines) do
    if line.actionfn then
        line.actionfn(stage_inst, line, cast_data)
    elseif line.roles then
        -- Handle dialogue line
        for _, role in ipairs(line.roles) do
            local actor = cast_data[role].castmember
            if line.line then
                actor.components.talker:Say(line.line, line.duration)
            end
            if line.anim then
                -- Play animation
            end
        end
    end
    -- Wait for duration
    stage_inst:DoTaskInTime(line.duration, next_line_function)
end
```

## Related Modules

- [Play Common Functions](./play_commonfn.md): Shared utility functions used by all scripts
- [Play The Doll](./play_the_doll.md): Multi-character play scripts
- [Play The Veil](./play_the_veil.md): Alternative multi-character play scripts
