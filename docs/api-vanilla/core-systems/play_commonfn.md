---
id: play-commonfn
title: Play Common Functions
description: Common utility functions for the stage play system in Don't Starve Together
sidebar_position: 100
slug: api-vanilla/core-systems/play-commonfn
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Play Common Functions

## Version History
| Build Version | Change Date | Change Type | Description |
|---|---|---|---|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `play_commonfn` module provides a collection of common utility functions used throughout the stage play system in Don't Starve Together. These functions handle character movement, animations, sound effects, visual effects, and stage management for theatrical performances.

## Usage Example

```lua
local fn = require("play_commonfn")

-- Call birds to the stage
fn.callbirds(inst, line, cast)

-- Position actors on stage
fn.findpositions(inst, line, cast)

-- Apply marionette effects
fn.marionetteon(inst, line, cast)
```

## Functions

### callbirds(inst, line, cast) {#callbirds}

**Status:** `stable`

**Description:**
Brings two birds (BIRD1 and BIRD2) to the stage with a slight delay between arrivals. Sets up the narrator role in the cast.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data (unused in this function)
- `cast` (table): Cast data table to update with bird and narrator assignments

**Example:**
```lua
fn.callbirds(inst, line, cast)
-- BIRD1 arrives immediately
-- BIRD2 arrives after 0.3 seconds
-- NARRATOR role is assigned to inst
```

### exitbirds(inst, line, cast) {#exitbirds}

**Status:** `stable`

**Description:**
Makes birds exit the stage with staggered timing. Only affects birds that are not already in "away" state.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data (unused in this function)
- `cast` (table): Cast data containing bird references

**Example:**
```lua
fn.exitbirds(inst, line, cast)
-- BIRD1 exits after 0.1 seconds
-- BIRD2 exits after 0.3 seconds
```

### actorscurtsey(inst, line, cast) {#actorscurtsey}

**Status:** `stable`

**Description:**
Makes all actors perform a curtsy animation with random timing delays.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data (unused in this function)
- `cast` (table): Cast data containing all actors

**Example:**
```lua
fn.actorscurtsey(inst, line, cast)
-- All actors perform curtsy with 0.1-0.5 second random delays
```

### actorsbow(inst, line, cast) {#actorsbow}

**Status:** `stable`

**Description:**
Makes all actors perform a bow animation with random timing delays.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data (unused in this function)
- `cast` (table): Cast data containing all actors

**Example:**
```lua
fn.actorsbow(inst, line, cast)
-- All actors perform bow with 0.1-0.5 second random delays
```

### marionetteon(inst, line, cast) {#marionetteon}

**Status:** `stable`

**Description:**
Applies marionette appear effects to all non-bird, non-narrator cast members.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data with optional `time` or `duration` field
- `cast` (table): Cast data containing all actors

**Example:**
```lua
local line = { duration = 2.0 }
fn.marionetteon(inst, line, cast)
-- Spawns marionette_appear_fx on eligible actors
```

### marionetteoff(inst, line, cast) {#marionetteoff}

**Status:** `stable`

**Description:**
Applies marionette disappear effects to all non-bird, non-narrator cast members.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data with optional `time` or `duration` field
- `cast` (table): Cast data containing all actors

**Example:**
```lua
local line = { duration = 1.5 }
fn.marionetteoff(inst, line, cast)
-- Spawns marionette_disappear_fx on eligible actors
```

### startbgmusic(inst, line, cast) {#startbgmusic}

**Status:** `stable`

**Description:**
Starts background music for the stage performance.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data with `musictype` field
- `cast` (table): Cast data (unused in this function)

**Example:**
```lua
local line = { musictype = "happy" }
fn.startbgmusic(inst, line, cast)
-- Sets music type to 1 (or specified musictype)
```

### stopbgmusic(inst, line, cast) {#stopbgmusic}

**Status:** `stable`

**Description:**
Stops background music for the stage performance.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data (unused in this function)
- `cast` (table): Cast data (unused in this function)

**Example:**
```lua
fn.stopbgmusic(inst, line, cast)
-- Sets music type to 0 (off)
```

### stageon(inst) {#stageon}

**Status:** `stable`

**Description:**
Transitions the stage narrator to the "on" state.

**Parameters:**
- `inst` (Entity): The stage entity instance

**Example:**
```lua
fn.stageon(inst)
-- Stage goes to "narrator_on" state
```

### stageoff(inst) {#stageoff}

**Status:** `stable`

**Description:**
Transitions the stage narrator to the "off" state.

**Parameters:**
- `inst` (Entity): The stage entity instance

**Example:**
```lua
fn.stageoff(inst)
-- Stage goes to "narrator_off" state
```

### stinger(inst, line) {#stinger}

**Status:** `stable`

**Description:**
Plays a dramatic sound stinger effect.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data with `sound` field specifying the stinger sound

**Example:**
```lua
local line = { sound = "stageplay_set/statue_lyre/stinger_intro_act1" }
fn.stinger(inst, line)
-- Plays the specified stinger sound
```

### findlucy(player) {#findlucy}

**Status:** `stable`

