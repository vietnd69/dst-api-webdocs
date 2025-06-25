---
id: character-emotes-overview
title: Character Emotes Overview
description: Overview of character emotes and expression systems in DST API
sidebar_position: 3
slug: gams-scripts/core-systems/character-systems/emotes
last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: character-expression
system_scope: player expressions and communication functionality
---

# Character Emotes Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Character Emotes category encompasses all functionality related to player expressions, animations, and communication systems in Don't Starve Together. These systems work together to provide comprehensive player expression options including basic emotes, purchasable premium emotes, and emoji communication systems.

### Key Responsibilities
- Basic player emote definitions and animations
- Premium emote item management and validation
- Emoji character mapping and input processing
- Command integration for expression triggering
- Audio and visual effect coordination
- Player communication enhancement

### System Scope
This system category includes all player expression and communication elements but excludes character customization visuals (handled by Customization) and core character behavior (handled by Core Character Systems).

## Architecture Overview

### System Components
The emotes system is built on a layered architecture where core emote definitions provide foundation services for premium items and emoji communication features.

### Data Flow
```
Player Input → Command Processing → Validation → Animation/Audio → Visual Display
      ↓              ↓                ↓             ↓              ↓
   Chat Command → Emote Lookup → Ownership Check → Effect Trigger → Player Expression
```

### Integration Points
- **Character Systems**: Player state management and animation control
- **User Interface**: Chat commands and emote selection interfaces
- **Account Systems**: Premium emote ownership and validation
- **Networking**: Expression synchronization between players

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Emotes](./emotes.md) | stable | Core emote system with complete definitions |
| 676042 | 2025-06-21 | [Emote Items](./emote_items.md) | stable | Premium emote system with ownership validation |
| 676042 | 2025-06-21 | [Emoji Items](./emoji_items.md) | stable | Emoji character mapping and configuration |

## Core Emote Modules

### [Core Emote System](./emotes.md)
Basic emote definitions and infrastructure for player expressions.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Emotes](./emotes.md) | stable | Core emote system | Wave, dance, sit, cry, basic expressions |

### [Premium Emote System](./emote_items.md)
Purchasable and unlockable emote items with enhanced animations and effects.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Emote Items](./emote_items.md) | stable | Premium emote definitions | Dance styles, flex, laugh, special effects |

### [Emoji Communication](./emoji_items.md)
Emoji character system for text-based expressions in chat.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Emoji Items](./emoji_items.md) | stable | Emoji character mapping | UTF-8 emojis, theme categorization, input processing |

## Common Emote Patterns

### Basic Emote Usage
```lua
-- Access basic emote data
local waveEmote = EMOTES.wave
print(waveEmote.data.anim) -- Animation data

-- Check emote type classification
if EMOTES.dance.type == EMOTE_TYPE.ACTION then
    -- Handle action-based emote
end

-- Get all available basic emotes
local commonEmotes = GetCommonEmotes()
for name, emote in pairs(commonEmotes) do
    print("Emote:", name, "Type:", emote.type)
end
```

### Premium Emote Validation
```lua
-- Validate premium emote ownership
local function CanUseEmoteItem(player, emoteId)
    local emoteData = EMOTE_ITEMS[emoteId]
    if not emoteData then return false end
    
    if emoteData.data.requires_validation then
        return TheInventory:CheckOwnership(emoteData.data.item_type)
    end
    return true
end

-- Use premium emote with validation
local flexEmote = EMOTE_ITEMS.emote_flex
if CanUseEmoteItem(player, "emote_flex") then
    player:PushEvent("emote", flexEmote.data)
end
```

### Emoji Processing
```lua
-- Process emoji input in chat
local function ProcessEmojiInput(text)
    local processedText = text
    
    -- Replace :emoji_name: with actual emoji character
    processedText = string.gsub(processedText, ":([%w_]+):", function(inputName)
        for emojiId, emojiData in pairs(EMOJI_ITEMS) do
            if emojiData.input_name == inputName then
                return emojiData.data.utf8_str
            end
        end
        return ":" .. inputName .. ":" -- Return original if not found
    end)
    
    return processedText
end

-- Example usage
local chatMessage = "Great job! :thumbsup: :heart:"
local displayMessage = ProcessEmojiInput(chatMessage)
```

