---
id: debugsounds
title: Debug Sounds
description: Sound debugging system that tracks and monitors audio events with visual indicators and logging
sidebar_position: 37
slug: api-vanilla/core-systems/debugsounds
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Debug Sounds

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `debugsounds` module provides comprehensive audio debugging capabilities by intercepting and tracking all sound events in the game. It maintains records of both looping and one-shot sounds, provides visual debugging indicators, and generates detailed debug output for audio troubleshooting.

## Usage Example

```lua
-- The module automatically intercepts sound calls
-- Enable sound debug UI for visual indicators
SOUNDDEBUGUI_ENABLED = true

-- Play a sound (automatically tracked)
inst.SoundEmitter:PlaySound("event/sound", "loop_name")

-- Get debug information
print(GetSoundDebugString())
```

## Configuration Variables

### SoundEmitter.SoundDebug.maxRecentSounds

**Type:** `number`

**Value:** `30`

**Status:** `stable`

**Description:**
Maximum number of recent one-shot sounds to track in the debug output.

### SoundEmitter.SoundDebug.maxDistance

**Type:** `number`

**Value:** `30`

**Status:** `stable`

**Description:**
Maximum distance from the listener to show sounds in debug output.

## Tracked Sound Data

The module maintains several data structures for sound tracking:

### SoundEmitter.SoundDebug.nearbySounds

**Type:** `table`

**Status:** `stable`

**Description:**
Array of recent one-shot sound information within the maximum distance.

### SoundEmitter.SoundDebug.loopingSounds

**Type:** `table`

**Status:** `stable`

**Description:**
Table mapping entities to their active looping sounds.

### SoundEmitter.SoundDebug.uiSounds

**Type:** `table`

**Status:** `stable`

**Description:**
Array of recent UI sound events.

### SoundEmitter.SoundDebug.loopingUISounds

**Type:** `table`

**Status:** `stable`

**Description:**
Table of active looping UI sounds.

## Intercepted Functions

### SoundEmitter.PlaySound(emitter, event, name, volume, ...) {#soundemitter-playsound}

**Status:** `stable` (enhanced)

**Description:**
Enhanced version of PlaySound that tracks all sound events and creates visual debug indicators.

**Parameters:**
- `emitter` (SoundEmitter): The sound emitter instance
- `event` (string): FMOD event path
- `name` (string): Optional loop name for tracking
- `volume` (number): Sound volume (default: 1)
- `...` (any): Additional parameters

**Tracking Behavior:**
- Creates `sounddebugicon` prefab for visual indication (if `SOUNDDEBUGUI_ENABLED`)
- Records sound information including position, distance, and parameters
- Distinguishes between one-shot and looping sounds

**Example:**
```lua
-- One-shot sound (tracked in nearbySounds)
inst.SoundEmitter:PlaySound("dontstarve/characters/wilson/hurt")

-- Looping sound (tracked in loopingSounds)
inst.SoundEmitter:PlaySound("dontstarve/common/campfire", "fire_loop")
```

### SoundEmitter.KillSound(emitter, name, ...) {#soundemitter-killsound}

**Status:** `stable` (enhanced)

**Description:**
Enhanced version of KillSound that removes tracking information and visual indicators.

**Parameters:**
- `emitter` (SoundEmitter): The sound emitter instance
- `name` (string): Loop name to stop
- `...` (any): Additional parameters

**Example:**
```lua
-- Stop looping sound and remove debug tracking
inst.SoundEmitter:KillSound("fire_loop")
```

### SoundEmitter.KillAllSounds(emitter, ...) {#soundemitter-killallsounds}

**Status:** `stable` (enhanced)

**Description:**
Enhanced version of KillAllSounds that clears all tracking information for the emitter.

**Parameters:**
- `emitter` (SoundEmitter): The sound emitter instance
- `...` (any): Additional parameters

### SoundEmitter.SetParameter(emitter, name, parameter, value, ...) {#soundemitter-setparameter}

**Status:** `stable` (enhanced)

**Description:**
Enhanced version of SetParameter that tracks parameter changes for debugging.

**Parameters:**
- `emitter` (SoundEmitter): The sound emitter instance
- `name` (string): Loop name
- `parameter` (string): Parameter name
- `value` (number): Parameter value
- `...` (any): Additional parameters

