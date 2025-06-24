---
id: speech-wormwood
title: Speech - Wormwood
description: Speech dialogue system for Wormwood, the plant-based character with limited vocabulary
sidebar_position: 182
slug: api-vanilla/core-systems/speech-wormwood
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Speech - Wormwood

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `speech_wormwood.lua` file defines dialogue responses for Wormwood, the sentient plant character. Generated via PropagateSpeech.bat from Wilson's master template, Wormwood's speech reflects his simple vocabulary, plant-based perspective, and childlike wonder about the world.

## Character Personality

### Speech Characteristics
- **Limited vocabulary**: Simple words and short sentences
- **Plant perspective**: Views world through botanical lens
- **Innocent nature**: Childlike curiosity and wonder
- **Friend-focused**: Refers to other beings as "friends"
- **Fire aversion**: Strong negative reactions to fire and burning

### Language Patterns
- Short, simple sentences
- Basic grammar structure
- Plant-related terminology
- "Friend" references for other entities
- Exclamations and simple emotions

## Speech Structure

### Primary Categories

#### ACTIONFAIL Responses
```lua
ACTIONFAIL = {
    GENERIC = {
        ITEMMIMIC = "Wrong friend!",
    },
    ACTIVATE = {
        LOCKED_GATE = "Nope. Locked",
        HOSTBUSY = "Big Tweeter busy",
        EMPTY_CATCOONDEN = "No friend inside",
    },
    CHANGEIN = {
        GENERIC = "Not now",
        BURNING = "Fire! Don't like fire!",
        NOTENOUGHHAIR = "Not fuzzy enough",
    }
}
```

#### Character Responses
```lua
CHARACTERS = {
    GENERIC = "Hello, friend %s!",
    ATTACKER = "Why hurt Wormwood?!",
    MURDERER = "Bad friend! Very bad!",
    REVIVER = "Thank you, friend %s!",
    GHOST = "Friend %s looks pale...",
}
```

#### Wormwood-Specific Elements
```lua
-- Plant-focused responses
DESCRIBE = {
    FLOWER = "Pretty friend!",
    TREE = "Hello, tree friend!",
    FIRE = "No no no! Bad fire!",
}

-- Simple vocabulary patterns
ANNOUNCE_HUNGRY = "Belly empty",
ANNOUNCE_COLD = "Brrr! Too cold!",
```

## Unique Character Elements

### Limited Vocabulary
- Uses simple, basic words
- Avoids complex sentence structures
- Direct, honest communication style
- Childlike expressions

### Plant Perspective
- Views other plants as friends and family
- Strong aversion to fire and burning
- Understanding of botanical needs
- Connection to natural world

### Innocent Nature
- Curious about new experiences
- Trusting of others initially
- Simple emotional expressions
- Wonder at world around him

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
- Simplifies language to match Wormwood's vocabulary level
- Maintains plant-focused perspective throughout

### Character-Specific Overrides
```lua
-- Wormwood's simple responses override Wilson's complex ones
DESCRIBE = {
    LIVINGLOG = "Spooky tree friend",
    DEERCLOPS = "Big scary friend!",
    BUTTERFLY = "Flying friend!",
}
```

## Speech Categories

### Action Failures
- **Locked/Blocked**: Simple acknowledgment with basic words
- **Equipment Issues**: Direct statements about problems
- **Timing Problems**: Patient but simple responses

### Environmental Reactions
- **Fire**: Strong negative reactions and fear
- **Plants**: Positive recognition and friendship
- **Weather**: Simple comfort or discomfort expressions

### Item Interactions
- **Plants**: Enthusiastic recognition of plant-based items
- **Tools**: Basic understanding of function
- **Food**: Simple hunger and taste responses

## Development Notes

### Character Voice Guidelines
1. **Keep vocabulary simple**: Use basic words and short sentences
2. **Maintain plant perspective**: View world through botanical lens
3. **Express innocence**: Show childlike wonder and curiosity
4. **Use "friend" references**: Refer to other entities as friends
5. **Show fire aversion**: Strong negative reactions to burning

### Dialogue Patterns
- Short sentences without complex grammar
- Simple emotional expressions
- Direct, honest communication
- Plant-related terminology when appropriate
- Exclamations for strong emotions

## Quality Assurance

### Character Consistency Checks
- [ ] Simple vocabulary maintained throughout
- [ ] Plant perspective reflected in responses
- [ ] Friend references appropriately used
- [ ] Fire aversion consistently expressed
- [ ] Innocent tone preserved in all interactions

### Technical Validation
- [ ] Proper Lua table structure maintained
- [ ] Fallback system functions correctly
- [ ] Character-specific overrides implemented
- [ ] Speech categories complete and functional

## Related Characters

### Similar Personality Types
- **Walter**: Shared innocence and wonder, though different knowledge base
- **Webber**: Childlike perspective and simple communication style
- **Wendy**: Different emotional spectrum but similar directness

### Contrasting Characters
- **Wickerbottom**: Opposite vocabulary complexity and academic approach
- **Maxwell**: Contrasting sophistication and condescension
- **WX-78**: Different communication style and worldview

## Usage Context

### In-Game Application
- Dialogue appears during player actions and interactions
- Responses reflect Wormwood's plant nature and limited vocabulary
- Character voice enhances his innocent, plant-based personality

### Modding Considerations
- Speech system allows for character-specific dialogue additions
- Fallback system ensures compatibility
- Character voice must maintain simple vocabulary and plant perspective

This documentation provides comprehensive coverage of Wormwood's speech system, emphasizing his simple vocabulary, plant-based perspective, and innocent nature that defines his character in Don't Starve Together.
