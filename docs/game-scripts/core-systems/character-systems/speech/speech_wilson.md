---
id: speech-wilson
title: Wilson Speech
description: Character-specific dialogue and speech responses for Wilson, the Gentleman Scientist
sidebar_position: 1

last_updated: 2025-06-25
build_version: 676312
change_status: modified
---

# Wilson Speech

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676312 | 2025-06-25 | modified | Added Rift 5 speech lines: ANNOUNCE_FLOATER_HELD, ANNOUNCE_FLOATER_LETGO |
| 676042 | 2025-06-21 | stable | Previous version |

## Overview

The `speech_wilson.lua` file serves as the **master template** for all character speech files in Don't Starve Together. Wilson is the default character, and his speech responses are used as the base for all other characters. This file contains dialogue responses for various game actions, item interactions, and game states.

## File Purpose

Wilson's speech file acts as:
- **Master template**: The foundation for generating all other character speech files
- **Default fallback**: When other characters don't have specific dialogue, Wilson's responses are used
- **Complete reference**: Contains the most comprehensive set of speech responses

## Speech Structure

### Main Categories

The speech data is organized into several major categories:

#### ACTIONFAIL
Contains responses when actions cannot be performed:
```lua
ACTIONFAIL = {
    GENERIC = {
        ITEMMIMIC = "Well that's inconvenient.",
    },
    ACTIVATE = {
        LOCKED_GATE = "The gate is locked.",
        HOSTBUSY = "He seems a bit preoccupied at the moment.",
    },
    -- ... more subcategories
}
```

#### Character Responses
Responses to various in-game items and entities, organized alphabetically:
```lua
-- Item responses
ACORN = "It's an acorn.",
ANCIENTDREAMS_GEMSHARD = "It pulses with the stuff of nightmares.",

-- Entity responses  
ABIGAIL = "She's cute, in a creepy way.",
ANTLION = "What a big bug!",
```

#### Meta Responses
General response categories:
```lua
DESCRIBE_GENERIC = "It's a... thing.",
DESCRIBE_TOODARK = "It's too dark to see!",
DESCRIBE_SMOLDERING = "That thing is about to catch fire.",
```

## Character Personality

Wilson's speech reflects his character as:
- **Scientific mindset**: Often makes observations and hypotheses
- **Optimistic nature**: Generally positive responses even in dangerous situations  
- **Curious personality**: Shows interest in examining and understanding things
- **Pun usage**: Frequently makes wordplay and scientific jokes

## Speech Generation Process

1. **PropagateSpeech.bat**: Automated script that copies Wilson's speech structure to other characters
2. **Template comments**: Special comments guide the propagation process
3. **Character-specific overrides**: Other characters can override specific responses while inheriting the base structure

## Usage Examples

### Action Failure Response
```lua
-- When player tries to activate a locked gate
ACTIONFAIL.ACTIVATE.LOCKED_GATE = "The gate is locked."
```

### Item Inspection
```lua
-- When examining an acorn
ACORN = "It's an acorn."
```

### Complex Item States
```lua
-- Beebox with different states
BEEBOX = {
    READY = "The bees have been busy!",
    FULLHONEY = "It's full of honey!",
    GENERIC = "A house for bees.",
    NOHONEY = "The bees are still working.",
    SOMEHONEY = "There's some honey, but the bees are still working.",
    BURNT = "The bees won't like this."
}
```

## Technical Implementation

### File Structure
- **Return table**: Single Lua table containing all speech data
- **Nested organization**: Hierarchical structure for different response types
- **String values**: Most entries are simple strings, some are tables with conditional responses

### Character-Specific Handling
```lua
-- Some responses are marked for specific characters only
NOKELP = "only_used_by_wurt",
NO_ELIXIRABLE = "only_used_by_wendy",
```

### Fallback Mechanism
When other character files don't define specific responses, the game falls back to Wilson's speech automatically.

## Development Guidelines

### Adding New Speech
1. Add new responses to `speech_wilson.lua` first
2. Run `PropagateSpeech.bat` to update all character files
3. Customize character-specific responses in individual files
4. Test that fallbacks work correctly

### Formatting Requirements
- No single-line Lua tables
- Opening and closing brackets on separate lines
- Consistent unnamed string counts across all characters
- Proper commenting for character-specific responses

### Rift 5 Content
Wilson's responses to new Rift 5 mechanics with his characteristic scientific curiosity:
```lua
-- Rift 5 - New floating mechanics with scientific observations
ANNOUNCE_FLOATER_HELD = "I was busy drowning but something came up... me!"
ANNOUNCE_FLOATER_LETGO = "I hate being kept in susp-"
ANNOUNCE_LUNARGUARDIAN_INCOMING = "It's back!"
```

## Related Files

- **speech_from_generic.lua**: Contains context strings for character-specific responses
- **PropagateSpeech.bat**: Automated script for updating all character speech files
- **Other character speech files**: All inherit from Wilson's structure

## Constants and Enums

The speech system uses various game constants for consistent responses:

### Common Response Patterns
- Item inspection responses
- Action failure messages  
- Entity interaction dialogues
- Environmental descriptions
- Food consumption reactions

This speech system ensures consistent dialogue coverage across all characters while allowing for personality-specific customization.
