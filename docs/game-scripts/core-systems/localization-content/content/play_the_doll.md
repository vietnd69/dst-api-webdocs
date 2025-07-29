---
id: play-the-doll
title: Play The Doll
description: "The Enchanted Doll theatrical performance implementation for the stage play system"
sidebar_position: 8

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Play The Doll

## Version History
| Build Version | Change Date | Change Type | Description |
|---|---|---|---|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `play_the_doll` module implements "The Enchanted Doll" - a complete multi-act theatrical performance for the Don't Starve Together stage play system. This fairy tale tells the story of a magical doll who comes to life, faces challenges, and ultimately finds her true form. The play features 9 scenes across 3 acts with multiple characters, costumes, and story progression.

## Usage Example

```lua
local doll_play = require("play_the_doll")

-- Access costume definitions
local costumes = doll_play.costumes
local doll_costume = costumes["DOLL"]

-- Access play scripts
local scripts = doll_play.scripts
local first_scene = scripts["ACT1_SCENE1"]

-- Get starting act
local starting_act = doll_play.starting_act  -- "ACT1_SCENE1"
```

## Play Structure

### Story Summary

**"The Enchanted Doll"** follows the journey of a magical doll through three acts:

- **Act 1**: Introduction of the doll, her magic sleep, and encounter with a blacksmith and king
- **Act 2**: The doll's transformation, interaction with a magic mirror, and confrontation with the king
- **Act 3**: The doll's final transformation into a queen and resolution with the mirror

### Scene Progression

| Scene | Cast | Description | Next Scene |
|-------|------|-------------|------------|
| ACT1_SCENE1 | DOLL | Doll awakens and discovers her magic | ACT1_SCENE2 |
| ACT1_SCENE2 | DOLL, BLACKSMITH | Blacksmith works while doll sleeps and breaks | ACT1_SCENE3 |
| ACT1_SCENE3 | DOLL_BROKEN, KING | King meets the broken doll and helps her | ACT2_SCENE4 |
| ACT2_SCENE4 | DOLL_BROKEN, KING, MIRROR | Magic mirror repairs the doll | ACT2_SCENE5 |
| ACT2_SCENE5 | DOLL_REPAIRED, MIRROR | Repaired doll talks with mirror | ACT2_SCENE6 |
| ACT2_SCENE6 | DOLL_REPAIRED, KING | Conflict between doll and king | ACT3_SCENE7 |
| ACT3_SCENE7 | FOOL, DOLL_REPAIRED | Fool encounters the doll | ACT3_SCENE8 |
| ACT3_SCENE8 | KING, FOOL, DOLL_REPAIRED | Doll transforms into queen, king dies and revives | ACT3_SCENE9 |
| ACT3_SCENE9 | MIRROR, QUEEN | Final resolution between queen and mirror | ACT1_SCENE1 |

## Costumes

### Costume Definitions

```lua
costumes = {
    ["DOLL"] = {
        body = "costume_doll_body",
        head = "mask_dollhat",
        name = STRINGS.CAST.DOLL
    },
    -- ... other costume definitions
}
```

### Available Costumes

| Costume | Body | Head | Description |
|---------|------|------|-------------|
| DOLL | costume_doll_body | mask_dollhat | Original magical doll |
| DOLL_BROKEN | costume_doll_body | mask_dollbrokenhat | Doll after being broken |
| DOLL_REPAIRED | costume_doll_body | mask_dollrepairedhat | Doll after magical repair |
| KING | costume_king_body | mask_kinghat | Royal king character |
| BLACKSMITH | costume_blacksmith_body | mask_blacksmithhat | Craftsman character |
| QUEEN | costume_queen_body | mask_queenhat | Final form of the doll |
| TREE | costume_tree_body | mask_treehat | Nature spirit character |
| MIRROR | costume_mirror_body | mask_mirrorhat | Magic mirror character |
| FOOL | costume_fool_body | mask_foolhat | Court jester character |

## Scripts

### Solo Performance Scripts

#### BLACKSMITH_SOLILOQUY {#blacksmith-soliloquy}

**Status:** `stable`

**Description:**
Solo performance featuring the blacksmith character discussing his craft and dedication to work.

**Cast Requirements:**
- `BLACKSMITH`: Player wearing blacksmith costume

**Script Features:**
- Uses marionette effects
- Includes bird commentary
- Bow sequences for theatrical presentation

#### KING_SOLILOQUY {#king-soliloquy}

**Status:** `stable`

**Description:**
Solo performance showcasing the king's royal authority and wisdom.

**Cast Requirements:**
- `KING`: Player wearing king costume

#### FOOL_SOLILOQUY {#fool-soliloquy}

**Status:** `stable`

**Description:**
Solo performance featuring the fool's wit and humor, with disappointed bird reactions.

