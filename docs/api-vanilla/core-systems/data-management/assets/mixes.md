---
id: mixes
title: Mixes
description: Predefined audio mix configurations for different game states and scenarios
sidebar_position: 4
slug: api-vanilla/core-systems/mixes
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Mixes

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The Mixes module defines predefined audio mix configurations for different game states in Don't Starve Together. These mixes are automatically registered with `TheMixer` and provide consistent audio experiences across various gameplay scenarios.

## Usage Example

```lua
-- Mixes are automatically loaded and registered when the module is required
-- They can be activated using TheMixer

-- Activate normal gameplay mix
TheMixer:PushMix("normal")

-- Switch to combat state
TheMixer:PushMix("high")

-- Return to normal when combat ends
TheMixer:PopMix("high")
```

## Audio Channel Constants

The following audio channel identifiers are used throughout the mixes:

```lua
local amb = "set_ambience/ambience"     -- Ambient environmental sounds
local cloud = "set_ambience/cloud"      -- Weather and atmospheric effects  
local music = "set_music/soundtrack"    -- Background music
local voice = "set_sfx/voice"          -- Character voice and speech
local movement = "set_sfx/movement"     -- Movement and footstep sounds
local creature = "set_sfx/creature"     -- Creature and mob sounds
local player = "set_sfx/player"        -- Player action sounds
local HUD = "set_sfx/HUD"              -- User interface sounds
local sfx = "set_sfx/sfx"              -- General sound effects
local slurp = "set_sfx/everything_else_muted" -- Special effects channel
```

## Predefined Mixes

### Core Game Mixes

#### "normal" Mix

**Status:** `stable`

**Priority:** 1 | **Fade Time:** 2 seconds

**Description:**
The standard gameplay mix used during normal exploration and base building activities.

**Audio Levels:**
- Ambience: 0.8
- Cloud: 0.0 (disabled)
- Music: 1.0 (full volume)
- Voice: 1.0 (full volume)
- Movement: 1.0 (full volume)
- Creature: 1.0 (full volume)
- Player: 1.0 (full volume)
- HUD: 1.0 (full volume)
- SFX: 1.0 (full volume)
- Special Effects: 1.0 (full volume)

**Example:**
```lua
TheMixer:PushMix("normal")
```

#### "high" Mix

**Status:** `stable`

**Priority:** 3 | **Fade Time:** 2 seconds

**Description:**
Used during intense situations like combat or dangerous encounters. Emphasizes atmospheric effects while reducing other audio.

**Audio Levels:**
- Ambience: 0.2 (reduced)
- Cloud: 1.0 (full atmospheric)
- Music: 0.5 (reduced)
- Voice: 0.7 (slightly reduced)
- Movement: 0.7 (slightly reduced)
- Creature: 0.7 (slightly reduced)
- Player: 0.7 (slightly reduced)
- HUD: 1.0 (full volume)
- SFX: 0.7 (slightly reduced)
- Special Effects: 1.0 (full volume)

#### "start" Mix

**Status:** `stable`

**Priority:** 0 | **Fade Time:** 1 second

**Description:**
Initial mix for game startup and character spawn scenarios.

**Audio Levels:**
- Ambience: 0.8
- Cloud: 0.0 (disabled)
- Music: 1.0 (full volume)
- Voice: 1.0 (full volume)
- Movement: 1.0 (full volume)
- Creature: 1.0 (full volume)
- Player: 1.0 (full volume)
- HUD: 0.5 (reduced for startup)
- SFX: 1.0 (full volume)
- Special Effects: 1.0 (full volume)

### System Control Mixes

#### "serverpause" Mix

**Status:** `stable`

**Priority:** 2147483647 (maximum) | **Fade Time:** 0 seconds

**Description:**
Emergency mix that mutes all game audio except HUD when server is paused. Has maximum priority to override all other mixes.

**Audio Levels:**
- All channels: 0.0 (muted)
- HUD: 1.0 (only UI sounds remain)

#### "pause" Mix

**Status:** `stable`

**Priority:** 4 | **Fade Time:** 1 second

**Description:**
Standard pause menu mix that reduces most audio while keeping minimal ambience and UI sounds.

**Audio Levels:**
- Ambience: 0.1 (minimal)
- Cloud: 0.1 (minimal)
- Music: 0.0 (muted)
- Voice: 0.0 (muted)
- Movement: 0.0 (muted)
- Creature: 0.0 (muted)
- Player: 0.0 (muted)
- HUD: 0.6 (reduced but audible)
- SFX: 0.0 (muted)
- Special Effects: 0.0 (muted)

