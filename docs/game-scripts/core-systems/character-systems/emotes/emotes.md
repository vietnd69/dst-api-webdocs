---
id: emotes
title: Emotes
description: Core emote system and basic emote definitions for player expressions and actions
sidebar_position: 1
slug: /game-scripts/core-systems/character-systems/emotes/emotes
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Emotes

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `emotes` module provides the core emote system for Don't Starve Together, defining basic player emotes and the infrastructure for emote commands. It includes built-in emotes available to all players and integrates with the purchasable emote system from `emote_items.lua`.

## Usage Example

```lua
-- Access basic emotes
local waveEmote = EMOTES.wave
print(waveEmote.data.anim) -- Animation data

-- Get all common emotes
local commonEmotes = GetCommonEmotes()

-- Check emote type
if EMOTES.dance.type == EMOTE_TYPE.ACTION then
    -- Handle action emote
end
```

## Constants

### EMOTE_TYPE {#emote-type}

**Description:**
Enumeration defining different categories of emotes based on their nature and usage.

**Values:**
```lua
EMOTE_TYPE = {
    EMOTION = 0,    -- Emotional expressions (wave, happy, angry, etc.)
    ACTION = 1,     -- Physical actions (dance, sit, squat, etc.)
    UNLOCKABLE = 2, -- Purchasable/unlockable emotes
}
```

**Example:**
```lua
-- Check if emote is an emotion
if EMOTES.happy.type == EMOTE_TYPE.EMOTION then
    -- Handle emotional emote
end

-- Filter action emotes
local actionEmotes = {}
for name, emote in pairs(EMOTES) do
    if emote.type == EMOTE_TYPE.ACTION then
        actionEmotes[name] = emote
    end
end
```

## EMOTES Table

### Structure

**Description:**
Global table containing all basic emote definitions available to all players without purchase requirements.

**Table Format:**
```lua
EMOTES = {
    [emote_name] = {
        aliases = table,     -- Alternative command names (optional)
        data = {            -- Emote execution data
            anim = string/table,     -- Animation name(s)
            randomanim = boolean,    -- Random animation selection
            sitting = boolean,       -- Can be used while sitting
            mounted = boolean,       -- Can be used while mounted
            mountsound = string,     -- Sound for mounted version
            loop = boolean,          -- Loop animation
            fx = string/boolean,     -- Effects to spawn
            -- ... additional properties
        },
        type = number,       -- EMOTE_TYPE classification
    }
}
```

## Emotion Emotes

### wave {#wave}

**Status:** `stable`

**Type:** `EMOTION`

**Description:**
Waving gesture for greetings and farewells. Supports multiple animation variations.

**Aliases:** `waves`, `hi`, `bye`, `goodbye`

**Properties:**
- **Animations:** 3 random variations (`emoteXL_waving1`, `emoteXL_waving2`, `emoteXL_waving3`)
- **Usage:** Available while sitting and mounted
- **Random Animation:** Yes

**Example:**
```lua
-- Access wave emote data
local waveData = EMOTES.wave.data
print(#waveData.anim) -- 3 (number of animation variations)
```

### rude {#rude}

**Status:** `stable`

**Type:** `EMOTION`

**Description:**
Threatening or dismissive gesture expressing annoyance or hostility.

**Aliases:** `goaway`, `threaten`

**Properties:**
- **Animation:** `emoteXL_waving4`
- **Usage:** Available while sitting and mounted
- **Mount Sound:** "angry"

### happy {#happy}

**Status:** `stable`

**Type:** `EMOTION`

**Description:**
Cheerful expression showing joy and celebration.

**Properties:**
- **Animation:** `emoteXL_happycheer`
- **Usage:** Available while sitting and mounted
- **Mount Sound:** "yell"

### angry {#angry}

**Status:** `stable`

**Type:** `EMOTION`

**Description:**
Angry expression showing frustration or rage.

**Aliases:** `anger`, `grimace`, `grimaces`, `frustrate`, `frustrated`, `frustration`

**Properties:**
- **Animation:** `emoteXL_angry`
- **Usage:** Available while sitting and mounted
- **Mount Sound:** "angry" (delayed by 7 frames)

### cry {#cry}

**Status:** `stable`

**Type:** `EMOTION`

**Description:**
Sad expression with tears effect.

**Aliases:** `sad`, `cries`

**Properties:**
- **Animation:** `emoteXL_sad`
- **Usage:** Available while sitting and mounted
- **Effects:** "tears" (delayed by 17 frames)
- **Mount Sound:** "grunt"

### no {#no}

**Status:** `stable`

**Type:** `EMOTION`

**Description:**
Head shaking gesture expressing disagreement or confusion.

**Aliases:** `annoyed`, `annoy`, `shakehead`, `shake`, `confuse`, `confused`

**Properties:**
- **Animation:** `emoteXL_annoyed`
- **Usage:** Available while sitting and mounted
- **Mount Sound:** "grunt" (delayed by 12 frames)

### joy {#joy}

**Status:** `stable`

**Type:** `EMOTION`

**Description:**
Joyful heel-clicking celebration gesture.

