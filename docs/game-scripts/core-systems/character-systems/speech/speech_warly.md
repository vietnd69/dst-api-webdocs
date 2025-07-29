---
id: speech-warly
title: Warly Speech
description: Character-specific dialogue and speech responses for Warly, the Cuisinier
sidebar_position: 14

last_updated: 2025-06-25
build_version: 676312
change_status: modified
---

# Warly Speech

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676312 | 2025-06-25 | modified | Added Rift 5 speech lines: ANNOUNCE_FLOATER_HELD, ANNOUNCE_FLOATER_LETGO |
| 676042 | 2025-06-21 | stable | Previous version |

## Overview

The `speech_warly.lua` file contains character-specific dialogue and speech responses for Warly, the Cuisinier (Chef). This file showcases Warly's French culinary background, polite demeanor, and cooking expertise through his unique dialogue patterns infused with French expressions.

## Character Personality

Warly's speech reflects his background as:
- **French chef**: Uses French culinary terms and expressions throughout dialogue
- **Polite gentleman**: Shows courtesy and proper manners in interactions
- **Culinary expert**: References cooking techniques, ingredients, and food preparation
- **Patient professional**: Demonstrates professional patience and understanding
- **Quality-focused**: Shows concern for proper preparation and ingredients

## Speech Characteristics

### Language Style
- **French expressions**: Regular use of French words and phrases
- **Culinary terminology**: References cooking, ingredients, and kitchen equipment
- **Polite address**: Uses "monsieur," "mademoiselle," and formal courtesy
- **Professional language**: Speaks like an experienced chef

### Example Responses

#### French Culinary Language
```lua
-- Wilson: "Well that's inconvenient."
-- Warly:
ITEMMIMIC = "Thought it smelled off."
```

#### French Expressions
```lua
-- Uses authentic French phrases
APPLYELIXIR = {
    TOO_SUPER = "Trop fort!"  -- "Too strong!"
}

CARNIVALGAME_FEED = {
    TOO_LATE = "Zut! Too slow!"  -- "Darn! Too slow!"
}
```

#### Culinary References
```lua
-- References cooking and ingredients
CONSTRUCT = {
    EMPTY = "I'm missing some ingredients."
    MISMATCH = "I think I've gotten something mixed up."
}

DISMANTLE = {
    COOKING = "Just a little longer... It's almost done."
    NOTEMPTY = "Oops, I've left some ingredients inside."
}
```

## Speech Patterns

### French Politeness
```lua
-- Shows French courtesy and manners
HOSTBUSY = "I'll just have to come back later."
CARNIVAL_HOST_HERE = "Hello, monsieur? Are you here?"
NOCARNIVAL = "The festivities seem to be over."
```

### Culinary Expertise
```lua
-- Demonstrates cooking knowledge
GIVE = {
    NOTDISH = "It would tarnish my reputation to serve that."
    NOTSTAFF = "I need something long and thin, like a wooden spoon."
    MUSHROOMFARM_NEEDSSHROOM = "It needs a dash of something else."
}
```

### Professional Patience
```lua
-- Shows professional understanding
BUILD = {
    BUSY_STATION = "Patience!"
}

COOK = {
    INUSE = "Pardonnez-moi! I shouldn't backseat cook."
}
```

## Character-Specific Responses

### French Expressions and Phrases
Warly frequently uses authentic French expressions:
```lua
-- Common French phrases
EMPTY_CATCOONDEN = "Ah zut, an empty cupboard."  -- "Ah darn"
KITCOON_HIDEANDSEEK_NOT_ENOUGH_HIDERS = "It would be better with more petits chats, non?"  -- "little cats"

-- Polite French address
GIVE = {
    ABIGAILHEART = "Apologies, ma petite choux-fleur."  -- "my little cauliflower" (term of endearment)
    NOTAMONKEY = "Excusez-moi, I'm afraid we have a bit of a language barrier."
}
```

### Cooking and Kitchen References
```lua
-- Professional cooking terminology
COMPARE_WEIGHABLE = {
    FISH_TOO_SMALL = "Ah non, this fish is far too small."
}

FILL_OCEAN = {
    UNSUITABLE_FOR_PLANTS = "Mais non, this salt water will not do!"
}
```

