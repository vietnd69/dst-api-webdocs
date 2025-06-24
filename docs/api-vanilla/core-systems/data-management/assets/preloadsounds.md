---
id: preloadsounds
title: Preload Sounds
description: Sound file preloading system for optimized audio performance in DST
sidebar_position: 5
slug: api-vanilla/core-systems/preloadsounds
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Preload Sounds

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `preloadsounds.lua` module manages the preloading of sound files for Don't Starve Together. It defines comprehensive sound file lists and provides functions to efficiently preload audio assets, reducing loading times during gameplay and ensuring smooth audio playback.

## Sound Lists

### DLCSounds

**Type:** `table`

**Status:** `stable`

**Description:** Array of DLC-specific sound files that are loaded when Reign of Giants DLC is installed.

**Contents:**
```lua
{
    "amb_stream.fsb",
    "bearger.fsb",
    "buzzard.fsb",
    "catcoon.fsb",
    "deciduous.fsb",
    "DLC_music.fsb",
    "dontstarve_DLC001.fev",
    "dragonfly.fsb",
    "glommer.fsb",
    "goosemoose.fsb",
    "lightninggoat.fsb",
    "mole.fsb",
    "stuff.fsb",
    "vargr.fsb",
    "wathgrithr.fsb",
    "webber.fsb"
}
```

### MainSounds

**Type:** `table`

**Status:** `stable`

**Description:** Array of core sound files that are always loaded in the base game, including character sounds, creature sounds, ambient audio, and event-specific music.

**Key Categories:**
- **Character Sounds:** Individual character voice files (wilson.fsb, willow.fsb, etc.)
- **Creature Sounds:** Animal and monster audio (beefalo.fsb, spider.fsb, etc.)
- **Ambient Audio:** Environmental sounds (forest.fsb, cave_AMB.fsb, etc.)
- **Event Music:** Seasonal and special event audio files
- **Core Systems:** Basic game audio (common.fsb, sfx.fsb, music.fsb)

## Functions

### PreloadSoundList(list) {#preload-sound-list}

**Status:** `stable`

**Description:**
Preloads all sound files specified in the provided list by calling TheSim:PreloadFile() for each file with the "sound/" path prefix.

**Parameters:**
- `list` (table): Array of sound file names to preload

**Returns:**
- (void): No return value

**Example:**
```lua
local custom_sounds = {"custom_music.fsb", "custom_sfx.fsb"}
PreloadSoundList(custom_sounds)
```

### PreloadSounds() {#preload-sounds}

**Status:** `stable`

**Description:**
Main function that orchestrates the preloading of all sound files. Conditionally loads DLC sounds if Reign of Giants is installed, loads all main sounds, and handles special event music selection based on current world settings.

**Parameters:**
- None

**Returns:**
- (void): No return value

**Logic Flow:**
1. Checks if Reign of Giants DLC is installed via `IsDLCInstalled(REIGN_OF_GIANTS)`
2. If DLC is present, preloads DLC sound list
3. Always preloads main sound list
4. Dynamically selects and preloads special event music based on:
   - `WORLD_FESTIVAL_EVENT` setting
   - `WORLD_SPECIAL_EVENT` setting
   - Falls back to "music_frontend.fsb" if no special events

**Example:**
```lua
-- Called during game initialization
PreloadSounds()
```

## Sound File Organization

### File Types

| Extension | Purpose | Description |
|-----------|---------|-------------|
| `.fsb` | FMOD Sound Bank | Compressed audio container with multiple sounds |
| `.fev` | FMOD Event File | Audio event definitions and parameters |

### Naming Conventions

- **Character Files:** `[character_name].fsb` (e.g., wilson.fsb, willow.fsb)
- **Creature Files:** `[creature_name].fsb` (e.g., spider.fsb, beefalo.fsb)
- **Event Files:** `[event_name].fev` and `[event_name].fsb` pairs
- **System Files:** Descriptive names (common.fsb, sfx.fsb, music.fsb)

## Special Event Music Handling

The system dynamically loads event-specific music based on world configuration:

```lua
PreloadSoundList({
    (FESTIVAL_EVENT_MUSIC[WORLD_FESTIVAL_EVENT] ~= nil and 
     FESTIVAL_EVENT_MUSIC[WORLD_FESTIVAL_EVENT].bank) or
    (SPECIAL_EVENT_MUSIC[WORLD_SPECIAL_EVENT] ~= nil and 
     SPECIAL_EVENT_MUSIC[WORLD_SPECIAL_EVENT].bank) or
    "music_frontend.fsb",
})
```

**Priority Order:**
1. Festival event music (if active festival)
2. Special event music (if active special event)
3. Default frontend music (fallback)

## Dependencies

### Required Modules
- [`dlcsupport`](./dlcsupport.md): DLC detection and compatibility functions

### External References
- `TheSim:PreloadFile()`: Engine function for file preloading
- `IsDLCInstalled()`: DLC detection function
- `FESTIVAL_EVENT_MUSIC`: Festival music configuration constant
- `SPECIAL_EVENT_MUSIC`: Special event music configuration constant
- `WORLD_FESTIVAL_EVENT`: Current world festival setting
- `WORLD_SPECIAL_EVENT`: Current world special event setting

## Performance Considerations

### Preloading Benefits
- **Reduced Loading Times:** Files are cached in memory before needed
- **Smooth Audio Transitions:** No delays when switching between sounds
- **Improved User Experience:** Eliminates audio stuttering during gameplay

### Memory Usage
- Sound files are loaded into memory during initialization
- DLC sounds only loaded when relevant DLC is installed
- Event-specific music loaded dynamically based on world settings

## Usage Patterns

### Game Initialization
```lua
-- Called during game startup
PreloadSounds()
```

### Mod Integration
```lua
-- Mods can extend preloading for custom sounds
local mod_sounds = {"mod_character.fsb", "mod_creatures.fsb"}
PreloadSoundList(mod_sounds)
```

### Conditional Loading
```lua
-- Example of conditional sound loading
if some_condition then
    PreloadSoundList({"conditional_sounds.fsb"})
end
```

## Related Modules

- [`constants`](./constants.md): Contains event music configuration tables
- [`dlcsupport`](./dlcsupport.md): DLC detection and compatibility functions
- [`main`](./main.md): Game initialization system that calls PreloadSounds()

## Notes

- The module is loaded before `constants.lua`, so event music constants are only accessed within function calls
- Special event music configuration is defined in `constants.lua` but accessed dynamically
- All sound files are loaded from the "sound/" directory path
- The system gracefully handles missing DLC by conditional loading
