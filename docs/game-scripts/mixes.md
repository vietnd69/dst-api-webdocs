---
id: mixes
title: Mixes
description: Registers predefined audio mix configurations with the global mixer system for various game states and events.
tags: [audio, mixer, configuration]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: root
source_hash: 3f5bc10f
system_scope: audio
---

# Mixes

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`mixes.lua` is an initialization script that registers audio mix presets with the global `TheMixer` system. Each mix defines volume levels for different audio buses (ambience, music, voice, SFX, etc.) along with fade time and priority values. These mixes are activated during specific game states such as pausing, death, lobby screens, weather events, and character-specific abilities. The file executes immediately upon load and does not return a value or define a class.

## Usage example
```lua
-- This file auto-executes on load, registering mixes with TheMixer
-- Mix activation (SetMix) is part of the mixer module API, not this file:
-- TheMixer:SetMix("normal")
-- TheMixer:SetMix("death")
-- TheMixer:SetMix("moonstorm")

-- Audio bus paths are defined locally in this file:
-- "set_ambience/ambience", "set_music/soundtrack", "set_sfx/voice", etc.
```

## Dependencies & tags
**External dependencies:**
- `mixer` -- required for mixer module access (local Mixer variable). TheMixer global is provided by the mixer system separately.

**Components used:**
None identified

**Tags:**
None identified

## Properties
| None | | | No properties are defined. |
|------|---|---|-------------------------|

This file is an initialization script that executes side effects (registering mixes) and does not return a table or define a class with properties. The local variables (`amb`, `cloud`, `music`, etc.) are internal implementation details used only within this file.

## Main functions
### `TheMixer:AddNewMix(name, fadetime, priority, levels)`
* **Description:** Registers a new audio mix configuration. Called 17 times in this file with different presets for game states like normal gameplay, pause, death, weather events, and character abilities.
* **Parameters:**
  - `name` -- string identifier for the mix (e.g., `"normal"`, `"death"`, `"moonstorm"`)
  - `fadetime` -- number representing fade transition time in seconds (e.g., `0`, `1`, `2`)
  - `priority` -- number determining mix priority; higher values override lower (e.g., `0` to `2147483647`)
  - `levels` -- table mapping audio bus paths to volume multipliers (`0` to `1`)
* **Returns:** None
* **Error states:** None

## Registered Mixes
| Mix Name | Fade Time | Priority | Key Characteristics |
|----------|-----------|----------|---------------------|
| `normal` | 2 | 1 | Default gameplay mix; all buses active at full or near-full volume. |
| `high` | 2 | 3 | Elevated priority; reduces ambience to `0.2`, boosts cloud to `1`. |
| `start` | 1 | 0 | Initial load mix; HUD reduced to `0.5`. |
| `serverpause` | 0 | 2147483647 | Maximum priority; mutes all buses except HUD (`1`). |
| `pause` | 1 | 4 | Standard pause; most buses muted or reduced, HUD at `0.6`. |
| `death` | 1 | 6 | Death state; music muted, voice/player/HUD at `1`, others at `0.8`. |
| `slurp` | 1 | 1 | Slurp mode; similar to `high` but slurp bus at `1`. |
| `lobby` | 2 | 8 | Lobby screen; only music and HUD active. |
| `moonstorm` | 2 | 8 | Moonstorm weather; ambience at `1`, most others at `0.3`, slurp muted. |
| `minigamescreen` | 1 | 4 | Minigame UI; music at `1`, HUD at `1`, others reduced to `0.3`. |
| `lavaarena_normal` | 0.1 | 1 | Lava Arena event; all buses at full volume. |
| `silence` | 0 | 8 | Near-silence; only music (`0.2`) and sfx (`1`) active. |
| `flying` | 2 | 3 | Flying state; ambience/cloud at `0.4`, player/HUD at `1`. |
| `supernova_charging` | 0.6 | 2 | Celestial Scion charging; music reduced to `0.25`, others full. |
| `supernova` | 0 | 3 | Celestial Scion active; music muted, all others full. |
| `wx_screech` | 0.6 | 4 | WX-78 screech ability; only HUD and slurp active. |

## Events & listeners
None.