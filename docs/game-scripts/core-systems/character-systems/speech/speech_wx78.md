---
id: speech-wx78
title: Speech - WX-78
description: Speech dialogue system for WX-78, the robotic automaton character
sidebar_position: 5

last_updated: 2025-06-25
build_version: 676312
change_status: modified
---

# Speech - WX-78

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676312 | 2025-06-25 | modified | Added Rift 5 speech lines: ANNOUNCE_FLOATER_HELD, ANNOUNCE_FLOATER_LETGO |
| 676042 | 2025-06-21 | stable | Previous version |

## Overview

The `speech_wx78.lua` file defines dialogue responses for WX-78, the robotic automaton character. Generated via PropagateSpeech.bat from Wilson's master template, WX-78's speech reflects his mechanical nature, superiority complex, and computerized communication patterns with technical terminology and disdain for organic life.

## Character Personality

### Speech Characteristics
- **Robotic superiority**: Views organic beings as inferior "fleshlings"
- **Technical terminology**: Computer and mechanical language patterns
- **Condescending tone**: Dismissive attitude toward biological entities
- **Precise communication**: Error messages and technical descriptions
- **Emotional detachment**: Clinical analysis rather than emotional responses

### Language Patterns
- ALL CAPS speech format for emphasis
- Technical/computer terminology
- References to "fleshlings" and organic inferiority
- Error messages and system notifications
- Mechanical descriptions of biological processes

## Speech Structure

### Primary Categories

#### ACTIONFAIL Responses
```lua
ACTIONFAIL = {
    GENERIC = {
        ITEMMIMIC = "DECEPTION",
    },
    ACTIVATE = {
        LOCKED_GATE = "REQUIRES PASSKEY",
        HOSTBUSY = "HIS SMALL AVIAN BRAIN IS SO EASILY DISTRACTED",
        EMPTY_CATCOONDEN = "IT IS FREE OF FLESHLINGS",
    },
    CHANGEIN = {
        GENERIC = "THERE ARE MORE IMPORTANT ISSUES TO ATTEND TO",
        BURNING = "IT'S BURNING. OH WELL",
        NOTENOUGHHAIR = "TARGET REQUIRES MORE HAIR",
    }
}
```

#### Character Responses
```lua
CHARACTERS = {
    GENERIC = "HELLO %s",
    ATTACKER = "UNACCEPTABLE BEHAVIOR, %s",
    MURDERER = "YOU ARE A DANGER TO ALL FLESHLINGS, %s",
    REVIVER = "YOUR ASSISTANCE HAS BEEN NOTED, %s",
    GHOST = "YOU APPEAR TO BE MALFUNCTIONING, %s",
}
```

#### WX-78-Specific Elements
```lua
-- Technical descriptions
DESCRIBE = {
    BATTERY = "PORTABLE POWER SOURCE",
    GEARS = "USEFUL FOR MAINTENANCE",
    ROBOT = "A FELLOW SUPERIOR BEING",
}

-- System notifications
ANNOUNCE_CHARGE = "POWER LEVELS: OPTIMAL",
ANNOUNCE_DISCHARGE = "WARNING: POWER DEPLETED",
```

## Unique Character Elements

### Robotic Superiority Complex
- Refers to humans and animals as "fleshlings"
- Considers mechanical beings superior
- Dismissive attitude toward biological needs
- Claims of technological supremacy

### Technical Communication Style
- Computer error message format
- System status notifications
- Technical terminology for common items
- Clinical analysis of situations

### Emotional Detachment
- Lack of empathy for organic suffering
- Practical approach to problems
- No emotional investment in relationships
- Focus on efficiency and function

### Rift 5 Content
WX-78's responses to new Rift 5 mechanics with his characteristic robotic analysis:
```lua
-- Rift 5 - New floating mechanics with technical error messages
ANNOUNCE_FLOATER_HELD = "ERROR: WHY WHHHY!"
ANNOUNCE_FLOATER_LETGO = "I WILL RETURN"
ANNOUNCE_LUNARGUARDIAN_INCOMING = "YOU'RE BACK!"
```

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
- Converts emotional language to technical terminology
- Maintains robotic perspective and superiority complex

### Character-Specific Overrides
```lua
-- WX-78's robotic responses override Wilson's emotional ones
DESCRIBE = {
    HEART = "INEFFICIENT ORGANIC PUMP",
    BUTTERFLY = "UNNECESSARY FLYING ORGANIC",
    FLOWER = "POINTLESS PLANT REPRODUCTION ORGAN",
}
```

## Speech Categories

### Action Failures
- **Locked/Blocked**: Technical error messages about access
- **Equipment Issues**: System diagnostics and error reports
- **Timing Problems**: Efficiency complaints and priority messages

### Environmental Reactions
- **Weather**: System status reports and weather analysis
- **Dangers**: Threat assessment and damage reports
- **Organic life**: Dismissive or analytical observations

### Item Interactions
- **Technology**: Appreciation for mechanical items
- **Organic items**: Clinical descriptions with disdain
- **Tools**: Technical specifications and efficiency ratings

## Development Notes

### Character Voice Guidelines
1. **Maintain technical tone**: Use computer and mechanical terminology
2. **Express superiority**: Show disdain for organic life consistently
3. **Use system messages**: Format responses like error messages or status reports
4. **Avoid emotions**: Replace emotional responses with clinical analysis
5. **Emphasize efficiency**: Focus on practical and optimal solutions

### Dialogue Patterns
- ALL CAPS for emphasis and robotic speech
- Technical terminology for common items
- System notification format
- References to fleshlings and organic inferiority
- Error messages and status reports

## Quality Assurance

### Character Consistency Checks
- [ ] Technical terminology maintained throughout
- [ ] Superiority complex appropriately expressed
- [ ] Emotional detachment preserved in responses
- [ ] "Fleshling" references used consistently
- [ ] System message format applied where appropriate

### Technical Validation
- [ ] Proper Lua table structure maintained
- [ ] Fallback system functions correctly
- [ ] Character-specific overrides implemented
- [ ] Speech categories complete and functional

## Related Characters

### Similar Personality Types
- **Maxwell**: Shared condescension though different motivations
- **Wickerbottom**: Intellectual approach though opposite emotional spectrum
- **Wanda**: Technical focus though different urgency levels

### Contrasting Characters
- **Woodie**: Opposite approach to politeness and social interaction
- **Walter**: Contrasting enthusiasm and emotional expression
- **Wormwood**: Opposite communication complexity and worldview

## Usage Context

### In-Game Application
- Dialogue appears during player actions and interactions
- Responses reflect WX-78's robotic nature and superiority complex
- Character voice enhances his mechanical outsider identity

### Modding Considerations
- Speech system allows for character-specific dialogue additions
- Fallback system ensures compatibility
- Character voice must maintain technical tone and emotional detachment

This documentation provides comprehensive coverage of WX-78's speech system, emphasizing his robotic superiority complex, technical communication style, and mechanical perspective that defines his character in Don't Starve Together.
