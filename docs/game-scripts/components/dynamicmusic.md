---
id: dynamicmusic
title: Dynamicmusic
description: Manages adaptive background music for the player entity based on gameplay context such as location, actions, time of day, season, and nearby events.
tags: [audio, player, environment, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8358ff31
system_scope: audio
---

# Dynamicmusic

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Dynamicmusic` is a player-associated component responsible for dynamically controlling background music playback based on the player’s state, surroundings, and in-game events. It responds to world state changes (day/night, season), player actions (working, attacking), special conditions (inspiration buff, sanity effects), and triggered events (boss fights, races, feasting). It leverages the `AreaAware` component to detect zone tags (e.g., `"Nightmare"`, `"lunacyarea"`) and integrates with the global sound emitter (`TheFocalPoint.SoundEmitter`) for real-time audio parameter control. This component ensures contextual, immersive audio without overlapping or conflicting music layers.

## Usage example
```lua
local inst = ThePlayer
if not inst.components.dynamicmusic then
    inst:AddComponent("dynamicmusic")
end

-- Enable music dynamics (enabled by default)
inst:PushEvent("enabledynamicmusic", { enable = true })

-- Trigger a boss fight theme (e.g., for "malbatross")
inst:PushEvent("triggeredevent", { name = "malbatross", duration = 30 })

-- Start Carnival minigame music
inst:PushEvent("playcarnivalmusic", { is_game_active = true })
```

## Dependencies & tags
**Components used:** `areaaware` (for zone detection via `CurrentlyInTag`)
**Tags:** None added/removed directly by this component; it only checks player tags (`"attack"`, `"working"`, `"noepicmusic"`, `"shadow"`, `"shadowchesspiece"`, `"smolder"`, `"thorny"`, `"nodangermusic"`) and entity tags via `HasTag`/`HasAnyTag`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity that owns this component (typically a player). |
| `_iscave` | boolean | `false` | Set if the owning entity has the `"cave"` tag. Affects music selection (e.g., cave vs. surface themes). |
| `_isenabled` | boolean | `true` | Enables/disables music playback globally; controlled via the `"enabledynamicmusic"` event. |
| `_busytheme` | number \| nil | `nil` | Current active "busy" theme index (from `BUSYTHEMES` table). Tracks which ambient/work theme is playing. |
| `_dangertask` | GTimer \| nil | `nil` | Timer handle for danger music timeout (auto-stops after 10s unless extended). |
| `_busytask` | GTimer \| nil | `nil` | Timer handle for busy theme timeout (default: 15s; varies by context). |
| `_extendtime` | number \| nil | `0` | Timestamp until which current music should be extended (used to prevent immediate re-triggering). |
| `_pirates_near` | periodic task \| nil | `nil` | Periodic task running when Pirates minigame is active, checking for nearby crew members. |
| `_triggeredlevel` | number \| nil | `nil` | Tracks the intensity level of the currently playing triggered danger music. |
| `_activatedplayer` | Entity \| nil | `nil` | Cached reference to the currently active player entity. Used to attach/detach event listeners. |
| `_hasinspirationbuff` | number | `0` | Binary flag (`0` or `1`) indicating presence of Wathgrithr’s inspiration buff; affects danger music intensity. |

## Main functions
### `StartBusyTheme(player, theme, sound, duration, extendtime)`
* **Description:** Starts or extends a "busy" ambient/work theme. Used for multiple special contexts (farming, carnival, stageplay, etc.). Prevents overlapping themes unless a higher-priority one is explicitly triggered. Extends existing theme duration if it is active and matches the requested theme.
* **Parameters:**
  * `player` (Entity) — The player entity to check conditions against (e.g., location, tags).
  * `theme` (number) — `BUSYTHEMES` constant identifying the theme type (e.g., `BUSYTHEMES.FARMING`).
  * `sound` (string) — Sound path for the music asset.
  * `duration` (number) — Time in seconds before the theme times out (unless extended).
  * `extendtime` (number, optional) — Optional extension timestamp (defaults to `0`).
* **Returns:** Nothing.
* **Error states:** Returns early if `_dangertask`, `_pirates_near`, or `_isenabled` prevents playback; also skips if theme matches current theme and time hasn’t expired.

### `StartDanger(player)`
* **Description:** Activates danger music (epic or standard) based on proximity to high-threat entities (`"epic"` tag, excluding `"noepicmusic"`), cave/season logic, and world zone tags (`"Nightmare"`). Stops any active busy theme first.
* **Parameters:**
  * `player` (Entity) — The player entity performing the search for nearby threats.
* **Returns:** Nothing.
* **Error states:** Early return if `_dangertask` is already active (just extends duration); no effect if `_isenabled` is `false`.

### `StartTriggeredDanger(player, data)`
* **Description:** Plays a custom danger theme triggered by a named event (e.g., `"malbatross"`, `"wagstaff_experiment"`). Supports multiple intensities/levels via the `data.level` field. Overrides standard danger logic.
* **Parameters:**
  * `player` (Entity) — The player entity (not directly used, but required for signature consistency).
  * `data` (table, optional) — Event payload with `name` (string) and optional `level` (number) and `duration` (number).
* **Returns:** Nothing.
* **Error states:** Returns early if same level is already active (just extends); skips if `_isenabled` is `false` or music asset string is empty.

### `UpdatePirates(player)`
* **Description:** Periodic function run while Pirates music is active. Calculates proximity-based intensity for pirate warning music, sets volume, and stops the busy theme if pirates are near.
* **Parameters:**
  * `player` (Entity) — Player used for position and entity search.
* **Returns:** Nothing.

### `OnPlayerActivated(inst, player)`
* **Description:** Cleanup and re-initialization when a new player becomes active. Stops listeners and sound on the previous player, then sets up listeners and sound emitter for the new player.
* **Parameters:**
  * `inst` (Entity) — The entity owning this component (the world controller).
  * `player` (Entity) — The newly activated player.
* **Returns:** Nothing.

### `OnEnableDynamicMusic(inst, enable)`
* **Description:** Global toggle for dynamic music playback. Can disable/enable music even if player is active. On disable, immediately kills all active sounds and cancels pending tasks.
* **Parameters:**
  * `inst` (Entity) — The entity owning this component.
  * `enable` (boolean) — Whether to enable dynamic music.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"playeractivated"` — Triggered when a new player becomes active; switches context to the new player.
  - `"playerdeactivated"` — Triggered when a player is deactivated; cleans up listeners and sounds.
  - `"enabledynamicmusic"` — Enables or disables all dynamic music behavior.
  - `"buildsuccess"` — Extends or starts busy theme (working).
  - `"gotnewitem"` — Extends current busy theme.
  - `"performaction"` — Checks for attack/working state and triggers danger/busy accordingly.
  - `"attacked"` — Triggers danger music on valid attacks from non-exempt enemies.
  - `"goinsane"` — Plays sanity stinger and delays busy/danger music briefly.
  - `"goenlightened"` — Plays lunacy stinger and delays busy/danger music briefly.
  - `"triggeredevent"` — Plays custom danger theme for named events (bosses, minigames).
  - `"playboatmusic"` — Starts ocean-themed music if player is on a platform.
  - `"isfeasting"` — Starts feasting theme if player has `"feasting"` state tag.
  - `"playracemusic"` — Starts racing theme.
  - `"playhermitmusic"` — Starts hermit theme.
  - `"playtrainingmusic"` — Starts training theme.
  - `"playpiratesmusic"` — Starts pirate warning music loop.
  - `"playfarmingmusic"` — Starts farming theme.
  - `"hasinspirationbuff"` — Updates inspiration buff flag for Wathgrithr intensity scaling.
  - `"playcarnivalmusic"` — Starts carnival ambient or minigame theme.
  - `"stageplaymusic"` — Starts stageplay mood-based music.
  - `"playpillowfightmusic"` — Starts pillow fight theme.
  - `"playrideofthevalkyrie"` — Starts Ride of the Valkyries theme.
  - `"playboatracemusic"` — Starts boat race theme.
  - `"playbalatromusic"` — Starts Balatro theme.
- **Pushes:** None — this component only responds to events and controls audio parameters silently.
