---
id: preloadsounds
title: Preloadsounds
description: Preloads audio bank files for the Don't Starve Together game at startup, including base game, DLC, and event-specific content.
tags: [audio, startup, assets]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 87adf8e0
system_scope: audio
---

# Preloadsounds

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `preloadsounds.lua` script defines a list of sound banks (`.fsb` and `.fev` files) and provides utility functions to preload them during game initialization using `TheSim:PreloadFile`. It ensures that audio resources—including base game assets, Reign of Giants DLC content, and optional event-specific music—are loaded into memory ahead of time to prevent audio hiccups during gameplay. This script runs early in the startup sequence and is not a component in the Entity Component System.

## Usage example
This file is executed automatically at game startup and is not instantiated as a component. However, modders may call its public function directly to preload additional sound banks:

```lua
local custom_sounds = {
    "my_custom_ambience.fsb",
    "my_custom_music.fev"
}
PreloadSoundList(custom_sounds)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Uses `REIGN_OF_GIANTS` constant and `IsDLCInstalled` from `dlcsupport`; references `FESTIVAL_EVENT_MUSIC`, `SPECIAL_EVENT_MUSIC`, `WORLD_FESTIVAL_EVENT`, and `WORLD_SPECIAL_EVENT` constants defined in `constants.lua`.

## Properties
No public properties.

## Main functions
### `PreloadSoundList(list)`
*   **Description:** Iterates over a list of sound bank filenames and preloads each file under the `"sound/"` directory.
*   **Parameters:** `list` (table) — a list of strings, each representing a filename (e.g., `"music.fsb"`, `"dontstarve.fev"`).
*   **Returns:** Nothing.

### `PreloadSounds()`
*   **Description:** Orchestrates preloading of core and conditional sound banks. First preloads Reign of Giants DLC sounds (if the DLC is installed), then the main sound list, and finally event-specific or frontend music based on active world event constants.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified.