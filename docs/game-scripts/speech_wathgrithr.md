---
id: speech_wathgrithr
title: Speech Wathgrithr
description: Provides dialogue strings used by Wathgrithr’s speech system for specific world events and entities.
tags: [speech, dialogue, player, wathgrithr]
sidebar_position: 10

last_updated: 2026-04-22
build_version: 722832
change_status: data_patched
category_type: root
source_hash: b5d4ceae
system_scope: player

---

# Speech Wathgrithr

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `speech_wathgrithr.lua` file defines a table of dialogue strings specific to the Wathgrithr character. It contains hardcoded string constants used for contextual speech triggers, including responses to natural phenomena (e.g., entering caves, encountering beefalos), structures (e.g., sculptures), and objects (e.g., cracked tallbird eggs). This file does not implement logic, events, or behaviors; it serves solely as a localized speech data source consumed elsewhere in the codebase.

## Usage example
```lua
local speech = require "speech_wathgrithr"
-- Use in speech engine context (e.g., in a speech-related component or logic handler)
if inst:HasTag("cave") then
    local line = speech.CAVE_ENTRANCE
    -- line is then passed to a speaker component for playback
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TURF_*` (keys) | string | varies | Speech lines for Wathgrithr when encountering different turfs (e.g., `TURF_BEEFALO`, `TURF_BIRDS`). |
| `CAVE_ENTRANCE` | string | `"speech.cave_entrance"` | Dialogue line triggered when entering caves. |
| `BEEFALO` | string | `"speech.beefalo"` | Generic beefalo-related line. |
| `SCULPTURE_*` (keys) | string | varies | Lines for interacting with sculptures (e.g., `SCULPTURE_*_OK`, `SCULPTURE_*_ANGER`). |
| `TALLBIRDEGG_CRACKED` | string | `"speech.tallbirdegg_cracked"` | Spoken when a tallbird egg is cracked. |
| Other keys (e.g., `BEEFALO_HAT`, `GAS_TRAP`) | string | varies | Context-specific speech lines for items or events (exact keys depend on full content). |

## Main functions
None.

## Events & listeners
None.