**Cast Requirements:**
- `FOOL`: Player wearing fool costume

**Special Features:**
- Bird shows disappointment (`sgparam="disappointed"`)

#### TREE_SOLILOQUY {#tree-soliloquy}

**Status:** `stable`

**Description:**
Solo performance where the narrator speaks for the tree spirit, with excited bird commentary.

**Cast Requirements:**
- `TREE`: Player wearing tree costume

**Special Features:**
- Uses NARRATOR role instead of TREE for dialogue
- Birds show excitement (`sgparam="excited"`)

#### REUNION {#reunion}

**Status:** `stable`

**Description:**
Two-character scene featuring an emotional reunion between the queen and blacksmith.

**Cast Requirements:**
- `QUEEN`: Player wearing queen costume
- `BLACKSMITH`: Player wearing blacksmith costume

**Special Features:**
- Includes audience commentary from Winona characters
- Emotional animations (spooked, various expressions)

### Main Play Scripts

#### ACT1_SCENE1 {#act1-scene1}

**Status:** `stable`

**Description:**
Opening scene introducing the magical doll who awakens from enchanted sleep.

**Cast Requirements:**
- `DOLL`: Player wearing doll costume

**Script Features:**
- **Playbill**: STRINGS.PLAYS.THE_ENCHANTED_DOLL[1]
- **Next Scene**: ACT1_SCENE2
- **Music**: Happy background music
- **Duration**: ~35 seconds of dialogue and action
- **Special Animations**: yawn, swoon
- **Sound Effects**: Intro stinger, outro stinger

#### ACT1_SCENE2 {#act1-scene2}

**Status:** `stable`

**Description:**
Scene where the blacksmith works while the doll sleeps, leading to the doll breaking.

**Cast Requirements:**
- `DOLL`: Player wearing doll costume
- `BLACKSMITH`: Player wearing blacksmith costume

**Script Features:**
- **Playbill**: STRINGS.PLAYS.THE_ENCHANTED_DOLL[2]
- **Next Scene**: ACT1_SCENE3
- **Costume Change**: DOLL transforms to DOLL_BROKEN via `fn.swapmask`
- **Building Animation**: Blacksmith performs crafting sequence
- **Sound Effects**: Dramatic stinger during transformation
- **Audience Interaction**: Winona crowd comments

#### ACT1_SCENE3 {#act1-scene3}

**Status:** `stable`

**Description:**
The king discovers the broken doll and offers to help her.

**Cast Requirements:**
- `DOLL_BROKEN`: Player wearing broken doll costume
- `KING`: Player wearing king costume

**Script Features:**
- **Playbill**: STRINGS.PLAYS.THE_ENCHANTED_DOLL[3]
- **Next Scene**: ACT2_SCENE4
- **Character Interactions**: King shows kindness to broken doll
- **Animations**: waving, laughing, shrugging, cheering

#### ACT2_SCENE4 {#act2-scene4}

**Status:** `stable`

**Description:**
The magic mirror appears and uses the king's power to repair the doll.

**Cast Requirements:**
- `DOLL_BROKEN`: Player wearing broken doll costume
- `KING`: Player wearing king costume
- `MIRROR`: Player wearing mirror costume

**Script Features:**
- **Playbill**: STRINGS.PLAYS.THE_ENCHANTED_DOLL[4]
- **Next Scene**: ACT2_SCENE5
- **Music**: Mysterious background music
- **Transformation**: DOLL_BROKEN becomes DOLL_REPAIRED
- **Magic Effects**: Magic blast stinger, death/revival sequence
- **Maxwell Crowd Comment**: Audience reaction to magic

#### ACT2_SCENE5 {#act2-scene5}

**Status:** `stable`

**Description:**
The repaired doll converses with the magic mirror about her new state.

**Cast Requirements:**
- `DOLL_REPAIRED`: Player wearing repaired doll costume
- `MIRROR`: Player wearing mirror costume

**Script Features:**
- **Playbill**: STRINGS.PLAYS.THE_ENCHANTED_DOLL[5]
- **Next Scene**: ACT2_SCENE6
- **Character Development**: Doll shows new determination
- **Animations**: fist shake (showing anger/determination)

#### ACT2_SCENE6 {#act2-scene6}

**Status:** `stable`

**Description:**
Confrontation between the repaired doll and the king, ending in conflict.

**Cast Requirements:**
- `DOLL_REPAIRED`: Player wearing repaired doll costume
- `KING`: Player wearing king costume

**Script Features:**
- **Playbill**: STRINGS.PLAYS.THE_ENCHANTED_DOLL[6]
- **Next Scene**: ACT3_SCENE7
- **Music**: Dramatic background music
- **Conflict**: Magic battle with blast effects
- **Character Exit**: King retreats after magical confrontation

