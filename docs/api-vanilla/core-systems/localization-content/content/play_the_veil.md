---
id: play-the-veil
title: Play The Veil
description: "The Veil" theatrical performance implementation for the stage play system
sidebar_position: 9
slug: api-vanilla/core-systems/play-the-veil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Play The Veil

## Version History
| Build Version | Change Date | Change Type | Description |
|---|---|---|---|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `play_the_veil` module implements "The Veil" - a mysterious and dramatic theatrical performance for the Don't Starve Together stage play system. This dark philosophical play explores themes of truth, illusion, and revelation through the interactions of three archetypal characters: the wise Sage, the foolish Halfwit, and the servile Toady. The play features dramatic lighting effects, including a climactic blackout sequence.

## Usage Example

```lua
local veil_play = require("play_the_veil")

-- Access costume definitions
local costumes = veil_play.costumes
local sage_costume = costumes["SAGE"]

-- Access play scripts
local scripts = veil_play.scripts
local main_play = scripts["THEVEIL"]

-- Get starting act
local starting_act = veil_play.starting_act  -- "THEVEIL"
```

## Play Structure

### Story Summary

**"The Veil"** is a philosophical allegory presented as a single continuous act. The play explores:

- **Truth vs. Illusion**: The Sage attempts to guide others toward enlightenment
- **Ignorance and Servitude**: The Halfwit and Toady represent different forms of unenlightenment  
- **The Nature of Reality**: Culminates in a dramatic revelation about the nature of existence
- **Death and Rebirth**: Ends with a symbolic death and resurrection sequence

### Character Archetypes

| Character | Role | Symbolism |
|-----------|------|-----------|
| SAGE | Wise Teacher | Knowledge, enlightenment, truth |
| HALFWIT | Foolish Student | Ignorance, confusion, innocence |
| TOADY | Servile Follower | Sycophancy, false wisdom, corruption |

## Costumes

### Costume Definitions

```lua
costumes = {
    ["SAGE"] = {
        head = "mask_sagehat",
        name = STRINGS.CAST.SAGE
    },
    ["HALFWIT"] = {
        head = "mask_halfwithat", 
        name = STRINGS.CAST.HALFWIT
    },
    ["TOADY"] = {
        head = "mask_toadyhat",
        name = STRINGS.CAST.TOADY
    }
}
```

### Available Costumes

| Costume | Head | Body | Description |
|---------|------|------|-------------|
| SAGE | mask_sagehat | (none) | Wise philosopher and teacher |
| HALFWIT | mask_halfwithat | (none) | Simple-minded but pure character |
| TOADY | mask_toadyhat | (none) | Obsequious and manipulative character |

**Note**: Unlike "The Enchanted Doll," this play uses only head pieces (masks) without body costumes, emphasizing the archetypal nature of the characters.

## Scripts

### Solo Performance Scripts

#### SAGE_SOLILOQUY {#sage-soliloquy}

**Status:** `stable`

**Description:**
Solo performance featuring the Sage's philosophical monologue about wisdom, truth, and the nature of existence.

**Cast Requirements:**
- `SAGE`: Player wearing sage mask

**Script Features:**
- 7 lines of philosophical dialogue
- Extended bow sequence (3 seconds)
- Marionette effects
- No bird commentary (more serious tone)

**Structure:**
```lua
{
    cast = { "SAGE" },
    lines = {
        {actionfn = fn.findpositions, positions={["SAGE"] = 1}},
        {actionfn = fn.marionetteon},
        {actionfn = fn.actorsbow, duration = 3},
        -- 7 dialogue lines with sage wisdom
        {actionfn = fn.actorsbow},
        {actionfn = fn.marionetteoff}
    }
}
```

#### HALFWIT_SOLILOQUY {#halfwit-soliloquy}

**Status:** `stable`

**Description:**
Solo performance showcasing the Halfwit's confused but earnest attempts at understanding.

**Cast Requirements:**
- `HALFWIT`: Player wearing halfwit mask

