---
id: dynamicmusic
title: Dynamicmusic
description: Manages context-aware background music playback based on player actions, environment, and game state.
tags: [audio, music, environment]
sidebar_position: 10

last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: components
source_hash: 29bc4491
system_scope: audio
---

# Dynamicmusic

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`DynamicMusic` controls adaptive background music playback for player entities. It responds to environmental conditions (season, cave/forest, ruins, lunar island), player activities (working, building, fighting), and special events (boss fights, mini-games, festivals). The component manages multiple music layers including busy themes, danger themes, epic fight music, and triggered event music. It uses the world's focal point sound emitter and listens to numerous player events to determine appropriate audio playback. **Note:** This component has no public methods on `self` — all functionality is event-driven via `PushEvent` calls.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("dynamicmusic")

-- Music is controlled via events, not direct method calls
inst:PushEvent("playeractivated", player)
inst:PushEvent("enabledynamicmusic", true)

-- Trigger specific music themes via events
player:PushEvent("playracemusic")
player:PushEvent("playcarnivalmusic", { is_game_active = true })
player:PushEvent("triggeredevent", { name = "dragonfly", level = 1, duration = 60 })
```

## Dependencies & tags
**External dependencies:**
- `TheFocalPoint.SoundEmitter` -- global sound emitter for music playback
- `TheSim:FindEntities()` -- entity searching for nearby threats and pirates

**Components used:**
- `areaaware` -- checks if player is in specific areas via `CurrentlyInTag()`
- `combat` -- retrieves combat target for danger music detection
- `replica.combat` -- network-replicated combat component for target access
- `replica.follower` -- checks follower relationships for music exclusion

**Tags:**
- `cave` -- checked on inst to determine cave vs forest music
- `Nightmare` -- checked via areaaware for ruins music
- `lunacyarea` -- checked via areaaware for lunar island music
- `epic` -- marks entities that trigger epic fight music
- `noepicmusic` -- excludes entities from triggering epic music
- `prey`, `hostile` -- checked for danger music eligibility
- `attack`, `working` -- checked on player for action-based music
- `crewmember` -- marks pirate entities for pirate music
- `shadow`, `shadowchesspiece`, `smolder`, `thorny`, `nodangermusic` -- exclude from danger triggers
- `feasting` -- checked for feast music activation
- `bird`, `butterfly`, `shadowminion`, `abigail`, `possessedbody`, `smashable`, `wall`, `engineering`, `smoldering`, `veggie` -- various exclusion tags for danger music

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | -- | The entity instance that owns this component (assigned from constructor parameter). |

## Internal State
*These are private local variables, not part of the public API:*
| Variable | Type | Initial Value | Description |
|----------|------|---------------|-------------|
| `_isenabled` | boolean | `true` | Whether dynamic music is currently enabled. |
| `_busytask` | task | `nil` | Scheduled task for busy music timeout. |
| `_dangertask` | task | `nil` | Scheduled task for danger music timeout. |
| `_pirates_near` | task | `nil` | Periodic task for checking nearby pirates. |
| `_triggeredlevel` | number | `nil` | Current level of triggered danger music. |
| `_isday` | boolean | `nil` | Whether the current world phase is day. |
| `_busytheme` | number | `nil` | Current busy music theme identifier. |
| `_extendtime` | number | `nil` | Timestamp for extending music duration (set to `0` in `StartSoundEmitter`). |
| `_soundemitter` | SoundEmitter | `nil` | Reference to the global sound emitter. |
| `_activatedplayer` | entity | `nil` | Currently activated player entity. |
| `_hasinspirationbuff` | number | `nil` | Inspiration buff state (0 or 1). |

## Main functions
### `ShouldPlayDangerMusic(player, target)`
* **Description:** Global function that determines if danger music should play based on target's tags and follower relationship. Returns `false` if target has no combat component, is prey without hostile tag, has exclusion tags (bird, butterfly, shadow, etc.), or is a shadow minion/abigail/possessed body that is not following the player.
* **Parameters:**
  - `player` -- entity instance (the player checking for danger)
  - `target` -- entity instance (the potential threat target)
* **Returns:** boolean -- `true` if danger music should play, `false` otherwise
* **Error states:** Errors if `target.replica.combat` is accessed when `target.replica` is nil (no guard present).

## Events & listeners
**Listens to (on component entity):**
- `playeractivated` -- initializes player listeners and sound emitter for the activated player
- `playerdeactivated` -- removes player listeners and cleans up sound emitter
- `enabledynamicmusic` -- enables or disables dynamic music functionality

**Listens to (on player entity):**
- `buildsuccess` -- extends busy music duration
- `gotnewitem` -- extends busy music duration
- `performaction` -- checks for attack or work actions to trigger appropriate music
- `attacked` -- triggers danger music when attacked by valid threats
- `goinsane` -- plays insanity stinger sound
- `goenlightened` -- plays enlightenment stinger sound
- `triggeredevent` -- starts triggered danger music for boss fights and special events
- `playboatmusic` -- starts ocean sailing music
- `isfeasting` -- starts feast music during winter's feast
- `playracemusic` -- starts Year of the Carrat race music
- `playhermitmusic` -- starts hermit island music
- `playtrainingmusic` -- starts training mini-game music
- `playpiratesmusic` -- starts pirate proximity music system
- `playfarmingmusic` -- starts farming music
- `hasinspirationbuff` -- updates inspiration buff intensity parameter
- `playcarnivalmusic` -- starts summer carnival ambient or mini-game music
- `stageplaymusic` -- starts stage play mood music (happy, mysterious, dramatic, confession)
- `playpillowfightmusic` -- starts Year of the Carrat pillow fight music
- `playrideofthevalkyrie` -- starts Wigfrid's Ride of the Valkyrie music
- `playboatracemusic` -- starts boat race music
- `playbalatromusic` -- starts Balatro mini-game music
- `wx_performedspinaction` -- triggers danger or busy music based on WX-78 spin action

**Watches world state:**
- `phase` -- triggers dawn/dusk stinger sounds on phase changes
- `season` -- resets busy theme on season change for appropriate seasonal music

**Pushes:** None identified