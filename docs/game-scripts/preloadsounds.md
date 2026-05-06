---
id: preloadsounds
title: Preloadsounds
description: Defines sound bank file lists and provides functions to preload audio assets through TheSim before gameplay begins.
tags: [audio, preload, assets]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: data_config
source_hash: 07a54afa
system_scope: audio
---

# Preloadsounds

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`preloadsounds.lua` is a utility module that maintains comprehensive lists of sound bank files (`.fsb`) and event files (`.fev`) required for Don't Starve Together audio playback. It organizes sounds into DLC-specific and main game collections, then provides functions to preload these assets through `TheSim:PreloadFile()` to prevent audio loading stutter during gameplay. This file is typically required early in the initialization sequence before sound-dependent systems activate.

## Usage example
```lua
require "preloadsounds"

-- Preload all standard sound banks (called during game initialization)
PreloadSounds()

-- Preload a custom list of sound files
PreloadSoundList({
    "custom_bank.fsb",
    "custom_events.fev",
})
```

## Dependencies & tags
**External dependencies:**
- `dlcsupport` -- provides `IsDLCInstalled()` and DLC constant definitions for conditional sound loading

**Components used:** None identified

**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are exported. Module exposes global functions `PreloadSoundList` and `PreloadSounds` only. `DLCSounds` and `MainSounds` are local implementation details. |

## Main functions
### `PreloadSoundList(list)`
* **Description:** Iterates through a table of sound file paths and preloads each file via `TheSim:PreloadFile()` with the `sound/` prefix. Used internally by `PreloadSounds()` but can be called directly for custom sound lists.
* **Parameters:**
  - `list` -- table of string file paths (e.g., `{"bat.fsb", "common.fev"}`)
* **Returns:** None
* **Error states:** Errors if `list` is nil or contains non-string values (nil concatenation in `"sound/"..v`).

### `PreloadSounds()`
* **Description:** Main entry point that orchestrates all sound preloading. Conditionally loads DLC sounds if Reign of Giants is installed, then loads all main sounds, and finally resolves and preloads the current world's event music bank from global constants.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if global event music tables (`FESTIVAL_EVENT_MUSIC`, `SPECIAL_EVENT_MUSIC`, `DEFAULT_FE_MUSIC`) are not defined when accessed. The function guards DLC loading via `IsDLCInstalled()` check.

## Events & listeners
None.