### Emote State Validation
```lua
-- Check if emote can be used in current player state
local function CanUseEmote(player, emoteName)
    local emote = EMOTES[emoteName]
    if not emote then return false end
    
    local data = emote.data
    
    -- Check sitting requirement
    if player:HasTag("sitting") and not data.sitting then
        return false
    end
    
    -- Check mount requirements
    local isRiding = player.replica.rider and player.replica.rider:IsRiding()
    if data.mountonly and not isRiding then
        return false
    end
    
    return true
end
```

## Emote System Dependencies

### Required Systems
- [Core Character Systems](../core/index.md): Player state management and animation control
- [User Interface](../../user-interface/index.md): Chat command processing and emote interfaces
- [System Core](../../system-core/index.md): Command registration and event handling

### Optional Systems
- [Account Systems](../../account-systems/index.md): Premium emote ownership validation
- [Networking](../../networking-communication/index.md): Multi-player expression synchronization
- [Audio Systems](../../audio-systems/index.md): Enhanced sound effects for premium emotes

## Performance Considerations

### Memory Usage
- Basic emotes load immediately with minimal memory footprint
- Premium emote animations load on-demand when owned and used
- Emoji character mappings use efficient UTF-8 encoding
- Animation caching optimizes frequently used expressions

### Performance Optimizations
- Ownership validation caches results to reduce server queries
- Animation loading prioritizes currently used emotes
- Command processing uses efficient lookup tables
- Audio synchronization batches related sound effects

### Scaling Considerations
- System supports extensive premium emote collections
- Chat emoji processing scales efficiently with message volume
- Command alias resolution handles multiple input variations
- State validation performs quickly for real-time usage

## Development Guidelines

### Best Practices
- Always validate emote ownership before triggering premium emotes
- Use appropriate emote types (EMOTION vs ACTION) for proper categorization
- Handle player state requirements (sitting, mounted) before emote execution
- Test emote compatibility across all character states and forms

### Common Pitfalls
- Bypassing ownership validation for development testing
- Not checking player state requirements before emote execution
- Assuming all emotes work in all player states (sitting, mounted, etc.)
- Modifying auto-generated emoji data instead of source systems

### Testing Strategies
- Test all emotes across different player states (standing, sitting, mounted)
- Verify premium emote ownership validation works correctly
- Test emoji input processing with various chat scenarios
- Validate audio and visual effects sync properly with animations

## Emote Integration Patterns

### With Character Systems
Emotes enhance character expressiveness:
- Animations respect character-specific quirks and behaviors
- State-based restrictions ensure appropriate emote usage
- Mount integration allows creature-compatible expressions
- Character forms (human, werebeaver, etc.) support appropriate emotes

### With Communication Systems
Emotes facilitate player interaction:
- Chat commands provide easy emote triggering
- Emoji integration enhances text communication
- Visual expressions supplement verbal communication
- Social features enable coordinated group expressions

### With Account Systems
Premium emotes integrate with player progression:
- Ownership validation ensures proper access control
- Rarity system provides progression incentives
- Gift system enables emote sharing and rewards
- Collection tracking motivates emote acquisition

## Emote Categories and Types

### Basic Emote Categories

**Emotion Emotes** (`EMOTE_TYPE.EMOTION`):
- **Wave**: Greeting gestures with multiple variations
- **Happy**: Cheerful celebrations and positive expressions
- **Angry**: Frustration and aggressive expressions
- **Sad**: Crying and melancholy expressions
- **Social**: Kissing, greeting, and interaction gestures

**Action Emotes** (`EMOTE_TYPE.ACTION`):
- **Dance**: Rhythmic movement with looping animations
- **Sitting**: Relaxed positioning with state persistence
- **Pose**: Dramatic positioning with camera effects
- **Physical**: Gestures requiring specific movements or equipment

### Premium Emote Features