**Aliases:** `click`, `heelclick`, `heels`, `celebrate`, `celebration`

**Properties:**
- **Animation:** `research`
- **Usage:** Available while mounted
- **Effects:** None
- **Mount Sound:** "curious"

### kiss {#kiss}

**Status:** `stable`

**Type:** `EMOTION`

**Description:**
Blowing kiss gesture showing affection.

**Aliases:** `blowkiss`, `smooch`, `mwa`, `mwah`

**Properties:**
- **Animation:** `emoteXL_kiss`
- **Usage:** Available while sitting and mounted
- **Mount Sound:** "curious"

## Action Emotes

### dance {#dance}

**Status:** `stable`

**Type:** `ACTION`

**Description:**
Dancing animation that loops continuously until stopped.

**Properties:**
- **Animations:** `emoteXL_pre_dance0`, `emoteXL_loop_dance0`
- **Loop:** Yes
- **Usage:** Available while mounted, beaver, moose, goose forms
- **Tags:** `dancing`
- **Mount Sound:** "curious"

**Example:**
```lua
-- Check if emote has dancing tag
local danceEmote = EMOTES.dance
if danceEmote.data.tags and table.contains(danceEmote.data.tags, "dancing") then
    -- This is a dancing emote
end
```

### sit {#sit}

**Status:** `stable`

**Type:** `ACTION`

**Description:**
Sitting animation with multiple random variations that loop.

**Properties:**
- **Animations:** 2 random sitting styles with pre/loop phases
- **Loop:** Yes
- **Random Animation:** Yes
- **Usage:** Available while mounted
- **Mount Sound:** "walk" (delayed by 6 frames)

### squat {#squat}

**Status:** `stable`

**Type:** `ACTION`

**Description:**
Squatting/crouching animation with multiple variations.

**Properties:**
- **Animations:** 2 random squatting styles with pre/loop phases
- **Loop:** Yes
- **Random Animation:** Yes
- **Usage:** Available while mounted
- **Mount Sound:** "walk" (delayed by 10 frames)

### bonesaw {#bonesaw}

**Status:** `stable`

**Type:** `ACTION`

**Description:**
Threatening gesture referencing the Bonesaw character.

**Aliases:** `ready`, `goingnowhere`, `playtime`, `threeminutes`

**Properties:**
- **Animation:** `emoteXL_bonesaw`
- **Usage:** Available while mounted
- **Mount Sound:** "angry"

### facepalm {#facepalm}

**Status:** `stable`

**Type:** `ACTION`

**Description:**
Face-palm gesture expressing frustration or embarrassment.

**Aliases:** `doh`, `slapintheface`

**Properties:**
- **Animation:** `emoteXL_facepalm`
- **Usage:** Available while sitting and mounted
- **Mount Sound:** "grunt"

### pose {#pose}

**Status:** `stable`

**Type:** `ACTION`

**Description:**
Striking a dramatic pose with camera zoom effect.

**Aliases:** `strut`, `strikepose`

**Properties:**
- **Animation:** `emote_strikepose`
- **Usage:** Available while mounted
- **Zoom:** Yes
- **Sound Override:** "pose"

### toast {#toast}

**Status:** `stable`

**Type:** `ACTION`

**Description:**
Toasting gesture that loops, suitable for celebrations.

**Aliases:** `toasting`, `cheers`

**Properties:**
- **Animations:** `emote_pre_toast`, `emote_loop_toast`
- **Loop:** Yes
- **Usage:** Available while sitting and mounted
- **Sound Override:** "pose" (delayed by 0.55 seconds)

### pet {#pet}

**Status:** `stable`

**Type:** `ACTION`

**Description:**
Petting gesture for small mounted creatures.

**Aliases:** `pat`

**Properties:**
- **Animation:** `pet_small`
- **Usage:** Mount only
- **Mount Sound:** "curious" (delayed by 25 frames)
- **Sound Override:** "pose" (delayed by 11 frames)

### bigpet {#bigpet}

**Status:** `stable`

**Type:** `ACTION`

**Description:**
Enhanced petting gesture for larger mounted creatures with zoom effect.

**Aliases:** `bigpat`

**Properties:**
- **Animation:** `pet_big`
- **Usage:** Mount only
- **Zoom:** Yes
- **Mount Sound:** "curious" (delayed by 25 frames)
- **Sound Override:** "pose" (delayed by 11 frames)

## Functions

### GetCommonEmotes() {#get-common-emotes}

**Status:** `stable`

**Description:**
Returns the complete EMOTES table containing all basic emotes available to all players.

**Returns:**
- (table): The EMOTES table with all common emote definitions

**Example:**
```lua
local commonEmotes = GetCommonEmotes()
for emoteName, emoteData in pairs(commonEmotes) do
    print("Emote:", emoteName, "Type:", emoteData.type)
end
```

## Emote Data Properties

### Animation Properties

#### anim

**Type:** `string | table`

**Description:**
Animation name(s) to play for the emote. Can be a single animation or array of animations.

