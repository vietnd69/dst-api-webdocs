---
id: guitartab-dsmaintheme
title: Guitar Tab - DST Main Theme
description: Guitar tablature data for the Don't Starve Together main theme
sidebar_position: 10
slug: game-scripts/core-systems/guitartab-dsmaintheme
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Guitar Tab - DST Main Theme

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `guitartab_dsmaintheme.lua` script contains guitar tablature data for the Don't Starve Together main theme. This module provides musical notation data that can be used with the in-game guitar system, allowing players to perform the iconic main theme music.

## Usage Example

```lua
-- Access the guitar tab data
local main_theme_tab = require("guitartab_dsmaintheme")

-- Use with console command for testing
-- See consolecommands.lua c_guitartab() function for example use
```

## Tab Configuration

### Tuning Configuration

**Standard Guitar Tuning:** E2, A2, D3, G3, B3, E4

```lua
local tuning = { 29, 34, 39, 44, 48, 53 }
```

**Description:**
- Array of MIDI note numbers representing each guitar string
- **String 1 (E2)**: MIDI note 29 (low E string)
- **String 2 (A2)**: MIDI note 34 (A string)
- **String 3 (D3)**: MIDI note 39 (D string)
- **String 4 (G3)**: MIDI note 44 (G string)
- **String 5 (B3)**: MIDI note 48 (B string)
- **String 6 (E4)**: MIDI note 53 (high E string)

### Musical Parameters

#### transposition

**Value:** `8`

**Status:** `stable`

**Description:** The number of semitones to transpose the tablature up from the base tuning.

#### spacing_multiplier

**Value:** `2.25`

**Status:** `stable`

**Description:** Timing multiplier that controls the spacing between notes during playback.

## Tablature Data Structure

### Tab Array Format

The tablature is stored as an array where:
- Each element represents a musical beat/timing position
- `m` represents a rest (no note played)
- Numbers represent fret positions on each string
- Objects with `t` property specify timing subdivisions

**Example Beat:**
```lua
{	m,	2,	m,	4,	m,	m	}
-- E   A   D   G   B   e (strings)
-- -   2   -   4   -   - (fret positions)
```

### Timing Subdivisions

**Fractional Timing:**
```lua
{	m,	m,	m,	m,	m,	2, t=.33	}
```

The `t` parameter specifies fractional timing:
- `t=.33`: Note plays at 1/3 of the beat
- `t=.66`: Note plays at 2/3 of the beat

## Return Structure

### Module Export

```lua
return { 
    tuning = tuning, 
    transposition = transposition, 
    tab = tab, 
    spacing_multiplier = spacing_multiplier 
}
```

**Properties:**
- `tuning` (table): Array of MIDI note numbers for string tuning
- `transposition` (number): Semitone transposition value
- `tab` (table): Complete tablature data array
- `spacing_multiplier` (number): Timing spacing multiplier

## Integration with Guitar System

### Console Command Integration

**Reference:** `consolecommands.lua c_guitartab()` function

**Description:**
The tablature data is designed to work with the game's console guitar command system, allowing developers and players to play the main theme using in-game musical mechanics.

### Playback Mechanism

The tab data provides:
1. **Fret Positions**: Which frets to press on each string
2. **Timing Information**: When each note should be played
3. **Musical Structure**: Complete arrangement of the main theme

## Musical Notation

### Fret Number System

- `0`: Open string (no fret pressed)
- `1-12`: Fret positions along the guitar neck
- `m` or `-1`: Muted/rest (no note played)

### String Arrangement

The tab uses standard 6-string guitar layout:
```
e (1st string) - Highest pitch
B (2nd string)
G (3rd string)
D (4th string)
A (5th string)
E (6th string) - Lowest pitch
```

## Common Usage Patterns

This tablature system is used for:
- **In-Game Music Performance**: Playing recognizable themes within the game
- **Audio Testing**: Developers can test musical systems
- **Musical Integration**: Connecting game audio with interactive elements
- **Cultural Reference**: Preserving the iconic DST musical themes in playable format

## Related Modules

- [Console Commands](./consolecommands.md): Contains `c_guitartab()` function for playback
- [Note Table - DST Main Theme](./notetable_dsmaintheme.md): Related musical notation data
- [Audio Systems](mdc:dst-api-webdocs/path/to/audio.md): Core audio playback systems