**Enhanced Animations**:
- Multi-phase animations with pre/loop sequences
- Character-specific animation adaptations
- Special effect integration and visual enhancements
- Audio synchronization and sound design

**Advanced Requirements**:
- Equipment dependencies (hat requirement for tip hat)
- State-specific availability and usage restrictions
- Ownership validation and access control
- Theme-based categorization and organization

### Emoji Communication

**Character Mapping**:
- UTF-8 character encoding for universal compatibility
- Input name processing for user-friendly commands
- Theme-based organization (LAVA, VICTORIAN, VARG)
- Release group tracking for content management

**Chat Integration**:
- Real-time input processing and character replacement
- Validation systems for appropriate emoji usage
- Theme filtering and categorization for UI displays
- Cross-platform compatibility and character support

## Audio and Visual Effects

### Sound Integration
Emotes include sophisticated audio systems:
- **Player Sounds**: Character-specific vocalizations and expressions
- **Mount Sounds**: Creature reactions and audio feedback
- **Environmental Audio**: Spatial sound effects and ambiance
- **Timing Control**: Precise audio synchronization with animations

### Visual Effects
Enhanced visual presentation:
- **Animation Blending**: Smooth transitions between emote states
- **Camera Effects**: Zoom and focus changes for dramatic emotes
- **Particle Effects**: Environmental enhancements and visual flair
- **Lighting Integration**: Dynamic lighting for special emotes

## Troubleshooting Emote Issues

### Common Emote Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Emote not triggering | Command not working | Check emote ownership and player state |
| Animation not playing | Visual emote missing | Verify animation assets and state compatibility |
| Premium emote locked | Access denied message | Validate ownership and account status |
| Emoji not displaying | Character replacement failed | Check input name and emoji definition |

### Debugging Emote Systems
- Use emote debug commands to inspect available emotes
- Check player state and mount status for compatibility
- Verify ownership status for premium emotes
- Review command alias mappings for input processing

## Collection and Progression

### Emote Acquisition
- **Basic Emotes**: Available to all players by default
- **Premium Emotes**: Acquired through purchase, rewards, or events
- **Emoji Items**: Unlocked through various acquisition methods
- **Special Requirements**: Some emotes need specific conditions or equipment

### Rarity and Value
- **Common**: Standard emotes available to all players
- **Distinguished**: Premium emotes with enhanced features
- **Reward**: Special emotes from achievements or events
- **Loyal**: Loyalty program exclusive emotes

## Future Development

### Extensibility Design
- Emote system supports easy addition of new expression categories
- Animation pipeline accommodates diverse emote styles and themes
- Command framework adapts to new input methods and interfaces
- Ownership validation scales with expanding premium content

### Integration Planning
- New emotes should leverage existing animation and audio systems
- Consider cross-character compatibility for universal emotes
- Plan for mod compatibility and community-created expressions
- Design for accessibility and inclusive communication options

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [Core Character Systems](../core/index.md) | Foundation | Player state management and animation control |
| [Character Customization](../customization/index.md) | Enhancement | Visual consistency with character appearance |
| [User Interface](../../user-interface/index.md) | Presentation | Chat commands and emote selection interfaces |
| [Networking](../../networking-communication/index.md) | Synchronization | Multi-player expression sharing and display |

## Contributing to Emote Systems

### Adding New Emotes
1. Follow established animation and audio standards
2. Implement appropriate state and compatibility checks
3. Integrate with existing command and validation systems
4. Document usage requirements and special features

### Modifying Existing Emotes
1. Understand current animation dependencies and timing
2. Maintain backward compatibility with existing usage
3. Update related documentation and integration examples
4. Test changes across all supported character states

## Quality Assurance

### Emote Validation
- All emotes display correctly across different character states
- Premium emote ownership validation functions properly
- Animation timing synchronizes correctly with audio effects
- Chat emoji processing handles edge cases and special characters

### Expression Quality Standards
- Emotes maintain consistent visual style and character personality
- Audio effects enhance rather than distract from expressions
- Performance impact remains minimal during frequent usage
- Cross-platform compatibility ensures universal accessibility
