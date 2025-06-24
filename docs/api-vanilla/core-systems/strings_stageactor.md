---
id: core-systems-strings-stageactor
title: Strings Stage Actor
description: Dialogue content and performance scripts for theatrical stage actor events and character performances
sidebar_position: 49
slug: api-vanilla/core-systems/strings-stageactor
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Strings Stage Actor

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `Strings Stage Actor` module contains all dialogue content, performance scripts, and theatrical text for stage actor events in Don't Starve Together. This module provides the narrative content for character performances, stage plays, monologues, and special theatrical events that occur during stage actor activities.

The module includes character-specific performances, multi-act stage plays, narrator dialogue, bird commentary, and special event content. All content is organized to support the stage actor gameplay feature and provide immersive theatrical experiences.

## Usage Example

```lua
-- Access character-specific performance
local wilson_lines = stageactor.WILSON1
for i, line in ipairs(wilson_lines) do
    print("Wilson: " .. line)
end

-- Get stage play content
local act1_scene1 = stageactor.ACT1_SCENE1
local opening_line = act1_scene1.LINE1
print("Birds: " .. opening_line)

-- Access special dialogue with animation
local willow_performance = stageactor.WILLOW1
for i, line in ipairs(willow_performance) do
    if type(line) == "table" and line.anim then
        -- Line with special animation directive
        PlayLineWithAnimation(line[1], line.anim)
    else
        -- Regular dialogue line
        PlayLine(line)
    end
end

-- Get soliloquy content
local king_soliloquy = stageactor.KING_SOLILOQUY
local narrator_lines = king_soliloquy[1] -- Birds commentary
local character_lines = king_soliloquy[2] -- King's dialogue
```

## Character Performances

### Individual Character Monologues

Each playable character has their own unique performance content reflecting their personality and background.

#### Wilson Performance

**Content:** `stageactor.WILSON1`

**Type:** `table`

**Description:**
Wilson's performance featuring lines from Gilbert and Sullivan's "The Pirates of Penzance" - specifically the Major-General's Song, reflecting his scientific and intellectual nature.

**Lines:**
- "I am the very model of a modern Major-General"
- "I've information vegetable, animal, and mineral"
- "I'm very well acquainted, too, with matters Mathematical"
- "I understand equations, both the simple and quadratical"

#### Walter Performance

**Content:** `stageactor.WALTER1`

**Type:** `table`

**Description:**
Walter's performance showcasing his relationship with Woby, featuring a simple but endearing dog training demonstration.

#### Wanda Performance

**Content:** `stageactor.WANDA1`

**Type:** `table`

**Description:**
Wanda's performance featuring Lewis Carroll's "You Are Old, Father William," reflecting themes of aging and time.

#### Warly Performance

**Content:** `stageactor.WARLY1`

**Type:** `table`

**Description:**
Warly's French performance featuring poetic lines about departure and homeland, reflecting his cultural background.

#### Maxwell Performance

**Content:** `stageactor.WAXWELL1`

**Type:** `table`

**Description:**
Maxwell's performance with magic show themes, including mysterious tomes and shadow manipulation, referencing his magical background.

#### Webber Performances

**Content:** `stageactor.WEBBER_SPIDER`, `stageactor.WEBBER_BOY`

**Type:** `table`

**Description:**
Webber has two distinct performances reflecting his dual nature:
- **Spider Performance**: "The Spider and the Fly" poem
- **Boy Performance**: "Little Miss Muffet" nursery rhyme

#### Other Character Performances

The module includes complete performances for all characters:
- **Wendy**: Gothic poetry reflecting her melancholic nature
- **Wickerbottom**: Educational content about theater history and etymology
- **Willow**: Fire-themed poetry with animation directives
- **Winona**: Limerick about family drama
- **Wolfgang**: Heartfelt poem about friendship despite differences
- **Woodie**: Lumberjack-themed poetry with Lucy's input
- **Wormwood**: Musical sounds and vocalizations
- **Wortox**: Shakespearean mischief from "A Midsummer Night's Dream"
- **Wurt**: Fairy tale about a Mermfolk princess
- **WX-78**: Robotic motivational speaking attempt
- **Wes**: French mime performance

## Stage Play Content

### Three-Act Structure

The module contains a complete three-act stage play telling the story of a porcelain doll's journey to becoming a queen.

#### Act 1: The Doll's Awakening

