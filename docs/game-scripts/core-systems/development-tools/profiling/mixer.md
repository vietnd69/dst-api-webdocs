---
id: mixer
title: Mixer
description: Audio mixing system for managing sound levels, filters, and audio states
sidebar_position: 2
slug: game-scripts/core-systems/mixer
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Mixer

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The Mixer system provides comprehensive audio management capabilities for Don't Starve Together. It consists of two main classes: `Mix` for individual audio configurations and `Mixer` for managing multiple mixes with priority-based stacking and audio filtering.

## Usage Example

```lua
local Mixer = require("mixer")

-- Create a new mixer instance
local myMixer = Mixer()

-- Add a new mix configuration
myMixer:AddNewMix("gameplay", 2.0, 1, {
    ["set_music/soundtrack"] = 0.8,
    ["set_sfx/sfx"] = 1.0,
    ["set_ambience/ambience"] = 0.6
})

-- Activate the mix
myMixer:PushMix("gameplay")
```

## Classes

### Mix

The `Mix` class represents a single audio configuration with volume levels for different audio channels.

#### Constructor

**Mix(name)**

**Parameters:**
- `name` (string, optional): Name identifier for the mix

**Example:**
```lua
local mix = Mix("my_mix")
```

#### Properties

- `name` (string): The mix identifier
- `levels` (table): Channel volume levels mapping
- `priority` (number): Mix priority (default: 0)
- `fadeintime` (number): Fade-in duration in seconds (default: 1)

#### Methods

##### mix:Apply() {#mix-apply}

**Status:** `stable`

**Description:**
Applies the mix's volume levels to the audio system immediately.

**Example:**
```lua
mix:Apply()
```

##### mix:SetLevel(channel, level) {#mix-setlevel}

**Status:** `stable`

**Description:**
Sets the volume level for a specific audio channel.

**Parameters:**
- `channel` (string): Audio channel identifier
- `level` (number): Volume level (0.0 to 1.0)

**Example:**
```lua
mix:SetLevel("set_music/soundtrack", 0.5)
```

##### mix:GetLevel(channel) {#mix-getlevel}

**Status:** `stable`

**Description:**
Gets the volume level for a specific audio channel.

**Parameters:**
- `channel` (string): Audio channel identifier

**Returns:**
- (number): Volume level for the channel (0 if not set)

**Example:**
```lua
local musicLevel = mix:GetLevel("set_music/soundtrack")
```

### Mixer

The `Mixer` class manages multiple audio mixes with priority-based stacking and audio filtering capabilities.

#### Constructor

**Mixer()**

**Description:**
Creates a new mixer instance with empty mix collections and filter arrays.

**Example:**
```lua
local mixer = Mixer()
```

#### Properties

- `mixes` (table): Collection of registered mix configurations
- `stack` (table): Priority-ordered stack of active mixes
- `lowpassfilters` (table): Low-pass filter configurations by channel
- `highpassfilters` (table): High-pass filter configurations by channel

#### Mix Management Methods

##### mixer:AddNewMix(name, fadetime, priority, levels) {#mixer-addnewmix}

**Status:** `stable`

**Description:**
Creates and registers a new mix configuration.

**Parameters:**
- `name` (string): Unique identifier for the mix
- `fadetime` (number, optional): Fade-in duration in seconds (default: 1)
- `priority` (number, optional): Mix priority for stacking (default: 0)
- `levels` (table): Channel volume level mappings

**Returns:**
- (Mix): The created mix object

**Example:**
```lua
local mix = mixer:AddNewMix("combat", 1.5, 2, {
    ["set_music/soundtrack"] = 0.3,
    ["set_sfx/sfx"] = 1.0
})
```

##### mixer:PushMix(mixname) {#mixer-pushmix}

**Status:** `stable`

**Description:**
Activates a mix by adding it to the priority stack. Higher priority mixes take precedence.

**Parameters:**
- `mixname` (string): Name of the mix to activate

**Example:**
```lua
mixer:PushMix("combat")
```

##### mixer:PopMix(mixname) {#mixer-popmix}

**Status:** `stable`

**Description:**
Removes a specific mix from the active stack and triggers fade transition if needed.

**Parameters:**
- `mixname` (string): Name of the mix to remove

**Example:**
```lua
mixer:PopMix("combat")
```

##### mixer:DeleteMix(mixname) {#mixer-deletemix}

**Status:** `stable`

**Description:**
Immediately removes a mix from the stack without fade transition.

**Parameters:**
- `mixname` (string): Name of the mix to delete

**Example:**
```lua
mixer:DeleteMix("combat")
```

#### Audio Level Methods

##### mixer:GetLevel(channel) {#mixer-getlevel}

**Status:** `stable`

**Description:**
Gets the current volume level for a specific audio channel.

**Parameters:**
- `channel` (string): Audio channel identifier

**Returns:**
- (number): Current volume level

**Example:**
```lua
local currentLevel = mixer:GetLevel("set_music/soundtrack")
```

##### mixer:SetLevel(channel, level) {#mixer-setlevel}

