---
id: speech-walter
title: Walter Speech
description: Character-specific dialogue and speech responses for Walter, the Fearless Scout
sidebar_position: 16

last_updated: 2025-06-25
build_version: 676312
change_status: modified
---

# Walter Speech

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676312 | 2025-06-25 | modified | Added Rift 5 speech lines: ANNOUNCE_FLOATER_HELD, ANNOUNCE_FLOATER_LETGO |
| 676042 | 2025-06-21 | stable | Previous version |

## Overview

The `speech_walter.lua` file contains character-specific dialogue and speech responses for Walter, the Fearless Scout. This file showcases Walter's youthful enthusiasm, scout training, and his special bond with his companion Woby through his unique dialogue patterns.

## Character Personality

Walter's speech reflects his background as:
- **Enthusiastic scout**: References scout training and outdoor activities
- **Optimistic youth**: Uses energetic, positive language typical of a young adventurer
- **Woby's companion**: Frequently mentions and talks to his loyal dog companion
- **Safety-conscious**: Shows awareness of proper procedures and first aid
- **Curious explorer**: Demonstrates interest in nature and adventure

## Speech Characteristics

### Language Style
- **Casual, youthful**: Uses informal language appropriate for a young scout
- **Energetic tone**: Enthusiastic and upbeat responses
- **Woby references**: Frequently includes his companion in dialogue
- **Scout terminology**: References camping, outdoor skills, and safety procedures

### Example Responses

#### Scout Enthusiasm
```lua
-- Wilson: "Well that's inconvenient."
-- Walter:
ITEMMIMIC = "Oops!"
```

#### Woby Companion References
```lua
-- Includes Woby in his thoughts and plans
DIRECTCOURIER_MAP = {
    NOTARGET = "Guess we should pick another spot, Woby."
}

DRAW = {
    NOIMAGE = "Wait... Woby, do you remember what it looked like?"
}
```

#### Scout Safety Awareness
```lua
-- Shows proper safety training
ATTUNE = {
    NOHEALTH = "I can't! I need medical attention! Where's the first aid kit?!"
}

CHANGEIN = {
    BURNING = "That goes against everything we learned about fire safety."
}
```

## Speech Patterns

### Adventure Spirit
```lua
-- Positive, adventurous responses
HOSTBUSY = "Excuse me, mister...? Hm, looks like he's busy."
CARNIVAL_HOST_HERE = "I thought I saw him around here somewhere..."
NOCARNIVAL = "Aw, looks like they all left..."
```

### Scout Knowledge
```lua
-- References proper outdoor techniques
FISH_OCEAN = {
    TOODEEP = "A Pinetree Pioneer knows to use the right equipment. And this isn't it."
}

FILL_OCEAN = {
    UNSUITABLE_FOR_PLANTS = "Maybe if I was growing a garden full of seaweed."
}
```

### Youthful Uncertainty
```lua
-- Shows appropriate hesitation for a young scout
GIVE = {
    GENERIC = "I don't think I should put that there... should I?"
    SLEEPING = "Hey Woby, should we wake them up?"
}
```

## Character-Specific Responses

### Woby Interactions
Walter frequently talks to and includes Woby in his responses:
```lua
-- Planning with Woby
BUILD = {
    HASPET = "I think Woby might get jealous if I keep collecting pets."
    BUSY_STATION = "We have to wait, Woby!"
}

-- Seeking Woby's input
CARNIVALGAME_ALREADY_PLAYING = "We can wait till they're done. Right Woby?"
```

### Scout Training References
```lua
-- Demonstrates outdoor knowledge
CONSTRUCT = {
    NOTREADY = "Maybe I'll try when the ground isn't shaking."
}

COOK = {
    GENERIC = "If only I had some marshmallows... oh well."
    INUSE = "Hey while you're here, wanna hear a scary story I heard on the radio?"
}
```

### Youthful Enthusiasm
```lua
-- Shows excitement about discoveries
EMPTY_CATCOONDEN = "It's empty? Well now I feel kind of bad..."
KITCOON_HIDEANDSEEK_NOT_ENOUGH_HIDERS = "It would be a pretty short game, maybe I should find more first."
```

### Rift 5 Content
Walter's responses to new Rift 5 mechanics show his adventurous spirit:
```lua
-- Rift 5 - New floating mechanics
ANNOUNCE_FLOATER_HELD = "I knew I'd come out on top!"
ANNOUNCE_FLOATER_LETGO = "Submerging!"
ANNOUNCE_LUNARGUARDIAN_INCOMING = "Incoming... again?"
```

## Unique Character Elements

### First Aid Awareness
Walter shows knowledge of proper medical procedures:
```lua
ATTUNE = {
    NOHEALTH = "I can't! I need medical attention! Where's the first aid kit?!"
}
```

### Radio References
As a scout, Walter mentions radio communication:
```lua
COOK = {
    INUSE = "Hey while you're here, wanna hear a scary story I heard on the radio?"
}
```

### Pet Management
Shows understanding of pet care and training:
```lua
BUILD = {
    TICOON = "One of these guys is enough to keep track of."
}
```

## Fallback Mechanism

### Character-Specific Overrides
Walter overrides Wilson's responses to match his scout personality:
```lua
-- Wilson: "I can't cook right now."
-- Walter:
GENERIC = "If only I had some marshmallows... oh well."
```

### Wilson Fallbacks
Some responses fall back to Wilson's speech when Walter doesn't have specific dialogue:
```lua
--fallback to speech_wilson.lua
BURNING = "only_used_by_webber"
ONEGHOST = "only_used_by_wendy"
```

## Technical Implementation

### File Generation
- **Generated via**: PropagateSpeech.bat automation
- **Base template**: Inherits structure from speech_wilson.lua
- **Custom responses**: Overrides specific dialogue to match scout personality

### Character Integration
- **Woby companion**: Special dialogue for Walter's unique pet relationship
- **Scout theme**: Consistent outdoor and adventure terminology
- **Age-appropriate**: Language suitable for an enthusiastic young character

## Development Notes

### Speech Consistency
- Maintains Walter's optimistic, adventurous spirit
- Preserves his identity as a capable but young scout
- Shows his strong bond with Woby
- Reflects his outdoor training and safety awareness

### Quality Guidelines
- Use energetic, youthful language appropriate for a scout
- Include Woby references where natural and appropriate
- Reference scout training, camping, and outdoor activities
- Maintain optimistic tone even in challenging situations

## Related Characters

Walter's speech contrasts with:
- **Wilson**: Youthful enthusiasm vs. Wilson's mature scientific approach
- **Wendy**: Optimistic adventure vs. Wendy's melancholic poetry
- **Wolfgang**: Scout training vs. Wolfgang's strength-focused responses
- **Wickerbottom**: Youthful energy vs. Wickerbottom's scholarly wisdom

## Usage in Game

Walter's speech enhances his role as:
- **The scout**: Provides outdoor expertise and adventure enthusiasm
- **The companion**: Shows unique pet relationship with Woby
- **The optimist**: Maintains positive outlook in dangerous situations
- **The youth**: Brings energetic, age-appropriate perspective to the group

This speech system reinforces Walter's character identity as the brave, enthusiastic scout who faces the wilderness with his faithful companion Woby.