**Content:** `stageactor.ACT1_SCENE1`, `stageactor.ACT1_SCENE2`, `stageactor.ACT1_SCENE3`

**Description:**
Introduction of the porcelain doll coming to life, meeting the protective Blacksmith, and encountering the magical King.

**Key Elements:**
- Narrator establishing the setting
- Doll's discovery of life and freedom
- Blacksmith's protective armor
- King's introduction and magic demonstration
- Bird commentary throughout

#### Act 2: Trials and Betrayal

**Content:** `stageactor.ACT2_SCENE4`, `stageactor.ACT2_SCENE5`, `stageactor.ACT2_SCENE6`

**Description:**
The doll's adventures with the King, discovery of his deception, and the mirror's revelation.

**Key Elements:**
- King's excuses and delays
- Discovery of the magic mirror
- King's betrayal and attack
- Mirror's resurrection of the doll
- Character commentary from other players

#### Act 3: Resolution and Transformation

**Content:** `stageactor.ACT3_SCENE7`, `stageactor.ACT3_SCENE8`, `stageactor.ACT3_SCENE9`

**Description:**
The doll's pursuit of the King, becoming Queen, and final resolution with the mirror.

**Key Elements:**
- Following the fool to find the King
- King's downfall and the fool's ascension
- Doll's transformation into Queen
- Promise to restore the mirror
- Final resolution and happy ending

## Soliloquy Content

### Character Soliloquies

Individual character reflections performed as standalone pieces.

#### Blacksmith Soliloquy

**Content:** `stageactor.BLACKSMITH_SOLILOQUY`

**Structure:**
- **Birds Introduction**: "The Blacksmith's Soliloquy" / "Forging on ahead."
- **Blacksmith Lines**: Searching for the lost doll
- **Birds Commentary**: Closing remarks about the character

#### King Soliloquy

**Content:** `stageactor.KING_SOLILOQUY`

**Theme:** Regret and the burden of power
- Reflection on seeking the crown
- Contemplation of alternate paths
- Birds' commentary on leadership

#### Fool Soliloquy

**Content:** `stageactor.FOOL_SOLILOQUY`

**Theme:** Life as a game and playing the fool
- Following rules vs. learning life's reality
- Self-reflection on foolish behavior
- Birds' humorous response

#### Tree Soliloquy

**Content:** `stageactor.TREE_SOLILOQUY`

**Theme:** Minimalist performance
- "Ode to the Scenery"
- Narrator describing the tree's stillness
- Birds' enthusiastic appreciation for simplicity

### Special Performances

#### The Reunion

**Content:** `stageactor.REUNION`

**Description:**
Emotional reunion scene between the Blacksmith and the transformed doll (now Queen), providing closure to their relationship.

#### The Veil Performance

**Content:** `stageactor.THEVEIL`

**Description:**
Special three-character performance featuring Sage, Toady, and Halfwit as heralds of a dark provider, offering liberation from light.

**Characters:**
- **Sage**: Wise leader and main spokesperson
- **Toady**: Enthusiastic supporter
- **Halfwit**: Confused but eager participant

## Error Handling Content

### Performance Issues

The module includes strings for handling various performance problems:

#### Bad Costumes

**Content:** `stageactor.BAD_COSTUMES`

**Lines:**
- "Something's wrong!"
- "Check your costumes!"
- "We'll come back."
- "When you get it right!"

#### Repeat Costumes

**Content:** `stageactor.REPEAT_COSTUMES`

**Lines:**
- "Are you kidding?"
- "Am I seeing double?!"
- "No understudies!"

#### No Script

**Content:** `stageactor.NO_SCRIPT`

**Lines:**
- "Something's off."
- "They're going off-script!"
- "I didn't come for improv!"
- "We're out."

## Data Structure

### Line Organization

Stage content is organized with specific line identifiers:

```lua
-- Example structure for scenes
ACT1_SCENE1 = {
    LINE1 = "Act 1.",
    LINE2 = "Yeah, scene 1!",
    LINE3 = "Long ago, in a land oh so far away",
    -- ... more lines
}

-- Character-specific arrays
WILSON1 = {
    "Line 1",
    "Line 2",
    "Line 3",
    "Line 4",
}

-- Special content with metadata
WILLOW1 = {
    "Fire fire, burning bright,",
    "In the forests of the night;",
    -- Line with animation directive
    { "Everywhere! Burn it all down!! Hahaha!!", anim="emote_happycheer" },
    "Yeah, pretty sure that's how that poem goes.",
}
```

