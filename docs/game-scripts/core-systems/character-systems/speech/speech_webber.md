---
id: speech-webber
title: Webber Speech
description: Character-specific dialogue and speech responses for Webber, the Indigestible
sidebar_position: 10
slug: /game-scripts/core-systems/speech-webber
last_updated: 2025-06-25
build_version: 676312
change_status: modified
---

# Webber Speech

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676312 | 2025-06-25 | modified | Added Rift 5 speech lines: ANNOUNCE_FLOATER_HELD, ANNOUNCE_FLOATER_LETGO |
| 676042 | 2025-06-21 | stable | Previous version |

## Overview

The `speech_webber.lua` file contains character-specific dialogue and speech responses for Webber, the Indigestible. This file showcases Webber's unique dual nature as both a child and a spider, reflected through his innocent, enthusiastic personality combined with spider-related abilities and perspectives.

## Character Personality

Webber's speech reflects his background as:
- **Innocent child**: Uses childlike language, enthusiasm, and wonder
- **Spider hybrid**: References spider friends, webs, and spider behavior
- **Plural identity**: Often speaks using "we" instead of "I" (child + spider)
- **Optimistic youth**: Maintains positive outlook and excitement about discoveries
- **Spider friend**: Shows affection and concern for spider companions

## Speech Characteristics

### Language Style
- **Childlike enthusiasm**: Uses simple, excited language and expressions
- **Plural pronouns**: Frequently uses "we," "us," and "our" instead of singular forms
- **Spider references**: Mentions spiderfriends, webs, and spider-related concepts
- **Innocent observations**: Shows childlike wonder and curiosity

### Example Responses

#### Childlike Enthusiasm
```lua
-- Wilson: "Well that's inconvenient."
-- Webber:
ITEMMIMIC = "Aw, I guessed wrong!"
```

#### Plural Identity (We/Us Language)
```lua
-- Shows dual child-spider nature
ACTIVATE = {
    LOCKED_GATE = "Aww. We want in there."
    HOSTBUSY = "He looks pretty busy, we can come back later."
    CARNIVAL_HOST_HERE = "We're pretty sure we saw him over here."
}
```

#### Spider Friend References
```lua
-- Shows connection to spiders
BEDAZZLE = {
    BURNING = "Aaah! Spiderfriends, your house!!"
}

FILL_OCEAN = {
    UNSUITABLE_FOR_PLANTS = "Ms. Wickerbottom says that salt water is bad for plants."
}
```

## Speech Patterns

### Innocent Wonder
```lua
-- Shows childlike excitement and curiosity
NOCARNIVAL = "Aww, did all the birds leave?"
EMPTY_CATCOONDEN = "No one's home..."
KITCOON_HIDEANDSEEK_ONE_GAME_PER_DAY = "That was fun! Can we play again tomorrow?"
```

### Child Safety Awareness
```lua
-- References parental guidance and safety
COOK = {
    GENERIC = "I don't want to. Mom always said the kitchen was dangerous!"
}

BUILD = {
    HASPET = "I like the pet we've got."
}
```

### Spider Solidarity
```lua
-- Shows affection for spider friends
SPIDERNOHAT = "There's not enough room, we don't want to squish them by accident!"

BEDAZZLE = {
    BURNING = "Aaah! Spiderfriends, your house!!"
    ALREADY_BEDAZZLED = "We think we already decorated it pretty good."
}
```

## Character-Specific Responses

### Dual Nature Communication
Webber's unique child-spider combination shows in his speech:
```lua
-- Plural identity responses
BUILD = {
    MOUNTED = "All our arms can't quite reach from up here."  -- References spider legs
}

GIVE = {
    NOTAMONKEY = "Sorry, neither of us speak monkey."  -- Both child and spider
}
```

### Child-like Problem Solving
Shows innocent approaches to challenges:
```lua
-- Simple, innocent solutions
DRAW = {
    NOIMAGE = "But what should we draw?!"
}

CONSTRUCT = {
    NOTREADY = "Everything's too scary right now!"
}
```

### Spider-Related Special Cases
Has unique responses for spider-specific situations:
```lua
-- Spider decoration abilities
BEDAZZLE = {
    BURNING = "Aaah! Spiderfriends, your house!!"
    BURNT = "There isn't really much left to decorate..."
    FROZEN = "Hmm it might be hard to get our decorations to stick to ice..."
    ALREADY_BEDAZZLED = "We think we already decorated it pretty good."
}
```

## Unique Character Elements