**Example:**
```lua
-- Set parameter and track for debugging
inst.SoundEmitter:SetParameter("fire_loop", "intensity", 0.8)
```

### SoundEmitter.SetVolume(emitter, name, volume, ...) {#soundemitter-setvolume}

**Status:** `stable` (enhanced)

**Description:**
Enhanced version of SetVolume that tracks volume changes for debugging.

**Parameters:**
- `emitter` (SoundEmitter): The sound emitter instance
- `name` (string): Loop name
- `volume` (number): New volume value
- `...` (any): Additional parameters

## Debug Output Functions

### GetSoundDebugString() {#getsounddebugstring}

**Status:** `stable`

**Description:**
Generates a comprehensive debug string containing information about all tracked sounds.

**Returns:**
- (string): Formatted debug information including looping sounds, recent sounds, and UI sounds

**Output Format:**
```
-------SOUND DEBUG-------
Looping Sounds
    [loop_name] event_path owner:guid prefab pos:x,y,z dist:distance volume:vol params:{param=value}
Recent Sounds
    [count] event_path owner:guid prefab pos:x,y,z dist:distance volume:vol
```

**Example:**
```lua
-- Print detailed sound debug information
print(GetSoundDebugString())
```

## Sound Information Structure

Each tracked sound contains the following information:

```lua
local soundInfo = {
    emitter = emitter,           -- SoundEmitter instance
    event = event,               -- FMOD event path
    owner = ent,                 -- Entity that owns the emitter
    guid = ent.GUID,            -- Entity GUID
    prefab = ent.prefab,        -- Entity prefab name
    position = pos,              -- World position (Vector3)
    dist = dist,                -- Distance from listener
    volume = volume,            -- Sound volume
    icon = soundIcon,           -- Visual debug icon (if enabled)
    callstack = debugstack(2),  -- Call stack for debugging
    params = {},                -- Parameter values (looping sounds only)
    count = count               -- Sequence number (one-shot sounds only)
}
```

## Visual Debug Indicators

When `SOUNDDEBUGUI_ENABLED` is true:

- **Sound Icons**: `sounddebugicon` prefabs spawn at sound locations
- **Loop Names**: Icons display the loop name for looping sounds
- **Count Numbers**: Icons display sequence numbers for one-shot sounds
- **Auto-cleanup**: Icons are automatically removed when sounds stop

## Update System

The module includes a periodic update system that:

- Validates looping sound states
- Updates position and distance information
- Removes stale sound tracking data
- Cleans up visual indicators for stopped sounds

```lua
-- Update runs every 1 second
scheduler:ExecutePeriodic(1, DoUpdate)
```

## Complete Example

```lua
-- Enable visual debugging
SOUNDDEBUGUI_ENABLED = true

-- Play various sounds for testing
local campfire = SpawnPrefab("campfire")
campfire.SoundEmitter:PlaySound("dontstarve/common/campfire", "fire_loop")
campfire.SoundEmitter:SetParameter("fire_loop", "intensity", 0.5)

-- Play one-shot sound
player.SoundEmitter:PlaySound("dontstarve/characters/wilson/hurt")

-- Debug output
function ShowSoundDebug()
    local debug_info = GetSoundDebugString()
    print(debug_info)
    
    -- Also check console output for recent activity
    local console_lines = GetConsoleOutputList()
    for i, line in ipairs(console_lines) do
        if string.find(line, "SOUND") then
            print("Audio event:", line)
        end
    end
end

-- Call every few seconds to monitor audio
scheduler:ExecutePeriodic(3, ShowSoundDebug)

-- Stop all sounds and clean up tracking
campfire.SoundEmitter:KillAllSounds()
```

## Debugging Tips

1. **Distance Filtering**: Adjust `maxDistance` to focus on nearby sounds
2. **Visual Indicators**: Enable `SOUNDDEBUGUI_ENABLED` for spatial debugging
3. **Parameter Tracking**: Monitor parameter changes in real-time
4. **Performance Impact**: Disable when not actively debugging audio

## Related Modules

- [Debug Tools](./debugtools.md): General debugging utilities
- [Debug Print](./debugprint.md): Enhanced logging system
- [FX](./fx.md): Visual effects and audio coordination