### Content Categories

The module organizes content into several categories:

1. **Character Performances**: Individual character monologues and performances
2. **Stage Play Acts**: Multi-scene theatrical content with narrator and dialogue
3. **Soliloquies**: Reflective individual performances
4. **Special Events**: Unique performances like The Veil
5. **Error Content**: Handling for performance issues
6. **Commentary**: Bird reactions and audience responses

## Integration with Stage Actor System

### Performance Selection

```lua
-- Get character performance based on character type
local function GetCharacterPerformance(character_prefab)
    local performance_key = string.upper(character_prefab) .. "1"
    return stageactor[performance_key]
end

-- Select random soliloquy
local soliloquies = {
    "BLACKSMITH_SOLILOQUY",
    "KING_SOLILOQUY", 
    "FOOL_SOLILOQUY",
    "TREE_SOLILOQUY"
}
local random_soliloquy = stageactor[soliloquies[math.random(#soliloquies)]]
```

### Scene Progression

```lua
-- Progress through stage play acts
local function GetNextScene(current_act, current_scene)
    local scene_key = "ACT" .. current_act .. "_SCENE" .. current_scene
    if stageactor[scene_key] then
        return stageactor[scene_key]
    end
    return nil
end
```

### Animation Integration

```lua
-- Handle lines with animation directives
local function PlayPerformanceLine(line)
    if type(line) == "table" then
        -- Line with special properties
        local text = line[1] or line.text
        local animation = line.anim
        
        if animation then
            PlayAnimationWithLine(text, animation)
        else
            PlayLine(text)
        end
    else
        -- Simple string line
        PlayLine(line)
    end
end
```

## Best Practices

### Content Organization

- **Consistent Naming**: Use clear, descriptive keys for all content
- **Character Alignment**: Ensure performances match character personalities
- **Progression Logic**: Maintain narrative coherence in multi-part content
- **Error Handling**: Provide appropriate feedback for performance issues

### Performance Quality

- **Literary References**: Include appropriate cultural and literary references
- **Character Voice**: Maintain consistent character voice and personality
- **Pacing Considerations**: Structure content for appropriate performance timing
- **Audience Engagement**: Include commentary and reactions for immersion

### Technical Integration

- **Animation Support**: Use animation directives where appropriate
- **Line Sequencing**: Organize content for easy sequential playback
- **Error Recovery**: Handle missing or invalid content gracefully
- **Performance Metrics**: Support tracking of performance completion and quality

## Common Usage Patterns

### Character Performance System
```lua
local function StartCharacterPerformance(character, audience)
    local performance_data = GetCharacterPerformance(character.prefab)
    
    if performance_data then
        for i, line in ipairs(performance_data) do
            if type(line) == "table" and line.anim then
                character.AnimState:PlayAnimation(line.anim)
                DisplayDialogue(character, line[1])
            else
                DisplayDialogue(character, line)
            end
            
            -- Wait for line completion
            WaitForLineCompletion()
        end
    end
end
```

### Stage Play Director
```lua
local function DirectStagePlay()
    local acts = {"ACT1", "ACT2", "ACT3"}
    
    for act_num, act_name in ipairs(acts) do
        local scene_num = 1
        
        repeat
            local scene_key = act_name .. "_SCENE" .. scene_num
            local scene_data = stageactor[scene_key]
            
            if scene_data then
                PlayScene(scene_data)
                scene_num = scene_num + 1
            end
        until not scene_data
    end
end
```

### Error Handling System
```lua
local function ValidatePerformance(actors, costumes)
    -- Check for costume issues
    if HasBadCostumes(costumes) then
        DisplayErrorLines(stageactor.BAD_COSTUMES)
        return false
    end
    
    -- Check for duplicate costumes
    if HasDuplicateCostumes(costumes) then
        DisplayErrorLines(stageactor.REPEAT_COSTUMES)
        return false
    end
    
    -- Check if actors are following script
    if not FollowingScript(actors) then
        DisplayErrorLines(stageactor.NO_SCRIPT)
        return false
    end
    
    return true
end
```

## Related Modules

- [Strings](./strings.md): Main string localization system
- [AnimState](./animstate.md): Animation system for performance animations
- [Events](./events.md): Event system for stage actor triggers
- [Prefabs](./prefabs.md): Character prefab system for performer identification
