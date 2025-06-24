---
id: speech-wickerbottom
title: Wickerbottom Speech
description: Character-specific dialogue and speech responses for Wickerbottom, the Librarian
sidebar_position: 6
slug: /api-vanilla/core-systems/speech-wickerbottom
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Wickerbottom Speech

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `speech_wickerbottom.lua` file contains character-specific dialogue and speech responses for Wickerbottom, the Librarian. Generated from the master Wilson template via `PropagateSpeech.bat`, this file showcases Wickerbottom's intellectual, scholarly personality through her unique dialogue patterns.

## Character Personality

Wickerbottom's speech reflects her background as:
- **Academic scholar**: Uses formal, educated language
- **Experienced librarian**: Makes references to books, research, and knowledge
- **Patient teacher**: Often explanatory and informative in her responses
- **Polite manner**: Uses formal courtesy and proper grammar
- **Scientific observer**: Makes detailed, analytical observations

## Speech Characteristics

### Language Style
- **Formal vocabulary**: Uses sophisticated and academic terms
- **Complete sentences**: Proper grammar and sentence structure
- **Polite address**: Frequently uses "dear" when addressing others
- **Academic references**: Makes allusions to research and study

### Example Responses

#### Academic Tone
```lua
-- Wilson: "Well that's inconvenient."
-- Wickerbottom:
ITEMMIMIC = "I knew it."
```

#### Formal Courtesy
```lua
-- Wilson: "I don't think so."
-- Wickerbottom:
GENERIC = "I don't think so, dear."
```

#### Educational Explanations
```lua
-- Wilson: "This specimen is far too insubstantial."
-- Wickerbottom:
FISH_TOO_SMALL = "This specimen is far too insubstantial."

-- Wilson: "I'm afraid this specimen simply doesn't have enough mass to compete."
-- Wickerbottom:
OVERSIZEDVEGGIES_TOO_SMALL = "I'm afraid this specimen simply doesn't have enough mass to compete."
```

## Speech Patterns

### Scholarly Language
```lua
-- Formal, academic descriptions
HOSTBUSY = "He seems to be attending to other matters at the moment."
CARNIVAL_HOST_HERE = "I believe I saw our host somewhere in this direction."
NOCARNIVAL = "How disappointing, the corvids seem to have migrated elsewhere."
```

### Gentle Corrections
```lua
-- Patient, educational responses
CHANGEIN = {
    GENERIC = "I think I look pretty smart already.",
    NOTENOUGHHAIR = "Perhaps once the hair has regrown.",
    NOOCCUPANT = "This station requires a beefalo to be securely hitched before I can proceed any further."
}
```

### Scientific Precision
```lua
-- Detailed, analytical observations
BATHBOMB = {
    GLASSED = "The surface of the spring has crystallized, unfortunately.",
    ALREADY_BOMBED = "No need to be excessive."
}
```

## Character-Specific Responses

### Knowledge-Based Comments
Wickerbottom often demonstrates her extensive knowledge:
```lua
-- Biological knowledge
EMPTY_CATCOONDEN = "Unfortunately, it appears the kittens are not present."
KITCOON_HIDEANDSEEK_NOT_ENOUGH_HIDERS = "It would seem the seekers outnumber the kittens."

-- Technical understanding
DISMANTLE = {
    COOKING = "I'm afraid I'll have to wait until it's finished cooking.",
    INUSE = "It's already in use.",
    NOTEMPTY = "I'll have to remove its contents first."
}
```

### Polite Interactions
Her responses show consideration for others:
```lua
COOK = {
    GENERIC = "Perhaps later. Not all old ladies enjoy cooking, you know.",
    INUSE = "Mmm, smells lovely, dear.",
    TOOFAR = "It is not within my reach."
}
```

## Fallback Mechanism

### Character-Specific Overrides
Wickerbottom overrides Wilson's responses where appropriate:
```lua
-- Wilson: "I can't cook right now."
-- Wickerbottom: 
GENERIC = "Perhaps later. Not all old ladies enjoy cooking, you know."
```

### Wilson Fallbacks
Some responses fall back to Wilson's speech:
```lua
--fallback to speech_wilson.lua
BURNING = "only_used_by_webber",
BURNT = "only_used_by_webber",
FROZEN = "only_used_by_webber",
```

## Technical Implementation

### File Generation
- **Generated via**: PropagateSpeech.bat automation
- **Base template**: Inherits structure from speech_wilson.lua
- **Custom responses**: Overrides specific dialogue to match character personality

### Response Categories
Same major categories as Wilson but with character-appropriate modifications:
- **ACTIONFAIL**: Action failure responses with scholarly tone
- **Item descriptions**: Academic observations about game objects
- **Interaction responses**: Polite, educated dialogue
- **Meta descriptions**: Formal environmental observations

## Development Notes

### Speech Consistency
- Maintains Wickerbottom's formal, educated speaking style
- Preserves her character as knowledgeable but kind
- Shows patience and teaching instincts
- Reflects her background in academia and research

### Quality Guidelines
- Use formal vocabulary appropriate for an educated librarian
- Maintain polite, courteous tone in all interactions
- Include references to knowledge, books, or academic concepts where appropriate
- Ensure responses reflect her patient, explanatory personality

## Related Characters

Wickerbottom's speech contrasts with:
- **Wilson**: More academic vs. Wilson's casual scientific enthusiasm
- **Wolfgang**: Intellectual complexity vs. Wolfgang's simple directness  
- **Wendy**: Scholarly optimism vs. Wendy's melancholic poetry
- **Maxwell**: Academic humility vs. Maxwell's aristocratic arrogance

## Usage in Game

Wickerbottom's speech enhances her role as:
- **The scholar**: Provides educated perspectives on game elements
- **The teacher**: Offers informative explanations
- **The librarian**: References knowledge and research
- **The gentle authority**: Combines expertise with kindness

This speech system reinforces Wickerbottom's character identity as the wise, patient, and scholarly member of the cast.