### Professional Standards
```lua
-- Shows professional quality standards
BATHBOMB = {
    GLASSED = "No need, it's already en glace."  -- "in ice"
    ALREADY_BOMBED = "That would be wasteful."
}

CHANGEIN = {
    INUSE = "I should give them their privacy."
}
```

## Unique Character Elements

### French Culinary Identity
Warly's responses reflect his authentic French chef background:
```lua
-- Professional cooking language
DISMANTLE = {
    COOKING = "Just a little longer... It's almost done."
}

GIVE = {
    SLOTFULL = "I'd have to take the other object out first."
    FOODFULL = "Let them enjoy their meal first."
}
```

### Quality and Precision
Shows concern for proper preparation and quality:
```lua
-- Professional standards
CONSTRUCT = {
    NOTALLOWED = "This isn't the best place for it."
    NOTREADY = "Perhaps once things have settled down, non?"
}
```

### Culinary Expertise
Demonstrates deep knowledge of cooking and food:
```lua
-- Food and cooking knowledge
FISH_OCEAN = {
    TOODEEP = "Ah non, the fish are too deep for my rod to reach."
}
```

### Rift 5 Content
Warly's responses to new Rift 5 mechanics with his characteristic French flair:
```lua
-- Rift 5 - New floating mechanics with culinary metaphors
ANNOUNCE_FLOATER_HELD = "I feel like a dumpling!"
ANNOUNCE_FLOATER_LETGO = "Was that wise?"
ANNOUNCE_LUNARGUARDIAN_INCOMING = "Déjà vu."
```

## French Language Elements

### Common French Words Used
- **"Non"**: No
- **"Mais non"**: But no
- **"Zut"**: Darn/shoot
- **"Trop fort"**: Too strong
- **"Pardonnez-moi"**: Excuse me/pardon me
- **"Excusez-moi"**: Excuse me
- **"Un moment"**: One moment
- **"Petits chats"**: Little cats
- **"Ma petite choux-fleur"**: My little cauliflower (endearment)
- **"En glace"**: In ice

### Professional Terms
- **"Monsieur"**: Mister/sir
- **"Mademoiselle"**: Miss
- References to ingredients, cooking, and food preparation

## Fallback Mechanism

### Character-Specific Overrides
Warly overrides Wilson's responses to reflect his French chef personality:
```lua
-- Wilson: "I can't cook right now."
-- Warly:
GENERIC = "I'm not quite ready yet."
```

### Wilson Fallbacks
Some responses fall back to Wilson's speech when Warly doesn't have specific dialogue:
```lua
--fallback to speech_wilson.lua
BURNING = "only_used_by_webber"
ONEGHOST = "only_used_by_wendy"
```

## Technical Implementation

### File Generation
- **Generated via**: PropagateSpeech.bat automation
- **Base template**: Inherits structure from speech_wilson.lua
- **Custom responses**: Overrides specific dialogue to match French chef personality

### Language Integration
- **Bilingual elements**: Seamlessly blends French expressions with English
- **Cultural authenticity**: Maintains authentic French culinary culture
- **Professional terminology**: Uses appropriate chef and cooking language

## Development Notes

### Speech Consistency
- Maintains Warly's French chef identity throughout all dialogue
- Preserves his polite, professional demeanor
- Shows his culinary expertise and quality standards
- Reflects his patient, understanding personality

### Quality Guidelines
- Use authentic French expressions where appropriate
- Reference cooking, ingredients, and culinary techniques
- Maintain polite, professional tone consistent with a chef
- Show concern for quality and proper preparation

## Related Characters

Warly's speech contrasts with:
- **Wilson**: French sophistication vs. Wilson's casual American approach
- **Wickerbottom**: Culinary expertise vs. Wickerbottom's academic knowledge
- **Maxwell**: Professional courtesy vs. Maxwell's aristocratic arrogance
- **Wolfgang**: Refined manners vs. Wolfgang's boisterous enthusiasm

## Usage in Game

Warly's speech enhances his role as:
- **The chef**: Provides culinary expertise and food-focused perspective
- **The gentleman**: Shows refined manners and courtesy
- **The professional**: Demonstrates high standards and quality focus
- **The cultural representative**: Brings French culinary culture to the group

This speech system reinforces Warly's character identity as the sophisticated French chef who brings culinary expertise and continental refinement to the survival experience.
