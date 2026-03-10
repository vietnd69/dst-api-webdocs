---
id: emotes
title: Emotes
description: Registers emote commands for players to perform animated and sound-based social gestures.
tags: [social, animation, command]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 6bedf53a
system_scope: ui
---

# Emotes

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This script defines and registers emote commands for players to perform visual and audible social gestures in-game. It centralizes the emote configuration in a static table (`EMOTES`), maps aliases for intuitive invocation (e.g., "hi" → "wave"), and exposes both standard and item-restricted emotes via user commands. Emotes are executed by pushing an `"emote"` event to the local player entity with metadata (e.g., animation names, sounds). The component is self-contained with no external runtime dependencies.

## Usage example
```lua
-- This module is loaded automatically by the game; no manual initialization required.
-- To trigger an emote programmatically (e.g., from another script):
if ThePlayer ~= nil then
    ThePlayer:PushEvent("emote", EMOTES["wave"].data)
end

-- To access the list of all standard emotes:
local commonEmotes = GetCommonEmotes()
print(#commonEmotes) -- e.g., prints total number of emotes defined
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `"dancing"` tag when the `"dance"` emote is used (via `v.data.tags`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `EMOTE_TYPE.EMOTION` | number | `0` | Constant indicating an emotion-based emote (e.g., `wave`, `cry`). |
| `EMOTE_TYPE.ACTION` | number | `1` | Constant indicating an action-based emote (e.g., `dance`, `sit`). |
| `EMOTE_TYPE.UNLOCKABLE` | number | `2` | Reserved for unlockable emotes (currently unused in this file). |

## Main functions
### `GetCommonEmotes()`
* **Description:** Returns the complete `EMOTES` table containing all standard emote definitions.
* **Parameters:** None.
* **Returns:** `table` — A map from emote name (string) to emote definition object (e.g., `EMOTES["wave"]`).

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** `"emote"` — Fired by `CreateEmoteCommand`'s `serverfn` on the local player instance, carrying the emote's `data` table (e.g., `{ anim = "emoteXL_waving1", mounted = true, ... }`) as payload.