### Multiple Arms Reference
Shows awareness of spider anatomy:
```lua
-- Spider physiology awareness
BUILD = {
    MOUNTED = "All our arms can't quite reach from up here."
}

GIVE = {
    NOTSCULPTABLE = "Eight legs isn't nearly enough to sculpt with THAT."
}
```

### Child Innocence
Maintains childlike perspective on adult situations:
```lua
-- Innocent observations
ATTUNE = {
    NOHEALTH = "We don't feel so good right now. Maybe later?"
}

CARNIVALGAME_ALREADY_PLAYING = "We're playing next!"
```

### Spider Friend Relationships
Shows unique relationship with spider creatures:
```lua
-- Care for spider companions
SPIDERNOHAT = "There's not enough room, we don't want to squish them by accident!"
```

### Rift 5 Content
Webber's responses to new Rift 5 mechanics with his characteristic childlike enthusiasm:
```lua
-- Rift 5 - New floating mechanics with innocent excitement
ANNOUNCE_FLOATER_HELD = "We float!"
ANNOUNCE_FLOATER_LETGO = "Weeee!"
ANNOUNCE_LUNARGUARDIAN_INCOMING = "The giant ball is back."
```

## Language Patterns

### Childlike Expressions
- **"Aw/Aww"**: Expressions of disappointment or sympathy
- **"Ooo"**: Expression of excitement or interest
- **"We/Us/Our"**: Plural pronouns showing dual nature
- **"Mom always said"**: References to parental guidance
- **"That was fun!"**: Innocent enthusiasm

### Spider-Related Terms
- **"Spiderfriends"**: Affectionate term for spider companions
- **"All our arms"**: Reference to spider legs
- **"Eight legs"**: Spider anatomy awareness
- **Spider decoration/bedazzling abilities

## Moral and Safety Awareness

### Parental Guidance
Shows influence of proper upbringing:
```lua
-- Safety lessons from parents
COOK = {
    GENERIC = "I don't want to. Mom always said the kitchen was dangerous!"
}

GIVE = {
    SLOTFULL = "Mom said to always finish my plate before seconds."
}
```

### Politeness and Consideration
Demonstrates good manners despite dual nature:
```lua
-- Polite behavior
CHANGEIN = {
    INUSE = "We'll give them some privacy while they change."
}

CONSTRUCT = {
    INUSE = "Aw, we don't wanna mess up someone else's stuff."
}
```

## Fallback Mechanism

### Character-Specific Overrides
Webber overrides Wilson's responses to match his child-spider personality:
```lua
-- Wilson: "I can't cook right now."
-- Webber:
GENERIC = "I don't want to. Mom always said the kitchen was dangerous!"
```

### Wilson Fallbacks
Some responses fall back to Wilson's speech when Webber doesn't have specific dialogue:
```lua
--fallback to speech_wilson.lua
CAST_POCKETWATCH = "only_used_by_wanda"
CAST_SPELLBOOK = "only_used_by_waxwell"
```

## Technical Implementation

### File Generation
- **Generated via**: PropagateSpeech.bat automation
- **Base template**: Inherits structure from speech_wilson.lua
- **Custom responses**: Overrides specific dialogue to match child-spider personality

### Unique Character Features
- **Spider bedazzling**: Special dialogue for Webber's unique decoration abilities
- **Plural identity**: Consistent use of "we/us" pronouns
- **Child safety**: References to parental guidance and safety awareness

## Development Notes

### Speech Consistency
- Maintains Webber's innocent, childlike enthusiasm
- Preserves his dual child-spider identity through plural pronouns
- Shows his affection for spider friends and spider-related abilities
- Reflects his safety-conscious upbringing and good manners

### Quality Guidelines
- Use childlike language and innocent expressions
- Include plural pronouns to show dual identity
- Reference spider friends and spider-related abilities appropriately
- Show parental influence and safety awareness

## Related Characters

Webber's speech contrasts with:
- **Wilson**: Innocent enthusiasm vs. Wilson's mature scientific approach
- **Walter**: Child perspective vs. Walter's scout training
- **Wendy**: Optimistic innocence vs. Wendy's melancholic outlook
- **Wolfgang**: Child vulnerability vs. Wolfgang's physical strength

## Usage in Game

Webber's speech enhances his role as:
- **The innocent**: Provides childlike wonder and optimism
- **The spider friend**: Shows unique relationship with spider creatures
- **The decorator**: Demonstrates special spider-related abilities
- **The dual being**: Represents the fusion of human child and spider

This speech system reinforces Webber's character identity as the innocent child-spider hybrid who brings both youthful enthusiasm and unique spider-related perspectives to the survival experience.
