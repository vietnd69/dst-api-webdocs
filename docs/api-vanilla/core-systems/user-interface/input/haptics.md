---
id: haptics
title: Haptic Effects
description: Defines haptic feedback and vibration effects for game events
sidebar_position: 2
slug: api-vanilla/core-systems/haptics
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Haptic Effects

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `haptics.lua` script defines haptic feedback effects that provide tactile responses to game events through controller vibration. This system enhances player immersion by adding physical feedback to audio-visual experiences, particularly for actions like combat, movement, weather effects, and boss encounters.

## Usage Example

```lua
-- The script exports the HapticEffects table
local HapticEffects = require("haptics")

-- Each effect is automatically registered for haptic feedback
-- when the corresponding audio event is triggered
```

## Effect Configuration Structure

### HapticEffect Properties

Each haptic effect is defined as a table with the following properties:

```lua
{
    event = "audio/event/path",           -- Audio event identifier
    vibration = true/false,               -- Enable haptic vibration
    audio = true/false,                   -- Enable audio component
    vibration_intensity = 1.0,            -- Vibration strength (0.0-10.0)
    audio_intensity = 1.0,                -- Audio volume multiplier (0.0-10.0)
    player_only = true/false,             -- Optional: Only trigger for player actions
    category = "UI"                       -- Optional: Effect category classification
}
```

**Property Descriptions:**
- `event` (string): The audio event path that triggers this haptic effect
- `vibration` (boolean): Whether to enable controller vibration
- `audio` (boolean): Whether to play the associated audio
- `vibration_intensity` (number): Vibration strength from 0.0 (none) to 10.0 (maximum)
- `audio_intensity` (number): Audio volume multiplier from 0.0 (silent) to 10.0 (amplified)
- `player_only` (boolean): If true, only triggers for direct player actions
- `category` (string): Categorization for effect management (e.g., "UI")

## Effect Categories

### Instruments and Music

**Events:** Musical instruments and audio-based items
- Flute, beefalo horn, hound whistle, glommer bell
- Guitar tablature and musical performance

**Example:**
```lua
{ event="dontstarve/wilson/flute_LP", vibration=true, audio=true, vibration_intensity=1.0, audio_intensity=1.0 }
```

### Movement and Transportation

**Events:** Player and mount movement effects
- Running on different surfaces (web, marble)
- Falling and slipping
- Beefalo riding and dismounting

### Combat and Attacks

**Events:** Weapon usage and combat interactions
- Weapon swings and impacts
- Staff magic attacks
- Projectile weapons (slingshot, blowdart)
- Hit detection on different material types

**Example:**
```lua
{ event="dontstarve/wilson/attack_whoosh", vibration=true, audio=true, vibration_intensity=1.0, audio_intensity=1.0, player_only=true }
```

### Character-Specific Abilities

**Events:** Unique character powers and transformations
- **Walter:** Slingshot mechanics, whistle commands
- **Wanda:** Time manipulation abilities
- **Webber:** Spider control
- **Wendy:** Abigail summoning
- **Willow:** Pyrokinetic abilities
- **Woodie:** Were-form transformations
- **WX-78:** Module installation/removal

### Boss Encounters

**Events:** Major boss fight mechanics with enhanced feedback
- **Deerclops:** Ice attacks, steps, laser beam
- **Bearger:** Ground pounds, swipes
- **Dragonfly:** Fire breath, butt stomp
- **Klaus:** Claw attacks, chain breaking
- **Fuel Weaver:** Mind control, bone attacks
- **Celestial Champion:** Phase transitions, beam attacks
- **Crab King:** Mortar attacks, magic effects

**Example:**
```lua
{ event="deerclops/step", vibration=true, audio=true, vibration_intensity=1.0, audio_intensity=1.0 }
```

### Environmental Effects

**Events:** Weather and world state changes
- Rain, thunder, lunar hail
- Cave earthquakes
- Temperature warnings (freezing, overheating)
- Fire spreading and meteor impacts

### User Interface

**Events:** Menu and HUD interactions
- Map opening/closing
- Crafting menu navigation
- Item collection notifications
- Skill tree progression

**Characteristics:**
- Often use `category="UI"` classification
- Lower audio intensity (0.5) for subtlety
- Some effects are vibration-only (`audio=false`)

**Example:**
```lua
{ event="dontstarve/HUD/click_mouseover", vibration=true, audio=false, vibration_intensity=0.5, audio_intensity=0.5, category="UI" }
```

## Intensity Guidelines

### Vibration Intensity Levels

- **0.5-1.0**: Subtle feedback (UI elements, light touches)
- **1.0-2.0**: Standard gameplay actions (attacks, tool usage)
- **2.0-3.0**: Impactful events (planting, shaving, world death)
- **10.0**: Maximum intensity (movement clicks for accessibility)

### Audio Intensity Levels

- **0.05-0.5**: Background/ambient effects
- **1.0**: Standard volume level
- **1.5+**: Emphasized important events (Charlie attacks)

## System Integration

### Audio Event Synchronization

Haptic effects are automatically triggered when their corresponding audio events play, creating synchronized audio-tactile feedback without requiring separate haptic event calls.

### Platform Compatibility

The haptic system is designed to work across different input devices:
- Console controllers with built-in vibration
- PC gaming controllers
- Graceful degradation on devices without haptic capability

### Performance Considerations

- Effects are optimized to minimize performance impact
- Vibration patterns are brief to avoid battery drain
- Audio intensity scaling allows for user preference accommodation

## Configuration Management

### Effect Filtering

Effects can be categorized and filtered:
- UI effects for menu interactions
- Player-only effects for direct user actions
- Boss-specific effects for epic encounters

### Intensity Scaling

The system supports global intensity scaling for:
- Accessibility requirements
- User preference customization
- Battery conservation on mobile devices

## Common Usage Patterns

Haptic effects enhance gameplay through:
- **Feedback Confirmation**: Confirming successful actions
- **Immersive Atmosphere**: Environmental presence through tactile sensation
- **Combat Enhancement**: Physical feedback for weapon impacts
- **Warning Systems**: Urgent notifications through vibration
- **Accessibility Support**: Non-audio feedback for hearing-impaired players

## Related Modules

- [Audio Systems](mdc:dst-api-webdocs/path/to/audio.md): Core audio event triggering
- [Input Systems](mdc:dst-api-webdocs/path/to/input.md): Controller vibration hardware interface
- [Constants](./constants.md): Audio event path definitions
- [Console Commands](./consolecommands.md): Debug commands for haptic testing
