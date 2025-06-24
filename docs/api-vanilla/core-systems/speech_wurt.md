---
id: speech-wurt
title: Speech - Wurt
description: Speech dialogue system for Wurt, the young merm character
sidebar_position: 184
slug: api-vanilla/core-systems/speech-wurt
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Speech - Wurt

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `speech_wurt.lua` file defines dialogue responses for Wurt, the young merm character. Generated via PropagateSpeech.bat from Wilson's master template, Wurt's speech reflects her aquatic nature, childlike enthusiasm, and merm-specific communication patterns including unique vocalizations and imperfect grammar.

## Character Personality

### Speech Characteristics
- **Aquatic focus**: Water-related terminology and merm perspective
- **Childlike energy**: Enthusiastic and impatient expressions
- **Imperfect grammar**: Simple sentence structure and basic vocabulary
- **Merm vocalizations**: Unique sounds like "florp", "glurt", "glurph"
- **Direct communication**: Straightforward, honest expressions

### Language Patterns
- Merm-specific vocalizations ("florp", "glurt", "glurph", "florpt")
- Simple grammar and short sentences
- Water and fish-related terminology
- Impatient expressions and demands
- Direct, childlike honesty

## Speech Structure

### Primary Categories

#### ACTIONFAIL Responses
```lua
ACTIONFAIL = {
    GENERIC = {
        ITEMMIMIC = "Bad tricker!",
    },
    ACTIVATE = {
        LOCKED_GATE = "Grrr... want in!",
        HOSTBUSY = "Hey! Trying to talk to you!",
        EMPTY_CATCOONDEN = "Glargh... no stuff in there, where they hide it?!",
    },
    CHANGEIN = {
        GENERIC = "Don't wanna, florp.",
        BURNING = "Nope!",
        NOTENOUGHHAIR = "Big fuzzy not fuzzy enough!",
    }
}
```

#### Character Responses
```lua
CHARACTERS = {
    GENERIC = "Oh! Hello there, %s!",
    ATTACKER = "Why %s being mean?!",
    MURDERER = "Stay away from me, %s!",
    REVIVER = "Thank you, %s!",
    GHOST = "%s looks see-through, florp!",
}
```

#### Wurt-Specific Elements
```lua
-- Merm vocalizations
ANNOUNCE_HUNGRY = "Want food! Glort!",
ANNOUNCE_COLD = "Brrr! Too cold for scales!",

-- Aquatic references
DESCRIBE = {
    POND = "Nice water! Like home!",
    FISH = "Hello little swimmy friend!",
    OCEAN = "Big water! Best water!",
}
```

## Unique Character Elements

### Merm Vocalizations
- "Florp" - General exclamation or filler
- "Glurt/Glurph" - Expressions of confusion or effort
- "Florpt" - Emphatic exclamation
- "Glargh" - Frustration or annoyance

### Aquatic Perspective
- Strong preference for water and aquatic environments
- Understanding of fish and marine life
- Discomfort in dry or landlocked areas
- Merm cultural references

### Childlike Nature
- Impatient demands and expressions
- Simple, direct communication
- Enthusiasm for new experiences
- Honest emotional expressions

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
- Simplifies language to match Wurt's vocabulary level
- Maintains aquatic perspective and merm vocalizations

### Character-Specific Overrides
```lua
-- Wurt's merm responses override Wilson's human ones
DESCRIBE = {
    MERM = "Other Mermfolk! Hello!",
    MERMHEAD = "Poor Mermfolk friend...",
    KELP = "Tasty sea snacks!",
}
```

## Speech Categories

### Action Failures
- **Locked/Blocked**: Frustrated demands with merm vocalizations
- **Equipment Issues**: Direct complaints about problems
- **Timing Problems**: Impatient responses with childlike frustration

### Environmental Reactions
- **Water**: Enthusiastic recognition and comfort
- **Land**: Tolerance but preference for aquatic environments
- **Weather**: Direct expressions of comfort or discomfort

### Item Interactions
- **Aquatic items**: Special appreciation and understanding
- **Food**: Direct hunger expressions and taste preferences
- **Tools**: Basic understanding with merm perspective

## Development Notes

### Character Voice Guidelines
1. **Include merm vocalizations**: Use "florp", "glurt", "glurph" naturally
2. **Maintain simple grammar**: Keep sentences short and basic
3. **Express aquatic perspective**: Show preference for water and marine life
4. **Show childlike impatience**: Include demands and enthusiastic expressions
5. **Use direct communication**: Avoid complex or subtle expressions

### Dialogue Patterns
- Short sentences with basic grammar
- Merm vocalizations as exclamations or fillers
- Direct emotional expressions
- Water and fish-related terminology
- Impatient demands and complaints

## Quality Assurance

### Character Consistency Checks
- [ ] Merm vocalizations appropriately included
- [ ] Simple grammar maintained throughout
- [ ] Aquatic perspective reflected in responses
- [ ] Childlike impatience expressed naturally
- [ ] Direct communication style preserved

### Technical Validation
- [ ] Proper Lua table structure maintained
- [ ] Fallback system functions correctly
- [ ] Character-specific overrides implemented
- [ ] Speech categories complete and functional

## Related Characters

### Similar Personality Types
- **Wormwood**: Shared simple vocabulary and direct communication
- **Walter**: Different focus but similar childlike enthusiasm
- **Webber**: Childlike perspective though different cultural background

### Contrasting Characters
- **Wickerbottom**: Opposite vocabulary complexity and academic approach
- **Maxwell**: Contrasting sophistication and communication style
- **Wanda**: Different urgency motivations and expression style

## Usage Context

### In-Game Application
- Dialogue appears during player actions and interactions
- Responses reflect Wurt's merm nature and childlike personality
- Character voice enhances her aquatic outsider identity

### Modding Considerations
- Speech system allows for character-specific dialogue additions
- Fallback system ensures compatibility
- Character voice must maintain merm vocalizations and simple grammar

This documentation provides comprehensive coverage of Wurt's speech system, emphasizing her aquatic nature, childlike enthusiasm, and unique merm communication patterns that define her character in Don't Starve Together.
