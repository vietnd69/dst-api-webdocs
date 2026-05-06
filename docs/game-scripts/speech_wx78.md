---
id: speech_wx78
title: Speech Wx78
description: Provides static speech data and localization strings for the Wx78 character across various DST content and entities.
tags: [audio, speech, data, character, localization]
sidebar_position: 10

last_updated: 2026-04-21
build_version: 722832
change_status: data_patched
category_type: root
source_hash: b0493954
system_scope: audio
---

# Speech Wx78

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The speech_wx78.lua file is a data-only module containing pre-defined speech dictionaries and entity-to-line mappings for the Wx78 character. It is not a traditional ECS component (no constructor, functions, events, or dependencies) but rather a static configuration table used by the game's speech system to route character-specific dialogue for entities, items, locations, and contexts (e.g., Quagmire, Moon, Lava Arena). The file defines fallback speech to speech_wilson.lua where appropriate and includes character-specific overrides (e.g., `--v2 Winona`, `--Walter`) in many entries.

## Usage example
This module is not intended for direct instantiation or method invocation. It is loaded and consumed internally by the game’s speech infrastructure (e.g., via `speech.lua` and `speech_wx78` data table usage in speech routing logic). A typical internal usage pattern would resemble:

```lua
-- This is illustrative, not a call site from the source
local speech_data = require("speech_wx78")
local line = speech_data.ENTITIES[ TheWorld.prefabs["acorn"] ]
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ENTITIES` | table | `nil` | Maps entity prefab names (e.g., `"acorn"`, `"deciduoustree"`) to speech line keys or strings used by Wx78 when interacting with or commenting on those entities. |
| `ITEMS` | table | `nil` | Maps itemprefab names to Wx78 dialogue lines. Includes fallback entries referencing `speech_wilson.lua`. |
| `LOCATIONS` | table | `nil` | Maps map location or zone identifiers to context-specific lines (e.g., `"cave"`, `"lavaarena"`, `"moon"`, `"quagmire"`). |
| `QUAGMIRE` | table | `nil` | Dedicated Quagmire-themed speech entries (e.g., `"boglord"`, `"mireheart"`), some marked `--unimplemented`. |
| `LAVAARENA` | table | `nil` | Lava Arena-specific speech lines (e.g., `"lavaarena"`, `"lavaarena_arena"`). |
| `MOON` | table | `nil` | Moon content speech (e.g., `"moonbase"`, `"moonrock"`), often marked as `--v3 Winona`. |
| `SEA` | table | `nil` | Seafaring-related lines (e.g., `"shipwrecked"`, `"boat"`). |
| `NPC` | table | `nil` | NPC-specific dialogue (e.g., `"wx78"`, `"wx78_drill"`), with some referencing other characters like `"wx78"` for self-reference. |
| `DIALOGUE` | table | `nil` | General-purpose contextual speech (e.g., `"talkingto"`, `"greeting"`, `"idle"`). |

> Note: All tables above are data dictionaries. Actual keys and values are populated in-chunk data (e.g., `ACORN = "speech_acorn"` or `"someDialogueKey"`) but not exposed as standalone functions or runtime-editable properties.

## Main functions
None

## Events & listeners
None