---
id: speech-woodie
title: Speech - Woodie
description: Speech dialogue system for Woodie, the Canadian lumberjack character
sidebar_position: 7
slug: game-scripts/core-systems/speech-woodie
last_updated: 2025-06-25
build_version: 676312
change_status: modified
---

# Speech - Woodie

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676312 | 2025-06-25 | modified | Added Rift 5 speech lines: ANNOUNCE_FLOATER_HELD, ANNOUNCE_FLOATER_LETGO |
| 676042 | 2025-06-21 | stable | Previous version |

## Overview

The `speech_woodie.lua` file defines dialogue responses for Woodie, the Canadian lumberjack character. Generated via PropagateSpeech.bat from Wilson's master template, Woodie's speech reflects his polite Canadian personality, outdoor expertise, and special relationship with his talking axe Lucy.

## Character Personality

### Speech Characteristics
- **Canadian politeness**: Frequent use of "eh?" and apologetic phrases
- **Outdoor expertise**: References to camping, wilderness, and survival skills
- **Lucy interactions**: Special dialogue referencing his talking axe companion
- **Practical mindset**: Down-to-earth, hands-on approach to problems
- **Friendly demeanor**: Generally helpful and considerate tone

### Language Patterns
- Canadian colloquialisms ("eh", "aboot", "skookum")
- Apologetic expressions ("Sorry", "Oops")
- Outdoor/camping terminology
- Polite requests and suggestions
- References to Lucy the axe

## Speech Structure

### Primary Categories

#### ACTIONFAIL Responses
```lua
ACTIONFAIL = {
    GENERIC = {
        ITEMMIMIC = "Don't say it, Lucy!",
    },
    ACTIVATE = {
        LOCKED_GATE = "Guess we need a key.",
        HOSTBUSY = "What is that bird up to...",
        EMPTY_CATCOONDEN = "Nothin' really in here, eh?",
    },
    CHANGEIN = {
        GENERIC = "Ouch. Do I not look skookum enough already?",
        BURNING = "Better it than a tree.",
        NOTENOUGHHAIR = "Gotta wait for the hair to grow back in.",
    }
}
```

#### Character Responses
```lua
CHARACTERS = {
    GENERIC = "Hey there, %s!",
    ATTACKER = "Buddy, that wasn't very nice.",
    MURDERER = "You're bad news, %s.",
    REVIVER = "Thanks for the hand, %s!",
    GHOST = "You alright there, %s?",
}
```

#### Woodie-Specific Elements
```lua
-- References to Lucy the axe
CHOP = {
    TREE = {
        GENERIC = "Timber!",
        TOTALLY_NORMAL_TREE = "Oh Lucy, you so crazy.",
    },
}

-- Canadian expressions
ANNOUNCE_WORMHOLE = "That was a real barn-burner, eh Lucy?",
ANNOUNCE_PECKED = "Ow! What's that aboot?",
```

## Unique Character Elements

### Lucy References
- Frequent dialogue with his talking axe
- Lucy often provides commentary or warnings
- Special interactions during tree chopping

### Canadian Mannerisms
- "Eh?" as conversation filler
- "Aboot" instead of "about"
- "Skookum" (Canadian slang for strong/good)
- Apologetic nature

### Outdoor Expertise
- Knowledge of camping and survival
- Practical approach to wilderness challenges
- Comfort with outdoor living

## Technical Implementation

### File Structure
```lua
-- Generated via PropagateSpeech.bat
return {
    ACTIONFAIL = { ... },
    ANNOUNCE_BEES = "...",
    ANNOUNCE_BOOMERANG = "...",
    -- [Additional speech categories]
    DESCRIBE = { ... },
    ACTIONFAIL_GENERIC = { ... }
}
```

### Fallback System
- Uses Wilson's responses as fallback when no specific dialogue exists
- Maintains character consistency through Canadian terminology
- Preserves Lucy axe references throughout

### Character-Specific Overrides
```lua
-- Woodie's unique responses override Wilson's generic ones
DESCRIBE = {
    LUCY = "How ya doin' there, Lucy?",
    LIVINGLOG = "Aw geez, I don't like the looks of that.",
    BEARGER = "That's a big fella, eh Lucy?",
}
```

## Speech Categories

### Action Failures
- **Locked/Blocked**: Polite acknowledgment of barriers
- **Equipment Issues**: References to Lucy or camping gear
- **Timing Problems**: Patient, understanding responses

### Environmental Reactions
- **Weather**: Comfortable with outdoor conditions
- **Seasons**: Experienced woodsman perspective
- **Dangers**: Cautious but not fearful

### Item Interactions
- **Tools**: Appreciation for quality craftsmanship
- **Food**: Practical approach to sustenance
- **Lucy**: Special reverence for his magical axe

## Development Notes

### Character Voice Guidelines
1. **Maintain politeness**: Always considerate and apologetic when appropriate
2. **Include Canadian expressions**: Use "eh", "aboot", and regional terms naturally
3. **Reference Lucy**: Include axe companion in relevant dialogue
4. **Outdoor focus**: Emphasize wilderness knowledge and camping experience
5. **Friendly tone**: Keep interactions warm and helpful

### Dialogue Patterns
- Questions often end with "eh?"
- Apologies frequently used ("Sorry", "Oops")
- Direct but polite communication style
- References to outdoor activities and survival

## Quality Assurance

### Character Consistency Checks
- [ ] Canadian mannerisms present throughout
- [ ] Lucy references appropriately included
- [ ] Outdoor expertise reflected in responses
- [ ] Polite tone maintained in all interactions
- [ ] No overly aggressive or rude responses

### Technical Validation
- [ ] Proper Lua table structure maintained
- [ ] Fallback system functions correctly
- [ ] Character-specific overrides implemented
- [ ] Speech categories complete and functional

## Related Characters

### Similar Personality Types
- **Walter**: Shared outdoor enthusiasm and practical mindset
- **Wigfrid**: Different approach but similar dedication to personal ethos
- **Wolfgang**: Friendly demeanor though different cultural background

### Contrasting Characters
- **WX-78**: Opposite approach to politeness and social interaction
- **Maxwell**: Contrasting levels of formality and condescension
- **Wortox**: Different style of playfulness and interaction

## Usage Context

### In-Game Application
- Dialogue appears during player actions and interactions
- Responses reflect current game state and context
- Character voice enhances immersion and personality

### Modding Considerations
- Speech system allows for character-specific dialogue additions
- Fallback system ensures compatibility
- Character voice must remain consistent with established personality

This documentation provides comprehensive coverage of Woodie's speech system, emphasizing his Canadian lumberjack personality, relationship with Lucy, and polite outdoor expertise that defines his character in Don't Starve Together.