**Description:**
Locates Lucy (Woodie's axe) in a player's inventory.

**Parameters:**
- `player` (Entity): The player entity to search

**Returns:**
- (Entity): The Lucy entity if found, nil otherwise

**Example:**
```lua
local lucy = fn.findlucy(player)
if lucy then
    -- Lucy found in inventory or equipped
end
```

### lucytalk(inst, line, cast) {#lucytalk}

**Status:** `stable`

**Description:**
Makes Lucy (Woodie's axe) speak a line if she is found in the specified character's inventory.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data with `lucytest` (character name) and `line` (dialogue) fields
- `cast` (table): Cast data containing character references

**Example:**
```lua
local line = { 
    lucytest = "woodie", 
    line = "I'm talking!" 
}
fn.lucytalk(inst, line, cast)
-- Lucy will speak if found in Woodie's inventory
```

### maskflash(inst, line, cast) {#maskflash}

**Status:** `stable`

**Description:**
Creates a flashing light effect on all actors' masks over a specified duration.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data with `time` field specifying flash duration
- `cast` (table): Cast data containing all actors

**Example:**
```lua
local line = { time = 3.0 }
fn.maskflash(inst, line, cast)
-- Masks flash for 3 seconds with sine wave intensity
```

### enableblackout(inst) {#enableblackout}

**Status:** `stable`

**Description:**
Enables blackout effect for all nearby players within 25 units of the stage.

**Parameters:**
- `inst` (Entity): The stage entity instance

**Example:**
```lua
fn.enableblackout(inst)
-- All nearby players get blackout effect
```

### disableblackout(inst) {#disableblackout}

**Status:** `stable`

**Description:**
Disables blackout effect for all previously affected players.

**Parameters:**
- `inst` (Entity): The stage entity instance

**Example:**
```lua
fn.disableblackout(inst)
-- Removes blackout effect from all affected players
```

### waxwelldancer(inst, line, cast) {#waxwelldancer}

**Status:** `stable`

**Description:**
Spawns a shadow dancer at a specified position relative to the stage, copying the caster's appearance.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data with `theta` (angle), `radius` (distance), `caster` (character name), and `time` (duration) fields
- `cast` (table): Cast data containing caster reference

**Example:**
```lua
local line = { 
    theta = 0, 
    radius = 2, 
    caster = "waxwell", 
    time = 4.5 
}
fn.waxwelldancer(inst, line, cast)
-- Spawns shadow dancer copying Maxwell's appearance
```

### crowdcomment(inst, line, cast) {#crowdcomment}

**Status:** `stable`

**Description:**
Makes a random nearby audience member from specified prefabs perform a line and animation.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data with `prefabs` (character types), `line` (dialogue), `anim` (animation), and `duration` fields
- `cast` (table): Cast data (used to exclude performing actors)

**Example:**
```lua
local line = { 
    prefabs = {"winona"}, 
    line = "That's interesting!", 
    anim = "emote_cheer",
    duration = 3.0 
}
fn.crowdcomment(inst, line, cast)
-- Random Winona in audience may comment
```

### swapmask(inst, line, cast) {#swapmask}

**Status:** `stable`

**Description:**
Changes the mask and/or body costume of specified actors during performance.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data with `roles` (character list), `mask` (new mask prefab), and `body` (new body prefab) fields
- `cast` (table): Cast data containing actor references

**Example:**
```lua
local line = { 
    roles = {"DOLL"}, 
    mask = "mask_dollbrokenhat" 
}
fn.swapmask(inst, line, cast)
-- Changes DOLL's mask to broken version
```

### findpositions(inst, line, cast) {#findpositions}

**Status:** `stable`

**Description:**
Moves actors to predefined stage positions. Actors with locomotor components walk to positions, others teleport.

**Parameters:**
- `inst` (Entity): The stage entity instance
- `line` (table): Line data with `positions` (character to position mapping) and optional `duration` field
- `cast` (table): Cast data containing actor references

**Example:**
```lua
local line = { 
    positions = {
        ["DOLL"] = 1,    -- Front position
        ["KING"] = 3     -- Right position
    },
    duration = 2.0 
}
fn.findpositions(inst, line, cast)
-- DOLL moves to front, KING moves to right
```

## Stage Positions

The following predefined positions are available for `findpositions`:

| Position | Theta | Radius | Description |
|----------|-------|--------|-------------|
| 1 | -π/4 | 1.5 | Front |
| 2 | 0 | 2.0 | Left |
| 3 | 1.5π | 2.2 | Right |
| 4 | π/2 | 2.0 | Back Left |
| 5 | π | 2.0 | Back Right |
| 6 | -π/4 | 2.3 | Fore |
| 7 | 0 | 0 | Center |
| 8 | (3/4)π | 3.0 | Back |
| 9 | 0 | 2.8 | Left Wide |
| 10 | 1.5π | 2.8 | Right Wide |

## Utility Functions

### isplayercostume(costume) {#isplayercostume}

**Status:** `stable`

**Description:**
Checks if a costume name represents a player character (not bird or narrator).

**Parameters:**
- `costume` (string): The costume name to check

**Returns:**
- (boolean): True if costume is a player character, false if bird or narrator

**Example:**
```lua
local isPlayer = fn.isplayercostume("KING")      -- true
local isBird = fn.isplayercostume("BIRD1")       -- false
local isNarrator = fn.isplayercostume("NARRATOR") -- false
```

## Related Modules

- [Play General Scripts](./play_generalscripts.md): Character-specific performance scripts
- [Play The Doll](./play_the_doll.md): "The Enchanted Doll" play implementation
- [Play The Veil](./play_the_veil.md): "The Veil" play implementation