#### "lobby" Mix

**Status:** `stable`

**Priority:** 8 | **Fade Time:** 2 seconds

**Description:**
Used in game lobby and menu screens where only music and UI sounds are needed.

**Audio Levels:**
- Ambience: 0.0 (muted)
- Cloud: 0.0 (muted)
- Music: 1.0 (full volume)
- Voice: 0.0 (muted)
- Movement: 0.0 (muted)
- Creature: 0.0 (muted)
- Player: 0.0 (muted)
- HUD: 0.6 (reduced)
- SFX: 0.0 (muted)
- Special Effects: 0.0 (muted)

### Special Scenario Mixes

#### "death" Mix

**Status:** `stable`

**Priority:** 6 | **Fade Time:** 1 second

**Description:**
Applied when player character dies, emphasizing player actions and voice while reducing environmental audio.

**Audio Levels:**
- Ambience: 0.2 (reduced)
- Cloud: 0.2 (reduced)
- Music: 0.0 (muted)
- Voice: 1.0 (full volume for death sounds)
- Movement: 0.8 (slightly reduced)
- Creature: 0.8 (slightly reduced)
- Player: 1.0 (full volume)
- HUD: 1.0 (full volume)
- SFX: 0.8 (slightly reduced)
- Special Effects: 0.8 (slightly reduced)

#### "moonstorm" Mix

**Status:** `stable`

**Priority:** 8 | **Fade Time:** 2 seconds

**Description:**
Used during moonstorm events, emphasizing ambience while reducing most other audio.

**Audio Levels:**
- Ambience: 1.0 (full volume for storm effects)
- Cloud: 0.0 (disabled)
- Music: 0.3 (heavily reduced)
- Voice: 0.3 (heavily reduced)
- Movement: 0.3 (heavily reduced)
- Creature: 0.3 (heavily reduced)
- Player: 1.0 (full volume)
- HUD: 1.0 (full volume)
- SFX: 0.3 (heavily reduced)
- Special Effects: 0.0 (muted)

#### "flying" Mix

**Status:** `stable`

**Priority:** 3 | **Fade Time:** 2 seconds

**Description:**
Applied when characters are flying or airborne, emphasizing atmospheric sounds.

**Audio Levels:**
- Ambience: 0.4 (moderate)
- Cloud: 0.4 (moderate atmospheric)
- Music: 0.7 (slightly reduced)
- Voice: 0.2 (heavily reduced)
- Movement: 0.2 (heavily reduced)
- Creature: 0.2 (heavily reduced)
- Player: 1.0 (full volume)
- HUD: 1.0 (full volume)
- SFX: 0.2 (heavily reduced)
- Special Effects: 0.0 (muted)

#### "slurp" Mix

**Status:** `stable`

**Priority:** 1 | **Fade Time:** 1 second

**Description:**
Special mix that emphasizes the "slurp" audio channel while reducing environmental audio.

**Audio Levels:**
- Ambience: 0.2 (reduced)
- Cloud: 0.2 (reduced)
- Music: 0.5 (reduced)
- Voice: 0.7 (slightly reduced)
- Movement: 0.7 (slightly reduced)
- Creature: 0.7 (slightly reduced)
- Player: 0.7 (slightly reduced)
- HUD: 1.0 (full volume)
- SFX: 0.7 (slightly reduced)
- Special Effects: 1.0 (full volume)

### Event-Specific Mixes

#### "lavaarena_normal" Mix

**Status:** `stable`

**Priority:** 1 | **Fade Time:** 0.1 seconds

**Description:**
Standard mix for Lava Arena events. Also used for Quagmire events.

**Audio Levels:**
- Ambience: 0.8
- Cloud: 0.0 (disabled)
- Music: 1.0 (full volume)
- Voice: 1.0 (full volume)
- Movement: 1.0 (full volume)
- Creature: 1.0 (full volume)
- Player: 1.0 (full volume)
- HUD: 1.0 (full volume)
- SFX: 1.0 (full volume)
- Special Effects: 1.0 (full volume)

#### "minigamescreen" Mix

**Status:** `stable`

**Priority:** 4 | **Fade Time:** 1 second

**Description:**
Used during minigame interfaces and special game modes.