**Examples:**
```lua
-- Single animation
data.anim = "emoteXL_angry"

-- Multiple animations for random selection
data.anim = { "emoteXL_waving1", "emoteXL_waving2", "emoteXL_waving3" }

-- Pre/loop animation pairs
data.anim = { "emote_pre_toast", "emote_loop_toast" }
```

#### randomanim

**Type:** `boolean`

**Description:**
When true, randomly selects from multiple animations in the anim array.

#### loop

**Type:** `boolean`

**Description:**
Whether the animation should loop continuously until stopped.

### Usage Properties

#### sitting

**Type:** `boolean`

**Description:**
Whether the emote can be performed while the player is sitting.

#### mounted

**Type:** `boolean`

**Description:**
Whether the emote can be performed while the player is mounted on a creature.

#### mountonly

**Type:** `boolean`

**Description:**
Whether the emote can only be performed while mounted (e.g., pet emotes).

### Audio Properties

#### mountsound

**Type:** `string`

**Description:**
Sound to play for the mounted creature during the emote.

**Common Values:**
- `"angry"`: Aggressive sounds
- `"curious"`: Inquisitive sounds
- `"grunt"`: General acknowledgment
- `"yell"`: Loud vocalizations
- `"walk"`: Movement sounds

#### mountsounddelay

**Type:** `number`

**Description:**
Delay in seconds before playing the mount sound.

#### soundoverride

**Type:** `string`

**Description:**
Override the default player sound with a specific sound name.

#### sounddelay

**Type:** `number`

**Description:**
Delay in seconds before playing the player sound.

### Visual Properties

#### fx

**Type:** `string | boolean`

**Description:**
Visual effects to spawn during the emote. Set to false to disable effects.

**Examples:**
- `"tears"`: Crying effect
- `false`: No effects

#### fxdelay

**Type:** `number`

**Description:**
Delay in seconds before spawning visual effects.

#### zoom

**Type:** `boolean`

**Description:**
Whether to apply camera zoom effect during the emote.

#### tags

**Type:** `table`

**Description:**
Array of tags for categorizing or filtering emotes.

**Common Tags:**
- `"dancing"`: Dancing emotes
- `"nodangle"`: No dangling accessories during emote

## Command Integration

### Emote Commands

The system automatically creates user commands for each emote:

```lua
-- Players can use these in chat:
/wave        -- or /hi, /bye, /goodbye
/angry       -- or /anger, /frustrate
/dance       -- Starts dancing
/sit         -- Sits down
```

### Alias System

Many emotes support multiple command aliases:

```lua
-- Wave emote aliases
aliases = { "waves", "hi", "bye", "goodbye" }

-- Players can use any of these:
/wave, /waves, /hi, /bye, /goodbye
```

## Integration with Emote Items

The system integrates with purchasable emotes from `EMOTE_ITEMS`:

```lua
-- Processes each emote item to create commands
for item_type, v in pairs(EMOTE_ITEMS) do
    local cmd_data = CreateEmoteCommand(v)
    cmd_data.requires_item_type = item_type
    cmd_data.hasaccessfn = function(command, caller)
        -- Check ownership and requirements
    end
    AddUserCommand(v.cmd_name, cmd_data)
end
```

## Common Usage Patterns

### Emote Filtering

```lua
-- Get all emotion emotes
function GetEmotionEmotes()
    local emotions = {}
    for name, emote in pairs(EMOTES) do
        if emote.type == EMOTE_TYPE.EMOTION then
            emotions[name] = emote
        end
    end
    return emotions
end

-- Get all action emotes
function GetActionEmotes()
    local actions = {}
    for name, emote in pairs(EMOTES) do
        if emote.type == EMOTE_TYPE.ACTION then
            actions[name] = emote
        end
    end
    return actions
end
```

### Emote Validation

```lua
-- Check if emote can be used in current state
function CanUseEmote(player, emoteName)
    local emote = EMOTES[emoteName]
    if not emote then return false end
    
    local data = emote.data
    
    -- Check sitting requirement
    if player:HasTag("sitting") and not data.sitting then
        return false
    end
    
    -- Check mount requirements
    local isRiding = player.replica.rider and player.replica.rider:IsRiding()
    if data.mountonly and not isRiding then
        return false
    end
    
    return true
end
```

### Custom Emote Execution

```lua
-- Trigger emote programmatically
function TriggerEmote(player, emoteName)
    local emote = EMOTES[emoteName]
    if emote and CanUseEmote(player, emoteName) then
        player:PushEvent("emote", emote.data)
    end
end
```

## Performance Considerations

### Animation Loading
- Animations are loaded on-demand when emotes are triggered
- Multiple animation variations add variety but increase memory usage
- Loop animations continue until explicitly stopped

### Sound Management
- Mount sounds and player sounds can overlap
- Sound delays prevent audio conflicts
- Sound overrides replace default emote sounds

## Related Modules

- [Emote Items](./emote_items.md): Purchasable and unlockable emotes
- [Built-in User Commands](./builtinusercommands.md): Command system integration
- [Entity Script](./entityscript.md): Entity event system for emote triggering
- [Player Profile](./playerprofile.md): Player state and preferences
- [Chat History](./chathistory.md): Chat command processing