**Script Features:**
- Uses TOADY dialogue strings (intentional confusion)
- Dance sequence with extended dance animations
- Extended bow sequence (3 seconds)
- Minimal dialogue with focus on physical comedy

**Special Features:**
- Animation sequence: `emoteXL_pre_dance7`, `emoteXL_loop_dance7` (repeated)
- Represents the character's confusion through mismatched dialogue

#### TOADY_SOLILOQUY {#toady-soliloquy}

**Status:** `stable`

**Description:**
Solo performance featuring the Toady's obsequious and manipulative nature.

**Cast Requirements:**
- `TOADY`: Player wearing toady mask

**Script Features:**
- Uses HALFWIT dialogue strings (showing the characters' interconnected confusion)
- Ends with angry animation (`emoteXL_angry`)
- No opening bow (emphasizing the character's lack of propriety)
- Represents the character's duplicitous nature

### Main Play Script

#### THEVEIL {#theveil}

**Status:** `stable`

**Description:**
The complete "Veil" performance featuring all three characters in a philosophical drama about truth and illusion.

**Cast Requirements:**
- `SAGE`: Player wearing sage mask (Position 1 - center stage)
- `TOADY`: Player wearing toady mask (Position 9 - left wide)
- `HALFWIT`: Player wearing halfwit mask (Position 10 - right wide)

**Script Features:**
- **Playbill**: STRINGS.PLAYS.THEVEIL
- **Next Scene**: THEVEIL (loops continuously)
- **Duration**: Approximately 2 minutes of performance
- **Music Progression**: Happy → Mysterious
- **Lighting Effects**: Dramatic blackout sequence
- **Special Effects**: Mask blinking, death/revival sequence

## Technical Features

### Unique Lighting System

"The Veil" is the only play that uses the blackout system:

```lua
{actionfn = fn.enableblackout, duration = 0.1},   -- Blackout starts
{actionfn = fn.stopbgmusic, duration = 1},        -- Music stops
-- Critical dialogue in darkness
{actionfn = fn.disableblackout, duration = 4},    -- Blackout ends
```

**Purpose**: Creates dramatic emphasis for the play's climactic revelation about the nature of reality.

### Special Visual Effects

#### Mask Blinking Effect

```lua
{roles = {"HALFWIT"}, duration = 3.5, actionfn = fn.do_mask_blink}
```

- Applies special mask blinking effect to the Halfwit
- Creates supernatural/mystical atmosphere
- Unique to this play among the theatrical performances

#### Death/Revival Sequence

```lua
-- All characters die symbolically
{roles = {"TOADY","SAGE","HALFWIT"}, duration = 2.0, anim="death", endidleanim="death_idle"},
-- Characters revive
{roles = {"TOADY","SAGE","HALFWIT"}, duration = 2.0, anim="parasite_death_pst"}
```

**Symbolism**: Represents the death of illusion and rebirth into truth.

### Character Interactions

The play features complex character dynamics:

1. **Opening Greetings**: All characters wave to each other and audience
2. **Dance Sequences**: Toady and Halfwit perform elaborate dances
3. **Philosophical Dialogue**: Sage attempts to teach wisdom
4. **Conflict**: Growing tension between characters  
5. **Revelation**: Truth is revealed through the veil metaphor
6. **Transformation**: Symbolic death and rebirth of understanding

### Musical Progression

The play uses two distinct musical phases:

**Phase 1 - Happy Music** (Opening):
- Light, cheerful music during introductions
- Characters are naive and optimistic
- Represents the illusion of simple happiness

**Phase 2 - Mysterious Music** (Middle):
- Dark, ominous music as truth emerges
- Characters face difficult realities
- Builds to the blackout climax

**Phase 3 - Silence** (Climax):
- All music stops during blackout
- Emphasizes the stark revelation
- Creates powerful dramatic impact

### Animation Choreography

The play features elaborate animation sequences:

| Character | Primary Animations | Symbolic Meaning |
|-----------|-------------------|------------------|
| SAGE | emoteXL_angry, emoteXL_waving4, emoteXL_happycheer | Wisdom, teaching, enlightenment |
| TOADY | emoteXL_dance7 (complex sequence), emoteXL_happycheer, emote_pre_toast | Deception, false celebration, corruption |
| HALFWIT | emoteXL_dance7, emoteXL_happycheer, death, emoteXL_bonesaw | Confusion, innocence, transformation |

## Play Progression

### Act Structure

```lua
-- Opening (Positions and Introductions)
{actionfn = fn.findpositions, positions={["SAGE"] = 1, ["TOADY"] = 9, ["HALFWIT"] = 10}}

-- Introduction by Birds
{roles = {"BIRD1"}, duration = 2, line = STRINGS.STAGEACTOR.THEVEIL.BIRD1_1}

-- Character Interactions
{roles = {"SAGE"}, duration = 2.0, line = STRINGS.STAGEACTOR.THEVEIL.LINE1_SAGE}

-- Building Tension
{roles = {"SAGE"}, duration = 2.0, line = STRINGS.STAGEACTOR.THEVEIL.LINE24_SAGE, anim="emoteXL_angry"}

-- Philosophical Discussion
{roles = {"TOADY"}, duration = 3.0, line = STRINGS.STAGEACTOR.THEVEIL.LINE34_TOADY}

-- Climactic Blackout
{actionfn = fn.enableblackout, duration = 0.1}

-- Resolution and Revival
{actionfn = fn.disableblackout, duration = 4}
```

### Dialogue Themes

The dialogue explores deep philosophical concepts:
- The nature of truth and illusion
- The relationship between wisdom and ignorance
- The role of the teacher and student
- The corruption of false knowledge
- The necessity of destroying illusion to find truth

## Integration Example

```lua
local veil_play = require("play_the_veil")
local fn = require("play_commonfn")

-- Setup the main play
local play = veil_play.scripts["THEVEIL"]
local costumes = veil_play.costumes

-- Verify cast has proper masks
for _, character in ipairs(play.cast) do
    local costume = costumes[character]
    if costume and costume.head then
        -- Ensure player has costume.head equipped
        -- Note: No body costume required for this play
    end
end

-- Execute play with special attention to lighting effects
for _, line in ipairs(play.lines) do
    if line.actionfn == fn.enableblackout then
        -- Prepare for dramatic blackout sequence
        print("Starting blackout sequence...")
    elseif line.actionfn == fn.disableblackout then
        -- Blackout ending
        print("Blackout sequence complete")
    end
    
    -- Execute the line
    if line.actionfn then
        line.actionfn(stage_inst, line, cast_data)
    end
end
```

## Comparison with Other Plays

| Feature | The Veil | The Enchanted Doll |
|---------|----------|-------------------|
| **Costume Complexity** | Masks only | Full body + head costumes |
| **Story Structure** | Single continuous act | 9 scenes across 3 acts |
| **Character Count** | 3 archetypal figures | 9+ characters with transformations |
| **Theme** | Philosophical allegory | Fairy tale adventure |
| **Special Effects** | Blackout, mask blinking | Costume transformations, magic |
| **Music** | Happy → Mysterious → Silent | Happy, Mysterious, Drama |
| **Target Audience** | Mature, philosophical | General, entertaining |

## Performance Notes

### Staging Recommendations

1. **Character Positioning**: 
   - SAGE center stage for authority
   - TOADY and HALFWIT on opposite sides (symbolic opposition)

2. **Timing Considerations**:
   - Allow full blackout effect to complete
   - Ensure mask blinking effect is visible to audience
   - Coordinate music transitions with character development

3. **Cast Coordination**:
   - All three characters must be present for main play
   - Individual soliloquies can be performed separately
   - Requires good coordination for group death/revival sequence

## Related Modules

- [Play Common Functions](./play_commonfn.md): Shared utility functions, especially lighting effects
- [Play General Scripts](./play_generalscripts.md): Character-specific monologue alternatives
- [Play The Doll](./play_the_doll.md): Alternative multi-character theatrical experience