**Audio Levels:**
- Ambience: 0.1 (minimal)
- Cloud: 0.1 (minimal)
- Music: 1.0 (full volume)
- Voice: 0.3 (reduced)
- Movement: 0.3 (reduced)
- Creature: 0.3 (reduced)
- Player: 0.3 (reduced)
- HUD: 1.0 (full volume)
- SFX: 0.3 (reduced)
- Special Effects: 0.0 (muted)

#### "silence" Mix

**Status:** `stable`

**Priority:** 8 | **Fade Time:** 0 seconds

**Description:**
Nearly complete audio silence with minimal music and full SFX for specific scenarios.

**Audio Levels:**
- Ambience: 0.0 (muted)
- Cloud: 0.0 (muted)
- Music: 0.2 (very low)
- Voice: 0.0 (muted)
- Movement: 0.0 (muted)
- Creature: 0.0 (muted)
- Player: 0.0 (muted)
- HUD: 0.0 (muted)
- SFX: 1.0 (full volume)
- Special Effects: 0.0 (muted)

### Boss Fight Mixes

#### "supernova_charging" Mix

**Status:** `stable`

**Priority:** 2 | **Fade Time:** 0.6 seconds

**Description:**
Used during Celestial Champion supernova charging phase, creating tension through reduced ambience and music.

**Audio Levels:**
- Ambience: 0.25 (reduced)
- Cloud: 0.0 (disabled)
- Music: 0.25 (heavily reduced)
- Voice: 1.0 (full volume)
- Movement: 1.0 (full volume)
- Creature: 1.0 (full volume)
- Player: 1.0 (full volume)
- HUD: 1.0 (full volume)
- SFX: 1.0 (full volume)
- Special Effects: 1.0 (full volume)

#### "supernova" Mix

**Status:** `stable`

**Priority:** 3 | **Fade Time:** 0 seconds

**Description:**
Applied during the actual supernova attack, emphasizing action sounds while minimizing distractions.

**Audio Levels:**
- Ambience: 0.1 (minimal)
- Cloud: 0.0 (disabled)
- Music: 0.0 (muted)
- Voice: 1.0 (full volume)
- Movement: 1.0 (full volume)
- Creature: 1.0 (full volume)
- Player: 1.0 (full volume)
- HUD: 1.0 (full volume)
- SFX: 1.0 (full volume)
- Special Effects: 1.0 (full volume)

## Mix Priority System

The mix system uses priority values to determine which mix takes precedence when multiple mixes are active:

| Priority Level | Mix Names | Usage |
|----------------|-----------|-------|
| 0 | start | Initial game state |
| 1 | normal, slurp, lavaarena_normal | Standard gameplay |
| 2 | supernova_charging | Boss fight preparation |
| 3 | high, flying, supernova | Combat and intense situations |
| 4 | pause, minigamescreen | Interface states |
| 6 | death | Character death |
| 8 | lobby, moonstorm, silence | System/environmental overrides |
| 2147483647 | serverpause | Emergency system override |

## Common Usage Patterns

### Dynamic Gameplay Mixing
```lua
-- Start with normal gameplay
TheMixer:PushMix("normal")

-- Enter combat situation
TheMixer:PushMix("high")

-- Player dies during combat
TheMixer:PushMix("death")

-- Player respawns, remove death mix
TheMixer:PopMix("death")

-- Combat ends, remove combat mix
TheMixer:PopMix("high")
-- Now back to "normal" mix
```

### Environmental State Changes
```lua
-- Normal weather
TheMixer:PushMix("normal")

-- Moonstorm begins
TheMixer:PushMix("moonstorm")

-- Player takes flight during storm
TheMixer:PushMix("flying")

-- Player lands
TheMixer:PopMix("flying")

-- Storm ends
TheMixer:PopMix("moonstorm")
-- Back to normal weather audio
```

### Menu Navigation
```lua
-- In game lobby
TheMixer:PushMix("lobby")

-- Enter minigame selection
TheMixer:PushMix("minigamescreen")

-- Start actual gameplay
TheMixer:PopMix("minigamescreen")
TheMixer:PopMix("lobby")
TheMixer:PushMix("normal")
```

## Implementation Details

All mixes are registered automatically when the module is loaded using the following pattern:

```lua
TheMixer:AddNewMix(name, fadetime, priority, levels)
```

Where:
- `name`: String identifier for the mix
- `fadetime`: Transition duration in seconds
- `priority`: Numeric priority for stack ordering
- `levels`: Table mapping audio channels to volume levels (0.0 to 1.0)

## Related Modules

- [Mixer](./mixer.md): Core audio mixing system and classes
- [Easing](./easing.md): Animation functions used in audio transitions
