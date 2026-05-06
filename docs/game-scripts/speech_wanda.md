---
id: speech_wanda
title: Speech Wanda
description: A static data file providing speech string constants for the character Wanda in Don't Starve Together.
tags: [character, speech, localization, data]
sidebar_position: 10

last_updated: 2026-04-21
build_version: 722832
change_status: data_patched
category_type: root
source_hash: f5527251
system_scope: player
---

# Speech Wanda

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`speech_wanda.lua` is a non-component Lua module containing only static string constants used for Wanda’s character-specific dialogue and announcements. It does not implement logic, event handling, or state management; instead, it serves as a centralized dictionary of localized strings referenced elsewhere in the codebase (e.g., by the character’s Prefab, StateGraphs, or components like `talker`). The file follows DST’s convention of organizing speech by context (e.g., `ANNOUNCE_WANDA_...`, `SPEECH_WANDA_...`) and contains no executable code, constructors, or runtime logic.

## Usage example
```lua
-- Example of referencing Wanda-specific speech in another file (e.g., in a Prefab or StateGraph)
local speech = require "speech_wanda"
inst.components.talker:Say(speech.ANNOUNCE_WANDA_NEW_WAND, nil, nil, nil, "WANDA")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| (none) | — | — | This file contains no runtime properties. |

## Main functions
This file contains no executable functions. It exports only static string constants via the returned Lua table.

## Events & listeners
No events are defined, listened to, or pushed by this file.