**Status:** `stable`

**Description:**
Directly sets the volume level for an audio channel.

**Parameters:**
- `channel` (string): Audio channel identifier
- `level` (number): Volume level to set

**Example:**
```lua
mixer:SetLevel("set_music/soundtrack", 0.8)
```

#### Filter Methods

##### mixer:SetLowPassFilter(category, cutoff, timetotake) {#mixer-setlowpassfilter}

**Status:** `stable`

**Description:**
Applies a low-pass filter to an audio category with gradual transition.

**Parameters:**
- `category` (string): Audio category to filter
- `cutoff` (number): Filter cutoff frequency
- `timetotake` (number, optional): Transition duration in seconds (default: 3)

**Example:**
```lua
mixer:SetLowPassFilter("set_music/soundtrack", 1000, 2.0)
```

##### mixer:SetHighPassFilter(category, cutoff, timetotake) {#mixer-sethighpassfilter}

**Status:** `stable`

**Description:**
Applies a high-pass filter to an audio category with gradual transition.

**Parameters:**
- `category` (string): Audio category to filter
- `cutoff` (number): Filter cutoff frequency
- `timetotake` (number, optional): Transition duration in seconds (default: 3)

**Example:**
```lua
mixer:SetHighPassFilter("set_sfx/sfx", 500, 1.5)
```

##### mixer:ClearLowPassFilter(category, timetotake) {#mixer-clearlowpassfilter}

**Status:** `stable`

**Description:**
Removes a low-pass filter from an audio category.

**Parameters:**
- `category` (string): Audio category to clear
- `timetotake` (number, optional): Transition duration in seconds

**Example:**
```lua
mixer:ClearLowPassFilter("set_music/soundtrack", 2.0)
```

##### mixer:ClearHighPassFilter(category, timetotake) {#mixer-clearhighpassfilter}

**Status:** `stable`

**Description:**
Removes a high-pass filter from an audio category.

**Parameters:**
- `category` (string): Audio category to clear
- `timetotake` (number, optional): Transition duration in seconds

**Example:**
```lua
mixer:ClearHighPassFilter("set_sfx/sfx", 1.5)
```

#### System Methods

##### mixer:Update(dt) {#mixer-update}

**Status:** `stable`

**Description:**
Updates the mixer state including fade transitions and filter animations. Should be called every frame.

**Parameters:**
- `dt` (number): Delta time since last update

**Example:**
```lua
-- In a game loop
mixer:Update(dt)
```

##### mixer:CreateSnapshot() {#mixer-createsnapshot}

**Status:** `stable`

**Description:**
Creates a snapshot of current audio levels for fade transition calculations.

**Returns:**
- (Mix): Snapshot mix containing current levels

**Example:**
```lua
local snapshot = mixer:CreateSnapshot()
```

##### mixer:Blend() {#mixer-blend}

**Status:** `stable`

**Description:**
Initiates a fade transition between the current audio state and the top mix in the stack.

**Example:**
```lua
mixer:Blend()
```

## Audio Channel Constants

Common audio channel identifiers used in DST:

| Channel | Purpose |
|---------|---------|
| `"set_ambience/ambience"` | Ambient environmental sounds |
| `"set_ambience/cloud"` | Weather and atmospheric effects |
| `"set_music/soundtrack"` | Background music |
| `"set_sfx/voice"` | Character voice and speech |
| `"set_sfx/movement"` | Movement and footstep sounds |
| `"set_sfx/creature"` | Creature and mob sounds |
| `"set_sfx/player"` | Player action sounds |
| `"set_sfx/HUD"` | User interface sounds |
| `"set_sfx/sfx"` | General sound effects |
| `"set_sfx/everything_else_muted"` | Special effects channel |

## Common Usage Patterns

### Basic Mix Management
```lua
-- Setup a gameplay mix
mixer:AddNewMix("normal", 2, 1, {
    ["set_ambience/ambience"] = 0.8,
    ["set_music/soundtrack"] = 1.0,
    ["set_sfx/sfx"] = 1.0
})

-- Activate during normal gameplay
mixer:PushMix("normal")

-- Switch to combat with higher priority
mixer:AddNewMix("combat", 1, 3, {
    ["set_ambience/ambience"] = 0.3,
    ["set_music/soundtrack"] = 0.6,
    ["set_sfx/sfx"] = 1.0
})
mixer:PushMix("combat")

-- Return to normal when combat ends
mixer:PopMix("combat")
```

### Audio Filtering
```lua
-- Apply underwater effect
mixer:SetLowPassFilter("set_sfx/sfx", 800, 1.0)
mixer:SetLowPassFilter("set_music/soundtrack", 400, 1.0)

-- Clear filters when surfacing
mixer:ClearLowPassFilter("set_sfx/sfx", 1.0)
mixer:ClearLowPassFilter("set_music/soundtrack", 1.0)
```

## Related Modules

- [Mixes](./mixes.md): Predefined mix configurations for different game states
- [Easing](./easing.md): Animation and interpolation functions used in transitions
