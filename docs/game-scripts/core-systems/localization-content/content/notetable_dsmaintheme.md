---
id: notetable-dsmaintheme
title: Note Table - DST Main Theme
description: Musical note data table for the Don't Starve Together main theme
sidebar_position: 11

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Note Table - DST Main Theme

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `notetable_dsmaintheme` module contains the musical note data for the Don't Starve Together main theme. It provides a sequence of musical notes with precise timing information that can be used for audio playback, music visualization, or procedural music generation within the game.

## Usage Example

```lua
-- Load the note table
local main_theme_notes = require("notetable_dsmaintheme")

-- Access individual notes
local first_note = main_theme_notes[1]
print("First note: " .. first_note[1] .. " at time " .. first_note.t)
-- Output: First note: 44 at time 0.048

-- Iterate through all notes
for i, note_data in ipairs(main_theme_notes) do
    local note_number = note_data[1]
    local timing = note_data.t
    print("Note " .. i .. ": " .. note_number .. " at " .. timing .. "s")
end

-- Use with shell generation (as referenced in consolecommands.lua)
-- See consolecommands.lua c_shellsfromtable() function for example use
```

## Data Structure

### Note Entry Format

Each note in the table follows this structure:

```lua
{ note_number, t = timing_value }
```

**Fields:**
- `note_number` (number): MIDI-style note number representing the pitch
- `t` (number): Timing in seconds when this note should be played

### Note Data

The module returns a table containing 42 note entries that make up the DST main theme:

| Index | Note Number | Timing (seconds) | Musical Context |
|-------|-------------|------------------|-----------------|
| 1 | 44 | 0.048 | Opening note |
| 2 | 56 | 0.08 | Early melody |
| 3 | 63 | 5.808 | First phrase |
| 4 | 39 | 5.848 | Bass entry |
| 5 | 44 | 11.528 | Melody return |
| ... | ... | ... | ... |
| 42 | 56 | 80.624 | Final note |

### Complete Note Sequence

```lua
local notes = {
    { 44, t=0.048 },    -- G#2
    { 56, t=0.08 },     -- G#3
    { 63, t=5.808 },    -- D#4
    { 39, t=5.848 },    -- D#2
    { 44, t=11.528 },   -- G#2
    { 56, t=11.592 },   -- G#3
    { 63, t=15.416 },   -- D#4
    { 64, t=16.32 },    -- E4
    { 63, t=17.256 },   -- D#4
    { 39, t=17.312 },   -- D#2
    { 56, t=23.12 },    -- G#3
    { 44, t=23.152 },   -- G#2
    { 59, t=28.832 },   -- B3
    { 39, t=28.96 },    -- D#2
    { 56, t=30.768 },   -- G#3
    { 53, t=32.64 },    -- F3
    { 51, t=34.488 },   -- D#3
    { 55, t=34.544 },   -- G3
    { 46, t=40.408 },   -- A#2
    { 52, t=42.312 },   -- E3
    { 51, t=44.24 },    -- D#3
    { 56, t=46.168 },   -- G#3
    { 44, t=46.304 },   -- G#2
    { 59, t=49.992 },   -- B3
    { 46, t=50.976 },   -- A#2
    { 63, t=51.792 },   -- D#4
    { 47, t=51.8 },     -- B2
    { 59, t=55.76 },    -- B3
    { 40, t=57.736 },   -- E2
    { 64, t=57.744 },   -- E4
    { 61, t=61.52 },    -- C#4
    { 58, t=63.512 },   -- A#3
    { 37, t=63.536 },   -- C#2
    { 59, t=69.104 },   -- B3
    { 39, t=69.272 },   -- D#2
    { 58, t=74.928 },   -- A#3
    { 46, t=74.928 },   -- A#2
    { 43, t=78.656 },   -- G2
    { 59, t=78.688 },   -- B3
    { 44, t=80.536 },   -- G#2
    { 56, t=80.624 },   -- G#3
}
```

## Musical Analysis

### Note Range
- **Lowest Note**: 37 (C#2)
- **Highest Note**: 64 (E4)
- **Range**: Approximately 2.25 octaves

### Timing Information
- **Duration**: ~80.6 seconds total
- **Note Density**: 42 notes over 80.6 seconds (≈0.52 notes per second)
- **Tempo**: Variable, with clustering around key musical phrases

### Key Musical Elements
- **Primary Key**: Appears to be in G# minor/major
- **Bass Notes**: Frequent use of notes 37, 39, 40 (C#2, D#2, E2)
- **Melody Notes**: Centered around 56, 59, 63 (G#3, B3, D#4)
- **Harmonic Structure**: Uses pentatonic and minor scale patterns

## Integration Examples

### Audio Playback Integration

```lua
-- Example integration with audio system
local main_theme = require("notetable_dsmaintheme")

function PlayMainTheme(audio_system)
    for _, note_data in ipairs(main_theme) do
        local note_number = note_data[1]
        local timing = note_data.t
        
        -- Schedule note playback
        audio_system:ScheduleNote(note_number, timing)
    end
end
```

### Music Visualization

```lua
-- Example for creating visual representation
local main_theme = require("notetable_dsmaintheme")

function CreateMusicVisualization()
    local visualization_data = {}
    
    for i, note_data in ipairs(main_theme) do
        local note_number = note_data[1]
        local timing = note_data.t
        
        table.insert(visualization_data, {
            index = i,
            pitch = note_number,
            time = timing,
            frequency = 440 * math.pow(2, (note_number - 69) / 12) -- Convert to Hz
        })
    end
    
    return visualization_data
end
```

### Shell Generation (Console Commands)

```lua
-- Referenced usage in consolecommands.lua
-- See c_shellsfromtable() function for example use
local main_theme = require("notetable_dsmaintheme")

function GenerateShellsFromMainTheme()
    -- This function would use the note data to generate 
    -- procedural shell positions or other game elements
    -- based on the musical timing and pitch data
    return c_shellsfromtable(main_theme)
end
```

## Technical Notes

### MIDI Note Numbers
The note numbers follow standard MIDI convention:
- **Middle C (C4)**: Note number 60
- **A4 (440Hz)**: Note number 69
- **Calculation**: Frequency = 440 * 2^((note_number - 69) / 12)

### Timing Precision
- Timing values are given in seconds with millisecond precision
- Values are floating-point numbers for accurate synchronization
- Timing appears to be based on the original audio recording

### Performance Considerations
- **Memory Usage**: Minimal - simple table with 42 entries
- **Loading Time**: Instant - static data structure
- **CPU Impact**: None during runtime (data-only module)

## Related Modules

- [Console Commands](./consolecommands.md): Contains `c_shellsfromtable()` function that uses this data
- [Audio System](./preloadsounds.md): Audio loading and playback systems
- [Main Theme Guitar Tab](./guitartab_dsmaintheme.md): Guitar tablature version of the same musical content

## Usage in Game Systems

This note table is primarily used for:
1. **Background Music**: Playing the main theme during appropriate game moments
2. **Procedural Generation**: Using musical timing for non-audio game elements
3. **Debug Tools**: Console commands that create patterns based on musical data
4. **Audio Testing**: Verifying audio system functionality with known good data