#### ACT3_SCENE7 {#act3-scene7}

**Status:** `stable`

**Description:**
The fool encounters the doll and offers his perspective on her situation.

**Cast Requirements:**
- `FOOL`: Player wearing fool costume
- `DOLL_REPAIRED`: Player wearing repaired doll costume

**Script Features:**
- **Playbill**: STRINGS.PLAYS.THE_ENCHANTED_DOLL[7]
- **Next Scene**: ACT3_SCENE8
- **Character Positioning**: FOOL front, DOLL_REPAIRED back left
- **Wisdom**: Fool provides insight despite his comic nature

#### ACT3_SCENE8 {#act3-scene8}

**Status:** `stable`

**Description:**
Climactic scene where the doll transforms into a queen, the king dies and revives.

**Cast Requirements:**
- `KING`: Player wearing king costume
- `FOOL`: Player wearing fool costume
- `DOLL_REPAIRED`: Player wearing repaired doll costume

**Script Features:**
- **Playbill**: STRINGS.PLAYS.THE_ENCHANTED_DOLL[8]
- **Next Scene**: ACT3_SCENE9
- **Transformation**: DOLL_REPAIRED becomes QUEEN via costume swap
- **Death/Revival**: King dies and comes back to life
- **Sound Effects**: Dramatic stinger for transformation
- **Dance Sequence**: Fool performs extended dance

#### ACT3_SCENE9 {#act3-scene9}

**Status:** `stable`

**Description:**
Final scene resolving the relationship between the queen and magic mirror.

**Cast Requirements:**
- `MIRROR`: Player wearing mirror costume
- `QUEEN`: Player wearing queen costume

**Script Features:**
- **Playbill**: STRINGS.PLAYS.THE_ENCHANTED_DOLL[9]
- **Next Scene**: ACT1_SCENE1 (loops back to beginning)
- **Music**: Dramatic music for finale
- **Resolution**: Queen and mirror reach understanding
- **Finale**: Queen performs kiss animation, mirror bows

## Technical Features

### Marionette Effects

All main play scenes use marionette effects:
- **Duration**: 1.1 seconds (MARIONETTE_TIME constant)
- **Visual**: Marionette appear/disappear effects on non-bird, non-narrator cast
- **Timing**: Applied at scene start and end

### Music Integration

The play uses different musical themes:
- **"happy"**: Light, cheerful scenes (Act 1)
- **"mysterious"**: Magic and supernatural scenes (Act 2, Act 3)
- **"drama"**: Conflict and emotional scenes (Act 2 Scene 6, Act 3 Scene 9)

### Position Management

Actors are positioned using `fn.findpositions` with stage position numbers:
- **Position 1**: Front center (main character spotlight)
- **Position 2-3**: Left and right (dialogue partners)
- **Position 4-5**: Back positions (background characters)
- **Position 6-10**: Various special positions for dramatic effect

### Sound Effects

**Stingers** mark important moments:
- **Act 1 Intro**: `stageplay_set/statue_lyre/stinger_intro_act1`
- **Act 2 Intro**: `stageplay_set/statue_lyre/stinger_intro_act2`
- **Act 3 Intro**: `stageplay_set/statue_lyre/stinger_intro_act3`
- **Dramatic**: `stageplay_set/statue_lyre/stinger_dramatic`
- **Magic Blast**: `stageplay_set/statue_lyre/stinger_magicblast`
- **Outro**: `stageplay_set/statue_lyre/stinger_outro`

## Integration Example

```lua
local doll_play = require("play_the_doll")
local fn = require("play_commonfn")

-- Setup a scene
local scene = doll_play.scripts["ACT1_SCENE1"]
local costumes = doll_play.costumes

-- Verify cast has proper costumes
for _, character in ipairs(scene.cast) do
    local costume = costumes[character]
    if costume then
        -- Ensure player has costume.body and costume.head equipped
    end
end

-- Execute scene
for _, line in ipairs(scene.lines) do
    if line.actionfn then
        line.actionfn(stage_inst, line, cast_data)
    end
    -- Handle other line types...
end

-- Progress to next scene
local next_scene = scene.next
if next_scene then
    current_scene = doll_play.scripts[next_scene]
end
```

## Play Flow Control

The play supports continuous looping:
1. Scenes progress linearly through the story
2. Each scene specifies its `next` scene
3. ACT3_SCENE9 loops back to ACT1_SCENE1
4. Players can join at any scene if they have appropriate costumes

## Related Modules

- [Play Common Functions](./play_commonfn.md): Utility functions used throughout the play
- [Play General Scripts](./play_generalscripts.md): Character-specific monologue scripts
- [Play The Veil](./play_the_veil.md): Alternative multi-character play option
