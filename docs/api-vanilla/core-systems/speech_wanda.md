---
id: speech-wanda
title: Wanda Speech
description: Character-specific dialogue and speech responses for Wanda, the Clockmaker
sidebar_position: 4
slug: /api-vanilla/core-systems/speech-wanda
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Wanda Speech

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `speech_wanda.lua` file contains character-specific dialogue and speech responses for Wanda, the Clockmaker. This file showcases Wanda's time-obsessed personality, temporal abilities, and her constant awareness of time's passage through her unique dialogue patterns.

## Character Personality

Wanda's speech reflects her background as:
- **Time obsessed**: Constantly references time, clocks, and temporal concepts
- **Impatient nature**: Shows frustration with delays and waiting
- **Temporal awareness**: Demonstrates understanding of different timelines and time manipulation
- **Determined craftswoman**: References her clockmaking skills and precision
- **World-weary traveler**: Shows experience across different timelines and realities

## Speech Characteristics

### Language Style
- **Time references**: Frequent mentions of time, clocks, and temporal concepts
- **Impatient tone**: Shows frustration with delays and inefficiency
- **Technical precision**: Uses clockmaking and mechanical terminology
- **Timeline awareness**: References different timelines and temporal possibilities

### Example Responses

#### Time-Focused Language
```lua
-- Wilson: "Well that's inconvenient."
-- Wanda:
ITEMMIMIC = "Next time I'll choose the right one."
```

#### Impatience with Delays
```lua
-- Shows frustration with waiting
APPRAISE = {
    NOTNOW = "I need you to look at this, time is of the essence!"
}

CONSTRUCT = {
    INUSE = "Waiting is so tedious!"
}
```

#### Timeline References
```lua
-- References multiple timelines and temporal possibilities
BATHBOMB = {
    GLASSED = "Maybe in another timeline."
    ALREADY_BOMBED = "It's so much fun, maybe I should go back and do it again!"
}
```

## Speech Patterns

### Time and Clock Metaphors
```lua
-- Uses temporal and mechanical metaphors
LOCKED_GATE = "Could I pick the lock? Locks and clocks are only a letter apart, after all."

FISH_OCEAN = {
    TOODEEP = "Ha! That would be like trying to use a pinion for a wheel!"
}
```

### Temporal Confusion
```lua
-- Shows confusion about different timelines
CONSTRUCT = {
    EMPTY = "I thought I'd already put... ah, I must've done it later."
    MISMATCH = "Hold on... these are the wrong plans! What a waste of time!"
}
```

### Impatience and Urgency
```lua
-- Demonstrates time pressure and impatience
DISMANTLE = {
    COOKING = "I'll have to be patient... just be patient... I can be patient!"
    INUSE = "Could you hurry it up a little?"
}
```

## Character-Specific Responses

### Clock and Time Manipulation
Wanda has unique responses related to her temporal abilities:
```lua
-- Pocket watch specific responses
CAST_POCKETWATCH = {
    GENERIC = "It'd be too risky."
    REVIVE_FAILED = "It looks like I was too late..."
    WARP_NO_POINTS_LEFT = "That's enough backtracking for now."
    SHARD_UNAVAILABLE = "There's too much wobble wibbling the timestream."
}

DISMANTLE_POCKETWATCH = {
    ONCOOLDOWN = "It needs a bit of time to unwind."
}
```

### Memory and Timeline Confusion
```lua
-- Shows effects of timeline jumping
DRAW = {
    NOIMAGE = "Hm. I can't quite remember what it looks like..."
}

GIVE = {
    DUPLICATE = "I'm having deja vu... didn't we already make this? Or will we..."
}
```

### Time-Related Frustrations
```lua
-- Expresses impatience with time-consuming activities
CHANGEIN = {
    INUSE = "Would you hurry it up a bit in there?"
}

CARNIVALGAME_ALREADY_PLAYING = "I'll just come back later. Or earlier."
```

## Unique Character Elements

### Temporal Abilities
Wanda has unique dialogue for her clockwork abilities:
```lua
-- References to timeline jumping and time manipulation
HOSTBUSY = "Ugh, I should come back sooner... or maybe later."
NOCARNIVAL = "Gone already? Time sure flies when you're having fun."
```

### Clockmaking Expertise
Shows her technical knowledge:
```lua
-- Mechanical and precision references
NOTGEM = "Please. That would be like trying to put a pendulum on a watch."
NOTATRIUMKEY = "I need something that fits perfectly for the mechanism to work."
```

### Timeline Experience
Demonstrates experience across multiple realities:
```lua
-- References to different timelines and possibilities
GIVE = {
    DEAD = "Maybe in a different timeline..."
    GHOSTHEART = "Oh. My mistake, I thought you were a friend of mine."
}
```

## Time-Related Speech Patterns

### Clock and Watch Metaphors
```lua
-- Uses timepiece analogies
NOTSTAFF = "I need something that fits perfectly for the mechanism to work."
NOGENERATORSKILL = "Please. That would be like trying to put a pendulum on a watch."
```

### Temporal Urgency
```lua
-- Shows constant time pressure
ATTUNE = {
    NOHEALTH = "I feel the darkness coming for me... I need more time!"
}

BUILD = {
    BUSY_STATION = "This is taking forever."
}
```

### Timeline Memory Issues
```lua
-- Shows confusion from timeline jumping
CHANGEIN = {
    NOOCCUPANT = "I thought I'd hitched up a... must've been in a different timeline."
}

COMPARE_WEIGHABLE = {
    OVERSIZEDVEGGIES_TOO_SMALL = "Too small. I guess I shouldn't have picked it so early..."
}
```

## Technical Implementation

### File Generation
- **Generated via**: PropagateSpeech.bat automation
- **Base template**: Inherits structure from speech_wilson.lua
- **Custom responses**: Overrides specific dialogue to match temporal theme

### Unique Character Features
- **Pocket watch responses**: Special dialogue for Wanda's unique items
- **Timeline references**: Consistent temporal terminology
- **Impatience theme**: Frustration with delays and waiting

## Development Notes

### Speech Consistency
- Maintains Wanda's time-obsessed personality
- Preserves her impatient but determined nature
- Shows effects of timeline jumping and temporal confusion
- Reflects her expertise in clockmaking and precision

### Quality Guidelines
- Include time and clock references where appropriate
- Show impatience with delays and inefficiency
- Reference multiple timelines and temporal possibilities
- Use mechanical and precision terminology consistent with clockmaking

## Related Characters

Wanda's speech contrasts with:
- **Wilson**: Temporal urgency vs. Wilson's methodical approach
- **Wickerbottom**: Time pressure vs. Wickerbottom's patient wisdom
- **Walter**: Temporal confusion vs. Walter's straightforward enthusiasm
- **Maxwell**: Time obsession vs. Maxwell's power obsession

## Usage in Game

Wanda's speech enhances her role as:
- **The time traveler**: Provides temporal perspective and urgency
- **The craftsman**: Shows precision and technical expertise
- **The impatient**: Drives urgency in group activities
- **The timeline jumper**: Brings unique perspective from temporal experience

This speech system reinforces Wanda's character identity as the time-obsessed clockmaker struggling with temporal displacement and the constant pressure of time's passage.
